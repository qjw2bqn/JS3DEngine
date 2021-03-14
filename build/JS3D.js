var JS3D = {

}
var Vector3 = function(x,y,z){
    this.x = x||0;
    this.y = y||0;
    this.z = z||0;
    return this;
}
Vector3.prototype.copy = function(v){
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
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
    this.multiplyScalar(1/this.lengthSq());
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
Vector3.prototype.directionTo = function(v){
    let vx = v.x,vy = v.y, vz = v.z, tx = this.x,ty = this.y,tz = this.z;
    let dir = new Vector3(tx-vx,ty-vy,tz-vz);
    return dir.normalize();
}
var World = function(parameters){
    this.gravity = parameters.gravity||new Vector3(0,-9.8,0);
    this.target = parameters.target||document.body;
    this.veiw = 0;
    var width = 0;
    var height = 0;
    if(this.target==document.body){
      width = window.innerWidth;
      height = window.innerHeight;
    }else{
      width = target.clientWidth;
      height = target.clientHeight;
    }
    this.cameras = [new THREE.PerspectiveCamera(75,width/height,0.1,1000)];
    this.scene = new THREE.Scene();
    this.cWorld = new CANNON.World();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width,height);
    this.target.appendChild(this.renderer.domElement);
    this.bodies = [];
    this.cWorld.gravity.copy(this.gravity);
}
World.prototype.add = function(body){
    var physBod = body.physicsBody;
    var mesh = body.mesh;
    this.cWorld.addBody(physBod);
    this.scene.add(mesh);
    this.bodies.push(body);
}
World.prototype.debug = function(){
    for(var x in this.bodies){
        var cannon = this.bodies[x].physicsBody;
        var shape = this.bodies[x].physicsBodyShape;
        var mesh = this.bodies[x].mesh;
        if(this.bodies[x].debugBody==null){
            if(this.bodies[x].type=='BOX'){
                this.bodies[x].debugBody = new THREE.Mesh(new THREE.BoxBufferGeometry(shape.halfExtents.x*2,shape.halfExtents.y*2,shape.halfExtents.z*2),new THREE.MeshBasicMaterial({color:0x0000ff,wireframe:true}));
                this.scene.add(this.bodies[x].debugBody)
                this.bodies[x].debugBody.position.copy(cannon.position);
                this.bodies[x].debugBody.quaternion.copy(cannon.quaternion);
            }else if(this.bodies[x].type=='SPHERE'){
                this.bodies[x].debugBody = new THREE.Mesh(new THREE.SphereBufferGeometry(shape.radius,mesh.geometry.widthSegments,mesh.geometry.heightSegments),new THREE.MeshBasicMaterial({color:0x0000ff,wireframe:true}));
                this.scene.add(this.bodies[x].debugBody);
                this.bodies[x].debugBody.position.copy(cannon.position);
                this.bodies[x].debugBody.quaternion.copy(cannon.quaternion);
            }else if(this.bodies[x].type=='CYLINDER'){
                this.bodies[x].debugBody = new THREE.Mesh(new THREE.CylinderBufferGeometry(mesh.geometry.radiusTop,mesh.geometry.radiusBottom,mesh.geometry.height,mesh.geometry.radialSegments),new THREE.MeshBasicMaterial({color:0x0000ff,wireframe:true}));
                this.scene.add(this.bodies[x].debugBody);
                this.bodies[x].debugBody.position.copy(cannon.position);
                this.bodies[x].debugBody.quaternion.copy(cannon.quaternion);
            }
        }else{
            this.bodies[x].debugBody.position.copy(cannon.position);
            this.bodies[x].debugBody.quaternion.copy(cannon.quaternion);
        }
    }
}
World.prototype.update = function(dt){
    this.cWorld.step(dt||1/60);
    this.renderer.render(this.scene,this.cameras[this.veiw]);
    for(var x in this.bodies){
        var cannonObj = this.bodies[x].physicsBody;
        var threeObj = this.bodies[x].mesh;
        threeObj.position.copy(cannonObj.position);
        threeObj.quaternion.copy(cannonObj.quaternion);
    }
}
World.prototype.resizeVeiwingWindow = function(){
    this.renderer.setSize(this.target.clientWidth,this.target.clientHeight);
    this.cameras[this.veiw].aspect = this.target.clientWidth/this.target.clientHeight;
    this.cameras[this.veiw].updateProjectionMatrix();
}
World.prototype.addCamera = function(camera){
    this.cameras.push(camera);
}
World.prototype.setVeiwMode = function(mode){
    if(mode<0){
        console.warn('Camera veiw mode is less than zero. Setting to zero')
        this.veiw = 0;
    }else if(mode>this.cameras.length){
        console.warn('Camera veiw mode is higher than the number of cameras that there are. setting to the number of cameras');
        this.veiw = this.cameras.length-1;
    }else{
        this.veiw = mode-1;
    }
    
}
var GravityField = function(parameters){
    this.position = parameters.position||new Vector3();
    this.force = parameters.force||5;
    this.far = parameters.far||10;
    this._objs = [];
}
GravityField.prototype.update = function(){
    var dir = new Vector3();
    for(var x in this._objs){
        var cannonObj = this._objs[x].physicsBody;
        if(this.position.distanceTo(cannonObj.position)<=this.far){
            dir.copy(cannonObj.position);
            dir = dir.directionTo(this.position).invert();
            dir.multiplyScalar(this.force*this.position.distanceTo(cannonObj.position)+this.force*this.far);
            dir.add(cannonObj.force);
            cannonObj.force.copy(dir);
        }
    }
}
GravityField.prototype.add = function(body){
    this._objs.push(body);
}

