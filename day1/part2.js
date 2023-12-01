var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var sum = 0;

var place = [
    'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'
];

input.forEach(l => {
    var digits = [];
    var str = l;
    while(str.length > 0) {
        var found = /(\d|one|two|three|four|five|six|seven|eight|nine)/.exec(str);
        if (found) {
            str = str.substring(found.index + 1);
            var fi = place.indexOf(found[0]);
            if(fi > -1) {
                digits.push(''+(fi+1));
            } else {
                digits.push(found[0])
            }
        } else {
            break;
        }
    }
    sum += parseInt(digits[0] + digits[digits.length-1]); 
    //console.log(l, digits, parseInt(digits[0] + digits[digits.length-1]));
});

console.log(sum);