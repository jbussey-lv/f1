import Body from "../physics/body";
import { mod } from "../../helper";
import Vec from "../../vec";

export default abstract class AbstractShape{
    body: Body;
    position: Vec;
    mass: number;
    _angle: number;
    color: string;
    id: string = crypto.randomUUID();

    constructor(
        body: Body,
        position: Vec, // refers to its center
        mass: number,
        angle: number,
        color: string
    ){
        this.body = body;
        this.position = position;
        this.mass = mass;
        this._angle = angle;
        this.color = color;
    }

    abstract get com(): Vec;

    abstract get momentOfInertia(): number;

    getRelativePositionUnrotated(): Vec {
        return this.position.subtract(this.body.com)
    }

    getArm(): Vec {
        return this.getRelativePositionUnrotated()
                   .rotateByAng(this.body.angle);
    }

    getAbsoluteAngle(): number {
        return this.body.angle + this.ang;
    }

    getAbsolutePosition(): Vec {
        return this.getArm()
                   .add(this.body.position); // Rotate around body's angle and translate to body's position
    }

    getTangentialVelocity(): Vec {
        const arm = this.getArm();
        return new Vec(-arm.y, arm.x) // Perpendicular vector
            .multiply(this.body.angulerVelocity);
    }

    getAbsoluteVelocity(): Vec {
        return this.getTangentialVelocity().add(this.body.velocity);
    }

    get ang(): number {
        return this._angle;
    }

    set ang(val: number){
        this._angle = mod(val, Math.PI * 2);
    }
     
}