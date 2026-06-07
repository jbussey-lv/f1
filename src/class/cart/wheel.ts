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
            this._anchorPoint = this.getAbsolutePosition();
        }
        return this._anchorPoint;
    }

    set anchorPoint(vector: Vec){
        this._anchorPoint = vector;
    }

    get roadFrictionSpringMag(): number {
        return this.anchorPoint.x - this.getAbsolutePosition().x;
    }

    get roadFrictionForceMag(): number {
        return this.roadFrictionSpringMag * this.anchorSpringConstant;
    }

    get roadFrictionTorque(): number {

        // const angVelAbs = Math.abs(this.angVel);

        // const reducer = 1 - angVelAbs / (angVelAbs + 1)
        return this.roadFrictionForceMag * this.radius 
            //    * reducer;
        // simple torque
            //    + this.angVel * roadFrictionDamping;
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
        this.anchorPoint.addX(rollDist)
    }

    

}