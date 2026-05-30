import Victor from "victor";
import Circle from "../shapes/circle";
import Body from "../physics/body"

export default class Wheel extends Circle{

    angularVelolcity: number = 0;
    minStaticAngularVelocity = 1;
    maxStaticBrakeTorque = 65;
    maxKineticBrakeTorque = 30;
    maxFrictionTorque = 3;
    maxThrottleTorque = 15;
    _anchorPoint: Victor | null = null;
    anchorSpringConstant = 1;

    constructor(body: Body, radius: number, position: Victor, mass: number){
        super(
            body,
            radius,
            position,
            mass
        )
    }

    get anchorPoint(): Victor {
        if(this._anchorPoint === null){
            this._anchorPoint = this.getAbsolutePosition();
        }
        return this._anchorPoint;
    }

    get angluralDirection(): number {
        return this.angularVelolcity < 0 ? -1 : 1;
    }

    get frictionSpringMag(): number {
        return this.anchorPoint.x - this.getAbsolutePosition().x;
    }

    get frictionSpringForceMag(): number {
        return this.frictionSpringMag * this.anchorSpringConstant;
    }

    get frictionTorque(): number {
        return this.frictionSpringForceMag * this.radius;
    }


    update(timeStep: number, throttleTourque: number): void {

        const totalTorque = throttleTourque + this.frictionTorque;

        const angularAccel = totalTorque / this.momentOfInertia;
        
        this.angularVelolcity += angularAccel * timeStep;
        const angleDiff = this.angularVelolcity * timeStep;
        const rollDist = angleDiff * this.radius;

        this.anchorPoint.addScalarX(rollDist)
        this.angle += angleDiff
    }
}