var GRIDSIZE = 15;

// Main object that controls the whole game
function Game(difficulty) {

	this.gridSize = GRIDSIZE;

    this.entities = [];
    this.bullets = [];
    this.particles = [];
	this.markings = []; // Floor markings (e.g. footprints);

	this.grid = new Grid(this, this.gridSize);
    this.player = new Player(this, 7, 7, [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW]);
    this.entities.push(this.player);

	// this.entities.push(new Hammerman(this, 1, 1));

	this.enemies = 0;

	this.score = 0;
	this.gameTime = 0;

	this.enemiesKilled = 0;
	this.powerupsUsed = 0;
	this.highestCombo = 0;

	this.spawnPoints = 0;
	this.counter = 0;
	this.timeSinceWave = 0;
	this.timeSinceEnemy = 0;

	if (difficulty == 0) {
		// Easy
		this.nextWave = 2;
		this.waveStep = 1;
	} else if (difficulty == 1) {
		// Normal
		this.nextWave = 5;
		this.waveStep = 2;
	} else if (difficulty == 2) {
		// Hard
		this.nextWave = 10;
		this.waveStep = 3;
	} else if (difficulty == 3) {
		// Insane
		this.nextWave = 20;
		this.waveStep = 4;
	}

	this.nextPowerUp = 0;
	this.powerupsToUse = [];

	this.difficulty = difficulty;

	this.combo = 0;
	this.lastKill = 55;

	this.gameOver = false;

	this.lastUpdate = Date.now();

	this.gameSpeed = 1;
	this.playSpeed = 1;
	this.slowMo = 0;
	this.modTime = 0;
	this.timeTick = false;

	// Maximum time between two kills for it to count as a combo
	this.comboTime = 90;

	this.shakeOffset = 0;
	this.shakeTimer = 0;

	this.coolness = 0;
	this.maxCoolness = 0;
}

Game.prototype.update = function() {
	this.updateTime();
	this.updateSpawns();
	this.updateObjects();
	// this.snapshot();
}

// Slow motion, frame rate, camera shake etc
Game.prototype.updateTime = function() {
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
	if (!this.gameOver) {
		this.gameTime += dt;
	}

	this.timeTick = false;
	this.modTime += 1;
	while (this.modTime > 1) {
		this.modTime--;
		this.timeTick = true;
	}

	if (this.lastKill < this.comboTime) {
		this.lastKill += this.gameSpeed;
	} else {
		this.combo = 0;
	}

	this.shakeOffset += this.gameSpeed;

	if (this.shakeTimer > 0) {
		this.shakeTimer -= this.gameSpeed;
	} else {
		this.shakeTimer = 0;
	}

	for (var i = 0; i < this.timeTick; i++) {
		this.coolness = this.coolness * 0.99;
	}
}

