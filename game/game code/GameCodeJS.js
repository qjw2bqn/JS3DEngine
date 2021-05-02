let world,clock,controls,gui,scene,renderer,camera,physicsWorld,character,deaths = 0,dispatcher,timeCh = 0,audio;
Ammo().then(start);
class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }
function start(){
    audio = new Audio('../audio/Intro%20Script.mp3');
    world = new JS3DAmmo.World({
        gravity:new JS3DAmmo.Vector3(0,-10,0),
        backgroundColor:0x8080ff
    });
    camera = world.cameras[0];
    renderer = world.renderer;
    scene = world.scene;
    let clicked = false;
    physicsWorld = world.aWorld;
    dispatcher = physicsWorld.getDispatcher();
    clock = new THREE.Clock();
    gui = new dat.GUI();
    let light = new THREE.DirectionalLight(0xa2a2a2);
    light.position.set(-1,1.75,1);
    light.position.multiplyScalar(100);
    scene.add(light);
    let amb = new THREE.AmbientLight(0x404040);
    scene.add(amb);
    // controls = new THREE.OrbitControls(camera,renderer.domElement);
    // controls.maxDistance = 30;   
    controls = new THREE.PointerLockControls(camera,renderer.domElement);
    renderer.domElement.onclick = function(){
        if(!clicked){
            audio.play();
            setTimeout(function(){
                world.remove(block1);
                world.remove(block2);
            },33000);
            clicked = true;
        }
        controls.lock();
    }
    let ground = new JS3DAmmo.Body({
        shape:new JS3DAmmo.BoxShape({
            halfExtents:{x: 50, y:1, z:100},
            material:new THREE.MeshPhongMaterial()
        }),
        mass:0,
        position:new JS3DAmmo.Vector3(0,-11,5)
    });
    world.add(ground);
    let wallShape = new JS3DAmmo.BoxShape({
        halfExtents:new JS3DAmmo.Vector3(50,50,1),
        material:new THREE.MeshPhongMaterial()
    });
    let wall1 = new JS3DAmmo.Body({
        shape:wallShape,
        position:new JS3DAmmo.Vector3(0,40,-50)
    });
    world.add(wall1);
    let wall2 = new JS3DAmmo.Body({
        shape:wallShape,
        position:new JS3DAmmo.Vector3(50,40,0),
        rotation:new THREE.Quaternion(0,1/Math.SQRT2,0,1/Math.SQRT2)
    });
    world.add(wall2);
    let wall3 = new JS3DAmmo.Body({
        shape:wallShape,
        position:new JS3DAmmo.Vector3(-50,40,0),
        rotation:new THREE.Quaternion(0,1/Math.SQRT2,0,1/Math.SQRT2)
    });
    world.add(wall3);
    let wall4p1 = new JS3DAmmo.Body({
        shape:new JS3DAmmo.BoxShape({
            halfExtents:new JS3DAmmo.Vector3(20,50,1),
            material:new THREE.MeshPhongMaterial()
        }),
        mass:0,
        position:new JS3DAmmo.Vector3(-30,40,50)
    });
    world.add(wall4p1);
    let wall4p2 = new JS3DAmmo.Body({
        shape:new JS3DAmmo.BoxShape({
            halfExtents:new JS3DAmmo.Vector3(20,50,1),
            material:new THREE.MeshPhongMaterial()
        }),
        mass:0,
        position:new JS3DAmmo.Vector3(30,40,50)
    });
    world.add(wall4p2);
    let wall4p3 = new JS3DAmmo.Body({
        shape:new JS3DAmmo.BoxShape({
            halfExtents:new JS3DAmmo.Vector3(20,30,1),
            material:new THREE.MeshPhongMaterial()
        }),
        mass:0,
        position:new JS3DAmmo.Vector3(0,60,50),
    });
    world.add(wall4p3);
    let door = new JS3DAmmo.Body({
        shape:new JS3DAmmo.BoxShape({
            halfExtents:new JS3DAmmo.Vector3(9,19,1),
            material:new THREE.MeshPhongMaterial({color:0x964B00})
        }),
        mass:1,
        position:new JS3DAmmo.Vector3(0,10,50)
    });
    world.add(door);
    let ceil = new JS3DAmmo.Body({
        shape:new JS3DAmmo.BoxShape({
            halfExtents:{x: 50, y:1, z:50},
            material:new THREE.MeshPhongMaterial()
        }),
        mass:0,
        position:new JS3DAmmo.Vector3(0,90,0)
    });
    world.add(ceil);
    let block1 = new JS3DAmmo.Body({
        shape:new JS3DAmmo.BoxShape({
            halfExtents:new JS3DAmmo.Vector3(10,4,1),
            material:new THREE.MeshPhongMaterial()
        }),
        mass:0,
        position:new JS3DAmmo.Vector3(0,10,52)
    });
    world.add(block1);
    let block2 = new JS3DAmmo.Body({
        shape:new JS3DAmmo.BoxShape({
            halfExtents:new JS3DAmmo.Vector3(10,4,1),
            material:new THREE.MeshPhongMaterial()
        }),
        mass:0,
        position:new JS3DAmmo.Vector3(0,10,48)
    });
    world.add(block2);
        // let fakeFloor = new THREE.Mesh(new THREE.BoxBufferGeometry(100,2,200),new THREE.MeshPhongMaterial());
    let fakeFloor = new JS3DAmmo.Body({
        shape:new JS3DAmmo.BoxShape({
            halfExtents:new JS3DAmmo.Vector3(50,1,100),
            material:new THREE.MeshPhongMaterial()
        }),
        mass:0,
        position:new JS3DAmmo.Vector3(0,-11,205),
        group:2,
        mask:2,
        restitution:1
    });
    world.add(fakeFloor);
    // window.fakeFloo = fakeFloor;
    for(var x = 0;x<Math.round(Math.random()*30)+10;x++){
        let b = new JS3DAmmo.Body({
            shape:new JS3DAmmo.SphereShape({
                material:new THREE.MeshPhongMaterial({color:0xff0000})
            }),
            mass:1,
            group:2,
            mask:2,
            restitution:1,
            position:new JS3DAmmo.Vector3(Math.random()*10-5,10,Math.random()*30+150)
        });
        b.physicsBody.setLinearVelocity(new Ammo.btVector3(Math.random()*10,Math.random()*10,Math.random()*10))
        b.physicsBody.setAngularVelocity(new Ammo.btVector3(Math.random()*10,Math.random()*10,Math.random()*10))
        b.mesh.name = 'temp';
        b.physicsBody.setActivationState(4);
        world.add(b);
    }
    let hinge = new Ammo.btHingeConstraint(wall4p3.physicsBody,door.physicsBody,new Ammo.btVector3(11,-50,0),new Ammo.btVector3(11,0,0),new Ammo.btVector3(0,1,0),new Ammo.btVector3(0,1,0))
    world.aWorld.addConstraint(hinge);
    camera.position.set(0,0,-10);
    character = new JS3DAmmo.Character({
        radius:1,
        height:2,
        material:new THREE.MeshPhongMaterial()
    });
    world.add(character);
    let characterController = new JS3DAmmo.CharacterController({
        character,
        camera,
        moveSpeed:20,
        firstPerson:true,
        yOffset:1
    });
    let blackRoom = new JS3DAmmo.Body({
        shape:new JS3DAmmo.Trimesh({
            geometry:new THREE.BoxBufferGeometry(50,14,50),
            material:new THREE.MeshBasicMaterial({color:0,side:1})
        }),
        mass:0,
        position:new JS3DAmmo.Vector3(39487,746392,5784)
    });
    world.add(blackRoom);
    window.allowUpdate = true;
    document.onkeydown = function(){
        characterController.moveDirUpdateSta(event.keyCode,87,83,65,68);
        if(event.keyCode==32&&characterController.moveDir.ableJump){
            characterController.jump(20);
            window.allowUpdate = false;
            characterController.moveDir.ableJump = false;
            timeCh = 0;
        }
    }
    document.onkeyup = function(){
        characterController.moveDirUpdateSto(event.keyCode,87,83,65,68);
    }
    world.characterController = characterController;
    world.setTeleportPlane(-20,function(body){
        if(body instanceof JS3DAmmo.Character){
            let ammo = body.physicsBody;
            let ms = ammo.getMotionState();
            if(ms){
                let transform = new Ammo.btTransform();
                transform.setIdentity();
                transform.setOrigin(new Ammo.btVector3(39487,746392,5784));
                transform.setRotation(new Ammo.btQuaternion(0,0,0,1));
                ammo.setWorldTransform(transform);
            }
            ammo.setLinearVelocity(new Ammo.btVector3(0,0,0));
            ammo.setAngularVelocity(new Ammo.btVector3(0,0,0));
            deaths++;
            setTimeout(function(){
                let ammo = body.physicsBody;
                let ms = ammo.getMotionState();
                if(ms){
                    let transform = new Ammo.btTransform();
                    transform.setIdentity();
                    transform.setOrigin(new Ammo.btVector3(body.initPosition.x,body.initPosition.y,body.initPosition.z));
                    transform.setRotation(new Ammo.btQuaternion(0,0,0,1));
                    ammo.setWorldTransform(transform);
                }
                ammo.setLinearVelocity(new Ammo.btVector3(0,0,0));
                ammo.setAngularVelocity(new Ammo.btVector3(0,0,0));
            },5000)
            if(deaths==2){
                scene.remove(fakeFloor);
                fakeFloor = new JS3DAmmo.Body({
                    shape:new JS3DAmmo.BoxShape({
                        halfExtents:new JS3DAmmo.Vector3(50,1,100),
                        material:new THREE.MeshPhongMaterial(),
                        group:1,
                        mask:1
                    }),
                    position:new JS3DAmmo.Vector3(0,-11,205)
                });
                world.add(fakeFloor);
                for(var x = 0;x<world.bodies.length;x+=0){
                    if(world.bodies[x].mesh.name=='temp'){
                        world.remove(world.bodies[x])
                    }else{
                        x++;
                    }
                }
            }
        }else if(body.mesh.name=='temp'&&deaths>2){
            world.remove(body);
        }else{
            let ammo = body.physicsBody;
            let ms = ammo.getMotionState();
            if(ms){
                let transform = new Ammo.btTransform();
                transform.setIdentity();
                transform.setOrigin(new Ammo.btVector3(body.initPosition.x,body.initPosition.y,body.initPosition.z));
                transform.setRotation(new Ammo.btQuaternion(0,0,0,1));
                ammo.setWorldTransform(transform);
            }
            ammo.setLinearVelocity(new Ammo.btVector3(0,0,0));
            ammo.setAngularVelocity(new Ammo.btVector3(0,0,0));
        }
    });
    animate();
}
let cP = new JS3DAmmo.Vector3(),bP0 = new JS3DAmmo.Vector3(),bP1 = new JS3DAmmo.Vector3()
function animate(){
    let dt = clock.getDelta();
    if(deaths>0){
        document.getElementById('deathCounter').innerHTML = 'Deaths: '+deaths;
    }
    let n = dispatcher.getNumManifolds();
    cP.copy(character.mesh.position);
    for(var y = 0;y<n;y++){
        let manifold = dispatcher.getManifoldByIndexInternal(y);
        let b0 = manifold.getBody0();
        let b1 = manifold.getBody1();
        bP0.copy(b0.getWorldTransform().getOrigin());
        bP1.copy(b1.getWorldTransform().getOrigin());
        let m = 0;
        if(cP.isAlmostEqualTo(bP0,1e-4)){
            m = 1
        }else if(cP.isAlmostEqualTo(bP1,1e-4)){
            m = -1;
        }else{
            continue;
        }
        let conPt = manifold.getContactPoint();
        let n = conPt.get_m_normalWorldOnB();
        n.op_mul(m);
        if(n.y()>0.5&&window.allowUpdate){
            world.characterController.moveDir.ableJump = true;
        }else{
            world.characterController.moveDir.ableJump = false;
        }
        break;
    }
    if(timeCh>.1&&window.allowUpdate==false){
        timeCh = 0;
        window.allowUpdate = true;
    }
    // controls.target.set(character.mesh.position.x,character.mesh.position.y+1,character.mesh.position.z)
    // controls.update();
    world.update(dt);
    timeCh+=dt;
    requestAnimationFrame(animate);
}
