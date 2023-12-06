var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var seeds = [];

var seedNumbers =  [...input[0].matchAll(/\d+/g)].map(m => parseInt(m[0]));
for(var i = 0; i < seedNumbers.length; i += 2) {
    seeds.push({
        offset: 0,
        min: seedNumbers[i],
        length: seedNumbers[i+1]
    })
}

var MAXVAL = Math.floor(Number.MAX_SAFE_INTEGER/2);

var maps = input.slice(1).map((i) => {
    var lines = i.split('\r\n').slice(1).map(x => [...x.matchAll(/\d+/g)].map(z => parseInt(z[0])));

    lines = lines.map(ll => {
        return {
            offset: ll[0] - ll[1],
            min: ll[1],
            length: ll[2]
        };
    });
    lines = lines.sort((a, b) => a.min - b.min);

    lines.push({
        min: lines[lines.length-1].min + lines[lines.length-1].length,
        length: MAXVAL,
        offset: 0
    });

    if (lines[0].min != 0) {
        lines.unshift({
            min: 0,
            length: lines[0].min,
            offset: 0
        });
    }

    var finalFinal = [lines[0]];
    for(var n = 1; n < lines.length; n++) {
        if (finalFinal[finalFinal.length-1].min + finalFinal[finalFinal.length-1].length != lines[n].min) {
            finalFinal.push({
                min: finalFinal[finalFinal.length-1].min + finalFinal[finalFinal.length-1].length,
                length: lines[n].min - (finalFinal[finalFinal.length-1].min + finalFinal[finalFinal.length-1].length),
                offset: 0
            });
        }
        finalFinal.push(lines[n]);
    }
    finalFinal = finalFinal.sort((a, b) => a.min - b.min);
    return finalFinal;
});

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