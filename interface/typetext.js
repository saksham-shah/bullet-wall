function TypeText(text_) {
    this.text = text_;
    this.counter = this.text.length;
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
