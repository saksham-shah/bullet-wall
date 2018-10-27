Game.prototype.addCoolness = function(eventType, data) {
    var cool = 0;
    switch (eventType) {
        case "bulletHit":
        cool = data.time + 50;
        // if (data.health == 0) {
        //     cool += 50;
        // }
        break;
        case "bulletDodge":
        // var cool = 250 / (data.distance);
        // if (cool > 25) {
        //     cool = 25;
        // }
        // cool *= this.gameSpeed;
        cool = 50;
        // console.log(cool);
        break;
        case "enemyDodge":
        cool = 0.7 * this.gameSpeed;
        break;
        case "enemyDeath":
        cool = 100 + data.scoreValue;
        // console.log(cool);
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
