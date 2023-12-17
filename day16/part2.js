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

var max = 0;

var dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
]

for(var d = 0; d < dirs.length; d++) {
    var sx = 0;
    var sy = 0;
    var sdx = 0;
    var sdy = 0;
    var smx = 0;
    var smy = 0;
    if (dirs[d][0] != 0) {
        if (dirs[d][0] == 1) {
            sx = 0;
            sy = 0;
            smx = 0;
            smy = input.length - 1;
            sdx = 1;
            sdy = 0;
        } else {
            sx = input[0].length - 1;
            sy = 0;
            smx = input[0].length- 1;
            smy = input.length - 1;
            sdx = -1;
            sdy = 0;
        }
    } else {
        if (dirs[d][1] == 1) {
            sx = 0;
            sy = 0;
            smx = input[0].length - 1;
            smy = 0;
            sdx = 0;
            sdy = 1;
        } else {
            sx = 0;
            sy = input.length - 1;
            smx = input[0].length - 1;
            smy = input.length - 1;
            sdx = 0;
            sdy = -1;
        }
    }

    for(var i = Math.min(sx, sy); i <= Math.max(smx, smy); i++) {
        var xx = sx == smx ? sx : sx + i;
        var yy = sy == smy ? sy : sy + i;

        var seen = {};
        var uniqueXY = {};
    
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

            if (seen[key(top)]) {
                continue;
            } else {
                seen[key(top)] = true;
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
        
        max = max < Object.values(uniqueXY).length ? Object.values(uniqueXY).length : max;
    }
}

console.log(max);
