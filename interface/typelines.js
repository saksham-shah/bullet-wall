// Multiple lines of typeText (e.g. on the death screen)
function TypeLines() {
    this.typeTexts = []

    for (var i = 0; i < arguments.length; i++) {
        var typeText = new TypeText(arguments[i]);
        this.typeTexts.push(typeText);
    }
}

TypeLines.prototype.update = function() {
    var typing = true;
    for (var i = 0; i < this.typeTexts.length; i++) {
        if (typing) {
            this.typeTexts[i].startTyping();
            if (!this.typeTexts[i].isFinished()) {
                typing = false;
            }
        }
    }
}

TypeLines.prototype.isFinished = function() {
    return this.typeTexts[this.typeTexts.length - 1].isFinished();
}

TypeLines.prototype.draw = function(x, y, yInterval) {
    var typing = true;
    // var sizes = arguments.slice(3);
    for (var i = 0; i < this.typeTexts.length; i++) {
        if (typing) {
            this.typeTexts[i].draw(x, y, arguments[i + 3]);
            if (!this.typeTexts[i].isFinished()) {
                typing = false;
            }
            y += yInterval;
        }
    }
}
