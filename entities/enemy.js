// General object for all enemies
function Enemy(game, row, col, attackD, stayD, followD) {
	Entity.call(this, game, row, col, 15);

	this.target = game.player;
	this.pathToTarget = null;

	this.timeSinceLastPath = 0;

	// The distances at which the enemy attacks the player, stays still or follows the player without a path
    this.attackD = attackD;
    this.stayD = stayD;
    this.followD = followD;

}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.update = function() {
	this.timeSinceLastPath += this.game.gameSpeed;

    if (d < this.stayD || d < this.followD) {
        this.pathToTarget = null;
        if (d > this.stayD) {
			// Move towards the player
            this.moveTowards(this.target.pos);
        } else if (d > this.followD) {
			// Stay still
            this.moveTowards(this.pos);
        } else if (this.followD < this.stayD) {
            this.moveTowards(this.target.pos);
        } else {
            this.moveTowards(this.pos);
        }
    } else if (this.pathToTarget === null) {
        this.calculatePath();
    }

    if (this.pathToTarget !== null) {
		// Refreshes the path every second
        if (this.timeSinceLastPath > 60 || this.pathToTarget.length == 0) {
			this.calculatePath();
		}

		// If it is blocked by a wall, attack the wall (to break it)
		if (this.pathToTarget[0].wall > 0) {
			this.attack(this.pathToTarget[0]);
		}

		// If the enemy has reached the current cell of the path
        if (p5.Vector.dist(this.pos, this.pathToTarget[0].middle()) < this.r + CELLSIZE * 0.4) {
            this.pathToTarget.splice(0, 1);
			// If the next cell in the path is not a wall, it can travel straight to the next cell after that without being blocked
			// Therefore the cell is removed from the path
            if (this.pathToTarget.length > 1 && this.pathToTarget[0].wall == 0) {
                this.pathToTarget.splice(0, 1);
            }
        }

        if (this.pathToTarget.length > 0) {
			// Follow the path
			this.moveTowards(this.pathToTarget[0].middle());
        }

		var d = p5.Vector.dist(this.pos, this.target.pos);
	    if (d < this.attackD) {
			// Attack the player
	    	this.attack(this.target);
	    }
    }

	// Each enemy has specific attributes and weapons to update
    this.specificUpdate();
}

// Calculates a path
Enemy.prototype.calculatePath = function() {
	this.pathToTarget = findPath(this.game.grid.grid, this.game.grid.getCell(this.pos), this.game.grid.getCell(this.target.pos), this);
	this.timeSinceLastPath = 0;
}

// Uses steering to move towards a p5.Vector position
Enemy.prototype.moveTowards = function(pos) {
	var vectorToTarget = p5.Vector.sub(pos, this.pos);
	vectorToTarget.normalize();
	vectorToTarget.mult(this.maxVel);
	vectorToTarget.sub(this.vel);
	vectorToTarget.limit(this.maxForce);
	this.acc.add(vectorToTarget);
}

// When the enemy dies
Enemy.prototype.die = function(bullet) {
	var myCell = this.game.grid.getCell(this.pos);
	var playerCell = this.game.grid.getCell(this.game.player.pos);
	if (myCell !== playerCell && bullet instanceof Bullet) {
		// Create a wall if the player is not in the same cell (so the player doesn't get stuck in the wall)
		myCell.build();
	}

	this.dead = true;
	this.game.particleExplosion(this.pos, bullet.vel.mag() * 0.5, 50, bullet.vel.heading(), HALF_PI * 0.75, createVector(0, 0.1), 20, 1, 45, 3, color(200, 60, 60));

	this.game.enemyDeath(this);
}
