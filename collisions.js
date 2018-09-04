// Collides a circle with a point (e.g. two circles colliding)
function collideWithPoint(pos1, pos2, distance, weight) {
    var returnVector = pos1.copy();
    var d = p5.Vector.dist(pos1, pos2);
    // If the circle is colliding
    if (d < distance) {
        // Moves the circle away from the point
        var awayVector = p5.Vector.sub(pos1, pos2);
        awayVector.setMag((distance - d) * weight);
        returnVector.add(awayVector);
    }
    return returnVector;
}

// Collides a circle with walls in the grid
function collideWithWalls(pos, r, grid_) {
	var currentCell = grid_.getCell(pos);
	var relativePos = createVector(pos.x % CELLSIZE, pos.y % CELLSIZE);
    var returnVector = pos.copy();

    var grid = grid_.grid;

	var xShift = false;
	var yShift = false;

    // Checking for collisions with each of the four neighbouring cells in turn

    // If the circle is overlapping with the neighbouring cell (on the left)
	if (relativePos.x < r) {
		var dx = r - relativePos.x;
        // If the cell is on the edge of the grid or the cell on the left is a wall
		if (currentCell.col == 0 || grid[currentCell.row][currentCell.col - 1].obstacle) {
            // Collision has happened
			var xShift = true;
		}
	} else if (relativePos.x > CELLSIZE -r) {
		var dx = CELLSIZE - r - relativePos.x;
		if (currentCell.col == grid.length - 1 || grid[currentCell.row][currentCell.col + 1].obstacle) {
			var xShift = true;
		}
	}

	if (relativePos.y < r) {
		var dy = r - relativePos.y;
		if (currentCell.row == 0 || grid[currentCell.row - 1][currentCell.col].obstacle) {
			var yShift = true;
		}
	} else if (relativePos.y > CELLSIZE - r) {
		var dy = CELLSIZE - r - relativePos.y;
		if (currentCell.row == grid.length - 1 || grid[currentCell.row + 1][currentCell.col].obstacle) {
			var yShift = true;
		}
	}

    // Moves the circle by the required amount to stop it overlapping walls
	if (xShift) {
		returnVector.x += dx;
	}
	if (yShift) {
		returnVector.y += dy;
	}

    // Special case when circles overlap with the corners of walls
    if (!xShift && !yShift) {
        var corners = [];

        // Four corners
        if (currentCell.row > 0 && currentCell.col > 0 && grid[currentCell.row - 1][currentCell.col - 1].obstacle) {
            corners.push(collideWithPoint(pos, createVector(currentCell.pos.x, currentCell.pos.y), r, 1));
        }
        if (currentCell.row > 0 && currentCell.col < grid[0].length && grid[currentCell.row - 1][currentCell.col + 1].obstacle) {
            corners.push(collideWithPoint(pos, createVector(currentCell.pos.x + currentCell.r, currentCell.pos.y), r, 1));
        }
        if (currentCell.row < grid.length && currentCell.col > 0 && grid[currentCell.row + 1][currentCell.col - 1].obstacle) {
            corners.push(collideWithPoint(pos, createVector(currentCell.pos.x, currentCell.pos.y + currentCell.r), r, 1));
        }
        if (currentCell.row < grid.length && currentCell.col < grid[0].length && grid[currentCell.row + 1][currentCell.col + 1].obstacle) {
            corners.push(collideWithPoint(pos, createVector(currentCell.pos.x + currentCell.r, currentCell.pos.y + currentCell.r), r, 1));
        }

        for (var i = 0; i < corners.length; i++) {
            // If there is a collision, corners[i] will be different from pos, so this if statement checks if there is a collision
            if ((pos.x != corners[i].x || pos.y != corners[i].y)) {
                returnVector.x = corners[i].x;
                returnVector.y = corners[i].y;
            }
        }
    }
    return returnVector;
}
