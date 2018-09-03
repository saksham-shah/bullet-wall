var player, grid, cam;
// const CELLSIZE = 30;
const GRIDSIZE = 3;

function setup() {
	createCanvas(600, 400);
	grid = new Grid(GRIDSIZE);
	cam = createGameCam(0, 0, width, height);
	var pos = {x: 0, y: 0};//new Soldier(0, 0, 10, [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW]);
    player = new Player(0, 0, 10, grid, [UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW]);
	// soldiers.push(player);
	cam.follow(player.pos, POSITION);

	// for (var i = 0; i < 10; i++) {
	// 	soldiers.push(new Soldier(floor(random(GRIDSIZE)), floor(random(GRIDSIZE)), 10));
	// }

	// pathGrid = new PathGrid(this.grid.grid);
}

function draw() {

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


	// for (var i = 0; i < soldiers.length; i++) {
	// 	soldiers[i].update(soldiers, this.grid.grid);
	// }
    player.move([player]);

	cam.update();


	cam.screen.background(45, 60, 120);
	cam.draw(grid);

	// for (var i = 0; i < soldiers.length; i++) {
	// 	cam.draw(soldiers[i]);
	// }
    cam.draw(player);

	cam.drawToCanvas();
}
