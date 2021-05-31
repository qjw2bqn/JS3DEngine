import {Shape} from './Shape.js';
import {Vector3} from '../Math/Vector3.js';
import {BoxBufferGeometry} from '../Geometries/BoxBufferGeometry.js';
class BoxShape extends Shape{
    /**
     * 
     * @param {Object} parameters 
     * @param {Vector3} [parameters.halfExtents]
     * @param {THREE.Material} [parameters.material]
     * @param {Boolean} [parameters.flatShading]
     * @param {BoxBufferGeometry|THREE.BoxBufferGeometry} [parameters.geometry]
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        let halfExtents = parameters.halfExtents||new Vector3(0.5,0.5,0.5);
        let geom = parameters.geometry;
        let fs;
        if(parameters.flatShading==undefined){
            fs = true;
        }else{
            fs = parameters.flatShading;
        }
        let w2 = halfExtents.x,h2 = halfExtents.y,d2 = halfExtents.z;
        if(geom!=undefined){
            w2 = geom.parameters.width/2;
            h2 = geom.parameters.height/2;
            d2 = geom.parameters.depth/2;
            this.geometry = geom;
        }else{
            this.geometry = new BoxBufferGeometry(w2*2,h2*2,d2*2);
        }
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        if(this.material.flatShading!=undefined){
            this.material.flatShading = fs;
            this.material.needsUpdate = true;
        }
        this.physicsBodyShape = new Ammo.btBoxShape(new Ammo.btVector3(w2,h2,d2));
        this.physicsBodyShape.setMargin(0.05);
    }
}
export {BoxShape};