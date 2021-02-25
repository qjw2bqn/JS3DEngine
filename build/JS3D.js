var JS3D = {

}
var Vector3 = function(x,y,z){
    this.x = x||0;
    this.y = y||0;
    this.z = z||0;
    this.cannon = new CANNON.Vec3(this.x,this.y,this.z);
    this.three = new THREE.Vector3(this.x,this.y,this.z);
    return this;
}
Vector3.prototype.copy = function(v){
    this.cannon.copy(v.three);
    this.three.copy(v.cannon);
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
}
Vector3.prototype.set = function(x,y,z){
    this.cannon.set(x,y,z);
    this.three.set(x,y,z);
    this.x = x;
    this.y = y;
    this.z = z;
}
Vector3.prototype.setX = function(x){
    this.x = x;
    this.cannon.x = x;
    this.three.x = x;
}
Vector3.prototype.setY = function(y){
    this.y = y;
    this.cannon.y = y;
    this.three.y = y;
}
Vector3.prototype.setZ = function(z){
    this.z = z;
    this.cannon.z = z;
    this.three.z = z;
}
var World = function(target,gravity){
    this.gravity = gravity||new Vector3(0,-9.8,0);
    this.target = target||document.body;
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
    this.cWorld.gravity.copy(this.gravity.cannon);
}
World.prototype.add = function(body){
    var physBod = body.physicsBody;
    var mesh = body.mesh;
    this.cWorld.addBody(physBod);
    this.scene.add(mesh);
    this.bodies.push(body);
}
World.prototype.update = function(){
    this.cWorld.step(1/60);
    this.renderer.render(this.scene,this.cameras[this.veiw]);
    for(var x in this.bodies){
        var cannonObj = this.bodies[x].physicsBody;
        var threeObj = this.bodies[x].mesh;
        threeObj.position.copy(cannonObj.position);
        threeObj.quaternion.copy(cannonObj.quaternion);
    }
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

var CharacterController = function(character,camera,moveSpeed, fixedCam){
    this.fixedCam = fixedCam||false;
    this.moveSpeed = moveSpeed||1/7;
    this.camera = camera;
    this.character = character;
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

var BoxBody = function(geometry,material,mass,position){
    geometry = geometry||new THREE.BoxBufferGeometry();
    material = material||new THREE.MeshBasicMaterial();
    mass = mass||0;
    position = position||new Vector3D();
    this.mesh = new THREE.Mesh(geometry,material);
    this.mesh.position.copy(position.three);
    this.physicsBodyShape = new CANNON.Box(new CANNON.Vec3(geometry.parameters.width/2,geometry.parameters.height/2,geometry.parameters.depth/2));
    this.physicsBody = new CANNON.Body({
        mass:mass,
        position:position.cannon,
        shape:this.physicsBodyShape
    })
    return this;
}

var SphereBody = function(geometry,material,mass,position){
    geometry = geometry||new THREE.SphereBufferGeometry();
    var geo = {
        radius:geometry.parameters.radius
    }
    mass = mass||0;
    position = position||new Vector3D();
    this.mesh = new THREE.Mesh(geometry,material);
    mesh.position.copy(position.three);
    this.physicsBodyShape = new CANNON.Sphere(geo.radius);
    this.physicsBody = new CANNON.Body({
        physicsBodyShape,
        mass:mass,
        position:position.cannon
    });
    return this;
}

var CylinderBody = function(geometry,material,mass,position){
    position = position||new Vector3D();
    geometry = geometry|| new THREE.CylinderBufferGeometry();
    mass = mass||0;
    material = material||new THREE.MeshBasicMaterial();
    var geo = {
      height:geometry.parameters.height,
      radTop:geometry.parameters.radiusTop,
      radBot:geometry.parameters.radiusBottom,
      numSegs:geometry.parameters.radialSegments,
    }
    this.mesh = new THREE.Mesh(geo,material);
    this.mesh.position.copy(position.three);
    this.physicsBodyShape = new CANNON.Cylinder(geo.radTop,geo.radBot,geo.height,geo.numSegs)
    this.physicsBody = new CANNON.Body({
    shape:this.physicsBodyShape,
    mass:mass,
    position:position.cannon
    });
    return this;
}

var Character = function(width,height,depth,material,position,model){
    var geo = new THREE.BoxBufferGeometry(width,height,depth);
    material = material||new THREE.MeshBasicMaterial();
    position = position||new Vector3D();
    this.mesh = new THREE.Mesh(geo,material);
    this.mesh.position.copy(position.three);
    if(model!=undefined){
        this.mesh = model;
    }
    this.hitBoxShape = new CANNON.Box(new CANNON.Vec3(width/2,height/2,depth/2));
    this.hitbox = new CANNON.Body({
        shape:this.hitBoxShape,
        position:position.cannon,
        fixedRotation:true,
        mass:1
    });
    this.physicsBody = this.hitbox;
}

JS3D.World = World;
JS3D.Vector3 = Vector3;
JS3D.CharacterController = CharacterController;
JS3D.BoxBody = BoxBody;
JS3D.SphereBody = BoxBody;
JS3D.CylinderBody = CylinderBody;
JS3D.Character = Character
window.JS3D = JS3D;
