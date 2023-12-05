var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var cards = {};

function scoreCard(card) {
    var winning = card.w;
    var chances = card.c;
    var matches = 0;
    chances.forEach(c => {
        if (winning.includes(c)) {
            matches++;
        }
    })
    return matches;
}

var piles = [];
var stackSet = new Set();
var won = 0;

input.forEach(i => {
    var bits = /Card\s+(\d+):(.+)\|(.+)/.exec(i);
    var winning = [...bits[2].matchAll(/\d+/g)].map(c => c[0]);
    var chances = [...bits[3].matchAll(/\d+/g)].map(c => c[0]);
    var id = bits[1];
    cards[id] = scoreCard({
        w: winning, 
        c: chances
    });
    piles[id] = 1;
    stackSet.add(id);
    won++;
});

while(stackSet.size > 0) {
    var top = stackSet.values().next().value;
    stackSet.delete(top);
    var m = piles[top];
    piles[top] = 0;
    var s = cards[top];
    var n = parseInt(top);
    for(var x = 1; x <= s; x++) {
        won += m;
        piles[(n+x)] += m;
        stackSet.add(''+(n+x));
    }
}

console.log(won);