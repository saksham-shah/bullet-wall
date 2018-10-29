// Records the game using objects (I've called them 'snaps')
function GameRecord(duration) {
    this.frames = [];
    this.time = 0;
    this.duration = duration;
    this.lastFrame = 0;
}

// Records at 60 fps
GameRecord.prototype.addFrame = function(snap) {
    this.time += snap.dt;
    this.lastFrame += snap.dt;
    while (this.lastFrame > 1) {
        this.frames.push(snap);
        this.lastFrame--;
    }
    // Maintains the specified duration
    while(this.time > this.duration) {
        var f = this.frames.splice(0, 1)[0];
        this.time -= 1;
    }
}

GameRecord.prototype.createGameClip = function(x, y, r, coolness) {
    return new GameClip(this.frames.slice(), x, y, r, coolness);
}

// User side version of GameRecord - has features like fullscreen
function GameClip(frames, x, y, r, coolness) {
    this.frames = frames;

    this.x = x;
    this.y = y;
    this.r = r;
    this.z = this.r / GRIDSIZE / CELLSIZE;

    this.coolness = coolness;
    this.counter = 0;

    this.thumbnail = random(this.frames);

    this.fullscreen = false;
    this.playing = false;
}

GameClip.prototype.setPos = function(x, y, r) {
    if (r !== undefined) {
        this.r = r;
        this.z = this.r / GRIDSIZE / CELLSIZE;
    }

    this.x = x;
    this.y = y;
}

// Checks if it is being hovered over
GameClip.prototype.mouseHovered = function() {
    if (!this.fullscreen) {
        if (mouseX > this.x && mouseX < this.x + this.r && mouseY > this.y && mouseY < this.y + this.r) {
            return true;
        }
    } else {
        if (mouseX > width * 0.5 - GRIDSIZE * CELLSIZE * zoom * 0.5 &&
            mouseX < width * 0.5 - GRIDSIZE * CELLSIZE * zoom * 0.5 + GRIDSIZE * CELLSIZE * zoom &&
            mouseY > height * 0.5 - GRIDSIZE * CELLSIZE * zoom * 0.5 &&
            mouseY < height * 0.5 - GRIDSIZE * CELLSIZE * zoom * 0.5 + GRIDSIZE * CELLSIZE * zoom) {
            return true;
        }
    }
    return false;
}

// Toggles fullscreen when clicked
GameClip.prototype.clicked = function() {
    this.fullScreen();
    return this.fullscreen;
}

GameClip.prototype.fullScreen = function() {
    this.fullscreen = !this.fullscreen;
    if (this.fullscreen) {
        this.counter = 0;
        this.playing = true;
    } else {
        this.playing = false;
    }
}

// Loops around the clip forever
GameClip.prototype.nextFrame = function() {
    if (this.playing) {
        this.counter = (this.counter + 1) % this.frames.length;
    }
}

GameClip.prototype.pause = function() {
    this.playing = !this.playing;
}

GameClip.prototype.draw = function(forced) {
    if (!this.fullscreen || forced) {
        drawGame(this.x, this.y, this.z, this.thumbnail);
        if (!this.playing && !this.mouseHovered()) {
            fill(255, 100);
            stroke(200, 100);
            strokeWeight(this.r * 0.01);

            // Transparent play button
            beginShape();
            vertex(this.x + this.r / 3, this.y + this.r / 3);
            vertex(this.x + this.r / 3, this.y + this.r * 2 / 3);
            vertex(this.x + this.r * 2 / 3, this.y + this.r / 2);
            vertex(this.x + this.r / 3, this.y + this.r / 3);
            endShape();
        }
    } else {
        drawGame(width * 0.5 - GRIDSIZE * CELLSIZE * zoom * 0.5, height * 0.5 - GRIDSIZE * CELLSIZE * zoom * 0.5, zoom, this.frames[this.counter]);
    }
}
