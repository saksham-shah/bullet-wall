var spawns;

function Spawn(reqPoints_, reqScore_, doFunction_) {
    this.reqPoints = reqPoints_;
    this.reqScore = reqScore_;
    this.doFunction = doFunction_;

    this.randScore = 0;
}

// Returns a random cell at least dFromPlayer far from the player. Used to spawn enemies/powerups randomly
Game.prototype.randomCell = function(dFromPlayer) {
    var d = this.gridSize * CELLSIZE * dFromPlayer;
    var done = false;
    var tries = 1000;
    while (!done && tries > 0) {
        var row = floor(random(this.gridSize));
        var col = floor(random(this.gridSize));
        var cell = this.grid.grid[row][col];
        if (cell.wall == 0 && cell.powerup === null && p5.Vector.dist(cell.middle(), this.player.pos) > d) {
            done = true;
            return cell;
        }
        // Avoids any accidental infinite loops
        tries--;
    }
    console.log("well done you broke the game");
    console.log("please don't do it again thanks");
}

function createSpawns() {
    spawns = [
        // Stab Enemy
        new Spawn(1, 0,
            function(game) {
                var cell = game.randomCell(0.4);
                game.entities.push(new EnemyStab(game, cell.row, cell.col));
            }
        ),
        // Gun Enemy
        new Spawn(3, 100,
            function(game) {
                var cell = game.randomCell(0.4);
                game.entities.push(new EnemyGun(game, cell.row, cell.col));
            }
        ),
        // Bull Enemy
        new Spawn(4, 250,
            function(game) {
                var cell = game.randomCell(0.4);
                game.entities.push(new EnemyBull(game, cell.row, cell.col));
            }
        ),
    ]
}

// Selects an enemy to spawn
// The harder the enemy, the more spawnPoints it uses up and the rarer it is
// Therefore no matter what enemies the player faces, the difficulty will always be the same
Game.prototype.spawnEnemy = function() {
    var possible = [];
    var highest = 0;
    for (var i = 0; i < spawns.length; i++) {
        if (this.score >= spawns[i].reqScore && this.spawnPoints >= spawns[i].reqPoints) {
            possible.push(spawns[i]);
            if (spawns[i].reqPoints > highest) {
                highest = spawns[i].reqPoints;
            }
        }
    }

    var total = 0;

    for (var i = 0; i < possible.length; i++) {
        possible[i].randScore = highest / possible[i].reqPoints;
        total += possible[i].randScore;
    }

    var randomNum = random(total);
    var currentTotal = 0;
    for (var i = 0; i < possible.length; i++) {
        currentTotal += possible[i].randScore;
        if (currentTotal > randomNum) {
            possible[i].doFunction(this);
            this.spawnPoints -= possible[i].reqPoints;
            return possible[i];
        }
    }
}
