import Victor from "victor";
import body from "../physics/body";
import LeverArm from "../physics/lever-arm";
import { Controller } from "../game/controller";
import Shape from "../shapes/abstract_shape";
import Rectangle from "../shapes/rectangle";
import Wheel from "./wheel";

export class Cart extends body{

    controller: Controller | null = null;
    width: number = 6;
    height: number = 3;

    chasis: Rectangle = new Rectangle(this.width, this.height, new Victor(0, 0), 1500, 0, "lightblue");

    frontWheel = new Wheel(
        1,
        new Victor(-2,-1),
        2
    );
    backWheel = new Wheel(
        1,
        new Victor(2, -1),
        2
    );

    constructor(){
        super();
    }

    getWheelAngle(): number {
        if (!this.controller) {
            return 0;
        } // Maximum steering angle in radians (30 degrees)
        const angle = this.controller.steering;
        return angle;
    }

    get shapes(): Shape[] {

        const wheelAngle = this.getWheelAngle();

        this.frontWheel.angle = wheelAngle;
        this.backWheel.angle = wheelAngle;
        
        return [
            this.chasis,
            this.frontWheel,
            this.backWheel,
        ]
    }


    get leverArms(): LeverArm[] {
        return [
        ];
    }

    

}