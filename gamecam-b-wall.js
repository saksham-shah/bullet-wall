var xOff;
var yOff;
var zoom;

// Recalculates the position of the game grid when the window is resized
function calcOffsets() {
    screenZoom = width / 1920;
	if (height / 1080 < screenZoom) {
        screenZoom = height / 10800;
	}
    zoom = 810 * screenZoom / (GRIDSIZE * CELLSIZE);

    xOff = 555 * screenZoom;
    yOff = 135 * screenZoom;
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
