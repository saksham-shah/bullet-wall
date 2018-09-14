function DeathScreen() {
    this.game = null;

    this.text1 = new TypeText("GAME OVER");
    this.text2 = new TypeText("YOU SCORED");

    this.buttons = [];

    this.restartButton = new Button(this, 450, 600, 300, 150, "RESTART", 50);

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

    var r = 100;

    textAlign(CENTER);
    textSize(r);
    noStroke();

    fill(250, 75, 75);
    text(this.text1.getText(), width/2 - r / 35 * 2, 200 - r / 35 * 2);
    fill(50);
    text(this.text1.getText(), width/2 - r / 35, 200 - r / 35);
    fill(255);
    text(this.text1.getText(), width/2, 200);

    if (this.text1.done) {
        var r = 50;

        textSize(r);

        fill(250, 75, 75);
        text(this.text2.getText(), width/2 - r / 35 * 2, 350 - r / 35 * 2);
        fill(50);
        text(this.text2.getText(), width/2 - r / 35, 350 - r / 35);
        fill(255);
        text(this.text2.getText(), width/2, 350);

        if (this.text2.done) {
            var r = 150;

            textSize(r);

            fill(250, 75, 75);
            text(this.text3.getText(), width/2 - r / 35 * 2, 500 - r / 35 * 2);
            fill(50);
            text(this.text3.getText(), width/2 - r / 35, 500 - r / 35);
            fill(255);
            text(this.text3.getText(), width/2, 500);

            if (this.text3.done) {
                for (var i = 0; i < this.buttons.length; i++) {
                    this.buttons[i].draw();
                }
            }

        }
    }

}