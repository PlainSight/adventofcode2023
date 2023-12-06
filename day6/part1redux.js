var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var times = [...input[0].matchAll(/\d+/g)].map(m => parseInt(m[0]));
var distances = [...input[1].matchAll(/\d+/g)].map(m => parseInt(m[0]));

var ans = 1;

for(var r = 0; r < times.length; r++) {
    var totalTime = times[r];

    var roots = [(-totalTime - Math.sqrt(totalTime*totalTime - 4*distances[r])) / -2, (-totalTime + Math.sqrt(totalTime*totalTime - 4*distances[r])) / -2];

    var diff = Math.ceil(Math.max(...roots)) - Math.ceil(Math.min(...roots));

    ans *= diff;
}

console.log(ans);