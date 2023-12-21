var fs = require('fs');
const { start } = require('repl');

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


var STEPS = 26501365;


function calculate(starts, dests, steps) {
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
    
        if (top.s % 2 == 1) {
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

    return [finalDests.filter(fd => fd).length, fullFloodtime];
}

var fullFloodPolarity0 = calculate([[startX, startY]], null, -1);
var fullFloodPolarity1 = calculate([[startX-1, startY]], null, -1);

console.log(fullFloodPolarity0, fullFloodPolarity1);

var startToEdgesStep = calculate([[startX, startY]], [(x, y) => x < 0, (x, y) => y < 0, (x, y) => y >= geo.length, (x, y) => x >= geo[0].length], -1);
var leftEdgeToEdgesStep = calculate([[0, 65]], [(x, y) => x < 0, (x, y) => y < 0, (x, y) => y >= geo.length, (x, y) => x >= geo[0].length], -1);

var cornersFloodTime = [[0, 0], [geo[0].length-1, 0], [0, geo.length-1], [geo[0].length-1, geo.length-1]].map(m => calculate([m], null, -1));

//var numberOfBasePolarityTriangles = 

console.log(startToEdgesStep);
console.log(leftEdgeToEdgesStep);
console.log(cornersFloodTime);

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

//console.log(Math.max(...finalDests.filter(fd => fd  != undefined)));
//console.log(finalDests.filter(fd => fd  != undefined).length);



//26501365 - 65 = 26501300

//26501300 / 131 = 202300 OR 101150 on each side so outside is polarity 0
//we thus have 101151 polarity 0 in the middle row and 101150 polarity 1 in the middle row

// total polarity 0 is thus 101151^2 = 10231524801
// total polarity 1 is thus 101150^2 = 10231322500

//the outer ring of polarity 0 needs to be filled either from one or two edges for 131 steps
//an extra outer ring of polarity 1 needs to be filled from the corner  