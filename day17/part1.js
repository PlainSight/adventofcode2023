var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var map = input.map(i => i.split('').map(n => parseInt(n)));

var MAXSTRAIGHT = 3;

var seen = {};

var stack = [{
    x: 1,
    y: 0,
    d: 1,
    cost: map[0][1],
    sr: 2
},
{
    x: 0,
    y: 1,
    d: 2,
    cost: map[1][0],
    sr: 2
}];

function push(item) {

}

function pop() {

}

function key(node) {
    return `${node.x},${node.y},${node.d},${node.sr}`;
}

var dirs = [
    [0, -1, '^'], 
    [1, 0, '>'],
    [0, 1, 'v'],
    [-1, 0, '<']
];

var endNode = null;

var pops = 0;

while (stack.length) {
    stack.sort((a, b) => b.cost - a.cost);

    var lowest = stack.pop();

    pops++

    if (lowest.x == map[0].length-1 && lowest.y == map.length-1) {
        endNode = lowest;
        break;
    }

    if (lowest.x < 0 || lowest.x >= map[0].length || lowest.y < 0 || lowest.y >= map.length) {
        continue;
    }

    if (seen[key(lowest)]) {
        continue;
    } else {
        seen[key(lowest)] = true;
    }
    // straight
    if (lowest.sr > 0) {
        var dirDiff = dirs[lowest.d];
        var nx = lowest.x + dirDiff[0];
        var ny = lowest.y + dirDiff[1];
        if (!(nx < 0 || nx >= map[0].length || ny < 0 || ny >= map.length)) {
            stack.push({
                x: nx,
                y: ny,
                d: lowest.d,
                cost: lowest.cost + map[ny][nx],
                sr: lowest.sr - 1,
                parent: lowest
            });
        }
    }
    // left
    var newD = (lowest.d+3)%4;
    var dirDiffLeft = dirs[newD];
    var nx = lowest.x + dirDiffLeft[0];
    var ny = lowest.y + dirDiffLeft[1];
    if (!(nx < 0 || nx >= map[0].length || ny < 0 || ny >= map.length)) {
        stack.push({
            x: nx,
            y: ny,
            d: newD,
            cost: lowest.cost + map[ny][nx],
            sr: 2,
            parent: lowest
        });
    }
    // right
    newD = (lowest.d+1)%4;
    var dirDiffRight = dirs[newD];
    nx = lowest.x + dirDiffRight[0];
    ny = lowest.y + dirDiffRight[1];
    if (!(nx < 0 || nx >= map[0].length || ny < 0 || ny >= map.length)) {
        stack.push({
            x: nx,
            y: ny,
            d: newD,
            cost: lowest.cost + map[ny][nx],
            sr: 2,
            parent: lowest
        });
    }
}

var path = [];

console.log(endNode.cost);

while(endNode) {
    path.unshift(endNode);
    endNode = endNode.parent;
}

for(var y = 0; y < map.length; y++) {
    var line = '';
    for(var x = 0; x < map[0].length; x++) {
        var pn = path.find(p => p.x == x && p.y == y);
        if (pn) {
            line += dirs[pn.d][2];
        } else {
            line += map[y][x];
        }
    }
    console.log(line);
}

//console.log(path);