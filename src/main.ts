import { View } from './class/view.ts'
import { Car } from './class/car.ts'
import { World } from './class/world.ts'

document.addEventListener("DOMContentLoaded", () => {
    const cars = [new Car()]
    const world = new World(cars);
    const svgCanvas = document.getElementById("svgCanvas");
    if (!svgCanvas) {
        throw new Error("SVG canvas not found");
    }
    const view = new View(world, svgCanvas);
    view.draw();
});