var CharacterController = function(parameters){
    this.character = parameters.character;
    this.camera = parameters.camera;
    this.fixedCam = parameters.fixedCam||false;
    this.moveSpeed = parameters.moveSpeed||1/7;
    this.camDir = new THREE.Vector3();
    this.moveDir = {
        forward:false,
        backward:false,
        left:false,
        right:false
    } 
}
CharacterController.prototype.forward = function(){
    var physicsBody = this.character.physicsBody;
    var mesh = this.character.mesh;
    this.camera.getWorldDirection(this.camDir);
    this.camDir.setComponent(1,0);
    this.camDir.normalize();
    physicsBody.position.x+= this.camDir.x*this.moveSpeed;
    physicsBody.position.z+= this.camDir.z*this.moveSpeed;
    if(!this.fixedCam){
        this.camera.position.addScaledVector(this.camDir,this.moveSpeed);
    }
    mesh.position.copy(physicsBody.position);
};
CharacterController.prototype.backward = function(){
    var physicsBody = this.character.physicsBody;
    var mesh = this.character.mesh;
    this.camera.getWorldDirection(this.camDir);
    this.camDir.setComponent(1,0);
    this.camDir.normalize();
    physicsBody.position.x+= this.camDir.x*-this.moveSpeed;
    physicsBody.position.z+= this.camDir.z*-this.moveSpeed;
    if(!this.fixedCam){
        this.camera.position.addScaledVector(this.camDir,-this.moveSpeed);
    }
    mesh.position.copy(physicsBody.position);
}
CharacterController.prototype.left = function(){
    var physicsBody = this.character.physicsBody;
    var mesh = this.character.mesh;
    this.camera.getWorldDirection(this.camDir);
    this.camDir.setComponent(1,0);
    this.camDir.normalize();
    this.camDir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
    physicsBody.position.x+= this.camDir.x*this.moveSpeed;
    physicsBody.position.z+= this.camDir.z*this.moveSpeed;
    if(!this.fixedCam){
        this.camera.position.addScaledVector(this.camDir,this.moveSpeed);
    }
    mesh.position.copy(physicsBody.position)
}
CharacterController.prototype.right = function(){
    var physicsBody = this.character.physicsBody;
    var mesh = this.character.mesh;
    this.camera.getWorldDirection(this.camDir);
    this.camDir.setComponent(1,0);
    this.camDir.normalize();
    this.camDir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
    physicsBody.position.x+= this.camDir.x*-this.moveSpeed;
    physicsBody.position.z+= this.camDir.z*-this.moveSpeed;
    if(!this.fixedCam){
        this.camera.position.addScaledVector(this.camDir,-this.moveSpeed);
    }
    mesh.position.copy(physicsBody.position)
}
CharacterController.prototype.jump = function(jumpVelocity){
    this.character.physicsBody.velocity.y = jumpVelocity||1;
}

