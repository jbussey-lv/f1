import Victor from "victor";
import body from "./body";
import LeverArm from "./lever-arm";
import { Controller } from "./controller";
import Rectangle from "./rectangle";

export class Bug extends body{

    controller: Controller | null = null;
    maxSteeringAngle = Math.PI / 4; // 45 degrees in radians
    insideWheelSteeringMultiplier = 1.3; // Reduce the steering angle for the inside wheel
    frontLeftWheelPosition = new Victor(-3.7, 3);
    frontRightWheelPosition = new Victor(3.7, 3);
    backLeftWheelPosition = new Victor(-3.7, -3);
    backRightWheelPosition = new Victor(3.7, -3);

    constructor(){
        super();
    }

    get rectangles(): Rectangle[] {

        const frontLeftWheelPosition = new Victor(-3.7, 3);
        const frontRightWheelPosition = new Victor(3.7, 3);
        const backLeftWheelPosition = new Victor(-3.7, -3);
        const backRightWheelPosition = new Victor(3.7, -3);

        return [
            new Rectangle(5, 10, new Victor(0, 0), 1500, 0),
            new Rectangle(2, 4, frontLeftWheelPosition, 50, this.leftWheelAngle, "black"),
            new Rectangle(2, 4, frontRightWheelPosition, 50, this.rightWheelAngle, "black"),
            new Rectangle(2, 4, backLeftWheelPosition, 50, 0, "black"),
            new Rectangle(2, 4, backRightWheelPosition, 50, 0, "black"),
        ];
    }

    get leftWheelAngle(): number {
        const wheelAngle = this.getWheelAngle();
        return wheelAngle > 0 ?
            wheelAngle * this.insideWheelSteeringMultiplier :
            wheelAngle;
    }

    get rightWheelAngle(): number {
        const wheelAngle = this.getWheelAngle();
        return wheelAngle < 0 ?
            wheelAngle * this.insideWheelSteeringMultiplier :
            wheelAngle;
    }

    getWheelLeverArm(relativeAngle: number, position: Victor): LeverArm {
        const absoluteAngle = this.angle + relativeAngle;
        const absoluteVelocity = this.getAbsoluteVelocity(position);
        const forceMagnitude = -5 * Math.cos(absoluteAngle - absoluteVelocity.angle()) * absoluteVelocity.magnitude() * 200;
        const forceDirection = absoluteAngle;
        const force = new Victor(
            forceMagnitude * Math.cos(forceDirection),
            forceMagnitude * Math.sin(forceDirection)
        );
        return new LeverArm(
            position.clone().rotate(this.angle),
            force
        )
    }
     

    get leverArms(): LeverArm[] {
        return [
            this.getThrottleLeverArm(),
            this.getDragLeverArm(),
            this.getWheelLeverArm(this.leftWheelAngle, this.frontLeftWheelPosition),
            this.getWheelLeverArm(this.rightWheelAngle, this.frontRightWheelPosition),
            this.getWheelLeverArm(this.angle, this.backLeftWheelPosition),
            this.getWheelLeverArm(this.angle, this.backRightWheelPosition),
            // this.getAngularDragLeverArm()
        ];
    }

    getSteeringLeverArm(): LeverArm {
        if (!this.controller) {
            return new LeverArm(new Victor(0,0), new Victor(0,0));
        }
        // Apply steering force at the rear of the car
        const displacement = new Victor(0, 2).rotate(this.angle);
        const forceMagnitude = this.controller.steering * 500 * this.velocity.magnitude();
        return new LeverArm(
            displacement,
            new Victor(0, forceMagnitude).rotate(this.angle + Math.PI / 2)
        )
    }

    getAngularDragLeverArm(): LeverArm {
        const displacement = new Victor(0, 2).rotate(this.angle);
        const angularDragMagnitude = -10000 * this.angulerVelocity * Math.abs(this.angulerVelocity);
        return new LeverArm(
            displacement,
            new Victor(0, angularDragMagnitude).rotate(this.angle + Math.PI / 2)
        )
    }

    getWheelAngle(): number {
        if (!this.controller) {
            return 0;
        }
        const maxSteeringAngle = Math.PI / 4; // Maximum steering angle in radians (30 degrees)
        const angle = this.controller.steering * maxSteeringAngle;
        return angle;
    }

    getDragLeverArm(): LeverArm {
        const dragCoefficient = 100;
        const dragMagnitude = dragCoefficient * this.velocity.magnitude() ** 2;
        const dragDirection = this.velocity.clone().normalize().rotate(Math.PI);
        const force = dragDirection.multiplyScalar(dragMagnitude);

        return new LeverArm(
            new Victor(0,0),
            force
        )
    }

    getThrottleLeverArm(): LeverArm {

        if (!this.controller) {
            return new LeverArm(new Victor(0,0), new Victor(0,0));
        }

        const displacement = new Victor(0,0)
                                 .rotate(this.angle)

        const forceMagnitude = this.controller.r2 * this.mass * 20;

        // const location = this.position.clone().add(new Victor(this.dimensions.y * 0.25, 0));
        return new LeverArm(
            displacement,
            new Victor(0, forceMagnitude).rotate(this.angle)
        )
    }

}