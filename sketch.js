var gs, ms, ds;
var currentScreen, nextScreen;

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

	if (nextScreen !== currentScreen) {
		currentScreen = nextScreen;
	}

    currentScreen.update();
    currentScreen.draw();

	textSize(20 * zoom);
	fill(255);
	noStroke();

	// Current version
	text("v1.1.3a", width - 48 * zoom, height - 27 * zoom);
}

function mouseClicked() {
	if (currentScreen.buttons !== undefined) {
		for (var i = 0; i < currentScreen.buttons.length; i++) {
			if (currentScreen.buttons[i].hovered) {
				currentScreen.buttonClicked(currentScreen.buttons[i]);
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
