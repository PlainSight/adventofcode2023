var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var stones = input.map(i => {
    i = i.replace('@', ',');
    var parts = i.split(',').map(n => parseInt(n.trim()));

    return parts;
});

function scale(a, v) {
    return a.map(x => x*v);
}

function div(a, v) {
    return a.map(x => x/v);
}

function subvec(a, b) {
    return a.map((_, i) => a[i] - b[i]);
}

function addvec(a, b) {
    return a.map((_, i) => a[i] + b[i]);
}

function divvec(a, b) {
    return a.map((_, i) => b[i] == 0 ? 0 : a[i] / b[i]);
}

function cross(a, b) {
    return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
    ]
}

function gcd(a, b) {
    if (b) {
        return gcd(b, a % b);
    } else {
        return a;
    }
}

function normalize(v) {
    var mag = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    return [v[0]/mag, v[1]/mag, v[2]/mag];
}

function solve(point1, delta1, point2, delta2) {
    // (1) point1[0] + delta1[0]*s = point2[0] + delta2[0]*t
    // (2) point1[1] + delta1[1]*s = point2[1] + delta2[1]*t
    // (3) point1[2] + delta1[2]*s = point2[2] + delta2[2]*t

    // subtract 2 from 1 to remove all instances of t
    // first multiply (2) by delta2[0]/delta2[1]
    var mulVal = delta2[0]/delta2[1];

    var f2a = point1[1] * mulVal;
    var f2b = delta1[1] * mulVal;
    var f2c = point2[1] * mulVal;

    // new formula

    var nfa = point1[0] - f2a;
    var nfb = delta1[0] - f2b;
    var nfc = point2[0] - f2c;
    var s = (nfa - nfc) / -nfb;

    //console.log(point1, delta1, point2, delta2, 'ans', s);
    
    return s;
}

function findRockStart(inp1, inp2, inp3) {
    var v1 = inp1.slice(0, 3);
    var v1d = inp1.slice(3);
    var v2 = inp2.slice(0, 3);
    var v2d = inp2.slice(3);
    var v3 = inp3.slice(0, 3);
    var v3d = inp3.slice(3);
    
    // made all deltas relative to v1d
    v2d = subvec(v2d, v1d);
    v3d = subvec(v3d, v1d);
    
    var vsynth = addvec(v2, v2d);
    
    var A = subvec(v2, v1);
    var B = subvec(vsynth, v1);
    
    var planeNormal = cross(A, B);

    //planeNormal = normalize(planeNormal);
    
    // plane point = v1
    
    // look for intersection of v3-> and plane
    var rightSide = (BigInt(planeNormal[0]) * BigInt(v1[0])) + (BigInt(planeNormal[1]) * BigInt(v1[1])) + (BigInt(planeNormal[2]) * BigInt(v1[2])); 
    console.log('rightSide', rightSide)

    var leftV = [v3[0]*planeNormal[0], v3[1]*planeNormal[1], v3[2]*planeNormal[2]];
    var leftVD = [v3d[0]*planeNormal[0], v3d[1]*planeNormal[1], v3d[2]*planeNormal[2]];
    var rightMinusLeftV = rightSide - leftV.reduce((a, b) => a + b, 0);
    var leftInTermsOfT = leftVD.reduce((a, b) => a + b, 0);
    
    var t = rightMinusLeftV / leftInTermsOfT;

    console.log('blah', t);
    
    // now we know t we can determine the delta of the rock
    // we know the rock passes though v1 then through v3+(v3d*t)
    
    var rockDelta = subvec([v3[0]+(v3d[0]*t), v3[1]+(v3d[1]*t), v3[2]+(v3d[2]*t)], v1);
    console.log('rock delta', rockDelta);
    var smallestGCD = Math.min(...rockDelta.map(d => gcd(Math.abs(d), t)));
    if (smallestGCD > 1) {
        t = (t / smallestGCD);
        console.log('lol this happens');
    }
    var rockVelo = rockDelta

    // find intersection time with v2

    // find the intersection of v1+rockVelo*s and v2+v2d*t
    // v1[0] + rockVelo[0]*s = v2[0] + v2d[0]*t
    // v1[1] + rockVelo[1]*s = v2[1] + v2d[1]*t
    // v1[2] + rockVelo[2]*s = v2[2] + v2d[2]*t

    // solve for t
    var t = solve(v2, v2d, v1, rockVelo);
    var startOfRock1 = [-1, -1, -1];

    if (!isNaN(t)) {
        // determine where rock is thrown from relatively
        var actualRockVelocity = addvec(rockVelo, v1d);
        var collisionWithV2 = addvec(v2, scale(addvec(v1d, v2d), t));
        startOfRock1 = subvec(collisionWithV2, scale(actualRockVelocity, t));
    }

    var t2 = solve(v3, v3d, v1, rockVelo);
    var startOfRock2 = [-2, -2, -2];

    if (!isNaN(t2)) {
        // determine where rock is thrown from relatively
        var actualRockVelocity = addvec(rockVelo, v1d);
        var collisionWithV3 = addvec(v3, scale(addvec(v1d, v3d), t2));
        startOfRock2 = subvec(collisionWithV3, scale(actualRockVelocity, t2));
    }

    console.log('fff', t, startOfRock1, t2, startOfRock2);

    if (startOfRock1.every((r1, i) => r1 == startOfRock2[i])) {
        return startOfRock1;
    }

    return null;
}

for(var i = 0; i < 3; i++) {
    for(var j = 0; j < 3; j++) {
        for(var k = 0; k < 3; k++) {
            if (i != j && j != k && i != k) {
                var start = findRockStart(stones[i], stones[j], stones[k]);
                if (start) {
                    console.log(start[0]+start[1]+start[2]);
                }
            }
        }
    }
}