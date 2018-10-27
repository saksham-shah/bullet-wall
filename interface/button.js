// Button with typing text
function Button(screen_, x_, y_, w_, h_, text_, r_) {
    this.x = x_;
    this.y = y_;
    this.w = w_;
    this.h = h_;

    this.text = new TypeText(text_);
    this.r = r_;

    this.screen = screen_;
}

Button.prototype.update = function() {
    // If mouse is hovering over the button
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
        this.hovered = true;
        // Makes the text type
        this.text.startTyping();

        // if (mouseIsPressed) {
        //     this.screen.buttonClicked(this);
        // }

    } else {
        this.hovered = false;
        this.text.stopTyping();
    }
}

Button.prototype.draw = function() {
    fill(theme.button.fill);
    stroke(theme.button.stroke);
    strokeWeight(7 * screenZoom);

    // Lighter blue if hovered
    if (this.hovered) {
        fill(theme.button.hover);
    }

    rect(this.x, this.y, this.w, this.h);

    this.text.draw(this.x + this.w * 0.5, this.y + this.h * 0.5, this.r);
}
