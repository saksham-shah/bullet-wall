// var entities = [];
// var bullets = [];
// var grid, cam;
// // const CELLSIZE = 30;
// const GRIDSIZE = 10;

function Game() {

	this.gridSize = 15;

    this.entities = [];
    this.bullets = [];
    this.particles = [];

	this.grid = new Grid(this, this.gridSize);
	this.cam = createGameCam(0, 0, width, height);
    this.player = new Player(this, 1, 7, [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW]);
    // var entity = new EnemyFast(this, gridSize - 1, gridSize - 1);
    this.entities.push(this.player);
    // this.entities.push(entity)

    // this.cam.follow(this.player.pos, POSITION);
    this.cam.follow({x: this.gridSize * CELLSIZE * 0.5, y: this.gridSize * CELLSIZE * 0.5, z: 1}, POSITION, ZOOM);
}

Game.prototype.update = function() {

	if (random() < 0.005) {
		var row = floor(random(this.gridSize));
		var col = floor(random(this.gridSize));
		var cell = this.grid.grid[row][col];
		if (cell.wall == 0 && p5.Vector.dist(cell.pos, this.player.pos) > CELLSIZE * 2) {
			this.entities.push(new EnemyFast(this, row, col));
		}
	}

	for (var i = 0; i < this.entities.length; i++) {
		this.entities[i].move(this.entities);
		if (this.entities[i].dead) {
			this.entities.splice(i, 1);
		}
	}

    for (var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].update(this.entities);
        if (this.bullets[i].hit) {
        	var bullet = this.bullets[i];
        	this.particleExplosion(bullet.pos, bullet.vel.mag() * 0.5, 50, bullet.vel.heading(), PI * 0.25, createVector(0, 0), 15, 10, 7, color(255));
            this.bullets.splice(i, 1);
        }
	}

	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].update();
        if (this.particles[i].finished) {
            this.particles.splice(i, 1);
        }
	}

	// var mouseCell = this.grid.getCell(this.cam.getMousePos());
	// if (mouseCell !== null) {
	// 	var path = findPath(this.grid.grid, mouseCell, this.grid.grid[0][0]);
	// 	for (var i = 0; i < path.length; i++) {
	// 		path[i].path = true;
	// 	}
	// }

	this.cam.update();
}

Game.prototype.particleExplosion = function(pos, speed, speedErr, angle, angleErr, acc, life, num, r, colour, cell) {
	var speedErrNum = speed * speedErr * 0.01;
	// var angleErrNum = angle * angleErr * 0.01;

	for (var i = 0; i < num; i++) {
		if (cell !== undefined) {
			pos = createVector(cell.pos.x + random(CELLSIZE), cell.pos.y + random(CELLSIZE));
		}
		var vel = p5.Vector.fromAngle(random(angle - angleErr, angle + angleErr)).setMag(random(speed - speedErrNum, speed + speedErrNum));
		// var vel = p5.Vector.fromAngle(random(angle - 1, angle + 1)).setMag(random(speed - speedErrNum, speed + speedErrNum));
		var particle = new Particle(this, pos, vel, acc, r, life, colour, cell);
		this.particles.push(particle);
	}
}

Game.prototype.draw = function() {


	this.cam.screen.background(30, 40, 80);
	this.cam.draw(this.grid);

	for (var i = 0; i < this.entities.length; i++) {
		this.cam.draw(this.entities[i]);
	}

    for (var i = 0; i < this.bullets.length; i++) {
		this.cam.draw(this.bullets[i]);
	}

    for (var i = 0; i < this.entities.length; i++) {
        if (this.entities[i].drawWeapon !== undefined) {
            this.entities[i].drawWeapon(this.cam, this.cam.screen);
        }
	}

	for (var i = 0; i < this.particles.length; i++) {
        this.cam.draw(this.particles[i]);
	}

	this.cam.drawToCanvas();
}
