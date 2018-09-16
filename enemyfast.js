function EnemyFast(game, row, col) {
	Enemy.call(this, game, row, col, 60, 0, CELLSIZE);

	this.maxVel = 3;
	this.maxForce = 0.1;

	// this.target = game.player;
	// this.pathToTarget = null;

	// this.timeSinceLastPath = 0;

	this.hitSpeed = 60;
	this.wallDestroy = 60;

	this.weaponPos = createVector(0, 0);
	this.weaponExtend = 5;

	this.cooldown = 0;
	this.state = 0;

	this.scoreValue = 10;
}

EnemyFast.prototype = Object.create(Enemy.prototype);

EnemyFast.prototype.specificUpdate = function() {
	this.cooldown -= this.game.playSpeed;

    if (this.state == 1) {
        if (this.weaponExtend > 30) {
            this.state = 2;
        } else {
            this.weaponExtend += 2 * this.game.playSpeed;
        }
    } else if (this.state == 2) {
        if (this.weaponExtend < 5) {
            this.weaponExtend = 5;
            this.state = 0;
        } else {
            this.weaponExtend -= 1 * this.game.playSpeed;
        }
    }

	this.weaponPos = this.pos.copy().add(createVector(this.weaponExtend, 0).rotate(this.vel.heading()));

	if (this.state == 1) {
		var weaponCell = this.game.grid.getCell(this.weaponPos);
		if (weaponCell !== null && weaponCell.wall > 0) {
			// weaponCell.wall --;
			// var weaponCellMiddle = p5.Vector.add(weaponCell.pos, createVector(CELLSIZE * 0.5, CELLSIZE * 0.5));
			// this.game.particleExplosion(weaponCellMiddle, 1, 100, this.vel.heading(), HALF_PI * 0.5, createVector(0, 0), 30, 20, 5, color(50), weaponCell);
			weaponCell.break(this.vel.heading());
			this.state = 2;
		}

		var d = p5.Vector.dist(this.weaponPos, this.game.player.pos);
		if (d < this.game.player.r) {
			this.game.player.damage(1, this);
			this.state = 2;
		}
	}
}

EnemyFast.prototype.attack = function() {
	if (this.cooldown < 0) {
		this.state = 1;
		this.cooldown = this.hitSpeed;
	}

}

EnemyFast.prototype.draw = function(cam, scr) {
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

EnemyFast.prototype.drawWeapon = function(cam, scr) {
	var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
	var drawR = cam.getDrawSize(this.r);
	scr.push();
	scr.translate(drawPos);
	scr.rotate(this.vel.heading());

	scr.fill(1.25 * (100 + this.weaponExtend * 3), 50, 50);
	scr.stroke(100 + this.weaponExtend * 3, 50, 50);
	scr.strokeWeight(2 * drawR / this.r);

	scr.beginShape();
	scr.vertex(this.weaponExtend * drawR / 15, 0);
	scr.vertex(0, 5 * drawR / 15);
	scr.vertex(0, -5 * drawR / 15);
	scr.vertex(this.weaponExtend * drawR / 15, 0);
	scr.endShape();

	scr.pop()
}
