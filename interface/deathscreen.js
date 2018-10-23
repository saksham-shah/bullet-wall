// Screen which displays score after the player dies
function DeathScreen() {
    this.game = null;

    this.createButtons();

    this.modeText = new TypeText();
    this.gameOverText = new TypeText("GAME OVER");

    this.clipPlaying = false;
}

DeathScreen.prototype.createButtons = function() {
    this.buttons = [];

    this.restartButton = new Button(this, width * 0.5 - 375 * screenZoom, height * 0.75, 350 * screenZoom, 150 * screenZoom, "PLAY AGAIN", 50 * screenZoom);
    this.menuButton = new Button(this, width * 0.5 + 25 * screenZoom, height * 0.75, 350 * screenZoom, 150 * screenZoom, "MENU", 50 * screenZoom);

    this.buttons.push(this.restartButton);
    this.buttons.push(this.menuButton);
}

// When the player dies, the game is sent to DS
DeathScreen.prototype.newDeath = function(stats) {
    // this.game = game;
    this.stats = stats;

    this.clip = this.stats.clip;
    this.clip.counter = this.clip.frames.length - 10;
    this.clip.nextFrame();

    var timeText = timeToText(this.stats.time);

    this.gameOverText.stopTyping();

    // this.textLines = new TypeLines("GAME OVER", "YOU SURVIVED FOR", timeText, "AND SCORED " + String(this.game.score) + " POINTS.");
    this.statsText = new TypeLines("TIME: " + timeText, "SCORE: " + String(this.stats.score), "DIFFICULTY: " + DIFFICULTIES[this.stats.difficulty], "ENEMIES KILLED: " + String(this.stats.enemies), "POWERUPS USED: " + String(this.stats.powerups), "HIGHEST COMBO: " + String(this.stats.combo) + "x");

}

DeathScreen.prototype.update = function() {
        this.gameOverText.startTyping();

    if (this.gameOverText.isFinished()) {
        this.statsText.update();

        if (this.statsText.isFinished()) {
            if (this.clipPlaying) {
                this.clip.nextFrame();
            } else {
                for (var i = 0; i < this.buttons.length; i++) {
                    this.buttons[i].update();
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
        var bounds = this.getClipBounds();
        if (this.clipPlaying) {
            this.clipPlaying = false;
            this.clip.counter = this.clip.frames.length - 10;
        } else {
            if (!(mouseX < bounds[0] || mouseX > bounds[1] || mouseY < bounds[2] || mouseY > bounds[3])) {
                this.clipPlaying = true;
                this.clip.counter = 0;
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
    background(30, 40, 80);

    fill(45, 60, 120);
    noStroke();
    rect(0, 0, width, height * 0.1);

    this.modeText.draw(width * 0.5, height * 0.05, 30 * screenZoom, "CLASSIC");
    this.gameOverText.draw(width * 0.5, height * 0.2, 100 * screenZoom);

    if (this.gameOverText.isFinished()) {
        this.statsText.draw(width * 0.3, height * 0.32, height * 0.07, 40 * screenZoom);//, 50 * zoom, 150 * zoom, 50 * zoom);

        if (this.statsText.isFinished()) {
            for (var i = 0; i < this.buttons.length; i++) {
                this.buttons[i].draw();
            }

            if (this.clip !== null) {
                if (this.clipPlaying) {
                    fill(30, 40, 80, 150);
                    noStroke();
                    rect(0, 0, width, height);
                    this.clip.draw(width * 0.5 - GRIDSIZE * CELLSIZE * zoom * 0.5, height * 0.5 - GRIDSIZE * CELLSIZE * zoom * 0.5, zoom);
                } else {
                    this.clip.draw(width * 0.7 - GRIDSIZE * CELLSIZE * zoom * 0.25, height * 0.5 - GRIDSIZE * CELLSIZE * zoom * 0.25, zoom * 0.5);
                }
            }
        }
    }


}
