import { RigidBody } from '../RigidBodies/RigidBody.js';
import { Vector3 } from '../Math/Vector3.js';
import { Character } from '../RigidBodies/Character';
class World{
    /**
     * 
     * @param {Object} parameters 
     * @param {Vector3} parameters.gravity
     * @param {HTMLElement} parameters.target
     * @param {Object} parameters.rendererSettings
     */
    constructor(parameters){
        parameters = parameters||{};
    this.gravity = parameters.gravity||new Vector3(0,-9.8,0);
    Object.defineProperty(this,'target',{value:parameters.target||document.body});
    let backgroundColor = parameters.backgroundColor||0x000000;
    this.veiw = 0;
    this.debug = false;
    let width = 0;
    let height = 0;
    this._tmpTrans = new Ammo.btTransform();
    this.telePortPlane;
    if(this.target==document.body){
      width = window.innerWidth;
      height = window.innerHeight;
    }else{
      width = target.clientWidth;
      height = target.clientHeight;
    }
    this.cameras = [new THREE.PerspectiveCamera(75,width/height,0.1,20000)];
    this.cameras[0].position.set(0,5,10);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(backgroundColor);
    this.cameras[0].lookAt(this.scene.position);
    
    let collisionConfiguration,
    dispatcher,
    overlappingPairCache = new Ammo.btDbvtBroadphase(),
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    this.aWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher,overlappingPairCache,solver,collisionConfiguration);
    this.aWorld.setGravity(new Ammo.btVector3(this.gravity.x,this.gravity.y,this.gravity.z));
    // this.gravity.copy(this.aWorld.getGravity());
    this.renderer = new THREE.WebGLRenderer(parameters.rendererSettings);
    this.renderer.setSize(width,height);
    this.target.appendChild(this.renderer.domElement);
    this.bodies = [];
    this.kBodies = [];
    this.characterController = null;
    this.debugGroup = new THREE.Group();
    this.scene.add(this.debugGroup);
    }
    /**
    * @param {RigidBody} body 
    */
    add(body){
        if(body == undefined){
            console.error('JS3D.World: World.add should have an argument');
            return false;
        }
        if(!body instanceof RigidBody){
            console.error("JS3D.World: World.add's argument should be a JS3D.Body");
            return false;
        }
        if(body.physicsBody.isKinematicObject()){
            console.error("JS3D.World: World.add should not have a kinematic body");
            this.addKinematicBody(body);
            return false;
        }
        let physBod = body.physicsBody;
        let mesh = body.mesh;
        this.aWorld.addRigidBody(physBod,body.group,body.mask);
        this.scene.add(mesh);
        this.bodies.push(body);
    }
    
    /**
     * @param {RigidBody} kineBody
     */
    addKinematicBody(kineBody){
        if(kineBody == undefined){
            console.error('JS3D.World: World.addKinematicBody should have an argument');
            return false;
        }
        if(!(kineBody instanceof RigidBody)||kineBody instanceof Character){
            console.error("JS3D.World: World.AddKinematicBody's argument should be a JS3D.RigidBody, but not a character");
            return false;
        }
        if(!kineBody.physicsBody.isKinematicObject()){
            console.error('JS3D.World: World.addKinematicBody should have a Kinematic Body');
            this.add(body);
            return false;
        }
        this.kBodies.push(kineBody);
        this.aWorld.addRigidBody(kineBody.physicsBody);
        this.scene.add(kineBody.mesh);
        this.debugGroup.add(kineBody.debugBody);
    }
    /**
     * 
     * @param {RigidBody} body 
     */
    remove(body){
        if(body == undefined){
            console.error('JS3D.World: World.remove should have an argument');
            return false;
        }
        if(!body instanceof RigidBody){
            console.error("JS3D.World: World.remove's argument should be a JS3D.Body");
            return false;
        }
        this.aWorld.removeRigidBody(body.physicsBody);
        this.scene.remove(body.mesh);
        this.debugGroup.remove(body.debugBody);
        this.bodies.splice(this.bodies.indexOf(body),1);
    }
    
    /**
     * @param {Number} yV
     * @param {function} onTeleport
     */
    setTeleportPlane(yV,onTeleport){
        this.telePortPlane = {};
        this.telePortPlane.yValue = yV||-10;
        if(typeof onTeleport!='function'){
            console.error('JS3D.World: World.setTeleportPlane onTeleportPlane callback must be a function');
            this.telePortPlane = undefined;
            return false;
        }
        this.telePortPlane.onTeleport = onTeleport;
    }
    /**
     * @param {Number} dt
     */
    update(dt){
        this.aWorld.stepSimulation(dt||1/60,10);
        for(let x in this.bodies){
            let ammoObj = this.bodies[x].physicsBody;
            let threeObj = this.bodies[x].mesh;
            let ms = ammoObj.getMotionState();
            if(ms){
                ms.getWorldTransform(this._tmpTrans);
                let p = this._tmpTrans.getOrigin();
                let q = this._tmpTrans.getRotation();
                if(this.debug){
                    if(!(this.bodies[x].debugBody.parent===this.debugGroup)){
                        this.debugGroup.add(this.bodies[x].debugBody);
                        this.bodies[x].debugBody.position.set(p.x(),p.y(),p.z());
                        this.bodies[x].debugBody.quaternion.set(q.x(),q.y(),q.z(),q.w());
                    }else{
                        this.bodies[x].debugBody.position.set(p.x(),p.y(),p.z());
                        this.bodies[x].debugBody.quaternion.set(q.x(),q.y(),q.z(),q.w());
                    }
                    if(this.bodies[x].debugBody.material!=undefined){
                        if(!ammoObj.isActive()&&(!ammoObj.isStaticOrKinematicObject())){
                            this.bodies[x].debugBody.material.color = new THREE.Color(0xffff00);
                        }else{
                            this.bodies[x].debugBody.material.color = new THREE.Color(0x00ff00);
                        }
                    }else{
                        
                    }
                }
                if(!this.bodies[x].gravityAffected){
                    let m = this.bodies[x].mass;
                    this.bodies[x].physicsBody.applyCentralForce(new Ammo.btVector3(this.gravity.x*-m,this.gravity.y*-m,this.gravity.z*-m));
                }
                if(this.telePortPlane!=undefined){
                    if(p.y()<this.telePortPlane.yValue){
                        this.telePortPlane.onTeleport(this.bodies[x]);
                    }
                }
                    if(isNaN(p.x())||isNaN(p.y())||isNaN(p.z())||isNaN(q.x())||isNaN(q.w())||isNaN(q.y())||isNaN(q.z())){
                        threeObj.position.set(0,0,0);
                        threeObj.quaternion.set(0,0,0,1);
                    }else{
                        threeObj.position.set(p.x(),p.y(),p.z());
                        threeObj.quaternion.set(q.x(),q.y(),q.z(),q.w());
                    }
                }
        }
        if(this.characterController){
            this.characterController.updatePosition();
        }
        for(var a in this.kBodies){
            let ammo = this.kBodies[a].physicsBody;
            let ms = ammo.getMotionState();
            if(ms){
                this._tmpTrans.setIdentity();
                let kP = this.kBodies[a].mesh.position;
                let kR = this.kBodies[a].mesh.quaternion;
                this._tmpTrans.setOrigin(new Ammo.btVector3(kP.x,kP.y,kP.z));
                this._tmpTrans.setRotation(new Ammo.btQuaternion(kR.x,kR.y,kR.z,kR.w));
                ms.setWorldTransform(this._tmpTrans);
                let d = this.kBodies[a].debugBody;
                d.position.copy(kP);
                d.quaternion.copy(kR);
            }
        }
        this.debugGroup.visible = this.debug;
        this.renderer.render(this.scene,this.cameras[this.veiw]);
    }
    /**
     * @param {THREE.Camera} camera
     */
    addCamera(camera){
        if(camera.isPerspectiveCamera||camera.isOrthographicCamera){
            this.cameras.push(camera);
        }else{
            if(camera.isCamera){
                console.error('JS3D.World: World.addCamera currently only has support for perspective cameras and orthographic cameras');
            }else if(!camera.isCamera){
                console.error('JS3D.World: World.addCamera must have a camera as an argument')
            }else if(camera==undefined){
                console.warn('JS3D.World: World.addCamera had no arguments');
            }
        }
    }
    resizeVeiwingWindow(){
        let width,height;
        if(this.target==document.body){
            width = window.innerWidth;
            height = window.innerHeight;
        }else{
            width = this.target.clientWidth;
            height = this.target.clientHeight;
        }
        for(var x in this.cameras){
            if(this.cameras[x].isPerspectiveCamera){
                this.cameras[x].aspect = width/height;
                this.cameras[x].updateProjectionMatrix();
            }else if(this.cameras[x].isOrthographicCamera){
                let cam = this.cameras[x];
                cam.left = -width/2;
                cam.right = width/2;
                cam.top = height/2;
                cam.bottom = -height/2;
                cam.updateProjectionMatrix();
            }
        }
        this.renderer.setSize(width,height);
    }
}