// Screen where the game takes place
function GameScreen() {
    this.game = null;

    this.text1 = new TypeText("SCORE");
    this.text2 = new TypeText();
}

// Starts a new game
GameScreen.prototype.newGame = function(difficulty) {
    this.game = new Game(difficulty);

    // GS holds all of the stats of the game, to display them to the player
    this.score = 0;
    this.lives = 3;
    this.shield = true;
    this.shieldTimer = 0;
    this.combo = 0;
    this.lastKill = 55;
    this.comboPercentage = 0;

    this.fade = 0;

    this.text1.stopTyping();
}

GameScreen.prototype.update = function() {
    if (this.game !== null) {
        this.game.update();

        var mousePos = getMousePos();
        if (!this.game.gameOver && mousePos.x > 0 && mousePos.x < CELLSIZE * GRIDSIZE && mousePos.y > 0 && mousePos.y < CELLSIZE * GRIDSIZE) {
            myCursor.mode =  this.game.player.weapon + 1;
        }

        var score = this.game.score;
        this.score = score;

        var lives = this.game.player.health;
        this.lives = lives;

        var shield = this.game.player.shield;
        this.shield = shield;
        var shieldTimer = this.game.player.shieldTimer;
        this.shieldTimer = shieldTimer;

        var combo = this.game.combo;
        this.combo = combo;

        var lastKill = this.game.lastKill;
        this.lastKill = lastKill;

        // Converts the combo to a percentage
        var percentage = (this.game.comboTime - this.lastKill) / this.game.comboTime;
        if (this.comboPercentage < percentage) {
            this.comboPercentage += 0.1;
            if (this.comboPercentage > percentage) {
                this.comboPercentage = percentage;
            }
        } else {
            this.comboPercentage = percentage;
        }

        // Game fades out when the player dies
        if (this.game.gameOver) {
            this.fade += this.game.gameSpeed / this.game.playSpeed;
            if (this.fade > 300) {
                nextScreen = ds;
                ds.newDeath({
                    time: this.game.gameTime,
                    score: this.game.score,
                    difficulty: this.game.difficulty,
                    enemies: this.game.enemiesKilled,
                    powerups: this.game.powerupsUsed,
                    combo: this.game.highestCombo
                });
            }
        }
    }

    if (keyIsDown(32) && this.fade == 0) {
        nextScreen = ps;
    }
}

GameScreen.prototype.draw = function() {
    if (this.game !== null) {
        this.text1.startTyping();

        this.game.draw();

        // Draw all of the stats
        this.drawScore();
        this.drawLives();
        this.drawShield();
        this.drawCombo();

        // Game over fade
        fill(30, 40, 80, this.fade);
        noStroke();

        rect(0, 0, width, height);

        // Draw time
        this.text2.draw(width * 0.5, yOff * 0.5, 60 * zoom, timeToText(this.game.gameTime));
    }

}

// Rest of the functions simply draw various shapes (e.g. hearts for lives, a shield)

GameScreen.prototype.drawScore = function() {
    var x = width - xOff * 0.5;
    var y = height * 0.25;
    var r = 40 * screenZoom;

    this.text1.draw(x, y, r);

    if (this.text1.done) {
        this.text2.draw(x, y + r * 1.5, r * 1.5, this.score);
    }
}

GameScreen.prototype.drawLives = function() {
    // Lives
    for (var i = 0; i < 3; i++) {
        var x = (i - 1) * 80 * screenZoom + xOff * 0.5;
        var y = height * 0.75;
        var r = 30 * screenZoom;

        if (this.lives > i) {
            fill(250, 75, 75);
        } else {
            fill(150);
        }

        noStroke()
        beginShape();
        vertex(x, y + r);
        vertex(x - r, y);
        vertex(x + r, y);
        vertex(x, y + r);
        endShape();

        if (this.lives > i) {
            stroke(200, 60, 60);
        } else {
            stroke(120);
        }

        strokeWeight(r / 10);

        arc(x - r * 0.5, y, r, r, - PI, 0, OPEN);
        arc(x + r * 0.5, y, r, r, - PI, 0, OPEN);

        line(x, y + r, x - r, y);
        line(x, y + r, x + r, y);
    }
}

GameScreen.prototype.drawShield = function() {
    // Shield
    var x = xOff * 0.5;
    var y = height * 0.5;
    var r = 50 * screenZoom;

    noStroke();

    if (this.shield) {
        var colourMult = 1;
    } else {
        if (this.shieldTimer > 0) {
            var colourMult = 1.3;
        } else {
            var colourMult = 0.4;
        }
    }

    fill(150 * colourMult);
    beginShape();
    vertex(x, y);
    vertex(x, y + r * 3);
    vertex(x - r, y + r * 2);
    vertex(x - r, y);
    vertex(x, y);
    endShape()

    fill(175 * colourMult);
    beginShape();
    vertex(x, y);
    vertex(x + r, y);
    vertex(x + r, y + r * 2);
    vertex(x, y + r * 3);
    vertex(x, y);
    endShape()

    noFill();
    stroke(100 * colourMult);
    strokeWeight(r / 12.5);
    beginShape();
    vertex(x, y);
    vertex(x + r, y);
    vertex(x + r, y + r * 2);
    vertex(x, y + r * 3);
    vertex(x - r, y + r * 2);
    vertex(x - r, y);
    vertex(x, y);
    endShape()

    if (this.shieldTimer > 0) {
        fill(30, 40, 80, 150);
        noStroke();

        rect(x - r, y, r * 2, 3 * r * (180 - this.shieldTimer) / 180);
    }
}

GameScreen.prototype.drawCombo = function() {
    if (this.combo > 0) {
        var x = xOff * 0.5;
        var y = height * 0.25;
        var r = 60 * screenZoom;

        textSize(r);
        textAlign(CENTER);
        noStroke();

        fill(0, 150, 0);

        if (this.lastKill < this.game.comboTime) {
            arc(x, y, r * 2, r * 2, - HALF_PI, this.comboPercentage * TWO_PI - HALF_PI);

            fill(30, 40, 80);
            ellipse(x, y, r * 1.5);
        }

        fill(255);

        text(this.combo + "x", x, y + r / 3);
    }
}

function timeToText(time) {
    var secs = time / 60;
    var min = floor(secs / 60);
    var sec = floor(secs % 60);

    return leadingZeroes(min) + ":" + leadingZeroes(sec);
}

function leadingZeroes(num) {
    num = String(num);
    if (num.length < 2) {
        num = "0" + num;
    }
    return num;
}
