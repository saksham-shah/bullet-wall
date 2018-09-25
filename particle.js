// For animation only - no impact on gameplay
function Particle(game_, pos_, vel_, acc_, r_, life_, colour_, cell_) {
	this.game = game_;

	this.pos = pos_.copy();
	this.vel = vel_.copy();
	this.acc = acc_.copy();

	this.r = r_;
	this.life = life_;
	this.maxLife = life_;

	this.colour = colour_;

	this.cell = cell_;
	this.canDraw = true;
}

Particle.prototype.update = function() {
	this.life -= this.game.gameSpeed;

	if (this.life < 0) {
		this.finished = true;
	}

	this.pos.add(p5.Vector.mult(this.vel, this.game.gameSpeed));
    this.vel.add(p5.Vector.mult(this.acc, this.game.gameSpeed));

	// If it hits a wall, it disappears
	this.canDraw = true;
	var myCell = this.game.grid.getCell(this.pos);
	if (this.cell !== undefined && myCell !== null) {
		if (myCell.wall > 0 || (myCell.powerup !== null && myCell === this.cell)) {
			this.canDraw = false;
			if (myCell !== this.cell) {
				this.finished = true;
			}
		}
	}
}

Particle.prototype.draw = function() {
	if (this.canDraw) {
		var drawPos = getDrawPos(this.pos);

		push();
		translate(drawPos);

		fill(this.colour);
		noStroke();
		// Gets smaller over time
		ellipse(0, 0, this.r * this.life / this.maxLife * zoom * 2);

		pop();
	}
}

// Creates particles (for animation only, no impact on gameplay)
Game.prototype.particleExplosion = function(pos, speed, speedErr, angle, angleErr, acc, life, lifeErr, num, r, colour, cell) {
	var speedErrNum = speed * speedErr * 0.01;

	for (var i = 0; i < num; i++) {
		if (cell !== undefined) {
			pos = createVector(cell.pos.x + random(CELLSIZE), cell.pos.y + random(CELLSIZE));
		}
		var vel = p5.Vector.fromAngle(random(angle - angleErr, angle + angleErr)).setMag(random(speed - speedErrNum, speed + speedErrNum));
		life += random(lifeErr);
		var particle = new Particle(this, pos, vel, acc, r, life, colour, cell);
		this.particles.push(particle);
	}
}
