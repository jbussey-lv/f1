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

let gamepadIndex: number | undefined;

// Event listener for when a gamepad is connected
window.addEventListener("gamepadconnected", (event) => {
  const gamepad = event.gamepad;
  gamepadIndex = gamepad.index;
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    gamepad.index, gamepad.id, gamepad.buttons.length, gamepad.axes.length);
  const logOutput = document.getElementById("logOutput");
  if (logOutput) {
    logOutput.textContent = "Controller connected: " + gamepad.id + "\n";
  }
  gameLoop();
});

// Event listener for when a gamepad is disconnected
window.addEventListener("gamepaddisconnected", () => {
  gamepadIndex = undefined;
  console.log("Gamepad disconnected.");
  const logOutput = document.getElementById("logOutput");
  if (logOutput) {
    logOutput.textContent = "Controller disconnected.\n";
  }
});

// Main game loop to continuously check controller state
function gameLoop() {
  if (gamepadIndex !== undefined) {
    const myGamepad = navigator.getGamepads()[gamepadIndex];
    
    if (!myGamepad) {
      console.log("Gamepad not found.");
      return;
    }
    // Log button presses
    myGamepad.buttons.forEach((button, index) => {
      if (button.pressed) {
        const logOutput = document.getElementById("logOutput");
        if (logOutput) {
          logOutput.textContent = `Button ${index} pressed. Value: ${button.value}\n`;
        }
      }
    });
    
    // Log joystick movements (axes)
    myGamepad.axes.forEach((axis, index) => {
      if (Math.abs(axis) > 0.1) { // Add a small dead zone
        const logOutput = document.getElementById("logOutput");
        if (logOutput){
            logOutput.textContent = `Axis ${index} moved. Value: ${axis}\n`;
        }
      }
    });
  }
  
  // Re-run the loop on the next animation frame
  requestAnimationFrame(gameLoop);
}






