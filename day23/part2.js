var fs = require('fs');

var world = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(l => l.split(''));

var startX = world[0].findIndex(c => c == '.');
var startY = 0;

var endX = world[world.length-1].findIndex(c => c == '.');
var endY = world.length-1;

var dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

var chokepoints = {};
var chokepointsCount = 1;

// find chokepoints

chokepoints[startX+','+startY] = chokepointsCount;
chokepointsCount++;
chokepoints[endX+','+endY] = chokepointsCount;
chokepointsCount++;


for(var y = 1; y < world.length-1; y++) {
    for(var x = 0; x < world[0].length; x++) {
        if (world[y][x] == '#') {
            continue;
        }
        var openDirections = 0;
        dirs.forEach(d => {
            var nx = x + d[0];
            var ny = y + d[1];
            if (world[ny][nx] != '#') {
                openDirections++;
            }
        });
        if (openDirections > 2) {
            chokepoints[x+','+y] = chokepointsCount;
            chokepointsCount++;
        }
    }
}

var edgesFrom = [];

Object.entries(chokepoints).forEach(e => {
    var destChokes = [];
    var xy = e[0].split(',').map(n => parseInt(n));
    var v = parseInt(e[1]);

    var estack = [[xy[0], xy[1], -1, -1, 0]];

    while(estack.length) {
        var [x, y, px, py, dist] = estack.pop();
        dirs.forEach(d => {
            var nx = x + d[0];
            var ny = y + d[1];

            if (ny >= 0 && ny < world.length && (nx != px || ny != py) && world[ny][nx] != '#') {
                var choke = chokepoints[nx+','+ny];
                if (choke) {
                    destChokes.push([choke, dist+1]);
                } else {
                    estack.push([nx, ny, x, y, dist+1]);
                }
            }
        })
    }
    edgesFrom[v] = destChokes;
})

var longestPath = 0;

var stack = [];

stack.push([1, -1, 0, 2, 0]);

var bestDist = {}; // key = start,[ordered middle],end

function addSeen(seen, seen2, next) {
    if (next > 25) {
        return [seen, seen2 | (1 << (next - 25))];
    } else {
        return [seen | (1 << next), seen2];
    }
}

function hasSeen(seen, seen2, choke) {
    if (choke > 25) {
        return (seen2 & (1 << (choke - 25))) != 0;
    } else {
        return (seen & (1 << choke)) != 0;
    }
}

while(stack.length) {
    var [c, p, dist, seen, seen2] = stack.pop();

    if (c == 2) {
        if (dist > longestPath) {
            longestPath = dist;
        }
        continue;
    }

    var edgesToFollow = edgesFrom[c].filter(e => e[0] != p);
    if (edgesToFollow.some(e => e[0] == 2)) {
        edgesToFollow = edgesToFollow.filter(e => e[0] == 2);
    }
    edgesToFollow.forEach(to => {
        if (!hasSeen(seen, seen2, to[0])) {
            var [newSeen, newSeen2] = addSeen(seen, seen2, to[0]);

            var key = `${newSeen},${newSeen2},${to[0]}`;

            var bd = bestDist[key];
            if (!bd || (dist+to[1]) > bd) {
                bestDist[key] = (dist+to[1]);
                stack.push([to[0], c, dist+to[1], newSeen, newSeen2]);
            }
        }
    })
}

console.log(longestPath);