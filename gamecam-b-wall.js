var XOFF = 300;
var YOFF = 100;
var ZOOM = 2;

function getDrawPos(gamePos) {
    return p5.Vector.add(p5.Vector.mult(gamePos, ZOOM), createVector(XOFF, YOFF));
}

function getMousePos() {
    var mousePos = createVector(mouseX, mouseY).sub(createVector(XOFF, YOFF));
    return mousePos.div(ZOOM);
}

function mousePressed() {
    console.log(mouseX);
    console.log(mouseY);

}
