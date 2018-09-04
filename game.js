// var entities = [];
// var bullets = [];
// var grid, cam;
// // const CELLSIZE = 30;
// const GRIDSIZE = 10;

function Game(gridSize) {

    this.entities = [];
    this.bullets = [];

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
        if (this.bullets[i].hit == true) {
            this.bullets.splice(i, 1);
        }
	}

	this.cam.update();
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

	this.cam.drawToCanvas();
}
