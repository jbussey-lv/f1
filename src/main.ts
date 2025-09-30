import View from './class/view.ts'
import World from './class/world.ts'
// import { Controller } from './class/controller.ts';
import { Car } from './class/car.ts';
import { Controller } from './class/controller.ts';


const car = new Car();
car.position.x = 0;
car.position.y = 0;
car.angle = 90 * Math.PI / 180; // 90 degrees in radians
const world = new World([car]);

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
  car.controller = new Controller(gamepad);
  console.log(`Gamepad connected at index ${gamepad.index}: ${gamepad.id}.`);
});






