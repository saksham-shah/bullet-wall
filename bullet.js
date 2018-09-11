function Bullet(game_, gun_, speed_, direction_, colour_) {
    this.game = game_;

    this.gun = gun_;
    // if (this.gun.entity instanceof Player) {
    //     this.player = true;
    // } else {
    //     this.player = false;
    // }


    this.r = this.gun.w * 0.5;
    this.colour = colour_;

    this.pos = this.gun.getPos().copy();
    this.vel = p5.Vector.fromAngle(direction_,).setMag(speed_);

    this.hit = false;
}

Bullet.prototype.update = function(entities) {
    this.pos.add(p5.Vector.mult(this.vel, dt));



    this.checkWallHit();
    this.checkEntityHits(entities);

}

Bullet.prototype.checkWallHit = function() {
    var wallCollision = collideWithWalls(this.pos, this.r, this.game.grid);
    if (wallCollision[0].x != this.pos.x || wallCollision[0].y != this.pos.y) {
        this.hit = true;
        if (this.gun.player) {
            var myCell = this.game.grid.getCell(this.pos);
            var playerCell = this.game.grid.getCell(this.game.player.pos);
            if (wallCollision[1] !== null && wallCollision[1].wall > 0 && myCell !== playerCell && this.game.grid.getCell(this.pos).wall == 0) {
                myCell.wall = 2;
                var myCellMiddle = p5.Vector.add(myCell.pos, createVector(CELLSIZE * 0.5, CELLSIZE * 0.5));
                this.game.particleExplosion(myCellMiddle, 1, 100, PI, PI, createVector(0, 0), 30, 30, 7, color(50), myCell);
            }
        }
    }
}

Bullet.prototype.checkEntityHits = function(entities) {
    for (var i = 0; i < entities.length; i++) {
        if ((this.gun.player && !(entities[i] instanceof Player)) || (!this.gun.player && (entities[i] instanceof Player))) {
            var d = p5.Vector.dist(this.pos, entities[i].pos);
            if (d < this.r + entities[i].r) {
                entities[i].die(this);
                this.hit = true;
            }
        }
    }
}

Bullet.prototype.draw = function(cam, scr) {
    var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
    var drawR = cam.getDrawSize(this.r);

    scr.push();
    scr.translate(drawPos);

    if (this.gun.player) {
        scr.fill(200, 200, 250);
        scr.stroke(255);
        scr.strokeWeight(2 * drawR / this.r);
    }
    // scr.fill(this.colour);
    // scr.noStroke();


    scr.ellipse(0, 0, drawR * 2);
    scr.pop();
}
