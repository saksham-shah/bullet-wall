// Gun enemy which shoots 3 bullets in a burst, every 3 seconds
function EnemyGun(game, row, col) {
	Enemy.call(this, game, row, col, 1, 400, 0, CELLSIZE);

	this.maxVel = 1;
	this.maxForce = 0.1;

	this.hitSpeed = 180;
	this.wallDestroy = 60;

    this.gun = new Gun(this.game, this, 15, createVector(0, 8), 20, 12, 6);

	// Initial cooldown of 2 seconds before the enemy starts shooting
    this.cooldown = 120;

    this.burst = 0;

	this.scoreValue = 30;

    this.attacked = false;
}

EnemyGun.prototype = Object.create(Enemy.prototype);

EnemyGun.prototype.specificUpdate = function() {

    this.direction = this.vel.heading();

    if (!this.attacked) {
		// If the gun has nothing to point at, just point forwards
        this.gun.targetDirection = this.direction;
    } else {
        this.attacked = false;
    }

    this.gun.update();

    this.cooldown -= this.game.gameSpeed;

}

EnemyGun.prototype.attack = function(toAttack) {
    if (!this.attacked) {
        if (toAttack instanceof Player) {
            var pos = toAttack.pos.copy();

			// Below unused code makes the gun enemy have super targeting skills
			// var t = p5.Vector.dist(pos, this.pos) / 5;
			// pos.add(p5.Vector.mult(toAttack.vel, t));

        } else {
            var pos = toAttack.middle();
        }

        var direction = p5.Vector.sub(pos, this.gun.getPos()).heading();
		// The gun will rotate to the desired direction
        this.gun.targetDirection = direction;

        var d = abs(this.gun.direction - direction);
        if (this.cooldown < 0) {
			// Shoots in bursts of 3
            this.gun.shoot(3);
            this.cooldown = this.hitSpeed;
        }
        this.attacked = true;
    }
}

EnemyGun.prototype.specificDraw = function() {
	// var drawPos = getDrawPos(this.pos);
    push();
    // translate(drawPos);
	rotate(this.vel.heading());

	fill(250, 75, 75);
	stroke(200, 60, 60);
    strokeWeight(2 * zoom);

	ellipse(0, 0, this.r * zoom * 2);

    pop();
}

EnemyGun.prototype.drawWeapon = function() {
    this.gun.draw();
}
