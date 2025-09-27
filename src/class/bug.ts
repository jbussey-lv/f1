import Victor from "victor";
import body from "./body";
import LeverArm from "./lever-arm";
import { Controller } from "./controller";
import Rectangle from "./rectangle";

export class Bug extends body{

    controller: Controller | null = null;;

    constructor(){
        super();
    }

    get rectangles(): Rectangle[] {
        return [
            new Rectangle(5, 10, new Victor(0, 0), 1500, 0),
            new Rectangle(2, 4, new Victor(-3.7, 3), 50, this.getWheelAngle(), "black"),
            new Rectangle(2, 4, new Victor(3.7, 3), 50, this.getWheelAngle(), "black"),
            new Rectangle(2, 4, new Victor(-3.7, -3), 50, 0, "black"),
            new Rectangle(2, 4, new Victor(3.7, -3), 50, 0, "black"),
        ];
    }

    get leverArms(): LeverArm[] {
        return [
            // this.getThrottleLeverArm(),
            // this.getDragLeverArm(),
            // this.getSteeringLeverArm(),
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
        const displacement = new Victor(0, 0);
        const dragConstant = 0.4257; // Drag constant for a car in kg/m
        const dragArea = 2.2; // Frontal area in m^2
        const dragMagnitude = 10 * dragConstant * dragArea * this.velocity.magnitude() ** 2;
        const dragDirection = this.velocity.clone().normalize().rotate(Math.PI);
        const force = dragDirection.multiplyScalar(dragMagnitude);

        return new LeverArm(
            displacement,
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