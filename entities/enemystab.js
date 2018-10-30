// Fast enemy with a sword-like melee weapon
function EnemyStab(game, row, col) {
	Enemy.call(this, game, row, col, 1, 60, 0, CELLSIZE);

	this.maxVel = 3;
	this.maxForce = 0.15;

	this.hitSpeed = 60;
	this.wallDestroy = 60;

	this.weaponPos = createVector(0, 0);
	// How extended the 'sword' weapon is
	this.weaponExtend = 5;

	this.cooldown = 0;
	this.state = 0;

	this.direction = 0;

	this.scoreValue = 10;
}

EnemyStab.prototype = Object.create(Enemy.prototype);

EnemyStab.prototype.specificUpdate = function() {
	this.cooldown -= this.game.gameSpeed;

	this.direction = this.vel.heading();

	// If state is 1, the weapon is being extended
	// If state is 2, the weapon is being retracted
    if (this.state == 1) {
        if (this.weaponExtend > 30) {
            this.state = 2;
        } else {
            this.weaponExtend += 2 * this.game.gameSpeed;
        }
    } else if (this.state == 2) {
        if (this.weaponExtend < 5) {
            this.weaponExtend = 5;
            this.state = 0;
        } else {
            this.weaponExtend -= 1 * this.game.gameSpeed;
        }
    }

	this.weaponPos = this.pos.copy().add(createVector(this.weaponExtend, 0).rotate(this.vel.heading()));

	// Only hurts the player or walls if state is 1 - this prevents these objects from being damaged every frame
	if (this.state == 1) {
		var weaponCell = this.game.grid.getCell(this.weaponPos);
		if (weaponCell !== null && weaponCell.wall > 0) {
			weaponCell.break(this.vel.heading());
			// Retract weapon once the damage has been dealt
			this.state = 2;
		}

		this.checkWeaponHits();
	}
}

// The attack is simply the weapon extending
EnemyStab.prototype.attack = function() {
	if (this.cooldown < 0) {
		this.state = 1;
		this.cooldown = this.hitSpeed;
	}
}

EnemyStab.prototype.checkWeaponHits = function() {
    for (var i = 0; i < this.game.entities.length; i++) {
        // Doesn't damage other enemies
        if (!(this.game.entities[i] instanceof Enemy)) {
            var d = p5.Vector.dist(this.weaponPos, this.game.entities[i].pos);
            if (d < this.game.entities[i].r) {
                this.game.entities[i].damage(1, this);
				this.state = 2;
            }
        }
    }
}

EnemyStab.prototype.specificDraw = function() {
    push();
	rotate(this.direction);

	fill(250, 75, 75);
	stroke(200, 60, 60);
    strokeWeight(2 * zoom);

	ellipse(0, 0, this.r * zoom * 2);

    pop();
}

function drawEnemyStab(z, params) {
	push();
	rotate(params.direction);

	fill(theme.entity.enemy[0] * theme.mult, theme.entity.enemy[1] * theme.mult, theme.entity.enemy[2] * theme.mult);
	stroke(theme.entity.enemy);
    strokeWeight(2 * z);

	ellipse(0, 0, params.r * z * 2);

    pop();
}

// Draws a triangle representing a sword-type weapon
EnemyStab.prototype.drawWeapon = function() {
	var drawPos = getDrawPos(this.pos);
	push();
	translate(drawPos);
	rotate(this.vel.heading());

	fill(1.25 * (100 + this.weaponExtend * 3), 50, 50);
	stroke(100 + this.weaponExtend * 3, 50, 50);
	strokeWeight(2 * zoom);

	beginShape();
	vertex(this.weaponExtend * this.r * zoom / 15, 0);
	vertex(0, 5 * this.r * zoom / 15);
	vertex(0, -5 * this.r * zoom / 15);
	vertex(this.weaponExtend * this.r * zoom / 15, 0);
	endShape();

	pop()
}

function drawEnemyStabWeapon(z, params) {
	var drawPos = p5.Vector.mult(createVector(params.x, params.y), z);
	push();
	translate(drawPos);
	rotate(params.direction);

	var c = lerpColor(color(theme.weapon.stab1), color(theme.weapon.stab2), (params.weaponExtend - 5) * 0.04);

	// fill(1.25 * theme.weapon.stab[0] * (1 + params.weaponExtend * 0.03), theme.weapon.stab[2], theme.weapon.stab[2]);
	// stroke(theme.weapon.stab[0] * (1 + params.weaponExtend * 0.03), theme.weapon.stab[1], theme.weapon.stab[2]);

	stroke(c);
	fill(red(c) * theme.mult, green(c) * theme.mult, blue(c) * theme.mult);
	strokeWeight(2 * z);

	beginShape();
	vertex(params.weaponExtend * params.r * z / 15, 0);
	vertex(0, 5 * params.r * z / 15);
	vertex(0, -5 * params.r * z / 15);
	vertex(params.weaponExtend * params.r * z / 15, 0);
	endShape();

	pop()
}

EnemyStab.prototype.convertToSnap = function() {
	return {
        type: 2,
		x: this.pos.x,
		y: this.pos.y,
		r: this.r,
        health: this.health,
        damaged: this.damaged,
		direction: this.direction,
		weaponExtend: this.weaponExtend
	}
}
