# Documentation
## Vector3
JS3D.Vector3(x,y,z): this  
### properties  
x: Number, if not set, defaults to 0  
y: Number, if not set, defaults to 0  
z: Number, if not set, defaults to 0  
### methods
#### copy(v): this
copies the x, y, and z values of v to this vector. Does work with THREE.Vector3 or CANNON.Vec3.  
#### set(x,y,z): this
sets this vectors x, y, and z values to the ones inputed
#### add(v): this
adds vector v to this vector
#### sub(v): this
subtracts vector v from this vector
#### lengthSq(): Number
returns the euclidean length of this vector
#### manhattanLength(): Number
returns the manhattan length of this vector
#### distanceTo(v): Number
returns the euclidean distance from this vector to vector v
#### mandattanDistanceTo(v): Number
returns the manhattan distance from this vector to vector v
#### multiplyScalar(scaleFactor): this
scales this vector by the scale factor
#### addScaledVector(v, scaleFactor): this
scales vector v by the scale factor, and then adds vector v to this vector
#### normalize(): this
normalizes this vector, i.e. makes the vector a unit vector with the same direction as the original one
#### setLength(length): this
sets this vectors length to the new one
#### invert(): this
inverts this vector, i.e. x = -x, y = -y, z = -z
#### clone(): JS3D.Vector3
returns a new vector with the same x, y, and z values as this one
#### isEqualTo(v): Boolean
checks if vector v is exactly the same as this vector
####
## Box Body
JS3D.BoxBody(geometry,material,mass,position): {mesh:THREE.Mesh,physicsBody:CANNON.Body}  
geometry:THREE.BoxGeometry or THREE.BoxBufferGeometry  
material: THREE material  
mass: Number, if not put in will default to 0  
position: engine.Vector3, if not set, defaults to a blank engine.Vector3
## Sphere Body
JS3D.SphereBody(geometry,material,mass,position): {mesh:THREE.Mesh,physicsBody:CANNON.Body}  
geometry: THREE.SphereGeometry or THREE.SphereBufferGeometry  
material: THREE material  
mass: Number, if not set, defaults to 0  
position: engine.Vector3, if not set, defaults to a blank engine.Vector3
## Cylinder Body
JS3D.CylinderBody(geometry,material,mass,position): {mesh:THREE.Mesh,physicsBody:CANNON.Body}  
geometry: THREE.CylinderGeometry or THREE.CylinderBufferGeometry  
material: THREE.Material  
mass: Number, if not set, defaults to 0,  
position: engine.Vector3, if not set, defaults to a blank engine.Vector3();  
## Character Controller
JS3D.CharacterController(character,camera, moveSpeed, fixedCam): this  
character: engine.Character  
camera: THREE.Camera  
moveSpeed: Number  
fixedCam: Boolean
### Methods
#### forward(): Null
moves the character forward with respect to the camera  
#### backward(): Null
moves the character backward with respect to the camera  
#### left(): Null
moves the character left with respect to the camera  
#### right(): Null
moves the character right with respect to the camera  
#### jump(jumpVelocity): Null 
jumpVelocity: Number  
### Other things
#### moveDir:
{left:boolean, right:boolean, forward:boolean, backward:boolean}
## Character
JS3D.Character(width,height,depth,material,position,model):{mesh:THREE.Mesh,physicsBody:CANNON.Body}  
width, height, depth: Numbers, size for hitbox  
material: THREE.Material  
position: engine.Vector3  
model:THREE.Mesh, optional model for the character
## World
engine.World(target,gravity):this  
target: HTMLDOMElement, place where this will be placed, defaults to document.body  
gravity:engine.Vector3(), if not set, defaults to engine.Vector3(0,-9.8,0)
### Methods
#### add(body:engine.ShapeBody): Null
adds body to the world  
#### update(): Null
updates the world and renders  
#### addCamera(camera: THREE.Camera): Null
add another camera for extra rendering options  
#### setVeiwMode(mode: Number): Null
switch which camera is to be used for rendering the scene

