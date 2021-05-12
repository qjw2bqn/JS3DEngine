# JS3D
A game engine made with three.js and Ammo.js
## Setting up
You need to have three.js and cannon.js already in your code when starting the website, as well as the JS3D library
```html
<script src='path-to-threejs/three.js'></script>
<script src='path-to-ammojs/ammo.js'></script>
<script src='path-to-JS3D/JS3DAmmo.js'></script>
```
and you have all the libraries you need, extra ones can be added extremely easily, as shown in the examples folder.
```javascript
let world,clock;
Ammo().then(start);
function start(){
  world = new JS3DAmmo.World();
  clock = new THREE.Clock();
}
var animate = function(){
  requestAnimationFrame(animate);
  let dt = clock.getDelta();
  world.update(dt);
}
animate();
```
and with that, you will have a world
## adding stuff to the world
JS3D uses JS3D Shapes to create the physics bodies, which includes a geometry, material, and physicsBodyShape. That gets fed into a body to be turned into a physics object
```javascript
//assuming having the code above and putting this in the start function
var box = new JS3DAmmo.Body({
  shape:new JS3DAmmo.BoxShape({
    halfExtents:new JS3D.Vector3(0.5,2.5,1.5),
    material:new THREE.MeshBasicMaterial()
  }),
  mass:1,
  position:new JS3DAmmo.Vector3(0,5,0)
});
world.add(box);
```
A sphere is the same thing, except you replace the BoxShape with SphereShape, and halfExtents is a geometry
```javascript
var sphere = new JS3DAmmo.Body({
  shape:new JS3DAmmo.SphereShape({
    geometry:new THREE.SphereBufferGeometry(1),
    material: new THREE.MeshBasicMaterial(),
  }),
  mass: 1,
  position:new JS3DAmmo.Vector3(0,5,0)
});
world.add(sphere);
```
There is also a CylinderShape and a ConeShape, but its the same story
## will this take away any functionality from Ammo.js or three.js?
No. you can get all of the world related things from the base engine by just doing world.something
```javascript
world.cameras //[camera]
world.renderer //renderer
...
```
or if you just want to get the three portion of a body, you can do body.mesh. if you want the ammo portion it is body.physicsBody.
## Special Thanks
I would like to give special thanks to @mrdoob, and @kripken for two amazing libraries that allowed me to create this, three.js, and Ammo.js, respectively
