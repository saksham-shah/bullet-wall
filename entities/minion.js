function Minion(game, row, col) {
    Entity.call(this, game, row, col, 10, 1);

    this.target = game.player;
	this.pathToTarget = null;

    this.maxVel = 3;
	this.maxForce = 0.3;

	this.hitSpeed = 30;
	this.wallDestroy = 100000;

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

    var d = p5.Vector.dist(this.pos, this.target.pos);
    if (this.pathToTarget !== null) {
        this.followPath();
    } else {
        this.calculatePath();
    }

    if (!(this.target instanceof Player)) {
        var d = p5.Vector.dist(this.pos, this.target.pos);
        if (d < this.r * 2 + this.target.r) {
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

    this.relativePos = createVector(this.r * 1.5, 0).rotate(this.vel.heading() + this.hammerRotation);
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
    for (var i = 0; i < this.game.entities.length; i++) {
        if (this.game.entities[i] instanceof Enemy) {
            return this.game.entities[i];
        }
    }
    return this.game.player;
}
		// var d = p5.Vector.dist(this.weaponPos, this.game.player.pos);
		// if (d < this.game.player.r) {
		// 	this.game.player.damage(1, this);
		// 	this.state = 2;
		// }


    // this.weaponPos = this.pos.copy().add(createVector(this.weaponExtend, 0).rotate(this.vel.heading()));


// Hammerman.prototype.calculatePath = function() {
//     // var targetPos = createVector((this.pos.x + this.game.gridSize * CELLSIZE * 0.5) % (this.game.gridSize * CELLSIZE), (this.pos.y + this.game.gridSize * CELLSIZE * 0.5) % (this.game.gridSize * CELLSIZE));
//     // var targetPos = createVector((this.pos.x + random(- CELLSIZE * 3, CELLSIZE * 3)) % (this.game.gridSize * CELLSIZE), (this.pos.y + random(- CELLSIZE * 3, CELLSIZE * 3)) % (this.game.gridSize * CELLSIZE));
//     // var targetPos = //this.pos.copy().add(random(CELLSIZE * 3), random(CELLSIZE * 3));
//     var targetPos = createVector(noise(this.life * 0.01, this.pathNoise) * CELLSIZE * this.game.gridSize, noise(this.life * 0.1, this.pathNoise * this.pathNoise) * CELLSIZE * this.game.gridSize);
//     targetPos = collideWithWalls(targetPos, this.r, this.game.grid)[0];
//     this.pathToTarget = findPath(this.game.grid.grid, this.game.grid.getCell(this.pos), this.game.grid.getCell(targetPos), this);
// 	this.timeSinceLastPath = 0;
// }

// Calculates a path
// Hammerman.prototype.calculatePath = function() {
// 	this.pathToTarget = findPath(this.game.grid.grid, this.game.grid.getCell(this.pos), this.game.grid.getCell(this.target.pos), this);
// 	this.timeSinceLastPath = 0;
// }

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
    d = d * 0.1 - (3 - b.wall) * this.wallDestroy;
    return d;
}

Minion.prototype.die = function() {
    this.dead = true;
    // this.game.smokeExplosion(this.pos, 1, 50, PI * 0.25, 7, 2, 50, 10, color(160, 160, 200));
    this.game.particleExplosion(this.pos, 2, 50, 0, PI, createVector(0, 0.1), 20, 1, 45, 3, color(160, 160, 200));
}

Minion.prototype.specificDraw = function() {
	fill(200, 200, 250);
	stroke(160, 160, 200);
    strokeWeight(2 * zoom);

	ellipse(0, 0, this.r * zoom * 2);
}

// Draws a hammer
Minion.prototype.drawWeapon = function() {
	var drawPos = getDrawPos(this.pos);
	push();
	translate(drawPos);
	rotate(this.vel.heading() + this.hammerRotation + HALF_PI);

	// fill(50, 50,  * (100 + this.hammerRotation * 50));
	// stroke(50, 50, 100 + this.hammerRotation * 50);
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


	// vertex(20 * this.r * zoom / 15, 0);
	// vertex(0, 5 * this.r * zoom / 15);
	// vertex(0, -5 * this.r * zoom / 15);
	// vertex(20 * this.r * zoom / 15, 0);
	endShape();

	pop()
}