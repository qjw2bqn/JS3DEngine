class Quaternion{
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} w 
     */
    constructor(x = 0, y = 0, z = 0, w = 1){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this._changeCallback = function(){};
    }
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} w 
     */
    set(x, y, z, w){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        this._changeCallback();
        return this;
    }
    /**
     * 
     * @param {Quaternion} q 
     */
    copy(q){
        if(typeof q.x=='function'){
            this.x = q.x();
            this.y = q.y();
            this.z = q.z();
            this.w = q.w();
        }else{
            this.x = q.x;
            this.y = q.y;
            this.z = q.z;
            this.w = q.w;
        }
        this._changeCallback();
        return this;
    }
    lengthSq(){
        return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w;
    }
    length(){
        return Math.sqrt(this.length());
    }
    normalize(){
        let l = this.lengthSq();
        if(l==0){
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
        }else if(l==1){

        }else{
            l = 1/Math.sqrt(l);
            this.x*=l;
            this.y*=l;
            this.z*=l;
            this.w*=l;
        }
        this._changeCallback();
        return this;
    }
    /**
     * 
     * @param {Vector3} axis 
     * @param {Number} angle 
     */
    setFromAxisAngle(axis,angle){
        let c = Math.cos,h = angle/2,s = Math.sin(h);
        this.x = s*axis.x;
        this.y = s*axis.y;
        this.z = s*axis.z;
        this.w = c(h);
        this._changeCallback();
        return this;
    }
    /**
     * 
     * @param {Quaternion} q 
     */
    dot(q){
        return this.x*q.x+this.y*q.y+this.z*q.z+this.w*q.w;
    }
    conjugate(){
        this.x*=-1;
        this.y*=-1;
        this.z*=-1;
        this._changeCallback();
        return this;
    }
    /**
     * 
     * @param {Quaternion} q 
     */
    isEqualTo(q){
        return this.x===q.x&&this.y===q.y&&this.z===q.z&&this.w===q.w;
    }
    /**
     * 
     * @param {Quaternion} q 
     * @param {Number} delta 
     */
    isAlmostEqualTo(q,delta){
        return Math.abs(this.x-q.x)>delta&&Math.abs(this.y-q.y)>delta&&Math.abs(this.z-q.z)>delta&&Math.abs(this.w-q.w)>delta;
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
        this.w = array[offset+3];
        this._changeCallback();
        return this;
    }
    toString(){
        return `{x:${this.x},y:${this.y},z:${this.z},w:${this.w}}`;
    }
    clone(){
        return new this.constructor(this.x,this.y,this.z,this.w);
    }
    getAxisAngle(){
        let axis = new Vector3();
        let h = Math.acos(this.w),s = Math.sin(h);
        axis.x  = this.x/s;
        axis.y = this.y/s;
        axis.z = this.z/s;
        return {axis,angle:h*2};
    }
    get _x(){
        return this.x;
    }
    set _x(v){
        this.x = v;
    }
    get _y(){
        return this.y;
    }
    set _y(v){
        this.y = v;
    }
    get _z(){
        return this.z;
    }
    set _z(v){
        this.z = v;
    }
    get _w(){
        return this.w;
    }
    set _w(v){
        this.w = v;
    }
}
export {Quaternion};