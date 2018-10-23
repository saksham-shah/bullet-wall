var gs, ms, ds, ps;
var currentScreen, nextScreen;
var myCursor;

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

	myCursor = new GameCursor();
	noCursor();
}

function draw() {

	if (nextScreen !== currentScreen) {
		currentScreen = nextScreen;
	}

    currentScreen.update();
    currentScreen.draw();

	myCursor.draw();
	myCursor.mode = 0;

	textSize(20 * zoom);
	fill(255);
	noStroke();

	// Current version
	text("v1.2.4a EXPERIMENTAL - Please report all glitches or low frame rates", width * 0.5, height - 15 * zoom);
}

function mouseClicked() {
	var click = false;
	if (currentScreen.mouseClicked !== undefined) {
		click = currentScreen.mouseClicked();
	}

	if (!click && currentScreen.buttons !== undefined) {
		for (var i = 0; i < currentScreen.buttons.length; i++) {
			if (currentScreen.buttons[i].hovered) {
				currentScreen.buttonClicked(currentScreen.buttons[i]);
				currentScreen.buttons[i].hovered = false;
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
