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

	this.timeSinceLastPath ++;

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

    var d = p5.Vector.dist(this.pos, this.target.pos);
    if (d < this.attackD) {
        this.attack();
    }

    // var moved = false;

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
			this.attack();
		}

        if (p5.Vector.dist(this.pos, this.pathToTarget[0].pos.copy().add(createVector(CELLSIZE * 0.5, CELLSIZE * 0.5))) < this.r + CELLSIZE) {
            this.pathToTarget.splice(0, 1);
            if (this.pathToTarget.length > 1 && this.pathToTarget[0].wall == 0) {
                this.pathToTarget.splice(0, 1);
            }
        }

        if (this.pathToTarget.length > 0) {
            var cellPos = this.pathToTarget[0].pos.copy();
			cellPos.add(createVector(CELLSIZE * 0.5, CELLSIZE * 0.5));
			this.moveTowards(cellPos);
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

Enemy.prototype.die = function() {
	this.game.grid.getCell(this.pos).wall = 2;
	this.dead = true;
}
