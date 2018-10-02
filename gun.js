// Used by the player and Gun Enemy
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

    // Burst fire
    if (this.burst > 0) {
        this.shoot();
    }

    // Recoil animation - works the same way as the weapon of the Fast Enemy
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

    this.direction = rotateToAngle(this.direction, this.targetDirection, 0.3, 0.03);
}

// Shoots a bullet
Gun.prototype.shoot = function(bursts) {
    if (this.cooldown <= 0) {

        this.cooldown = this.shootSpeed;

        this.game.bullets.push(new Bullet(this.game, this, 5, this.direction, color(255)));

        this.shootAnimation();

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

// Shoot animation
Gun.prototype.shootAnimation = function() {
    this.state = 1;

    // Particle explosion is created at the gun's position
    var pos = this.getPos();
    var length = createVector(this.l, 0).rotate(this.direction);
    pos.add(length);
    this.game.particleExplosion(pos, 2.5, 50, this.direction, PI * 0.25, createVector(0, 0), 15, 3, 10, 3, color(255, 255, 0));
}

// Returns the position of the gun, taking into account the position of the entity holding the gun
Gun.prototype.getPos = function() {
    var pos = this.pivot.copy();
    pos.rotate(this.entity.direction);
    return pos.add(this.entity.pos);
}

Gun.prototype.draw = function() {
    var drawPos = getDrawPos(this.getPos());
    push();
    translate(drawPos);
    rotate(this.direction);
    translate(-this.recoil * zoom, 0);

    // Blue if held by the player, red if held by the enemy
    if (this.player) {
	   fill(50, 50, 150);
    } else {
       fill(150, 50, 50);
    }

    stroke(25, 25, 50);
    strokeWeight(2 * zoom);

    rect(- this.l2 * zoom, - this.w * zoom * 0.5, this.l * zoom + this.l2 * zoom, this.w * zoom);
    pop();
}

// Rotates the gun towards the target direction
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
