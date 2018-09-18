var XOFF = 300;
var YOFF = 100;
var ZOOM = 1;

function getDrawPos(gamePos) {
    return p5.Vector.add(gamePos, createVector(XOFF, YOFF));
}

function getMousePos() {
    var mousePos = createVector(mouseX - XOFF, mouseY - YOFF)
}

function mousePressed() {
    console.log(mouseX);
    console.log(mouseY);

}
