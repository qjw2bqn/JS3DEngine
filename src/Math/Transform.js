import {Vector3} from './Vector3.js';
import {Quaternion} from './Quaternion';
class Transform{
    /**
     * 
     * @param {Vector3} position 
     * @param {Quaternion} rotation 
     */
    constructor(position = new Vector3(),rotation = new Quaternion()){
        this.position = position;
        this.rotation = rotation;
    }
    /**
     * 
     * @param {Transform} t 
     */
    copy(t){
        if(transform instanceof Ammo.btTransform){
            this.position.copy(t.getOrigin());
            this.rotation.copy(t.getRotation());
        }else{
            this.position.copy(t.position);
            this.rotation.copy(t.rotation);
        }
    }
    /**
     * 
     * @param {Number} px 
     * @param {Number} py 
     * @param {Number} pz 
     * @param {Number} qx 
     * @param {Number} qy 
     * @param {Number} qz 
     * @param {Number} qw 
     */
    set(px,py,pz,qx,qy,qz,qw){
        this.position.set(px,py,pz);
        this.rotation.set(qx,qy,qz,qw);
    }
    clone(){
        return new this.constructor(this.position,this.rotation);
    }
    /**
     * 
     * @param {Boolean} rotation 
     * @param {Boolean} position 
     */
    normalize(rotation = true,position = false){
        if(rotation===true) this.rotation.normalize();
        if(position===true) this.position.normalize();
    }

}
export {Transform};