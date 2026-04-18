import Victor from "victor";
import Circle from "../shapes/circle";

export default class Wheel extends Circle{

    angularVelolcity: number = 0;

    constructor(radius: number, position: Victor, mass: number){
        super(
            radius,
            position,
            mass
        )
    }

    update(timeStep: number, torque: number): void {
        const angularAccel = torque / this.momentOfInertia;
        this.angularVelolcity += angularAccel * timeStep;
        this.angle += this.angularVelolcity * timeStep;
    }
}