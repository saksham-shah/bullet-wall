var xOff;
var yOff;
var zoom;

// Recalculates the position of the game grid when the window is resized
function calcOffsets() {
    zoom = width / 1200;
	if (height / 800 < zoom) {
		zoom = height / 800;
	}

    xOff = (width - GRIDSIZE * CELLSIZE * zoom) * 0.5;
    yOff = (height - GRIDSIZE * CELLSIZE * zoom) * 0.5;
}

// Converts a game position to a draw position on the screen
function getDrawPos(gamePos) {
    return p5.Vector.add(p5.Vector.mult(gamePos, zoom), createVector(xOff, yOff));
}

// Returns the game position of the mouse
function getMousePos() {
    var mousePos = createVector(mouseX, mouseY).sub(createVector(xOff, yOff));
    return mousePos.div(zoom);
}
