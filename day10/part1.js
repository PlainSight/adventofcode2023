var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(l => l.split(''));

var segments = {};

function k(x, y) {
    return x+','+y;
}

var startX = 0;
var startY = 0;

input.forEach((l, y) => {
    l.forEach((s, x) => {
        switch (s) {
            case '|':
                segments[k(x, y)] = {
                    pos: k(x, y),
                    neighbours: [k(x, y-1), k(x, y+1)]
                }
            break;
            case '-':
                segments[k(x, y)] = {
                    pos: k(x, y),
                    neighbours: [k(x-1, y), k(x+1, y)]
                }
            break;
            case 'L':
                segments[k(x, y)] = {
                    pos: k(x, y),
                    neighbours: [k(x, y-1), k(x+1, y)]
                }
            break;
            case 'J':
                segments[k(x, y)] = {
                    pos: k(x, y),
                    neighbours: [k(x, y-1), k(x-1, y)]
                }
            break;
            case '7':
                segments[k(x, y)] = {
                    pos: k(x, y),
                    neighbours: [k(x, y+1), k(x-1, y)]
                }
            break;
            case 'F':
                segments[k(x, y)] = {
                    pos: k(x, y),
                    neighbours: [k(x, y+1), k(x+1, y)]
                }
            break;
            case 'S':
                segments[k(x, y)] = {
                    pos: k(x, y),
                    neighbours: []
                }
                startX = x;
                startY = y;
            break;
        }
    });
});

var ds = [
    [-1, 0], //left
    [1, 0],// right
    [0, -1],  //up
    [0, 1]//down
]

function validNeighbours(from, to) {
    if (to) {
        return to.neighbours.includes(from);
    }
    return false;
}

function nextSegment(from, through) {
    return through.neighbours.filter(f => from != f)[0];
}

var best = 0;

ds.forEach(startDirection => {
    var x = startX;
    var y = startY;
    var current = k(x, y);
    var steps = 1;

    var next = segments[k(x+startDirection[0], y+startDirection[1])];

    while(!!next && validNeighbours(current, next) && next.pos != k(startX, startY)) {
        steps++;
        var newCurrent = next.pos;
        next = segments[nextSegment(current, next)];
        current = newCurrent;
    }

    if (!!next && next.pos == k(startX, startY)) {
        if (steps > best) {
            best = steps;
        }
    }
});

console.log(best/2);

