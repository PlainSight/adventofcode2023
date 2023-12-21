var fs = require('fs');

var geo = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(l => l.split(''));

var STEPS = 64;

var startX = 0;
var startY = 0;

geo.forEach((l, y) => {
    l.forEach((c, x) => {
        if (c == 'S') {
            startX = x;
            startY = y;
        }
    });
});

geo[startY][startX] = '.';

var finalDests = [];

function k(n) {
    return n.y*geo[0].length + n.x;
}

var dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

var stack = [{
    x: startX,
    y: startY,
    s: 0
}];

while(stack.length) {
    var top = stack.pop();

    if (top.s % 2 == 0) {
        if (finalDests[k(top)] != undefined) {
            continue;
        } else {
            finalDests[k(top)] = top.s;
        }
    }

    if (top.s < STEPS) {
        dirs.forEach(d => {
            var nx = top.x + d[0];
            var ny = top.y + d[1];
            if (nx >= 0 && ny >= 0 && nx < geo[0].length && ny < geo.length && geo[ny][nx] == '.') {
                stack.unshift({
                    x: top.x + d[0],
                    y: top.y + d[1],
                    s: top.s + 1
                });
            }
        })
    }
}

// for(var y = 0; y < geo.length; y++) {
//     var line = '';
//     for(var x = 0; x < geo[0].length; x++) {
//         if (finalDests[k({x: x, y: y})] != undefined) {
//             line += finalDests[k({x: x, y: y})];
//         } else {
//             line += geo[y][x];
//         }
//     }
//     console.log(line);
// }

console.log(finalDests.filter(fd => fd  != undefined).length);
