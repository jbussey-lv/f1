export default class Vec {
    // 1. Mark properties as readonly to block compile-time mutations
    public readonly x: number;
    public readonly y: number;
  
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static zero(): Vec {
        return new Vec(0,0);
    }

    static fromXandY(x: number, y: number): Vec {
        return new Vec(x, y);
    }

    static fromMagAndAng(mag: number, ang: number): Vec {
        const x = mag * Math.sin(ang);
        const y = mag * Math.cos(ang);
        return new Vec(x, y);
    }

    static unitFromAng(ang: number): Vec {
        return this.fromMagAndAng(1, ang);
    }

    get ang(): number{
        return Math.atan2(this.y, this.x)
    }

    get mag(): number{
        return Math.sqrt(this.x**2 + this.y**2);
    }

    rotateToAng(ang: number): Vec {
        return Vec.fromMagAndAng(this.mag, ang);
    }

    rotateByAng(ang: number): Vec {
        return this.rotateToAng(this.ang + ang);
    }

    projectToAng(ang: number): Vec {
        const v = this;
        const u = Vec.unitFromAng(ang);
        return u.multiply(v.dot(u));
    }

    magAtAng(ang: number): number {
        return this.projectToAng(ang).mag;
    }

    toUnit(){
        return Vec.unitFromAng(this.ang);
    }

    add(v: Vec): Vec {
        return new Vec(this.x + v.x, this.y + v.y)
    }

    addX(x: number): Vec{
        return new Vec(this.x + x, this.y);
    }

    addY(y: number): Vec{
        return new Vec(this.x, this.y + y);
    }

    addMultiple(vec: Vec, coef: number): Vec{
        const multiple = vec.multiply(coef)
        return this.add(multiple);
    }

    subtract(vec: Vec): Vec {
        return new Vec(this.x - vec.x, this.y - vec.y);
    }

    multiply(coef: number): Vec{
        return new Vec(this.x * coef, this.y * coef);
    }

    divide(coef: number): Vec{
        return new Vec(this.x / coef, this.y / coef);
    }

    flip(): Vec {
        return new Vec(-1 * this.x, -1 * this.y);
    }

    dot(v: Vec): number {
        const u = this;
        return (u.x * v.x) + (u.y * v.y);
    }

    cross(v: Vec): number {
        const u = this;
        return (u.x * v.y) - (u.y * v.x);
    }

    equal(v: Vec): boolean {
        return this.x === v.x && this.y === v.y;
    }

    different(v: Vec): boolean{
        return !this.equal(v);
    }


}