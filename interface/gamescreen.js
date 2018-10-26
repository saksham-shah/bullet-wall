// Screen where the game takes place
function GameScreen() {
    this.game = null;

    this.text1 = new TypeText("SCORE");
    this.text2 = new TypeText();
}

// Starts a new game
GameScreen.prototype.newGame = function(difficulty) {
    this.game = new Game(difficulty);
    this.gameRec = new GameRecord(300);

    // GS holds all of the stats of the game, to display them to the player
    this.score = 0;
    this.lives = 3;
    this.shield = true;
    this.shieldTimer = 0;
    this.shieldRecharge = 0;
    this.combo = 0;
    this.lastKill = 55;
    this.comboPercentage = 0;
    this.coolness = 0;
    this.maxCoolness = 0;
    this.coolClip = null;
    // this.coolClips = [];
    this.coolTimer = 0;
    this.clipNeeded = false;

    this.fade = 0;

    this.text1.stopTyping();

    // this.coolClips.push(this.gameRec.createGameClip(width * 0.575, height * 0.5 - width * 0.125, width * 0.25, this.coolness));
}

GameScreen.prototype.update = function() {
    if (this.game !== null) {
        this.game.update();

        this.gameRec.addFrame(this.game.convertToSnap());

        var mousePos = getMousePos();
        if (!this.game.gameOver && mousePos.x > 0 && mousePos.x < CELLSIZE * GRIDSIZE && mousePos.y > 0 && mousePos.y < CELLSIZE * GRIDSIZE) {
            myCursor.mode =  this.game.player.weapon + 1;
        }

        var score = this.game.score;
        this.score = score;

        var coolness = this.game.coolness;
        this.coolness = coolness;
        // this.coolClips.sort(function(a, b) {
        //     return a.coolness - b.coolness;
        // });
        // if (this.coolClips.length > 0) {
        // if (this.coolness > this.coolClips[0].coolness && !this.clipNeeded) {
        if (this.coolness > this.maxCoolness) {
            this.maxCoolness = this.coolness;
            // console.log(this.coolness);
            this.coolTimer = 30;
            this.clipNeeded = true;
            // console.log(this.coolness);
            // this.coolClip = this.gameRec.createGameClip();
            // console.log(this.coolness);
        }
        // }
        this.coolTimer -= this.game.gameSpeed;
        if (this.coolTimer < 0 && this.clipNeeded) {
            this.coolClip = this.gameRec.createGameClip(width * 0.575, height * 0.5 - width * 0.125, width * 0.25, this.coolness);
            // this.coolClips.push(this.gameRec.createGameClip(width * 0.575, height * 0.5 - width * 0.125, width * 0.25, this.coolness));
            // if (this.coolClips.length > 4) {

            // }
            this.clipNeeded = false;
            // if (this.coolClips.length > 4) {
            //     this.coolClips.sort(function(a, b) {
            //         return a.coolness - b.coolness;
            //     });
            //     console.log(this.coolClips[0].coolness);
            //     this.coolClips.splice(0, 1);
            //     console.log("splice");
            // }
            // // this.clipLimitTimer = 300;
        }

        var lives = this.game.player.health;
        this.lives = lives;

        var shield = this.game.player.shield;
        this.shield = shield;
        var shieldTimer = this.game.player.shieldTimer;
        this.shieldTimer = shieldTimer;
        var shieldRecharge = this.game.player.shieldRecharge;
        this.shieldRecharge = shieldRecharge;

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
                // if (this.coolClips.length > 4) {
                //     this.coolClips = this.coolClips.slice(this.coolClips.length - 4, this.coolClips.length);
                if (this.coolClip === null) {
                    this.coolClip = this.gameRec.createGameClip(width * 0.55, height * 0.5 - width * 0.15, width * 0.3, this.coolness);
                    // this.coolClips.push(this.gameRec.createGameClip(width * 0.575, height * 0.5 - width * 0.125, width * 0.25, this.coolness));
                }
                // console.log(this.coolClip.coolness);
                nextScreen = ds;
                ds.newDeath({
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
    background(30, 40, 80);
    if (this.game !== null) {
        this.text1.startTyping();

        // this.game.draw();
        var params = this.game.convertToSnap();
        drawGame(xOff, yOff, zoom, params);

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

        // drawGame(width * 0.75, height * 0.75, zoom * 0.3, params);
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
    } else if (this.shieldRecharge > 0) {
        fill(30, 40, 80, 150);
        noStroke();

        rect(x - r, y, r * 2, 3 * r * (this.shieldRecharge) / 3600);
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
