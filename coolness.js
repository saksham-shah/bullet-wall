Game.prototype.addCoolness = function(eventType, data) {
    var cool = 0;
    switch (eventType) {
        case "bulletHit":
        cool = data.time + 100;
        if (data.health == 0) {
            cool += 50 + data.scoreValue;
        }
        break;
        case "bulletDodge":
        var cool = 250 / (data.distance);
        if (cool > 25) {
            cool = 25;
        }
        cool *= this.gameSpeed;
        break;
        case "enemyDodge":
        cool = 0.7 * this.gameSpeed;
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
    //     console.log(`${cool} : ${eventType} : ${this.coolness}`);
    // }
}
