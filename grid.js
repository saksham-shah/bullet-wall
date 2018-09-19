// for (var i = 0; i < this.grid.length; i++) {
// 	var row = this.grid[i];
// 	for (var j = 0; j < row.length; j++) {
// 		row[j].draw();
// 	}
// }
var CELLSIZE = 40;

function Grid(game_, size) {
    this.game = game_;

	this.grid = []
	for (var i = 0; i < size; i++) {
		var row = [];
		for (var j = 0; j < size; j++) {
			var cell = new Cell(game_, i, j, this.grid);
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

    if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) {
    	return null;
    }

    // if (row < 0) {
    //     row = 0;
    // } else if (row >= this.grid.length) {
    //     row = this.grid.length - 1;
    // }
    //
    // if (col == -1) {
    //     col = 0;
    // } else if (col >= this.grid[0].length) {
    //     col = this.grid[0].length - 1;
    // }

    return this.grid[row][col];
}

Grid.prototype.draw = function() {
    var drawPos = getDrawPos(createVector(0, 0));
    // var drawR = cam.getDrawSize(this.grid.length * CELLSIZE);

    fill(45, 60, 120);
    noStroke();
    rect(drawPos.x, drawPos.y, this.grid.length * CELLSIZE * ZOOM, this.grid.length * CELLSIZE * ZOOM);

	strokeWeight(1 * ZOOM);
	stroke(90, 120, 240);

    // var interval = cam.getDrawSize(CELLSIZE);

	var top = getDrawPos(createVector(0, 0));
	var bottom = getDrawPos(createVector(0, this.grid.length * CELLSIZE));
	// var currentX = 0;

	for (var i = 0; i <= this.grid.length; i++) {
		line(top.x, top.y, bottom.x, bottom.y);
		top.x += CELLSIZE * ZOOM;
		bottom.x += CELLSIZE * ZOOM;
	}

	var left = getDrawPos(createVector(0, 0));
	var right = getDrawPos(createVector(this.grid.length * CELLSIZE, 0));
	// var currentY = 0;

	for (var i = 0; i <= this.grid.length; i++) {
		line(left.x, left.y, right.x, right.y);
		left.y += CELLSIZE * ZOOM;
		right.y += CELLSIZE * ZOOM;
	}

	for (var i = 0; i < this.grid.length; i++) {
		var row = this.grid[i];
		for (var j = 0; j < row.length; j++) {
            row[j].draw();
            // cam.draw(row[j]);
		}
	}
}

// Grid.prototype.draw = function(cam, scr) {
//     var drawPos = cam.getDrawPos(0, 0);
//     var drawR = cam.getDrawSize(this.grid.length * CELLSIZE);
//
//     scr.fill(45, 60, 120);
//     scr.noStroke();
//     scr.rect(drawPos.x, drawPos.y, drawR, drawR);
//
// 	scr.strokeWeight(1 * cam.getDrawSize(1));
// 	scr.stroke(90, 120, 240);
//
//     var interval = cam.getDrawSize(CELLSIZE);
//
// 	var top = cam.getDrawPos(0, 0);
// 	var bottom = cam.getDrawPos(0, this.grid.length * CELLSIZE);
// 	// var currentX = 0;
//
// 	for (var i = 0; i <= this.grid.length; i++) {
// 		scr.line(top.x, top.y, bottom.x, bottom.y);
// 		top.x += interval;
// 		bottom.x += interval;
// 	}
//
// 	var left = cam.getDrawPos(0, 0);
// 	var right = cam.getDrawPos(this.grid.length * CELLSIZE, 0);
// 	// var currentY = 0;
//
// 	for (var i = 0; i <= this.grid.length; i++) {
// 		scr.line(left.x, left.y, right.x, right.y);
// 		left.y += interval;
// 		right.y += interval;
// 	}
//
// 	for (var i = 0; i < this.grid.length; i++) {
// 		var row = this.grid[i];
// 		for (var j = 0; j < row.length; j++) {
// 			cam.draw(row[j]);
// 		}
// 	}
// }
