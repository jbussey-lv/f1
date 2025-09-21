import Victor from "victor";
import { Car } from "./car";

export class World{
    time = 0;
    timestepSeconds = 1/120; 
    timestepMilliseconds = this.timestepSeconds * 1000; // Convert to milliseconds
    cars: Car[];
    constructor(cars: Car[] = []){
        this.cars = cars;
        setInterval(() => this.run(), this.timestepMilliseconds);
    }

    run() {
        this.time += this.timestepSeconds;
        this.cars.forEach(car => {
            car.angle += car.steeringAngle * this.timestepSeconds;

            const forward = new Victor(Math.cos(car.angle), Math.sin(car.angle))
                .multiplyScalar(car.throttle);

            console.log(forward);

            car.position.add(forward);
        });
    }

}