function Entity(row, col, r_, grid_) {
	var x = (col + 0.5) * CELLSIZE;
	var y = (row + 0.5) * CELLSIZE;
	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);

	this.r = r_;

    this.grid = grid_;

	// if (controls !== undefined) {
	// 	this.controls = {
	//         up: controls[0],
	//         down: controls[1],
	//         left: controls[2],
	//         right: controls[3]
	//     };
	// } else {
	// 	this.controls = null;
	// }

    // this.speed = 1;
}

Entity.prototype.move = function(entities) {
    this.update();
	this.pos.add(this.vel);
    this.checkCollisions(entities);
	this.wallCollisions();
	this.vel.mult(0);
}

// Soldier.prototype.update = function(soldiers, grid) {
// 	if (this.controls) {
// 		this.moveUsingArrowKeys();
// 	}
// 	this.move();
// 	this.checkCollisions(soldiers);
// 	this.wallCollisions(grid);
// }

Entity.prototype.wallCollisions = function() {
	// var cellCoordinates = {
	// 	row: floor(this.pos.y / CELLSIZE),
	// 	col: floor(this.pos.x / CELLSIZE)
	// }
    var grid = this.grid.grid;

	var currentCell = this.grid.getCell(this.pos);
	var relativePos = createVector(this.pos.x % CELLSIZE, this.pos.y % CELLSIZE);

	var xShift = false;
	var yShift = false;

	if (relativePos.x < this.r) {
		var dx = this.r - relativePos.x;
		if (currentCell.col == 0) {
			var xShift = true;
		} else if (grid[currentCell.row][currentCell.col - 1].obstacle) {
			var xShift = true;
		}
	} else if (relativePos.x > CELLSIZE - this.r) {
		var dx = CELLSIZE - this.r - relativePos.x;
		if (currentCell.col == grid.length - 1) {
			var xShift = true;
		} else if (grid[currentCell.row][currentCell.col + 1].obstacle) {
			var xShift = true;
		}
	}

	if (relativePos.y < this.r) {
		var dy = this.r - relativePos.y;
		if (currentCell.row == 0) {
			var yShift = true;
		} else if (grid[currentCell.row - 1][currentCell.col].obstacle) {
			var yShift = true;
		}
	} else if (relativePos.y > CELLSIZE - this.r) {
		var dy = CELLSIZE - this.r - relativePos.y;
		if (currentCell.row == grid.length - 1) {
			var yShift = true;
		} else if (grid[currentCell.row + 1][currentCell.col].obstacle) {
			var yShift = true;
		}
	}

	if (xShift) {
		this.pos.x += dx;
	}
	if (yShift) {
		this.pos.y += dy;
	}
}

Entity.prototype.checkCollisions = function(all) {
	for (var i = 0; i < all.length; i++) {
		if (this !== all[i]) {
			var d = p5.Vector.dist(this.pos, all[i].pos);
			if (d < this.r + all[i].r) {
				this.collide(all[i], d - this.r - all[i].r);
			}
		}
	}
}

Entity.prototype.collide = function(other, d) {
	var awayVector = p5.Vector.sub(this.pos, other.pos);
	awayVector.setMag(-d * 0.5);
	this.pos.add(awayVector);
}

// Soldier.prototype.moveUsingArrowKeys = function() {
//     //Controls
//     if (keyIsDown(this.controls.left)) this.vel.x -= this.speed;
//     if (keyIsDown(this.controls.up)) this.vel.y -= this.speed;
//     if (keyIsDown(this.controls.right)) this.vel.x += this.speed;
//     if (keyIsDown(this.controls.down)) this.vel.y += this.speed;
// }

Entity.prototype.draw = function(cam, scr) {
	var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
	var drawR = cam.getDrawSize(this.r);
	scr.fill(255);
	scr.noStroke();
	scr.ellipse(drawPos.x, drawPos.y, drawR * 2);
}
