# JS3D
A game engine made with three.js and cannon.js
## Setting up
You need to have three.js and cannon.js already in your code when starting the website, as well as the JS3D library
```html
<script src='path-to-threejs/three.js'></script>
<script src='path-to-cannonjs/cannon.js'></script>
<script src='path-to-JS3D/JS3D.js'></script>
```
and you have all the libraries you need, extra ones can be added extremely easily.
```javascript
var engine  = new JS3D();
engine.init();
var world = engine.World();
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
var box = engine.BoxBody(new THREE.BoxBufferGeometry(1,5,3),new THREE.MeshBasicMaterial(),1,engine.Vector3(0,5,0));
world.add(box);
```
A sphere is the same thing, except you replace the BoxBody with SphereBody, and you replace the geometry
```javascript
var sphere = engine.SphereBody(new THREE.SphereBufferGeometry(1),new THREE.MeshBasicMaterial(),1,engine.Vector3(0,5,0));
world.add(sphere);
```
currently these are the only bodies, but I will update it such that there are more body types to choose from
## will this take away any functionality from cannon.js or three.js?
No. you cen get all of the world related things from the base engine by just doing engine.something
```javascript
engine.camera //camera
engine.renderer //renderer
...
```
or if you just want to get the three portion of a body, you can do body.mesh. if you want the cannon portion it is body.physicsBody.
