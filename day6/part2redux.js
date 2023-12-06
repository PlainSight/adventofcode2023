var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var time = parseInt([...input[0].matchAll(/\d+/g)].map(m => (m[0])).reduce((a, c) => a+c, ''));
var distance = parseInt([...input[1].matchAll(/\d+/g)].map(m => (m[0])).reduce((a, c) => a+c, ''));

// -1*t^2 + t*time - distance = 0 
// -time -+ root (time^2 -4*-1*-distnace)  / -2 = t

var roots = [(-time - Math.sqrt(time*time - 4*distance)) / -2, (-time + Math.sqrt(time*time - 4*distance)) / -2];

var diff = Math.ceil(Math.max(...roots)) - Math.ceil(Math.min(...roots));

console.log(diff);