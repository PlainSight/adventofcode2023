const { match } = require('assert');
var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var points = 0;

input.forEach(i => {
    var bits = /Card\s+(\d+):(.+)\|(.+)/.exec(i);
    var winning = Object.values(bits[2].trim().split(' ').filter(f => f != '').reduce((a, c) => { a[c.trim()] = c.trim(); return a; }, {}));
    var chances = Object.values(bits[3].trim().split(' ').filter(f => f != '').reduce((a, c) => { a[c.trim()] = c.trim(); return a; }, {}));
    console.log('w', winning, 'c', chances);
    var matches = 0;
    chances.forEach(c => {
        if (winning.includes(c)) {
            matches++;
        }
    })
    if (matches > 0) {
        points += Math.pow(2, matches-1);
    }
})

console.log(points);