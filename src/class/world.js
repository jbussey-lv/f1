
export class World{
    timestep = 1 / 60; // 60 FPS
    constructor(cars = []){
        this.cars = cars;
    }
}