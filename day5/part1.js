var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var maps = input.map(i => {
    var lines = i.split('\r\n').map(x => /(?:.+\:)?([\d\s]+)/.exec(x)[1]).filter(l => l.trim() != '').map(y => y.trim().split(' ').map(z => parseInt(z.trim())))
    return lines;
});

var endVals = [];

maps[0][0].forEach(seed => {
    var value = seed;
    maps.forEach((m, mi) => {
        if (mi != 0) {
            var remapped = false;
            m.forEach(mm => {
                if (!remapped && value >= mm[1] && value < mm[1]+mm[2]) {
                    value = (value - mm[1]) + mm[0];
                    remapped = true;
                }
            })
        }
    });
    endVals.push(value);
})


console.log(Math.min(...endVals));