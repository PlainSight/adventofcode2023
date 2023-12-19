var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var workFlows = input[0].split('\r\n').map(r => {
    var bits = r.split(/[\{\},]/g).filter(f => f != '');

    return {
        name: bits[0],
        rules: bits.slice(1).map(r => {
            if (r.includes(':')) {
                var sp = r.split(':');
                return {
                    condition: sp[0],
                    dest: sp[1]
                }
            } else {
                return {
                    condition: true,
                    dest: r
                }
            }
        })
    }
}).reduce((a, c) => {
    a[c.name] = c.rules;
    return a;
}, {});

var parts = input[1].split('\r\n').map(p => JSON.parse(p.replace(/\=/g, ':').replace('x', '"x"').replace('m', '"m"').replace('a', '"a"').replace('s', '"s"')));

var sum = 0;

parts.forEach(p => {
    var x = p.x;
    var m = p.m;
    var a = p.a;
    var s = p.s;

    var workFlow = 'in';

    var finished = false;

    while(!finished) {
        var rls = workFlows[workFlow];
        for(var i = 0; i < rls.length; i++) {
            if (eval(rls[i].condition)) {
                workFlow = rls[i].dest;
                break;
            }
        }
        if (workFlow == 'A') {
            sum += (x+m+a+s);
            finished = true;
        } 
        if (workFlow == 'R') {
            finished = true;
        }
    }
})

console.log(sum);