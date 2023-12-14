var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var blockers = [];
var rollers = [];

var maxx = input[0].length;
var maxy = input.length;

input.forEach((i, y) => {
    var line = [];
    i.split('').forEach((j, x) => {
        line.push(j);
        if (j == 'O') {
            rollers.push({
                x: x,
                y: y
            });
        }
    });
    blockers.push(line);
});

var cycleByScore = {};
var scoreByCycle = {};
var hashesByCycle = {};
var cycleByHash = {};

var ds = [
    [0, -1],
    [-1, 0],
    [0, 1],
    [1, 0]
];

function hash(rollers) {
    return rollers.sort((a, b) => (a.y*maxx + a.x) - (b.y*maxx + b.x)).reduce((a, c) => a+':'+c.x+','+c.y, '');
}

function unblocked(x, y) {
    if (blockers[y] && blockers[y][x] == '.') {
        return true;
    }
    return false;
}


for(var c = 1; c < 1000000000; c++) {
    for(var d = 0; d < 4; d++) {
        var movement = true;

        while(movement) {
            movement = false;
            rollers.forEach(r => {
                while (unblocked(r.x+ds[d][0], r.y+ds[d][1])) {
                    blockers[r.y][r.x] = '.';
                    r.x += ds[d][0];
                    r.y += ds[d][1];
                    blockers[r.y][r.x] = 'O';
                    movement = true;
                }
            })
        }
    }

    var sum = Object.values(rollers).reduce((a, c) => {
        return a + (maxy - c.y)
    }, 0);

    var h = hash(rollers);

    if (cycleByHash[h]) {
        var last = cycleByHash[h];
        var diff = c - last;

        // find number of iterations from last to get to 1000000000, then find offset from 1000000000
        var toIter = 1000000000 - last;
        var fullLoops = Math.floor(toIter / diff);
        var offset = toIter - fullLoops*diff;
        var cycleWithfinalScore = last + offset;
        console.log(scoreByCycle[cycleWithfinalScore]);
        return;
    } else {
        scoreByCycle[c] = sum;
        hashesByCycle[c] = hash(rollers);
        cycleByHash[h] = c;

        cycleByScore[sum] = (cycleByScore[sum] || []);
        cycleByScore[sum].push(c);
    }
}


