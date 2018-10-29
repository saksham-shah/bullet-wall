function Minion(game, row, col) {
    Entity.call(this, game, row, col, 10, 1);

    this.target = game.player;
	this.pathToTarget = null;

    this.maxVel = 3.5;
	this.maxForce = 0.5;

    this.direction = 0;

	this.hitSpeed = 30;
	this.wallDestroy = 20;

    this.cooldown = 0;
    this.state = 0;

    this.hammerRotation = HALF_PI;
    this.relativePos = createVector(this.r * 1.5, 0).rotate(this.vel.heading() + this.hammerRotation);
    this.hammerPos = this.pos.copy().add(this.relativePos);
    this.damageDealt = false;

    // this.life = 0;
    this.pathNoise = random(100);
}

Minion.prototype = Object.create(Entity.prototype);

Minion.prototype.update = function() {
    this.cooldown -= this.game.gameSpeed;

    this.direction = this.vel.heading();

    var d = p5.Vector.dist(this.pos, this.target.pos);
    if (this.pathToTarget !== null) {
        this.followPath();
    } else {
        this.calculatePath();
    }

    if (!(this.target instanceof Player)) {
        var d = p5.Vector.dist(this.pos, this.target.pos);
        if (d < this.r * 2 + this.target.r || this.checkForEnemies()) {
            this.attack();
        }

        if (this.target.dead) {
            this.target = this.retarget();
        }
    } else {
        this.target = this.retarget();
    }

    // If state is 1, the hammer is being swung
	// If state is 2, the hammer is being retracted
    if (this.state == 1) {
        if (this.hammerRotation < 0) {
            this.state = 2;
        } else {
            this.hammerRotation -= 0.1 * this.game.gameSpeed;
        }
    } else if (this.state == 2) {
        if (this.hammerRotation > HALF_PI) {
            this.hammerRotation = HALF_PI;
            this.state = 0;
        } else {
            this.hammerRotation += 0.1 * this.game.gameSpeed;
        }
    }

    this.relativePos = createVector(this.r * 1.5, - this.r * 0.75).rotate(this.vel.heading() + this.hammerRotation);
    this.hammerPos = this.pos.copy().add(this.relativePos);

    // Only hurts walls if state is 1 - this prevents them from being damaged every frame
	if (this.state == 1 && !this.damageDealt) {
		var weaponCell = this.game.grid.getCell(this.hammerPos);
		if (weaponCell !== null && weaponCell.wall > 0) {
			weaponCell.break(this.vel.heading());
			// Retract weapon once the damage has been dealt
			this.damageDealt = true;
		}

        this.checkWeaponHits();
    }
}

Minion.prototype.checkWeaponHits = function() {
    for (var i = 0; i < this.game.entities.length; i++) {
        // Only damages enemies
        if (this.game.entities[i] instanceof Enemy) {
            var d = p5.Vector.dist(this.hammerPos, this.game.entities[i].pos);
            if (d < this.game.entities[i].r) {
                this.game.entities[i].damage(1, this);
                this.damageDealt = true;
            }
        }
    }
}

Minion.prototype.retarget = function() {
    var closestD = 10000000;
    var closest = this.game.player;
    for (var i = 1; i < this.game.entities.length; i++) {
        if (this.game.entities[i] instanceof Enemy) {
            var d = p5.Vector.dist(this.pos, this.game.entities[i].pos);
            if (d < closestD) {
                closestD = d;
                closest = this.game.entities[i];
            }
        }
    }
    return closest;
}

Minion.prototype.checkForEnemies = function() {
    var pos = this.pos.copy().add(createVector(this.r * 1.5, 0).rotate(this.vel.heading() + this.hammerRotation * 0.5));
    for (var i = 1; i < this.game.entities.length; i++) {
        if (this.game.entities[i] instanceof Enemy) {
            var d = p5.Vector.dist(pos, this.game.entities[i].pos);
            if (d < this.game.entities[i].r) {
                return true;
            }
        }
    }
    return false;

}

