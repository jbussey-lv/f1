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

    constructor(body: Body, radius: number, position: Victor, mass: number){
        super(
            body,
            radius,
            position,
            mass
        )
    }

    get angluralDirection(): number {
        return this.angularVelolcity < 0 ? -1 : 1;
    }

    get insideStaticAngularVelocity(): boolean {
        return Math.abs(this.angularVelolcity) < this.minStaticAngularVelocity
    }

    brakeTorque(brake: number): number {
        const maxBrakeTorque = this.insideStaticAngularVelocity ?
                               this.maxStaticBrakeTorque :
                               this.maxKineticBrakeTorque;

        return -this.angluralDirection * maxBrakeTorque * brake;
    }

    get frictionTorque(): number {
        return -this.angluralDirection * this.maxFrictionTorque;
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
        const resistiveTorque = this.brakeTorque(brake)
                              + this.frictionTorque;

        const resistiveTorqueWins = this.firstNumberWins(resistiveTorque, throttleTorque);

        if(resistiveTorqueWins && this.insideStaticAngularVelocity){
            this.angularVelolcity = 0;
            return;
        }
        
        const totalTorque = throttleTorque + resistiveTorque;
        const angularAccel = totalTorque / this.momentOfInertia;
        
        this.angularVelolcity += angularAccel * timeStep;
        this.angle += this.angularVelolcity * timeStep;
    }
}