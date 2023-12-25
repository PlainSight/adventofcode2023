var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var connections = {};

input.forEach(i => {
    var parts = i.replace(':', '').split(' ');
    var from = parts[0];
    var to = parts.slice(1);
    connections[from] = (connections[from] || {});
    to.forEach(c => {
        connections[c] = (connections[c] || {});
        connections[from][c] = c;
        connections[c][from] = from;
    });
});

Object.keys(connections).forEach(c => {
    connections[c] = Object.values(connections[c]);
})

var edges = Object.entries(connections).reduce((a, c) => {
    c[1].forEach(cc => {
        var k = [c[0], cc].sort().join(',');
        a[k] = 0;
    });
    return a;
}, {});

Object.keys(connections).forEach((c, ci) => {
    var seen = {};

    var stack = [{ current: c, parent: null }];

    while (stack.length) {
        var top = stack.shift();
        if (seen[top.current]) {
            continue;
        }
        seen[top.current] = top;
        connections[top.current].forEach(con => {
            stack.push({ current: con, parent: top.current });
        });
    }

    // now loop through all destinations and increment the edge cross count for each edge crossed
    Object.values(seen).forEach((s) => {
        var curr = s;
        while(curr.parent) {
            var k = [curr.current, curr.parent].sort().join(',');
            edges[k]++;
            curr = seen[curr.parent];
        }
    });
});

var top3 = Object.entries(edges).sort((a, b) => {
    return b[1] - a[1];
});

top3.slice(0, 3).forEach(e => {
    var node = e[0].split(',');
    connections[node[0]] = connections[node[0]].filter(n => n != node[1]);
    connections[node[1]] = connections[node[1]].filter(n => n != node[0]);
})

var stack = [];
var seen = {};

stack.push(Object.keys(connections)[0]);

var count = 0;

while(stack.length) {
    var top = stack.pop();
    if(seen[top]) {
        continue;
    }
    seen[top] = true;
    count++;
    connections[top].forEach(c => {
        stack.push(c);
    })
}

console.log(count * (Object.values(connections).length - count));