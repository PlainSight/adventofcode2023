var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var blockers = [];
var rollers = [];

input.forEach((i, y) => {
    i.split('').forEach((j, x) => {
        if (j == '#') {
            blockers.push({
                x: x,
                y: y
            });
        }
        if (j == 'O') {
            rollers.push({
                x: x,
                y: y
            });
        }
    });
});

function unblocked(x, y) {
    if (x < 0 || y < 0) {
        return false;
    }
    return blockers.filter(b => b.x == x && b.y == y).length == 0 && rollers.filter(r => r.x == x && r.y == y).length == 0;
}

var movement = true;

while(movement) {
    movement = false;
    rollers.forEach(r => {
        if (unblocked(r.x, r.y-1)) {
            r.y--;
            movement = true;
        }
    })
}

var len = input.length;

var sum = rollers.reduce((a, c) => {
    return a + (len - c.y)
}, 0);

console.log(sum);