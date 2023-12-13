var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var patterns = input.map(i => {
    return i.split('\r\n').map(r => r.split(''));
});

var sum = 0;

function findHorizontal(p) {
outer:    for(var y = 1; y < p.length; y++) {
        for(var dist = 0; dist < Math.min(y, p.length-y); dist++) {
            var last = p[y-(1+dist)].join('');
            var current = p[y+dist].join('');
            if (last != current) {
                continue outer;
            }
        }
        //console.log('h', y, Math.min(y, p.length-y));
        return y;
    }
    return 0;
}

function findVertical(p) {
outer:    for(var x = 1; x < p[0].length; x++) {
        for(var dist = 0; dist < Math.min(x, p[0].length-x); dist++) {
            for (var y = 0; y < p.length; y++) {
                var last = p[y][x-(1+dist)];
                var current = p[y][x+dist];
                if (last != current) {
                    continue outer;
                }
            }
        }
        //console.log('v', x, Math.min(x, p[0].length-x));
        return x;
    }
    return 0;
}

patterns.forEach(p => {
    var v = findVertical(p);
    var h = findHorizontal(p);
    sum += v;
    sum += 100 * h;
});

console.log(sum);