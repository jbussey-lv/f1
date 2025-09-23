import Victor from "victor";
import { Wheel } from "./wheel";
import { Controller } from "./controller";
import body from "./body";
import LeverArm from "./lever-arm";

export class Car extends body{
    wheels: Wheel[] = [];
    controller: Controller | null = null; 
    maxSteeringAngle = 40 * Math.PI / 180; // in radians
    maxTorque = 250; // in Nm

    get steeringAngle(): number {
        return this.controller ?
               this.controller.steering * this.maxSteeringAngle : 
               0;
    }

    get throttle(): number {
        return this.controller?.throttle || 0;
    }

    get leverArms(): LeverArm[] {
        return [
            this.getThrottleLeverArm(),
            this.getSteeringLeverArm(),
        ];
    }

    getThrottleLeverArm(): LeverArm {
        const drivingForceMagnitude = this.throttle * this.maxTorque;
        const drivingForce = new Victor(Math.cos(this.angle), Math.sin(this.angle)).multiplyScalar(drivingForceMagnitude);
        const rearAxleOffset = new Victor(this.dimensions.x * 0.25, 0).rotate(this.angle);
        const displacement = this.com.clone().subtract(rearAxleOffset);
        return new LeverArm(displacement, drivingForce, this.com);
    }

    getSteeringLeverArm(): LeverArm {
        const steeringForceMagnitude = this.steeringAngle * this.maxTorque;
        const steeringForce = new Victor(Math.cos(this.angle + Math.PI / 2), Math.sin(this.angle + Math.PI / 2)).multiplyScalar(steeringForceMagnitude);
        const frontAxleOffset = new Victor(this.dimensions.x * 0.75, 0).rotate(this.angle);
        const displacement = this.com.clone().subtract(frontAxleOffset);
        return new LeverArm(displacement, steeringForce, this.com);
    }
}