import View from './class/view.ts'
import World from './class/world.ts'
// import { Controller } from './class/controller.ts';
import { Bug } from './class/bug.ts';

const world = new World([new Bug()]);

document.addEventListener("DOMContentLoaded", () => {
    const svgCanvas = document.getElementById("svgCanvas");
    if (!svgCanvas) {
        throw new Error("SVG canvas not found");
    }
    const view = new View(world, svgCanvas);
    view.draw();
});

// // Event listener for when a gamepad is connected
// window.addEventListener("gamepadconnected", (event) => {
//   const gamepad = event.gamepad;
//   cars[0].controller = new Controller(gamepad);
// });






