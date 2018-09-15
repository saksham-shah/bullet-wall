function TypeText(text_) {
    this.text = text_;

    if (this.text !== undefined) {
        this.counter = this.text.length;
    } else {
        this.counter = 0;
    }

    this.timePassed = 0;
    this.typeSpeed = 8;
    this.typing = false;
    this.done = false;
}

TypeText.prototype.startTyping = function() {
    if (this.typing) {
        this.timePassed ++;
        if (this.timePassed > 60 / this.typeSpeed) {
            if (this.counter < this.text.length) {
                this.counter ++;
                this.timePassed = 0;
            } else {
                this.done = true;
            }
        }
    } else {
        this.typing = true;
        this.done = false;
        this.counter = 1;
        this.timePassed = 0;
    }
}

TypeText.prototype.reset = function() {
    this.counter = 1;
    this.timePassed = 0;
}

TypeText.prototype.stopTyping = function() {
    this.counter = this.text.length;
    this.typing = false;
}

TypeText.prototype.getText = function() {
    return this.text.slice(0, this.counter)
}

TypeText.prototype.draw = function(x, y, r, textToType) {
    noStroke();
    textAlign(CENTER);

    textSize(r);

    if (this.text !== undefined) {
        var t = this.getText();
    } else {
        var t = textToType;
    }

    fill(250, 75, 75);
    text(t, x - r / 35 * 2, y + r / 3 - r / 35 * 2);
    fill(50);
    text(t, x - r / 35, y + r / 3 - r / 35);
    fill(255);
    text(t, x, y + r / 3);
}