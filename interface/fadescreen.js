// Fade over another screen
function FadeScreen() {
    this.parentScr = null;
    this.buttons = [];

    this.fade = 150;
    // this.texts = [];

    this.title = new TypeText();
}

FadeScreen.prototype.createButtons = function() {
    this.createButtonsFunc(this);
}

FadeScreen.prototype.newScreen = function(parentScr, title, fade, createButtons, buttonClickedFuncs, initialise, params) {

    this.buttons = [];
    // this.texts = [];

    this.titleString = title;

    this.fade = fade;

    this.parentScr = parentScr;
    this.createButtonsFunc = createButtons;
    this.buttonClickedFuncs = buttonClickedFuncs;

    initialise(this, params);
    this.createButtons();
}

FadeScreen.prototype.buttonClicked = function(button) {
    for (var i = 0; i < this.buttons.length; i++) {
        if (button === this.buttons[i]) {
            this.buttonClickedFuncs[i](this);
        }
    }
}

FadeScreen.prototype.update = function() {
    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].update();
    }
}

FadeScreen.prototype.draw = function() {
    if (this.parentScr !== null) {
        this.parentScr.draw();
    }

    var c = color(theme.background);
    c.setAlpha(this.fade);
    fill(c);
    noStroke();

    rect(0, 0, width, height);

    // for (var i = 0; i < this.texts.length; i++) {
    //     this.texts[i].draw();
    // }

    this.title.draw(width * 0.5, height * 0.2, 150 * screenZoom, this.titleString);

    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].draw();
    }
}
