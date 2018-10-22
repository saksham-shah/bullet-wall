Game.prototype.snapshot = function() {
    var e = this.entities.slice();
    var b = this.bullets.slice();
    var p = this.particles.slice();
    var m = this.markings.slice();
    this.snaps.push(new GameSnap(e, b, p, m));
}

function GameSnap(e, b, p, m) {
    this.entities = [];
    for (var i = 0; i < e.length; i++) {
        this.entities.push(e[i].convertToSnap());
    }
    this.bullets = [];
    for (var i = 0; i < b.length; i++) {
        this.bullets.push(b[i].convertToSnap());
    }
    this.particles = [];
    for (var i = 0; i < p.length; i++) {
        this.particles.push(p[i].convertToSnap());
    }
    this.markings = [];
    for (var i = 0; i < m.length; i++) {
        this.markings.push(m[i].convertToSnap());
    }
}
