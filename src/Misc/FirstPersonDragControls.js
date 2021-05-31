class FirstPersonDragControls{
    constructor(camera,domElement){
        this.object = camera;
        this.domElement = domElement;
        this.rotateSpeed = 1;
        this.maxPolarAngle = Math.PI/2;
        this.minPolarAngle = -Math.PI/2;
        this.maxAzimuthAngle = Infinity;
        this.minAzimuthAngle = -Infinity;
        let prevPos = {
            x:0,
            y:0
        }
        let moveAmt = {        
            x:0,
            y:0
        }
        let currentPos = {
            x:0,
            y:0
        }
        let clicked = false;
        let cam = this.object;
        cam.rotation.order = 'YXZ';
        let t = this;
        this.domElement.onmousedown = function(){
            clicked = true;
            prevPos.x = event.pageX;
            prevPos.y = event.pageY;
        }
        this.domElement.onmouseup = function(){
            clicked = false;
        }
        this.domElement.onmousemove = function(){
            if(clicked){
                currentPos.x = event.pageX;
                currentPos.y = event.pageY;
                moveAmt.x = currentPos.x-prevPos.x;
                moveAmt.y = currentPos.y-prevPos.y;
                cam.rotation.y-=moveAmt.x/120*t.rotateSpeed;
                cam.rotation.x-=moveAmt.y/120*t.rotateSpeed;
                if(cam.rotation.x<t.minPolarAngle){
                    cam.rotation.x = t.minPolarAngle;
                }
                if(cam.rotation.x>t.maxPolarAngle){
                    cam.rotation.x = t.maxPolarAngle;
                }
                if(cam.rotation.y<t.minAzimuthAngle){
                    cam.rotation.y = t.minAzimuthAngle;
                }
                if(cam.rotation.y>t.maxAzimuthAngle){
                    cam.rotation.y = t.maxAzimuthAngle;
                }
                prevPos.x = currentPos.x;
                prevPos.y = currentPos.y;
                cam.rotation.z = 0;
            }
        }
    }
    forward(distance){
        let v = new THREE.Vector3();
        this.object.getWorldDirection(v);
        this.object.position.addScaledVector(v,distance);
    }
    backward(distance){
        let v = new THREE.Vector3();
        this.object.getWorldDirection(v);
        this.object.position.addScaledVector(v,-distance);
    }
    left(distance){
        let v = new THREE.Vector3();
        this.object.getWorldDirection(v);
        let r = new THREE.Vector3(0,1,0);
        r.applyQuaternion(this.object.quaternion);
        v.applyAxisAngle(r,Math.PI/2);
        this.object.position.addScaledVector(v,distance);
    }
    right(distance){
        let v = new THREE.Vector3();
        this.object.getWorldDirection(v);
        let r = new THREE.Vector3(0,1,0);
        r.applyQuaternion(this.object.quaternion);
        v.applyAxisAngle(r,Math.PI/2);
        this.object.position.addScaledVector(v,-distance);
    }
}
export {FirstPersonDragControls};