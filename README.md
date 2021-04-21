# JS3D
A game engine made with three.js and cannon.js, or Ammo.js
## API
the API is slightly different between the two engines. Refer to documentation for differences
## Setting up
You need to have three.js and cannon.js already in your code when starting the website, as well as the JS3D library
```html
<script src='path-to-threejs/three.js'></script>
<script src='path-to-cannonjs/cannon.js'></script> <!--<script src='path-to-ammojs/ammo.js></script>-->
<script src='path-to-JS3D/JS3D.js'></script>
```
and you have all the libraries you need, extra ones can be added extremely easily, as shown in the examples folder.
```javascript
var world = new JS3D.World();
var animate = function(){
  requestAnimationFrame(animate);
  world.update();
}
animate();
```
and with that, you will have a world
## adding stuff to the world
JS3D uses three.js geometries to create the physics bodies, but there are special bodies that you must use to get them
like adding a box
```javascript
//assuming having the code above and putting this before the animate function
var box = new JS3D.BoxBody({
  halfExtents:new JS3D.Vector3(0.5,2.5,1.5),
  material:new THREE.MeshBasicMaterial(),
  mass:1,
  position:new JS3D().Vector3(0,5,0)
});
world.add(box);
```
A sphere is the same thing, except you replace the BoxBody with SphereBody, and halfExtents is a geometry
```javascript
var sphere = new JS3D.SphereBody({
  geometry:new THREE.SphereBufferGeometry(1),
  material: new THREE.MeshBasicMaterial(),
  mass: 1,
  position:new JS3D().Vector3(0,5,0)
});
world.add(sphere);
```
There is also a CylinderBody, but its the same story
## will this take away any functionality from cannon.js/ Ammo.js or three.js?
No. you can get all of the world related things from the base engine by just doing world.something
```javascript
world.cameras //[camera]
world.renderer //renderer
...
```
or if you just want to get the three portion of a body, you can do body.mesh. if you want the cannon/ammo portion it is body.physicsBody.
## Special Thanks
I would like to give special thanks to @mrdoob, @schteppe, and @kripken for three amazing libraries that allowed me to create this, three.js, cannon.js, and Ammo.js, respectively
