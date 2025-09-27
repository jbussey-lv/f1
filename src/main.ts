import View from './class/view.ts'
import World from './class/world.ts'
// import { Controller } from './class/controller.ts';
import { Bug } from './class/bug.ts';
import { Controller } from './class/controller.ts';


const bug = new Bug();
bug.position.x = 0;
bug.position.y = 0;
bug.angle = Math.PI / -6; // 90 degrees in radians
const world = new World([bug]);

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
  bug.controller = new Controller(gamepad);
  console.log(`Gamepad connected at index ${gamepad.index}: ${gamepad.id}.`);
});






