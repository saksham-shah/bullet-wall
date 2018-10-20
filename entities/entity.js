// General object for all objects in the game that can be damaged
function Entity(game_, row, col, r_, health_) {
    this.game = game_;

    var x = (col + 0.5) * CELLSIZE;
	var y = (row + 0.5) * CELLSIZE;
	this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

	this.r = r_;

    this.dead = false;

    // How easily the entity is pushed around
    this.mass = 10;

    if (health_ === undefined) {
        this.health = 1;
    } else {
        this.health = health_;
    }
    this.damaged = 0;

    this.hide = false;
    this.freeze = false;

    this.lastPrint = 0;
    this.foot = 1;
}

// Moves using pos, vel, acc system
Entity.prototype.move = function(entities) {
    this.acc.mult(0);
    if (this.update !== undefined && !this.freeze) {
        this.update();
    }
    this.damaged -= this.game.gameSpeed;

	this.pos.add(p5.Vector.mult(this.vel, this.game.gameSpeed));
    this.vel.add(p5.Vector.mult(this.acc, this.game.gameSpeed));
    this.vel.limit(this.maxVel);
    this.checkCollisions(entities);

    // Leaves behind footprints
    if (this.lastPrint > 20 / this.maxVel && this.vel.mag() > 0) {
        this.lastPrint = 0;

        var relativePos = createVector(0, this.foot * this.r * 0.5).rotate(this.vel.heading());
        var printPos = this.pos.copy().add(relativePos);

        this.game.markings.push(new Footprint(this.game, printPos, this.vel.heading(), this.r / 15 * 4));

        // Alternating feet
        this.foot *= -1
    } else {
        this.lastPrint += this.game.gameSpeed;
    }
}

// Collides with walls and other entities
Entity.prototype.checkCollisions = function(all) {
	for (var i = 0; i < all.length; i++) {
		if (this !== all[i]) {
            var newPos = collideWithPoint(this.pos, all[i].pos, this.r + all[i].r, all[i].mass / (this.mass + all[i].mass));
            this.pos.x = newPos.x;
            this.pos.y = newPos.y;
		}
	}

    var newPos = collideWithWalls(this.pos, this.r, this.game.grid)[0];
    this.pos.x = newPos.x;
    this.pos.y = newPos.y;
}

// Calculates a path
Entity.prototype.calculatePath = function() {
	this.pathToTarget = findPath(this.game.grid.grid, this.game.grid.getCell(this.pos), this.game.grid.getCell(this.target.pos), this);
	this.timeSinceLastPath = 0;
}

// Uses steering to move towards a p5.Vector position
Entity.prototype.moveTowards = function(pos) {
	var vectorToTarget = p5.Vector.sub(pos, this.pos);
	vectorToTarget.normalize();
	vectorToTarget.mult(this.maxVel);
	vectorToTarget.sub(this.vel);
	vectorToTarget.limit(this.maxForce);
	this.acc.add(vectorToTarget);
}

// Follows a path
Entity.prototype.followPath = function() {
    if (this.pathToTarget !== null) {
        this.timeSinceLastPath += this.game.gameSpeed;
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
    }
}

// Takes damage
Entity.prototype.damage = function(num, cause) {
    if (this.shield === true) {
        this.shield = false;
        this.shieldTimer = 180;
        this.shieldRecharge = 3600;
    } else if (this.shieldTimer === undefined || this.shieldTimer <= 0) {
        this.health -= num;
        if (this.damaged !== undefined) {
            // Entity flashes red when damaged
            this.damaged = 25;
        }
    }
    if (this.health == 0) {
        this.die(cause);
    }
}

// Unused
Entity.prototype.draw = function() {
    var drawPos = getDrawPos(this.pos);

    push();
    translate(drawPos);

    this.specificDraw();

    fill(255, 0, 0, this.damaged * 4);
    noStroke();
    ellipse(0, 0, this.r * zoom * 2);

    if (this instanceof Enemy) {
        if (this.health > 1) {
            rotate(- HALF_PI * 0.5);
            stroke(200, 60, 60);
            strokeWeight(3 * zoom);
            line((- this.r + 1) * zoom, 0, (this.r - 1) * zoom, 0);

            if (this.health > 2) {
                rotate(HALF_PI);
                line((- this.r + 1) * zoom, 0, (this.r - 1) * zoom, 0);
            }
        }
    }

    pop();
    // var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
	// var drawR = cam.getDrawSize(this.r);
    // scr.push();
    // scr.translate(drawPos)
	// scr.fill(255);
	// scr.noStroke();
	// scr.ellipse(0, 0, drawR * 2);
    // scr.pop();
}
