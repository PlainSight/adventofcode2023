var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var instructions = input[0].split('').map(n => n == 'L' ? 0 : 1);

var nodes = {};

input[1].split('\r\n').forEach(i => {
    var elements = /(.+) = \((.+), (.+)\)/.exec(i);

    nodes[elements[1]] = [elements[2], elements[3]]
});

var currentNodes = Object.keys(nodes).filter(f => f.endsWith('A'));

var currentInstIndex = 0;
var steps = 0;

var period = currentNodes.map(n => 0);
var offset = currentNodes.map(n => 0);

while(period.filter(f => f == 0).length > 0) {
    var inst = instructions[currentInstIndex];
    steps++;
    currentInstIndex++;
    currentInstIndex %= instructions.length;
    currentNodes = currentNodes.map((cn, cni) => {
        var nextNode = nodes[cn][inst];
        if (nextNode.endsWith('Z')) {
            if (offset[cni] == 0) {
                offset[cni] = steps;
            } else {
                if (period[cni] == 0) {
                    period[cni] = (steps - offset[cni]);
                }
            }
        }
        return nextNode;
    });
}

function gcd(a, b) {
    while (a != b) {
        if (a > b) {
            a = a - b;
        } else {
            b = b - a;
        }
    }
    return a;
}

var mul = period.reduce((a, c) => {
    var g = gcd(a, c);
    return (a * c) / g;
}, 1);

console.log(mul);
