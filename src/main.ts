import Victor from 'victor';

import View from './class/game/view.ts'
import World from './class/game/world.ts'
// import { Controller } from './class/controller.ts';
import { Car } from './class/car/car.ts';
import { Controller } from './class/game/controller.ts';
import { Cart } from './class/cart/cart.ts';


// const car = new Car(new Controller());
// car.position.x = 0;
// car.position.y = 0;
// car.angle = 90 * Math.PI / 180; // 90 degrees in radians

const cart = new Cart(new Controller());


const world = new World([cart]);

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
  cart.controller.gamePad = gamepad;
  console.log(`Gamepad connected at index ${gamepad.index}: ${gamepad.id}.`);
});
