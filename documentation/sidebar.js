window.onload = function(){
    let sidebarDiv = document.getElementsByClassName('sidebar')[0];
    let mathSubSection = createTag('div',{className:'subdivider',innerHTML:'Math'});
    let mathWrapper = createTag('div',{className:'anchorWrapper'});
    let Vector3 = createAnchor('Math','Vector3');
    let Vector2 = createAnchor('Math','Vector2');
    let Quaternion = createAnchor('Math','Quaternion');
    let Transform = createAnchor('Math','Transform');
    addTo(mathWrapper,[Vector3,Vector2,Quaternion,Transform]);
    addTo(sidebarDiv,[mathSubSection,mathWrapper]);
    let geometrySubSection = createTag('div',{className:'subdivider',innerHTML:'Geometries'});
    let geometryWrapper = createTag('div',{className:'anchorWrapper'});
    let BoxBufferGeometry = createAnchor('Geometries','BoxBufferGeometry');
    let CylinderBufferGeometry = createAnchor('Geometries','CylinderBufferGemoetry');
    let ConeBufferGeometry = createAnchor('Geometries','ConeBufferGeometry');
    let CapsuleBufferGeometry = createAnchor('Geometries','CapsuleBufferGeometry');
    let BufferGeometryUtils = createTag('a',{href:'https://threejs.org/docs/#examples/en/utils/BufferGeometryUtils',innerHTML:'BufferGeometryUtils'})
    addTo(geometryWrapper,[BoxBufferGeometry,CylinderBufferGeometry,ConeBufferGeometry,CapsuleBufferGeometry,BufferGeometryUtils]);
    addTo(sidebarDiv,[geometrySubSection,geometryWrapper]);
    let shapeSubSection = createTag('div',{className:'subdivider',innerHTML:'Shapes'});
    let shapeWrapper = createTag('div',{className:'anchorWrapper'});
    let BoxShape = createAnchor('Shapes','BoxShape');
    let SphereShape = createAnchor('Shapes','SphereShape');
    let CylinderShape = createAnchor('Shapes','CylinderShape');
    let ConeShape = createAnchor('Shapes','ConeShape');
    let CapsuleShape = createAnchor('Shapes','CapsuleShape');
    let ConvexPolyhedron = createAnchor('Shapes','ConvexPolyhedron');
    let Trimesh = createAnchor('Shapes','Trimesh');
    let CompoundShape = createAnchor('Shapes','CompoundShape');
    let ShapeImpostor = createAnchor('Shapes','ShapeImpostor');
    let HeightFeild = createAnchor('Shapes','HeightFeild');
    let Shape = createAnchor('Shapes','Shape');
    addTo(shapeWrapper,[BoxShape,SphereShape,CylinderShape,ConeShape,CapsuleShape,ConvexPolyhedron,Trimesh,CompoundShape,ShapeImpostor,HeightFeild,Shape]);
    addTo(sidebarDiv,[shapeSubSection,shapeWrapper]);
    let rigidbodySubSection = createTag('div',{className:'subdivider',innerHTML:'RigidBodies'});
    let rigidbodyWrapper = createTag('div',{className:'anchorWrapper'});
    let Body = createAnchor('RigidBodies','Body');
    let Character = createAnchor('RigidBodies','Character');
    let InfPlane = createAnchor('RigidBodies','InfPlane');
    let RigidBody = createAnchor('RigidBodies','RigidBody');
    addTo(rigidbodyWrapper,[Body,Character,InfPlane,RigidBody]);
    addTo(sidebarDiv,[rigidbodySubSection,rigidbodyWrapper]);
    let miscSubSection = createTag('div',{className:'subdivider',innerHTML:'Miscellaneous'});
    let miscWrapper = createTag('div',{className:'anchorWrapper'});
    let World = createAnchor('Misc','World');
    let ENUMS = createAnchor('Misc','ENUMS');
    let FirstPerson = createAnchor('Misc','FirstPersonDragControls');
    let CharacterController = createAnchor('Misc','CharacterController');
    addTo(miscWrapper,[World,ENUMS,FirstPerson,CharacterController]);
    addTo(sidebarDiv,[miscSubSection,miscWrapper]);
    delete window.onload;
    delete createTag;
    delete createAnchor;
    delete addTo;
};
/**
 * 
 * @param {HTMLElement} parent 
 * @param {Array <HTMLElement>} children 
 */
function addTo(parent,children){
    for(var x in children){
        parent.appendChild(children[x]);
    }
}
/**
 * 
 * @param {String} subFolder 
 * @param {String} file 
 */
function createAnchor(subFolder,file){
    return createTag('a',{href:'../'+subFolder+'/'+file+'.html',innerHTML:file});
}
/**
 * 
 * @param {String} type 
 * @param {String} otherProperties 
 */
function createTag(type,otherProperties){
    let tag = document.createElement(type);
    for(var x in otherProperties){
        tag[x] = otherProperties[x];
    }
    return tag;
}