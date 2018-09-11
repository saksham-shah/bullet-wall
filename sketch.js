// var entities = [];
// var bullets = [];
// var grid, cam;
// // const CELLSIZE = 30;
// const GRIDSIZE = 10;

var game;
var gs;
var screen;

function setup() {
	createCanvas(1200, 800);

    // game = new Game();

	gs = new GameScreen();
	gs.newGame();
	screen = gs;


	// grid = new Grid(GRIDSIZE);
	// cam = createGameCam(0, 0, width, height);
	// var pos = {x: 0, y: 0};//new Soldier(0, 0, 10, [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW]);
    // var player = new Player(0, 0, 10, grid, [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW]);
    // var entity = new Entity(0, 1, 10, grid);
    // entities.push(player);
    // entities.push(entity)
	// // soldiers.push(player);
	// cam.follow(player.pos, POSITION);

	// for (var i = 0; i < 10; i++) {
	// 	soldiers.push(new Soldier(floor(random(GRIDSIZE)), floor(random(GRIDSIZE)), 10));
	// }

	// pathGrid = new PathGrid(this.grid.grid);
}

function draw() {


    screen.update();
    screen.draw();

	// var mousePos = cam.getMousePos();
	// var mouseRow = floor(mousePos.y / CELLSIZE);
	// var mouseCol = floor(mousePos.x / CELLSIZE);

	// if (mouseRow >= 0 && mouseRow < GRIDSIZE && mouseCol >= 0 && mouseCol < GRIDSIZE) {
	// 	grid.mouseCell(mouseRow, mouseCol);
	// }

	// if (mouseRow >= 0 && mouseRow < GRIDSIZE && mouseCol >= 0 && mouseCol < GRIDSIZE) {
	// 	var path = pathGrid.findPath(this.grid.grid[0][0], this.grid.grid[mouseRow][mouseCol]);
	// 	for (var i = 0; i < path.length; i++) {
	// 		grid.mouseCell(path[i].row, path[i].col);
	// 	}
	// }


	// for (var i = 0; i < entities.length; i++) {
	// 	entities[i].move(entities);
	// }
    //
    // for (var i = 0; i < bullets.length; i++) {
	// 	bullets[i].update();
	// }
    // // player.move([player, entity]);
    // // entity.move([player, entity]);
    //
	// cam.update();
    //
    //
	// cam.screen.background(45, 60, 120);
	// cam.draw(grid);
    //
	// for (var i = 0; i < entities.length; i++) {
	// 	cam.draw(entities[i]);
	// }
    //
    // for (var i = 0; i < bullets.length; i++) {
	// 	cam.draw(bullets[i]);
	// }
    //
    // for (var i = 0; i < entities.length; i++) {
    //     if (entities[i].gun !== undefined) {
    //         cam.draw(entities[i].gun);
    //     }
	// 	// cam.draw(entities[i]);
	// }
    // // cam.draw(player);
    // // cam.draw(entity);
    //
	// cam.drawToCanvas();
}
