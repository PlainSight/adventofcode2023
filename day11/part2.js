var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var galaxies = [];

var minx = Number.MAX_SAFE_INTEGER;
var maxx = -Number.MAX_SAFE_INTEGER;
var miny = Number.MAX_SAFE_INTEGER;
var maxy = -Number.MAX_SAFE_INTEGER;

input.forEach((i, y) => {
    i.split('').forEach((j, x) => {
        if (j == '#') {
            if (x > maxx) {maxx = x;}
            if (x < minx) {minx = x;}
            if (y > maxy) {maxy = y;}
            if (y < miny) {miny = y;}
            galaxies.push({
                x: x,
                y: y
            });
        }
    })
});

var darkEnergyX = [];
var darkEnergyY = [];

var expansion = (1000000-1);

for(var x = minx; x < maxx; x++) {
    if (galaxies.filter(g => g.x == x).length == 0) {
        darkEnergyX.push(x);
    }
}

for(var y = miny; y < maxy; y++) {
    if (galaxies.filter(g => g.y == y).length == 0) {
        darkEnergyY.push(y);
    }
}

darkEnergyX.forEach((x, xi) => {
    galaxies.forEach(g => {
        if (g.x > x) {
            g.x += expansion;
        }
    })
    darkEnergyX.forEach((xx, xxi) => {
        if (xx > x && xxi > xi) {
            darkEnergyX[xxi] += expansion;
        }
    })
});


darkEnergyY.forEach((y, yi) => {
    galaxies.forEach(g => {
        if (g.y > y) {
            g.y += expansion;
        }
    })
    darkEnergyY.forEach((yy, yyi) => {
        if (yy > y && yyi > yi) {
            darkEnergyY[yyi] += expansion;
        }
    })
});

var sum = 0;

galaxies.forEach((g, gi) => {
    galaxies.forEach((gg, ggi) => {
        if (ggi > gi) {
            var val = (Math.abs(gg.x - g.x) + Math.abs(gg.y - g.y));
            sum += val;
        }
    })
})

console.log(sum);