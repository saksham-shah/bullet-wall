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
            // Draw powerups
            row[j].draw(1);
		}
	}
}

function drawGrid(z, params) {
    var drawPos = createVector(0,0);


    fill(theme.grid.floor);
    noStroke();
    rect(drawPos.x, drawPos.y, params.grid.length * CELLSIZE * z, params.grid.length * CELLSIZE * z);

	strokeWeight(1 * z);
	stroke(theme.grid.lines);

    // var top = p5.Vector.mult(createVector(z * 0.5, z * 0.5), z);
    // var bottom = p5.Vector.mult(createVector(z * 0.5, params.grid.length * CELLSIZE + z * 0.5), z);
    var top = createVector(0, 0);
    var bottom = createVector(0, params.grid.length * CELLSIZE * z);

	for (var i = 0; i <= params.grid.length; i++) {
		line(top.x, top.y, bottom.x, bottom.y);
		top.x += CELLSIZE * z;
		bottom.x += CELLSIZE * z;
	}

    // var left = p5.Vector.mult(createVector(z * 0.5, z * 0.5), z);
    // var right = p5.Vector.mult(createVector(params.grid.length * CELLSIZE + z * 0.5, z * 0.5), z);
    var left = createVector(0, 0);
    var right = createVector(params.grid.length * CELLSIZE * z, 0);

	for (var i = 0; i <= params.grid.length; i++) {
		line(left.x, left.y, right.x, right.y);
		left.y += CELLSIZE * z;
		right.y += CELLSIZE * z;
	}

	for (var i = 0; i < params.grid.length; i++) {
		var row = params.grid[i];
		for (var j = 0; j < row.length; j++) {
            // Draw powerups
            drawCell(z, row[j], 1);
		}
	}
}

Grid.prototype.drawWalls = function() {
    for (var i = 0; i < this.grid.length; i++) {
		var row = this.grid[i];
		for (var j = 0; j < row.length; j++) {
            // Draw walls
            row[j].draw(0);

		}
	}
}

function drawGridWalls(z, params) {
    for (var i = 0; i < params.grid.length; i++) {
		var row = params.grid[i];
		for (var j = 0; j < row.length; j++) {
            // Draw walls
            drawCell(z, row[j], 0);
		}
	}
}

Grid.prototype.convertToSnap = function() {
    var snapGrid = []
    for (var i = 0; i < this.grid.length; i++) {
		var row = this.grid[i];
        var snapRow = [];
		for (var j = 0; j < row.length; j++) {
            snapRow.push(row[j].convertToSnap());
		}
        snapGrid.push(snapRow);
	}
    return {
        grid: snapGrid
    }
}
