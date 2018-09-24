// Algorithm from Wikipedia

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

//  Uses the A* algorithm to find a path from the start to the goal
function findPath(grid, goal, start, enemy) {
    var closedSet = [];

    var openSet = [start];

    var cameFrom = new Map(grid.length, null);

    var gScore = new Map(grid.length, Infinity);
    gScore.set(start, 0);

    var fScore = new Map(grid.length, Infinity);
    fScore.set(start, costEstimate(start, goal, enemy));

    while (openSet.length > 0) {
        openSet.sort(function(a, b) {
            return fScore.get(a) - fScore.get(b)
        })
        var current = openSet[0];

        if (current === goal) {
            return reconstructPath(cameFrom, current);
        }

        openSet.splice(0, 1);
        closedSet.push(current);

        var neighbours = current.getNeighbours();
        for (var i = 0; i < neighbours.length; i++) {
            if (!closedSet.includes(neighbours[i])) {
                tentativeGScore = gScore.get(current) + costEstimate(current, neighbours[i], enemy);

                var better = true;
                if (!openSet.includes(neighbours[i])) {
                    openSet.push(neighbours[i]);
                } else if (tentativeGScore < gScore.get(neighbours[i])) {
                    better = false;
                }

                if (better) {
                    cameFrom.set(neighbours[i], current);
                    gScore.set(neighbours[i], tentativeGScore);
                    fScore.set(neighbours[i], tentativeGScore + costEstimate(neighbours[i], goal, enemy));
                }
            }
        }
    }
}

function costEstimate(a, b, enemy) {
    var av = createVector(a.row, a.col);
    var bv = createVector(b.row, b.col);
    var d = p5.Vector.dist(a.pos, b.pos);
    d = d / enemy.maxVel + b.wall * enemy.wallDestroy;
    return d;

}
