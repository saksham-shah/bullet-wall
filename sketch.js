var gs, ms, ds, ps, ss, fs;
var currentScreen, nextScreen;
var myCursor;
var selfRecord = false;
var coverimg;

var now, dt, lastUpdate;

function preload() {
	coverimg = loadImage("media/bwcoverimghd.png");
}

function setup() {

	this.lastUpdate = Date.now();

	if (windowWidth > windowHeight * 16 / 9) {
		createCanvas((windowHeight - 10) * 16 / 9, windowHeight - 10);
	} else {
		createCanvas(windowWidth - 10, (windowWidth - 10) * 9 / 16);
	}

	calcOffsets();

	ss = new StartScreen();

	ms = new MenuScreen();

	fs = new FadeScreen();

	gs = new GameScreen();

	ds = new DeathScreen();

	ps = new PauseScreen();

	nextScreen = ss;

	myCursor = new GameCursor();
	noCursor();

	createSpawns();
	createPowerUps();
}

function draw() {

	now = Date.now();
	dt = (now - lastUpdate) / (1000 / 60); //dt will be 1 at 60fps
	lastUpdate = now;
	if (dt > 15) {
		dt = 15;
	}

	if (nextScreen !== currentScreen) {
		currentScreen = nextScreen;
	}

    currentScreen.update();
    currentScreen.draw();

	myCursor.draw();
	myCursor.mode = 0;

	// Current version
	textSize(30 * screenZoom);
	fill(255);
	noStroke();
	if (currentScreen !== ss) {
		text("v1.3.1b", width * 0.5, height - 30 * screenZoom);
	}
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
