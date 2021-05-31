import { RigidBody } from "./RigidBody.js";
import { Vector3 } from "../Math/Vector3.js";

class InfPlane extends RigidBody{
    /**
     * 
     * @param {Object} parameters 
     * @param {Vector3} parameters.normal
     * @param {Number} parameters.distance
     * @param {THREE.Material} parameters.material
     * @param {Number} parameters.meshWidth
     * @param {Number} parameters.meshHeight
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        let normal = parameters.normal||new Vector3(0,1,0);
        let distance = parameters.distance||1;
        let material = parameters.material||new THREE.MeshBasicMaterial();
        normal.normalize();
        let tN = new THREE.Vector3().copy(normal);
        let iPlaneBodyS = new Ammo.btStaticPlaneShape(new Ammo.btVector3(tN.x,tN.y,tN.z),distance);
        let iPT = new Ammo.btTransform();
        iPT.setIdentity();
        iPT.setOrigin(new Ammo.btVector3(0,0,0));
        iPT.setRotation(new Ammo.btQuaternion(0,0,0,1));
        let lI = new Ammo.btVector3(0,0,0);
        iPlaneBodyS.calculateLocalInertia(0,lI);
        let iPrbInfo = new Ammo.btRigidBodyConstructionInfo(0,new Ammo.btDefaultMotionState(iPT),iPlaneBodyS,lI);
        this.physicsBody = new Ammo.btRigidBody(iPrbInfo);
        let dG = new THREE.PlaneBufferGeometry(parameters.meshWidth||50,parameters.meshHeight||50,15,15);
        let aQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),tN.normalize());
        dG.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(aQ));
        tN.multiplyScalar(distance);
        dG.translate(tN.x,tN.y,tN.z);
        let debgBdy = new THREE.Mesh(dG,new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}));
        tN.copy(normal);
        let arr = new THREE.ArrowHelper(tN.clone(),tN.multiplyScalar(distance),10);
        tN.copy(normal);
        this.debugBody = new THREE.Group();
        this.debugBody.add(arr);
        this.debugBody.add(debgBdy);
        this.mesh = new THREE.Mesh(dG,material);
    }
}
export {InfPlane};