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

function subvec(a, b) {
    return a.map((_, i) => a[i] - b[i]);
}

function addvec(a, b) {
    return a.map((_, i) => a[i] + b[i]);
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

function solve(point1, delta1, point2, delta2) {
    // (1) point1[0] + delta1[0]*s = point2[0] + delta2[0]*t
    // (2) point1[1] + delta1[1]*s = point2[1] + delta2[1]*t
    // (3) point1[2] + delta1[2]*s = point2[2] + delta2[2]*t

    // subtract 2 from 1 to remove all instances of t
    // first multiply (2) by delta2[0]/delta2[1]
    if (delta2[1] == BigInt(0)) {
        return BigInt(0);
    }
    var mulVal = Number(delta2[0])/Number(delta2[1]);

    var f2a = Number(point1[1]) * mulVal;
    var f2b = Number(delta1[1]) * mulVal;
    var f2c = Number(point2[1]) * mulVal;

    // new formula

    var nfa = Number(point1[0]) - f2a;
    var nfb = Number(delta1[0]) - f2b;
    var nfc = Number(point2[0]) - f2c;
    if (nfb == 0) {
        return BigInt(0);
    }
    var s = (nfa - nfc) / -nfb;
    
    return BigInt(Math.floor(s));
}

function findRockStart(inp1, inp2, inp3) {
    var v1 = inp1.slice(0, 3).map(n => BigInt(n));
    var v1d = inp1.slice(3).map(n => BigInt(n));
    var v2 = inp2.slice(0, 3).map(n => BigInt(n));
    var v2d = inp2.slice(3).map(n => BigInt(n));
    var v3 = inp3.slice(0, 3).map(n => BigInt(n));
    var v3d = inp3.slice(3).map(n => BigInt(n));
    
    // made all deltas relative to v1d
    v2d = subvec(v2d, v1d);
    v3d = subvec(v3d, v1d);
    
    var vsynth = addvec(v2, v2d);
    
    var A = subvec(v2, v1);
    var B = subvec(vsynth, v1);
    
    var planeNormal = cross(A, B);

    // plane point = v1
    
    // look for intersection of v3-> and plane
    var rightSide = (BigInt(planeNormal[0]) * BigInt(v1[0])) + (BigInt(planeNormal[1]) * BigInt(v1[1])) + (BigInt(planeNormal[2]) * BigInt(v1[2])); 

    var leftV = [BigInt(v3[0])*BigInt(planeNormal[0]), BigInt(v3[1])*BigInt(planeNormal[1]), BigInt(v3[2])*BigInt(planeNormal[2])];

    var leftVD = [BigInt(v3d[0])*BigInt(planeNormal[0]), BigInt(v3d[1])*BigInt(planeNormal[1]), BigInt(v3d[2])*BigInt(planeNormal[2])];
    var rightMinusLeftV = rightSide - leftV.reduce((a, b) => a + b, BigInt(0));
    var leftInTermsOfT = leftVD.reduce((a, b) => a + b, BigInt(0));
    var t = rightMinusLeftV / leftInTermsOfT;
    
    // now we know t we can determine the delta of the rock
    // we know the rock passes though v1 then through v3+(v3d*t)
    
    var rockDelta = subvec([v3[0]+(v3d[0]*t), v3[1]+(v3d[1]*t), v3[2]+(v3d[2]*t)], v1);
    var divisor = gcd(
        gcd(Math.abs(Number(rockDelta[0])), Math.abs(Number(rockDelta[1]))),
        gcd(Math.abs(Number(rockDelta[1])), Math.abs(Number(rockDelta[2]))),
    );
    if (divisor > 1) {
        rockDelta = rockDelta.map(rd => rd / BigInt(divisor));
    }
    //console.log('rock delta devided', rockDelta, t);

    var rockVelo = rockDelta;

    // find intersection time with v2

    // find the intersection of v1+rockVelo*s and v2+v2d*t
    // v1[0] + rockVelo[0]*s = v2[0] + v2d[0]*t
    // v1[1] + rockVelo[1]*s = v2[1] + v2d[1]*t
    // v1[2] + rockVelo[2]*s = v2[2] + v2d[2]*t

    var actualRockVelocity = addvec(rockVelo, v1d);

    //console.log('actualRockVelocity', actualRockVelocity);

    // solve for t
    var t1 = solve(v2, v2d, v1, rockVelo);
    var startOfRock1 = [BigInt(-1), BigInt(-1), BigInt(-1)];

    if (t1 != BigInt(0)) {
        // determine where rock is thrown from relatively
        var collisionWithV2 = addvec(v2, scale(addvec(v1d, v2d), t1));
        //console.log('collision with v2', collisionWithV2);
        startOfRock1 = subvec(collisionWithV2, scale(actualRockVelocity, t1));
    }

    var t2 = solve(v3, v3d, v1, rockVelo);
    var startOfRock2 = [BigInt(-2), BigInt(-2), BigInt(-2)];

    if (t2 != BigInt(0)) {
        // determine where rock is thrown from relatively
        var collisionWithV3 = addvec(v3, scale(addvec(v1d, v3d), t2));
        //console.log('collision with v3', collisionWithV3);
        startOfRock2 = subvec(collisionWithV3, scale(actualRockVelocity, t2));
    }

    if (startOfRock1.every((r1, i) => r1 == startOfRock2[i])) {
        return startOfRock1;
    }

    return null;
}

for(var i = 0; i < 6; i++) {
    for(var j = 0; j < 6; j++) {
        for(var k = 0; k < 6; k++) {
            if (i != j && j != k && i != k) {
                var start = findRockStart(stones[i], stones[j], stones[k]);
                if (start) {
                    console.log(Number(start[0]+start[1]+start[2]));
                    return;
                }
            }
        }
    }
}