// for (var i = 0; i < this.grid.length; i++) {
// 	var row = this.grid[i];
// 	for (var j = 0; j < row.length; j++) {
// 		row[j].draw();
// 	}
// }
var CELLSIZE = 30;

function Grid(size) {
	this.grid = []
	for (var i = 0; i < size; i++) {
		var row = [];
		for (var j = 0; j < size; j++) {
			var cell = new Cell(i, j, this);
			row.push(cell);
		}
		this.grid.push(row);
	}
}

// Grid.prototype.mouseCell = function(row, col) {
// 	this.grid[row][col].mouseHover = true;
// }

Grid.prototype.getCell = function(pos) {
    var row = floor(pos.y / CELLSIZE);
    var col = floor(pos.x / CELLSIZE);
    return this.grid[row][col];
}

Grid.prototype.draw = function(cam, scr) {
    // console.log("hey");
	var interval = cam.getDrawSize(CELLSIZE);

	scr.strokeWeight(1);
	scr.stroke(90, 120, 240);

	var top = cam.getDrawPos(0, 0);
	var bottom = cam.getDrawPos(0, this.grid.length * CELLSIZE);
	// var currentX = 0;

	for (var i = 0; i <= this.grid.length; i++) {
		scr.line(top.x, top.y, bottom.x, bottom.y);
		top.x += interval;
		bottom.x += interval;
	}

	var left = cam.getDrawPos(0, 0);
	var right = cam.getDrawPos(this.grid.length * CELLSIZE, 0);
	// var currentY = 0;

	for (var i = 0; i <= this.grid.length; i++) {
		scr.line(left.x, left.y, right.x, right.y);
		left.y += interval;
		right.y += interval;
	}

	for (var i = 0; i < this.grid.length; i++) {
		var row = this.grid[i];
		for (var j = 0; j < row.length; j++) {
			cam.draw(row[j]);
		}
	}
}
