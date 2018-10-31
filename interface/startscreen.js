function StartScreen() {
	// this.title = new TypeText("BULLET WALL");

	this.time = 0;

	this.titleR = 0;
	this.titleVel = 0;
	this.titleAcc = 0;
	this.titleSin = 0.5;
	this.grown = false;
}

StartScreen.prototype.update = function() {
	// this.title.startTyping();
	if (this.titleR > 200) {
		this.titleR = 200;
	} else if (this.titleR == 200) {
		this.time += dt;
		if (this.titleSin > 0.07) {
			this.titleSin -= 0.003 * dt;
		}
	} else {
		this.titleR += 10 * dt;
	}

	// this.titleAcc = 0;
	//
	// if (this.titleR > 150) {
	// 	this.grown = true;
	// 	this.titleAcc = -1;
	// } else if (this.titleR < 150) {
	// 	this.titleAcc = 1;
	// }
	//
	// if (this.titleVel > 5) {
	// 	this.titleVel = 5;
	// } else if (this.titleVel < -5) {
	// 	this.titleVel = -5;
	// }
	//
	// this.titleVel += this.titleAcc;
	// this.titleR += this.titleVel;
	//
	// if (this.grown) {
	// 	this.time++;
	// }
}

StartScreen.prototype.mouseClicked = function() {
	// if (this.title.isFinished()) {
	nextScreen = ms;
	theme = THEMES[themeID];
	// }
}

StartScreen.prototype.draw = function() {
	image(coverimg, 0, 0, width, height);

	// Slightly darkened background
	fill(30, 40, 80, 150);
	noStroke();
	rect(0, 0, width, height);

	// Rotated title
	push();
	translate(width * 0.5, height * 0.3);
	rotate(0.15);
	var r = this.titleR * map(sin(this.time * TWO_PI / 60), -1, 1, 1 - this.titleSin, 1 + this.titleSin);// * map(sin(this.time * ));
	drawText("BULLET WALL", 0, 0, r * screenZoom);

	pop();

	// Flashing 'click to begin' message
	// if (this.title.isFinished()) {
	if (this.titleR >= 150) {
		textSize(45 * screenZoom);
		textAlign(CENTER);
		fill(255, map(-cos(this.time * TWO_PI / 180), -1, 1, 0, 255));
		noStroke();
		text("Click to begin", width * 0.5, height - 225 * screenZoom);
	}
}

function smoothTarget(current, target, buffer, speed) {
    var change = (target - current) / buffer;

    if (change > 1) {
        change = 1;
    } else if (change < -1) {
        change = -1;
    }

    return (current + speed * change);
}
