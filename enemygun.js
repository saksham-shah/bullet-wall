function EnemyGun(game, row, col) {
	Enemy.call(this, game, row, col, 400, 0, CELLSIZE);

	this.maxVel = 1;
	this.maxForce = 0.1;

	// this.target = game.player;
	// this.pathToTarget = null;

	// this.timeSinceLastPath = 0;

	this.hitSpeed = 60;
	this.wallDestroy = 15;

    this.gun = new Gun(this.game, this, 10, createVector(0, 8), 20, 12, 6);

    this.cooldown = 30;

    this.burst = 0;

	// this.weaponPos = createVector(0, 0);
	// this.weaponExtend = 5;
    //
	// this.cooldown = 0;
	// this.state = 0;

	this.scoreValue = 20;

    this.attacked = false;
}

EnemyGun.prototype = Object.create(Enemy.prototype);

EnemyGun.prototype.specificUpdate = function() {

    if (!this.attacked) {
        this.gun.targetDirection = p5.Vector.sub(this.game.player.pos, this.gun.getPos()).heading();
    } else {
        this.attacked = false;
    }

    this.gun.update();

    this.direction = this.vel.heading();

    this.cooldown -= this.game.playSpeed;

}

EnemyGun.prototype.attack = function(toAttack) {
	// if (this.cooldown < 0) {
	// 	this.state = 1;
	// 	this.cooldown = this.hitSpeed;
	// }
    if (!this.attacked) {
        if (toAttack instanceof Player) {
            var pos = toAttack.pos;
        } else {
            var pos = toAttack.middle();
        }
        var direction = p5.Vector.sub(pos, this.gun.getPos()).heading();
        this.gun.targetDirection = direction;

        var d = abs(this.gun.direction - direction);
        if (d < 0.1) {
            if (this.cooldown < 0) {
                this.burst = 3;
                this.cooldown = 180;
            } else if (this.burst > 0) {
                var shot = this.gun.shoot();
                if (shot) {
                    this.burst--;
                }
            }
        }
        this.attacked = true;
    }
}

EnemyGun.prototype.draw = function(cam, scr) {
	var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
	var drawR = cam.getDrawSize(this.r);
    scr.push();
    scr.translate(drawPos);
	scr.rotate(this.vel.heading());

	scr.fill(250, 75, 75);
	scr.stroke(200, 60, 60);
    scr.strokeWeight(2 * drawR / this.r);

	scr.ellipse(0, 0, drawR * 2);

    scr.pop();
}

EnemyGun.prototype.drawWeapon = function(cam, scr) {
    this.gun.draw(cam, scr);

    // var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
	// var drawR = cam.getDrawSize(this.r);
	// scr.push();
	// scr.translate(drawPos);
	// scr.rotate(this.vel.heading());
    //
	// scr.fill(1.25 * (100 + this.weaponExtend * 3), 50, 50);
	// scr.stroke(100 + this.weaponExtend * 3, 50, 50);
	// scr.strokeWeight(2 * drawR / this.r);
    //
	// scr.beginShape();
	// scr.vertex(this.weaponExtend * drawR / 15, 0);
	// scr.vertex(0, 5 * drawR / 15);
	// scr.vertex(0, -5 * drawR / 15);
	// scr.vertex(this.weaponExtend * drawR / 15, 0);
	// scr.endShape();
    //
	// scr.pop()
}
