import Victor from "victor";
import Body from "./body";
import Rectangle from "./rectangle";
import { mod } from "../module/helper";
import LeverArm from "./lever-arm";

export class Wheel extends Rectangle{
    muStatic: number; // Coefficient of static friction
    constructor(
        position: Victor,
        width: number = 0.5,
        radius: number = 0.5,
        mass: number = 15,
        muStatic: number = 500
    ) {
        super(
            radius*2,
            width,
            position,
            mass,
            0,
            "black"
        );
        this.muStatic = muStatic; 
    }


    calculateForce(absoluteVecity: Victor, absoluteAngle: number): Victor {
        // Calculate the force based on the wheel's angle and car's speed
        // const speed = car.velocity.length();
        const normalizedWheelAngle = mod(absoluteAngle, 2 * Math.PI);
        const slipAngle = absoluteVecity.angle() - normalizedWheelAngle
        const forceMagnitude = -1 * this.muStatic * Math.sin(slipAngle) * absoluteVecity.length();
        const forceDirection = absoluteAngle + Math.PI / 2; // Perpendicular to the wheel's direction
        
        return new Victor(
            forceMagnitude * Math.cos(forceDirection),
            forceMagnitude * Math.sin(forceDirection)
        );
    }

    getLeverArm(body: Body): LeverArm {
        const absoluteVelocity = this.getAbsoluteVelocity(body);
        const absoluteAngle = this.getAbsoluteAngle(body);
        const force = this.calculateForce(absoluteVelocity, absoluteAngle);
        const arm = this.getArm(body);
        return new LeverArm(arm, force);
    }

    
}