var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(l => l.split(''));

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
            return [[-ds[1], -ds[0]]]
        case '\\':
            return [[ds[1], ds[0]]];
    }
}

function calulateCoverage(xx, yy, sdx, sdy) {
    var seen = new Array(input.length*input[0].length*4);

    var stack = [{
        x: xx,
        y:yy,
        dx: sdx,
        dy: sdy
    }];
    
    while(stack.length) {
        var top = stack.pop();
    
        if (top.x >= input[0].length || top.x < 0 || top.y >= input.length || top.y < 0) { 
            continue;
        }

        var k = (top.dx == 0 ? 0 : top.dx+1) + (top.dy == 0 ? 0 : top.dy + 2);
        k += top.x * 4;
        k += top.y * input.length * 4;

        if (seen[k]) {
            continue;
        } else {
            seen[k] = true;
        }
    
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

    var count = 0;

    var counted = false;
    for (var r = 0; r < seen.length; r++) {
        counted = r % 4 == 0 ? false : counted;
        if (seen[r] && !counted) {
            count++;
            counted = true;
        }
    }

    return count;
}

var max = 0;

for(var y = 0; y < input.length; y++) {
    max = Math.max(max, calulateCoverage(0, y, 1, 0));
    max = Math.max(max, calulateCoverage(input[0].length-1, y, -1, 0));
}

for(var x = 0; x < input[0].length; x++) {
    max = Math.max(max, calulateCoverage(x, 0, 0, 1));
    max = Math.max(max, calulateCoverage(x, input.length-1, 0, -1));
}

console.log(max);

