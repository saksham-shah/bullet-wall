// var entities = [];
// var bullets = [];
// var grid, cam;
// // const CELLSIZE = 30;
// const GRIDSIZE = 10;
var dt;

var GRIDSIZE = 15;

function Game() {

	this.gridSize = GRIDSIZE;

    this.entities = [];
    this.bullets = [];
    this.particles = [];

	this.grid = new Grid(this, this.gridSize);
	// this.cam = createGameCam(0, 0, width, height);
    this.player = new Player(this, 7, 7, [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW]);
    // var entity = new EnemyFast(this, gridSize - 1, gridSize - 1);
    this.entities.push(this.player);
    // this.entities.push(entity)

    // this.cam.follow(this.player.pos, POSITION);
    // this.cam.follow({x: this.gridSize * CELLSIZE * 0.5, y: this.gridSize * CELLSIZE * 0.5, z: 1}, POSITION, ZOOM);

	this.score = 0;
	this.spawnPoints = 0;
	this.counter = 0;
	this.timeSinceWave = 0;
	this.nextWave = 5;
	this.timeSinceEnemy = 0;

	this.combo = 0;
	this.lastKill = 55;

	this.gameOver = false;

	this.lastUpdate = Date.now();

	this.gameSpeed = 1;
	this.playSpeed = 1;
	this.slowMo = 0;
}

Game.prototype.update = function() {
	// Calculate Delta time in order to have smooth movement
    var now = Date.now();
    var dt = (now - this.lastUpdate) / (1000 / 60); //dt will be 1 at 60fps
    this.lastUpdate = now;
	if (dt > 3) {
		dt = 3;
	}

	// dt = dt * this.gameSpeed;
	if (this.slowMo < 0) {
		this.playSpeed = 1;
	} else {
		// this.slowMo -= dt / this.gameSpeed;
		this.slowMo -= dt;
	}

	this.gameSpeed = this.playSpeed * dt;

	if (this.lastKill < 75) {
		this.lastKill += this.gameSpeed;
		// if (this.lastKill > 55) {
		// 	this.lastKill = 55;
		// }
	} else {
		this.combo = 0;
	}

	// if (random() < 0.005) {
	// 	// var row = floor(random(this.gridSize));
	// 	// var col = floor(random(this.gridSize));
	// 	// var cell = this.grid.grid[row][col];
	// 	// if (cell.wall == 0 && p5.Vector.dist(cell.pos, this.player.pos) > CELLSIZE * 2) {
	// 	// 	this.entities.push(new EnemyFast(this, row, col));
	// 	// }
	// 	var cell = this.randomCell();
	// 	this.entities.push(new EnemyFast(this, cell.row, cell.col));
	// }

	this.timeSinceWave += this.gameSpeed;
	this.timeSinceEnemy += this.gameSpeed;

	if (this.timeSinceWave > 1200 || (this.spawnPoints <= 0 && this.entities.length == 1)) {
		this.spawnPoints += this.nextWave;
		this.nextWave += 1;
		// console.log(this.spawnPoints);
		this.timeSinceWave = 0;
	}

	if (this.counter < 0) {
		this.counter = 30;
		if (random() < this.spawnPoints * 0.025 || this.timeSinceEnemy > 180) {
			this.spawnEnemy();
			// console.log(this.spawnPoints);
			this.timeSinceEnemy = 0;
		}
	} else {
		this.counter -= this.gameSpeed;
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
        	this.particleExplosion(bullet.pos, bullet.vel.mag() * 0.5, 50, bullet.vel.heading(), PI * 0.25, createVector(0, 0), 15, 1, 10, 3, color(255));
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

	// this.cam.update();
}

Game.prototype.enemyDeath = function(enemy) {
	if (!this.gameOver) {
		this.combo++;
		this.lastKill = 0;
		this.slowMotion(60, 0.3);

		var combo = this.combo;
		if (combo > 10) {
			combo = 10;
		}

		this.score += enemy.scoreValue * combo;
	}
}

Game.prototype.particleExplosion = function(pos, speed, speedErr, angle, angleErr, acc, life, lifeErr, num, r, colour, cell) {
	var speedErrNum = speed * speedErr * 0.01;
	// var angleErrNum = angle * angleErr * 0.01;

	for (var i = 0; i < num; i++) {
		if (cell !== undefined) {
			pos = createVector(cell.pos.x + random(CELLSIZE), cell.pos.y + random(CELLSIZE));
		}
		var vel = p5.Vector.fromAngle(random(angle - angleErr, angle + angleErr)).setMag(random(speed - speedErrNum, speed + speedErrNum));
		life += random(lifeErr);
		// var vel = p5.Vector.fromAngle(random(angle - 1, angle + 1)).setMag(random(speed - speedErrNum, speed + speedErrNum));
		var particle = new Particle(this, pos, vel, acc, r, life, colour, cell);
		this.particles.push(particle);
	}
}

Game.prototype.slowMotion = function(time, speed) {
	if (this.playSpeed >= speed) {
		this.playSpeed = speed;
		this.slowMo = time;
	}

	// this.gameSpeed = speed;
}

Game.prototype.draw = function() {



	// this.cam.screen.background(30, 40, 80);
	// this.cam.draw(this.grid);

	// for (var i = 0; i < this.entities.length; i++) {
	// 	if (!this.entities[i].hide) {
	// 		this.cam.draw(this.entities[i]);
	// 	}
	// }

	// for (var i = 0; i < this.bullets.length; i++) {
	// 	this.cam.draw(this.bullets[i]);
	// }

    // for (var i = 0; i < this.entities.length; i++) {
    //     if (!this.entities[i].hide && this.entities[i].drawWeapon !== undefined) {
    //         this.entities[i].drawWeapon(this.cam, this.cam.screen);
    //     }
	// }

	// for (var i = 0; i < this.particles.length; i++) {
    //     this.cam.draw(this.particles[i]);
	// }

	// this.cam.drawToCanvas();

	background(30, 40, 80);
	this.grid.draw();
	//
	for (var i = 0; i < this.entities.length; i++) {
		if (!this.entities[i].hide) {
			// this.cam.draw(this.entities[i]);
			this.entities[i].draw();
		}
	}
	//
	for (var i = 0; i < this.bullets.length; i++) {
		// this.cam.draw(this.bullets[i]);
		this.bullets[i].draw();
	}
	//
    for (var i = 0; i < this.entities.length; i++) {
        if (!this.entities[i].hide && this.entities[i].drawWeapon !== undefined) {
            this.entities[i].drawWeapon();
        }
	}
	//
	for (var i = 0; i < this.particles.length; i++) {
        // this.cam.draw(this.particles[i]);
		this.particles[i].draw();
	}
}
