// Words for each of the difficulties
var DIFFICULTIES = ["EASY", "NORMAL", "HARD", "INSANE"];

// Starting menu screen of the game
function MenuScreen() {

    this.difficulty = 1;

    this.createButtons();

    this.title = new TypeText("BULLET WALL");
}

MenuScreen.prototype.createButtons = function() {
    this.buttons = [];

    this.playButton = new Button(this, width * 0.5 - 200 * screenZoom, height * 0.5 - 100 * screenZoom, 400 * screenZoom, 200 * screenZoom, "PLAY", 100 * screenZoom);
    this.difficultyButton = new Button(this, width * 0.5 - 125 * screenZoom, height * 0.8, 250 * screenZoom, 100 * screenZoom, DIFFICULTIES[this.difficulty], 50 * screenZoom);

    this.buttons.push(this.playButton);
    this.buttons.push(this.difficultyButton);
}

MenuScreen.prototype.update = function() {
    this.title.startTyping();

    if (this.title.isFinished()) {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].update();
        }
    }
}

MenuScreen.prototype.buttonClicked = function(button) {
    // Start game
    if (button === this.playButton) {
        nextScreen = gs;
        gs.newGame(this.difficulty);
    } else if (button === this.difficultyButton) {
        this.difficulty = (this.difficulty + 1) % DIFFICULTIES.length;
        button.text = new TypeText(DIFFICULTIES[this.difficulty])
    }
}

MenuScreen.prototype.draw = function() {
    background(theme.background);

    this.title.draw(width * 0.5, height * 0.2, 150 * screenZoom);

    if (this.title.isFinished()) {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw();
        }
    }
}
