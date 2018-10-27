// General object for all enemies
function Enemy(game, row, col, health, attackD, stayD, followD) {
	Entity.call(this, game, row, col, 15, health);

	game.enemies++;

	this.target = game.player;
	this.pathToTarget = null;

	this.timeSinceLastPath = 0;

	// The distances at which the enemy attacks the player, stays still or follows the player without a path
    this.attackD = attackD;
    this.stayD = stayD;
    this.followD = followD;

}

Enemy.prototype = Object.create(Entity.prototype);

Enemy.prototype.update = function() {
	var d = p5.Vector.dist(this.pos, this.target.pos);

    if (d < this.stayD || d < this.followD) {
        this.pathToTarget = null;
        if (d > this.stayD) {
			// Move towards the player
            this.moveTowards(this.target.pos);
        } else if (d > this.followD) {
			// Stay still
            this.moveTowards(this.pos);
        } else if (this.followD < this.stayD) {
            this.moveTowards(this.target.pos);
        } else {
            this.moveTowards(this.pos);
        }
    } else if (this.pathToTarget === null) {
        this.calculatePath();
    }

    this.followPath();

	if (d < this.attackD) {
		// Attack the player
		this.attack(this.target);
	}

	// Each enemy has specific attributes and weapons to update
    this.specificUpdate();
}

// When the enemy dies
Enemy.prototype.die = function(bullet) {
	this.dead = true;
	this.game.particleExplosion(this.pos, bullet.vel.mag() * 0.5, 50, bullet.vel.heading(), HALF_PI * 0.75, createVector(0, 0.1), 20, 1, 45, 3, theme.entity.enemy);
	this.game.enemyDeath(this);
	this.game.enemies--;
}
