import {Shape} from './Shape.js';
class SphereShape extends Shape{
    /**
     * 
     * @param {Object} parameters 
     * @param {THREE.SphereBufferGeometry} [parameters.geometry]
     * @param {THREE.Material} [parameters.material]
    */
   constructor(parameters){
       super();
        parameters = parameters||{};
        this.geometry = parameters.geometry||new THREE.SphereBufferGeometry();
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        this.physicsBodyShape = new Ammo.btSphereShape(this.geometry.parameters.radius);
        this.physicsBodyShape.setMargin(0.05);

   }
}
export {SphereShape};