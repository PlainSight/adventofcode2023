var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var seeds = [];

var maps = input.map((i, ii) => {
    var lines = i.split('\r\n').map(x => /(?:.+\:)?([\d\s]+)/.exec(x)[1]).filter(l => l.trim() != '').map(y => y.trim().split(' ').map(z => parseInt(z.trim())));

    if (ii == 0) {
        var seed = {
            offset: 0,
            min: 0,
            length: 0
        };
        lines[0].forEach((l, li) => {
            if (li % 2 == 0) {
                seed = {
                    offset: 0,
                    min: l,
                    length: 0
                };
            } else {
                seed.length = l
                seeds.push(seed);
            }
        });
    }

    var l2 = lines.map(ll => {
        return {
            offset: ll[0] - ll[1],
            min: ll[1],
            length: ll[2]
        };
    });
    l2 = l2.sort((a, b) => a.min - b.min);

    l2.push({
        min: l2[l2.length-1].min + l2[l2.length-1].length,
        length: Math.floor(Number.MAX_SAFE_INTEGER/2),
        offset: 0
    });

    if (l2[0].min != 0) {
        l2.unshift({
            min: 0,
            length: l2[0].min,
            offset: 0
        });
    }

    var finalFinal = [l2[0]];
    for(var n = 1; n < l2.length; n++) {
        if (finalFinal[finalFinal.length-1].min + finalFinal[finalFinal.length-1].length != l2[n].min) {
            finalFinal.push({
                min: finalFinal[finalFinal.length-1].min + finalFinal[finalFinal.length-1].length,
                length: l2[n].min - (finalFinal[finalFinal.length-1].min + finalFinal[finalFinal.length-1].length),
                offset: 0
            });
        }
        finalFinal.push(l2[n]);
    }
    finalFinal = finalFinal.sort((a, b) => a.min - b.min);
    return finalFinal;
}).filter((l, li) => li > 0);

var lowestLocationNumber = Math.floor(Number.MAX_SAFE_INTEGER/2);

function explore(seedRange, layer) {
    if (layer >= maps.length) {
        if (seedRange.min <= lowestLocationNumber) {
            lowestLocationNumber = seedRange.min;
        }
        return;
    }

    var map = maps[layer];
    var len = seedRange.length;
    var min = seedRange.min;
    var offset = seedRange.offset;
    //var trail = seedRange.trail || ('' + min + ':' + len + ':X');

    var elements = [];

    for(var m = 0; m < map.length; m++) {
        var segment = map[m];
        if ((segment.min <= min) && (min < segment.min + segment.length)) {
            var bounded = Math.min(segment.min + segment.length, min + len);
            elements.push({
                min: min + segment.offset,
                length: bounded - min,
                offset: offset + segment.offset,
                //trail: trail + ',' + (min + segment.offset) + ':' + (bounded-min) + ':' + JSON.stringify(segment),
                rule: segment
            });
            var remainingLength = len - (bounded - min);
            if (remainingLength > 0) {
                min = bounded;
                len = remainingLength;
            } else {
                break;
            }
        }
    }

    elements.forEach(e => {
        explore(e, layer+1);
    });
}

seeds.forEach(s => {
    explore(s, 0);
});

console.log(lowestLocationNumber);