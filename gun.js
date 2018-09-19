function Gun(game_, entity_, shootSpeed_, pivot_, l_, w_, l2_) {
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
    this.targetDirection = 0;

    this.state = 0;
    this.recoil = 0;

    this.cooldown = 5;
    this.burst = 0;

    this.shootSpeed = shootSpeed_;
}

Gun.prototype.update = function() {
    this.cooldown -= this.game.gameSpeed;

    if (this.burst > 0) {
        // var shot = this.gun.shoot();
        // if (shot) {
        //     this.burst--;
        // }
        this.shoot();
    }

    if (this.state == 1) {
        if (this.recoil > 5) {
            this.state = 2;
        } else {
            this.recoil += 2 * this.game.gameSpeed;
        }
    } else if (this.state == 2) {
        if (this.recoil < 0) {
            this.recoil = 0;
            this.state = 0;
        } else {
            this.recoil -= 1 * this.game.gameSpeed;
        }
    }

    this.direction = rotateToAngle(this.direction, this.targetDirection, 0.2, 0.05);

    // this.targetDirection =
}

Gun.prototype.shoot = function(bursts) {
    if (this.cooldown <= 0) {
        this.state = 1;
        this.cooldown = this.shootSpeed;

        this.game.bullets.push(new Bullet(this.game, this, 5, this.direction, color(255)));

        var pos = this.getPos(0);
        var length = createVector(this.l, 0).rotate(this.direction);
        pos.add(length);
        this.game.particleExplosion(pos, 2.5, 50, this.direction, PI * 0.25, createVector(0, 0), 15, 3, 10, 3, color(255, 255, 0));

        if (bursts !== undefined) {
            this.burst = bursts;
        }

        if (this.burst > 0) {
            this.burst --;
        }

        return true;
    }
    return false;
}

Gun.prototype.getPos = function() {
    var pos = this.pivot.copy();
    pos.rotate(this.entity.direction);
    return pos.add(this.entity.pos);
}

Gun.prototype.draw = function() {
    var drawPos = getDrawPos(this.getPos());
	// var drawR = cam.getDrawSize(1);
    push();
    translate(drawPos);
    rotate(this.direction);
    // scr.translate(p5.Vector.mult(this.pivot, drawR));
    translate(-this.recoil, 0);

    if (this.player) {
	   fill(50, 50, 150);
    } else {
       fill(150, 50, 50);
    }

    stroke(25, 25, 50);
    strokeWeight(2 * zoom);


	// scr.rect(- this.w * 0.5, 0, drawR * 2);
    rect(- this.l2 * zoom, - this.w * zoom * 0.5, this.l * zoom + this.l2 * zoom, this.w * zoom);
    pop();
}

// Gun.prototype.draw = function(cam, scr) {
//     // var drawPos = cam.getDrawPos(this.entity.pos.x, this.entity.pos.y);
//     var drawPos = cam.getDrawPos(this.getPos().x, this.getPos().y)
// 	var drawR = cam.getDrawSize(1);
//     // drawPos.add(p5.Vector.mult(this.pivot, drawR));
//     scr.push();
//     scr.translate(drawPos);
//     scr.rotate(this.direction);
//     // scr.translate(p5.Vector.mult(this.pivot, drawR));
//     scr.translate(-this.recoil, 0);
//
//     if (this.player) {
// 	   scr.fill(50, 50, 150);
//     } else {
//        scr.fill(150, 50, 50);
//     }
//
//     scr.stroke(25, 25, 50);
//     scr.strokeWeight(2 * drawR);
//
//
// 	// scr.rect(- this.w * 0.5, 0, drawR * 2);
//     scr.rect(- this.l2 * drawR, - this.w * drawR * 0.5, this.l * drawR + this.l2 * drawR, this.w * drawR);
//     scr.pop();
// }

function rotateToAngle(current, target, buffer, speed) {
    if (current > target) {
        var d = current - target;
        if (target + TWO_PI - current < d) {
            target += TWO_PI;
        }
    } else if (target > current) {
        var d = target - current;
        if (current + TWO_PI - target < d) {
            target -= TWO_PI;
        }
    }

    var change = (target - current) / buffer;

    if (change > 1) {
        change = 1;
    } else if (change < -1) {
        change = -1;
    }

    return (current + speed * change) % TWO_PI;
}
