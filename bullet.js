function Bullet(game_, gun_, speed_, direction_, colour_) {
    this.game = game_;

    this.gun = gun_;
    this.r = this.gun.w * 0.5;
    this.colour = colour_;

    this.pos = this.gun.getPos().copy();
    this.vel = p5.Vector.fromAngle(direction_,).setMag(speed_);

    this.hit = false;
}

Bullet.prototype.update = function() {
    this.pos.add(this.vel);

    var wallCollision = collideWithWalls(this.pos, this.r, this.game.grid);
    if (wallCollision[0].x != this.pos.x || wallCollision[0].y != this.pos.y) {
        var myCell = this.game.grid.getCell(this.pos);
        var playerCell = this.game.grid.getCell(this.game.player.pos);
        this.hit = true;
        if (wallCollision[1] !== null && wallCollision[1].wall > 0 && myCell !== playerCell && this.game.grid.getCell(this.pos).wall == 0) {
            myCell.wall = 2;
        }
    }

    // this.checkWallHit();

}

// Bullet.prototype.checkWallHit = function() {
//     if ()
//     var currentCell = this.game.grid.getCell(this.pos);
//     if (currentCell.)
// }

Bullet.prototype.draw = function(cam, scr) {
    var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
    var drawR = cam.getDrawSize(this.r);

    scr.push();
    scr.translate(drawPos);
    scr.fill(this.colour);
    scr.noStroke();
    scr.ellipse(0, 0, drawR * 2);
    scr.pop();
}
