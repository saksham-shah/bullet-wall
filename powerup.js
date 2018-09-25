function PowerUp(rarity_, reqTime_, startF_, colour_, draw_, endF_, time_) {
    this.rarity = rarity_;
    this.reqTime = reqTime_;
    this.startF = startF_;
    this.colour = colour_;
    this.draw = draw_;
    this.endF = endF_;
    this.time = time_;

    this.timer = 0;
    this.activated = false;
}

PowerUp.prototype.activate = function(game) {
    this.activated = true;
    if (this.timer !== undefined) {
        this.timer = this.time;
    }
    this.startF(game);
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

var powerups = [
    // Shield
    new PowerUp(1, 3600,
        function(game) {
            game.player.shield = true;
            game.player.shieldTimer = 0;
        }, [100],
        function(x, y, r) {
            push();
            translate(x, y);
            strokeWeight(r * 0.1);
            stroke(this.colour);
            noFill();
            beginShape();
            vertex(r * 0.25, r * 0.125);
            vertex(r * 0.25, r * 0.625);
            vertex(r * 0.5, r * 0.875);
            vertex(r * 0.75, r * 0.625);
            vertex(r * 0.75, r * 0.125);
            vertex(r * 0.25, r * 0.125);
            endShape();
            pop();
        }
    ),

    // Dual guns
    new PowerUp(1, 1800,
        function(game) {
            game.player.guns = 2;
        }, [150, 45, 45],
        function(x, y, r) {
            push();
            translate(x, y);
            strokeWeight(r * 0.1);
            stroke(this.colour);
            noFill();
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
            pop();
        },
        function(game) {
            game.player.guns = 1;
        }, 300
    )
]

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

            // possible[i].activate(this);
            return possible[i];
        }
    }
    return null;
}
