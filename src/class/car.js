export class Car{
    position = new Victor(20, 0);
    velocity = new Victor(0, 0);
    _angle = 30 * Math.PI / 180; // in radians
    angulerVelocity = 0;//2 * Math.PI / 180; // in radians per second
    dimensions = new Victor(10, 5);
    mass = 1500; // in kg
    com = new Victor(3/4 * this.dimensions.x, this.dimensions.y / 2);
    moment = (1/12) * this.mass * (this.length**2 + this.width**2);
    color = "blue"; // Default color for the car
    id = crypto.randomUUID();

    get angleInDegrees() {
        return this.angle * 180 / Math.PI;
    }

    get angle() {
        return this._angle;
    }
    set angle(value) {
        this._angle = value % (2 * Math.PI); // Keep angle within 0 to 2π
    }
}