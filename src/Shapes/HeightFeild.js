import {Shape} from './Shape.js';
class HeightFeild extends Shape{
    /**
     * 
     * @param {Object} parameters 
     * @param {Array<Number>} parameters.heightData - can also be parameters.data
     * @param {THREE.Material} parameters.material
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        let heightData = parameters.heightData||parameters.data;
        if(heightData==undefined||!heightData instanceof Array){
            console.error('JS3D.HeightFeild: HeightData must be an array of heights');
            return false;
        }
        let maxHeight = Math.max(...heightData);
        let minHeight = Math.min(...heightData);
        let width = parameters.width;
        let height = parameters.height;    
        let size = heightData.length;
        let ptr = Ammo._malloc(4*width*height);
        let flipQuatEdges = parameters.flip||parameters.flipQuatEdges||false;
        let elemSize = parameters.elemSize||parameters.size||1;
        for(let f = 0,fMax = size;f<fMax;f++){
            Ammo.HEAPF32[(ptr>>2)+f] = heightData[f];
        }
        this.physicsBodyShape = new Ammo.btHeightfieldTerrainShape(width,height,ptr,1,minHeight,maxHeight,1,0,flipQuatEdges);
        this.physicsBodyShape.setLocalScaling(new Ammo.btVector3(elemSize,elemSize,elemSize));
        let geo = new THREE.PlaneBufferGeometry(width,height,width-1,height-1);
        geo.rotateX(-Math.PI/2);
        let pts = geo.attributes.position.array;
        for ( var i = 0, j = 0, l = pts.length; i < l; i ++, j += 3 ) {
            // j + 1 because it is the y component that we modify
            pts[ j + 1 ] = heightData[ i ];
        }
        geo.translate(0,-(maxHeight+minHeight)/2,0);
        geo.computeVertexNormals();
        geo.computeFaceNormals();
        geo.scale(elemSize,elemSize,elemSize);
        this.geometry = geo;
        this.material = parameters.material||new THREE.MeshBasicMaterial();
    }
}
export {HeightFeild};