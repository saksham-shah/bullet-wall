function GameRecord(duration) {
    this.frames = [];
    this.time = 0;
    this.duration = duration;
    this.lastFrame = 0;
}

GameRecord.prototype.addFrame = function(snap) {
    // this.time += 1;
    this.lastFrame += snap.dt;
    if (this.lastFrame > 1) {
        this.frames.push(snap);
        this.lastFrame--;
    }
    while(this.frames.length > this.duration) {
        var f = this.frames.splice(0, 1)[0];
        // this.time -= 1;
    }
}

GameRecord.prototype.createGameClip = function() {
    return new GameClip(this.frames.slice());
}

function GameClip(frames) {
    this.frames = frames;
    // this.counter = this.frames.length - 30;
    // this.nextFrame();
    this.counter = 0;
}

GameClip.prototype.nextFrame = function() {
    this.counter = (this.counter + 1) % this.frames.length;
    // console.log(this.counter);
}

GameClip.prototype.draw = function(x, y, z) {
    drawGame(x, y, z, this.frames[this.counter]);
}
