import Victor from "victor";
import Circle from "../shapes/circle";

export default class Wheel extends Circle{

    angularVelolcity: number = 0;
    minStaticAngularVelocity = 1;
    maxStaticBreakTorque = 12;
    maxKineticBrakeTorque = 8;
    maxThrottleTorque = 6;

    constructor(radius: number, position: Victor, mass: number){
        super(
            radius,
            position,
            mass
        )
    }

    get direction(): number {
        return Math.sign(this.angularVelolcity)
    }

    staticBrakeTorque(brake: number): number {
        return -this.direction * this.maxStaticBreakTorque * brake;
    }


    kineticBrakeTorque(brake: number): number {
        return -this.direction * this.maxKineticBrakeTorque * brake;
    }

    throttleTorque(throttle: number): number {
        return this.maxThrottleTorque * throttle;
    }

    brakeTorqueWins(throttleTorque: number, brakeTorque: number): bool {
        const oppositeSigns = throttleTorque * brakeTorque < 1;
        const brakeBigger = Math.abs(brakeTorque) > Math.abs(throttleTorque);
        return oppositeSigns && brakeBigger;
    }

    update(timeStep: number, throttle: number, brake: number): void {

        const totalTorque = this.throttleTorque(throttle) + 
                            this.kineticBrakeTorque(brake);

        const angularAccel = totalTorque / this.momentOfInertia;
        this.angularVelolcity += angularAccel * timeStep;
        this.angle += this.angularVelolcity * timeStep;
    }
}