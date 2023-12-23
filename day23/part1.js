var fs = require('fs');
const { start } = require('repl');

var world = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(l => l.split(''));

var startX = world[0].findIndex(c => c == '.');
var startY = 0;

var endX = world[world.length-1].findIndex(c => c == '.');
var endY = world.length-1;

var dirs = [
    [1, 0, '>'],
    [0, 1,'v'],
    [-1, 0, '<'],
    [0, -1, '^']
];

var longestPath = 0;

var stack = [];

stack.push([startX, startY, startX, -1, 0]);

while(stack.length) {
    var top = stack.pop();
    var [x, y, px, py, dist] = top;

    if (x == endX && y == endY) {
        longestPath = Math.max(longestPath, dist);
        continue;
    }
    dirs.forEach(d => {
        var nx = x + d[0];
        var ny = y + d[1];

        if ((nx != px || ny != py) && (world[ny][nx] == '.' || world[ny][nx] == d[2])) {
            stack.push([nx, ny, x, y, dist+1]);
        }
    })
}

console.log(longestPath);