function Enemy(game, row, col, attackD, stayD, followD) {
	Entity.call(this, game, row, col, 15);

	this.target = game.player;
	this.pathToTarget = null;

	this.timeSinceLastPath = 0;

    this.attackD = attackD;
    this.stayD = stayD;
    this.followD = followD;

}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.update = function() {
	// this.weaponPos = this.pos.copy().add(createVector(this.weaponExtend, 0).rotate(this.vel.heading()));

	this.timeSinceLastPath += this.game.gameSpeed;

	// if (this.pathToTarget === null) {
	// 	if (p5.Vector.dist(this.pos, this.target.pos) < CELLSIZE * 1.5) {
	// 		this.moveTowards(this.target.pos);
	// 		this.attack();
	// 	} else {
	// 		this.calculatePath();
	// 	}
	// } else {
	// 	if (this.timeSinceLastPath > 60) {
	// 		this.calculatePath();
	// 	}
    //
	// 	//if (this.game.grid.getCell(this.pos) === this.pathToTarget[0]) {
	// 	var d = p5.Vector.dist(this.pos, this.pathToTarget[0].pos.copy().add(createVector(CELLSIZE * 0.5, CELLSIZE * 0.5)));
	// 	if (d < this.r + CELLSIZE) {
	// 		this.pathToTarget.splice(0, 1);
	// 		if (this.pathToTarget.length > 0) {
	// 			if (this.pathToTarget[0].wall == 0) {
	// 				this.pathToTarget.splice(0, 1);
	// 			}
	// 		}
	// 	}
    //
	// 	if (p5.Vector.dist(this.pos, this.target.pos) < CELLSIZE * 1.5 || this.pathToTarget.length == 0) {
	// 		this.moveTowards(this.target.pos);
	// 		// this.attack();
	// 		this.pathToTarget = null;
	// 	} else {
	// 		var cellPos = this.pathToTarget[0].pos.copy();
	// 		cellPos.add(createVector(CELLSIZE * 0.5, CELLSIZE * 0.5));
	// 		this.moveTowards(cellPos);
	// 	}
	// }



    // var moved = false;
	// var attacked = false;

    if (d < this.stayD || d < this.followD) {
        this.pathToTarget = null;
        // this.movec = true;
        if (d > this.stayD) {
            this.moveTowards(this.target.pos);
        } else if (d > this.followD) {
            this.moveTowards(this.pos);
        } else if (this.followD < this.stayD) {
            this.moveTowards(this.target.pos);
        } else {
            this.moveTowards(this.pos);
        }
    } else if (this.pathToTarget === null) {
        this.calculatePath();
    }

    if (this.pathToTarget !== null) {
        if (this.timeSinceLastPath > 60 || this.pathToTarget.length == 0) {
			this.calculatePath();
		}

		if (this.pathToTarget[0].wall > 0) {
			this.attack(this.pathToTarget[0]);
		}

        if (p5.Vector.dist(this.pos, this.pathToTarget[0].middle()) < this.r + CELLSIZE * 0.4) {
            this.pathToTarget.splice(0, 1);
            if (this.pathToTarget.length > 1 && this.pathToTarget[0].wall == 0) {
                this.pathToTarget.splice(0, 1);
            }
        }

        if (this.pathToTarget.length > 0) {
   //          var cellPos = this.pathToTarget[0].pos.copy();
			// cellPos.add(createVector(CELLSIZE * 0.5, CELLSIZE * 0.5));
			this.moveTowards(this.pathToTarget[0].middle());
        }

		var d = p5.Vector.dist(this.pos, this.target.pos);
	    if (d < this.attackD) {
	    	this.attack(this.target);
	    }
    }

    this.specificUpdate();
}

Enemy.prototype.calculatePath = function() {
	this.pathToTarget = findPath(this.game.grid.grid, this.game.grid.getCell(this.pos), this.game.grid.getCell(this.target.pos), this);
	this.timeSinceLastPath = 0;
}

Enemy.prototype.moveTowards = function(pos) {
	var vectorToTarget = p5.Vector.sub(pos, this.pos);
	vectorToTarget.normalize();
	vectorToTarget.mult(this.maxVel);
	vectorToTarget.sub(this.vel);
	vectorToTarget.limit(this.maxForce);
	this.acc.add(vectorToTarget);
}

Enemy.prototype.die = function(bullet) {
	var myCell = this.game.grid.getCell(this.pos);
	var playerCell = this.game.grid.getCell(this.game.player.pos);
	if (myCell !== playerCell) {
		// this.game.grid.getCell(this.pos).wall = 2;
		// var myCellMiddle = p5.Vector.add(myCell.pos, createVector(CELLSIZE * 0.5, CELLSIZE * 0.5));
		// this.game.particleExplosion(myCellMiddle, 1, 100, PI, PI, createVector(0, 0), 30, 30, 7, color(50), myCell)
		myCell.build();
	}
	this.dead = true;
	this.game.particleExplosion(this.pos, bullet.vel.mag() * 0.5, 50, bullet.vel.heading(), HALF_PI * 0.75, createVector(0, 0.1), 20, 1, 45, 3, color(200, 60, 60));

	this.game.enemyDeath(this);
	// this.game.slowMo = 60;
	// this.game.gameSpeed = 0.2;
}
