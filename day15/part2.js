var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split(',');

function hash(str) {
    var val = 0;

    str.split('').forEach(c => {
        val += c.charCodeAt(0);
        val *= 17;
        val %= 256;
    });

    return val;
}

var boxes = [];

input.forEach(s => {
    var bits = s.split(/[=\-]/);
    var label = bits[0];

    var h = hash(label);

    if (boxes[h] == undefined) {
        boxes[h] = [];
    }
    var box = boxes[h];

    if(s.includes('-')) {
        boxes[h] = box.filter(b => b.label != label);
    } else {
        var label = bits[0];
        var len = parseInt(bits[1]);
        if(box.some(l => l.label == label)) {
            box.forEach(b => {
                if (b.label == label) {
                    b.len = len;
                }
            })
        } else {
            box.push({
                label: label,
                len: len
            })
        }
    }
})

var sum = 0;

for(var b = 0; b < 256; b++) {
    sum += (boxes[b] || []).reduce((a, c, ci) => a + (c.len * (ci+1) * (b+1)), 0);
}

console.log(sum);