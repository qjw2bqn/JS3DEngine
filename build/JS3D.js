var JS3D = function(){

}
JS3D.prototype.World = function(gravity){
    gravity = gravity||this.Vector3(0,-9.8,0);
    var veiw = 0;
    this.cameras = [new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)];
    this.scene = new THREE.Scene();
    this.cWorld = new CANNON.World();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.bodies = [];
    this.cWorld.gravity.copy(gravity.cannon);
    this.add = function(body){
        this.cWorld.addBody(body.physicsBody);
        this.scene.add(body.mesh);
        this.bodies.push(body);
    }
    this.update = function(){
        this.cWorld.step(1/60);
        this.renderer.render(this.scene,this.cameras[veiw]);
        for(var x in this.bodies){
            var cannonObj = this.bodies[x].physicsBody;
            var threeObj = this.bodies[x].mesh;
            threeObj.position.copy(cannonObj.position);
            threeObj.quaternion.copy(cannonObj.quaternion);
        }
    }
    this.addCamera = function(camera){
        this.cameras.push(camera);
    }
    this.setVeiwMode = function(mode){
        if(mode<0){
            console.warn('Camera veiw mode is less than zero. Setting to zero')
            veiw = 0;
        }else if(mode>this.cameras.length-1){
            console.warn('Camera veiw mode is higher than the number of cameras that there are. setting to the number of cameras');
            veiw = this.cameras.length-1;
        }else{
            veiw = mode-1;
        }
        
    }
    return this;
}
JS3D.prototype.CharacterController = function(character,camera,moveSpeed, fixedCam){
    var physicsBody = character.physicsBody;
    fixedCam = fixedCam||false;
    var mesh = character.mesh;
    this.camDir = new THREE.Vector3();
    this.moveDir = {
        forward:false,
        backward:false,
        left:false,
        right:false
    }
    this.forward = function(){
        camera.getWorldDirection(this.camDir);
        this.camDir.setComponent(1,0);
        this.camDir.normalize();
        physicsBody.position.x+= this.camDir.x*moveSpeed;
        physicsBody.position.z+= this.camDir.z*moveSpeed;
        if(!fixedCam){
            camera.position.addScaledVector(this.camDir,moveSpeed);
        }
        mesh.position.copy(physicsBody.position);
    };
    this.backward = function(){
        camera.getWorldDirection(this.camDir);
        this.camDir.setComponent(1,0);
        this.camDir.normalize();
        physicsBody.position.x+= this.camDir.x*-moveSpeed;
        physicsBody.position.z+= this.camDir.z*-moveSpeed;
        if(!fixedCam){
            camera.position.addScaledVector(this.camDir,-moveSpeed);
        }
        mesh.position.copy(physicsBody.position);
    }
    this.left = function(){
        camera.getWorldDirection(this.camDir);
        this.camDir.setComponent(1,0);
        this.camDir.normalize();
        this.camDir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
        physicsBody.position.x+= this.camDir.x*moveSpeed;
        physicsBody.position.z+= this.camDir.z*moveSpeed;
        if(!fixedCam){
            camera.position.addScaledVector(this.camDir,moveSpeed);
        }
        mesh.position.copy(physicsBody.position)
    }
    this.right = function(){
        camera.getWorldDirection(this.camDir);
        this.camDir.setComponent(1,0);
        this.camDir.normalize();
        this.camDir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
        physicsBody.position.x+= this.camDir.x*-moveSpeed;
        physicsBody.position.z+= this.camDir.z*-moveSpeed;
        if(!fixedCam){
            camera.position.addScaledVector(this.camDir,-moveSpeed);
        }
        mesh.position.copy(physicsBody.position)
    }
    this.jump = function(jumpVelocity){
        physicsBody.velocity.y = jumpVelocity||1;
    }
    return this;
}
JS3D.prototype.Vector3 = function(x,y,z){
    this.x = x||0;
    this.y = y||0;
    this.z = z||0;
    this.three = new THREE.Vector3(x,y,z);
    this.cannon = new CANNON.Vec3(x,y,z);
    return this;
}
JS3D.prototype.BoxBody = function(geometry,material,mass,position){
    geometry = geometry||new THREE.BoxBufferGeometry();
    var geo = {
        width:geometry.parameters.width,
        height:geometry.parameters.height,
        depth:geometry.parameters.depth
    }
    position = position||this.Vector3();
    mass = mass||0;
    var mesh = new THREE.Mesh(geometry,material);
    mesh.position.copy(position.three);
    var shape = new CANNON.Box(new CANNON.Vec3(geo.width/2,geo.height/2,geo.depth/2));
    var physicsBody = new CANNON.Body({
        shape,
        mass:mass,
        position:position.cannon
    })
    this.position = position;
    return {
        mesh:mesh,
        physicsBody:physicsBody
    }
}
JS3D.prototype.SphereBody = function(geometry,material,mass,position){
    geometry = geometry||new THREE.SphereBufferGeometry();
    var geo = {
        radius:geometry.parameters.radius
    }
    mass = mass||0;
    position = position||this.Vector3();
    var mesh = new THREE.Mesh(geometry,material);
    this.scene.add(mesh);
    mesh.position.copy(position.three);
    var shape = new CANNON.Sphere(geo.radius);
    var physicsBody = new CANNON.Body({
        shape,
        mass:mass,
        position:position.cannon
    })
    this.world.add(physicsBody);
    return {
        mesh:mesh,
        physicsBody:physicsBody
    }
}
JS3D.prototype.CylinderBody = function(geometry,material,mass,position){
  position = position||engine.Vector3();
  geometry = geometry|| new THREE.CylinderBufferGeometry();
  mass = mass||0;
  material = material||new THREE.MeshBasicMaterial();
  var geo = {
    height:geometry.parameters.height,
    radTop:geometry.parameters.radiusTop,
    radBot:geometry.parameters.radiusBottom,
    numSegs:geometry.parameters.radialSegments,
  }
  var mesh = new THREE.Mesh(geo,material);
  var body = new CANNON.Body({
  shape:new CANNON.Cylinder(geo.radTop,geo.radBot,geo.height,geo.numSegs),
  mass:mass,
  position:position.cannon
  });
  return {
    mesh:mesh,
    physicsBody:body
  }
}
JS3D.prototype.Character = function(width,height,depth,material,position,model){
    var geo = new THREE.BoxBufferGeometry(width,height,depth);
    material = material||new THREE.MeshBasicMaterial();
    position = position||this.Vector3();
    var mesh = new THREE.Mesh(geo,material);
    mesh.position.copy(position.three);
    if(model!=undefined){
        mesh = model;
    }
    var hitBoxShape = new CANNON.Box(new CANNON.Vec3(width/2,height/2,depth/2));
    var hitbox = new CANNON.Body({
        shape:hitBoxShape,
        position:position.cannon,
        fixedRotation:true,
        mass:1
    });
    return {
        mesh:mesh,
        physicsBody:hitbox
    }
}
window.JS3D = JS3D;
