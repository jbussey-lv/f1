import Victor from "victor";
import Circle from "../shapes/circle";

export default class Wheel extends Circle{

    constructor(radius: number, position: Victor, mass: number){
        super(
            radius,
            position,
            mass
        )
    }


}