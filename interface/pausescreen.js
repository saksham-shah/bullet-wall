// Game paused
function PauseScreen() {
    this.pausedText = new TypeText("PAUSED");

    this.createButtons();
}

PauseScreen.prototype.createButtons = function() {
    this.buttons = [];

    this.resumeButton = new Button(this, width * 0.5 - 350 * screenZoom, height * 0.6, 300 * screenZoom, 150 * screenZoom, "RESUME", 50 * screenZoom);
    this.menuButton = new Button(this, width * 0.5 + 50 * screenZoom, height * 0.6, 300 * screenZoom, 150 * screenZoom, "MENU", 50 * screenZoom);

    this.buttons.push(this.resumeButton);
    this.buttons.push(this.menuButton);
}

PauseScreen.prototype.update = function() {
    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].update();
    }
}

PauseScreen.prototype.buttonClicked = function(button) {
    // Resume game
    if (button === this.resumeButton) {
        nextScreen = gs;
        gs.game.player.cooldown += 15;
    } else if (button === this.menuButton) {
        nextScreen = ms;
    }
}

PauseScreen.prototype.draw = function() {
    gs.draw();

    var c = theme.background.slice();
    c.push(150);
    fill(c);
    noStroke();

    rect(0, 0, width, height);

    this.pausedText.draw(width * 0.5, height * 0.3, 175 * screenZoom, "PAUSED");

    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].draw();
    }
}
