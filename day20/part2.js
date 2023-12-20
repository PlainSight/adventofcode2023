var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var outputToInput = {};

var modules = input.map(m => {
    var parts = m.split(' -> ');
    var name = parts[0];
    var type = 'u';
    if (name.startsWith('%')) {
        name = name.slice(1);
        type = 'f';
    }
    if (name.startsWith('&')) {
        name = name.slice(1);
        type = 'c';
    }
    var outputs = parts[1].split(', ');

    outputs.forEach(o => {
        outputToInput[o] = (outputToInput[o] || []);
        outputToInput[o].push(name);
    })

    return {
        type: type,
        name: name,
        outputs: outputs
    }
});

modules.forEach(m => {
    if (m.type == 'c') {
        m.state = {};
        outputToInput[m.name].forEach(i => {
            m.state[i] = 0;
        });
    } else {
        m.state = 0;
    }
})

var modules = modules.reduce((a, c) => {
    a[c.name] = c;
    return a;
}, {});

function gcd(a, b) {
    if (b) {
        return gcd(b, a % b);
    } else {
        return a;
    }
}

var pulses = [];

var periods = [];

var DESTINATION = 'rx';
var PARENTOFDESTINATION = outputToInput[DESTINATION][0];

for(var p = 0; true; p++) {
    pulses.push({
        to: 'broadcaster',
        from: 'button',
        value: 0
    });
    while(pulses.length) {
        var newPulses = [];
inner:  while(pulses.length) {
            var currentPulse = pulses.pop();

            if (currentPulse.to == DESTINATION) {
                Object.values(modules[PARENTOFDESTINATION].state).forEach((v, j) => {
                    periods[j] = periods[j] || { off: -1, per: -1, last: 0 };
                    if (v == 1) {
                        periods[j] = periods[j] || { off: -1, per: -1, last: 0 };
                        if (periods[j].per == -1) {
                            if (v == 1 && periods[j].last == 0) {
                                if (periods[j].off == -1) {
                                    periods[j].off = p+1;
                                } else {
                                    periods[j].per = p+1 - periods[j].off;
                                }
                            }
                        }
                    }
                    periods[j].last = v;
                })
                if (periods.every(p => p.per > 0)) {
                    var res = periods.reduce((a, c) => {
                        var g = gcd(a, c.per);
                        return (a * c.per) / g;
                    }, 1);

                    console.log(res);
                    return;
                }
            }
    
            var targetModule = modules[currentPulse.to];

            if (targetModule && targetModule.type == 'f') {
                if (currentPulse.value == 0) {
                    targetModule.state = targetModule.state == 0 ? 1 : 0;
                    targetModule.outputs.forEach(o => {
                        newPulses.push({
                            to: o,
                            from: targetModule.name,
                            value: targetModule.state
                        });
                    })
                }
            }
            if (targetModule && targetModule.type == 'c') {
                targetModule.state[currentPulse.from] = currentPulse.value;
                var sendValue = Object.values(targetModule.state).reduce((a, c) => a && c == 1, true) ? 0 : 1;
                targetModule.outputs.forEach(o => {
                    newPulses.push({
                        to: o,
                        from: targetModule.name,
                        value: sendValue
                    });
                })
            }
            if (targetModule && targetModule.type == 'u') {
                targetModule.outputs.forEach(o => {
                    newPulses.push({
                        to: o,
                        from: targetModule.name,
                        value: currentPulse.value
                    });
                })
            }
        }
        pulses = newPulses;
    }
}
