var fs = require('fs');

var geo = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(l => l.split(''));

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


function calculate(starts, dests, steps, print = false) {
    var foundDests = [];
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

    var stack = [];

    starts.forEach(s => {
        stack.push({
            x: s[0],
            y: s[1],
            s: 0
        })
    })

    var fullFloodtime = 0;
    
    while(stack.length) {
        var top = stack.pop();
    
        if (top.s % 2 == (steps == -1 ? 1 : (steps % 2))) {
            fullFloodtime = Math.max(fullFloodtime, top.s);
            if (finalDests[k(top)]) {
                continue;
            } else {
                finalDests[k(top)] = true;
            }
        }
    
        if (steps == -1 || top.s < steps) {
            dirs.forEach(d => {
                var nx = top.x + d[0];
                var ny = top.y + d[1];

                if (!!dests) {
                    dests.forEach((d, di) => {
                        if (!foundDests[di] && d(nx, ny)) {
                            foundDests[di] = [nx, ny, top.s+1]
                        }
                    })
                }

                if (nx >= 0 && ny >= 0 && nx < geo[0].length && ny < geo.length && geo[ny][nx] == '.') {
                    stack.unshift({
                        x: nx,
                        y: ny,
                        s: top.s + 1
                    });
                }
            })
        }

        if (!!dests && dests.every((_, di) => !!foundDests[di])) {
            return foundDests;
        }
    }

    if (print) {
        for(var y = 0; y < geo.length; y++) {
            var line = '';
            for(var x = 0; x < geo[0].length; x++) {
                if (finalDests[k({x: x, y: y})] != undefined) {
                    line += 'O';
                } else {
                    line += geo[y][x];
                }
            }
            console.log(line);
        }
    }

    return [finalDests.filter(fd => fd).length, fullFloodtime];
}

var STEPS = 26501365; // 17

var fullFloodPolarity0 = calculate([[startX, startY]], null, -1);
var fullFloodPolarity1 = calculate([[startX-1, startY]], null, -1);

//console.log(fullFloodPolarity0, fullFloodPolarity1);

var startToEdgesStep = calculate([[startX, startY]], [(x, y) => x < 0, (x, y) => y < 0, (x, y) => y >= geo.length, (x, y) => x >= geo[0].length], -1);

var toEdge = startToEdgesStep[0][2]-1;

var stepsOutSideOfStart = STEPS - toEdge;
var g = geo.length;
var hg = (geo.length-1)/2;
var tilesWideAfterStart = (stepsOutSideOfStart / geo.length);

//console.log(stepsOutSideOfStart, tilesWideAfterStart);


var smallEdgesFlood65 = [[0, 0], [geo[0].length-1, 0], [0, geo.length-1], [geo[0].length-1, geo.length-1]].map(m => calculate([m], null, hg-1));

var endsFlood131 = [[0, hg], [geo[0].length-1, hg], [hg, 0], [hg, geo.length-1]].map(m => calculate([m], null, g-1));

var bigEdgesFlood131 = [
    [[0, hg], [hg, geo.length-1]],
    [[0, hg], [hg, 0]],
    [[geo[0].length-1, hg], [hg, geo.length-1]],
    [[geo[0].length-1, hg], [hg, 0]],
].map(m => calculate(m, null, g-1));

// console.log(smallEdgesFlood65);
// console.log(endsFlood131);
// console.log(bigEdgesFlood131);
// console.log(tilesWideAfterStart);

var sum = 0;

var pol0Sum = (tilesWideAfterStart-1)*(tilesWideAfterStart-1)*fullFloodPolarity0[0];
var pol1Sum = tilesWideAfterStart*tilesWideAfterStart*fullFloodPolarity1[0];
var endsSum = endsFlood131.reduce((a, c) => a+c[0], 0);  // ends;
var bigEdgesSum = (tilesWideAfterStart-1)*bigEdgesFlood131.reduce((a, c) => a+c[0], 0); // big edge
var littleEdgesSum = tilesWideAfterStart*smallEdgesFlood65.reduce((a, c) => a+c[0], 0); // little edge

//console.log(pol0Sum, pol1Sum, endsSum, bigEdgesSum, littleEdgesSum);

sum += pol0Sum;
sum += pol1Sum;
sum += endsSum
sum += bigEdgesSum
sum += littleEdgesSum

console.log(sum);
