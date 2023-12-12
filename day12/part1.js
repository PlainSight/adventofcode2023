var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var sum = 0;

function matches(seq, run) {
    var nextRun = 0;
    var expect = [];

    for(var i = 0; i < seq.length; i++) {
        if (expect.length) {
            var ex = expect.pop();
            if (seq[i] != ex) {
                return false;
            }
        } else {
            if (seq[i] == '#') {
                expect.push('.');
                for(var j = 0; j < run[nextRun] - 1; j++) {
                    expect.push('#');
                }
                nextRun++;
            }
        }
    }

    return (nextRun == run.length && expect.length <= 1);
}


function generateSeq(raw, n) {
    //console.log(raw, Math.pow(2, raw.filter(n => n == '?').length));
    if (n >= Math.pow(2, raw.filter(n => n == '?').length)) {
        return [];
    } else {
        var rem = n;
        var newSeq = [];

        for(var i = 0; i < raw.length; i++) {
            if (raw[i] == '?') {
                if (rem & 1 == 1) {
                    newSeq.push('#');
                } else {
                    newSeq.push('.');
                }
                rem = rem >> 1;
            } else {
                newSeq.push(raw[i]);
            }
        }
        return newSeq;
    }
}

input.forEach(i => {
    var parts = i.split(' ');

    var seq = parts[0].split('');
    var runs = parts[1].split(',').map(n => parseInt(n));

    var seqN = 0;
    var lastSeq = [];
    
    var valid = 0;

    do {
        lastSeq = generateSeq(seq, seqN);

        if (matches(lastSeq, runs)) {
            valid++;
        }

        seqN++;
    } while(lastSeq.length > 0);

    sum += valid;
});

console.log(sum);