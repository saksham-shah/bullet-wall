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
        var r = screenZoom * 0.75 * 7;
    } else {
        var r = screenZoom * 1 * 7;
    }

    var c;

    switch (this.mode) {
        case 0: // Cross
        stroke(theme.cursor);
        strokeWeight(r * 0.75);
        line(0, -r * 1.5, 0, r * 1.5);
        line(-r * 1.5, 0, r * 1.5, 0);
        break;

        case 1: // Bullet
        c = color(theme.bullet.player);
        c.setAlpha(150);
        fill(c);
        c = color(theme.bullet.stroke);
        c.setAlpha(150);
        stroke(c);
        strokeWeight(r * 0.4);
        ellipse(0, 0, r * 3);
        break;

        case 2: // Disc
        rotate(HALF_PI);
        strokeWeight(r * 0.4);
        c = color(theme.bullet.discStroke);
        c.setAlpha(150);
        stroke(c);
        c = color(theme.bullet.discLeft);
        c.setAlpha(150);
        fill(c);
        arc(0, 0, r * 4, r * 4, 0, PI, CHORD);
        c = color(theme.bullet.discRight);
        c.setAlpha(150);
        fill(c);
        arc(0, 0, r * 4, r * 4, -PI, 0, CHORD);
        line(r * 2, 0, - r * 2, 0);
        break;
    }

    pop();
}
