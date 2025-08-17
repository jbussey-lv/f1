
export class World{
    time = 0;
    timestepSeconds = 1/120; // 60 FPS
    timestepMilliseconds = this.timestepSeconds * 1000; // Convert to milliseconds
    constructor(cars = []){
        this.cars = cars;
        setInterval(() => this.run(), this.timestepMilliseconds);
    }

    run() {
        this.time += this.timestepSeconds;
        this.cars.forEach(car => {
            car.angle += car.angulerVelocity * this.timestepSeconds;
            // car.position = new Victor(
            //     20 * Math.sin(car.angle),
            //     -20 * Math.cos(car.angle)
            // );
        });
    }

}