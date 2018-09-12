function Gun(game_, entity_, pivot_, l_, w_, l2_) {
    this.game = game_;

    this.entity = entity_;
    if (this.entity instanceof Player) {
        this.player = true;
    } else {
        this.player = false;
    }

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
    this.cooldown -= dt;

    if (this.state == 1) {
        if (this.recoil > 5) {
            this.state = 2;
        } else {
            this.recoil += 2 * dt;
        }
    } else if (this.state == 2) {
        if (this.recoil < 0) {
            this.recoil = 0;
            this.state = 0;
        } else {
            this.recoil -= 1 * dt;
        }
    }
}

Gun.prototype.shoot = function() {
    if (this.cooldown <= 0) {
        this.state = 1;
        this.cooldown = 30;

        this.game.bullets.push(new Bullet(this.game, this, 5, this.direction, color(255)));

        var pos = this.getPos(0);
        var length = createVector(this.l, 0).rotate(this.direction);
        pos.add(length);
        this.game.particleExplosion(pos, 2.5, 50, this.direction, PI * 0.25, createVector(0, 0), 15, 10, 3, color(255, 255, 0));
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

    if (this.player) {
	   scr.fill(50, 50, 150);
       scr.stroke(25, 25, 50);
       scr.strokeWeight(2 * drawR);
    }


	// scr.rect(- this.w * 0.5, 0, drawR * 2);
    scr.rect(- this.l2 * drawR, - this.w * drawR * 0.5, this.l * drawR + this.l2 * drawR, this.w * drawR);
    scr.pop();
}
