// General object for all objects in the game that can be damaged
function Entity(game_, row, col, r_) {
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

    this.health = 1;
    this.damaged = 0;

    this.hide = false;
    this.freeze = false;
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
}

// Collides with walls and other entities
Entity.prototype.checkCollisions = function(all) {
	for (var i = 0; i < all.length; i++) {
		if (this !== all[i]) {
            var newPos = collideWithPoint(this.pos, all[i].pos, this.r + all[i].r, 10 / this.mass);
            this.pos.x = newPos.x;
            this.pos.y = newPos.y;
		}
	}

    var newPos = collideWithWalls(this.pos, this.r, this.game.grid)[0];
    this.pos.x = newPos.x;
    this.pos.y = newPos.y;
}

// Takes damage
Entity.prototype.damage = function(num, cause) {
    if (this.shield === true) {
        this.shield = false;
        this.shieldTimer = 180;
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
Entity.prototype.draw = function(cam, scr) {
    var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
	var drawR = cam.getDrawSize(this.r);
    scr.push();
    scr.translate(drawPos)
	scr.fill(255);
	scr.noStroke();
	scr.ellipse(0, 0, drawR * 2);
    scr.pop();
}
