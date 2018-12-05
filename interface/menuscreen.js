// Words for each of the modes and difficulties
var MODES = ["CLASSIC", "SMALL", "ONSLAUGHT"];
var DIFFICULTIES = ["EASY", "NORMAL", "HARD", "INSANE", "ONSLAUGHT"];


// Starting menu screen of the game
function MenuScreen() {

    this.mode = 0;
    this.difficulty = 1;

    this.createButtons();

    this.title = new TypeText("BULLET WALL");
}

MenuScreen.prototype.createButtons = function() {
    this.buttons = [];

    this.playButton = new Button(this, width * 0.5 - 200 * screenZoom, height * 0.5 - 100 * screenZoom, 400 * screenZoom, 200 * screenZoom, "PLAY", 100 * screenZoom);
    this.modeButton = new Button(this, width * 0.5 - 175 * screenZoom, height * 0.8, 350 * screenZoom, 100 * screenZoom, MODES[this.mode], 50 * screenZoom);
    // this.difficultyButton = new Button(this, width * 0.6 - 175 * screenZoom, height * 0.8, 350 * screenZoom, 100 * screenZoom, DIFFICULTIES[this.difficulty], 50 * screenZoom);
    this.themeButton = new Button(this, width * 0.9 - 100 * screenZoom, height * 0.925 - 25 * screenZoom, 200 * screenZoom, 50 * screenZoom, THEMES[themeID].name, 20 * screenZoom);

    this.buttons.push(this.playButton);
    this.buttons.push(this.modeButton);
    // this.buttons.push(this.difficultyButton);
    this.buttons.push(this.themeButton);
}

MenuScreen.prototype.update = function() {
    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].update();
    }
}

MenuScreen.prototype.buttonClicked = function(button) {
    // Start game
    if (button === this.playButton) {
        this.chooseDifficulty();
        // nextScreen = gs;
        // gs.newGame(this.mode, this.difficulty);
    } else if (button === this.modeButton) {
        this.mode = (this.mode + 1) % MODES.length;
        button.text = new TypeText(MODES[this.mode]);
        // if (this.mode == 2) {
        //     this.difficultyButton.text = new TypeText("ONSLAUGHT!");
        // } else {
        //     this.difficultyButton.text = new TypeText(DIFFICULTIES[this.difficulty]);
        // }
    // } else if (button === this.difficultyButton) {
    //     this.difficulty = (this.difficulty + 1) % DIFFICULTIES.length;
    //     if (this.mode !== 2) {
    //         button.text = new TypeText(DIFFICULTIES[this.difficulty]);
    //     } else {
    //         button.text = new TypeText("ONSLAUGHT!");
    //     }
    } else if (button === this.themeButton) {
        themeID = (themeID + 1) % THEMES.length;
        button.text = new TypeText(THEMES[themeID].name);
        theme = THEMES[themeID];
    }
}

MenuScreen.prototype.chooseDifficulty = function() {

    var allowed = [];
    if (this.mode !== 2) {
        allowed = [1, 2, 3, 0];
    } else {
        allowed = [4];
    }

    fs.newScreen(this, "DIFFICULTY", 255,
    function(scr) {

        var difficultyButton = new Button(this, width * 0.5 - 175 * screenZoom, height * 0.8, 350 * screenZoom, 100 * screenZoom, DIFFICULTIES[this.allowedDifficulties[this.difficultyID]], 50 * screenZoom);
        scr.buttons.push(difficultyButton);
        var playButton = new Button(this, width * 0.5 - 200 * screenZoom, height * 0.5 - 100 * screenZoom, 400 * screenZoom, 200 * screenZoom, "PLAY", 100 * screenZoom);
        scr.buttons.push(playButton);
    },
    [
        function(scr) { // Difficulty button
            scr.difficultyID = (scr.difficultyID + 1) % scr.allowedDifficulties.length;
            scr.buttons[0].text = new TypeText(DIFFICULTIES[scr.allowedDifficulties[scr.difficultyID]]);
        },
        function(scr) { // Play button
            nextScreen = gs;
            gs.newGame(scr.mode, scr.allowedDifficulties[scr.difficultyID]);
        }
    ],
    function(scr, params) {
        scr.difficultyID = 0;
        scr.mode = params.mode;
        scr.allowedDifficulties = params.allowedDifficulties;
    },
    {
        mode: this.mode,
        allowedDifficulties: allowed
    })

    nextScreen = fs;
}

MenuScreen.prototype.draw = function() {
    background(theme.background);

    this.title.draw(width * 0.5, height * 0.2, 150 * screenZoom, "BULLET WALL");

    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].draw();
    }
}
