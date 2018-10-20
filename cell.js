// Cells are part of the game's grid
function Cell(game_, row_, col_, grid_) {
    this.game = game_;
	this.row = row_;
	this.col = col_;
	this.grid = grid_;

	this.r = CELLSIZE;

    this.pos = createVector(this.col * this.r, this.row * this.r);

    this.wall = 0;

    this.powerup = null;
}

// Returns a p5.Vector of the middle of the cell
Cell.prototype.middle = function() {
    return p5.Vector.add(this.pos, createVector(CELLSIZE * 0.5, CELLSIZE * 0.5));
}

// Sets PowerUp
Cell.prototype.setPowerUp = function(powerup) {
    this.powerup = powerup;
    this.game.particleExplosion(this.middle(), 1, 100, PI, PI, createVector(0, 0), 30, 0, 30, 7, color(this.powerup.colour), this);
}

// Creates a wall
Cell.prototype.build = function() {
    if (this.wall == 0) {
        this.wall = 2;


        if (this.powerup !== null) {
            this.powerup.activate(this.game, this);
            this.game.particleExplosion(this.middle(), 1, 100, PI, PI, createVector(0, 0), 30, 0, 30, 7, color(this.powerup.colour), this);
            this.powerup = null;
        } else {
            this.game.particleExplosion(this.middle(), 1, 100, PI, PI, createVector(0, 0), 30, 0, 30, 7, color(50), this);
        }
    }
}

// Breaks the wall
Cell.prototype.break = function(direction, full) {
    if (this.wall > 0) {
        if (full !== true) {
            this.wall--;
        } else {
            this.wall = 0;
        }
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

Cell.prototype.draw = function(mode) {
	if (this.wall > 0 && mode == 0) {
        var drawPos = getDrawPos(this.pos);
        push();
        translate(drawPos);
        stroke(50);
        strokeWeight(4 * zoom);
        fill(100);
        rect(2 * zoom, 2 * zoom, (this.r - 2) * zoom, (this.r - 2) * zoom);

        if (this.wall > 1) {
            line(2 * zoom, (this.r - 2) * zoom, (this.r - 2) * zoom, 2 * zoom);
        }

        pop();
    }

    if (this.powerup !== null && mode == 1) {
        var drawPos = getDrawPos(this.pos);
        push();
        translate(drawPos);
        stroke(100);
        strokeWeight(2 * zoom);
        fill(150);
        rect(this.r * zoom * 0.1 + zoom, this.r * zoom * 0.1 + zoom, this.r * zoom * 0.8, this.r * zoom * 0.8);

        this.powerup.draw(this.r * zoom * 0.1 + zoom, this.r * zoom * 0.1 + zoom, this.r * zoom * 0.8);

        pop();

    }
}
