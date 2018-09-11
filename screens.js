function GameScreen() {
    this.game = null;
}

GameScreen.prototype.newGame = function() {
    this.game = new Game();
}

GameScreen.prototype.update = function() {
    if (this.game !== null) {
        this.game.update();
    }
}

GameScreen.prototype.draw = function() {
    if (this.game !== null) {
        this.game.draw();
    }
}
