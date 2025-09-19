import { View } from './class/view.js'
import { Car } from './class/car.js'
import { World } from './class/world.js'

document.addEventListener("DOMContentLoaded", () => {
    const cars = [new Car()]
    const world = new World(cars);
    const svgCanvas = document.getElementById("svgCanvas");
    const view = new View(world, svgCanvas);
    view.draw();
});






