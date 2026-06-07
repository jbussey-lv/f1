import Circle from "../shapes/circle";
import Body from "../physics/body"
import LeverArm from "../physics/lever-arm";
import Vec from "../../vec";

export default class Wheel extends Circle{

    angVel: number               = 0;
    engineMaxTorque: number      = 1000;
    anchorSpringConstant: number = 100000;

    engineLinked: boolean;

    _anchorPoint: Vec | null  = null;

    constructor(
        body: Body, 
        radius: number, 
        position: Vec, 
        mass: number,
        engineLinked: boolean
    ){
        super(
            body,
            radius,
            position,
            mass
        )
        this.engineLinked = engineLinked;
    }

    get anchorPoint(): Vec {
        if(this._anchorPoint === null){
            this._anchorPoint = this.absolutePosition;
        }
        return this._anchorPoint;
    }

    set anchorPoint(vector: Vec){
        this._anchorPoint = vector;
    }

    get roadFrictionSpringMag(): number {
        return this.anchorPoint.x - this.absolutePosition.x;
    }

    get roadFrictionForceMag(): number {

        const dampCoef = 8000;
        const slipSpeed = this.slipSpeed;

        return this.roadFrictionSpringMag * this.anchorSpringConstant
               + slipSpeed * dampCoef;
    }

    get roadFrictionTorque(): number {
        return this.roadFrictionForceMag * this.radius
    }

    get leverArm(): LeverArm {
        return new LeverArm(
            this.position,
            new Vec(this.roadFrictionForceMag,0)
        )
    }

    getEngineTorque(throttle: number): number {
        if(!this.engineLinked){return 0}

        return throttle * this.engineMaxTorque;
    }

    get slipSpeed(): number {
        const rollVelocity = this.angVel * this.radius;
        const linearVelocity = this.absoluteVelocity.x;
        return linearVelocity - rollVelocity;
    }

    update(timeStep: number, throttle: number): void {

        const totalTorque = this.getEngineTorque(throttle)
                          + this.roadFrictionTorque;

        // calculate values
        const angAccel  = totalTorque / this.momentOfInertia;
        const angVel    = this.angVel + angAccel * timeStep;
        const angDiff   = angVel * timeStep;
        const ang       = this.ang + angDiff;
        const rollDist  = -1 * angDiff * this.radius;

        // update state
        this.angVel = angVel;
        this.ang = ang
        this.anchorPoint = this.anchorPoint.addX(rollDist)
    }

    

}