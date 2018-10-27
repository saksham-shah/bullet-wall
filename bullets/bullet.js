// Used by player and Gun Enemy
function Bullet(game_, gun_, speed_, direction_, buildWalls_, colour_) {
    this.game = game_;

    this.gun = gun_;
    this.buildWalls = buildWalls_;

    this.r = this.gun.w * 0.5;
    this.colour = colour_;

    this.pos = this.gun.getPos().copy();
    this.vel = p5.Vector.fromAngle(direction_,).setMag(speed_);
    this.previousPos = this.pos.copy();

    this.hit = false;

    this.time = 0;

    this.dodged = false;
}

Bullet.prototype.update = function(entities) {
    this.previousPos.x = this.pos.x;
    this.previousPos.y = this.pos.y;
    this.pos.add(p5.Vector.mult(this.vel, this.game.gameSpeed));

    this.checkWallHit();
    this.checkEntityHits(entities);

    this.time += this.game.gameSpeed;
}

// If it collides with a wall or the edge, it disappears
Bullet.prototype.checkWallHit = function() {
    var myCell = this.game.grid.getCell(this.pos);
    var playerCell = this.game.grid.getCell(this.game.player.pos);
    var wallCollision = collideWithWalls(this.pos, this.r, this.game.grid);
    if (wallCollision[0].x != this.pos.x || wallCollision[0].y != this.pos.y) {
        this.hit = true;
        if (this.gun.player && this.buildWalls) {
            this.game.addCoolness("buildWall");
        }
        if (wallCollision[1] !== null) {
            if (this.buildWalls) {
                // Player bullets create walls
                if (myCell !== playerCell) {
                    myCell.build();
                    this.game.score += 2;
                }
                // if (this.gun.player) {
                //     this.game.addCoolness("missEnemy");
                // }
            } else {
                // Enemy bullets break walls
                wallCollision[1].break(this.vel.heading());
            }
        }
    } else {
        // If a bullet has spawned in a wall, it disappears
        if (myCell.wall > 0) {
            this.hit = true;
            if (!this.buildWalls) {
                myCell.break(this.vel.heading());
            } else {
                // This can happen during low frame rates - ensures that a wall is spawned
                var previousCell = this.game.grid.getCell(this.previousPos);
                if (previousCell !== playerCell && previousCell.wall == 0) {
                    previousCell.build();
                    this.game.score += 2;
                }
            }
        }
    }
}

// Damages entities
Bullet.prototype.checkEntityHits = function(entities) {
    for (var i = 0; i < entities.length; i++) {
        // Player bullets only damage enemies, and enemy bullets only damage the player
        if ((this.gun.player && (entities[i] instanceof Enemy)) || (!this.gun.player && !(entities[i] instanceof Enemy))) {
            var d = p5.Vector.dist(this.pos, entities[i].pos);
            if (d < this.r + entities[i].r) {
                entities[i].damage(1, this);
                this.hit = true;
                if (this.buildWalls && entities[i].dead) {
                    var myCell = this.game.grid.getCell(this.pos);
                    var playerCell = this.game.grid.getCell(this.game.player.pos);
                    if (myCell !== playerCell) {
                        // Create a wall if the player is not in the same cell (so the player doesn't get stuck in the wall)
                        myCell.build();
                        if (this.gun.player) {
                            this.game.addCoolness("buildWall");
                        }
                    }
                    // this.game.coolness += this.time * 0.5;
                }
                if (entities[i] instanceof Enemy) {
                    this.game.addCoolness("bulletHit", {time: this.time, health: entities[i].health, scoreValue: entities[i].scoreValue});
                }
                return;
            } else if (entities[i] instanceof Player && d < this.r + entities[i].r + 25 && !this.dodged) {
                var futurePos = this.pos.copy().add(this.vel.copy().setMag(30));
                var futureD = p5.Vector.dist(futurePos, entities[i].pos);
                if (futureD >= this.r + entities[i].r) {
                    // var cool = 250 / (d - this.r - entities[i].r);
                    // if (cool > 100) {
                    //     cool = 100;
                    // }
                    // this.game.coolness += cool * this.game.playSpeed;
                    this.game.addCoolness("bulletDodge");
                    this.dodged = true;
                    // console.log("near miss " + String(cool));
                }
            }
        }
    }
}

Bullet.prototype.draw = function() {
    var drawPos = getDrawPos(this.pos);

    push();
    translate(drawPos);

    if (this.gun.player) {
        fill(200, 200, 250);
    } else {
        fill(250, 200, 200);
    }

    stroke(255);
    strokeWeight(2 * zoom);

    ellipse(0, 0, this.r * zoom * 2);
    pop();
}

function drawBullet(z, params) {
    var drawPos = p5.Vector.mult(createVector(params.x, params.y), z);

    push();
    translate(drawPos);

    if (params.player) {
        fill(theme.bullet.player);
    } else {
        fill(theme.bullet.enemy);
    }

    stroke(theme.bullet.stroke);
    strokeWeight(2 * z);

    ellipse(0, 0, params.r * z * 2);
    pop();
}

Bullet.prototype.convertToSnap = function() {
    return {
        type: 0,
        x: this.pos.x,
        y: this.pos.y,
        r: this.r,
        player: this.gun.player
    }
}
