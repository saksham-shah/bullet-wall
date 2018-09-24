var gs, ms, ds;
var screen, nextScreen;

function setup() {
	if (windowWidth > windowHeight * 16 / 9) {
		createCanvas((windowHeight - 10) * 16 / 9, windowHeight - 10);
	} else {
		createCanvas(windowWidth - 10, (windowWidth - 10) * 9 / 16);
	}

	calcOffsets();

	ms = new MenuScreen();

	gs = new GameScreen();

	ds = new DeathScreen();

	ps = new PauseScreen();

	nextScreen = ms;
}

function draw() {

	if (nextScreen !== screen) {
		screen = nextScreen;
	}

    screen.update();
    screen.draw();

	textSize(20 * zoom);
	fill(255);
	noStroke();

	// Current version
	text("v1.1.3", width - 48 * zoom, height - 27 * zoom);
}

function mouseClicked() {
	if (screen.buttons !== undefined) {
		for (var i = 0; i < screen.buttons.length; i++) {
			if (screen.buttons[i].hovered) {
				screen.buttonClicked(screen.buttons[i]);
			}
		}
	}
}

function windowResized() {
	if (windowWidth > windowHeight * 16 / 9) {
		resizeCanvas((windowHeight - 10) * 16 / 9, windowHeight - 10);
	} else {
		resizeCanvas(windowWidth - 10, (windowWidth - 10) * 9 / 16);
	}


	calcOffsets();

	ms.createButtons();
	ds.createButtons();
	ps.createButtons();
}
