function DeathScreen() {
    this.game = null;

    this.text1 = new TypeText("GAME OVER");
    this.text2 = new TypeText("YOU SCORED");

    this.buttons = [];

    this.restartButton = new Button(this, width * 0.5 - 150 * zoom, height * 0.75, 300 * zoom, 150 * zoom, "RESTART", 50 * zoom);

    this.buttons.push(this.restartButton);

}

DeathScreen.prototype.newDeath = function(game) {
    this.game = game;

    this.text3 = new TypeText(String(this.game.score));

    this.text1.stopTyping();
    this.text2.stopTyping();

}

DeathScreen.prototype.update = function() {
    this.text1.startTyping();

    if (this.text1.done) {
        this.text2.startTyping();

        if (this.text2.done) {
            this.text3.startTyping();

            if (this.text3.done) {
                for (var i = 0; i < this.buttons.length; i++) {
                    this.buttons[i].update();
                }
            }
        }
    }
}

DeathScreen.prototype.buttonClicked = function(button) {
    if (button === this.restartButton) {
        nextScreen = gs;
        gs.newGame();
    }
}

DeathScreen.prototype.draw = function() {
    background(30, 40, 80);

    // var r = 100;

    // textAlign(CENTER);
    // textSize(r);
    // noStroke();

    // fill(250, 75, 75);
    // text(this.text1.getText(), width/2 - r / 35 * 2, 200 - r / 35 * 2);
    // fill(50);
    // text(this.text1.getText(), width/2 - r / 35, 200 - r / 35);
    // fill(255);
    // text(this.text1.getText(), width/2, 200);
    this.text1.draw(width * 0.5, height * 0.2, 100 * zoom);

    if (this.text1.done) {

        this.text2.draw(width * 0.5, height * 0.4, 50 * zoom);
        // var r = 50;

        // textSize(r);

        // fill(250, 75, 75);
        // text(this.text2.getText(), width/2 - r / 35 * 2, 350 - r / 35 * 2);
        // fill(50);
        // text(this.text2.getText(), width/2 - r / 35, 350 - r / 35);
        // fill(255);
        // text(this.text2.getText(), width/2, 350);

        if (this.text2.done) {

            this.text3.draw(width * 0.5, height * 0.6, 150 * zoom);
            // var r = 150;

            // textSize(r);

            // fill(250, 75, 75);
            // text(this.text3.getText(), width/2 - r / 35 * 2, 500 - r / 35 * 2);
            // fill(50);
            // text(this.text3.getText(), width/2 - r / 35, 500 - r / 35);
            // fill(255);
            // text(this.text3.getText(), width/2, 500);

            if (this.text3.done) {
                for (var i = 0; i < this.buttons.length; i++) {
                    this.buttons[i].draw();
                }
            }

        }
    }

}
