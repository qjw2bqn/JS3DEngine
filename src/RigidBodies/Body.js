import { Shape } from '../Shapes/Shape.js';
import { RigidBody } from './RigidBody.js';
import { Vector3 } from '../Math/Vector3.js';
import { Quaternion } from '../Math/Quaternion.js';
import { BoxShape } from '../Shapes/BoxShape.js';
import { ConeShape } from '../Shapes/ConeShape';
import { CylinderShape } from '../Shapes/CylinderShape';
import { CapsuleShape } from '../Shapes/CapsuleShape';
class Body extends RigidBody{
    /**
     * 
     * @param {Object} parameters 
     * @param {Shape} parameters.shape
     * @param {Number} [parameters.mass]
     * @param {Vector3} [parameters.position]
     * @param {Quaternion} [parameters.rotation]
     * @param {Number} [parameters.collisionGroup] - can also be parameters.group
     * @param {Number} [parameters.collisionMask] - can also be parameters.mask
     * @param {Number} [parameters.friction]
     * @param {Number} [parameters.restitution]
     * @param {Number} [parameters.rollingFriction]
     */
    constructor(parameters){
        super();
        let shape = parameters.shape;
        if(shape==undefined){
            console.error('JS3D.Body: shape must be defined');
            return false;
        }
        if(!shape instanceof Shape){
            console.error('JS3D.Body: shape must be a type of JS3D.Shape');
            return false;
        }
        let position = parameters.position||new Vector3();
        let rotation = parameters.rotation||parameters.quaternion||new Quaternion();
        let friction = parameters.friction||0.5;
        let rollingFriction = parameters.rollingFriction||0;
        let restitution = parameters.restitution||0;
        let mass = parameters.mass||shape.mass||0;
        let geometry = shape.geometry;
        let material = shape.material;
        if(parameters.density){
            if(shape instanceof BoxShape){
                this.mass = shape.geometry.parameters.width*shape.geometry.parameters.height*shape.geometry.parameters.depth
            }else if(shape instanceof SphereShape){
                this.mass = shape.geometry.parameters.radius*(4/3)*Math.PI
            }else if(shape instanceof CylinderShape){
                let r = shape.geometry.parameters.radius||shape.geometry.parameters.radiusTop;
                this.mass = Math.PI*r**2*shape.geometry.parameters.height;
            }else if(shape instanceof ConeShape){
                this.mass = shape.geometry.parameters.radius**2*Math.PI*shape.geometry.parameters.height/3;
            }else if(shape instanceof CapsuleShape){
                this.mass = Math.PI*shape.geometry.parameters.radiusTop**2*((4/3)*shape.geometry.parameters.radiusTop + shape.geometry.parameters.height);
            }else{
                console.error('shape type not supported with density');
                if(parameters.density==0){
                    this.mass = 0;
                }else{
                    this.mass = mass/parameters.density;
                }
            }
            this.mass*=parameters.density;
        }else{
            this.mass = mass;
        }

        this.gravityAffected = true;
        let physicsShape = shape.physicsBodyShape;
        this.mesh = new THREE.Mesh(geometry,material);
        Object.defineProperty(this,'initPosition',{value:position});
        Object.defineProperty(this,'initRotation',{value:rotation});

        this.debugBody = shape.debugBody||new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}));
        this.group = parameters.group||parameters.collisionGroup;
        this.mask = parameters.mask||parameters.collisionMask;
        this.mesh.position.copy(position);
        this.mesh.quaternion.copy(rotation);
        this.debugBody.position.copy(position);
        this.debugBody.quaternion.copy(rotation);
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(position.x,position.y,position.z));
        transform.setRotation(new Ammo.btQuaternion(rotation.x,rotation.y,rotation.z,rotation.w));
        let ms = new Ammo.btDefaultMotionState(transform);
        let localInertia = new Ammo.btVector3(0,0,0);
        physicsShape.calculateLocalInertia(this.mass,localInertia);
        this.shape = shape;
        let rbInfo = new Ammo.btRigidBodyConstructionInfo(this.mass,ms,physicsShape,localInertia);
        this.physicsBody = new Ammo.btRigidBody(rbInfo);
        this.physicsBody.setFriction(friction);
        this.physicsBody.setRestitution(restitution);
        this.physicsBody.setRollingFriction(rollingFriction);
    }
    /**
     * @param {Number} mass
     */
    setMass(mass){
        this.physicsBody.setMassProps(mass,new Ammo.btVector3(0,0,0));
    }

    /**
     * @param {Number} scaleFac
     */
    scale(scaleFac){
        this.shape.physicsBodyShape.setLocalScaling(new Ammo.btVector3(scaleFac,scaleFac,scaleFac));
        this.debugBody.scale.setScalar(scaleFac);
        this.mesh.scale.setScalar(scaleFac);
    }
}
export {Body};