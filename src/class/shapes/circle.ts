import AbstractShape from "./abstract_shape";
import Body from "../physics/body"
import Vec from "../../vec";

export default class Circle extends AbstractShape{
    radius: number;

    constructor(
        body: Body,
        radius: number, // vertical
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
        this.radius = radius;
        this.position = position;
        this.mass = mass;
        this.ang = angle || this.ang;
        this.color = color || this.color;
    }

    get com(): Vec { // center of mass
        return new Vec(this.radius, this.radius);
    }

    get momentOfInertia(): number{
        return (1 / 2) * this.mass * (this.radius ** 2);
    }

}