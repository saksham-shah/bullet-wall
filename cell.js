function Cell(row_, col_, grid_) {
	this.row = row_;
	this.col = col_;
	this.grid = grid_;

	this.r = CELLSIZE;

    this.pos = createVector(this.col * this.r, this.row * this.r);

	this.state = NORMAL;
	// this.mouseHover = false;

	this.obstacle = false;

	if (this.col == 1 && this.row == 1) {
	// 	// this.state = GOLD;
		this.obstacle = true;
	}
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
	if (this.obstacle) {
        var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
        var drawR = cam.getDrawSize(this.r);
        scr.push(0);
        scr.translate(drawPos);
	// 	var gameX = this.col * this.r;
	// 	var gameY = this.row * this.r;
        scr.noStroke();
        scr.fill(100);
        scr.rect(0, 0, drawR, drawR);

        scr.pop();
    //
	// 	if (this.state === GOLD) {
	// 		scr.fill(255, 255, 0);
	// 		scr.noStroke(0);
	// 		scr.rect(drawPos.x, drawPos.y, drawR, drawR);
	// 	}
    //
	// 	if (this.mouseHover) {
	// 		scr.fill(255, 0, 0);
	// 		scr.noStroke(0);
	// 		scr.rect(drawPos.x, drawPos.y, drawR, drawR);
	// 		this.mouseHover = false;
	// 	}
    //
    //
	}


}
