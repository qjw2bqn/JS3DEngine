class RigidBody{
    constructor(){
        this.shape;
        this.mesh;
        this.debugBody;
        this.physicsBody;
    }
    setShadows(cast = true,receive = true){
        this.mesh.castShadow = cast;
        this.mesh.receiveShadow = receive;
        return this;
    }
}
export {RigidBody};