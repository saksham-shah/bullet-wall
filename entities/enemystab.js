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

	this.scoreValue = 10;
}

EnemyStab.prototype = Object.create(Enemy.prototype);

EnemyStab.prototype.specificUpdate = function() {
	this.cooldown -= this.game.gameSpeed;

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

		var d = p5.Vector.dist(this.weaponPos, this.game.player.pos);
		if (d < this.game.player.r) {
			this.game.player.damage(1, this);
			this.state = 2;
		}
	}
}

// The attack is simply the weapon extending
EnemyStab.prototype.attack = function() {
	if (this.cooldown < 0) {
		this.state = 1;
		this.cooldown = this.hitSpeed;
	}
}

EnemyStab.prototype.specificDraw = function() {
    push();
	rotate(this.vel.heading());

	fill(250, 75, 75);
	stroke(200, 60, 60);
    strokeWeight(2 * zoom);

	ellipse(0, 0, this.r * zoom * 2);

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
