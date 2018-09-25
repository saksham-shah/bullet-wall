var CELLSIZE = 40;

// Essentially the map of the game
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

// Returns the cell that the position is part of
Grid.prototype.getCell = function(pos) {
    var row = floor(pos.y / CELLSIZE);
    var col = floor(pos.x / CELLSIZE);

    if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) {
    	return null;
    }

    return this.grid[row][col];
}

// Draws the background of the grid and the lines seperating cells
Grid.prototype.draw = function() {
    var drawPos = getDrawPos(createVector(0, 0));

    fill(45, 60, 120);
    noStroke();
    rect(drawPos.x, drawPos.y, this.grid.length * CELLSIZE * zoom, this.grid.length * CELLSIZE * zoom);

	strokeWeight(1 * zoom);
	stroke(90, 120, 240);

	var top = getDrawPos(createVector(zoom * 0.5, zoom * 0.5));
	var bottom = getDrawPos(createVector(zoom * 0.5, this.grid.length * CELLSIZE + zoom * 0.5));

	for (var i = 0; i <= this.grid.length; i++) {
		line(top.x, top.y, bottom.x, bottom.y);
		top.x += CELLSIZE * zoom;
		bottom.x += CELLSIZE * zoom;
	}

	var left = getDrawPos(createVector(zoom * 0.5, zoom * 0.5));
	var right = getDrawPos(createVector(this.grid.length * CELLSIZE + zoom * 0.5, zoom * 0.5));

	for (var i = 0; i <= this.grid.length; i++) {
		line(left.x, left.y, right.x, right.y);
		left.y += CELLSIZE * zoom;
		right.y += CELLSIZE * zoom;
	}

	for (var i = 0; i < this.grid.length; i++) {
		var row = this.grid[i];
		for (var j = 0; j < row.length; j++) {
            // Draw powerups first
            row[j].draw(1);
		}
	}
    for (var i = 0; i < this.grid.length; i++) {
		var row = this.grid[i];
		for (var j = 0; j < row.length; j++) {
            // Then walls
            row[j].draw(0);
		}
	}
}
