function Entity(row, col, r_, grid_) {
	var x = (col + 0.5) * CELLSIZE;
	var y = (row + 0.5) * CELLSIZE;
	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);

	this.r = r_;

    this.grid = grid_;
}

Entity.prototype.move = function(entities) {
    if (this.update !== undefined) {
        this.update();
    }
	this.pos.add(this.vel);
    this.checkCollisions(entities);
	this.wallCollisions();
	this.vel.mult(0);
}

Entity.prototype.wallCollisions = function() {
    var grid = this.grid.grid;

	var currentCell = this.grid.getCell(this.pos);
	var relativePos = createVector(this.pos.x % CELLSIZE, this.pos.y % CELLSIZE);

	var xShift = false;
	var yShift = false;

	if (relativePos.x < this.r) {
		var dx = this.r - relativePos.x;
		if (currentCell.col == 0 || grid[currentCell.row][currentCell.col - 1].obstacle) {
			var xShift = true;
		}
	} else if (relativePos.x > CELLSIZE - this.r) {
		var dx = CELLSIZE - this.r - relativePos.x;
		if (currentCell.col == grid.length - 1 || grid[currentCell.row][currentCell.col + 1].obstacle) {
			var xShift = true;
		}
	}

	if (relativePos.y < this.r) {
		var dy = this.r - relativePos.y;
		if (currentCell.row == 0 || grid[currentCell.row - 1][currentCell.col].obstacle) {
			var yShift = true;
		}
	} else if (relativePos.y > CELLSIZE - this.r) {
		var dy = CELLSIZE - this.r - relativePos.y;
		if (currentCell.row == grid.length - 1 || grid[currentCell.row + 1][currentCell.col].obstacle) {
			var yShift = true;
		}
	}

	if (xShift) {
		this.pos.x += dx;
	}
	if (yShift) {
		this.pos.y += dy;
	}

    if (!xShift && !yShift) {
        // Corner collisions

        var corners = [];

        corners.push(collideWithPoint(this.pos, createVector(currentCell.pos.x, currentCell.pos.y), this.r, 1));
        corners.push(collideWithPoint(this.pos, createVector(currentCell.pos.x + currentCell.r, currentCell.pos.y), this.r, 1));
        corners.push(collideWithPoint(this.pos, createVector(currentCell.pos.x, currentCell.pos.y + currentCell.r), this.r, 1));
        corners.push(collideWithPoint(this.pos, createVector(currentCell.pos.x + currentCell.r, currentCell.pos.y + currentCell.r), this.r, 1));

        var done = false;
        for (var i = 0; i < corners.length; i++) {
            if ((this.pos.x != corners[i].x || this.pos.y != corners[i].y) && !done) {
                this.pos.x = corners[i].x;
                this.pos.y = corners[i].y;
                done = true;
            }
        }
    }
}

Entity.prototype.checkCollisions = function(all) {
	for (var i = 0; i < all.length; i++) {
		if (this !== all[i]) {
            var newPos = collideWithPoint(this.pos, all[i].pos, this.r + all[i].r, 0.5);
            this.pos.x = newPos.x;
            this.pos.y = newPos.y;
		}
	}
}

function collideWithPoint(pos1, pos2, distance, weight) {
    var returnVector = pos1.copy();
    var d = p5.Vector.dist(pos1, pos2);
    if (d < distance) {
        var awayVector = p5.Vector.sub(pos1, pos2);
        awayVector.setMag((distance - d) * weight);
        returnVector.add(awayVector);
    }
    return returnVector;
}

Entity.prototype.draw = function(cam, scr) {
	var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
	var drawR = cam.getDrawSize(this.r);
	scr.fill(255);
	scr.noStroke();
	scr.ellipse(drawPos.x, drawPos.y, drawR * 2);
}
