import Victor from "victor";

export default class Rectangle{
    width: number;
    height: number;
    position: Victor;
    mass: number;
    angle: number = 0; // in radians
    color: string = "blue";
    id: string = crypto.randomUUID();

    constructor(
        width: number, // horizontal
        height: number, // vertical
        position: Victor, // refers to its center
        mass: number,
        angle: number = 0,
        color: string = "blue"
    ){
        this.width = width;
        this.height = height;
        this.position = position;
        this.mass = mass;
        this.angle = angle || this.angle;
        this.color = color || this.color;
    }

    get com(): Victor { // center of mass
        return new Victor(this.width / 2, this.height / 2);
    }
}