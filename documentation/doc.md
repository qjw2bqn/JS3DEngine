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
#### directionTo(v): Vector3
returns a normalized Vector3 pointing in the direction from this vector, to the other one. because of a small bug, you have to do .invert() to get the actual direction
## Box Body
JS3D.BoxBody(parameters): {mesh:THREE.Mesh,physicsBody:CANNON.Body}  
parameters{  
&nbsp;&nbsp;halfExtents:Vector3/Vec3 (CANNON/THREE/JS3D)  
&nbsp;&nbsp;material: THREE.Material  
&nbsp;&nbsp;mass: Number  
&nbsp;&nbsp;position: JS3D.Vector3  
}
### methods
#### setShadows(cast, recieve): null
sets the shadows for the mesh of the object. Make sure to have a light, and shadowMap enabled
## Invisible Box Body
JS3D.InvisBoxBody(parameters): JS3D.BoxBody  
parameters{  
&nbsp;&nbsp;halfExtents: Vector3/Vec3,  
&nbsp;&nbsp;mass: Number,  
&nbsp;&nbsp;position: JS3D.Vector3  
}
### methods
setShadows(cast, recieve)
cast parameter doesn't change anything as the box is invisible
## Sphere Body
JS3D.SphereBody(parameters): {mesh:THREE.Mesh,physicsBody:CANNON.Body}  
parameters{  
&nbsp;&nbsp;geometry: THREE.SphereGeometry or THREE.SphereBufferGeometry  
&nbsp;&nbsp;material: THREE.Material  
&nbsp;&nbsp;mass: Number, if not set, defaults to 0  
&nbsp;&nbsp;position: JS3D.Vector3  
}
## Cylinder Body
JS3D.CylinderBody(parameters): {mesh:THREE.Mesh,physicsBody:CANNON.Body}  
parameters{  
&nbsp;&nbsp;geometry: THREE.CylinderGeometry or THREE.CylinderBufferGeometry  
&nbsp;&nbsp;material: THREE.Material  
&nbsp;&nbsp;mass: Number, if not set, defaults to 0  
&nbsp;&nbsp;position: JS3D.Vector3  
}
## Character Controller
JS3D.CharacterController(parameters): this  
parameters{  
&nbsp;&nbsp;character: JS3D.Character  
&nbsp;&nbsp;camera: THREE.Camera  
&nbsp;&nbsp;moveSpeed: Number  
&nbsp;&nbsp;fixedCam: Boolean  
}
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
JS3D.Character(parameters):{mesh:THREE.Mesh,physicsBody:CANNON.Body}  
parameters{  
&nbsp;&nbsp;width, height, depth: Numbers, size for hitbox  
&nbsp;&nbsp;material: THREE.Material  
&nbsp;&nbsp;position: JS3D.Vector3  
&nbsp;&nbsp;model:THREE.Mesh, optional model for the character  
}
## World
JS3D.World(parameters):this  
parameters{  
&nbsp;&nbsp;target: HTMLDOMElement, place where this will be placed, defaults to document.body  
&nbsp;&nbsp;gravity:engine.Vector3(), if not set, defaults to engine.Vector3(0,-9.8,0)  
}
### Methods
#### add(body:JS3D.ShapeBody): Null
adds body to the world  
#### update(): Null
updates the world and renders  
#### addCamera(camera: THREE.Camera): Null
add another camera for extra rendering options  
#### setVeiwMode(mode: Number): Null
switch which camera is to be used for rendering the scene
## Gravity Feild
JS3D.GravityFeild(parameters):this  
parameters{  
&nbsp;&nbsp;position: JS3D.Vector3() (Must be a JS3D Vector3)  
&nbsp;&nbsp;force: Number  
&nbsp;&nbsp;far: farthest point that gets effected by gravity  
}  
### Methods
#### add(body): null
adds a body to the gravity feild
#### update():null
updates the objects in the gravity feild
