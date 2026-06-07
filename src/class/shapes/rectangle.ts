import AbstractShape from "./abstract_shape";
import Body from "../physics/body";
import Vec from "../../vec";

export default class Rectangle extends AbstractShape{
    width: number;
    height: number;

    constructor(
        body: Body,
        width: number, // horizontal
        height: number, // vertical
        position: Vec, // refers to its center
        mass: number,
        angle: number = 0,
        color: string = "blue"
    ){
        super(
            body,
            position,
            mass,
            angle,
            color
        )
        this.width = width;
        this.height = height;
    }

    get com(): Vec { // center of mass
        return new Vec(this.width / 2, this.height / 2);
    }

    get momentOfInertia(): number{
        return (1 / 12) * this.mass * (this.width ** 2 + this.height ** 2);
    }

     
}