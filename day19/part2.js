var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n\r\n');

var workFlows = input[0].split('\r\n').map(r => {
    var bits = r.split(/[\{\},]/g).filter(f => f != '');

    return {
        name: bits[0],
        rules: bits.slice(1).map(r => {
            if (r.includes(':')) {
                var sp = r.split(':');

                var condBits = /(.)(.)(\d+)/.exec(sp[0]);
                return {
                    condition: {
                        variable: condBits[1],
                        condition: condBits[2],
                        value: parseInt(condBits[3]),
                    },
                    dest: sp[1]
                }
            } else {
                return {
                    dest: r
                }
            }
        })
    }
}).reduce((a, c) => {
    a[c.name] = c.rules;
    return a;
}, {});

function clone(r, min, max, variable) {
    var res = {
        x: { offset: r.x.offset, len: r.x.len },
        m: { offset: r.m.offset, len: r.m.len },
        a: { offset: r.a.offset, len: r.a.len },
        s: { offset: r.s.offset, len: r.s.len }
    };
    if (min) {
        var newOffset = Math.max(res[variable].offset, min);
        var offsetDifference = newOffset - res[variable].offset;
        res[variable].offset = newOffset;
        res[variable].len -= offsetDifference;
    }
    if (max) {
        var lengthDifference = (res[variable].offset + res[variable].len) - max;
        res[variable].len -= lengthDifference;
    }

    if (res[variable].len == 0) {
        return null;
    }

    return res;
}

function applyCondition(ranges, value, condition, variable) {
    var rightMin = value;
    var leftMax = value;
    if (condition == '>') {
        rightMin++;
        leftMax++;
    }
    var left = clone(ranges, null, leftMax, variable);
    var right = clone(ranges, rightMin, null, variable);
    if (condition == '>') {
        return {
            passed: right,
            failed: left
        }
    } else {
        return {
            passed: left,
            failed: right
        }
    }
}

function explore(ranges, workFlow, rule) {
    if (workFlow == 'R') {
        return 0;
    }
    if (workFlow == 'A') {
        return ranges.x.len * ranges.m.len * ranges.a.len * ranges.s.len;
    }
    var rl = workFlows[workFlow][rule];
    if (rl.condition) {
        var res = applyCondition(ranges, rl.condition.value, rl.condition.condition, rl.condition.variable);
        var r1 = 0;
        var r2 = 0;
        if (res.passed) {
            r1 = explore(res.passed, rl.dest, 0);
        }
        if (res.failed) {
            r2 = explore(res.failed, workFlow, rule+1);
        }
        return r1+r2;
    } else {
        return explore(ranges, rl.dest, 0);
    }
}

var res = explore({
        x: { offset: 1, len: 4000 },
        m: { offset: 1, len: 4000 },
        a: { offset: 1, len: 4000 },
        s: { offset: 1, len: 4000 }
    }, 'in', 0);

console.log(res);