import Victor from "victor";
import Circle from "../shapes/circle";

export default class Wheel extends Circle{

    angularVelolcity: number = 0;
    minStaticAngularVelocity = 1;
    maxStaticBrakeTorque = 45;
    maxKineticBrakeTorque = 30;
    maxThrottleTorque = 15;

    constructor(radius: number, position: Victor, mass: number){
        super(
            radius,
            position,
            mass
        )
    }

    get AngluralDirection(): number {
        return this.angularVelolcity < 0 ? -1 : 1;
    }

    get insideStaticAngularVelocity(): boolean {
        return Math.abs(this.angularVelolcity) < this.minStaticAngularVelocity
    }

    brakeTorque(brake: number): number {
        const maxBrakeTorque = this.insideStaticAngularVelocity ?
                               this.maxStaticBrakeTorque :
                               this.maxKineticBrakeTorque;

        return -this.AngluralDirection * maxBrakeTorque * brake;
    }

    throttleTorque(throttle: number): number {
        return this.maxThrottleTorque * throttle;
    }

    firstNumberWins(firstNumber: number, secondNumber: number): boolean {
        const oppositeSigns = firstNumber * secondNumber <= 0;
        const firstBigger = Math.abs(firstNumber) > Math.abs(secondNumber);
        return oppositeSigns && firstBigger;
    }

    update(timeStep: number, throttle: number, brake: number): void {

        const throttleTorque = this.throttleTorque(throttle);
        const brakeTorque = this.brakeTorque(brake);
        
        const brakeTorqueWins = this.firstNumberWins(brakeTorque, throttleTorque)
        const totalTorque = throttleTorque + brakeTorque;

        const angularAccel = totalTorque / this.momentOfInertia;
        
        this.angularVelolcity += angularAccel * timeStep;
        this.angle += this.angularVelolcity * timeStep;

        if(brakeTorqueWins && this.insideStaticAngularVelocity){
            this.angularVelolcity = 0;
        }
    }
}