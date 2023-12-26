var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var stones = input.map(i => {
    //20, 19, 15 @  1, -5, -3
    i = i.replace('@', ',');
    var parts = i.split(',').map(n => parseInt(n.trim()));

    return parts;
});

var xmin = 7;
var xmax = 27;
var ymin = 7;
var ymax = 27;

if (input.length > 10) {
    xmin = 200000000000000;
    xmax = 400000000000000;
    ymin = 200000000000000;
    ymax = 400000000000000;
}

function collides(s1, s2) {
    // (y - y1) = m1(x - x1)
    // formula (y2d/x2d)(x - x2) + y2 = (y1d/x1d)(x - x1) + y1
    // rearrange then solve for x
    //  m2(x - x2) + y2 = m1(x - x1) + y1
    // m2x - m2x2 + y2 = m1x - m1x1 + y1
    // m2x - m1x = m2*x2 - m1*x1 + y1 - y2
    // x(m2 - m1) = m2*x2 - m1*x1 + y1 - y2
    // x = (m2*x2 - m1*x1 + y1 - y2) / (m2 - m1);
    var m1 = s1[4]/s1[3];
    var m2 = s2[4]/s2[3];
    var div = (m2 - m1);
    if (div == 0) {
        return false;
    }
    var x = (m2*s2[0] - m1*s1[0] + s1[1] - s2[1]) / div;
    var y = m1*(x - s1[0]) + s1[1];
    var res = (x <= xmax && x >= xmin && y <= ymax && y >= ymin);
    var s1Future = ((s1[0] - x) / s1[3]) < 0;
    var s2Future = ((s2[0] - x) / s2[3]) < 0;
    return res && s1Future && s2Future;
}

var count = 0;

for(var s = 0; s < stones.length-1; s++) {
    for(var ss = s+1; ss < stones.length; ss++) {
        if (collides(stones[s], stones[ss])) {
            count++;
        }
    }
}

console.log(count);