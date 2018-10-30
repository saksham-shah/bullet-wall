var classic = {
    name: "CLASSIC",
    mult: 1.25,
    background: [30, 40, 80],
    button: {
        stroke: [45, 60, 120],
        fill: [60, 80, 160],
        hover: [75, 100, 200]
    },
    text: {
        0: [250, 75, 75],
        1: [50],
        2: [255]
    },
    cursor: [60, 80, 160],
    gs: {
        heartLive: [200, 60, 60],
        heartDead: [120],
        shieldStroke: [100],
        shieldLeft: [150],
        shieldRight: [175],
        combo: [0, 150, 0]
    },
    deathHeader: [45, 60, 120],
    grid: {
        floor: [45, 60, 120],
        lines: [90, 120, 240],
        cellStroke: [50],
        cellFill: [100],
        powerupStroke: [100],
        powerupFill: [150]
    },
    entity: {
        damage: [255, 0, 0],
        player: [160, 160, 200],
        enemy: [200, 60, 60],
        minion: [160, 160, 200]
    },
    weapon: {
        stab1: [115, 50, 50],
        stab2: [190, 50, 50],
        bull: [115, 50, 50],
        hammer: [40, 40, 100]
    },
    gun: {
        player: [50, 50, 150],
        enemy: [150, 50, 50],
        stroke: [25]
    },
    bullet: {
        player: [200, 200, 250],
        enemy: [250, 200, 200],
        stroke: [255],
        discStroke: [75, 0, 125],
        discLeft: [150, 0, 250],
        discRight: [120, 0, 200]
    },
    particle: {
        footprint: [30, 40, 80],
        playerDeath: [160, 160, 200],
        bulletShoot: [255, 255, 0]
    },
    powerup: {
        dual: [150, 45, 45],
        minions: [75]
    }
}

var dark = {
    name: "DARK",
    mult: 1.25,
    background: [30],
    button: {
        stroke: [45, 0, 0],
        fill: [60, 0, 0],
        hover: [75, 0, 0]
    },
    text: {
        0: [120, 0, 0],
        1: [50],
        2: [255]
    },
    cursor: [160, 0, 0],
    gs: {
        heartLive: [120, 0, 0],
        heartDead: [120],
        shieldStroke: [100],
        shieldLeft: [150],
        shieldRight: [175],
        combo: [80]
    },
    deathHeader: [45],
    grid: {
        floor: [45],
        lines: [90],
        cellStroke: [30],
        cellFill: [60],
        powerupStroke: [60],
        powerupFill: [90]
    },
    entity: {
        damage: [255, 0, 0],
        player: [90, 90, 100],
        enemy: [100, 0, 0],
        minion: [90, 90, 100]
    },
    weapon: {
        stab1: [50, 0, 0],
        stab2: [100, 0, 0],
        bull: [50, 0, 0],
        hammer: [20, 20, 50]
    },
    gun: {
        player: [25, 25, 75],
        enemy: [75, 0, 0],
        stroke: [25]
    },
    bullet: {
        player: [200, 200, 250],
        enemy: [250, 200, 200],
        stroke: [200],
        discStroke: [60, 0, 100],
        discLeft: [120, 0, 200],
        discRight: [96, 0, 160]
    },
    particle: {
        footprint: [60],
        playerDeath: [90, 90, 100],
        bulletShoot: [255, 255, 0]
    },
    powerup: {
        dual: [100, 0, 0],
        minions: [40]
    }
}

var halloween = {
    name: "HALLOWEEN",
    mult: 1.25,
    background: [30],
    button: {
        stroke: [120, 60, 0],
        fill: [160, 80, 0],
        hover: [200, 100, 0]
    },
    text: {
        0: [250, 100, 0],
        1: [50],
        2: [255]
    },
    cursor: [160, 80, 0],
    gs: {
        heartLive: [200, 100, 0],
        heartDead: [120],
        shieldStroke: [100],
        shieldLeft: [150],
        shieldRight: [175],
        combo: [250, 100, 0]
    },
    deathHeader: [45],
    grid: {
        floor: [45],
        lines: [90],
        cellStroke: [120, 80, 0],
        cellFill: [60, 40, 0],
        powerupStroke: [100],
        powerupFill: [150]
    },
    entity: {
        damage: [100, 200, 0],
        player: [200, 100, 0],
        enemy: [150, 0, 0],
        minion: [200, 100, 0]
    },
    weapon: {
        stab1: [65, 0, 0],
        stab2: [110, 0, 0],
        bull: [65, 0, 0],
        hammer: [100, 40, 0]
    },
    gun: {
        player: [150, 50, 0],
        enemy: [100, 0, 0],
        stroke: [25]
    },
    bullet: {
        player: [250, 200, 0],
        enemy: [250, 200, 200],
        stroke: [200],
        discStroke: [125, 75, 0],
        discLeft: [250, 150, 0],
        discRight: [200, 120, 0]
    },
    particle: {
        footprint: [160, 80, 0],
        playerDeath: [200, 100, 0],
        bulletShoot: [255, 255, 0]
    },
    powerup: {
        dual: [150, 30, 0],
        minions: [150, 75, 0]
    }
}

// var THEMES = [{name: "CLASSIC", obj: classic}, {name: "HALLOWEEN", obj: halloween}];
var THEMES = [classic, halloween];
var themeID = 1;
var theme = classic;
