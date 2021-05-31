class CylinderBufferGeometry extends THREE.BufferGeometry{
    constructor(radius = 1, height = 1, radialSegments = 8){
        super();
        radialSegments = Math.floor(Math.max(radialSegments,3));
        this.parameters = {
            radius:radius,
            height:height,
            radialSegments:radialSegments
        }
        let positions = [];
        let normals = [];
        let uvs = [];
        let index = [];
        let indTop = [];
        let indBot = [];
        let vec = new THREE.Vector3();
        for(var x = 0,lowerInd = 0,upperInd = 1;x<radialSegments+2;x++,lowerInd+=2,upperInd+=2){
            let xV = Math.cos(x*(2*Math.PI/radialSegments))*radius;
            let zV = Math.sin(x*(2*Math.PI/radialSegments))*radius;
            vec.set(xV,height/2,zV);
            positions[lowerInd*3] = vec.x;
            positions[lowerInd*3+1] = vec.y;
            positions[lowerInd*3+2] = vec.z;
            vec.normalize();
            normals[lowerInd*3] = vec.x;
            normals[lowerInd*3+1] = vec.y;
            normals[lowerInd*3+2] = vec.z;
            vec.set(xV,-height/2,zV);
            positions[upperInd*3] = vec.x;
            positions[upperInd*3+1] = vec.y;
            positions[upperInd*3+2] = vec.z;
            vec.normalize();
            normals[upperInd*3] = vec.x;
            normals[upperInd*3+1] = vec.y;
            normals[upperInd*3+2] = vec.z;
            let u = x/radialSegments;
            let v = 0;
            let v2 = 1;
            uvs.push(u,v,u,v2);
            if(x==radialSegments){
                index.push(upperInd-2,lowerInd-2,1);
                index.push(lowerInd-2,0,1);
            }else if(x>0){
                index.push(lowerInd-2,upperInd,upperInd-2);
                index.push(lowerInd,upperInd,lowerInd-2);
            }
        };
        positions.push(0,height/2,0);
        positions.push(0,-height/2,0);
        normals.push(0,1,0);
        normals.push(0,-1,0);
        let oL = parseInt(positions.length.toString(),10)/3;
        for(var x = 0,lowerInd = oL,upperInd = oL+1;x<=radialSegments+1;x++,lowerInd+=2,upperInd+=2){
            let xV = Math.cos(x*2*Math.PI/radialSegments)*radius;
            let zV = Math.sin(x*2*Math.PI/radialSegments)*radius;
            let yV = height/2;
            let y2V = -height/2;
            positions.push(xV,yV,zV);
            positions.push(xV,y2V,zV);
            let l =Math.sqrt( xV**2+yV**2+zV**2);
            normals.push(xV*(1/l),yV*(1/l),zV*(1/l));
            normals.push(xV*(1/l),y2V*(1/l),zV*(1/l));
            let u = Math.cos(x/radialSegments*2*Math.PI)*0.5+0.5;
            let v = Math.sin(x/radialSegments*2*Math.PI)*0.5+0.5;
            uvs.push(v,u,v,u);
            if(x==radialSegments){
                indTop.push(lowerInd-2,oL-2,0);
                indBot.push(1,oL-1,upperInd-2);
            }else if(x>0){
                indBot.push(upperInd,oL-1,upperInd-2);
                indTop.push(lowerInd-2,oL-2,lowerInd);
            }
        }
        index = index.concat(indTop,indBot);
        this.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(positions),3));
        this.setAttribute('normal',new THREE.Float32BufferAttribute(new Float32Array(normals),3));
        this.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(uvs),2));
        this.setIndex(new THREE.Uint16BufferAttribute(new Uint16Array(index),1));
        this.addGroup(0,oL*3-9,0);
        this.addGroup(oL*3-9,indTop.length-3,1);
        this.addGroup(oL*3+indTop.length-9,indBot.length+6,2);
    }
}
export {CylinderBufferGeometry};