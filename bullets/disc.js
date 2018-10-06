// Used by powerup - spinning disc that bounces off walls
function Disc(game_, pos_, dir_) {
    this.game = game_

    this.pos = pos_.copy();
    this.vel = p5.Vector.fromAngle(dir_).setMag(4);

    this.time = 600;

    this.r = 10;
    this.rotation = 0;
}

Disc.prototype.update = function(entities) {
    if (this.time < 0) {
        this.done = true;
    } else {
        this.time -= this.game.gameSpeed;
    }

    this.pos.add(p5.Vector.mult(this.vel, this.game.gameSpeed));

    this.checkWallHit();
    this.checkEntityHits(entities);

    this.rotation += this.game.gameSpeed * 0.1;

    // Shrinks before disappearing
    if (this.r <= 0) {
        this.hit = true;
    } else if (this.done) {
        this.r -= this.game.gameSpeed;
    }

}

// Works similarly to Bullets

Disc.prototype.checkWallHit = function() {
    var wallCollision = collideWithWalls(this.pos, this.r, this.game.grid);
    if (wallCollision[1] !== null) {
        wallCollision[1].break(this.vel);
    }
    var bounced = false;
    // Bounce off walls and edges
    if (wallCollision[0].x != this.pos.x) {
        this.vel.x = -this.vel.x;
        bounced = true;
    }
    if (wallCollision[0].y != this.pos.y) {
        this.vel.y = -this.vel.y;
        bounced = true;
    }
    if (bounced) {
        this.pos.add(p5.Vector.mult(this.vel, this.game.gameSpeed));
    }
    // } else if (wallCollision[0].x != this.pos.x || wallCollision[0].y != this.pos.y) {
    //     this.done = true;
    // }
}

Disc.prototype.checkEntityHits = function(entities) {
    for (var i = 0; i < entities.length; i++) {
        if (!(entities[i] instanceof Player)) {
            var d = p5.Vector.dist(this.pos, entities[i].pos);
            if (d < this.r + entities[i].r) {
                entities[i].damage(1, this);
                // if (!entities[i].dead) {
                //     this.done = true;
                // }
            }
        }
    }
}

Disc.prototype.draw = function() {
    var drawPos = getDrawPos(this.pos);

    push();
    translate(drawPos);
    rotate(this.rotation)

    strokeWeight(2 * zoom);
    stroke(75, 0, 125);

    fill(150, 0, 250);
    arc(0, 0, this.r * 2 * zoom, this.r * 2 * zoom, 0, PI, CHORD);

    fill(120, 0, 200);
    arc(0, 0, this.r * 2 * zoom, this.r * 2 * zoom, -PI, 0, CHORD);

    line(this.r * zoom, 0, - this.r * zoom, 0);

    pop();
}
