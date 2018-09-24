// Game paused
function PauseScreen() {
    this.pausedText = new TypeText("PAUSED");

    this.createButtons();
}

PauseScreen.prototype.createButtons = function() {
    this.buttons = [];

    this.resumeButton = new Button(this, width * 0.5 - 350 * zoom, height * 0.6, 300 * zoom, 150 * zoom, "RESUME", 50 * zoom);
    this.menuButton = new Button(this, width * 0.5 + 50 * zoom, height * 0.6, 300 * zoom, 150 * zoom, "MENU", 50 * zoom);

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

    fill(30, 40, 80, 150);
    noStroke();

    rect(0, 0, width, height);

    // textSize(30);
    // textAlign(CENTER);
    // fill(255);
    // noStroke();
    //
    // text("PAUSED", width * 0.5, height * 0.5);

    this.pausedText.draw(width * 0.5, height * 0.3, 175 * zoom, "PAUSED");

    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].draw();
    }
}
