class ConeBufferGeometry extends THREE.BufferGeometry{
    constructor(radius = 1,height = 1,widthSegments = 8){
        super();
        widthSegments = Math.floor(Math.max(widthSegments,3))
        this.parameters = {
            radius:radius,
            height:height,
            widthSegments:widthSegments
        }
        let positions = [0,height/2,0,0,-height/2,0];
        let normals = [0,1,0,0,-1,0];
        let index = [];
        let indTyp2 = [];
        let uvs = [];
        let point = new THREE.Vector3();
        for(var x = 0,ind = 2;x<=widthSegments+2;x++,ind++){
            let xVpt = Math.cos(x*(2*Math.PI/widthSegments))*radius;
            let zVpt = Math.sin(x*(2*Math.PI/widthSegments))*radius;
            point.set(xVpt,-height/2,zVpt);
            positions[ind*3] = point.x;
            positions[ind*3+1] = point.y;
            positions[ind*3+2] = point.z;
            point.normalize();
            normals[ind*3] = point.x;
            normals[ind*3+1] = point.y;
            normals[ind*3+2] = point.z;
            xVpt/=radius;
            zVpt/=radius;
            xVpt*=0.5;
            zVpt*=0.5;
            xVpt+=0.5;
            zVpt+=0.5;
            uvs.push(xVpt,zVpt);
            if(ind<=2){
    
            }else if(ind==widthSegments+2){
                index.push(ind-1,0,2);
            }else{
                index.push(ind-1,0,ind);
            }
        }
        let oI = positions.length/3;
        for(var x = 0,ind = oI*1;x<=widthSegments+2;x++,ind++){
            let xVpt = Math.cos(x*(2*Math.PI/widthSegments))*radius;
            let zVpt = Math.sin(x*(2*Math.PI/widthSegments))*radius;
            point.set(xVpt,-height/2,zVpt);
            positions[ind*3] = point.x;
            positions[ind*3+1] = point.y;
            positions[ind*3+2] = point.z;
            point.normalize();
            normals[ind*3] = point.x;
            normals[ind*3+1] = point.y;
            normals[ind*3+2] = point.z;
            xVpt/=radius;
            zVpt/=radius;
            xVpt*=0.5;
            zVpt*=0.5;
            xVpt+=0.5;
            zVpt+=0.5;
            uvs.push(xVpt,zVpt);
            if(x<=2){
    
            }else{
                indTyp2.push(ind,1,ind-1);
            }
        }
        let oL = index.length*1;
        index = index.concat(indTyp2);
        this.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(positions),3))
        this.setAttribute('normal',new THREE.Float32BufferAttribute(new Float32Array(normals),3));
        this.setIndex(new THREE.Uint16BufferAttribute(new Uint16Array(index),1));
        this.addGroup(0,oL,0);
        this.addGroup(oL,indTyp2.length,1);
    }
}
export {ConeBufferGeometry};