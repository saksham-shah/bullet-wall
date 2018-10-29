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

    switch (this.mode) {
        case 0: // Cross
        stroke(theme.cursor);
        strokeWeight(r * 0.5);
        line(0, -r, 0, r);
        line(-r, 0, r, 0);
        break;

        case 1: // Bullet
        var c = theme.bullet.player.slice();
        c.push(150);
        fill(c);
        var c = theme.bullet.stroke.slice();
        c.push(150);
        stroke(c);
        strokeWeight(r * 0.25);
        ellipse(0, 0, r * 2);
        break;

        case 2: // Disc
        rotate(HALF_PI);
        strokeWeight(r * 0.25);
        var c = theme.bullet.discStroke.slice();
        c.push(150);
        stroke(c);
        var c = theme.bullet.discLeft.slice();
        c.push(150);
        fill(c);
        arc(0, 0, r * 2.5, r * 2.5, 0, PI, CHORD);
        var c = theme.bullet.discRight.slice();
        c.push(150);
        fill(c);
        arc(0, 0, r * 2.5, r * 2.5, -PI, 0, CHORD);
        line(r * 1.25, 0, - r * 1.25, 0);
        break;
    }

    pop();
}