// The attack is simply the hammer swinging
Minion.prototype.attack = function() {
	if (this.cooldown < 0) {
		this.state = 1;
		this.cooldown = this.hitSpeed;
        this.damageDealt = false;
	}
}

Minion.prototype.customPathfinding = function(a, b) {
    var av = createVector(a.row, a.col);
    var bv = createVector(b.row, b.col);
    var d = p5.Vector.dist(a.pos, b.pos);
    if (b.wall == 0) {
        return d * 0.1;
    }
    d = d / this.maxVel - (3 - b.wall) * this.wallDestroy;
    return d;
}

Minion.prototype.die = function() {
    this.dead = true;
    this.game.particleExplosion(this.pos, 2, 50, 0, PI, createVector(0, 0.1), 20, 1, 45, 3, ["entity", "minion"]);
}

Minion.prototype.specificDraw = function() {
	fill(200, 200, 250);
	stroke(160, 160, 200);
    strokeWeight(2 * zoom);

	ellipse(0, 0, this.r * zoom * 2);
}

function drawMinion(z, params) {
    fill(theme.entity.minion[0] * theme.mult, theme.entity.minion[1] * theme.mult, theme.entity.minion[2] * theme.mult);
    stroke(theme.entity.minion);
    strokeWeight(2 * z);

	ellipse(0, 0, params.r * z * 2);
}

// Draws a hammer
Minion.prototype.drawWeapon = function() {
	var drawPos = getDrawPos(this.pos);
	push();
	translate(drawPos);
	rotate(this.direction + this.hammerRotation + HALF_PI);

    fill(50, 50, 125);
    stroke(40, 40, 100);
	strokeWeight(2 * zoom);

	beginShape();

    vertex(- this.r * 0.3 * zoom, 0);
    vertex(- this.r * 0.3 * zoom, - this.r * 1.25 * zoom);
    vertex(- this.r * 1 * zoom, - this.r * 1.25 * zoom);
    vertex(- this.r * 1 * zoom, - this.r * 2 * zoom);
    vertex(this.r * 1 * zoom, - this.r * 2 * zoom);
    vertex(this.r * 1 * zoom, - this.r * 1.25 * zoom);
    vertex(this.r * 0.3 * zoom, - this.r * 1.25 * zoom);
    vertex(this.r * 0.3 * zoom, 0);
    vertex(- this.r * 0.3 * zoom, 0);

	endShape();

	pop()
}

function drawMinionWeapon(z, params) {
    var drawPos = p5.Vector.mult(createVector(params.x, params.y), z);
	push();
	translate(drawPos);
	rotate(params.direction + params.hammerRotation + HALF_PI);

    fill(theme.weapon.hammer[0] * 1.25, theme.weapon.hammer[1] * 1.25, theme.weapon.hammer[2] * 1.25);
	stroke(theme.weapon.hammer);
	strokeWeight(2 * z);

	beginShape();

    vertex(- params.r * 0.3 * z, 0);
    vertex(- params.r * 0.3 * z, - params.r * 1.25 * z);
    vertex(- params.r * 1 * z, - params.r * 1.25 * z);
    vertex(- params.r * 1 * z, - params.r * 2 * z);
    vertex(params.r * 1 * z, - params.r * 2 * z);
    vertex(params.r * 1 * z, - params.r * 1.25 * z);
    vertex(params.r * 0.3 * z, - params.r * 1.25 * z);
    vertex(params.r * 0.3 * z, 0);
    vertex(- params.r * 0.3 * z, 0);

	endShape();

	pop()
}

Minion.prototype.convertToSnap = function() {
	return {
        type: 1,
		x: this.pos.x,
		y: this.pos.y,
		r: this.r,
        health: this.health,
        damaged: this.damaged,
		direction: this.direction,
        hammerRotation: this.hammerRotation
	}
}
