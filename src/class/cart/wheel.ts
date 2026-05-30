import Victor from "victor";
import Circle from "../shapes/circle";
import Body from "../physics/body"
import LeverArm from "../physics/lever-arm";

export default class Wheel extends Circle{

    angularVelolcity: number = 0;
    minStaticAngularVelocity = 1;
    maxStaticBrakeTorque = 65;
    maxKineticBrakeTorque = 30;
    maxFrictionTorque = 3;
    maxThrottleTorque = 15;
    brakeDiskRadius = 0.25;
    brakeMuKinetic = 1000;
    brakeMuStatic = 100;

    angularAccelFloor = 0.01;
    angularVelocityFloor = 0.01;

    _anchorPoint: Victor | null = null;
    anchorSpringConstant = 1000;
    anchorSpringDampingCoef = -10

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
        if(this.angularVelolcity === 0){
            return 0;
        }
        return this.angularVelolcity < 0 ? -1 : 1;
    }

    get frictionSpringMag(): number {
        return this.anchorPoint.x - this.getAbsolutePosition().x;
    }

    get frictionSpringForceMag(): number {
        return this.frictionSpringMag * this.anchorSpringConstant;
    }

    get frictionTorque(): number {
        return -this.frictionSpringForceMag * this.radius // simple torque
               + this.angularVelolcity * this.anchorSpringDampingCoef;
    }

    get leverArm(): LeverArm {
        return new LeverArm(
            this.position,
            new Victor(this.frictionSpringForceMag,0)
        )
    }

    getBrakeTorque(brakeForce: number): number {
        return brakeForce 
               * this.brakeMuKinetic 
               * this.brakeDiskRadius
               * this.angluralDirection * -1;
    }

    update(timeStep: number, throttleTourque: number, brakeForce: number): void {

        const totalTorque = throttleTourque 
                          + this.frictionTorque
                          + this.getBrakeTorque(brakeForce)

        // euler integration
        const angularAccel = totalTorque / this.momentOfInertia;
        this.angularVelolcity += angularAccel * timeStep;

        // dead zone
        if(
            Math.abs(angularAccel) < this.angularAccelFloor
            && Math.abs(this.angularVelolcity) < this.angularVelocityFloor    
        ){
            this.angularVelolcity = 0;
        }

        // roll it
        const angleDiff = this.angularVelolcity * timeStep;
        const rollDist = angleDiff * this.radius;

        this.anchorPoint.addScalarX(rollDist)
        this.angle += angleDiff

    }
}