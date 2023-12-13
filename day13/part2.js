var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var patterns = input.map(i => {
    return i.split('\r\n').map(r => r.split(''));
});

var sum = 0;

function findHorizontal(p) {
outer:    for(var y = 1; y < p.length; y++) {
        var error = 0;
        for(var dist = 0; dist < Math.min(y, p.length-y); dist++) {
            for(var x = 0; x < p[0].length; x++) {
                var last = p[y-(1+dist)][x];
                var current = p[y+dist][x];
                if (last != current) {
                    error++;
                }
                if (error > 1) {
                    continue outer;
                }
            }
        }
        //console.log('h', y, Math.min(y, p.length-y));
        if (error == 1) {
            return y;
        }
    }
    return 0;
}

function findVertical(p) {
outer:    for(var x = 1; x < p[0].length; x++) {
        var error = 0;
        for(var dist = 0; dist < Math.min(x, p[0].length-x); dist++) {
            for (var y = 0; y < p.length; y++) {
                var last = p[y][x-(1+dist)];
                var current = p[y][x+dist];
                if (last != current) {
                    error++;
                }
                if (error > 1) {
                    continue outer;
                }
            }
        }
        if (error == 1) {
            return x;
        }
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