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

    var hit = null;

    // Checking for collisions with each of the four neighbouring cells in turn

    // If the circle is overlapping with the neighbouring cell (on the left)
    if (relativePos.x < r) {
		var dx = r - relativePos.x;
        // If the cell is on the edge
		if (currentCell.col == 0) {
            // Collision has happened
			var xShift = true;
            // Else if the cell on the left is a wall
		} else if (grid[currentCell.row][currentCell.col - 1].wall > 0) {
			var xShift = true;
            hit = grid[currentCell.row][currentCell.col - 1];
		}
	} else if (relativePos.x > CELLSIZE - r) {
		var dx = CELLSIZE - r - relativePos.x;
		if (currentCell.col == grid.length - 1) {
			var xShift = true;
		} else if (grid[currentCell.row][currentCell.col + 1].wall > 0) {
			var xShift = true;
            hit = grid[currentCell.row][currentCell.col + 1];
		}
	}

	if (relativePos.y < r) {
		var dy = r - relativePos.y;
		if (currentCell.row == 0) {
			var yShift = true;
		} else if (grid[currentCell.row - 1][currentCell.col].wall > 0) {
			var yShift = true;
            hit = grid[currentCell.row - 1][currentCell.col ];
		}
	} else if (relativePos.y > CELLSIZE - r) {
		var dy = CELLSIZE - r - relativePos.y;
		if (currentCell.row == grid.length - 1) {
			var yShift = true;
		} else if (grid[currentCell.row + 1][currentCell.col].wall > 0) {
			var yShift = true;
            hit = grid[currentCell.row + 1][currentCell.col ];
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
        if (currentCell.row > 0 && currentCell.col > 0 && grid[currentCell.row - 1][currentCell.col - 1].wall > 0) {
            corners.push(collideWithPoint(pos, createVector(currentCell.pos.x, currentCell.pos.y), r, 1));
        } else {
            corners.push(false);
        }
        if (currentCell.row > 0 && currentCell.col < grid[0].length - 1 && grid[currentCell.row - 1][currentCell.col + 1].wall > 0) {
            corners.push(collideWithPoint(pos, createVector(currentCell.pos.x + currentCell.r, currentCell.pos.y), r, 1));
        } else {
            corners.push(false);
        }
        if (currentCell.row < grid.length - 1 && currentCell.col > 0 && grid[currentCell.row + 1][currentCell.col - 1].wall > 0) {
            corners.push(collideWithPoint(pos, createVector(currentCell.pos.x, currentCell.pos.y + currentCell.r), r, 1));
        } else {
            corners.push(false);
        }
        if (currentCell.row < grid.length - 1 && currentCell.col < grid[0].length - 1 && grid[currentCell.row + 1][currentCell.col + 1].wall > 0) {
            corners.push(collideWithPoint(pos, createVector(currentCell.pos.x + currentCell.r, currentCell.pos.y + currentCell.r), r, 1));
        } else {
            corners.push(false);
        }

        for (var i = 0; i < corners.length; i++) {
            if (corners[i] !== false) {
                // If there is a collision, corners[i] will be different from pos, so this if statement checks if there is a collision
                if ((pos.x != corners[i].x || pos.y != corners[i].y)) {
                    returnVector.x = corners[i].x;
                    returnVector.y = corners[i].y;
                    if (i == 0) {
                        hit = grid[currentCell.row - 1][currentCell.col - 1];
                    } else if (i == 1) {
                        hit = grid[currentCell.row - 1][currentCell.col + 1];
                    } else if (i == 2) {
                        hit = grid[currentCell.row + 1][currentCell.col - 1];
                    } else {
                        hit = grid[currentCell.row + 1][currentCell.col + 1]
                    }
                }
            }
        }
    }
    // console.log(returnVector);
    return [returnVector, hit];
}
