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
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
        this.hovered = true;
        this.text.startTyping();

        if (mouseIsPressed) {
            this.screen.buttonClicked(this);
        }

    } else {
        this.hovered = false;
        this.text.stopTyping();
    }
}

Button.prototype.draw = function() {
    fill(60, 80, 160);
    stroke(45, 60, 120);
    strokeWeight(7 * zoom);

    if (this.hovered) {
        fill(75, 100, 200);
    }

    rect(this.x, this.y, this.w, this.h);

    this.text.draw(this.x + this.w * 0.5, this.y + this.h * 0.5, this.r);

    // noStroke();
    // textAlign(CENTER);

    // // var r = 50;
    // textSize(this.r);

    // fill(250, 75, 75);
    // text(this.text.getText(), this.x + this.w * 0.5 - this.r / 35 * 2, this.y + this.h * 0.5 + this.r / 3 - this.r / 35 * 2);
    // fill(50);
    // text(this.text.getText(), this.x + this.w * 0.5 - this.r / 35, this.y + this.h * 0.5 + this.r / 3 - this.r / 35);
    // fill(255);
    // text(this.text.getText(), this.x + this.w * 0.5, this.y + this.h * 0.5 + this.r / 3);
}
