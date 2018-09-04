function Player(row, col, r, grid, controls) {
    Entity.call(this, row, col, r, grid);
    this.controls = {
	        up: controls[0],
	        down: controls[1],
	        left: controls[2],
	        right: controls[3]
	    };

    this.speed = 1;

    this.gun = new Gun(this, createVector(0, 5), 15, 8, 5);
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.update = function() {
    //Controls
    if (keyIsDown(this.controls.left)) this.vel.x -= this.speed;
    if (keyIsDown(this.controls.up)) this.vel.y -= this.speed;
    if (keyIsDown(this.controls.right)) this.vel.x += this.speed;
    if (keyIsDown(this.controls.down)) this.vel.y += this.speed;

    this.gun.update();

    var mousePos = cam.getMousePos(0);
    this.gun.direction = p5.Vector.sub(mousePos, this.gun.getPos()).heading();

    if (mouseIsPressed) {
        this.gun.shoot();
    }
}

Player.prototype.draw = function(cam, scr) {
	var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
	var drawR = cam.getDrawSize(this.r);
    scr.push();
    scr.translate(drawPos)
	scr.fill(255);
	scr.noStroke();
	scr.ellipse(0, 0, drawR * 2);
    scr.pop();
}
