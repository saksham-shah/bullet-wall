function Map(size, defaultValue) {
    this.map = [];
    for (var i = 0; i < size; i++) {
        var row = [];
        for (var j = 0; j < size; j++) {
            row.push(defaultValue);
        }
        this.map.push(row);
    }
}

Map.prototype.get = function(cell) {
    return this.map[cell.row][cell.col];
}

Map.prototype.set = function(cell, value) {
    this.map[cell.row][cell.col] = value;
}

function reconstructPath(cameFrom, current) {
    var path = [current];
    while (cameFrom.get(current) !== null) {
        current = cameFrom.get(current);
        path.push(current);
    }
    return path;
}

function findPath(grid, goal, start) {
    var closedSet = [];

    var openSet = [start];

    var cameFrom = new Map(grid.length, null);

    var gScore = new Map(grid.length, Infinity);
    gScore.set(start, 0);

    var fScore = new Map(grid.length, Infinity);
    fScore.set(start, costEstimate(start, goal));

    while (openSet.length > 0) {
        openSet.sort(function(a, b) {
            return fScore.get(a) - fScore.get(b);//a.fScore - b.fScore;
        })
        var current = openSet[0];

        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        openSet.splice(0, 1);
        closedSet.push(current);

        var neighbours = current.getNeighbours();
        for (var i = 0; i < neighbours.length; i++) {
            if (!closedSet.includes(neighbours[i])) {// && neighbours[i].wall == 0) {
                tentativeGScore = gScore.get(current) + costEstimate(current, neighbours[i]);

                var better = true;
                if (!openSet.includes(neighbours[i])) {
                    openSet.push(neighbours[i]);
                } else if (tentativeGScore < gScore.get(neighbours[i])) {
                    better = false;
                }

                if (better) {
                    cameFrom.set(neighbours[i], current);
                    gScore.set(neighbours[i], tentativeGScore);
                    fScore.set(neighbours[i], tentativeGScore + costEstimate(neighbours[i], goal));
                }
            }
        }
    }
}

function costEstimate(a, b) {
    var av = createVector(a.row, a.col);
    var bv = createVector(b.row, b.col);

    if (b.wall == 0) {
        return p5.Vector.dist(av, bv);
    } else {
        return p5.Vector.dist(av, bv) * 100;
    }
}