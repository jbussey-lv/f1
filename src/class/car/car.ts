import body from "../physics/body";
import LeverArm from "../physics/lever-arm";
import { Controller } from "../game/controller";
import Rectangle from "../shapes/rectangle";
import Wheel from "./wheel";
import AbstractShape from "../shapes/abstract_shape";
import Circle from "../shapes/circle";
import Vec from "../../vec";

export class Car extends body{

    controller: Controller;
    maxSteeringAngle: number = Math.PI / 6; // 45 degrees in radians
    insideWheelSteeringMultiplier: number = 1.3; // Reduce the steering angle for the inside wheel  
    chasisWidth: number = 2;
    chasisLength: number = 6;

    constructor(controller: Controller){
        super()
        this.controller = controller;
    }

    chasis: Rectangle = new Rectangle(this, this.chasisLength, this.chasisWidth, new Vec(0, 0), 1500, 0, "lightblue");

    frontLeftWheel = new Wheel(
        this,
        new Vec(this.chasisLength / 3, this.chasisWidth / 2)
    );
    frontRightWheel = new Wheel(
        this,
        new Vec(this.chasisLength / 3, this.chasisWidth / -2)
    );
    backLeftWheel = new Wheel(
        this,
        new Vec(this.chasisLength / -3, this.chasisWidth / 2)
    );
    backRightWheel = new Wheel(
        this,
        new Vec(this.chasisLength / -3, this.chasisWidth / -2)
    );
    circle1 = new Circle(
        this,
        1.5,
        new Vec(5,0),
        1,
        0,
        "green"
    )

    circle2 = new Circle(
        this,
        1.5,
        new Vec(-5,0),
        1,
        0,
        "green"
    )

    update(){}

    get shapes(): AbstractShape[] {

        this.frontLeftWheel.ang = this.leftWheelAngle;
        this.frontRightWheel.ang = this.rightWheelAngle;
        return [
            this.chasis,
            this.frontLeftWheel,
            this.frontRightWheel,
            this.backLeftWheel,
            this.backRightWheel,
            this.circle1,
            this.circle2
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

    get leverArms(): LeverArm[] {
        return [
            this.getThrottleLeverArm(),
            this.getDragLeverArm(),
            this.frontLeftWheel.leverArm,
            this.frontRightWheel.leverArm,
            this.backLeftWheel.leverArm,
            this.backRightWheel.leverArm
        ];
    }

    getSteeringLeverArm(): LeverArm {
        if (!this.controller) {
            return new LeverArm(new Vec(0,0), new Vec(0,0));
        }
        // Apply steering force at the rear of the car
        const displacement = new Vec(0, 2).rotateByAng(this.angle);
        const forceMagnitude = this.controller.steering * 500 * this.velocity.mag;
        return new LeverArm(
            displacement,
            new Vec(0, forceMagnitude).rotateByAng(this.angle + Math.PI / 2)
        )
    }

    getAngularDragLeverArm(): LeverArm {
        const displacement = new Vec(0, 2).rotateByAng(this.angle);
        const angularDragMagnitude = -10000 * this.angulerVelocity * Math.abs(this.angulerVelocity);
        return new LeverArm(
            displacement,
            new Vec(0, angularDragMagnitude).rotateByAng(this.angle + Math.PI / 2)
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
        const dragMagnitude = dragCoefficient * this.velocity.mag ** 2;
        const dragDirection = this.velocity.toUnit().rotateByAng(Math.PI);
        const force = dragDirection.multiply(dragMagnitude);

        return new LeverArm(
            new Vec(0,0),
            force
        )
    }

    getThrottleLeverArm(): LeverArm {

        if (!this.controller) {
            return new LeverArm(new Vec(0,0), new Vec(0,0));
        }

        const displacement = new Vec(0,0);

        const forceMagnitude = this.controller.r2 * this.mass * 40;

        // const location = this.position.clone().add(new Vec(this.dimensions.y * 0.25, 0));
        return new LeverArm(
            displacement,
            new Vec(forceMagnitude, 0).rotateByAng(this.angle)
        )
    }

}