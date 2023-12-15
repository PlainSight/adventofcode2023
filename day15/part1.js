var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split(',');

function hash(str) {
    var val = 0;

    str.split('').forEach(c => {
        val += c.charCodeAt(0);
        val *= 17;
        val %= 256;
    });

    return val;
}

var sum = 0;

input.forEach(s => {
    sum += hash(s);
})

console.log(sum);