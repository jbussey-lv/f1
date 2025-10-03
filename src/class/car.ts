import Victor from "victor";
import body from "./body";
import LeverArm from "./lever-arm";
import { Controller } from "./controller";
import Rectangle from "./rectangle";
import { Wheel } from "./wheel";

export class Car extends body{

    controller: Controller | null = null;
    maxSteeringAngle: number = Math.PI / 6; // 45 degrees in radians
    insideWheelSteeringMultiplier: number = 1.3; // Reduce the steering angle for the inside wheel  
    chasisWidth: number = 2;
    chasisLength: number = 6;
    maxTorque: number = 15000; // Max engine torque in Nm

    chasis: Rectangle = new Rectangle(this.chasisLength, this.chasisWidth, new Victor(0, 0), 1500, 0, "lightblue");

    frontLeftWheel = new Wheel(
        new Victor(this.chasisLength / 3, this.chasisWidth / 2)
    );
    frontRightWheel = new Wheel(
        new Victor(this.chasisLength / 3, this.chasisWidth / -2)
    );
    backLeftWheel = new Wheel(
        new Victor(this.chasisLength / -3, this.chasisWidth / 2)
    );
    backRightWheel = new Wheel(
        new Victor(this.chasisLength / -3, this.chasisWidth / -2)
    );

    constructor(){
        super();
    }

    get rectangles(): Rectangle[] {

        this.frontLeftWheel.angle = this.leftWheelAngle;
        this.frontRightWheel.angle = this.rightWheelAngle;
        return [
            this.chasis,
            this.frontLeftWheel,
            this.frontRightWheel,
            this.backLeftWheel,
            this.backRightWheel,
        ]
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

    updateLeverArms(deltaTime: number): void {

        const engineTorque = this.getEngineTorque();

        this.leverArms = [
            this.getDragLeverArm(),
            this.frontLeftWheel.getLeverArm(this, deltaTime),
            this.frontRightWheel.getLeverArm(this, deltaTime),
            this.backLeftWheel.getLeverArm(this, deltaTime, engineTorque),
            this.backRightWheel.getLeverArm(this, deltaTime, engineTorque)
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
        } // Maximum steering angle in radians (30 degrees)
        const angle = this.controller.steering * this.maxSteeringAngle;
        return angle;
    }

    getDragLeverArm(): LeverArm {
        const dragCoefficient = 25;
        const dragMagnitude = dragCoefficient * this.velocity.magnitude() ** 2;
        const dragDirection = this.velocity.clone().normalize().rotate(Math.PI);
        const force = dragDirection.multiplyScalar(dragMagnitude);

        return new LeverArm(
            new Victor(0,0),
            force
        )
    }

    getEngineTorque(): number {

        if (!this.controller) {
            return 0;
        }

        return this.controller.r2 * this.maxTorque;
    }

}