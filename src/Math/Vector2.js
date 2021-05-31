class Vector2{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
        this._changeCallback = function(){};
    }
    /**
     * 
     * @param {Vector2} v 
     */
    copy(v){
        if(typeof v.x=='function'){
            this.x = v.x();
            this.y = v.y();
        }else{
            this.x = v.x;
            this.y = v.y;
        }
        this._changeCallback();
        return this;
    }
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    set(x, y){
        this.x = x;
        this.y = y;
        this._changeCallback();
        return this;
    }
    lengthSq(){
        return this.x*this.x+this.y*this.y;
    }
    length(){
        return Math.sqrt(lengthSq);
    }
    /**
     * 
     * @param {Number} s 
     */
    multiplyScalar(s){
        this.x*=s;
        this.y*=s;
        this._changeCallback();
        return this;
    }
    normalize(){
        let l = this.lengthSq();
        if(l==0){
            this.x = 0;
            this.y = 0;
        }else if(l==1){

        }else{
            l = 1/Math.sqrt(l);
            this.multiplyScalar(l);
        }
        this._changeCallback();
        return this;
    }
    manhattanLength(){
        return this.x+this.y;
    }
    /**
     * 
     * @param {Vector2} v 
     */
    distanceToSquared(v){
        return (this.x-v.x)**2+(this.y-v.y)**2;
    }
    /**
     * 
     * @param {Vector2} v 
     */
    distanceTo(v){
        return Math.sqrt(this.distanceToSquared(v));
    }
    /**
     * 
     * @param {Vector2} v 
     */
    manhattanDistanceTo(v){
        return Math.abs(this.x-v.x)+Math.abs(this.y-v.y);
    }
    /**
     * 
     * @param {Vector2} a 
     * @param {Vector2} b 
     */
    addVectors(a,b){
        this.x = a.x+b.x;
        this.y = a.y+b.y;
        this._changeCallback();
        return this;
    }
    /**
     * 
     * @param {Vector2} v 
     */
    add(v){
        return this.addVectors(this,v);;
    }
    /**
     * 
     * @param {Vector2} a 
     * @param {Vector2} b 
     */
    subVectors(a,b){
        this.x = a.x-b.x;
        this.y = a.y-b.y;
        this._changeCallback();
        return this;
    };
    /**
     * 
     * @param {Vector2} v 
     */
    sub(v){
        return this.subVectors(this,v);
    }
    /**
     * 
     * @param {Number} length 
     */
    setLength(length){
        this.normalize();
        return this.multiplyScalar(length);
    }
    /**
     * 
     * @param {Vector2} v 
     * @param {Number} s 
     */
    addScaledVector(v, s){
        v.multiplyScalar(s);
        return this.add(v);
    }
    invert(){
        return this.multiplyScalar(-1);
    }
    clone(){
        return new this.constructor(this.x,this.y);
    }
    /**
     * 
     * @param {Vector2} v 
     */
    isEqualTo(v){
        return this.x===v.x&&this.y===v.y;
    }
    /**
     * 
     * @param {Vector2} v1 
     * @param {Vector2} v2 
     */
    directionTo(v1,v2){
        this.subVectors(v2,v1);
        return this.normalize();;
    }
    toString(){
        return `{x:${this.x},y:${this.y}}`;
    }
    /**
     * 
     * @param {Vector2} v 
     * @param {Number} delta 
     */
    isAlmostEqualTo(v, delta){
        return Math.abs(this.x-v.x)>delta&&Math.abs(this.y-v.y)>delta;
    }
    /**
     * 
     * @param {Number} s 
     */
    setScalar(s){
        this.x = s;
        this.y = s;
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
        this._changeCallback();
        return this;

    }
}
export {Vector2};