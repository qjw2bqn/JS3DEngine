import {Shape} from './Shape.js';
import {ConeBufferGeometry} from '../Geometries/ConeBufferGeometry.js';
class ConeShape extends Shape{
    /**
     * 
     * @param {Object} parameters 
     * @param {THREE.ConeBufferGeometry} [parameters.geometry]
     * @param {THREE.Material} [parameters.material]
     * @param {Object} [parameters.coneOptions]
     * @param {Number} [parameters.coneOptions.height]
     * @param {Number} [parameters.coneOptions.radius]
     * @param {Number} [parameters.coneOptions.radialSegments]
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        let geometry = parameters.geometry;
        let cOps = parameters.coneOptions;
        if(geometry!=undefined){

        }else{
            if(cOps!=undefined){
                geometry = new ConeBufferGeometry(cOps.radius,cOps.height,cOps.widthSegments);
            }else{
                geometry = new ConeBufferGeometry()
            }
        }
        this.geometry = geometry;
        this.physicsBodyShape = new Ammo.btConeShape(this.geometry.parameters.radius,this.geometry.parameters.height);
        this.physicsBodyShape.setMargin(0.05);
    }
}
export {ConeShape};