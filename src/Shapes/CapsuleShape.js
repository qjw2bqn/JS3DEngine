import { Shape } from "./Shape.js";
import {CapsuleBufferGeometry} from "../Geometries/CapsuleBufferGeometry.js";
class CapsuleShape extends Shape{
    /**
     * 
     * @param {Object} parameters
     * @param {Number} parameters.radius
     * @param {Number} parameters.height
     * @param {Number} parameters.heightSegments
     * @param {Number} parameters.widthSegments
     * @param {THREE.Material} parameters.material
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        let rad = parameters.radius||1;
        let height = parameters.height||1;
        let material = parameters.material||new THREE.MeshBasicMaterial;
        let heightSegments = parameters.heightSegments||4;
        let widthSegments = parameters.widthSegments||12;
        this.geometry = new CapsuleBufferGeometry(rad,rad,height,widthSegments,1,heightSegments,heightSegments);
        this.material = material;
        this.physicsBodyShape = new Ammo.btCapsuleShape(rad,height);
        this.physicsBodyShape.setMargin(0.05);
    }
}
export {CapsuleShape};