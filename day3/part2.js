var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var parts = [];
var symbols = [];

input.forEach((i, y) => {
    var x = 0;
    var str = i;
    while(str.length > 0) {
        var match = /(\d+)/.exec(str);
        if (match) {
            //console.log(match);
            var len = match[1].length + match.index;
            var xmin = x + match.index;
            var xmax = x + match.index + match[1].length - 1;
            parts.push({
                val: parseInt(match[1]),
                y: y,
                xmin: xmin,
                xmax: xmax
            })
            x += len;
            str = str.substring(len);
            //console.log(str, x);
        } else {
            break;
        }
    }
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