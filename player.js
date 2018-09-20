function Player(game, row, col, controls) {
    Entity.call(this, game, row, col, 15);
    this.controls = {
	        up: controls[0],
	        down: controls[1],
	        left: controls[2],
	        right: controls[3]
	    };

    this.maxVel = 2;

    this.gun1 = new Gun(this.game, this, 30, createVector(0, 8), 20, 12, 6);
    this.gun2 = new Gun(this.game, this, 30, createVector(0, -8), 20, 12, 6);
    this.lastShot = 2;
    this.guns = 1;

    this.mass = 50;

    this.health = 3;

    this.shield = true;
    this.shieldTimer = 0;


    this.direction = 0;
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.update = function() {
    this.vel.mult(0, 0);
    //Controls
    if (keyIsDown(this.controls.left) || keyIsDown(65)) this.vel.x -= 1;
    if (keyIsDown(this.controls.up) || keyIsDown(87)) this.vel.y -= 1;
    if (keyIsDown(this.controls.right) || keyIsDown(68)) this.vel.x += 1;
    if (keyIsDown(this.controls.down) || keyIsDown(83)) this.vel.y += 1;
    this.vel.normalize();
    this.vel.mult(this.maxVel);

    this.checkWallHit();

    this.gun1.update();
    if (this.guns == 2) {
        this.gun2.update();
    }

    var mousePos = getMousePos();
    this.direction = p5.Vector.sub(mousePos, this.pos).heading();
    this.gun1.direction = p5.Vector.sub(mousePos, this.gun1.getPos()).heading();
    this.gun2.direction = p5.Vector.sub(mousePos, this.gun2.getPos()).heading();

    if (this.cooldown > 0) {
        this.cooldown -= this.game.gameSpeed;
    } else if (mouseIsPressed) {
        if (this.lastShot == 2 || this.guns == 1) {
            this.gun1.shoot();
            this.lastShot = 1;
        } else {
            this.gun2.shoot();
            this.lastShot = 2;
        }
        this.cooldown = 15;
    }

    if (this.shieldTimer > 0) {
        this.shieldTimer -= this.game.gameSpeed;
    }


}

Player.prototype.checkWallHit = function() {
    var futurePos = p5.Vector.add(this.pos, p5.Vector.mult(this.vel, this.game.gameSpeed));
    var wallCollision = collideWithWalls(futurePos, this.r, this.game.grid);
    if (wallCollision[0].x != futurePos.x || wallCollision[0].y != futurePos.y) {
        if (wallCollision[1] !== null && wallCollision[1].wall == 1) {
   //          wallCollision[1].wall --;
			// var cellMiddle = p5.Vector.add(wallCollision[1].pos, createVector(CELLSIZE * 0.5, CELLSIZE * 0.5));
			// this.game.particleExplosion(cellMiddle, 1, 100, this.vel.heading(), HALF_PI * 0.5, createVector(0, 0), 30, 20, 5, color(50), wallCollision[1]);
            wallCollision[1].break(this.vel.heading());
        }
    }
}

Player.prototype.die = function(enemy) {
    this.hide = true;
    this.freeze = true;

    this.game.slowMotion(360, 0.1);

    this.game.particleExplosion(this.pos, 2, 100, PI, PI, createVector(0, 0.1), 50, 5, 50, 3, color(160, 160, 200));

    this.game.gameOver = true;
    // console.log(enemy);
}

Player.prototype.draw = function() {
	var drawPos = getDrawPos(this.pos);
	// var drawR = cam.getDrawSize(this.r);

    push();
    translate(drawPos);

	fill(200, 200, 250);
	stroke(160, 160, 200);
    strokeWeight(2 * zoom);

	ellipse(0, 0, this.r * zoom * 2);

    fill(255, 0, 0, this.damaged * 4);
    noStroke();
    ellipse(0, 0, this.r * zoom * 2);

    pop();
}

Player.prototype.drawWeapon = function() {
    this.gun1.draw();
    if (this.guns == 2) {
        this.gun2.draw();
    }
}

// Player.prototype.draw = function(cam, scr) {
// 	var drawPos = cam.getDrawPos(this.pos.x, this.pos.y);
// 	var drawR = cam.getDrawSize(this.r);
//     scr.push();
//     scr.translate(drawPos);
//
// 	scr.fill(200, 200, 250);
// 	scr.stroke(160, 160, 200);
//     scr.strokeWeight(2 * drawR / this.r);
//
// 	scr.ellipse(0, 0, drawR * 2);
//
//     scr.fill(255, 0, 0, this.damaged * 4);
//     scr.noStroke();
//     scr.ellipse(0, 0, drawR * 2);
//
//     scr.pop();
// }
//
// Player.prototype.drawWeapon = function(cam, scr) {
//     this.gun1.draw(cam, scr);
//     if (this.guns == 2) {
//         this.gun2.draw(cam, scr);
//     }
//     // console.log(this);
//     // cam.draw(this.gun);
// }
