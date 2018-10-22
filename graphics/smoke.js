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

function drawSmokeParticle(x, y, z, params) {
    var drawPos = p5.Vector.add(p5.Vector.mult(createVector(params.x, params.y), z), createVector(x, y));

	push();
	translate(drawPos);
    params.colour.setAlpha(255 * params.lifePercent);
	fill(params.colour);
	noStroke();
	// Gets larger over time
	ellipse(0, 0, params.r * (1 - params.lifePercent) * z * 2);

	pop();
}

SmokeParticle.prototype.convertToSnap = function() {
    return {
        type: 1,
        x: this.pos.x,
        y: this.pos.y,
        r: this.r,
        lifePercent: this.life / this.maxLife,
        colour: this.colour
    }
}

// Unused smoke effect
Game.prototype.smokeExplosion = function(pos, speed, speedErr, angleErr, life, lifeErr, num, r, colour) {
	var speedErrNum = speed * speedErr * 0.01;

	for (var i = 0; i < num; i++) {
		// if (cell !== undefined) {
		// 	pos = createVector(cell.pos.x + random(CELLSIZE), cell.pos.y + random(CELLSIZE));
		// }
        // var vel = p5.Vector.fromAngle(random(angle - angleErr, angle + angleErr)).setMag(random(speed - speedErrNum, speed + speedErrNum));
        var vel = p5.Vector.fromAngle(random(-HALF_PI - angleErr, -HALF_PI + angleErr)).setMag(random(speed - speedErrNum, speed + speedErrNum));
		life += random(lifeErr);
		var particle = new SmokeParticle(this, pos, vel, createVector(0, 0), r, life, colour);
		this.particles.push(particle);
	}
}
