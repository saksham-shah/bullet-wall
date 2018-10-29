// Screen which displays score after the player dies
function DeathScreen() {
    this.stats = null;

    this.modeText = new TypeText();
    this.gameOverText = new TypeText("GAME OVER");

    this.clips = [];
    this.clipPlaying = null;

    this.createButtons();
}

DeathScreen.prototype.createButtons = function() {
    this.buttons = [];

    this.restartButton = new Button(this, width * 0.5 - 375 * screenZoom, height * 0.75, 350 * screenZoom, 150 * screenZoom, "PLAY AGAIN", 50 * screenZoom);
    this.menuButton = new Button(this, width * 0.5 + 25 * screenZoom, height * 0.75, 350 * screenZoom, 150 * screenZoom, "MENU", 50 * screenZoom);

    this.buttons.push(this.restartButton);
    this.buttons.push(this.menuButton);

    for (var i = 0; i < this.clips.length; i++) {
        this.clips[i].setPos(width * 0.575, height * 0.5 - width * 0.125, width * 0.25);
    }
}

// When the player dies, the game is sent to DS
DeathScreen.prototype.newDeath = function(stats) {
    this.stats = stats;
    this.clips = [];
    this.clips.push(this.stats.clip);

    var timeText = timeToText(this.stats.time);

    this.gameOverText.stopTyping();

    this.statsText = new TypeLines("TIME: " + timeText, "SCORE: " + String(this.stats.score), "DIFFICULTY: " + DIFFICULTIES[this.stats.difficulty], "ENEMIES KILLED: " + String(this.stats.enemies), "POWERUPS USED: " + String(this.stats.powerups), "HIGHEST COMBO: " + String(this.stats.combo) + "x");

}

DeathScreen.prototype.update = function() {
    this.gameOverText.startTyping();

    if (this.gameOverText.isFinished()) {
        this.statsText.update();

        if (this.statsText.isFinished()) {
            if (this.clipPlaying !== null) {
                this.clipPlaying.nextFrame();
            } else {
                for (var i = 0; i < this.buttons.length; i++) {
                    this.buttons[i].update();
                }
                for (var i = 0; i < this.clips.length; i++) {
                    this.clips[i].nextFrame();
                }
            }
        }
    }

    if (mouseIsPressed) {
        this.gameOverText.display();
        this.statsText.display();
    }
}

DeathScreen.prototype.mouseClicked = function() {
    if (this.statsText.isFinished()) {
        if (this.clipPlaying !== null && this.clipPlaying.mouseHovered()) {
            var play = this.clipPlaying.clicked();
            if (!play) {
                this.clipPlaying = null;
            }
        } else {
            for (var i = 0; i < this.clips.length; i++) {
                if (this.clips[i].mouseHovered()) {
                    var play = this.clips[i].clicked();
                    if (play) {
                        this.clipPlaying = this.clips[i]
                    }
                }
            }
        }
    }
}

DeathScreen.prototype.buttonClicked = function(button) {
    // Restart game
    if (button === this.restartButton) {
        nextScreen = gs;
        gs.newGame(this.stats.difficulty);
    } else if (button === this.menuButton) {
        nextScreen = ms;
    }
}

DeathScreen.prototype.getClipBounds = function() {
    if (this.clipHovered) {
        return [
            width * 0.5 - GRIDSIZE * CELLSIZE * zoom * 0.5,
            width * 0.5 + GRIDSIZE * CELLSIZE * zoom * 0.5,
            height * 0.5 - GRIDSIZE * CELLSIZE * zoom * 0.5,
            height * 0.5 + GRIDSIZE * CELLSIZE * zoom * 0.5
        ];
    } else {
        return [
            width * 0.7 - GRIDSIZE * CELLSIZE * zoom * 0.25,
            width * 0.7 + GRIDSIZE * CELLSIZE * zoom * 0.25,
            height * 0.5 - GRIDSIZE * CELLSIZE * zoom * 0.25,
            height * 0.5 + GRIDSIZE * CELLSIZE * zoom * 0.25
        ];
    }
}

DeathScreen.prototype.draw = function() {
    background(theme.background);

    fill(theme.deathHeader);
    noStroke();
    rect(0, 0, width, height * 0.1);

    this.modeText.draw(width * 0.5, height * 0.05, 30 * screenZoom, "CLASSIC");
    this.gameOverText.draw(width * 0.5, height * 0.2, 100 * screenZoom);

    if (this.gameOverText.isFinished()) {
        this.statsText.draw(width * 0.3, height * 0.32, height * 0.07, 40 * screenZoom);

        if (this.statsText.isFinished()) {
            for (var i = 0; i < this.buttons.length; i++) {
                this.buttons[i].draw();
            }

            for (var i = 0; i < this.clips.length; i++) {

                this.clips[i].draw(true);
            }

            if (this.clipPlaying !== null) {
                var c = theme.background.slice();
                c.push(150);
                fill(c);
                noStroke();
                rect(0, 0, width, height);
                this.clipPlaying.draw(false);
            }
        }
    }


}
