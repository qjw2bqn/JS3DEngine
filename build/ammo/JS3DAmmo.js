(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.JS3DAmmo = {}));
}(this,  (function (exports) { 
/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 */
var Vector3 = function(x,y,z){
    this.x = x||0;
    this.y = y||0;
    this.z = z||0;
    return this;
}
Vector3.prototype.copy = function(v){
    if(typeof v.x == 'function'){
        this.x = v.x();
        this.y = v.y();
        this.z = v.z();
    }else{
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }
    return this;
}
Vector3.prototype.set = function(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
}
Vector3.prototype.add = function(v){
    this.x+=v.x;
    this.y+=v.y;
    this.z+=v.z;
    return this;
};
Vector3.prototype.multiplyScalar = function(scaleFactor){
    this.x*=scaleFactor;
    this.y*=scaleFactor;
    this.z*=scaleFactor;
    return this;
}
Vector3.prototype.lengthSq = function(){
    return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
}
Vector3.prototype.manhattanLength = function(){
    return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z);
}
Vector3.prototype.distanceTo = function(v){
    return Math.sqrt((this.x-v.x)**2+(this.y-v.y)**2+(this.y-v.z)**2);
}
Vector3.prototype.manhattanDistanceTo = function(v){
    return Math.abs(this.x-v.x)+Math.abs(this.y-v.y)+Math.abs(this.z-v.z);
}
Vector3.prototype.normalize = function(){
    let l = this.lengthSq();
    if(l===0){
        this.set(0,0,0);
    }else{
        this.multiplyScalar(1/l);
    }
    return this;
}
Vector3.prototype.setLength = function(length){
    this.normalize();
    this.multiplyScalar(length);
    return this;
}
Vector3.prototype.addScaledVector = function(v,scaleFactor){
    v.multiplyScalar(scaleFactor);
    this.add(v);
    return this;
}
Vector3.prototype.sub = function(v){
    this.x-=v.x;
    this.y-=v.y;
    this.z-=v.z;
    return this;
}
Vector3.prototype.invert = function(){
    this.x*=-1;
    this.y*=-1;
    this.z*=-1;
    return this;
}
Vector3.prototype.clone = function(){
    return new Vector3(this.x,this.y,this.z);
}
Vector3.prototype.isEqualTo = function(v){
    return this.x===v.x&&this.y===v.y&&this.z===v.z;    
}
Vector3.prototype.directionTo = function(v1,v2){
    this.subVectors(v2,v1);
    this.normalize();
    return this;
}
Vector3.prototype.addVectors = function(v1,v2){
    this.x = v1.x+v2.x;
    this.y = v1.y+v2.y;
    this.z = v1.z+v2.z;
}
Vector3.prototype.subVectors = function(v1,v2){
    this.x = v1.x-v2.x;
    this.y = v1.y-v2.y;
    this.z = v1.z-v2.z;
}
Vector3.prototype.toString = function(){
    return '{x:'+this.x+',y:'+this.y+',z:'+this.z+'}';
}
Vector3.prototype.isAlmostEqualTo = function(v,delta){
    return Math.abs(this.x-v.x)<delta&&Math.abs(this.y-v.y)<delta&&Math.abs(this.z-v.z)<delta;
}
Vector3.prototype.dot = function(v){
    return this.x*v.x+this.y*v.y+this.z*v.z;
}
/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z 
 * @param {Number} w 
 */
var Quaternion = function(x,y,z,w){
    this.x = x||0;
    this.y = y||0;
    this.z = z||0;
    this.w = w||1;
}
Quaternion.prototype.set = function(x,y,z,w){
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
}
Quaternion.prototype.copy = function(q){
    if(typeof q.x == 'function'){
        this.set(q.x(),q.y(),q.z(),q.w());
    }else{
        this.set(q.x,q.y,q.z,q.w);
    }
    return this;
}
Quaternion.prototype.setFromAxisAngle = function(axis,angle){
    let a = angle/2,s = Math.sin(a);
    this.x = axis.x * s;
	this.y = axis.y * s;
	this.z = axis.z * s;
	this.w = Math.cos( halfAngle );
}
Quaternion.prototype.dot = function(q){
    return this.x*q.x+this.y*q.y+this.z*q.z+this.w*q.w;
}
Quaternion.prototype.lengthSq = function(){
    return Math.sqrt(this.x**2+this.y**2+this.z**2+this.w**2);
}
Quaternion.prototype.setFromUnitVectors = function(vFrom,vTo){
    let r = vFrom.dot( vTo ) + 1;

		if ( r < Number.EPSILON ) {

			// vFrom and vTo point in opposite directions

			r = 0;

			if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

				this.x = - vFrom.y;
				this.y = vFrom.x;
				this.z = 0;
				this.w = r;

			} else {

				this.x = 0;
				this.y = - vFrom.z;
				this.z = vFrom.y;
				this.w = r;

			}

		} else {

			// crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3

			this.x = vFrom.y * vTo.z - vFrom.z * vTo.y;
			this.y = vFrom.z * vTo.x - vFrom.x * vTo.z;
			this.z = vFrom.x * vTo.y - vFrom.y * vTo.x;
			this.w = r;

		}

		return this.normalize();

}
Quaternion.prototype.normalize = function(){
    let l = this.lengthSq();
    if(l===0){
        this.set(0,0,0,1);
    }else{
        l = 1/l;
        this.x*=l;
        this.y*=l;
        this.z*=l;
        this.w*=l;
    }
}

/**
 * 
 * @param {String} type 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} near 
 * @param {Number} far 
 * @param {Optional Number} fov 
 */
var CameraCreator = function(type,width,height,near,far,fov){
    if(type==undefined){
        console.error('JS3D.CameraCreator: type is not defined');
        return false;
    }
    if(type!='Perspective'&&type!='Orthographic'){
        console.error('JS3D.CameraCreator: We currently only support the ability to make a THREE.PerspectiveCamera or THREE.OrthographicCamera.');
        return false;
    }
    if(width==undefined){
        console.error('JS3D.CameraCreator: please input a width');
        return false;
    }
    if(typeof width!='number'){
        console.error('JS3D.CameraCreator: width parameter must be a number');
        return false;
    }
    if(height==undefined){
        console.error('JS3D.CameraCreator: please input a height');
        return false;
    }
    if(typeof height!='number'){
        console.error('JS3D.CameraCreator: height parameter must be a number');
        return false;
    }
    if(typeof fov!='number'&&fov!=undefined&&type!='Orthographic'){
        console.error('JS3D.CameraCreator: fov parameter must be a number');
        return false;
    }
    if(typeof near!='number'&&near!=undefined){
        console.error('JS3D.CameraCreator: near parameter must be a number');
        return false;
    }
    if(typeof far!='number'&&far!=undefined){
        console.error('JS3D.CameraCreator: far parameter must be a number');
        return false;
    }
    let cam;
    if(type=='Perspective'){
        cam = new THREE.PerspectiveCamera(fov||75,width/height,near||0.1,far||1000);
    }else{
        cam = new THREE.OrthographicCamera();
        cam.left = -width/2;
        cam.right = width/2;
        cam.top = height/2;
        cam.bottom = -height/2;
        cam.near = near||0.1;
        cam.far = far||1000;
    }
    return cam;
}
/**
 * 
 * @param {Object} parameters 
 */
var GravityFeild = function(parameters){
    this.position = parameters.position||new Vector3();
    this.far = parameters.far||20;
    this.strength = parameters.strength||parameters.force||3;
    this._direction = new Vector3();
    this._bodies = [];
    this._AmmoDir = new Ammo.btVector3();
    this.debugBody = new THREE.Mesh(new THREE.SphereBufferGeometry(1,16,16),new THREE.MeshBasicMaterial({color:0x0000ff,wireframe:true}));
    this.debugBody.position.copy(this.position);
    this.debugBody.scale.multiplyScalar(this.far);
}
GravityFeild.prototype.addBody = function(body){
    if(!body instanceof Body){
        console.error('JS3D.GravityFeild: addBody'+"'"+'s argument should be a JS3D.Body');
    }
    this._bodies.push(body);
}
GravityFeild.prototype.update = function(){
    for(var x in this._bodies){
        let pos = this._bodies[x].mesh.position;
        if(this.position.distanceTo(pos)<=this.far){
            this._direction.subVectors(this.position,pos);
            this._direction.normalize();
            this._direction.multiplyScalar(this.strength*-this.position.distanceTo(pos)+this.strength*this.far);
            this._direction.multiplyScalar(this._bodies[x].mass);
            this._AmmoDir.setValue(this._direction.x,this._direction.y,this._direction.z);
            this._bodies[x].physicsBody.applyCentralForce(this._AmmoDir);
        }
    }
}
/**
 * 
 * @param {Object} parameters 
 * @param {Vector3} parameters.gravity
 * @param {HTMLElement} parameters.target
 */
var World = function(parameters){
    parameters = parameters||{};
    this.gravity = parameters.gravity||new Vector3(0,-9.8,0);
    World.prototype.target = parameters.target||document.body;
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
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width,height);
    this.target.appendChild(this.renderer.domElement);
    this.bodies = [];
    this.kBodies = [];
    this.gravityFeilds = [];
    this.characterController = null;
    this.debugGroup = new THREE.Group();
    this.scene.add(this.debugGroup);
}
/**
 * @param {Body} body 
 */
