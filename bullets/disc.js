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
        if (entities[i] instanceof Enemy) {
            var d = p5.Vector.dist(this.pos, entities[i].pos);
            if (d < this.r + entities[i].r) {
                entities[i].damage(entities[i].health, this);
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

function drawDisc(z, params) {
    var drawPos = p5.Vector.mult(createVector(params.x, params.y), z);

    push();
    translate(drawPos);
    rotate(params.rotation)

    strokeWeight(2 * z);
    stroke(75, 0, 125);

    fill(150, 0, 250);
    arc(0, 0, params.r * 2 * z, params.r * 2 * z, 0, PI, CHORD);

    fill(120, 0, 200);
    arc(0, 0, params.r * 2 * z, params.r * 2 * z, -PI, 0, CHORD);

    line(params.r * z, 0, - params.r * z, 0);

    pop();
}

Disc.prototype.convertToSnap = function() {
    return {
        type: 1,
        x: this.pos.x,
        y: this.pos.y,
        r: this.r,
        rotation: this.rotation
    }
}
