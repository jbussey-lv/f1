import Victor from "victor";
import body from "../physics/body";
import LeverArm from "../physics/lever-arm";
import { Controller } from "../game/controller";
import Shape from "../shapes/abstract_shape";
import Rectangle from "../shapes/rectangle";
import Wheel from "./wheel";

export class Cart extends body{

    controller: Controller;
    width: number = 6;
    height: number = 0.5;

    chasis: Rectangle = new Rectangle(this, this.width, this.height, new Victor(0, 0), 1500, 0, "lightblue");

    backWheel = new Wheel(
        this,
        1,
        new Victor(-2,0),
        2
    );
    frontWheel = new Wheel(
        this,
        1,
        new Victor(2,0),
        2
    );

    constructor(controller: Controller){
        super();
        this.controller = controller;
    }

    get throttleTourque(): number{
        const engineMaxTorque = 10000;
        return -this.controller.rightY * engineMaxTorque;
    }

    get brakeForce(): number {
        const maxBrakeForce = 100;
        return this.controller.brake * maxBrakeForce;
    }

    update(timeStep: number){
        this.backWheel.update(
            timeStep,
            this.throttleTourque,
            this.brakeForce
        );
        this.frontWheel.update(
            timeStep,
            this.throttleTourque,
            this.brakeForce
        );
    }

    get shapes(): Shape[] {

        return [
            this.chasis,
            this.frontWheel,
            this.backWheel,
        ]
    }


    get leverArms(): LeverArm[] {

        // const oomph = this.controller.throttle * 5000;
        return [
            this.backWheel.leverArm,
            this.frontWheel.leverArm
        ];
    }

    

}