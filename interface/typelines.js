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

TypeLines.prototype.display = function() {
    for (var i = 0; i < this.typeTexts.length; i++) {
        this.typeTexts[i].display();
    }
}

TypeLines.prototype.isFinished = function() {
    return this.typeTexts[this.typeTexts.length - 1].isFinished();
}

// Displays all typeTexts on seperate lines
TypeLines.prototype.draw = function(x, y, yInterval) {
    var typing = true;
    var r = 10;
    for (var i = 0; i < this.typeTexts.length; i++) {
        if (typing) {
            if (arguments[i + 3] !== undefined) {
                r = arguments[i + 3];
            }
            this.typeTexts[i].draw(x, y, r);
            if (!this.typeTexts[i].isFinished()) {
                typing = false;
            }
            y += yInterval;
        }
    }
}
