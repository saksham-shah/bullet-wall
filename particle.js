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
	this.life --;

	if (this.life < 0) {
		this.finished = true;
	}

	this.pos.add(this.vel);
	this.vel.add(this.acc);
}

Particle.prototype.draw = function(cam, scr) {
	this.canDraw = true;
	var myCell = this.game.grid.getCell(this.pos);
	if (this.cell !== undefined && myCell !== null) {
		if (myCell.wall > 0) {// === this.cell && this.cell.wall > 0) {
			this.canDraw = false;
			if (myCell !== this.cell) {
				this.finished = true;
			}
		}
	}

	if (this.canDraw) {
		var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
		var drawR = cam.getDrawSize(this.r * this.life / this.maxLife);

		scr.push();
		scr.translate(drawPos);

		scr.fill(this.colour);
		scr.noStroke();
		scr.ellipse(0, 0, drawR * 2);

		scr.pop();
	}
}