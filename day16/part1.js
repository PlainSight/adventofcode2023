var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(l => l.split(''));

var seen = {};
var uniqueXY = {};
var stack = [{
    x: 0,
    y: 0,
    dx: 1,
    dy: 0
}];

function nextDirs(ds, char) {
    switch (char) {
        case '.':
            return [ds];
        case '-':
            if (ds[0] != 0) {
                return [ds];
            } else {
                return [[-1, 0], [1, 0]];
            }
        case '|':
            if (ds[1] != 0) {
                return [ds];
            } else {
                return [[0, -1], [0, 1]];
            }
        case '/':
            if (ds[0] == 1) {
                return [[0, -1]];
            } else {
                if (ds[0] == -1) {
                    return [[0, 1]];
                } else {
                    if (ds[1] == 1) {
                        return [[-1, 0]];
                    } else {
                        return [[1, 0]];
                    }
                }
            }
        case '\\':
            if (ds[0] == 1) {
                return [[0, 1]];
            } else {
                if (ds[0] == -1) {
                    return [[0, -1]];
                } else {
                    if (ds[1] == 1) {
                        return [[1, 0]];
                    } else {
                        return [[-1, 0]];
                    }
                }
            }
    }
}

function key(n) {
    return [n.x, n.y, n.dx, n.dy].join(',');
}

while(stack.length) {
    var top = stack.pop();

    if (seen[key(top)]) {
        continue;
    } else {
        seen[key(top)] = true;
    }

    if (top.x >= input[0].length || top.x < 0) { 
        continue;
    }
    if (top.y >= input.length || top.y < 0) { 
        continue;
    }

    uniqueXY[top.x+','+top.y] = true;

    var nexts = nextDirs([top.dx, top.dy], input[top.y][top.x]);

    nexts.forEach(n => {
        stack.push({
            x: top.x+n[0],
            y: top.y+n[1],
            dx: n[0],
            dy: n[1]
        })
    })
}

console.log(Object.values(uniqueXY).length);