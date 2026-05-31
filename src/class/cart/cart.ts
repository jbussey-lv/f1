import Victor from "victor";
import body from "../physics/body";
import LeverArm from "../physics/lever-arm";
import { Controller } from "../game/controller";
import Shape from "../shapes/abstract_shape";
import Rectangle from "../shapes/rectangle";
import Wheel from "./wheel";

export class Cart extends body{

    controller: Controller;
    width: number = 4;
    height: number = 0.4;

    chasis: Rectangle = new Rectangle(
        this,
        this.width,
        this.height,
        new Victor(0, 0),
        1500,
        0, 
        "lightblue"
    );

    backWheel = new Wheel(
        this,
        0.3,
        new Victor(-1.5,0),
        20,
        true
    );
    frontWheel = new Wheel(
        this,
        0.3,
        new Victor(1.5,0),
        20
    );

    constructor(controller: Controller){
        super();
        this.controller = controller;
        this.position = new Victor(0, 0.3);
    }

    get throttle(): number{
        return -this.controller.rightY;
    }

    get brakeForce(): number {
        const maxBrakeForce = 100;
        return this.controller.brake * maxBrakeForce;
    }

    update(timeStep: number){
        this.backWheel.update(
            timeStep,
            this.throttle
        );
        this.frontWheel.update(
            timeStep,
            0
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