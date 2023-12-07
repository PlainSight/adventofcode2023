var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var hands = input.map(i => {
    var parts = i.split(' ');
    var hand = parts[0].split('');
    var bet = parseInt(parts[1]);
    return {
        hand: hand,
        bet: bet
    }
});

var cardPower = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

function value(c) {
    return (cardPower.indexOf(c));
}

function handStrength(hand) {
    var ent = Object.entries(hand.reduce((a, c) => {
        a[c] = (a[c] || 0) + 1;
        return a;
    }, {}));

    ent.sort((a, b) => b[1] - a[1]);

    var str = 0;

    switch (ent.length) {
        case 1:
            str = 1;
        break;
        case 2:
            if (ent[0][1] == 4) {
                str = 2;
            } else {
                str = 3;
            }
        break;
        case 3:
            if (ent[0][1] == 3) {
                str = 4;
            } else {
                str = 5;
            }
        break;
        case 4:
            str = 6;
        break;
        case 5:
            str = 7;
        break;
    }

    return str;
}

function strongerThan(h1, h2) {
    if (handStrength(h1) > handStrength(h2)) {
        return 1;
    }
    if (handStrength(h1) < handStrength(h2)) {
        return -1;
    }
    for(var i = 0; i < 5; i++) {
        if (value(h1[i]) > value(h2[i])) {
            return 1;
        }
        if (value(h1[i]) < value(h2[i])) {
            return -1;
        }
    }
    return 0;
}

hands.sort((a, b) => {
    return strongerThan(a.hand, b.hand);
})

var sum = hands.reduce((a, c, ci) => {
    return a + ((hands.length-ci) * c.bet);
}, 0);

console.log(sum);