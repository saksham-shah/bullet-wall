var GRIDSIZE = 15;

// Main object that controls the whole game
function Game() {

	this.gridSize = GRIDSIZE;

    this.entities = [];
    this.bullets = [];
    this.particles = [];

	this.grid = new Grid(this, this.gridSize);
    this.player = new Player(this, 7, 7, [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW]);
    this.entities.push(this.player);

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

	this.gameTime = 0;

	// Maximum time between two kills for it to count as a combo
	this.comboTime = 90;
}

Game.prototype.update = function() {
	// Calculate Delta time in order to have smooth movement
    var now = Date.now();
    var dt = (now - this.lastUpdate) / (1000 / 60); //dt will be 1 at 60fps
    this.lastUpdate = now;
	if (dt > 3) {
		dt = 3;
	}

	// If the slow motion is over
	if (this.slowMo < 0) {
		this.playSpeed = 1;
	} else {
		this.slowMo -= dt;
	}

	this.gameSpeed = this.playSpeed * dt;
	this.gameTime += this.gameSpeed;

	if (this.lastKill < this.comboTime) {
		this.lastKill += this.gameSpeed;
	} else {
		this.combo = 0;
	}

	this.timeSinceWave += this.gameSpeed;
	this.timeSinceEnemy += this.gameSpeed;

	// If it has been 20 seconds since the last wave or all enemies of this wave have been killed
	if (this.timeSinceWave > 1200 || (this.spawnPoints < 1 && this.entities.length == 1)) {
		this.spawnPoints += this.nextWave;
		// Each wave gets slightly harder
		this.nextWave += 1;
		this.timeSinceWave = 0;
	}

	if (this.counter < 0) {
		this.counter = 30;
		// The more spawnPoints there are, the higher chance of an enemy spawning
		// This means whenever a new wave begins, lots of enemies suddenly spawn
		if (random() < this.spawnPoints * 0.025 || this.timeSinceEnemy > 180) {
			this.spawnEnemy();
			this.timeSinceEnemy = 0;
		}
	} else {
		this.counter -= this.gameSpeed;
	}

	// Updates all game objects (e.g. entities, bullets, particles)

	for (var i = 0; i < this.entities.length; i++) {
		// If the entity is dead, remove it from the list
		if (this.entities[i].dead) {
			this.entities.splice(i, 1);
		} else {
			this.entities[i].move(this.entities);
		}
	}

    for (var i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].hit) {
        	var bullet = this.bullets[i];
        	this.particleExplosion(bullet.pos, bullet.vel.mag() * 0.5, 50, bullet.vel.heading(), PI * 0.25, createVector(0, 0), 15, 1, 10, 3, color(255));
            this.bullets.splice(i, 1);
        } else {
			this.bullets[i].update(this.entities);
		}
	}

	for (var i = 0; i < this.particles.length; i++) {
        if (this.particles[i].finished) {
            this.particles.splice(i, 1);
        } else {
			this.particles[i].update();
		}
	}
}

// When an enemy dies
Game.prototype.enemyDeath = function(enemy) {
	if (!this.gameOver) {
		// Increase combo
		this.combo++;
		this.lastKill = 0;

		// Set slow motion
		this.slowMotion(60, 0.3);

		var combo = this.combo;
		if (combo > 10) {
			combo = 10;
		}

		// Increase score
		this.score += enemy.scoreValue * combo;
	}
}

// Creates particles (for animation only, no impact on gameplay)
Game.prototype.particleExplosion = function(pos, speed, speedErr, angle, angleErr, acc, life, lifeErr, num, r, colour, cell) {
	var speedErrNum = speed * speedErr * 0.01;

	for (var i = 0; i < num; i++) {
		if (cell !== undefined) {
			pos = createVector(cell.pos.x + random(CELLSIZE), cell.pos.y + random(CELLSIZE));
		}
		var vel = p5.Vector.fromAngle(random(angle - angleErr, angle + angleErr)).setMag(random(speed - speedErrNum, speed + speedErrNum));
		life += random(lifeErr);
		var particle = new Particle(this, pos, vel, acc, r, life, colour, cell);
		this.particles.push(particle);
	}
}

// Sets the game to slow motion
Game.prototype.slowMotion = function(time, speed) {
	if (this.playSpeed >= speed) {
		this.playSpeed = speed;
		this.slowMo = time;
	}
}

Game.prototype.draw = function() {
	background(30, 40, 80);
	this.grid.draw();

	// Draws all game objects

	for (var i = 0; i < this.entities.length; i++) {
		if (!this.entities[i].hide) {
			this.entities[i].draw();
		}
	}

	for (var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].draw();
	}

    for (var i = 0; i < this.entities.length; i++) {
        if (!this.entities[i].hide && this.entities[i].drawWeapon !== undefined) {
            this.entities[i].drawWeapon();
        }
	}

	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].draw();
	}
}
