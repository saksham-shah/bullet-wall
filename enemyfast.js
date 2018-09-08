function EnemyFast(game, row, col) {
	Entity.call(this, game, row, col, 15);

	this.maxVel = 3;
	this.maxForce = 0.1;

	this.target = game.player;
	this.pathToTarget = null;

	this.timeSinceLastPath = 0;

	this.hitSpeed = 60;

	this.weaponPos = createVector(0, 0);
	this.weaponExtend = 5;


}

EnemyFast.prototype = Object.create(Entity.prototype);

EnemyFast.prototype.update = function() {
	// this.weaponPos = this.pos.copy().add(createVector(this.weaponExtend, 0).rotate(this.vel.heading()));

	this.timeSinceLastPath ++;

	if (this.pathToTarget === null) {
		if (p5.Vector.dist(this.pos, this.target.pos) < CELLSIZE * 1.5) {
			this.moveTowards(this.target.pos);
		} else {
			this.calculatePath();
		}
	} else {
		if (this.timeSinceLastPath > 60) {
			this.calculatePath();
		}

		//if (this.game.grid.getCell(this.pos) === this.pathToTarget[0]) {
		var d = p5.Vector.dist(this.pos, this.pathToTarget[0].pos.copy().add(createVector(CELLSIZE * 0.5, CELLSIZE * 0.5)));
		if (d < this.r + CELLSIZE) {
			this.pathToTarget.splice(0, 1);
			if (this.pathToTarget.length > 0) {
				if (this.pathToTarget[0].wall == 0) {
					this.pathToTarget.splice(0, 1);
				}
			}
		}

		if (p5.Vector.dist(this.pos, this.target.pos) < CELLSIZE * 1.5 || this.pathToTarget.length == 0) {
			this.moveTowards(this.target.pos);
			this.pathToTarget = null;
		} else {
			var cellPos = this.pathToTarget[0].pos.copy();
			cellPos.add(createVector(CELLSIZE * 0.5, CELLSIZE * 0.5));
			this.moveTowards(cellPos);
		}
	}

	this.weaponPos = this.pos.copy().add(createVector(this.weaponExtend, 0).rotate(this.vel.heading()));

}

EnemyFast.prototype.calculatePath = function() {
	this.pathToTarget = findPath(this.game.grid.grid, this.game.grid.getCell(this.pos), this.game.grid.getCell(this.target.pos));
	this.timeSinceLastPath = 0;
}

EnemyFast.prototype.moveTowards = function(pos) {
	var vectorToTarget = p5.Vector.sub(pos, this.pos);
	vectorToTarget.normalize();
	vectorToTarget.mult(this.maxVel);
	vectorToTarget.sub(this.vel);
	vectorToTarget.limit(this.maxForce);
	this.acc.add(vectorToTarget);
}

EnemyFast.prototype.die = function() {
	this.game.grid.getCell(this.pos).wall = 2;
	this.dead = true;
}

EnemyFast.prototype.draw = function(cam, scr) {
	var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
	var drawR = cam.getDrawSize(this.r);
    scr.push();
    scr.translate(drawPos);
	scr.rotate(this.vel.heading());

	scr.fill(250, 200, 200);
	scr.stroke(200, 160, 160);
    scr.strokeWeight(2);

	scr.ellipse(0, 0, drawR * 2);
	// scr.ellipse(drawR * 0.5, 0, drawR);

    scr.pop();

	var drawPos = cam.getDrawPos(this.weaponPos.x, this.weaponPos.y);
	var drawR = cam.getDrawSize(this.r);
    scr.push();
    scr.translate(drawPos);
	// scr.rotate(this.vel.heading());

	scr.fill(250, 200, 200);
	scr.stroke(200, 160, 160);
    scr.strokeWeight(2);

	scr.ellipse(0, 0, drawR);
	// scr.ellipse(drawR * 0.5, 0, drawR);

    scr.pop();
}
