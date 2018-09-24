// Screen which displays score after the player dies
function DeathScreen() {
    this.game = null;

    this.createButtons();

    this.difficultyText = new TypeText();
}

DeathScreen.prototype.createButtons = function() {
    this.buttons = [];

    this.restartButton = new Button(this, width * 0.5 - 375 * zoom, height * 0.75, 350 * zoom, 150 * zoom, "PLAY AGAIN", 50 * zoom);
    this.menuButton = new Button(this, width * 0.5 + 25 * zoom, height * 0.75, 350 * zoom, 150 * zoom, "MENU", 50 * zoom);

    this.buttons.push(this.restartButton);
    this.buttons.push(this.menuButton);
}

// When the player dies, the game is sent to DS
DeathScreen.prototype.newDeath = function(game) {
    this.game = game;

    var secs = this.game.gameTime / 60;
    var min = floor(secs / 60);
    var sec = floor(secs % 60);

    var timeText = leadingZeroes(min) + ":" + leadingZeroes(sec);

    this.textLines = new TypeLines("GAME OVER", "YOU SCORED", String(this.game.score), "AND SURVIVED FOR " + timeText);

}

DeathScreen.prototype.update = function() {
    this.textLines.update();

    if (this.textLines.isFinished()) {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].update();
        }
    }
}

DeathScreen.prototype.buttonClicked = function(button) {
    // Restart game
    if (button === this.restartButton) {
        nextScreen = gs;
        gs.newGame(this.game.difficulty);
    } else if (button === this.menuButton) {
        nextScreen = ms;
    }
}

DeathScreen.prototype.draw = function() {
    background(30, 40, 80);

    fill(45, 60, 120);
    noStroke();
    rect(0, 0, width, height * 0.1);

    this.difficultyText.draw(width * 0.5, height * 0.05, 30 * zoom, DIFFICULTIES[this.game.difficulty]);
    this.textLines.draw(width * 0.5, height * 0.2, height * 0.15, 100 * zoom, 50 * zoom, 150 * zoom, 50 * zoom);

    if (this.textLines.isFinished()) {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw();
        }
    }
}

function leadingZeroes(num) {
    num = String(num);
    if (num.length < 2) {
        num = "0" + num;
    }
    return num;
}
