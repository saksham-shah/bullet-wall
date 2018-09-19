function MenuScreen() {
    this.buttons = [];

    this.playButton = new Button(this, width * 0.5 - 200 * zoom, height * 0.5 - 100 * zoom, 400 * zoom, 200 * zoom, "PLAY", 100 * zoom);

    this.buttons.push(this.playButton);

    this.title = new TypeText("BULLET WALL");
}

MenuScreen.prototype.update = function() {
    // for (var i = 0; i < this.buttons.length; i++) {
    //     this.buttons[i].update();
    // }

    this.title.startTyping();

    if (this.title.done) {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].update();
        }
    }
}

MenuScreen.prototype.buttonClicked = function(button) {
    if (button === this.playButton) {
        nextScreen = gs;
        gs.newGame();
    }
}

MenuScreen.prototype.draw = function() {
    background(30, 40, 80);

    // var r = 150;

    // textAlign(CENTER);
    // textSize(r);
    // noStroke();

    // fill(250, 75, 75);
    // text(this.title.getText(), width/2 - r / 35 * 2, 200 - r / 35 * 2);
    // fill(50);
    // text(this.title.getText(), width/2 - r / 35, 200 - r / 35);
    // fill(255);
    // text(this.title.getText(), width/2, 200);

    this.title.draw(width * 0.5, height * 0.2, 150 * zoom);

    if (this.title.done) {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw();
        }
    }

}
