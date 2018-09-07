function EnemyFast(game, row, col) {
	Entity.call(this, game, row, col, 15);

	this.speed = 2.5;

	this.target = game.player;
	this.pathToTarget = null;

	this.timeSinceLastPath = 0;
}

EnemyFast.prototype = Object.create(Entity.prototype);

EnemyFast.prototype.update = function() {
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

		if (this.game.grid.getCell(this.pos) === this.pathToTarget[0]) {
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
}

EnemyFast.prototype.calculatePath = function() {
	this.pathToTarget = findPath(this.game.grid.grid, this.game.grid.getCell(this.pos), this.game.grid.getCell(this.target.pos));
	this.timeSinceLastPath = 0;
}

EnemyFast.prototype.moveTowards = function(pos) {
	var vectorToTarget = p5.Vector.sub(pos, this.pos).setMag(this.speed);
	this.vel.add(vectorToTarget);
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

	scr.fill(250, 200, 200);
	scr.stroke(200, 160, 160);
    scr.strokeWeight(2);

	scr.ellipse(0, 0, drawR * 2);
    
    scr.pop();
}