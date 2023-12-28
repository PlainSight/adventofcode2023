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

function iscale(a, v) {
    return a.map(x => x/v);
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

function findRockStart(inp1, inp2, inp3, inp4) {
    var v1 = inp1.slice(0, 3).map(n => BigInt(n));
    var v1d = inp1.slice(3).map(n => BigInt(n));
    var v2 = inp2.slice(0, 3).map(n => BigInt(n));
    var v2d = inp2.slice(3).map(n => BigInt(n));
    var v3 = inp3.slice(0, 3).map(n => BigInt(n));
    var v3d = inp3.slice(3).map(n => BigInt(n));
    var v4 = inp4.slice(0, 3).map(n => BigInt(n));
    var v4d = inp4.slice(3).map(n => BigInt(n));
    
    // made all deltas relative to v1d
    v2d = subvec(v2d, v1d);
    v3d = subvec(v3d, v1d);
    v4d = subvec(v4d, v1d);
    
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

    // look for intersection of v4-> and plane
    leftV = [BigInt(v4[0])*BigInt(planeNormal[0]), BigInt(v4[1])*BigInt(planeNormal[1]), BigInt(v4[2])*BigInt(planeNormal[2])];

    leftVD = [BigInt(v4d[0])*BigInt(planeNormal[0]), BigInt(v4d[1])*BigInt(planeNormal[1]), BigInt(v4d[2])*BigInt(planeNormal[2])];
    rightMinusLeftV = rightSide - leftV.reduce((a, b) => a + b, BigInt(0));
    leftInTermsOfT = leftVD.reduce((a, b) => a + b, BigInt(0));
    var t2 = rightMinusLeftV / leftInTermsOfT;
    
    // now we know at which times hailstone 3 and 4 intersect the plane
    // find the positions of these rocks at those times 
    // reverst these back to the original values
    v3d = addvec(v3d, v1d);
    v4d = addvec(v4d, v1d);

    var h3att = addvec(v3, scale(v3d, t));
    var h4att2 = addvec(v4, scale(v4d, t2));

    var tDiff = t2 - t;

    var intersectDiff = subvec(h4att2, h3att);
    var vrd = iscale(intersectDiff, tDiff);

    return subvec(h3att, scale(vrd, t));
}

var start = findRockStart(stones[0], stones[1], stones[3], stones[2]);
console.log(Number(start[0]+start[1]+start[2]));