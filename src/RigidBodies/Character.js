import { RigidBody } from "./RigidBody";
import { Vector3 } from "../Math/Vector3";


class Character extends RigidBody{
    
    /**
     * 
     * @param {Object} parameters 
     * @param {Number} [parameters.height]
     * @param {Number} [parameters.radius]
     * @param {Vector3} [parameters.position]
     * @param {THREE.Material} [parameters.material]
     * @param {Boolean} [parameters.CCD] - can also be parameters.continuousCollision
     * @param {Number} [parameters.group] - can also be parameters.collisionGroup
     * @param {Number} [parameters.mask] - can also be parameters.collisionMask
     * @param {THREE.Mesh} [parameters.model]
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        let height = parameters.height||2;
        let radius = parameters.radius||1;
        let geom = new THREE.BoxBufferGeometry(Math.sqrt((radius**2)*2),height+2*radius,Math.sqrt((radius**2)*2));
        let material = parameters.material||new THREE.MeshBasicMaterial();
        let position = parameters.position||new Vector3();
        Object.defineProperty(this,'initPosition',{value:position});
        Object.defineProperty(this,'initRotation',{value:new THREE.Quaternion(0,0,0,1)});
        Object.defineProperty(this,'gravityAffected',{value:true});
        let CCD = parameters.continuousCollision||parameters.CCD||false;
        let model = parameters.model;
        let mass;
        this.group = parameters.group||parameters.collisionGroup;
        this.mask = parameters.mask||parameters.collisionMask;
        if(parameters.mass<=0||parameters.mass==undefined){
            mass = 1;
        }else{
            mass = parameters.mass;
        }
        this.mesh = model||new THREE.Mesh(geom,material);
        this.debugBody = new THREE.Group();
        let longBand1S = new THREE.Shape();
        longBand1S.moveTo(-radius,-height/2);
        longBand1S.lineTo(-radius,height/2);
        longBand1S.absarc(0,height/2,radius,Math.PI,0,true);
        longBand1S.moveTo(radius,height/2);
        longBand1S.lineTo(radius,-height/2);
        longBand1S.absarc(0,-height/2,radius,0,Math.PI,true);
        longBand1S.lineTo(-radius,-height/2);
        let geo = new THREE.ShapeGeometry(longBand1S,20);
        let edges = new THREE.EdgesGeometry(geo);
        let longBand1 = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color:0xffffff}));
        let longBand2 = longBand1.clone();
        longBand2.rotation.y = Math.PI/2;
        this.debugBody.add(longBand1);
        this.debugBody.add(longBand2);
        for(let yV = Math.round(-height/2);yV<=Math.round(height/2);yV++){
            let geome = new THREE.CircleGeometry(radius,16);
            let cEdg = new THREE.EdgesGeometry(geome);
            let band = new THREE.LineSegments(cEdg,new THREE.LineBasicMaterial({color:0xffffff}));
            band.position.y = yV;
            band.rotation.x = Math.PI/2;
            this.debugBody.add(band);
        }
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(position.x,position.y,position.z));
        transform.setRotation(new Ammo.btQuaternion(0,0,0,1));
        let ms = new Ammo.btDefaultMotionState(transform);
        this.physicsBodyShape = new Ammo.btCapsuleShape(radius,height);
        this.physicsBodyShape.setMargin(0.05);
        let localInertia = new Ammo.btVector3(0,0,0);
        this.physicsBodyShape.calculateLocalInertia(mass,localInertia);
        let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass,ms,this.physicsBodyShape,localInertia);
        this.physicsBody = new Ammo.btRigidBody(rbInfo);
        this.physicsBody.setAngularFactor(new Ammo.btVector3(0,0,0));
        this.physicsBody.setActivationState(4);
        if(CCD){
            this.physicsBody.setCcdMotionThreshold(1);
            this.physicsBody.setCcdSweptSphereRadius(height/2+radius);
        }
    }
}
export {Character};