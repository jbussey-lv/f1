import Victor from "victor";
import body from "../physics/body";
import LeverArm from "../physics/lever-arm";
import { Controller } from "../game/controller";
import Shape from "../shapes/abstract_shape";
import Rectangle from "../shapes/rectangle";
import Wheel from "./wheel";

export class Cart extends body{

    controller: Controller | null = null;
    width: number = 6;
    height: number = 3;

    chasis: Rectangle = new Rectangle(this.width, this.height, new Victor(0, 0), 1500, 0, "lightblue");

    frontWheel = new Wheel(
        1,
        new Victor(-2,-1),
        2
    );
    backWheel = new Wheel(
        1,
        new Victor(2, -1),
        2
    );

    constructor(){
        super();
    }

    get throttleTourque(): number{
        const throttleMultiplier = 5
        const throttle = this.controller?.throttle;
        return throttle ? throttle * throttleMultiplier : 0;
    }

    update(timeStep: number){

        const maxStaticBreakTorque = 12;
        const maxKineticBrakeTorque = 8;
        const maxThrottleTorque = 6;
        const maxStaticAngularVelocity = 1.2;

        const throttleSetting = this.controller?.throttle || 0;
        const brakeSetting = this.controller?.brake || 0;

        let wheelDirection = Math.sign(this.frontWheel.angularVelocity);

        const throttleTorque = throttleSetting * maxThrottleTorque;
        const staticBreakTorque = maxStaticBreakTorque * brakeSetting * -wheelDirection;
        const kineticBreakTorque = maxKineticBrakeTorque * brakeSetting * -wheelDirection;
        // wheel specific
        let totalTorque = 0;

        if(Math.abs(this.frontWheel.angularVelocity) < maxStaticAngularVelocity){
            if(throttleTorque + staticBreakTorque < 0){
                this.frontWheel.angularVelocity = 0;
            } else {
                totalTorque = throttleTorque + staticBreakTorque;
            }
        } else {
            totalTorque = throttleTorque + kineticBreakTorque
        }

        this.frontWheel.angularVelocity += timeStep * totalTorque / this.frontWheel.momentOfInertia
        this.frontWheel.angle += timeStep * this.frontWheel.angle;
    }

    get shapes(): Shape[] {

        return [
            this.chasis,
            this.frontWheel,
            this.backWheel,
        ]
    }


    get leverArms(): LeverArm[] {
        return [
        ];
    }

    

}