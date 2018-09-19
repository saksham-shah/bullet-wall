var xOff = 0;
var yOff = 0;
// var ZOOM = w / 1200;

function calcOffsets() {
    xOff = (width - GRIDSIZE * CELLSIZE * zoom) * 0.5;
    yOff = (height - GRIDSIZE * CELLSIZE * zoom) * 0.5;
}

function getDrawPos(gamePos) {
    return p5.Vector.add(p5.Vector.mult(gamePos, zoom), createVector(xOff, yOff));
}

function getMousePos() {
    var mousePos = createVector(mouseX, mouseY).sub(createVector(xOff, yOff));
    return mousePos.div(zoom);
}

function mousePressed() {
    console.log(mouseX);
    console.log(mouseY);

}