var BoxBody = function(parameters){
    var halfExtents = parameters.halfExtents||new Vector3();
    var material = parameters.material||new THREE.MeshBasicMaterial();
    var mass = parameters.mass||0;
    var position = parameters.position||new Vector3();
    this.type = 'BOX';
    this.debugBody;
    this.mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2),material);
    this.mesh.position.copy(position);
    this.physicsBodyShape = new CANNON.Box(new CANNON.Vec3(halfExtents.x,halfExtents.y,halfExtents.z));
    this.physicsBody = new CANNON.Body({
        mass:mass,
        position:new CANNON.Vec3(position.x,position.y,position.z),
        shape:this.physicsBodyShape
    })
    return this;
}
BoxBody.prototype.setShadows = function(cast,receive){
    cast = cast||true;
    receive = receive||true;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
}

var InvisBoxBody = function(parameters){
    var halfExtents = parameters.halfExtents||new Vector3();
    var mass = parameters.mass||0;
    var position = parameters.position||new Vector3();
    return new BoxBody({halfExtents,
        material:new THREE.MeshBasicMaterial({transparent:true,opacity:0}),
        mass,
        position
    });
}

var SphereBody = function(parameters){
    var geometry = parameters.geometry||new THREE.SphereBufferGeometry();
    var material = parameters.material||new THREE.MeshBasicMaterial();
    var mass = parameters.mass||0;
    var position = parameters.position||new Vector3();
    this.type = 'SPHERE';
    var geo = {
        radius:geometry.parameters.radius
    }
    this.debugBody;
    this.mesh = new THREE.Mesh(geometry,material);
    this.mesh.position.copy(position);
    this.physicsBodyShape = new CANNON.Sphere(geo.radius);
    this.physicsBody = new CANNON.Body({
        shape:this.physicsBodyShape,
        mass:mass,
        position:position
    });
    return this;
}
SphereBody.prototype.setShadows = function(cast, receive){
    cast = cast||true;
    receive = receive||true;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
}

var CylinderBody = function(parameters){
    var geometry = geometry|| new THREE.CylinderBufferGeometry();
    var material = parameters.material||new THREE.MeshBasicMaterial();
    var mass = parameters.mass||0;
    var position = parameters.position||new Vector3();
    geometry.rotateX(-Math.PI/2)
    var geo = {
      height:geometry.parameters.height,
      radTop:geometry.parameters.radiusTop,
      radBot:geometry.parameters.radiusBottom,
      numSegs:geometry.parameters.radialSegments,
    }
    this.debugBody;
    this.type = 'CYLINDER';
    this.mesh = new THREE.Mesh(geometry,material);
    this.mesh.position.copy(position);
    this.physicsBodyShape = new CANNON.Cylinder(geo.radTop,geo.radBot,geo.height,geo.numSegs);
    this.physicsBody = new CANNON.Body({
    shape:this.physicsBodyShape,
    mass:mass,
    position:position
    });
    return this;
}
CylinderBody.prototype.setShadows = function(cast,receive){
    cast = cast||true;
    receive = receive||true;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
}

/*
*/
var Character = function(parameters){
    var geo = new THREE.BoxBufferGeometry(parameters.width||1,parameters.height||2,parameters.depth||1);
    var material = parameters.material||new THREE.MeshBasicMaterial();
    var position = parameters.position||new Vector3();
    var model = parameters.model;
    this.type = 'BOX';
    this.mesh = new THREE.Mesh(geo,material);
    this.mesh.position.copy(position);
    if(model!=undefined){
        this.mesh = model;
    }
    this.physicsBodyShape = new CANNON.Box(new CANNON.Vec3(width/2,height/2,depth/2));
    this.physicsBody = new CANNON.Body({
        shape:this.physicsBodyShape,
        position:position,
        fixedRotation:true,
        mass:1
    });
}
Character.prototype.setShadows = function(cast,receive){
    cast = cast||true;
    receive = receive||true;
    this.mesh.castShadow = cast;
    this.mesh.receiveShadow = receive;
}

JS3D.World = World;
JS3D.Vector3 = Vector3;
JS3D.CharacterController = CharacterController;
JS3D.BoxBody = BoxBody;
JS3D.SphereBody = SphereBody;
JS3D.CylinderBody = CylinderBody;
JS3D.Character = Character;
JS3D.InvisBoxBody = InvisBoxBody;
JS3D.GravityField = GravityField;

window.JS3D = JS3D;
