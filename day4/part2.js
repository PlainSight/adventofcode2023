var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var cards = {};

function scoreCard(cardId) {
    var winning = cards[cardId].w;
    var chances = cards[cardId].c;
    var matches = 0;
    chances.forEach(c => {
        if (winning.includes(c)) {
            matches++;
        }
    })
    return matches;
}

var stack = [];
var won = 0;

input.forEach(i => {
    var bits = /Card\s+(\d+):(.+)\|(.+)/.exec(i);
    var winning = Object.values(bits[2].trim().split(' ').filter(f => f != '').reduce((a, c) => { a[c.trim()] = c.trim(); return a; }, {}));
    var chances = Object.values(bits[3].trim().split(' ').filter(f => f != '').reduce((a, c) => { a[c.trim()] = c.trim(); return a; }, {}));
    var id = bits[1];
    cards[id] = {
        w: winning, 
        c: chances
    }
    stack.push(id);
    won++;
});

while(stack.length) {
    var top = stack.pop();
    var s = scoreCard(top);
    var n = parseInt(top);
    for(var x = 1; x <= s; x++) {
        won++;
        stack.push(''+(n+x));
    }
}

console.log(won);