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
    height: number = 3;

    chasis: Rectangle = new Rectangle(this, this.width, this.height, new Victor(0, 0), 1500, 0, "lightblue");

    frontWheel = new Wheel(
        this,
        1,
        new Victor(-2,-1),
        2
    );
    backWheel = new Wheel(
        this,
        1,
        new Victor(2, -1),
        2
    );

    constructor(controller: Controller){
        super();
        this.controller = controller;
    }

    get tourque(){
        return this.controller.throttle || 0;
    }

    update(timeStep: number){
        this.frontWheel.update(
            timeStep,
            this.controller.throttle || 0,
            this.controller.brake || 0
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
        return [];
    }

    

}