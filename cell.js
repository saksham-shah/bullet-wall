function Cell(game_, row_, col_, grid_) {
    this.game = game_;
	this.row = row_;
	this.col = col_;
	this.grid = grid_;

	this.r = CELLSIZE;

    this.pos = createVector(this.col * this.r, this.row * this.r);

	this.state = NORMAL;
	// this.mouseHover = false;

    this.wall = 0;

	// if (this.col == 1 && this.row == 1) {
	// // 	// this.state = GOLD;
	// 	// this.obstacle = true;
    //     this.wall = 2;
	// }

    this.path = false;
}

Cell.prototype.middle = function() {
    return p5.Vector.add(this.pos, createVector(CELLSIZE * 0.5, CELLSIZE * 0.5));
}

Cell.prototype.build = function() {
    this.wall = 2;
    this.game.particleExplosion(this.middle(), 1, 100, PI, PI, createVector(0, 0), 30, 0, 30, 7, color(50), this);
}

Cell.prototype.break = function(direction) {
    this.wall--;
    this.game.particleExplosion(this.middle(), 1, 100, direction, HALF_PI * 0.5, createVector(0, 0), 30, 0, 20, 5, color(50), this);

}

Cell.prototype.getNeighbours = function() {
    var neighbours = [];
    if (this.row > 0) {
        neighbours.push(this.grid[this.row - 1][this.col])
    }
    if (this.row < this.grid.length - 1) {
        neighbours.push(this.grid[this.row + 1][this.col])
    }
    if (this.col > 0) {
        neighbours.push(this.grid[this.row][this.col - 1])
    }
    if (this.col < this.grid.length - 1) {
        neighbours.push(this.grid[this.row][this.col + 1])
    }
    return neighbours;
}

Cell.prototype.draw = function(cam, scr) {
	if (this.wall > 0) {
        var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
        var drawR = cam.getDrawSize(this.r);
        scr.push();
        scr.translate(drawPos);
	// 	var gameX = this.col * this.r;
	// 	var gameY = this.row * this.r;
        scr.stroke(50);
        scr.strokeWeight(4 * drawR / this.r);
        scr.fill(100);
        scr.rect(0, 0, drawR, drawR);

        if (this.wall > 1) {
            // scr.line(0, 0, this.r, this.r);
            scr.line(0, drawR, drawR, 0);
        }

        scr.pop();
    }
    if (this.path) {
        var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
        var drawR = cam.getDrawSize(this.r);
        scr.push();
        scr.translate(drawPos);

		scr.fill(255, 0, 0, 100);
		scr.noStroke();
		scr.rect(0, 0, drawR, drawR);
		this.path = false;

        scr.pop();
	}


}
