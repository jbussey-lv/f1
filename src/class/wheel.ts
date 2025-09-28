import Victor from "victor";
import { Car } from "./car";
import Rectangle from "./rectangle";

export class Wheel extends Rectangle{
    muStatic: number; // Coefficient of static friction
    constructor(
        position: Victor,
        width: number = 0.5,
        radius: number = 0.5,
        mass: number = 15,
        muStatic: number = 0.8
    ) {
        super(
            width,
            radius*2,
            position,
            mass,
            0,
            "black"
        );
        this.muStatic = muStatic; 
    }


    calculateForce(absoluteVecity: Victor, absoluteAngle: number, car: Car): Victor {
        // Calculate the force based on the wheel's angle and car's speed
        // const speed = car.velocity.length();
        const forceMagnitude = this.coefStaticFriction * car.mass * 9.81; // Force = μ * m * g
        const forceDirection = new Victor(Math.cos(this.angle), Math.sin(this.angle));
        return forceDirection.multiplyScalar(forceMagnitude);
    }



    
}