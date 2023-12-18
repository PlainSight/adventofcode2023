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

var x = 0;
var y = 0;

var instructions = [];

var dist = 0;

input.forEach(i => {
    var bits = /(.) (\d+) \(#(.+)\)/.exec(i);
    var hex = bits[3];

    var dir = charToDir[parseInt(hex[5], 16)];
    var dist = parseInt(hex.slice(0, 5), 16);

    instructions.push([dir, dist]);
});

instructions.forEach((i, ii) => {
    var d = dirMap[i[0]];

    dist += i[1];

    var dx = d[0]*i[1];
    var dy = d[1]*i[1];

    x += dx;
    y += dy;

    vertices.push([x, y]);
})

var sum = 0;

for(var i = 1; i < vertices.length-1; i++) {
    sum += vertices[i][1]*(vertices[i-1][0] - vertices[i+1][0]);
}

console.log(Math.abs(sum)/2 + dist/2 + 1);

var trap = 0;

for(var i = 0; i < vertices.length-1; i++) {
    trap += (vertices[i][1] + vertices[i+1][1])*(vertices[i][0] - vertices[i+1][0]);
}

console.log((trap)/2 + dist/2 + 1);