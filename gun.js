function Gun(game_, entity_, pivot_, l_, w_, l2_) {
    this.game = game_;

    this.entity = entity_;
    this.pivot = pivot_;
    this.l = l_;
    this.w = w_;
    this.l2 = l2_;

    this.direction = 0;

    this.state = 0;
    this.recoil = 0;

    this.cooldown = 0;
}

Gun.prototype.update = function() {
    this.cooldown -= 1;
    if (this.state == 1) {
        if (this.recoil > 5) {
            this.state = 2;
        } else {
            this.recoil += 2;
        }
    } else if (this.state == 2) {
        if (this.recoil < 0) {
            this.recoil = 0;
            this.state = 0;
        } else {
            this.recoil -= 1;
        }
    }
}

Gun.prototype.shoot = function() {
    if (this.cooldown <= 0) {
        this.state = 1;
        this.cooldown = 30;

        this.game.bullets.push(new Bullet(this.game, this, 5, this.direction, color(255)));
    }
}

Gun.prototype.getPos = function() {
    var pos = this.pivot.copy();
    pos.rotate(this.direction);
    return pos.add(this.entity.pos);
}

Gun.prototype.draw = function(cam, scr) {
    var drawPos = cam.getDrawPos(this.entity.pos.x, this.entity.pos.y);
	var drawR = cam.getDrawSize(1);
    // drawPos.add(p5.Vector.mult(this.pivot, drawR));
    scr.push();
    scr.translate(drawPos);
    scr.rotate(this.direction);
    scr.translate(p5.Vector.mult(this.pivot, drawR));
    scr.translate(-this.recoil, 0);
	scr.fill(50, 0, 0);
	scr.noStroke();
	// scr.rect(- this.w * 0.5, 0, drawR * 2);
    scr.rect(- this.l2, - this.w * 0.5, this.l + this.l2, this.w);
    scr.pop();
}
