var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var sum = 0;

input.forEach(l => {
    var digits = [];
    l.split('').forEach(c => {
        if(/\d/.test(c)) {
            digits.push((c));
        }
    })
    sum += parseInt(digits[0] + digits[digits.length-1]);
});

console.log(sum);