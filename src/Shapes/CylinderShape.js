import {Shape} from './Shape.js';
import {CylinderBufferGeometry} from '../Geometries/CylinderBufferGeometry.js';
class CylinderShape extends Shape{
    /**
     * 
     * @param {Object} parameters 
     * @param {THREE.CylinderBufferGeometry} [parameters.geometry]
     * @param {THREE.Material} [parameters.material]
     * @param {Object} [parameters.cylinderOptions]
     * @param {Number} [parameters.cylinderOptions.height]
     * @param {Number} [parameters.cylinderOptions.radius]
     * @param {Number} [parameters.cylinderOptions.radialSegments]
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        let geom = parameters.geometry;
        let cylOptions = parameters.cylinderOptions;
        if(geom!=undefined){

        }else{
            if(cylOptions!=undefined){
                geom = new CylinderBufferGeometry(cylOptions.radius,cylOptions.height,cylOptions.radialSegments);
            }else{
                geom = new CylinderBufferGeometry();
            }
        }
        this.geometry = geom;
        // this.geometry = parameters.geometry||new CylinderBufferGeometry()
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        this.physicsBodyShape = new Ammo.btCylinderShape(new Ammo.btVector3(this.geometry.parameters.radiusTop||this.geometry.parameters.radius,this.geometry.parameters.height/2,this.geometry.parameters.radiusTop||this.geometry.parameters.radius));
        this.physicsBodyShape.setMargin(0.05);
    }
}
export {CylinderShape};