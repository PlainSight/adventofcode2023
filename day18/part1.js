var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var dirMap = {
    'U': [0, -1],
    'R': [1, 0],
    'D': [0, 1],
    'L': [-1, 0]
}

var dirs = [
    [0, -1],//N
    [1, 0],//E
    [0, 1],//S
    [-1, 0],//W
];

var holes = {
    '0,0': { x: 0, y: 0 }
};

var x = 0;
var y = 0;

input.forEach(i => {
    var bits = /(.) (\d+) \((.+)\)/.exec(i);
    var dir = bits[1];
    var dist = parseInt(bits[2]);
    var col = bits[3];

    var d = dirMap[dir];
    for(var i = 0; i < dist; i++) {
        x += d[0];
        y += d[1];
        holes[x+','+y] = { x: x, y: y };
    }
});

function flood(x, y) {
    var stack = [[x, y]];

    while(stack.length) {
        var top = stack.pop();

        if (!holes[top[0]+','+top[1]]) {
            holes[top[0]+','+top[1]] = { x: top[0], y: top[1] };
            
            dirs.forEach(d => {
                stack.push([top[0]+d[0], top[1]+d[1]]);
            })
        }
    }
}

var twoAccross = Object.values(Object.values(holes).reduce((a, c) => {
    a[c.x] = a[c.x] || [];
    a[c.x].push(c);
    return a;
}, {})).filter(x => x.length == 2);

var x = twoAccross[0][0].x;
var y = Math.min(twoAccross[0][0].y, twoAccross[0][1].y)+1;

flood(x, y);

console.log(Object.values(holes).length);