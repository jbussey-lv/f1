import View from './class/view.ts'
import World from './class/world.ts'
// import { Controller } from './class/controller.ts';
import { Bug } from './class/bug.ts';
import { Controller } from './class/controller.ts';

const world = new World();

document.addEventListener("DOMContentLoaded", () => {
    const svgCanvas = document.getElementById("svgCanvas");
    if (!svgCanvas) {
        throw new Error("SVG canvas not found");
    }
    const view = new View(world, svgCanvas);
    view.draw();
});


const bug = new Bug();
world.bodies.push(bug);

// Event listener for when a gamepad is connected
window.addEventListener("gamepadconnected", (event) => {
  const gamepad = event.gamepad;
  bug.controller = new Controller(gamepad);
  console.log(`Gamepad connected at index ${gamepad.index}: ${gamepad.id}.`);
});






