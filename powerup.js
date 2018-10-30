var powerups, powerupSequence;

function PowerUp(rarity_, reqTime_, startF_, colour_, drawF_, endF_, time_) {
    this.rarity = rarity_;
    this.reqTime = reqTime_;
    this.startF = startF_;
    this.colour = colour_;
    this.drawF = drawF_;
    this.endF = endF_;
    this.time = time_;

    this.timer = 0;
    this.activated = false;
}

// Activates the powerup
PowerUp.prototype.activate = function(game, cell) {
    game.powerupsUsed++;
    this.activated = true;
    if (this.timer !== undefined) {
        this.timer = this.time;
    }
    this.startF(game, cell);
}

PowerUp.prototype.update =  function(game) {
    if (this.timer < 0) {
        if (this.activated) {
            this.activated = false;
            if (this.endF !== undefined) {
                this.endF(game);
            }
        }
    } else {
        this.timer -= game.gameSpeed;
    }
}

PowerUp.prototype.draw = function(x, y, r) {
    push();
    translate(x, y);
    strokeWeight(r * 0.1);
    var c = theme;
    if (this.colour instanceof Array) {
        for (var i = 0; i < this.colour.length; i++) {
            c = c[this.colour[i]];
        }
    } else {
        c = this.colour;
    }
    stroke(c);
    noFill();
    this.drawF(r);
    pop();
}

function createPowerUps() {
    powerups = [
        // Disc
        new PowerUp(2, 900,
            function(game) {
                game.player.weapon = 1;
                game.player.ammo = 1;
            }, ["bullet", "discStroke"],
            function(r) {
                ellipse(r * 0.5, r * 0.5, r * 0.5);
            }
        ),
        // Dual guns
        new PowerUp(2, 900,
            function(game) {
                game.player.guns = 2;
                game.player.maxVel = 3;
            }, ["powerup", "dual"],
            function(r) {
                beginShape();
                vertex(r * 0.5, r * 0.625);
                vertex(r * 0.25, r * 0.625);
                vertex(r * 0.25, r * 0.125);
                vertex(r * 0.5, r * 0.125);
                vertex(r * 0.5, r * 0.875);
                vertex(r * 0.75, r * 0.875);
                vertex(r * 0.75, r * 0.375);
                vertex(r * 0.5, r * 0.375);
                endShape();
            },
            function(game) {
                game.player.guns = 1;
                game.player.maxVel = 2;
            }, 300
        ),
        // Minions
        new PowerUp(1, 900,
            function(game, cell) {
                for (var i = 0; i < 3; i++) {
                    game.entities.push(new Minion(game, cell.row, cell.col));
                }
            }, ["powerup", "minions"],
            function(r) {
                beginShape();
                vertex(r * 0.2, r * 0.2);
                vertex(r * 0.2, r * 0.4);
                vertex(r * 0.4, r * 0.4);
                vertex(r * 0.4, r * 0.8);
                vertex(r * 0.6, r * 0.8);
                vertex(r * 0.6, r * 0.4);
                vertex(r * 0.8, r * 0.4);
                vertex(r * 0.8, r * 0.2);
                vertex(r * 0.2, r * 0.2);
                endShape();
            })
        // Shield
        // new PowerUp(3, 3600,
        //     function(game) {
        //         game.player.shield = true;
        //         game.player.shieldTimer = 0;
        //     }, [75],
        //     function(r) {
        //         beginShape();
        //         vertex(r * 0.25, r * 0.125);
        //         vertex(r * 0.25, r * 0.625);
        //         vertex(r * 0.5, r * 0.875);
        //         vertex(r * 0.75, r * 0.625);
        //         vertex(r * 0.75, r * 0.125);
        //         vertex(r * 0.25, r * 0.125);
        //         endShape();
        //     }
        // )
    ]

    powerupSequence = [];

    for (var i = 0; i < powerups.length; i++) {
        var num = powerups[i].rarity;
        for (var j = 0; j < num; j++) {
            powerupSequence.push(powerups[i]);
        }
    }
}

Game.prototype.randomPowerUps = function() {
    if (this.powerupsToUse.length == 0) {
        this.powerupsToUse = powerupSequence.slice();
    }

    var num = floor(random(this.powerupsToUse.length));
    // console.log(num);
    var powerup = this.powerupsToUse.splice(num, 1);
    // console.log(powerup);
    if (this.gameTime > powerup[0].reqTime) {
        return powerup[0];
    }

    return null;
}

Game.prototype.randomPowerUp = function() {
    var possible = [];
    var highest = 0;
    for (var i = 0; i < powerups.length; i++) {
        if (this.gameTime >= powerups[i].reqTime) {
            possible.push(powerups[i]);
            if (powerups[i].rarity > highest) {
                highest = powerups[i].rarity;
            }
        }
    }

    var total = 0;

    for (var i = 0; i < possible.length; i++) {
        possible[i].randScore = highest / possible[i].rarity;
        total += possible[i].randScore;
    }

    var randomNum = random(total);
    var currentTotal = 0;
    for (var i = 0; i < possible.length; i++) {
        currentTotal += possible[i].randScore;
        if (currentTotal > randomNum) {
            return possible[i];
        }
    }
    return null;
}
