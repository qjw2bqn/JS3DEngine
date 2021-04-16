# Documentation (Ammo.js)
## Vector3
JS3DAmmo.Vector3(x, y, z);
### Parameters
x: Number, default:0  
y: Number, default:0  
z: Number, default:0  
### Methods
#### copy(v): this
Works with THREE.Vector3, Ammo.btVector3, or JS3DAmmo.Vector3

#### set(x, y, z): this
sets this x, y, and z values to the specified parameters

#### add(v): this
adds v to this vector

#### addVectors(v1, v2): this
sets this vector to the sum of v1+v2

#### sub(v): this
subtracts v from this

#### subVectors(v1,v2): this
sets this vector to v1-v2

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

#### isAlmostEqualTo(v, delta): Boolean
checks if v is almost equal to this vector within a difference of delta

## World
JS3DAmmo.World(parameters);

### Properties
parameters:{  
gravity:Vector3(), default: Vector3(0,-9.8,0),
target: HTMLDOMElement, default:document.body,
backgroundColor: Number, default:0  
}  
bodies: Array of the bodies in to loop through for rendering and physics  
kBodies: Array of kinematic bodies to loop through for rendering and physics  
veiw: the camera to render the scene through  
cameras: array of cameras, selected through the veiw  
gravity: gravity vector  
target: HTMLDOMElement that the renderer gets appended to  
renderer: THREE.WebGLRenderer that gets appended to the target  
scene: THREE.Scene that the renderer renders  
aWorld: Ammo.btDiscreteDynamicsWorld  
debugGroup: THREE.Group that all the debug bodies get put in  
characterController: character controller to be used, updates every frame, default:null
