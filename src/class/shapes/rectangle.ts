import Victor from "victor";
import AbstractShape from "./abstract_shape";

export default class Rectangle extends AbstractShape{
    width: number;
    height: number;

    constructor(
        width: number, // horizontal
        height: number, // vertical
        position: Victor, // refers to its center
        mass: number,
        angle: number,
        color: string
    ){
        super(
            position,
            mass,
            angle || 0,
            color || "blue"
        )
        this.width = width;
        this.height = height;
    }

    get com(): Victor { // center of mass
        return new Victor(this.width / 2, this.height / 2);
    }

     
}