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
    this.game.particleExplosion(this.middle(), 1, 100, PI, PI, createVector(0, 0), 30, 0, 30, 7, this.powerup.colour, this);
}

// Creates a wall
Cell.prototype.build = function() {
    if (this.wall == 0) {
        this.wall = 2;


        if (this.powerup !== null) {
            this.powerup.activate(this.game, this);
            this.game.particleExplosion(this.middle(), 1, 100, PI, PI, createVector(0, 0), 30, 0, 30, 7, this.powerup.colour, this);
            this.powerup = null;
        } else {
            this.game.particleExplosion(this.middle(), 1, 100, PI, PI, createVector(0, 0), 30, 0, 30, 7, ["grid", "cellStroke"], this);
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
        this.game.particleExplosion(this.middle(), 1, 100, direction, HALF_PI * 0.5, createVector(0, 0), 30, 0, 20, 5, ["grid", "cellStroke"], this);
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

function drawCell(z, params, mode) {
    if (params.wall > 0 && mode == 0) {
        var drawPos = p5.Vector.mult(createVector(params.x, params.y), z);
        push();
        translate(drawPos);
        stroke(theme.grid.cellStroke);
        strokeWeight(4 * z);
        fill(theme.grid.cellFill);
        // rect(2 * z, 2 * z, (params.r - 2) * z, (params.r - 2) * z);
        rect(0, 0, params.r * z, params.r * z);

        if (params.wall > 1) {
            line(0, params.r * z, params.r * z, 0);
        }

        pop();
    }

    if (params.powerup !== null && mode == 1) {
        var drawPos = p5.Vector.mult(createVector(params.x, params.y), z);
        push();
        translate(drawPos);
        stroke(theme.grid.powerupStroke);
        strokeWeight(2 * z);
        fill(theme.grid.powerupFill);
        rect(params.r * z * 0.1, params.r * z * 0.1, params.r * z * 0.8, params.r * z * 0.8);

        params.powerup.draw(params.r * z * 0.1, params.r * z * 0.1, params.r * z * 0.8);

        pop();

    }
}

Cell.prototype.convertToSnap = function() {
    return {
        x: this.pos.x,
        y: this.pos.y,
        r: this.r,
        wall: this.wall,
        powerup: this.powerup
    }
}
