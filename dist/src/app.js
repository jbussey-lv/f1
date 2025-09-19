"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const view_js_1 = require("./class/view.js");
const car_js_1 = require("./class/car.js");
const world_js_1 = require("./class/world.js");
document.addEventListener("DOMContentLoaded", () => {
    const cars = [new car_js_1.Car()];
    const world = new world_js_1.World(cars);
    const svgCanvas = document.getElementById("svgCanvas");
    if (!svgCanvas) {
        throw new Error("SVG canvas not found");
    }
    const view = new view_js_1.View(world, svgCanvas);
    view.draw();
});
