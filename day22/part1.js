var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var settledBricks = [];

function flatten(x, i) {
    if (x == 0) {
        return 0;
    }
    return i * x / Math.abs(x);
}

function collides(b) {
    if (b[2] < 1 || b[5] < 1) {
        return [-1];
    }
    var bdiffs = [ b[3] - b[0], b[4] - b[1], b[5] - b[2]];
    var collisonMap = {};
    for(var i = 0; i <= Math.max(...bdiffs); i++) {
        collisonMap[`${b[0]+flatten(bdiffs[0], i)},${b[1]+flatten(bdiffs[1], i)},${b[2]+flatten(bdiffs[2], i)}`] = true;
    }
    var supporters = [];
    settledBricks.forEach((sb, sbi) => {
        var diffs = [ sb[3] - sb[0], sb[4] - sb[1], sb[5] - sb[2]];

        var sups = false;
        for(var i = 0; i <= Math.max(...diffs); i++) {
            if(collisonMap[`${sb[0]+flatten(diffs[0], i)},${sb[1]+flatten(diffs[1], i)},${sb[2]+flatten(diffs[2], i)}`]) {
                sups = true;
            }
        }
        if (sups) {
            supporters.push(sbi);
        }
    });
    return supporters;
}

var supports = [];
var supportedBy = [];

var fallingBricks = [];

input.forEach(i => {
    var b = /(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)/.exec(i).slice(1, 7).map(n => parseInt(n));

    fallingBricks.push(b);
});

fallingBricks.sort((b, a) => Math.min(b[5], b[2])-Math.min(a[5], a[2]));

fallingBricks.forEach(b => {
    var colliders = []
    do {
        b[2]--;
        b[5]--;
        colliders = collides(b);
    } while(colliders.length == 0);
    b[2]++;
    b[5]++;
    settledBricks.push(b);
    supports.push([]);
    supportedBy.push(colliders.filter(f => f != -1));
    colliders.forEach(c => {
        if (c != -1) {
            supports[c].push(settledBricks.length-1);
        }
    })
});

var count = supports.filter(f => f.length == 0 || f.every(s => supportedBy[s].length > 1)).length;

console.log(count);