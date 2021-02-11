# Documentation
## init
engine.init(): null  
initiates the engine  
required after creating the engine
## Vector3
engine.Vector3(x,y,z): {three:THREE.Vector3(),cannon:CANNON.Vec3()}  
x: Number, if not set, defaults to 0  
y: Number, if not set, defaults to 0  
z: Number, if not set, defaults to 0  
## Box Body
engine.BoxBody(geometry,material,mass,position): {mesh:THREE.Mesh,physicsBody:CANNON.Body}  
geometry:THREE.BoxGeometry or THREE.BoxBufferGeometry  
material: THREE material  
mass: Number, if not put in will default to 0  
position: engine.Vector3, if not set, defaults to a blank engine.Vector3
## Sphere Body
engine.SphereBody(geometry,material,mass,position): {mesh:THREE.Mesh,physicsBody:CANNON.Body}  
geometry: THREE.SphereGeometry or THREE.SphereBufferGeometry  
material: THREE material  
mass: Number, if not set, defaults to 0  
position: engine.Vector3, if not set, defaults to a blank engine.Vector3
## Cylinder Body
engine.CylinderBody(geometry,material,mass,position): {mesh:THREE.Mesh,physicsBody:CANNON.Body}  
geometry: THREE.CylinderGeometry or THREE.CylinderBufferGeometry  
material: THREE.Material  
mass: Number, if not set, defaults to 0,  
position: engine.Vector3, if not set, defaults to a blank engine.Vector3();  
## Character Controller
engine.CharacterController(character,camera, moveSpeed, fixedCam): this  
character: engine.Character  
camera: THREE.Camera  
moveSpeed: Number  
fixedCam: Boolean
### returned items
forward(): moves the character forward with respect to the camera  
backward(): moves the character backward with respect to the camera  
left(): moves the character left with respect to the camera  
right(): moves the character right with respect to the camera  
jump(jumpVelocity): null, jumpVelocity: Number  
moveDir: {left:boolean, right:boolean, forward:boolean, backward:boolean}
## character
engine.Character(width,height,depth,material,position,model):{mesh:THREE.Mesh,physicsBody:CANNON.Body}  
width, height, depth: Numbers, size for hitbox  
material: THREE.Material  
position: engine.Vector3  
model:THREE.Mesh, optional model for the character
## World
engine.World(gravity):this  
gravity:engine.Vector3(), if not set, defaults to engine.Vector3(0,-9.8,0)
### returned items
add(body:engine.ShapeBody): null, adds body to the world  
update(): null, updates the world and renders

