// Screen where the game takes place
function GameScreen() {
    this.game = null;

    this.text1 = new TypeText("SCORE");
    this.text2 = new TypeText();
}

// Starts a new game
GameScreen.prototype.newGame = function(mode, difficulty) {
    this.game = new Game(mode, difficulty);
    this.gameRec = new GameRecord(300);

    // this.score = 0;
    // this.lives = 3;
    // this.shield = true;
    // this.shieldTimer = 0;
    // this.shieldRecharge = 0;
    // this.combo = 0;
    // this.lastKill = 55;
    this.comboPercentage = 0;
    this.comboTime = this.game.comboTime;
    // this.coolness = 0;
    this.maxCoolness = 0;
    this.coolClip = null;
    this.coolTimer = 0;
    this.clipNeeded = false;

    this.fade = 0;

    this.text1.stopTyping();
}

GameScreen.prototype.update = function() {
    if (this.game !== null) {
        // GS holds all of the stats of the game, to display them to the player
        this.gameStats = this.game.update();

        this.gameRec.addFrame(this.game.convertToSnap());

        // var mousePos = getMousePos();
        // if (!this.game.gameOver && mousePos.x > 0 && mousePos.x < CELLSIZE * GRIDSIZE && mousePos.y > 0 && mousePos.y < CELLSIZE * GRIDSIZE) {
        if (!this.gameStats.gameOver && mouseX > xOff && mouseX < width - xOff && mouseY > yOff && mouseY < height - yOff) {
            myCursor.mode =  this.gameStats.playerWeapon + 1;
        }

            // var score = this.game.score;
            // this.score = score;
            //
            // var coolness = this.game.coolness;
            // this.coolness = coolness;
        if (this.gameStats.coolness > this.maxCoolness && !selfRecord) {
            this.maxCoolness = this.gameStats.coolness;
            this.coolTimer = 30;
            this.clipNeeded = true;
        }
        // }
        this.coolTimer -= this.gameStats.gameSpeed;
        if ((this.coolTimer < 0 && this.clipNeeded) || (selfRecord && keyIsDown(82))) {

            if (selfRecord) {
                console.log(this.gameStats.coolness);
            }

            this.coolClip = this.gameRec.createGameClip(width * 0.575, height * 0.5 - width * 0.125, width * 0.25, this.maxCoolness);
            this.clipNeeded = false;

            console.log("RECORDED: " + String(this.maxCoolness) + " coolness");//, " + String(this.gameStats.coolness) + " now.");
        }

        // var lives = this.game.player.health;
        // this.lives = lives;
        //
        // var shield = this.game.player.shield;
        // this.shield = shield;
        // var shieldTimer = this.game.player.shieldTimer;
        // this.shieldTimer = shieldTimer;
        // var shieldRecharge = this.game.player.shieldRecharge;
        // this.shieldRecharge = shieldRecharge;
        //
        // var combo = this.game.combo;
        // this.combo = combo;
        //
        // var lastKill = this.game.lastKill;
        // this.lastKill = lastKill;

        // Converts the combo to a percentage
        var percentage = (this.comboTime - this.gameStats.lastKill) / this.comboTime;
        if (this.comboPercentage < percentage) {
            this.comboPercentage += 0.1;
            if (this.comboPercentage > percentage) {
                this.comboPercentage = percentage;
            }
        } else {
            this.comboPercentage = percentage;
        }

        // Game fades out when the player dies
        if (this.gameStats.gameOver) {
            this.fade += dt;
            if (this.fade > 300) {
                if (this.coolClip === null) {
                    this.coolClip = this.gameRec.createGameClip(width * 0.575, height * 0.5 - width * 0.125, width * 0.25, this.gameStats.coolness);
                }
                nextScreen = ds;
                ds.newDeath({
                    mode: this.game.mode,
                    clip: this.coolClip,
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
    background(theme.background);
    if (this.game !== null) {
        this.text1.startTyping();

        // this.game.draw();
        var params = this.game.convertToSnap();
        drawGame(xOff, yOff, 810 * screenZoom, params);

        // Draw all of the stats
        this.drawScore();
        this.drawLives();
        this.drawShield();
        this.drawCombo();

        // Game over fade
        var c = color(theme.background);
        c.setAlpha(this.fade);
        fill(c);
        noStroke();

        rect(0, 0, width, height);

        // Draw time
        this.text2.draw(width * 0.5, yOff * 0.5, 60 * screenZoom, timeToText(this.gameStats.gameTime));
    }

}

// Rest of the functions simply draw various shapes (e.g. hearts for lives, a shield)

GameScreen.prototype.drawScore = function() {
    var x = width - xOff * 0.5;
    var y = height * 0.25;
    var r = 60 * screenZoom;

    this.text1.draw(x, y, r);

    if (this.text1.done) {
        this.text2.draw(x, y + r * 1.5, r * 1.5, this.gameStats.score);
    }
}

GameScreen.prototype.drawLives = function() {
    // Lives
    for (var i = 0; i < 3; i++) {
        var x = (i - 1) * 120 * screenZoom + xOff * 0.5;
        var y = height * 0.75;
        var r = 45 * screenZoom;

        if (this.gameStats.lives > i) {
            fill(theme.gs.heartLive[0] * theme.mult, theme.gs.heartLive[1] * theme.mult, theme.gs.heartLive[2] * theme.mult);
        } else {
            fill(theme.gs.heartDead * theme.mult);
        }

        noStroke()
        beginShape();
        vertex(x, y + r);
        vertex(x - r, y);
        vertex(x + r, y);
        vertex(x, y + r);
        endShape();

        if (this.gameStats.lives > i) {
            stroke(theme.gs.heartLive);
        } else {
            stroke(theme.gs.heartDead);
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
    var r = 75 * screenZoom;

    noStroke();

    if (this.gameStats.shield) {
        var colourMult = 1;
    } else {
        if (this.gameStats.shieldTimer > 0) {
            var colourMult = 1.3;
        } else {
            var colourMult = 0.4;
        }
    }

    fill(theme.gs.shieldLeft * colourMult);
    beginShape();
    vertex(x, y);
    vertex(x, y + r * 3);
    vertex(x - r, y + r * 2);
    vertex(x - r, y);
    vertex(x, y);
    endShape()

    fill(theme.gs.shieldRight * colourMult);
    beginShape();
    vertex(x, y);
    vertex(x + r, y);
    vertex(x + r, y + r * 2);
    vertex(x, y + r * 3);
    vertex(x, y);
    endShape()

    noFill();
    stroke(theme.gs.shieldStroke * colourMult);
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

    if (this.gameStats.shieldTimer > 0) {
        var c = color(theme.background);
        c.setAlpha(150);
        fill(c);
        noStroke();

        rect(x - r, y, r * 2, 3 * r * (180 - this.gameStats.shieldTimer) / 180);
    } else if (this.gameStats.shieldRecharge > 0) {
        var c = color(theme.background);
        c.setAlpha(150);
        fill(c);
        noStroke();

        rect(x - r, y, r * 2, 3 * r * (this.gameStats.shieldRecharge) / 3600);
    }
}

GameScreen.prototype.drawCombo = function() {
    if (this.gameStats.combo > 0) {
        var x = xOff * 0.5;
        var y = height * 0.25;
        var r = 90 * screenZoom;

        textSize(r);
        textAlign(CENTER);
        noStroke();

        fill(theme.gs.combo);

        if (this.gameStats.lastKill < this.comboTime) {
            arc(x, y, r * 2, r * 2, - HALF_PI, this.comboPercentage * TWO_PI - HALF_PI);

            fill(theme.background);
            ellipse(x, y, r * 1.5);
        }

        fill(255);

        text(this.gameStats.combo + "x", x, y + r / 3);
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
