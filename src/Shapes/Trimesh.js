import { Shape } from "./Shape.js";
class Trimesh extends Shape{
    /**
     * 
     * @param {Object} parameters 
     * @param {THREE.Material} [parameters.material]
     * @param {THREE.BufferGeometry} parameters.geometry
     * @param {Boolean} [parameters.dynamic]
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        this.geometry = parameters.geometry;
        let dynamic = parameters.dynamic||false;
        if(this.geometry==undefined||!this.geometry instanceof THREE.BufferGeometry){
            console.error("JS3D.Trimesh: A geometry must be inputted to make a trimesh out of");
            return false;
        }
        if(this.geometry.index==undefined){
            console.error('JS3D.Trimesh: The geometry needs to have an index so the program knows what to make a face out of');
            return false;
        }
        let trimeshPhysicsBodyTMeshBuild = new Ammo.btTriangleMesh();
        let faces = this.geometry.index.array;
        let pos = this.geometry.attributes.position.array;
        let triPt1 = new Ammo.btVector3();
        let triPt2 = new Ammo.btVector3();
        let triPt3 = new Ammo.btVector3();
        for(let x = 0;x<faces.length;x+=3){
            triPt1.setValue(pos[faces[x]*3],pos[faces[x]*3+1],pos[faces[x]*3+2]);
            triPt2.setValue(pos[faces[x+1]*3],pos[faces[x+1]*3+1],pos[faces[x+1]*3+2]);
            triPt3.setValue(pos[faces[x+2]*3],pos[faces[x+2]*3+1],pos[faces[x+2]*3+2]);
            trimeshPhysicsBodyTMeshBuild.addTriangle(triPt1,triPt2,triPt3,true);
        }
        let pBS = new Ammo.btBvhTriangleMeshShape(trimeshPhysicsBodyTMeshBuild,dynamic,true);
        pBS.setMargin(0.05);
        if(dynamic==true){
            this.physicsBodyShape = new Ammo.btCompoundShape();
            let t = new Ammo.btTransform();
            t.setIdentity();
            t.setOrigin(new Ammo.btVector3(0,0,0));
            t.setRotation(new Ammo.btQuaternion(0,0,0,1));
            this.physicsBodyShape.addChildShape(t,pBS);
        }else{
            this.physicsBodyShape = pBS;
        }
    }
}
export {Trimesh};