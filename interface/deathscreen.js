// Screen which displays score after the player dies
function DeathScreen() {
    this.game = null;

    this.createButtons();
}

DeathScreen.prototype.createButtons = function() {
    this.buttons = [];

    this.restartButton = new Button(this, width * 0.5 - 150 * zoom, height * 0.75, 300 * zoom, 150 * zoom, "RESTART", 50 * zoom);

    this.buttons.push(this.restartButton);
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
        gs.newGame();
    }
}

DeathScreen.prototype.draw = function() {
    background(30, 40, 80);

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
