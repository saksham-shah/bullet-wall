function StartScreen() {
	this.title = new TypeText("BULLET WALL");

	this.time = 0;
}

StartScreen.prototype.update = function() {
	this.title.startTyping();

	if (this.title.isFinished()) {
		this.time += 0.05;
	}
}

StartScreen.prototype.mouseClicked = function() {
	if (this.title.isFinished()) {
		nextScreen = ms;
		theme = THEMES[themeID].obj;
	}
}

StartScreen.prototype.draw = function() {
	// background(theme.background);
	image(coverimg, 0, 0, width, height);

	fill(30, 40, 80, 150);
	noStroke();
	rect(0, 0, width, height);

	push();
	translate(width * 0.5, height * 0.3);
	rotate(0.15);
	this.title.draw(0, 0, 150 * screenZoom);

	pop();

	if (this.title.isFinished()) {
		textSize(30 * screenZoom);
		textAlign(CENTER);
		fill(255, map(-cos(this.time), -1, 1, 0, 255));
		noStroke();
		text("Click to begin", width * 0.5, height - 150 * screenZoom);
	}
}