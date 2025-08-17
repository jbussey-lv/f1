
export class World{
    timestepSeconds = 1; // 60 FPS
    timestepMilliseconds = this.timestepSeconds * 1000; // Convert to milliseconds
    constructor(cars = []){
        this.cars = cars;
        setInterval(() => this.run(), this.timestepMilliseconds);
    }

    run() {
        this.cars.forEach(car => {
            car.angle += car.angulerVelocity * this.timestepSeconds;
        });
    }

}