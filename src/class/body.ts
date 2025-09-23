import Victor from "victor";
import LeverArm from "./lever-arm";

export default abstract class Body {
    position = new Victor(0, 0);
    velocity = new Victor(0, 0);
    _angle = 0; // in radians
    angulerVelocity = 0; // in radians per second
    mass = 1500; // in kg
    dimensions = new Victor(4, 2);
    com = new Victor(2/3 * this.dimensions.x, this.dimensions.y / 2);
    moment = (1/12) * this.mass * (this.dimensions.x**2 + this.dimensions.y**2);
    color = "blue"; // Default color for the car
    id = crypto.randomUUID();

    get angleInDegrees(): number {
        return this.angle * 180 / Math.PI;
    }

    get angle(): number {
        return this._angle;
    }

    set angle(value) {
        this._angle = value % (2 * Math.PI); // Keep angle within 0 to 2π
    }

    abstract get leverArms(): LeverArm[];
}