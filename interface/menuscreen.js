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

    this.playButton = new Button(this, width * 0.5 - 200 * zoom, height * 0.5 - 100 * zoom, 400 * zoom, 200 * zoom, "PLAY", 100 * zoom);
    this.difficultyButton = new Button(this, width * 0.5 - 125 * zoom, height * 0.8, 250 * zoom, 100 * zoom, DIFFICULTIES[this.difficulty], 50 * zoom);

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
    background(30, 40, 80);

    this.title.draw(width * 0.5, height * 0.2, 150 * zoom);

    if (this.title.isFinished()) {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw();
        }
    }
}
