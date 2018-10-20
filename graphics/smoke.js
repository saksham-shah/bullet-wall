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
