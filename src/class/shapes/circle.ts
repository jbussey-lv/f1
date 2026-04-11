import Victor from "victor";
import AbstractShape from "./abstract_shape";

export default class Circle extends AbstractShape{
    radius: number;

    constructor(
        radius: number, // vertical
        position: Victor, // refers to its center
        mass: number,
        angle: number = 0,
        color: string = "blue"
    ){
        super(
            position,
            mass,
            angle,
            color
        )
        this.radius = radius;
        this.position = position;
        this.mass = mass;
        this.angle = angle || this.angle;
        this.color = color || this.color;
    }

    get com(): Victor { // center of mass
        return new Victor(this.radius, this.radius);
    }

}