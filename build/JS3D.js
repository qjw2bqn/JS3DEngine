var JS3D = function(){
    this.camera;
    this.scene;
    this.world;
    this.renderer;
    this.bodies = [];
    this.camDir = new THREE.Vector3();
}
JS3D.prototype.init = function(){
    this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
    this.scene = new THREE.Scene();
    this.world = new CANNON.World();
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
}
JS3D.prototype.World = function(gravity){
    this.gravity = gravity||this.Vector3(0,-9.8,0);
    this.world.gravity.copy(this.gravity.cannon);
    this.add = function(body){
        this.world.addBody(body.physicsBody);
        this.scene.add(body.mesh);
        this.bodies.push(body);
    }
    this.update = function(){
        this.world.step(1/60);
        this.renderer.render(this.scene,this.camera);
        for(var x in this.bodies){
            var cannonObj = this.bodies[x].physicsBody;
            var threeObj = this.bodies[x].mesh;
            threeObj.position.copy(cannonObj.position);
            threeObj.quaternion.copy(cannonObj.quaternion);
        }
    }
    return this;
}
JS3D.prototype.CharacterController = function(character,camera,moveSpeed){
    var physicsBody = character.physicsBody;
    var mesh = character.mesh;
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
        camera.position.addScaledVector(this.camDir,moveSpeed);
        mesh.position.copy(physicsBody.position);
    };
    this.backward = function(){
        camera.getWorldDirection(this.camDir);
        this.camDir.setComponent(1,0);
        this.camDir.normalize();
        physicsBody.position.x+= this.camDir.x*-moveSpeed;
        physicsBody.position.z+= this.camDir.z*-moveSpeed;
        camera.position.addScaledVector(this.camDir,-moveSpeed);
        mesh.position.copy(physicsBody.position);
    }
    this.left = function(){
        camera.getWorldDirection(this.camDir);
        this.camDir.setComponent(1,0);
        this.camDir.normalize();
        this.camDir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
        physicsBody.position.x+= this.camDir.x*moveSpeed;
        physicsBody.position.z+= this.camDir.z*moveSpeed;
        camera.position.addScaledVector(this.camDir,moveSpeed);
        mesh.position.copy(physicsBody.position)
    }
    this.right = function(){
        camera.getWorldDirection(this.camDir);
        this.camDir.setComponent(1,0);
        this.camDir.normalize();
        this.camDir.applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
        physicsBody.position.x+= this.camDir.x*-moveSpeed;
        physicsBody.position.z+= this.camDir.z*-moveSpeed;
        camera.position.addScaledVector(this.camDir,-moveSpeed);
        mesh.position.copy(physicsBody.position)
    }
    return this;
}
JS3D.prototype.Vector3 = function(x,y,z){
    return {
        three:new THREE.Vector3(x||0,y||0,z||0),
        cannon:new CANNON.Vec3(x||0,y||0,z||0)
    }
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