World.prototype.add = function(body){
    if(body == undefined){
        console.error('JS3D.World: World.add should have an argument');
        return false;
    }
    if(!(body instanceof Body||body instanceof Character||body instanceof InfPlane||body instanceof CompundShape)){
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
 * @param {Body} kineBody
 */
World.prototype.addKinematicBody = function(kineBody){
    if(kineBody == undefined){
        console.error('JS3D.World: World.addKinematicBody should have an argument');
        return false;
    }
    if(!(kineBody instanceof Body||body instanceof CompundShape)){
        console.error("JS3D.World: World.AddKinematicBody's argument should be a JS3D.Body");
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
 * @param {Body} body
 */
World.prototype.remove = function(body){
    if(body == undefined){
        console.error('JS3D.World: World.remove should have an argument');
        return false;
    }
    if(!body instanceof Body){
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
World.prototype.setTeleportPlane = function(yV,onTeleport){
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
World.prototype.update = function(dt){
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
                    if(!this.bodies[x] instanceof Character){
                        for(var y in this.bodies[x].debugBody.children){
                            if(!ammoObj.isActive()&&(!ammoObj.isStaticOrKinematicObject())){
                                this.bodies[x].debugBody.children[y].material.color = new THREE.Color(0xffff00);
                            }else{
                                this.bodies[x].debugBody.children[y].material.color = new THREE.Color(0x00ff00);
                            }
                        }
                    }
                }
            }
            if(!this.bodies[x].gravityAffected){
                let m = this.bodies[x].mass;
                world.bodies[x].physicsBody.applyCentralForce(new Ammo.btVector3(this.gravity.x*-m,this.gravity.y*-m,this.gravity.z*-m));
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
    for(var x in this.gravityFeilds){
        this.gravityFeilds[x].update();
        this.gravityFeilds[x].debugBody.scale.set(this.gravityFeilds[x].far,this.gravityFeilds[x].far,this.gravityFeilds[x].far);
        this.gravityFeilds[x].debugBody.position.copy(this.gravityFeilds[x].position);
    }
    this.debugGroup.visible = this.debug;
    this.renderer.render(this.scene,this.cameras[this.veiw]);
}
/**
 * @param {GravityFeild} gravFeild
 */
World.prototype.addGravityFeild = function(gravFeild){
    this.gravityFeilds.push(gravFeild);
    this.debugGroup.add(gravFeild.debugBody);
}
/**
 * @param {Camera} camera
 */
World.prototype.addCamera = function(camera){
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
World.prototype.resizeVeiwingWindow = function(){
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
/**
 * 
 * @param {Object} parameters 
 * @param {BoxShape|SphereShape|CylinderShape|ConeShape|HeightFeild|Trimesh|Plane} parameters.shape
 */
var Body = function(parameters){
    let shape = parameters.shape;
    if(shape==undefined){
        console.error('JS3D.Body: shape must be defined');
        return false;
    }
    if(!(shape instanceof BoxShape||shape instanceof SphereShape||shape instanceof CylinderShape||shape instanceof ConeShape||shape instanceof Trimesh||shape instanceof Plane||shape instanceof HeightFeild)){
        console.error('JS3D.Body: shape must be a type of JS3D.Shape');
        return false;
    }
    let position = parameters.position||new Vector3();
    let rotation = parameters.rotation||parameters.quaternion||new THREE.Quaternion(0,0,0,1);
    let mass = parameters.mass||0;
    let geometry = shape.geometry;
    let material = shape.material;
    this.mass = mass;
    this.gravityAffected = true;
    let physicsShape = shape.physicsBodyShape;
    this.mesh = new THREE.Mesh(geometry,material);
    this.initPosition = position;
    this.initRotation = rotation;
    this.debugBody = shape.debugBody||new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}));
    this.group = parameters.group||parameters.collisionGroup;
    this.mask = parameters.mask||parameters.collisionMask;
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(position.x,position.y,position.z));
    transform.setRotation(new Ammo.btQuaternion(rotation.x,rotation.y,rotation.z,rotation.w));
    let ms = new Ammo.btDefaultMotionState(transform);
    let localInertia = new Ammo.btVector3(0,0,0);
    physicsShape.calculateLocalInertia(mass,localInertia);
    this.shape = shape;
    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass,ms,physicsShape,localInertia);
    this.physicsBody = new Ammo.btRigidBody(rbInfo);
    return this;
}
/**
 * @param {Boolean} cast
 * @param {Boolean} receive
 */
Body.prototype.setShadows = function(cast,receive){
    this.mesh.castShadow = cast||true;
    this.mesh.receiveShadow = receive||true;
}
/**
 * @param {Number} mass
 */
Body.prototype.setMass = function(mass){
    this.physicsBody.setMassProps(mass,new Ammo.btVector3(0,0,0));
}
/**
 * @param {Vector3} scaleVector
 */
Body.prototype.scale = function(scaleVector){
    this.shape.physicsBodyShape.setLocalScaling(new Ammo.btVector3(scaleVector.x,scaleVector.y,scaleVector.z));
    this.debugBody.scale.copy(scaleVector);
    this.mesh.scale.copy(scaleVector);
}
/**
 * 
 * @param {Object} parameters 
 */
var BoxShape = function(parameters){
    parameters = parameters||{};
    let halfExtents = parameters.halfExtents||new Vector3(0.5,0.5,0.5);
    this.material = parameters.material||new THREE.MeshBasicMaterial();
    this.physicsBodyShape = new Ammo.btBoxShape(new Ammo.btVector3(halfExtents.x,halfExtents.y,halfExtents.z));
    this.physicsBodyShape.setMargin(0.05);
    this.geometry = new THREE.BoxBufferGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
    return this;
}
/**
 * 
 * @param {Object} parameters 
 */
var SphereShape = function(parameters){
    parameters = parameters||{};
    this.geometry = parameters.geometry||new THREE.SphereBufferGeometry();
    this.material = parameters.material||new THREE.MeshBasicMaterial();
    this.physicsBodyShape = new Ammo.btSphereShape(this.geometry.parameters.radius);
    this.physicsBodyShape.setMargin(0.05);
    return this;
}
/**
 * 
 * @param {Object} parameters 
 */
var CylinderShape = function(parameters){
    parameters = parameters||{};
    this.geometry = parameters.geometry||new THREE.CylinderBufferGeometry();
    this.material = parameters.material||new THREE.MeshBasicMaterial();
    this.physicsBodyShape = new Ammo.btCylinderShape(new Ammo.btVector3(this.geometry.parameters.radiusTop,this.geometry.parameters.height/2,this.geometry.parameters.radiusTop));
    this.physicsBodyShape.setMargin(0.05);
    return this;
}
/**
 * 
 * @param {Object} parameters 
 */
var Character = function(parameters){
    parameters = parameters||{};
    let height = parameters.height||2;
    let radius = parameters.radius||1;
    let geom = new THREE.BoxBufferGeometry(Math.sqrt((radius**2)*2),height+2*radius,Math.sqrt((radius**2)*2));
    let material = parameters.material||new THREE.MeshBasicMaterial();
    let position = parameters.position||new Vector3();
    Character.prototype.initPosition = position;
    Character.prototype.isCharacter = true;
    let CCD = parameters.continuousCollision||parameters.CCD||false;
    let model = parameters.model;
    let mass;
    this.group = parameters.group||parameters.collisionGroup;
    this.mask = parameters.mask||parameters.collisionMask;
    if(parameters.mass<=0||parameters.mass==undefined){
        mass = 1;
    }else{
        mass = parameters.mass;
    }
    this.mesh = model||new THREE.Mesh(geom,material);
    this.debugBody = new THREE.Group();
    let longBand1S = new THREE.Shape();
    longBand1S.moveTo(-radius,-height/2);
    longBand1S.lineTo(-radius,height/2);
    longBand1S.absarc(0,height/2,radius,Math.PI,0,true);
    longBand1S.moveTo(radius,height/2);
    longBand1S.lineTo(radius,-height/2);
    longBand1S.absarc(0,-height/2,radius,0,Math.PI,true);
    longBand1S.lineTo(-radius,-height/2);
    let geo = new THREE.ShapeGeometry(longBand1S,20);
    let edges = new THREE.EdgesGeometry(geo);
    let longBand1 = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
    let longBand2 = longBand1.clone();
    longBand2.rotation.y = Math.PI/2;
    this.debugBody.add(longBand1);
    this.debugBody.add(longBand2);
    for(let yV = Math.round(-height/2);yV<=Math.round(height/2);yV++){
        let geome = new THREE.CircleGeometry(radius,16);
        let cEdg = new THREE.EdgesGeometry(geome);
        let band = new THREE.LineSegments(cEdg,new THREE.LineBasicMaterial({color:0xffffff}));
        band.position.y = yV;
        band.rotation.x = Math.PI/2;
        this.debugBody.add(band);
    }
    let transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(position.x,position.y,position.z));
    transform.setRotation(new Ammo.btQuaternion(0,0,0,1));
    let ms = new Ammo.btDefaultMotionState(transform);
    this.physicsBodyShape = new Ammo.btCapsuleShape(radius,height);
    this.physicsBodyShape.setMargin(0.05);
    let localInertia = new Ammo.btVector3(0,0,0);
    this.physicsBodyShape.calculateLocalInertia(mass,localInertia);
    let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass,ms,this.physicsBodyShape,localInertia);
    this.physicsBody = new Ammo.btRigidBody(rbInfo);
    this.physicsBody.setAngularFactor(new Ammo.btVector3(0,0,0));
    this.physicsBody.setActivationState(4);
    if(CCD){
        this.physicsBody.setCcdMotionThreshold(1);
        this.physicsBody.setCcdSweptSphereRadius(height/2+radius);
    }
    return this;
}
Character.prototype.gravityAffected = true;
Character.prototype.setShadows = function(cast,receive){
    this.mesh.castShadow = cast||true;
    this.mesh.receiveShadow = receive||true;
}
/**
 * 
 * @param {Object} parameters 
 */
var CharacterController = function(parameters){
    parameters = parameters||{};
    this.character = parameters.character;
    this.camera = parameters.camera;
    this.moveSpeed = parameters.moveSpeed||10;
    this.fixedCam = parameters.fixedCam||false;
    this.firstPerson = parameters.firstPerson||false;
    this.cameraYOffset = parameters.yOffset||this.character.physicsBodyShape.getHalfHeight();
    if(this.character == undefined||!(this.character instanceof Body||this.character instanceof Character)){
        console.error("JS3D.CharacterController: Must have a JS3D.Character or JS3D.Body type");
        return false;
    }
    if(this.camera == undefined||!this.camera instanceof THREE.Camera){
        console.error("JS3D.CharacterController: Must have a THREE.Camera");
        return false;
    }
    this.moveDir = {left:false,right:false,forward:false,backward:false,ableJump:false};
    this._camDir = new THREE.Vector3();
    this._tmpTrans = new Ammo.btTransform();
    this._rotatAxis = new THREE.Vector3(0,1,0);
    this._moveAmt = new THREE.Vector3();
    this._prevPosition = new THREE.Vector3();
    this._tmpTrans = new Ammo.btTransform();
    this._prevPosition.copy(this.character.mesh.position);
    return this;
}
CharacterController.prototype.forward = function(){
    this.camera.getWorldDirection(this._camDir);
    this._camDir.y = 0;
    this._camDir.normalize();
    this._moveAmt.add(this._camDir);    
}
CharacterController.prototype.backward = function(){
    this.camera.getWorldDirection(this._camDir);
    this._camDir.y = 0;
    this._camDir.normalize();
    this._camDir.multiplyScalar(-1);
    this._moveAmt.add(this._camDir);
}
CharacterController.prototype.left = function(){
    this.camera.getWorldDirection(this._camDir);
    this._camDir.y = 0;
    this._camDir.normalize();
    this._camDir.applyAxisAngle(this._rotatAxis,Math.PI/2)
    this._moveAmt.add(this._camDir);
}
CharacterController.prototype.right = function(){
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
CharacterController.prototype.moveDirUpdateSta = function(keyCode,forCode,backCode,leftCode,rightCode){
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
CharacterController.prototype.moveDirUpdateSto = function(keyCode,forCode,backCode,leftCode,rightCode){
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
CharacterController.prototype.updatePosition = function(){
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
CharacterController.prototype.jump = function(jumpVelocity){
    let physicsBody = this.character.physicsBody;
    let curVel = physicsBody.getLinearVelocity();
    physicsBody.setLinearVelocity(new Ammo.btVector3(curVel.x(),jumpVelocity,curVel.z()));

}
/**
 * 
 * @param {Object} parameters 
 */
var Trimesh = function(parameters){
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
    let pts = [];
    let faces = this.geometry.index.array;
    let positionArr = this.geometry.attributes.position.array;
    for(let x = 0;x<positionArr.length;x+=3){
        pts.push(new THREE.Vector3().fromArray(positionArr,x));
    }
    let triPt1 = new Ammo.btVector3();
    let triPt2 = new Ammo.btVector3();
    let triPt3 = new Ammo.btVector3();
    for(let face = 0;face<faces.length;face+=3){
        triPt1.setValue(pts[faces[face]].x,pts[faces[face]].y,pts[faces[face]].z);
        triPt2.setValue(pts[faces[face+1]].x,pts[faces[face+1]].y,pts[faces[face+1]].z);
        triPt3.setValue(pts[faces[face+2]].x,pts[faces[face+2]].y,pts[faces[face+2]].z);
        trimeshPhysicsBodyTMeshBuild.addTriangle(triPt1,triPt2,triPt3,true);
    };
    this.physicsBodyShape = new Ammo.btBvhTriangleMeshShape(trimeshPhysicsBodyTMeshBuild,dynamic,true,true);
    this.physicsBodyShape.setMargin(0.05);
    return this;
}
/**
 * 
 * @param {Object} parameters 
 */
var ConeShape = function(parameters){
    parameters = parameters||{};
    this.material = parameters.material||new THREE.MeshBasicMaterial();
    this.geometry = parameters.geometry||new THREE.ConeBufferGeometry();
    this.physicsBodyShape = new Ammo.btConeShape(this.geometry.parameters.radius,this.geometry.parameters.height);
    this.physicsBodyShape.setMargin(0.05);
    return this;
}

/**
 * 
 * @param {Object} parameters 
 */
var Plane = function(parameters){
    parameters = parameters||{};
    let width = parameters.width||10;
    let height = parameters.height||10;
    let widthSegs = parameters.widthSegments||1;
    let heightSegs = parameters.heightSegments||1;
    let build = new Ammo.btTriangleMesh();
    build.addTriangle(new Ammo.btVector3(-width/2,0,-height/2),new Ammo.btVector3(-width/2,0,height/2),new Ammo.btVector3(width/2,0,height/2));
    build.addTriangle(new Ammo.btVector3(-width/2,0,-height/2),new Ammo.btVector3(width/2,0,-height/2),new Ammo.btVector3(width/2,0,height/2));
    this.physicsBodyShape = new Ammo.btBvhTriangleMeshShape(build,true);
    this.physicsBodyShape.setMargin(0.05);
    this.material = parameters.material||new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
    this.geometry = new THREE.PlaneBufferGeometry(width,height,widthSegs,heightSegs);
    this.geometry.rotateX(-Math.PI/2);
    let debugGeo = new THREE.PlaneBufferGeometry(width,height);
    debugGeo.rotateX(-Math.PI/2);
    this.debugBody = new THREE.Mesh(debugGeo,new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}))
    return this;
}

/**
 * 
 * @param {Object} parameters 
 */
var InfPlane = function(parameters){
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
    let dG = new THREE.PlaneBufferGeometry(50,50,15,15);
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
    return this;
}

/**
 * 
 * @param {Object} parameters 
 */
var HeightFeild = function(parameters){
    parameters = parameters||{};
    let heightData = parameters.heightData||parameters.data;
    if(heightData==undefined||!heightData instanceof Array){
        console.error('JS3D.HeightFeild: HeightData must be an array of heights');
        return false;
    }
    let maxHeight = Math.max(...heightData);
    let minHeight = Math.min(...heightData);
    let width = parameters.width;
    let height = parameters.height;    
    let size = heightData.length;
    let ptr = Ammo._malloc(4*width*height);
    let flipQuatEdges = parameters.flip||parameters.flipQuatEdges||false;
    let elemSize = parameters.elemSize||parameters.size||1;
    for(let f = 0,fMax = size;f<fMax;f++){
        Ammo.HEAPF32[(ptr>>2)+f] = heightData[f];
    }
    this.physicsBodyShape = new Ammo.btHeightfieldTerrainShape(width,height,ptr,1,minHeight,maxHeight,1,0,flipQuatEdges);
    this.physicsBodyShape.setLocalScaling(new Ammo.btVector3(elemSize,1,elemSize));
    let geo = new THREE.PlaneBufferGeometry(width*elemSize,height*elemSize,width-1,height-1);
    geo.rotateX(-Math.PI/2);
    let pts = geo.attributes.position.array;
    for ( var i = 0, j = 0, l = pts.length; i < l; i ++, j += 3 ) {
        // j + 1 because it is the y component that we modify
        pts[ j + 1 ] = heightData[ i ];
    }
    geo.computeVertexNormals();
    geo.computeFaceNormals();
    this.geometry = geo;
    this.material = parameters.material||new THREE.MeshBasicMaterial();
}
exports.Vector3 = Vector3;
exports.Quaternion = Quaternion;
exports.World = World;
exports.Body = Body;
exports.BoxShape = BoxShape;
exports.SphereShape = SphereShape;
exports.CylinderShape = CylinderShape;
exports.ConeShape = ConeShape;
exports.Trimesh = Trimesh;
exports.Plane = Plane;
exports.InfPlane = InfPlane;
exports.HeightFeild = HeightFeild;
exports.Character = Character;
exports.CharacterController = CharacterController;
exports.CameraCreator = CameraCreator;
})));
