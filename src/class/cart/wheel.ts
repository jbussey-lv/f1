import Victor from "victor";
import Circle from "../shapes/circle";

export default class Wheel extends Circle{

    angularVelocity: number = 0;

    constructor(radius: number, position: Victor, mass: number){
        super(
            radius,
            position,
            mass
        )
    }

    update(timeStep: number, torque: number): void {
        const angularAccel = torque / this.momentOfInertia;
        this.angularVelocity += angularAccel * timeStep;
        this.angle += this.angularVelocity * timeStep;
    }
}