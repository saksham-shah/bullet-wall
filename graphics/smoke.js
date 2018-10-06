function SmokeParticle(game_, pos_, vel_, acc_, r_, life_, colour_) {
    Particle.call(this, game_, pos_, vel_, acc_, r_, life_, colour_)
}

SmokeParticle.prototype = Object.create(Particle.prototype);

SmokeParticle.prototype.draw = function() {
	var drawPos = getDrawPos(this.pos);

	push();
	translate(drawPos);
    this.colour.setAlpha(255 * this.life / this.maxLife);
	fill(this.colour);
	noStroke();
	// Gets larger over time
	ellipse(0, 0, this.r * (1 - this.life / this.maxLife) * zoom * 2);

	pop();
}
