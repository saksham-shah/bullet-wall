function Player(row, col, r, grid, controls) {
    Entity.call(this, row, col, r, grid);
    this.controls = {
	        up: controls[0],
	        down: controls[1],
	        left: controls[2],
	        right: controls[3]
	    };

    this.speed = 1;
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.update = function() {
    //Controls
    if (keyIsDown(this.controls.left)) this.vel.x -= this.speed;
    if (keyIsDown(this.controls.up)) this.vel.y -= this.speed;
    if (keyIsDown(this.controls.right)) this.vel.x += this.speed;
    if (keyIsDown(this.controls.down)) this.vel.y += this.speed;
}
