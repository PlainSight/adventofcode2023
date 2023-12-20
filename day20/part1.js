var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

/*
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a
*/

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

var highPulses = 0;
var lowPulses = 0;
var pulses = [];

for(var p = 0; p < 1000; p++) {
    pulses.push({
        to: 'broadcaster',
        from: 'button',
        value: 0
    });
    while(pulses.length) {
        var newPulses = [];
inner:  while(pulses.length) {
            var currentPulse = pulses.pop();
            //console.log(currentPulse);
            if (currentPulse.value == 0) {
                lowPulses++;
            } else {
                highPulses++;
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

console.log(highPulses*lowPulses);