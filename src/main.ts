import { View } from './class/view.ts'
import { Car } from './class/car.ts'
import { World } from './class/world.ts'
import { Controller } from './class/controller.ts';

const cars = [new Car()]
const world = new World(cars);

document.addEventListener("DOMContentLoaded", () => {
    const svgCanvas = document.getElementById("svgCanvas");
    if (!svgCanvas) {
        throw new Error("SVG canvas not found");
    }
    const view = new View(world, svgCanvas);
    view.draw();
});

// Event listener for when a gamepad is connected
window.addEventListener("gamepadconnected", (event) => {
  const gamepad = event.gamepad;
  cars[0].controller = new Controller(gamepad);
});






