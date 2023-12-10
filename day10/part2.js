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
                    full: true,
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
var inloop = {};

for(var d = 0; d < ds.length; d++) {
    inloop = {};

    var startDirection = ds[d];

    var x = startX;
    var y = startY;
    var current = k(x, y);
    var steps = 1;

    var next = segments[k(x+startDirection[0], y+startDirection[1])];
    inloop[current] = current;

    while(!!next && validNeighbours(current, next) && next.pos != k(startX, startY)) {
        steps++;
        var newCurrent = next.pos;
        inloop[newCurrent] = newCurrent
        next = segments[nextSegment(current, next)];
        current = newCurrent;
    }

    if (!!next && next.pos == k(startX, startY)) {
        best = steps;
        segments[k(startX, startY)].neighbours = [k(startX+startDirection[0], startY+startDirection[1]), current]
        break;
    }
}

var count = 0;

var enclosed = {};
var on = {};

for(var y = 0; y < input.length; y++) {
    var inside = false;
    var polarity = false;
    for (var x = 0; x < input[0].length; x++) {
        if (inloop[k(x, y)]) {
            if (validNeighbours(k(x, y-1), segments[k(x, y)]) && validNeighbours(k(x, y+1), segments[k(x, y)])) {
                inside = !inside;
                on[k(x, y)] = inside ? 1 : 2;
            } else {
                if ((validNeighbours(k(x-1, y), segments[k(x, y)]) && validNeighbours(k(x+1, y), segments[k(x, y)]))) {
                    // do nothing
                } else {
                    if (validNeighbours(k(x+1, y), segments[k(x, y)])) {
                        polarity = validNeighbours(k(x, y+1), segments[k(x, y)]);
                    } else {
                        if (validNeighbours(k(x-1, y), segments[k(x, y)])) {
                            var pol = validNeighbours(k(x, y+1), segments[k(x, y)]);
                            if (pol != polarity) {
                                inside = !inside;
                                on[k(x, y)] = inside ? 1 : 2;
                            }
                        }
                    }
                }
            }
        }
        if (inside && !inloop[k(x, y)]) {
            enclosed[k(x, y)] = true;
            count++;
        }
    }
}


// for(var y = 0; y < input.length; y++) {
//     var line = '';
//     var plainLine = '';
//     for (var x = 0; x < input[0].length; x++) {
//         if (inloop[k(x, y)]) {
//             plainLine += input[y][x];
//             if (on[k(x, y)]) {
//                 line += on[k(x, y)];
//             } else {
//                 line += '*';
//             }
//         } else {
//             plainLine += '.';
//             if (enclosed[k(x, y)]) {
//                 line += 'E';
//             } else {
//                 line += '.';
//             }
//         }
//     }
//     //console.log(plainLine);
//     console.log(line);
// }

// for(var y = 0; y < input.length; y++) {
//     var line = '';
//     var plainLine = '';
//     for (var x = 0; x < input[0].length; x++) {
//         if (inloop[k(x, y)]) {
//             plainLine += input[y][x];
//             if (on[k(x, y)]) {
//                 line += on[k(x, y)];
//             } else {
//                 line += '*';
//             }
//         } else {
//             plainLine += '.';
//             if (enclosed[k(x, y)]) {
//                 line += 'E';
//             } else {
//                 line += '.';
//             }
//         }
//     }
//     console.log(plainLine);
//     //console.log(line);
// }

console.log(count);