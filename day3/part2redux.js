var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var parts = [];
var symbols = [];

input.forEach((i, y) => {
    var str = i;
    var matches = [...str.matchAll(/\d+/g)];
    matches.forEach(m => {
        parts.push({
            val: parseInt(m[0]),
            y: y,
            xmin: m.index,
            xmax: m.index + m[0].length - 1
        })
    })
});

var distsym = {};

input.forEach((i, y) => {
    i.split('').forEach((j, x) => {
        if (/[\*]/.test(j)) {
            distsym[j] = j;
            symbols.push({
                x: x,
                y: y,
                c: j
            })
        }
    })
})

var sum = 0;

symbols.forEach(s => {
    var adj = [];
    parts.forEach(p => {
        if (Math.abs(p.y - s.y) <= 1) {
            if (s.x >= (p.xmin - 1) && s.x <= (p.xmax + 1)) {
                adj.push({ xmin: p.xmin, xmax: p.xmax, y: p.y, v: p.val });
            }
        }
    })
    if (adj.length == 2) {
        sum += adj[0].v * adj[1].v;
    }
});

console.log(sum);