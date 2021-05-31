import { Shape } from "./Shape.js";
class ConvexPolyhedron extends Shape{
    /**
     * 
     * @param {Object} parameters
     * @param {THREE.BufferGeometry} parameters.geometry
     * @param {THREE.Material} parameters.material 
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        this.geometry = parameters.geometry;
        if(this.geometry==undefined||!this.geometry instanceof THREE.BufferGeometry){
            console.error("JS3D.ConvexPolyhedron: A geometry must be inputted to make a trimesh out of");
            return false;
        }
        if(this.geometry.index==undefined){
            console.error('JS3D.ConvexPolyhedron: The geometry needs to have an index so the program knows what to make a face out of');
            return false;
        }
        let positionArr = this.geometry.attributes.position.array;
        let triPt1 = new Ammo.btVector3();
        this.physicsBodyShape = new Ammo.btConvexHullShape();
        for(let x = 0;x<positionArr.length;x+=3){
            triPt1.setValue(positionArr[x],positionArr[x+1],positionArr[x+2]);
            this.physicsBodyShape.addPoint(triPt1);
        }
        this.physicsBodyShape.setMargin(0.05);
    }
}
export {ConvexPolyhedron};