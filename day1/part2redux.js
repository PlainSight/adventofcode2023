var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var sum = 0;

var valid = [
    '!', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'
];

input.forEach(l => {
    var fi = l.length;
    var li = -1;
    var fd = '';
    var ld = '';
    valid.forEach((v, vi) => {
        var firstIndex = l.indexOf(v);
        if (firstIndex != -1 && firstIndex <= fi) {
            fi = firstIndex;
            fd = '' + (vi % 10);
        }
        var lastIndex = l.lastIndexOf(v);
        if (lastIndex != -1 && lastIndex > li) {
            li = lastIndex;
            ld = '' + (vi % 10);
        }
    })
    
    sum += parseInt(fd+ld); 
});

console.log(sum);