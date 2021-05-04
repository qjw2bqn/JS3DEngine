# Documentation (Ammo.js)
## Vector3
JS3DAmmo.Vector3(x, y, z);
### Parameters
x: Number, default: 0  
y: Number, default: 0  
z: Number, default: 0  
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
parameters: {  
gravity:Vector3(), default: Vector3(0,-9.8,0),  
target: HTMLDOMElement, default: document.body,  
backgroundColor: Number, default: 0  
}  
bodies: Array of the bodies in to loop through for rendering and physics  
kBodies: Array of kinematic bodies to loop through for rendering and physics  
gravityFeilds: Array of gravity feilds to loop through for rendering and physics  
veiw: the camera to render the scene through  
cameras: array of cameras, selected through the veiw  
gravity: gravity vector  
target: HTMLDOMElement that the renderer gets appended to  
renderer: THREE.WebGLRenderer that gets appended to the target  
scene: THREE.Scene that the renderer renders  
aWorld: Ammo.btDiscreteDynamicsWorld  
debugGroup: THREE.Group that all the debug bodies get put in  
characterController: character controller to be used, updates every frame, default:null  

### Methods
#### add(body):
adds a body to the physics world and scene

#### addKinematicBody(kineBody):
adds a kinematic body to the physics world and scene

#### remove(body):
removes a body from physics world and scene. Doesn't work with kinematic bodies.

#### setTeleportPlane(yV: Number, onTeleport: Function):
if a bodies y value gets below yV, onTeleport gets run with the body that went below the value as a parameter

#### update(dt: Number):
updates the physics world and updates three.js objects

#### addGravityFeild(gravFeild):
adds a gravity feild to the world

#### addCamera(camera):
adds a three.js camera to the scene

#### resizeVeiwingWindow():
resizes the renderer size, and updates sizes of all cameras added to the world

## RigidBody
JS3DAmmo.RigidBody    
Holder for a mesh, physicsBody, and debugBody to be added to the world

## Shape
JS3DAmmo.Shape    
Holder for geometry, material, and physicsBodyShape that a RigidBody is made out of

## Body extends RigidBody
JS3DAmmo.Body(parameters):  
### parameters
parameters:{  
shape:JS3DAmmo.Shape  
mass:Number, default: 0,  
position: Vector3, default: JS3DAmmo.Vector3(0,0,0),  
rotation|quaternion: Quaternion, default: THREE.Quaternion(0,0,0,1),  
friction: Number, default: 0.5,  
restitution: Number, default: 0  
}
### Methods
#### setShadows(cast: Boolean, receive: Boolean):
sets casting and/or receiving shadows on a mesh

#### setMass(mass: Number):
sets the mass of the physics body

#### scale(scaleFac: Number):
sets the scaling of the physics body shape
## InfPlane extends RigidBody
JS3DAmmo.InfPlane(parameters)
### Parameters
parameters:{  
normal: JS3DAmmo.Vector3, default: JS3DAmmo.Vector3(0,1,0),  
distance: Number, default: 1  
}

## CompoundBody extends RigidBody
JS3DAmmo.CompoundBody(parameters)
### Parameters
parameters:{  
bodies: Array of JS3DAmmo Bodies,  
position: Vector3, default: JS3DAmmo.Vector3(0,0,0)  
rotation|quaternion: THREE.Quaternion, default: THREE.Quaternion(0,0,0,1)  
}

## Character extends RigidBody
JS3Dammo.Character(parameters)
### Paramters
parameters:{  
height: Number, default:2,
radius: Number, default:1,
position: Vector3, default: JS3DAmmo.Vector3(0,0,0),
material: THREE.Material, default: THREE.MeshBasicMaterial(),
CCD|continuousCollision: Boolean, default: false,
group: Number, default: undefined,
mask: Number, default: undefined,
model: THREE.Mesh, default: undefined
}

## BoxShape extends Shape
JS3DAmmo.BoxShape(parameters)
### parameters
parameters:{  
halfExtents: JS3DAmmo.Vector3, default: JS3DAmmo.Vector3(0.5,0.5,0.5),  
material: THREE.Material, default: THREE.MeshBasicMaterial  
}

## SphereShape extends Shape
JS3DAmmo.SphereShape(parameters)
### parameters
parameters:{  
geometry: THREE.SphereBufferGeometry, default: THREE.SphereBufferGeometry,  
material: THREE.Material, default: THREE.MeshBasicMaterial  
}

## CylinderShape extends Shape
JS3DAmmo.CylinderShape(parameters)
### parameters
parameters:{  
geometry: THREE.CylinderGeometry, default: THREE.CylinderBufferGeometry,  
material: THREE.Material, default: THREE.MeshBaiscMaterial  
}

## ConeShape extends Shape
JS3DAmmo.ConeShape(parameters)
### parameters
parameters:{  
geometry: THREE.ConeGeometry, default: THREE.CylinderBufferGeometry,  
material: THREE.Material, default: THREE.MeshBasicMaterial  
}

## Trimesh extends Shape
JS3DAmmmo.Trimesh(parameters)
### parameters
parameters:{  
geometry: THREE.BufferGeometry (must be indexed),  
material: THREE.Material, default: THREE.MeshBasicMaterial  
}

## ConvexPolyhedronShape extends Shape
JS3DAmmo.ConvexPolyhedronShape
### parameters
parameters:{
geometry: THREE.BufferGeometry,
material: THREE.Material, default: THREE.MeshBasicMaterial
}

## HeightFeild extends Shape
JS3DAmmo.HeightFeild(parameters)
### parameters
parameters:{
data: Array,
material: THREE.Material, default: THREE.MeshBasicMaterial
}

## Plane extends Shape
JS3DAmmo.Plane(parameters)
### parameters
parameters:{  
width: Number, default: 10,  
height: Number, default: 10,  
widthSegments: Number, default:1,  
heightSegments: Number, default:1,
material: THREE.Material, default: THREE.MeshBasicMaterial
}

## CapsuleShape extends Shape
JS3DAmmo.CapsuleShape(parameters)
### parameters
parameters:{  
radius: Number, default: 1,
height: Number, default: 1,
widthSegments: Number, default:12,
heightSegments: Number, default: 4,
material: THREE.Material, default: THREE.MeshBasicMaterial
}

## CharacterController
JS3DAmmo.CharacterController(parameters)
### parameters
parameters:{
character: JS3DAmmo.Character or JS3DAmmo.Body,  
camera: THREE.Camera,  
moveSpeed: Number, default: 10,  
fixedCam: Boolean, default: false,  
firstPerson: Boolean, default:false,  
yOffset: Number, default: 1/2 character height,  
}
