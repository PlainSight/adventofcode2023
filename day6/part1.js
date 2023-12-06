var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var times = [...input[0].matchAll(/\d+/g)].map(m => parseInt(m[0]));
var distances = [...input[1].matchAll(/\d+/g)].map(m => parseInt(m[0]));

var ans = 1;

for(var r = 0; r < times.length; r++) {
    var sum = 0;
    var totalTime = times[r];

    for(var t = 1; t < totalTime; t++) {
        var dist = t * (totalTime - t);
        if (dist > distances[r]) {
            sum++;
        }
    }

    ans *= sum;
}

console.log(ans);