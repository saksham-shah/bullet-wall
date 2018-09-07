function PathGrid(world) {
    var size = world.length;
    this.grid = [];
    for (var i = 0; i < size; i++) {
        var row = [];
        for (var j = 0; j < size; j++) {
            row.push(new PathCell(i, j, this));
        }
        this.grid.push(row);
    }
    this.world = world;
}

function PathCell(row, col, grid) {
    this.row = row;
    this.col = col;
    this.grid = grid.grid;
    this.pathGrid = grid;

    this.reset();
}

PathCell.prototype.reset = function() {
    this.gScore = Infinity;
    this.fScore = Infinity

    this.cameFrom = null;
}

PathCell.prototype.getNeighbours = function() {
    var neighbours = [];
    if (this.row > 0) {
        if (!this.pathGrid.world[this.row - 1][this.col].obstacle) {
            neighbours.push(this.grid[this.row - 1][this.col])
        }
    }
    if (this.row < this.grid.length - 1) {
        if (!this.pathGrid.world[this.row + 1][this.col].obstacle) {
            neighbours.push(this.grid[this.row + 1][this.col])
        }
    }
    if (this.col > 0) {
        if (!this.pathGrid.world[this.row][this.col - 1].obstacle) {
            neighbours.push(this.grid[this.row][this.col - 1])
        }
    }
    if (this.col < this.grid.length - 1) {
        if (!this.pathGrid.world[this.row][this.col + 1].obstacle) {
            neighbours.push(this.grid[this.row][this.col + 1])
        }
    }
    //     this.grid[this.row][this.col + 1],
    //     this.grid[this.row + 1][this.col],
    //     this.grid[this.row][this.col - 1],
    //     this.grid[this.row - 1][this.col]
    return neighbours;
}

PathGrid.prototype.findPath = function(start, end) {
    this.reset();

    var startCell = this.grid[start.row][start.col];
    var endCell = this.grid[end.row][end.col];
    var closedSet = [];
    var openSet = [startCell];

    startCell.gScore = 0;
    startCell.fScore = this.hScoreEstimate(startCell, endCell);

    while(openSet.length > 0) {
        openSet.sort(function(a, b) {
            return a.fScore - b.fScore;
        })
        var current = openSet[0];

        if (current == endCell) {
            return this.createPath(current);
        }

        openSet.splice(0, 1);
        closedSet.push(current);

        var neighbours = current.getNeighbours();

        for (var i = 0; i < neighbours.length; i++) {
            var currentNeighbour = neighbours[i];
            if (!closedSet.includes(currentNeighbour)) {
                var tentativeGScore = current.gScore + this.hScoreEstimate(current, currentNeighbour);
                var better = true;
                if (!openSet.includes(currentNeighbour)) {
                    openSet.push(currentNeighbour);
                } else if (tentativeGScore >= currentNeighbour.gScore) {
                    better = false;
                }

                if (better) {
                    currentNeighbour.cameFrom = current;
                    currentNeighbour.gScore = tentativeGScore;
                    currentNeighbour.fScore = currentNeighbour.gScore + this.hScoreEstimate(currentNeighbour, endCell);
                }
            }
        }
    }
    return [];

}

PathGrid.prototype.hScoreEstimate = function(a, b) {
    var av = createVector(a.row, a.col);
    var bv = createVector(b.row, b.col);
    return p5.Vector.dist(av, bv);
    // var hScore = sqrt((a.row - b.row) * (a.col - b.col));
    // return hScore;
}

PathGrid.prototype.createPath = function(current) {
    var path = [this.world[current.row][current.col]];

    while (current.cameFrom !== null) {
        current = current.cameFrom;
        path.push(this.world[current.row][current.col]);
    }
    return path;
}

PathGrid.prototype.reset = function() {
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[0].length; j++) {
            this.grid[i][j].reset();
        }
    }
}
