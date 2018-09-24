// Cells are part of the game's grid
function Cell(game_, row_, col_, grid_) {
    this.game = game_;
	this.row = row_;
	this.col = col_;
	this.grid = grid_;

	this.r = CELLSIZE;

    this.pos = createVector(this.col * this.r, this.row * this.r);

    this.wall = 0;
}

// Returns a p5.Vector of the middle of the cell
Cell.prototype.middle = function() {
    return p5.Vector.add(this.pos, createVector(CELLSIZE * 0.5, CELLSIZE * 0.5));
}

// Creates a wall
Cell.prototype.build = function() {
    if (this.wall == 0) {
        this.wall = 2;
        this.game.particleExplosion(this.middle(), 1, 100, PI, PI, createVector(0, 0), 30, 0, 30, 7, color(50), this);
    }
}

// Breaks the wall
Cell.prototype.break = function(direction) {
    if (this.wall > 0) {
        this.wall--;
        this.game.particleExplosion(this.middle(), 1, 100, direction, HALF_PI * 0.5, createVector(0, 0), 30, 0, 20, 5, color(50), this);
    }

}

// Returns any adjacent cells
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

Cell.prototype.draw = function() {
	if (this.wall > 0) {
        var drawPos = getDrawPos(this.pos);
        push();
        translate(drawPos);
        stroke(50);
        strokeWeight(4 * zoom);
        fill(100);
        rect(0, 0, this.r * zoom, this.r * zoom);

        if (this.wall > 1) {
            line(0, this.r * zoom, this.r * zoom, 0);
        }

        pop();
    }
}
