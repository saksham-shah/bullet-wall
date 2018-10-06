function Footprint(game_, pos_, direction_) {
    Particle.call(this, game_, pos_, createVector(0, 0), createVector(0, 0), 4, 90, color(30, 40, 80));

    this.direction = direction_;
}

Footprint.prototype = Object.create(Particle.prototype);

Footprint.prototype.draw = function() {
	var drawPos = getDrawPos(this.pos);

	push();
	translate(drawPos);
    rotate(this.direction);
    this.colour.setAlpha(255 * this.life / this.maxLife);
	fill(this.colour);
	noStroke();
	// Gets larger over time
	ellipse(0, 0, this.r * zoom * 3, this.r * zoom * 2);

	pop();
}
