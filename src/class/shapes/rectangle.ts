import Victor from "victor";
import AbstractShape from "./abstract_shape";
import Body from "../physics/body";

export default class Rectangle extends AbstractShape{
    width: number;
    height: number;

    constructor(
        body: Body,
        width: number, // horizontal
        height: number, // vertical
        position: Victor, // refers to its center
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

    get com(): Victor { // center of mass
        return new Victor(this.width / 2, this.height / 2);
    }

    get momentOfInertia(): number{
        return (1 / 12) * this.mass * (this.width ** 2 + this.height ** 2);
    }

     
}