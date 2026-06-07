import body from "../physics/body";
import LeverArm from "../physics/lever-arm";
import { Controller } from "../game/controller";
import Shape from "../shapes/abstract_shape";
import Rectangle from "../shapes/rectangle";
import Wheel from "./wheel";
import Vec from "../../vec";

export class Cart extends body{

    controller: Controller;
    width: number = 2;
    height: number = 0.4;
    chasisMass = 1500;

    chasis: Rectangle = new Rectangle(
        this,
        this.width,
        this.height,
        new Vec(0, 0),
        this.chasisMass,
        0, 
        "lightblue"
    );

    backWheel = new Wheel(
        this,
        0.3,
        new Vec(0,0),
        1000,
        true
    );
    // frontWheel = new Wheel(
    //     this,
    //     0.3,
    //     new Vec(1.5,0),
    //     20,
    //     false
    // );

    constructor(controller: Controller, position: Vec){
        super();
        this.controller = controller;
        this.position = position;
    }

    get throttle(): number{
        return this.controller.rightY;
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
        // this.frontWheel.update(
        //     timeStep,
        //     0
        // );
    }

    get shapes(): Shape[] {

        return [
            this.chasis,
            // this.frontWheel,
            this.backWheel,
        ]
    }


    get leverArms(): LeverArm[] {

        // const oomph = this.controller.throttle * 5000;
        return [
            this.backWheel.leverArm,
            // this.frontWheel.leverArm
        ];
    }

    

}