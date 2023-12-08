var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var instructions = input[0].split('').map(n => n == 'L' ? 0 : 1);

var nodes = {};

input[1].split('\r\n').forEach(i => {
    var elements = /(.+) = \((.+), (.+)\)/.exec(i);

    nodes[elements[1]] = [elements[2], elements[3]]
});

var currentInstIndex = 0;
var steps = 0;
var currentNode = 'AAA';

while(currentNode != 'ZZZ') {
    var inst = instructions[currentInstIndex];
    steps++;
    currentInstIndex++;
    currentInstIndex %= instructions.length;
    currentNode = nodes[currentNode][inst];
}

console.log(steps);