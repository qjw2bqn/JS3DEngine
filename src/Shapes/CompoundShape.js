import {Shape} from './Shape.js';
import { Transform } from "../Math/Transform.js";
class CompoundShape extends Shape{
    /**
     * 
     * @param {Object} parameters
     * @param {Array<Shape>} parameters.shapes
     * @param {Array<Transform>} parameters.transforms
     * @param {Array<Number>} [parameters.masses]
     * @param {THREE.Material} [parameters.material] 
     */
    constructor(parameters){
        super();
        let shapes = parameters.shapes;
        let transforms = parameters.transforms;
        if(shapes==undefined||!shapes instanceof Array){
            console.warn('JS3DAmmo.CompoundShape: must input an array of shapes');
            return;
        }
        if(transforms==undefined||!transforms instanceof Array){
            console.warn('JS3DAmmo.CompoundShape: must input an array of transforms');
            return;
        }
        let geoms = [];
        this.physicsBodyShape = new Ammo.btCompoundShape();
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        this.mass = 0;
        let lI = new Ammo.btVector3(0,0,0);
        let trans = new Ammo.btTransform();
        let vec = new Ammo.btVector3();
        let quat = new Ammo.btQuaternion();
        trans.setIdentity();
        for(var x = 0;x<shapes.length;x++){
            let t = transforms[x];
            let pos = t.position;
            let q = t.rotation;
            quat.setValue(q.x,q.y,q.z,q.z);
            vec.setValue(pos.x,pos.y,pos.z);
            trans.setOrigin(vec);
            trans.setRotation(quat);
            let s = shapes[x];
            let g = s.geometry;
            let mat = new THREE.Matrix4();
            mat.makeRotationFromQuaternion(q);
            mat.setPosition(pos.x,pos.y,pos.z);
            g.applyMatrix4(mat);
            s.physicsBodyShape.calculateLocalInertia(parameters.masses[x]||1,lI);
            this.mass+=parameters.masses[x]||1;
            this.physicsBodyShape.addChildShape(trans,s.physicsBodyShape);
            geoms.push(g);
        }
        this.geometry = BufferGeometryUtils.mergeBufferGeometries(geoms,true);
    }
}
export {CompoundShape};