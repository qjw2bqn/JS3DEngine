class BoxBufferGeometry extends THREE.BufferGeometry{
    constructor(width = 1, height = 1, depth = 1){
    super();
    this.parameters = {
        width:width,
        height:height,
        depth:depth
    }
    let w2 = width/2,h2 = height/2,d2 = depth/2;
    let pts = new Float32Array([
         w2,-h2, d2,
         w2, h2, d2,
         w2, h2,-d2,
         w2,-h2,-d2,
        -w2,-h2, d2,
        -w2, h2, d2,
        -w2, h2,-d2,
        -w2,-h2,-d2,
        -w2, h2, d2,
        -w2, h2,-d2,
         w2, h2,-d2,
         w2, h2, d2,
        -w2,-h2, d2,
        -w2,-h2,-d2,
         w2,-h2,-d2,
         w2,-h2, d2,
        -w2,-h2, d2,
        -w2, h2, d2,
         w2, h2, d2,
         w2,-h2, d2,
        -w2,-h2,-d2,
        -w2, h2,-d2,
         w2, h2,-d2,
         w2,-h2,-d2
     ]);
     let ind = new Uint16Array([
        2,1,0,
        3,2,0,
        7,5,6,
        5,7,4,
        10,9,8,
        8,11,10,
        13,14,15,
        13,15,12,
        18,17,16,
        16,19,18,
        23,21,22,
        20,21,23
    ]);
    let uvs = new Float32Array([
        0,0,
        0,1,
        1,1,
        1,0,
        0,0,
        0,1,
        1,1,
        1,0,
        0,0,
        0,1,
        1,1,
        1,0,
        0,0,
        0,1,
        1,1,
        1,0,
        0,0,
        0,1,
        1,1,
        1,0,
        0,0,
        0,1,
        1,1,
        1,0,
    ])
    let normals = new Float32Array(pts);
    this.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
    this.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
    this.normalizeNormals();
    this.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
    this.setIndex(new THREE.Uint16BufferAttribute(ind,1));
    this.addGroup(0,6,0);
    this.addGroup(6,6,1);
    this.addGroup(12,6,2);
    this.addGroup(18,6,3);
    this.addGroup(24,6,4);
    this.addGroup(30,6,5);
    }
}
export {BoxBufferGeometry};