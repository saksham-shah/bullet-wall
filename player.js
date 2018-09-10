function Player(game, row, col, controls) {
    Entity.call(this, game, row, col, 15);
    this.controls = {
	        up: controls[0],
	        down: controls[1],
	        left: controls[2],
	        right: controls[3]
	    };

    this.maxVel = 1.5;

    this.gun = new Gun(this.game, this, createVector(0, 6), 20, 12, 6);

    this.mass = 50;
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.update = function() {
    this.vel.mult(0, 0);
    //Controls
    if (keyIsDown(this.controls.left)) this.vel.x -= this.maxVel;
    if (keyIsDown(this.controls.up)) this.vel.y -= this.maxVel;
    if (keyIsDown(this.controls.right)) this.vel.x += this.maxVel;
    if (keyIsDown(this.controls.down)) this.vel.y += this.maxVel;

    this.gun.update();

    var mousePos = this.game.cam.getMousePos(0);
    this.gun.direction = p5.Vector.sub(mousePos, this.gun.getPos()).heading();

    if (mouseIsPressed) {
        this.gun.shoot();
    }
}

Player.prototype.draw = function(cam, scr) {
	var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
	var drawR = cam.getDrawSize(this.r);
    scr.push();
    scr.translate(drawPos);

	scr.fill(200, 200, 250);
	scr.stroke(160, 160, 200);
    scr.strokeWeight(2);

	scr.ellipse(0, 0, drawR * 2);

    scr.pop();
}

Player.prototype.drawWeapon = function(cam, scr) {
    this.gun.draw(cam, scr);
    // console.log(this);
    // cam.draw(this.gun);
}
