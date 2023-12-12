const exp = require('constants');
var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var sum = 0;

var cache = {};

function key(seqIndex, runIndex, runPosition) {
    return `${seqIndex}:${runIndex}:${runPosition}`;
}

function explore(seq, seqIndex, runs, runIndex, runPosition) {
    var k = key(seqIndex, runIndex, runPosition);
    if (cache[k] !== undefined) {
        return cache[k];
    }
    for(var i = seqIndex; i < seq.length; i++) {
        // we are in a run
        if (runPosition > 0) {
            switch (seq[i]) {
                case '.':
                    if (runPosition < runs[runIndex]) {
                        cache[k] = 0;
                        return 0;
                    } else {
                        var res = explore(seq, i+1, runs, runIndex+1, 0);
                        cache[k] = res;
                        return res;
                    }
                case '?':
                    if (runPosition < runs[runIndex]) {
                        runPosition++;
                    } else {
                        var res = explore(seq, i+1, runs, runIndex+1, 0);
                        cache[k] = res;
                        return res;
                    }
                break;
                case '#':
                    if (runPosition < runs[runIndex]) {
                        runPosition++;
                    } else {
                        cache[k] = 0;
                        return 0;
                    }
                break;
            }
        } else {
            switch(seq[i]) {
                case '#':
                    runPosition = 1;
                break;
                case '?':
                    var res1 = explore(seq, i+1, runs, runIndex, 1); // #
                    var res2 = explore(seq, i+1, runs, runIndex, 0); // .
                    cache[k] = res1 + res2;
                    return res1 + res2;
            }
        }
    }
    if (runPosition == 0 && runIndex == runs.length || (runIndex ==  runs.length-1 && runPosition == runs[runs.length-1])) {
        cache[k] = 1;
        return 1;
    } else {
        cache[k] = 0;
        return 0;
    }
}

input.forEach(i => {
    var parts = i.split(' ');

    var seq = (parts[0]+'?'+parts[0]+'?'+parts[0]+'?'+parts[0]+'?'+parts[0]).split(''); //

    var runs = (parts[1]+','+parts[1]+','+parts[1]+','+parts[1]+','+parts[1]).split(',').map(n => parseInt(n)); //

    sum += explore(seq, 0, runs, 0, 0);
    cache = {};
});

console.log(sum);