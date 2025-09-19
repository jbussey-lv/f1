"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
const victor_1 = __importDefault(require("victor"));
class World {
    constructor(cars = []) {
        this.time = 0;
        this.timestepSeconds = 1 / 120;
        this.timestepMilliseconds = this.timestepSeconds * 1000; // Convert to milliseconds
        this.cars = cars;
        setInterval(() => this.run(), this.timestepMilliseconds);
    }
    run() {
        this.time += this.timestepSeconds;
        this.cars.forEach(car => {
            car.angle += car.angulerVelocity * this.timestepSeconds;
            car.position = new victor_1.default(20 * Math.sin(car.angle), -20 * Math.cos(car.angle));
        });
    }
}
exports.World = World;
