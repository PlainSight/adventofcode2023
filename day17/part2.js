var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var map = input.map(i => i.split('').map(n => parseInt(n)));

var MAXSTRAIGHT = 10;
var MINSTRAIGHT = 4;

var seen = {};

var stack = [];

function push(item) {
    stack.push(item);
    var index = stack.length-1;
    var il = Math.floor(index/2);
    while (il < index && stack[index].cost < stack[il].cost) {
        var temp = stack[index];
        stack[index] = stack[il];
        stack[il] = temp;
        index = il;
        il = Math.floor(index/2);
    }
}

function pop() {
    if (stack.length == 1) {
        return stack.pop();
    } else {
        var ret = stack[0];
        stack[0] = stack[stack.length-1];
        stack.pop();
        var index = 0;
        var il = (index*2)+1;
        var ir = (index*2)+2;
        while(((stack[il] && stack[index].cost > stack[il].cost) || (stack[ir] && stack[index].cost > stack[ir].cost))) {
            if (!stack[ir] || stack[il].cost < stack[ir].cost) {
                var temp = stack[index];
                stack[index] = stack[il];
                stack[il] = temp;
                index = il;
            } else {
                var temp = stack[index];
                stack[index] = stack[ir];
                stack[ir] = temp;
                index = ir;
            }
            il = (index*2)+1;
            ir = (index*2)+2;
        }
        return ret;
    }
}

push({
    x: 0,
    y: 1,
    d: 2,
    cost: map[1][0],
    sr: 1
});
push({
    x: 1,
    y: 0,
    d: 1,
    cost: map[0][1],
    sr: 1
});

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

while (stack.length) {
    var lowest = pop();

    if (lowest.x == map[0].length-1 && lowest.y == map.length-1 && lowest.sr >= 4) {
        endNode = lowest;
        break;
    }

    if (seen[key(lowest)]) {
        continue;
    } else {
        seen[key(lowest)] = true;
    }
    // straight
    if (lowest.sr < MAXSTRAIGHT) {
        var dirDiff = dirs[lowest.d];
        var nx = lowest.x + dirDiff[0];
        var ny = lowest.y + dirDiff[1];
        if (!(nx < 0 || nx >= map[0].length || ny < 0 || ny >= map.length)) {
            push({
                x: nx,
                y: ny,
                d: lowest.d,
                cost: lowest.cost + map[ny][nx],
                sr: lowest.sr+1,
                parent: lowest
            });
        }
    }
    // left
    if (lowest.sr >= MINSTRAIGHT) {
        var newD = (lowest.d+3)%4;
        var dirDiffLeft = dirs[newD];
        var nx = lowest.x + dirDiffLeft[0];
        var ny = lowest.y + dirDiffLeft[1];
        if (!(nx < 0 || nx >= map[0].length || ny < 0 || ny >= map.length)) {
            push({
                x: nx,
                y: ny,
                d: newD,
                cost: lowest.cost + map[ny][nx],
                sr: 1,
                parent: lowest
            });
        }
        // right
        newD = (lowest.d+1)%4;
        var dirDiffRight = dirs[newD];
        nx = lowest.x + dirDiffRight[0];
        ny = lowest.y + dirDiffRight[1];
        if (!(nx < 0 || nx >= map[0].length || ny < 0 || ny >= map.length)) {
            push({
                x: nx,
                y: ny,
                d: newD,
                cost: lowest.cost + map[ny][nx],
                sr: 1,
                parent: lowest
            });
        }
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