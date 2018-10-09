// Charging enemy
function EnemyBull(game, row, col) {
	Enemy.call(this, game, row, col, 3, CELLSIZE * 4, 0, CELLSIZE);

	this.maxVel = 2;
	this.maxForce = 0.1;

	this.hitSpeed = 270;
	this.wallDestroy = 180;

	this.cooldown = 60;
	this.state = 0;
    this.playerDamaged = false;

	this.scoreValue = 30;

	this.direction = 0;
	this.targetDirection = 0;

	this.lastSmoke = 0;

}

EnemyBull.prototype = Object.create(Enemy.prototype);

EnemyBull.prototype.specificUpdate = function() {
	this.cooldown -= this.game.gameSpeed;

    // If state is 1, it's preparing to charge
	// If state is 2, it's charging

    if (this.state == 0) {
		// Normal chasing the player
        this.maxVel = 2;
        this.maxForce = 0.1;
        this.mass = 10;

        this.direction = this.vel.heading();
    } else {
        this.acc.mult(0);

		// When charging, the bull travels much faster and cannot be pushed off its path
        this.mass = 200;
        this.maxForce = 0.2;
        this.maxVel = 5;

        this.checkWallHit();

		// Creates smoke from its horns
		this.lastSmoke += this.game.gameSpeed;

		while (this.lastSmoke > 0.9) {
			this.lastSmoke --;
		    if (random() < 0.25) {
		        var pos = this.pos.copy().add(p5.Vector.fromAngle(this.direction - HALF_PI * 0.5).setMag(1.7 * this.r));
		        this.game.particles.push(new SmokeParticle(this.game, pos, p5.Vector.fromAngle(this.direction - HALF_PI * random(0.4, 0.6)).setMag(2), createVector(0, 0), 15, 45, color(200)));
		    }

		    if (random() < 0.25) {
		        var pos = this.pos.copy().add(p5.Vector.fromAngle(this.direction + HALF_PI * 0.5).setMag(1.7 * this.r));
		        this.game.particles.push(new SmokeParticle(this.game, pos, p5.Vector.fromAngle(this.direction + HALF_PI * random(0.4, 0.6)).setMag(2), createVector(0, 0), 15, 45, color(200)));
		    }
		}

        if (this.state == 1) {
            this.targetDirection = p5.Vector.sub(this.target.pos, this.pos).heading();

			// The bull will rotate towards the player smoothly
			this.direction = rotateToAngle(this.direction, this.targetDirection, 0.3, 0.15);

            if (this.cooldown < 240) {
                this.state = 2;
                this.playerDamaged = false;
            }

            this.moveTowards(this.pos);
        } else {
            this.acc.add(p5.Vector.fromAngle(this.direction).setMag(this.maxForce));

            var d = p5.Vector.dist(this.pos, this.game.player.pos);
    		if (d <= this.game.player.r + this.r && this.playerDamaged !== true) {
    			this.game.player.damage(1, this);
				// The bull can only damage the player once per charge
    			this.playerDamaged = true;
    		}

            if (this.cooldown < 180) {
                this.state = 0;
            }
        }
    }
}

// Breaks walls while charing
EnemyBull.prototype.checkWallHit = function() {
    var futurePos = p5.Vector.add(this.pos, p5.Vector.mult(this.vel, this.game.gameSpeed));
    var wallCollision = collideWithWalls(futurePos, this.r, this.game.grid);
    if (wallCollision[0].x != futurePos.x || wallCollision[0].y != futurePos.y) {
        if (wallCollision[1] !== null) {
            if (wallCollision[1].wall > 0) {
                wallCollision[1].break(this.vel.heading(), true);
            }
        }
    }
}

// The attack is simply the bull's state being set to 1 - i.e. preparing to charge
EnemyBull.prototype.attack = function() {
	if (this.cooldown < 0) {
		this.state = 1;
		this.cooldown = this.hitSpeed;
	}
}

EnemyBull.prototype.specificDraw = function() {
    push();
	rotate(this.direction);

    // Bull horns
    fill(115 * 1.25, 50, 50);
	stroke(115, 50, 50);
	strokeWeight(2 * zoom);

    push();
    rotate(HALF_PI * 0.5);

    beginShape();
    vertex(this.r * zoom * 0.9, this.r * zoom * 0.4);
    vertex(this.r * zoom * 0.9, this.r * zoom * -0.4);
    vertex(this.r * zoom * 1.8, 0);
    vertex(this.r * zoom * 0.9, this.r * zoom * 0.4);
    endShape();

    rotate(- HALF_PI);

    beginShape();
    vertex(this.r * zoom * 0.9, this.r * zoom * 0.4);
    vertex(this.r * zoom * 0.9, this.r * zoom * -0.4);
    vertex(this.r * zoom * 1.8, 0);
    vertex(this.r * zoom * 0.9, this.r * zoom * 0.4);
    endShape();

    pop();

    fill(250, 75, 75);
	stroke(200, 60, 60);
    strokeWeight(2 * zoom);

	ellipse(0, 0, this.r * zoom * 2);

    pop();
}
