import Victor from "victor";
import Circle from "../shapes/circle";
import Body from "../physics/body"
import { FrictionMode } from "../physics/friction";
import LeverArm from "../physics/lever-arm";

export default class Wheel extends Circle{

    muStatic: number = 1;
    muKinetic: number = 0.7;
    angularVelocityAve = 0;
    angularVelocityAveDuration = 2;
    angularVelocityAveCount = 50;

    angularVelolcity: number = 0;
    minStaticAngularVelocity = 1;
    maxStaticBrakeTorque = 65;
    maxKineticBrakeTorque = 30;
    maxFrictionTorque = 3;
    maxThrottleTorque = 15;
    brakeDiskRadius = 0.25;
    brakeMuKinetic = 1000;
    brakeMuStatic = 100;

    maxStaticFriction = 100;

    angularAccelFloor = 0.01;
    angularVelocityFloor = 0.01;

    _anchorPoint: Victor | null = null;
    anchorSpringConstant = 1200;
    anchorSpringDampingCoef = -45

    frictionMode: FrictionMode = FrictionMode.Static;
    kineticSwitchSpeed: number = 10;
    kineticFrictionForce = 0.1;

    internalFrictionAngularVelocityDamping = 0.99;

    engineMaxTorque: number = 10000;
    angularVelocityWall: number = 250;

    engineLinked: boolean = false;


    constructor(
        body: Body, 
        radius: number, 
        position: Victor, 
        mass: number,
        engineLinked: boolean = false
    ){
        super(
            body,
            radius,
            position,
            mass
        )
        this.engineLinked = engineLinked;
    }

    get anchorPoint(): Victor {
        if(this._anchorPoint === null){
            this._anchorPoint = this.getAbsolutePosition();
        }
        return this._anchorPoint;
    }

    set anchorPoint(val: Victor){
        this._anchorPoint = val;
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

    get frictionForceMag(): number {
        // if(this.frictionMode === FrictionMode.Static){
        //     return this.frictionSpringMag * this.anchorSpringConstant;
        // } else {
        //     this.kineticFrictionForce * this.contactPatchAbsoluteVelocity.x / Math.abs(this.contactPatchAbsoluteVelocity.x)
        // }
        return this.frictionSpringMag * this.anchorSpringConstant;
    }

    get roadFrictionTorque(): number {
        return -this.frictionForceMag * this.radius // simple torque
               + this.angularVelolcity * this.anchorSpringDampingCoef;
    }

    get leverArm(): LeverArm {
        return new LeverArm(
            this.position,
            new Victor(this.frictionForceMag,0)
        )
    }

    getBrakeTorque(brakeForce: number): number {
        return brakeForce 
               * this.brakeMuKinetic 
               * this.brakeDiskRadius
               * this.angluralDirection * -1;
    }

    getEngineTorque(throttle: number): number {
        if(!this.engineLinked){return 0}
        return throttle * this.engineMaxTorque

 -(this.angularVelocityAve / this.angularVelocityWall) * this.engineMaxTorque;

            //    - (this.angularVelolcity / this.angularVelocityWall) * this.engineMaxTorque;
            //    + this.engineResistiveTorqueSlope * this.angularVelolcity;
    }

    applyInternalFriction(): void{
        this.angularVelolcity *= this.internalFrictionAngularVelocityDamping;
    }

    killWhenStill(angularAccel: number): void{
        if(
            Math.abs(angularAccel) < this.angularAccelFloor
            && Math.abs(this.angularVelolcity) < this.angularVelocityFloor    
        ){
            this.angularVelolcity = 0;
        }
    }

    spinIt(timeStep: number): void{
        const angleDiff = this.angularVelolcity * timeStep;
        const rollDist = angleDiff * this.radius;

        this.anchorPoint.addScalarX(rollDist)
        this.angle += angleDiff
    }

    update(timeStep: number, throttle: number): void {

        const totalTorque = this.getEngineTorque(throttle)
                          + this.roadFrictionTorque;

        // euler integration
        const angularAccel = totalTorque / this.momentOfInertia;
        this.angularVelolcity += angularAccel * timeStep;

        this.applyInternalFriction();
        
        this.killWhenStill(angularAccel);

        this.spinIt(timeStep);

        this.updateAngularVelocityAve(timeStep)

        // this.setFrictionMode();
    }

    get contactPatchAbsoluteVelocity(): Victor {
        return this.getAbsoluteVelocity()
            .clone()
            .addScalarX(this.angularVelolcity * this.radius);
    }

    updateAngularVelocityAve(timeStep: number): void {
        const count = this.angularVelocityAveDuration / timeStep;
        let sum = this.angularVelocityAve * (count - 4)
        sum += this.angularVelolcity * 4;
        this.angularVelocityAve = sum / count;
    }

    setFrictionMode(){
        // if we start in static
        if(this.frictionMode === FrictionMode.Static){
            // but we're pulling too hard
            if(this.frictionForceMag > this.maxStaticFriction){
                // switch
                this.frictionMode = FrictionMode.Kinetic;
                // this.color = "red";
            }
        // if we start kinetic
        } else {
            // but we've stopped slipping so fast
            if(Math.abs(this.contactPatchAbsoluteVelocity.magnitude()) < this.kineticSwitchSpeed){
                this.frictionMode = FrictionMode.Static;
                this.anchorPoint = this.getAbsolutePosition().clone();
                // this.color = "black";
            }
        }
    }

}