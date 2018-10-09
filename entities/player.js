// Player entity, controlled by the keyboard
function Player(game, row, col, controls) {
    Entity.call(this, game, row, col, 15, 3);
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

    this.weapon = 0;
    this.ammo = 0;

    this.mass = 50;

    // this.health = 3;

    this.shield = true;
    this.shieldTimer = 0;

    this.direction = 0;
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.update = function() {
    this.control();
    this.checkWallHit();
    this.updateGuns();
    this.checkShoot();

    if (this.shieldTimer > 0) {
        this.shieldTimer -= this.game.gameSpeed;
    }
}

// Control the player using the arrow keys
Player.prototype.control = function() {
    this.vel.mult(0, 0);
    // Controlled by arrow keys or WASD
    if (keyIsDown(this.controls.left) || keyIsDown(65)) this.vel.x -= 1;
    if (keyIsDown(this.controls.up) || keyIsDown(87)) this.vel.y -= 1;
    if (keyIsDown(this.controls.right) || keyIsDown(68)) this.vel.x += 1;
    if (keyIsDown(this.controls.down) || keyIsDown(83)) this.vel.y += 1;

    // Moves at the same speed no matter which direction it is in
    this.vel.normalize();
    this.vel.mult(this.maxVel);
}

Player.prototype.updateGuns = function() {
    this.gun1.update();
    if (this.guns == 2) {
        this.gun2.update();
    }

    // Points towards the mouse
    var mousePos = getMousePos();
    this.direction = p5.Vector.sub(mousePos, this.pos).heading();
    this.gun1.direction = p5.Vector.sub(mousePos, this.gun1.getPos()).heading();
    this.gun2.direction = p5.Vector.sub(mousePos, this.gun2.getPos()).heading();
}

// Control shooting different bullets and from different guns
Player.prototype.checkShoot = function() {
    if (this.cooldown > 0) {
        this.cooldown -= this.game.gameSpeed;
    } else if (mouseIsPressed) {
        switch(this.weapon) {
            case 0: // Normal bullets
            // If guns = 2, shots are taken with alternate guns
            if (this.guns == 1) {
                this.gun1.shoot(1, true);
                this.lastShot = 1;
            } else {
                if (this.lastShot == 1) {
                    this.gun2.shoot(1, false);
                    this.lastShot = 2;
                } else {
                    this.gun1.shoot(1, false);
                    this.lastShot = 1;
                }
            }
            if (this.guns == 1) {
                this.cooldown = 30;
            } else {
                this.cooldown = 15;
            }
            break;

            case 1:
            // Disc
            var meToMouse = p5.Vector.sub(getMousePos(), this.pos);
            var disc = new Disc(this.game, this.gun1.getPos(), meToMouse.heading());
            this.game.bullets.push(disc);
            this.ammo --;
            this.gun1.shootAnimation();
            this.cooldown = 30;
            if (this.ammo <= 0) {
                this.weapon = 0;
            }
        }
    }
}

// If you collide with a 'soft wall' (wall which has already been attacked once), you break it
Player.prototype.checkWallHit = function() {
    var futurePos = p5.Vector.add(this.pos, p5.Vector.mult(this.vel, this.game.gameSpeed));
    var wallCollision = collideWithWalls(futurePos, this.r, this.game.grid);
    if (wallCollision[0].x != futurePos.x || wallCollision[0].y != futurePos.y) {
        if (wallCollision[1] !== null) {
            if (wallCollision[1].wall == 1) {
                wallCollision[1].break(this.vel.heading());
            }
        }
    }
}

// When the player dies, the game ends
Player.prototype.die = function(enemy) {
    this.hide = true;
    this.freeze = true;

    // Mega slow motion
    this.game.slowMotion(360, 0.1);

    this.game.particleExplosion(this.pos, 2, 100, PI, PI, createVector(0, 0.1), 50, 5, 50, 3, color(160, 160, 200));

    this.game.gameOver = true;
}

Player.prototype.specificDraw = function() {
	fill(200, 200, 250);
	stroke(160, 160, 200);
    strokeWeight(2 * zoom);

	ellipse(0, 0, this.r * zoom * 2);
}

Player.prototype.drawWeapon = function() {
    this.gun1.draw();
    if (this.guns == 2) {
        this.gun2.draw();
    }
}