// Enemy spawns and power up spawns
Game.prototype.updateSpawns = function() {
	// Enemy spawning
	this.timeSinceWave += this.gameSpeed;
	this.timeSinceEnemy += this.gameSpeed;

	// If it has been 20 seconds since the last wave or all enemies of this wave have been killed
	if (this.timeSinceWave > 1200 || (this.spawnPoints < 1 && this.enemies == 0)) {
		this.spawnPoints += this.nextWave;
		// Each wave gets slightly harder
		this.nextWave += this.waveStep;
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

	// Powerup spawning
	if (this.nextPowerUp <= 0) {
		var powerup = this.randomPowerUps();
		// console.log(this.powerupsToUse);
		// console.log(this.randomPowerUps());
		var cell = this.randomCell(0);
		if (powerup !== null) {
			cell.setPowerUp(powerup);
			// this.nextPowerUp = sq(random(3, 7)) * (60 - this.score * 0.0003);
			// this.nextPowerUp = 60;
		}
		this.nextPowerUp = sq(random(3, 7)) * (60 - this.score * 0.0003);
	} else {
		this.nextPowerUp -= this.gameSpeed;
	}

}

// Updates all game objects (e.g. entities, bullets, particles)
Game.prototype.updateObjects = function() {
	for (var i = 0; i < powerups.length; i++) {
		powerups[i].update(this);
	}

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
			if (bullet instanceof Bullet) {
				this.particleExplosion(bullet.pos, bullet.vel.mag() * 0.5, 50, bullet.vel.heading(), PI * 0.25, createVector(0, 0), 15, 1, 10, 3, color(255));
				// this.smokeExplosion(bullet.pos, 1, 50, bullet.vel.heading(), PI * 0.05, 40, 5, 10, 5, color(255));
			}
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

	for (var i = 0; i < this.markings.length; i++) {
        if (this.markings[i].finished) {
            this.markings.splice(i, 1);
        } else {
			this.markings[i].update();
		}
	}
}

// When an enemy dies
Game.prototype.enemyDeath = function(enemy) {
	if (!this.gameOver) {
		// Increase combo
		this.combo++;
		if (this.combo > this.highestCombo) {
			this.highestCombo = this.combo;
		}

		this.lastKill = 0;

		// Set slow motion
		this.slowMotion(60, 0.3);

		var combo = this.combo;
		if (combo > 10) {
			combo = 10;
		}

		// Increase score
		this.score += enemy.scoreValue * combo;

		// this.coolness += 200;

		this.enemiesKilled++;
	}
}

// Sets the game to slow motion
Game.prototype.slowMotion = function(time, speed) {
	if (this.playSpeed >= speed) {
		this.playSpeed = speed;
		this.slowMo = time;
	}
}

Game.prototype.convertToSnap = function() {
	var entitiesSnap = [];
    for (var i = 0; i < this.entities.length; i++) {
        entitiesSnap.push(this.entities[i].convertToSnap());
    }
	var bulletsSnap = [];
    for (var i = 0; i < this.bullets.length; i++) {
        bulletsSnap.push(this.bullets[i].convertToSnap());
    }
	var particlesSnap = [];
    for (var i = 0; i < this.particles.length; i++) {
        particlesSnap.push(this.particles[i].convertToSnap());
    }
	var markingsSnap = [];
    for (var i = 0; i < this.markings.length; i++) {
        markingsSnap.push(this.markings[i].convertToSnap());
    }

	return {
		dt: this.playSpeed,
		grid: this.grid.convertToSnap(),
		entities: entitiesSnap,
		bullets: bulletsSnap,
		particles: particlesSnap,
		markings: markingsSnap,
		shakeTimer: this.shakeTimer,
		shakeOffset: this.shakeOffset
	}
}

function drawGame(x, y, z, params) {
	// background(30, 40, 80);

	push();
	translate(x, y);

	push();
	var shakeMag = params.shakeTimer * 0.25;
	if (shakeMag > 3) {
		shakeMag = 3;
	}
	var shakeV = createVector(noise(params.shakeOffset + 1000000) - 0.5, noise(params.shakeOffset) - 0.5).setMag(shakeMag);
	translate(shakeV);

	// this.grid.draw();
	// var gridParams = params.grid.convertToSnap();
	drawGrid(z, params.grid);

	// Draws all game objects

	for (var i = 0; i < params.markings.length; i++) {
		// var params = params.markings[i].convertToSnap();
		drawFootprint(z, params.markings[i]);
		// this.markings[i].draw();

	}

	// Walls are on top of floor markings
	// this.grid.drawWalls();
	drawGridWalls(z, params.grid);

	for (var i = 0; i < params.entities.length; i++) {
		// if (!this.entities[i].hide) {
			// this.entities[i].draw();
			// var params = this.entities[i].convertToSnap();
			drawEntity(z, params.entities[i]);
		// }
	}

	for (var i = 0; i < params.bullets.length; i++) {
		var p = params.bullets[i];
		switch(p.type) {
			case 0:
			drawBullet(z, p);
			break;
			case 1:
			drawDisc(z, p);
			break;
		}
		// this.bullets[i].draw();
	}

    for (var i = 0; i < params.entities.length; i++) {
        // if (!this.entities[i].hide) {//&& this.entities[i].drawWeapon !== undefined) {
            // this.entities[i].drawWeapon();
			// var params = this.entities[i].convertToSnap();
			drawEntityWeapon(z, params.entities[i]);
        // }
	}

	for (var i = 0; i < params.particles.length; i++) {
		var p = params.particles[i];
		switch(p.type) {
			case 0:
			drawParticle(z, p);
			break;
			case 1:
			drawSmokeParticle(z, p);
			break;
		}
		// this.particles[i].draw();
	}

	pop();
	pop();
}

Game.prototype.draw = function() {
	background(30, 40, 80);

	push();
	var shakeMag = this.shakeTimer * 0.25;
	if (shakeMag > 3) {
		shakeMag = 3;
	}
	var shakeV = createVector(noise(this.shakeOffset + 1000000) - 0.5, noise(this.shakeOffset) - 0.5).setMag(shakeMag);
	translate(shakeV);

	// this.grid.draw();
	var gridParams = this.grid.convertToSnap();
	drawGrid(xOff, yOff, zoom, gridParams);

	// Draws all game objects

	for (var i = 0; i < this.markings.length; i++) {
		var params = this.markings[i].convertToSnap();
		drawFootprint(xOff, yOff, zoom, params);
		// this.markings[i].draw();

	}

	// Walls are on top of floor markings
	// this.grid.drawWalls();
	drawGridWalls(xOff, yOff, zoom, gridParams);

	for (var i = 0; i < this.entities.length; i++) {
		if (!this.entities[i].hide) {
			// this.entities[i].draw();
			var params = this.entities[i].convertToSnap();
			drawEntity(xOff, yOff, zoom, params);
		}
	}

	for (var i = 0; i < this.bullets.length; i++) {
		var params = this.bullets[i].convertToSnap();
		switch(params.type) {
			case 0:
			drawBullet(xOff, yOff, zoom, params);
			break;
			case 1:
			drawDisc(xOff, yOff, zoom, params);
			break;
		}
		// this.bullets[i].draw();
	}

    for (var i = 0; i < this.entities.length; i++) {
        if (!this.entities[i].hide) {//&& this.entities[i].drawWeapon !== undefined) {
            // this.entities[i].drawWeapon();
			var params = this.entities[i].convertToSnap();
			drawEntityWeapon(xOff, yOff, zoom, params);
        }
	}

	for (var i = 0; i < this.particles.length; i++) {
		var params = this.particles[i].convertToSnap();
		switch(params.type) {
			case 0:
			drawParticle(xOff, yOff, zoom, params);
			break;
			case 1:
			drawSmokeParticle(xOff, yOff, zoom, params);
			break;
		}
		// this.particles[i].draw();
	}

	pop();
}
