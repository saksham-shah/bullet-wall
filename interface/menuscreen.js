function MenuScreen() {
    this.buttons = [];

    this.playButton = new Button(this, 400, 300, 400, 200, "PLAY", 100);

    this.buttons.push(this.playButton);

    this.title = new TypeText("BULLET WALL");
}

MenuScreen.prototype.update = function() {
    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].update();
    }

    this.title.startTyping();
}

MenuScreen.prototype.buttonClicked = function(button) {
    if (button === this.playButton) {
        nextScreen = gs;
        gs.newGame();
    }
}

MenuScreen.prototype.draw = function() {
    background(30, 40, 80);

    var r = 150;

    textAlign(CENTER);
    textSize(r);
    noStroke();

    fill(250, 75, 75);
    text(this.title.getText(), width/2 - r / 35 * 2, 200 - r / 35 * 2);
    fill(50);
    text(this.title.getText(), width/2 - r / 35, 200 - r / 35);
    fill(255);
    text(this.title.getText(), width/2, 200);

    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].draw();
    }

}
