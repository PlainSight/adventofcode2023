var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var time = parseInt([...input[0].matchAll(/\d+/g)].map(m => (m[0])).reduce((a, c) => a+c, ''));
var distance = parseInt([...input[1].matchAll(/\d+/g)].map(m => (m[0])).reduce((a, c) => a+c, ''));

var sum = 0;
var totalTime = time;

for(var t = 1; t < totalTime; t++) {
    var dist = t * (totalTime - t);
    if (dist > distance) {
        sum++;
    }
}

console.log(sum);