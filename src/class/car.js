export class Car{
    position = new Victor(10, 20);
    velocity = new Victor(0, 0);
    angle = 0; // in radians
    angulerVelocity = 90 * Math.PI / 180; // in radians per second
    width = 5; // in meters
    length = 10; // in meters
    mass = 1500; // in kg
    com = new Victor(this.length / 2, this.width / 2);
    moment = (1/12) * this.mass * (this.length**2 + this.width**2);
    color = "blue"; // Default color for the car
    id = crypto.randomUUID();

    get angleInDegrees() {
        return this.angle * 180 / Math.PI;
    }
}