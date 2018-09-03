function Cell(row_, col_, grid_) {
	this.row = row_;
	this.col = col_;
	this.grid = grid_;

	this.r = CELLSIZE;

	this.state = NORMAL;
	// this.mouseHover = false;

	this.obstacle = false;

	// if (this.col == 1) {
	// 	// this.state = GOLD;
	// 	this.obstacle = true;
	// }
}

Cell.prototype.draw = function(cam, scr) {
	// if (this.state !== NORMAL || this.mouseHover) {
	// 	var gameX = this.col * this.r;
	// 	var gameY = this.row * this.r;
	// 	var drawPos = cam.getDrawPos(gameX, gameY);
	// 	var drawR = cam.getDrawSize(this.r);
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
	// }


}
