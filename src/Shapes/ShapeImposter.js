import {Shape} from './Shape.js';
import {ENUMS} from '../Misc/ENUMS.js';
import {BoxBufferGeometry} from '../Geometries/BoxBufferGeometry.js';
import {CylinderBufferGeometry} from "../Geometries/CylinderBufferGeometry";
import {ConeBufferGeometry} from '../Geometries/ConeBufferGeometry';
import {CapsuleBufferGeometry} from '../Geometries/ConeBufferGeometry';
class ShapeImpostor extends Shape{
    /**
     * 
     * @param {Object} parameters
     * @param {THREE.BufferGeometry} parameters.geometry 
     * @param {Object} parameters.shapeOptions
     * @param {Number} parameters.shapeOptions.shapeType 
     * @param {THREE.Material} [parameters.material] 
     */
    constructor(parameters){
        super();
        parameters = parameters||{};
        this.geometry = parameters.geometry;
        if(this.geometry==undefined){
            console.error("JS3D.ShapeImpostor: must input a geometry");
            return;
        };
        let shapeOpts = parameters.shapeOptions;
        if(shapeOpts==undefined||!shapeOpts instanceof Object){
            console.error('JS3D.ShapeImpostor: must input an object of physicsBody shape options');
            return;
        }
        this.material = parameters.material||new THREE.MeshBasicMaterial();
        let r,h,he;
        let pts,ind,pt1,pt2,pt3,d;
        switch(shapeOpts.shapeType){
            case ENUMS.SHAPES.BoxImpostor:
                he = shapeOpts.halfExtents;
                if(he==undefined){
                    console.error('JS3D.ShapeImpostor: BoxImpostor shape type must have a half extents vector');
                    return;
                }
                this.physicsBodyShape = new Ammo.btBoxShape(new Ammo.btVector3(he.x,he.y,he.z));
                this.debugBody = new THREE.Mesh(new BoxBufferGeometry(he.x*2,he.y*2,he.z*2),new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}));
                break;
            case ENUMS.SHAPES.SphereImpostor:
                r = shapeOpts.radius;
                if(r==undefined){
                    console.error('JS3D.ShapeImpostor: SphereImpostor shape type must have a radius');
                    return;
                }
                this.physicsBodyShape = new Ammo.btSphereShape(r);
                this.debugBody = new THREE.Mesh(new THREE.SphereBufferGeometry(r),new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}));
                break;
            case ENUMS.SHAPES.CylinderImpostor:
                r = shapeOpts.radius;
                h = shapeOpts.height;
                if(r==undefined){
                    console.error('JS3D.ShapeImpostor: CylinderImpostor shape must have a radius');
                    return;
                }
                if(h==undefined){
                    console.error('JS3D.ShapeImpostor: CylinderImpostor shape must have a height');
                    return;
                }
                this.physicsBodyShape = new Ammo.btCylinderShape(new Ammo.btVector3(r,h/2,r));
                this.debugBody = new THREE.Mesh(new CylinderBufferGeometry(r,h),new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}));
                break;
            case ENUMS.SHAPES.ConeImpostor:
                r = shapeOpts.radius;
                h = shapeOpts.height;
                if(r==undefined){
                    console.error('JS3D.ShapeImpostor: ConeImpostor shape must have a radius');
                    return;
                }
                if(h==undefined){
                    console.error('JS3D.ShapeImpostor: ConeImpostor shape must have a height');
                    return;
                }
                this.physicsBodyShape = new Ammo.btConeShape(r,h);
                this.debugBody = new THREE.Mesh(new ConeBufferGeometry(r,h),new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}));
                break;
            case ENUMS.SHAPES.CapsuleImpostor:
                r = shapeOpts.radius;
                h = shapeOpts.height;
                if(r==undefined){
                    console.error('JS3D.ShapeImpostor: CapsuleImpostor shape must have a radius');
                    return;
                }
                if(h==undefined){
                    console.error('JS3D.ShapeImpostor: CapsuleImpostor shape must have a height');
                    return;
                }
                this.physicsBodyShape = new Ammo.btCapsuleShape(r,h);
                this.debugBody = new THREE.Mesh(new CapsuleBufferGeometry(r,r,h,12,1,3,3),new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}));
                break;
            case ENUMS.SHAPES.TrimeshImpostor:
                pts = shapeOpts.points,
                ind = shapeOpts.faces,
                d = shapeOpts.dynamic,
                pt1 = new Ammo.btVector3(),
                pt2 = new Ammo.btVector3(),
                pt3 = new Ammo.btVector3;
                let points = [];
                if(pts==undefined||!pts instanceof Array){
                    console.error('JS3DAmmo.ShapeImpostor: TrimeshImpostor must have an array of points (JS3DAmmo.Vector3)');
                    return;
                }
                if(ind==undefined||!ind instanceof Array){
                    console.error('JS3DAmm0.ShapeImpostor: TrimeshImpostor must have an array of faces (JS3DAmmo.Vector3)');
                    return;
                }
                let b = new Ammo.btTriangleMesh();
                for(var face = 0;face<ind.length;face++){
                    pt1.setValue(pts[ind[face].x].x,pts[ind[face].x].y,pts[ind[face].x].z);
                    pt2.setValue(pts[ind[face].y].x,pts[ind[face].y].y,pts[ind[face].y].z);
                    pt3.setValue(pts[ind[face].z].x,pts[ind[face].z].y,pts[ind[face].z].z);
                    b.addTriangle(pt1,pt2,pt3,true);
                    points.push(pts[ind[face].x].x,pts[ind[face].x].y,pts[ind[face].x].z);
                    points.push(pts[ind[face].y].x,pts[ind[face].y].y,pts[ind[face].y].z);
                    points.push(pts[ind[face].z].x,pts[ind[face].z].y,pts[ind[face].z].z);
                }
                let positions = new THREE.Float32BufferAttribute(new Float32Array(points),3);
                let dG = new THREE.BufferGeometry();
                dG.setAttribute('position',positions);
                this.debugBody = new THREE.Mesh(dG,new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true}));
                let ps = new Ammo.btBvhTriangleMeshShape(b,d,true);
                if(d){
                    this.physicsBodyShape = new Ammo.btCompoundShape();
                    this.physicsBodyShape.addChildShape(new Ammo.btTransform(new Ammo.btQuaternion(0,0,0,1),new Ammo.btVector3(0,0,0)),ps);
                }else{
                    this.physicsBodyShape = ps;
                }
                break;
            default:
                console.error('JS3D.ShapeImpostor: the inputted shape type is not one that is recognised.');
                return;
        }
        this.physicsBodyShape.setMargin(0.05);
    }
}
export {ShapeImpostor};