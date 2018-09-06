// var entities = [];
// var bullets = [];
// var grid, cam;
// // const CELLSIZE = 30;
// const GRIDSIZE = 10;

function Game(gridSize) {

    this.entities = [];
    this.bullets = [];
    this.particles = [];

	this.grid = new Grid(this, gridSize);
	this.cam = createGameCam(0, 0, width, height);
    this.player = new Player(this, 0, 0, [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW]);
    var entity = new Entity(this, 0, 1, 10);
    this.entities.push(this.player);
    this.entities.push(entity)

    // this.cam.follow(this.player.pos, POSITION);
    this.cam.follow({x: gridSize * CELLSIZE * 0.5, y: gridSize * CELLSIZE * 0.5}, POSITION);
}

Game.prototype.update = function() {

	for (var i = 0; i < this.entities.length; i++) {
		this.entities[i].move(this.entities);
	}

    for (var i = 0; i < this.bullets.length; i++) {
		this.bullets[i].update();
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
        if (this.entities[i].gun !== undefined) {
            this.cam.draw(this.entities[i].gun);
        }
	}

	for (var i = 0; i < this.particles.length; i++) {
        this.cam.draw(this.particles[i]);
	}

	this.cam.drawToCanvas();
}