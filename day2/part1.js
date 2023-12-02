var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var sumIds = 0;

input.forEach(i => {
    var vals = /Game (\d+): (.+)/.exec(i);
    var gameId = parseInt(vals[1]);
    var results = vals[2];
    var sets = results.split(';').reduce((a, s) => {
        s.trim().split(',').forEach(c => {
            var bits = /(\d+) ([a-z]+)/.exec(c);
            var col = bits[2];
            var b = parseInt(bits[1]);
            if ((a[col] || 0) < b) {
                a[col] = b;
            }
        });
        return a;
    }, {});

    if (sets['red'] <= 12 && sets['green'] <= 13 && sets['blue'] <= 14) {
        sumIds += gameId;
    }
    
    //console.log(gameId, sets);
})

console.log(sumIds);