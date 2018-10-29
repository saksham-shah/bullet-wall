Game.prototype.addCoolness = function(eventType, data) {
    var cool = 0;
    switch (eventType) {
        case "bulletHit":
        cool = data.time * 0.5 + 50;
        break;
        case "bulletDodge":
        cool = 50;
        break;
        case "enemyDodge":
        cool = 0.5 * this.gameSpeed;
        break;
        case "enemyDeath":
        cool = 100 + data.scoreValue;
        break;
        case "loseLife":
        cool = -300;
        break;
        case "buildWall":
        cool = -50;
        break;
        case "shootBullet":
        cool = -50;
        break;
        default:
        console.log(eventType);
    }

    this.coolness += cool;

    // if (eventType != "enemyDodge") {
        // console.log(`${cool} : ${eventType} : ${this.coolness}`);
    // }
}
