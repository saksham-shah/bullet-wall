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
		if (myCell.wall > 0) {
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
