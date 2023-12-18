var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var dirMap = {
    'U': [0, -1],
    'R': [1, 0],
    'D': [0, 1],
    'L': [-1, 0]
}

var charToDir = ['R', 'D', 'L', 'U'];

var dirs = [
    [0, -1],//N
    [1, 0],//E
    [0, 1],//S
    [-1, 0],//W
];


var vertices = [[0, 0]];

function onLine(x, y) {
    for(var i = 0; i < vertices.length-1; i++) {
        if (vertices[i][0] == vertices[i+1][0] && x == vertices[i][0]) {
            // vertical
            if(Math.min(vertices[i][1], vertices[i+1][1]) <= y && y <= Math.max(vertices[i][1], vertices[i+1][1])) {
                return true;
            }
        } else {
            // horizontal
            if (vertices[i][1] == vertices[i+1][1] && y == vertices[i][1]) {
                if (Math.min(vertices[i][0], vertices[i+1][0]) <= x && x <= Math.max(vertices[i][0], vertices[i+1][0])) {
                    return true;
                }
            }
        }
    }
    return false;
}

var x = 0;
var y = 0;

var instructions = [];

input.forEach(i => {
    var bits = /(.) (\d+) \(#(.+)\)/.exec(i);
    var hex = bits[3];

    var dir = charToDir[parseInt(hex[5], 16)];
    var dist = parseInt(hex.slice(0, 5), 16);

    instructions.push([dir, dist]);
});

instructions.forEach((i, ii) => {
    var d = dirMap[i[0]];

    var dx = d[0]*i[1];
    var dy = d[1]*i[1];

    x += dx;
    y += dy;

    vertices.push([x, y]);
})

var distinctX = {};
var distinctY = {};

vertices.forEach(v => {
    distinctX[v[0]] = v[0];
    distinctY[v[1]] = v[1];
});

distinctX = Object.values(distinctX).sort((a, b) => a-b);
distinctY = Object.values(distinctY).sort((a, b) => a-b);

distinctX.unshift(distinctX[0]-2);
distinctX.push(distinctX[distinctX.length-1]+2);

distinctY.unshift(distinctY[0]-2);
distinctY.push(distinctY[distinctY.length-1]+2);

var totalArea = (distinctX[distinctX.length-1]-distinctX[0]) * (distinctY[distinctY.length-1]-distinctY[0]);
var negativeArea = 0;

var seen = new Array(distinctX.length * distinctY.length);

function drawAreas(minx, maxx, miny, maxy) {
    var legend = '  ';
    for(var x = distinctX[0]; x < distinctX[distinctX.length-1]; x++) {
        legend += Math.abs(x)%10;
    }
    console.log(legend);
    for(var y = distinctY[0]; y < distinctY[distinctY.length-1]; y++) {
        var line = (Math.abs(y)%10)+' ';
        for(var x = distinctX[0]; x < distinctX[distinctX.length-1]; x++) {
            if (x >= minx && x <= maxx && y >= miny && y <= maxy) {
                line += '#';
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
}

function flood(xi, yi) {
    var stack = [[xi, yi]];

    while(stack.length) {
        
        var top = stack.pop();

        if (top[0] < 0 || top[0] >= distinctX.length-1 || top[1] < 0 || top[1] >= distinctY.length-1) {
            continue;
        }

        if (seen[top[0]+(top[1]*distinctX.length)]) {
            continue;
        } else {
            seen[top[0]+(top[1]*distinctX.length)] = true;
        }

        var minx = distinctX[top[0]];
        var maxx = distinctX[top[0]+1];
        var miny = distinctY[top[1]];
        var maxy = distinctY[top[1]+1];

        var midx = Math.floor((minx+maxx)/2);
        var midy = Math.floor((miny+maxy)/2);

        var surfaceArea = 0;

        // touching sides
        dirs.forEach((d, di) => {
            var good = true;
            switch (di) {
                case 0:
                    if (onLine(midx, miny)) {
                        good = false;
                        surfaceArea += ((maxx - minx)-1);
                    }
                    break;
                case 1:
                    if (onLine(maxx, midy)) {
                        good = false;
                    }
                    break;
                case 2:
                    if (onLine(midx, maxy)) {
                        good = false;
                    }
                    break;
                case 3:
                    if (onLine(minx, midy)) {
                        good = false;
                        surfaceArea += ((maxy - miny)-1);
                    }
                    break;
            }

            if (good) {
                var nxi = top[0]+d[0];
                var nyi = top[1]+d[1];
                stack.push([nxi, nyi]);
            }
        });

        // touching corners
        var corners = 0;

        if (onLine(minx, miny)) {
            corners++;
        }

        //drawAreas(minx, maxx-1, miny, maxy-1);

        var width = maxx - minx;
        var height = maxy - miny;

        negativeArea += (width*height - surfaceArea - corners);
    }
}

flood(0, 0);


console.log(totalArea - negativeArea);