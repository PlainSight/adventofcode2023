var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var sequences = input.map(i => i.split(' ').map(n => parseInt(n)));

var sum = 0;

sequences.forEach(s => {
    var stack = [s];
    while(!stack[stack.length-1].every(v => v == 0)) {
        var newSeq = [];
        for(var i = 0; i < stack[stack.length-1].length - 1; i++) {
            newSeq.push(stack[stack.length-1][i+1] - stack[stack.length-1][i]);
        }
        stack.push(newSeq);
    }
    var inc = 0;
    while(stack.length) {
        inc += stack.pop().pop();
    }
    sum += inc;
});

console.log(sum);