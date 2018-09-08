function Entity(game_, row, col, r_) {
    this.game = game_;

    var x = (col + 0.5) * CELLSIZE;
	var y = (row + 0.5) * CELLSIZE;
	this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

	this.r = r_;

    this.dead = false;

    // this.grid = grid_;
}

Entity.prototype.move = function(entities) {
    this.acc.mult(0);
    if (this.update !== undefined) {
        this.update();
    }
	this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(this.maxVel);
    this.checkCollisions(entities);
	// this.wallCollisions();
}

Entity.prototype.checkCollisions = function(all) {
	for (var i = 0; i < all.length; i++) {
		if (this !== all[i]) {
            var newPos = collideWithPoint(this.pos, all[i].pos, this.r + all[i].r, 0.5);
            this.pos.x = newPos.x;
            this.pos.y = newPos.y;
		}
	}

    var newPos = collideWithWalls(this.pos, this.r, this.game.grid)[0];
    // newPos = newPos[0];
    this.pos.x = newPos.x;
    this.pos.y = newPos.y;
}

Entity.prototype.draw = function(cam, scr) {
    var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
	var drawR = cam.getDrawSize(this.r);
    scr.push();
    scr.translate(drawPos)
	scr.fill(255);
	scr.noStroke();
	scr.ellipse(0, 0, drawR * 2);
    scr.pop();
}
