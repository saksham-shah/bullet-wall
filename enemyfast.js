function EnemyFast(game, row, col) {
	Entity.call(this, game, row, col, 10);
}

EnemyFast.prototype = Object.create(Entity.prototype);

EnemyFast.prototype.update = function() {

}

EnemyFast.prototype.draw = function() {
	
}