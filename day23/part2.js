var fs = require('fs');
const { start } = require('repl');

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

    var estack = [[xy[0], xy[1], 0]];
    var seen = {};

    while(estack.length) {
        var [x, y, dist] = estack.pop();
        dirs.forEach(d => {
            var nx = x + d[0];
            var ny = y + d[1];

            if (ny > 0 && ny < world.length && (world[ny][nx] != '#') && !seen[nx+','+ny]) {
                var choke = chokepoints[nx+','+ny];
                if (choke) {
                    destChokes.push([choke, dist+1]);
                } else {
                    estack.push([nx, ny, dist+1]);
                }
            }

            seen[nx+','+ny] = true;
        })
    }
    edgesFrom[v] = destChokes;
})

var longestPath = 0;

var stack = [];

stack.push(1);

var bestDist = {}; // key = start,end

while(stack.length) {
    var [c, p, dist, seenchoke] = stack.pop();

    if (c == 2) {
        if (dist > longestPath) {
            longestPath = dist;
        }
        continue;
    }
    edgesFrom[c].forEach(to => {
        if (to[])
    })

    dirs.forEach(d => {
        var nx = x + d[0];
        var ny = y + d[1];

        var choke = chokepoints[nx+','+ny];

        if ((nx != px || ny != py) && ny >= 0 && (world[ny][nx] != '#') && (!choke || !seenchoke.some(c => c == choke))) {
            var nsc = [...seenchoke];
            if (choke) {
                nsc.push(choke);

                var startkey = nsc[0];
                var midkey = nsc.slice(1, -2).sort((a, b) => b-a).join(',');
                var endkey = nsc[nsc.length-1];
                var key = `${startkey},${midkey},${endkey}`;

                var bd = bestDist[key];
                if (!bd || dist+1 > bd) {
                    bestDist[key] = dist+1;
                    stack.push([nx, ny, x, y, dist+1, nsc]);
                }
            } else {
                stack.push([nx, ny, x, y, dist+1, nsc]);
            }
        }
    })
}

console.log('finished', longestPath);