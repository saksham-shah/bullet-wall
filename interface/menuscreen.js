// Starting menu screen of the game
function MenuScreen() {

    this.createButtons();

    this.title = new TypeText("BULLET WALL");
}

MenuScreen.prototype.createButtons = function() {
    this.buttons = [];

    this.playButton = new Button(this, width * 0.5 - 200 * zoom, height * 0.5 - 100 * zoom, 400 * zoom, 200 * zoom, "PLAY", 100 * zoom);

    this.buttons.push(this.playButton);
}

MenuScreen.prototype.update = function() {
    this.title.startTyping();

    if (this.title.done) {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].update();
        }
    }
}

MenuScreen.prototype.buttonClicked = function(button) {
    // Start game
    if (button === this.playButton) {
        nextScreen = gs;
        gs.newGame();
    }
}

MenuScreen.prototype.draw = function() {
    background(30, 40, 80);

    this.title.draw(width * 0.5, height * 0.2, 150 * zoom);

    if (this.title.done) {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw();
        }
    }
}
