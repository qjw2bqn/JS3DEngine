class Vector3{
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor(x = 0, y = 0, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
        this._changeCallback = function(){};
    }
    /**
     * 
     * @param {Vector3} v 
     */
    copy(v){
        if(typeof v.x == 'function'){
            this.x = v.x();
            this.y = v.y();
            this.z = v.z();
        }else{
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        }
        this._changeCallback();
        return this;
    }
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    set(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
        this._changeCallback();
        return this;
    }
    /**
     * 
     * @param {Vector3} a 
     * @param {Vector3} b 
     */
    addVectors(a, b){
        this.x = a.x+b.x;
        this.y = a.y+b.y;
        this.z = a.z+b.z;
        this._changeCallback();
        return this;
    }
    /**
     * 
     * @param {Vector3} v 
     */
    add(v){
        return this.addVectors(this,v);
    }
    /**
     * 
     * @param {Vector3} a 
     * @param {Vector3} b 
     */
    subVectors(a, b){
        this.x = a.x-b.x;
        this.y = a.y-b.y;
        this.z = a.z-b.z;
        this._changeCallback();
        return this;
    }
    /**
     * 
     * @param {Vector3} v 
     */
    sub(v){
        return this.subVectors(this,v);
    }
    /**
     * 
     * @param {Number} scalar 
     */
    multiplyScalar(scalar){
        this.x*=scalar;
        this.y*=scalar;
        this.z*=scalar;
        this._changeCallback();
        return this;
    }
    lengthSq(){
        return this.x*this.x+this.y*this.y+this.z*this.z;
    }
    length(){
        return Math.sqrt(this.lengthSq);
    }
    manhattanLength(){
        return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z);
    }
    distanceToSquared(v){
        return (this.x-v.x)**2+(this.y-v.y)**2+(this.z-v.z)**2;
    }
    /**
     * 
     * @param {Vector3} v 
     */
    distanceTo(v){
        return Math.sqrt(this.distanceToSquared(v));
    }
    /**
     * 
     * @param {Vector3} v 
     */
    manhattanDistanceTo(v){
        return Math.abs(this.x-v.x)+Math.abs(this.y-v.y)+Math.abs(this.z-v.z);
    }
    normalize(){
        let l = this.lengthSq();
        if(l===0){
            this.set(0,0,0);
        }else if(l==1){

        }else{
            this.multiplyScalar(1/Math.sqrt(l));
        }
        this._changeCallback();
        return this;
    }
    /**
     * 
     * @param {Number} length 
     */
    setLength(length){
        this.normalize();
        this.multiplyScalar(length);
        return this;
    }
    /**
     * 
     * @param {Vector3} v 
     * @param {Number} s 
     */
    addScaledVector(v, s){
        v.multiplyScalar(s);
        return this.add(v);
    }
    invert(){
        this.x*=-1;
        this.y*=-1;
        this.z*=-1;
        return this;
    }
    clone(){
        return new this.constructor(this.x, this.y, this.z);
    }
    /**
     * 
     * @param {Vector3} v 
     */
    isEqualTo(v){
        return this.x===v.x&&this.y===v.y&&this.z===v.z;    
    }
    /**
     * 
     * @param {Vector3} v1 
     * @param {Vector3} v2 
     */
    directionTo(v1,v2){
        this.subVectors(v2,v1);
        return this.normalize();
    }
    toString(){
        return '{x:'+this.x+',y:'+this.y+',z:'+this.z+'}';
    }
    /**
     * 
     * @param {Vector3} v 
     * @param {Number} delta 
     */
    isAlmostEqualTo(v,delta){
        return Math.abs(this.x-v.x)<delta&&Math.abs(this.y-v.y)<delta&&Math.abs(this.z-v.z)<delta;
    }
    /**
     * 
     * @param {Number} scalar 
     */
    setScalar(scalar){
        if(typeof scalar!='number'||scalar==undefined){
            console.error('JS3DAmmo.Vector3: scalar value must be a number');
            return this;
        }
        this.x = this.y = this.z = scalar;
        this._changeCallback();
        return this;
    }
    /**
     * 
     * @param {Array<Number>} array 
     * @param {Number} offset 
     */
    setFromArray(array,offset = 0){
        this.x = array[offset];
        this.y = array[offset+1];
        this.z = array[offset+2];
        this._changeCallback();
        return this;
    }
}
export {Vector3};