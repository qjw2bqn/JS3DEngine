import { Body } from '../RigidBodies/Body.js';
import { Character } from "../RigidBodies/Character.js";
class CharacterController{
    /**
     * 
     * @param {Object} parameters 
     * @param {Character|Body} parameters.character
     * @param {THREE.Camera} parameters.camera
     * @param {Number} [parameters.moveSpeed]
     * @param {Boolean} [parameters.fixedCam]
     * @param {Boolean} [parameters.firstPerson]
     * @param {Number} [parameters.yOffset]
     */
    constructor(parameters){
        parameters = parameters||{};
        this.character = parameters.character;
        this.camera = parameters.camera;
        this.moveSpeed = parameters.moveSpeed||10;
        this.fixedCam = parameters.fixedCam||false;
        this.firstPerson = parameters.firstPerson||false;
        if(!this.fixedCam&&this.firstPerson){
            if(this.character instanceof Body){
                this.cameraYOffset = parameters.yOffset||0;
            }else{
                this.cameraYOffset = parameters.yOffset||this.character.physicsShape.getHalfHeight();
            }
        }else{
            this.cameraYOffset = 0;
        }
        if(this.character == undefined||!(this.character instanceof Body||this.character instanceof Character)){
            console.error("JS3D.CharacterController: Must have a JS3D.Character or JS3D.Body type");
            return false;
        }
        if(this.camera == undefined||!this.camera instanceof THREE.Camera){
            console.error("JS3D.CharacterController: Must have a THREE.Camera");
            return false;
        }
        this.moveDir = {left:false,right:false,forward:false,backward:false,ableJump:false};
        Object.defineProperties(this,{
            _camDir:{value:new THREE.Vector3()},
            _tmpTrans:{value:new Ammo.btTransform()},
            _rotatAxis:{value:new THREE.Vector3(0,1,0)},
            _moveAmt:{value:new THREE.Vector3()},
        _prevPosition:{value:new THREE.Vector3()},
        _tmpTrans:{value:new Ammo.btTransform()}
        })
        
        this._prevPosition.copy(this.character.mesh.position);
    }
    forward(){
        this.camera.getWorldDirection(this._camDir);
        this._camDir.y = 0;
        this._camDir.normalize();
        this._moveAmt.add(this._camDir);    
    }
    backward(){
        this.camera.getWorldDirection(this._camDir);
        this._camDir.y = 0;
        this._camDir.normalize();
        this._camDir.multiplyScalar(-1);
        this._moveAmt.add(this._camDir);
    }
    left(){
        this.camera.getWorldDirection(this._camDir);
        this._camDir.y = 0;
        this._camDir.normalize();
        this._camDir.applyAxisAngle(this._rotatAxis,Math.PI/2)
        this._moveAmt.add(this._camDir);
    }
    right(){
        this.camera.getWorldDirection(this._camDir);
        this._camDir.y = 0;
        this._camDir.normalize();
        this._camDir.applyAxisAngle(this._rotatAxis,-Math.PI/2)
        this._moveAmt.add(this._camDir);
    }
    /**
     * @param {Number} keyCode
     * @param {Number} forCode
     * @param {Number} backCode
     * @param {Number} rightCode
     * @param {Number} leftCode
     */
    moveDirUpdateStart(keyCode,forCode,backCode,leftCode,rightCode){
        if(keyCode==forCode){
            this.moveDir.forward = true;
        }
        if(keyCode==backCode){
            this.moveDir.backward = true;
        }
        if(keyCode==leftCode){
            this.moveDir.left = true;
        }
        if(keyCode==rightCode){
            this.moveDir.right = true;
        }
    }
    /**
     * @param {Number} keyCode
     * @param {Number} forCode
     * @param {Number} backCode
     * @param {Number} rightCode
     * @param {Number} leftCode
     */
    moveDirUpdateStop(keyCode,forCode,backCode,leftCode,rightCode){
        if(keyCode==forCode){
            this.moveDir.forward = false;
        }
        if(keyCode==backCode){
            this.moveDir.backward = false;
        }
        if(keyCode==leftCode){
            this.moveDir.left = false;
        }
        if(keyCode==rightCode){
            this.moveDir.right = false;
        }
    }
    updatePosition(){
        if(this.moveDir.forward){
            this.forward();
        }
        if(this.moveDir.backward){
            this.backward();
        }
        if(this.moveDir.left){
            this.left();
        }
        if(this.moveDir.right){
            this.right();
        }
        let ammoObj = this.character.physicsBody;
        let curVel = ammoObj.getLinearVelocity();
        this._moveAmt.multiplyScalar(this.moveSpeed);
        ammoObj.setLinearVelocity(new Ammo.btVector3(this._moveAmt.x,curVel.y(),this._moveAmt.z));
        this._moveAmt.set(0,0,0);
        if(this.firstPerson){
            let pos = ammoObj.getWorldTransform().getOrigin();
            this.camera.position.set(pos.x(),pos.y()+this.cameraYOffset,pos.z());
        };
        let curPos = ammoObj.getWorldTransform().getOrigin();
        if(!this.fixedCam){
            let dif = new THREE.Vector3(curPos.x()-this._prevPosition.x,curPos.y()-this._prevPosition.y,curPos.z()-this._prevPosition.z)
            this.camera.position.add(dif);
            this._prevPosition.set(curPos.x(),curPos.y(),curPos.z());
        }
        this.character.mesh.position.set(curPos.x(),curPos.y(),curPos.z());
        this.character.debugBody.position.copy(this.character.mesh.position);
    }
    /**
     * @param {Number} jumpVelocity
     */
    jump(jumpVelocity){
        let physicsBody = this.character.physicsBody;
        let curVel = physicsBody.getLinearVelocity();
        physicsBody.setLinearVelocity(new Ammo.btVector3(curVel.x(),jumpVelocity,curVel.z()));
    
    }
}
export {CharacterController};