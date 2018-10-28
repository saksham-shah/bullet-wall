function Footprint(game_, pos_, direction_, r_) {
    Particle.call(this, game_, pos_, createVector(0, 0), createVector(0, 0), r_, 90, theme.particle.footprint);

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

function drawFootprint(z, params) {
    var drawPos = p5.Vector.mult(createVector(params.x, params.y), z);

	push();
	translate(drawPos);

    rotate(params.direction);
    var c = color(theme.particle.footprint)
    c.setAlpha(255 * params.lifePercent);
	fill(c);
	noStroke();
	// Gets larger over time
	ellipse(0, 0, params.r * z * 3, params.r * z * 2);

	pop();
}

Footprint.prototype.convertToSnap = function() {
    return {
        type: 2,
        x: this.pos.x,
        y: this.pos.y,
        r: this.r,
        lifePercent: this.life / this.maxLife,
        direction: this.direction
    }
}
