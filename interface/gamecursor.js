/*
Modes:

0: Arrow
1: Bullet
2: Disc
3: Spirit

}

*/

// Cursor which will be drawn on screen
function GameCursor() {
    this.mode = 0;
}

GameCursor.prototype.draw = function() {
    push();
    translate(mouseX, mouseY);
    if (mouseIsPressed) {
        var r = zoom * 0.75 * 5;
    } else {
        var r = zoom * 1 * 5;
    }

    switch (this.mode) {
        case 0: // Cross
        stroke(60, 80, 160);
        strokeWeight(4 * zoom);
        line(0, -r, 0, r);
        line(-r, 0, r, 0);
        break;

        case 1: // Bullet
        fill(200, 200, 250, 50);
        stroke(255, 50);
        strokeWeight(2 * zoom);
        ellipse(0, 0, r * 2);
        break;

        case 2: // Disc
        rotate(HALF_PI);
        strokeWeight(2 * zoom);
        stroke(75, 0, 125, 50);
        fill(150, 0, 250, 50);
        arc(0, 0, r * 2 * zoom, r * 2 * zoom, 0, PI, CHORD);
        fill(120, 0, 200, 50);
        arc(0, 0, r * 2 * zoom, r * 2 * zoom, -PI, 0, CHORD);
        line(r * zoom, 0, - r * zoom, 0);
        break;
    }

    pop();
}
