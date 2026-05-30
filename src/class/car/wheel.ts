import Victor from "victor";
import Body from "../physics/body";
import Rectangle from "../shapes/rectangle";
import { mod } from "../../helper";
import LeverArm from "../physics/lever-arm";

export default class Wheel extends Rectangle{
    muStatic: number; // Coefficient of static friction
    absoluteAnchorPosition: Victor;
    staticSprintConstant: number = 1;
    angularVelocity: number = 0;
    radius: number;
    moment: number = 2;
    constructor(
        body: Body,
        position: Victor,
        width: number = 0.5,
        radius: number = 0.5,
        mass: number = 15,
        muStatic: number = 500
    ) {
        super(
            body,
            radius*2,
            width,
            position,
            mass,
            0,
            "black"
        );
        this.muStatic = muStatic;
        this.radius = radius;
        this.absoluteAnchorPosition = this.getAbsolutePosition()
    }

    get frictionForce(): Victor {
        return this.absoluteAnchorPosition.clone()
                   .subtract(this.getAbsolutePosition())
                   .multiplyScalar(this.staticSprintConstant);
    }

    // get frictionTorque(): number{
    //     return this.frictionForce * this.radius;
    // }

    update(timestep: number, throttleTorque: number){

        const totalTorque = throttleTorque + this.frictionTorque
        const angularAcceleration = totalTorque / this.moment
        this.angularVelocity += angularAcceleration * timestep;

        const rollDistance = this.angularVelocity * this.radius * timestep;
        const anchorPush = new Victor(rollDistance, 0).rotate(this.getAbsoluteAngle())

        this.absoluteAnchorPosition.add(anchorPush);

        // adjust angular velocity
        // determine roll distance
        // adjust absolute anchor position


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

    get leverArm(): LeverArm {
        // const rollDistance = this.angularVelocity * this.radius * timestep;
        // const absoluteAngle = this.getAbsoluteAngle();
        // const anchorPush = new Victor(rollDistance, 0).rotate(absoluteAngle)
        // this.absoluteAnchorPosition = this.absoluteAnchorPosition.add(anchorPush);
        // const
        // const force = this.calculateForce(absoluteVelocity, absoluteAngle);
        // const arm = this.getArm();
        // return new LeverArm(arm, force);
        return new LeverArm(this.getAbsolutePosition(), new Victor(1,0))
    }

    
}