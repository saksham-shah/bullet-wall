// Text which types on screen
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

// Text starts to type on the screen
TypeText.prototype.startTyping = function() {
    // If it was already typing, continue typing
    if (this.typing) {
        this.timePassed ++;
        if (this.timePassed > 60 / this.typeSpeed) {
            if (this.counter < this.text.length) {
                this.counter ++;
                this.timePassed = 0;
            } else {
                // Whole text has been typed
                this.done = true;
            }
        }
    } else {
        // Else start typing
        this.typing = true;
        this.done = false;
        this.counter = 1;
        this.timePassed = 0;
    }
}

// Unused
TypeText.prototype.reset = function() {
    this.counter = 1;
    this.timePassed = 0;
}

// Stop typing and display the whole text
TypeText.prototype.stopTyping = function() {
    this.counter = this.text.length;
    this.typing = false;
}

// Whether the text has been completely typed
TypeText.prototype.isFinished = function() {
    return this.done;
}

// Get the text which is to be displayed
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

    // 3D effect
    fill(250, 75, 75);
    text(t, x - r / 35 * 2, y + r / 3 - r / 35 * 2);
    fill(50);
    text(t, x - r / 35, y + r / 3 - r / 35);
    fill(255);
    text(t, x, y + r / 3);
}
