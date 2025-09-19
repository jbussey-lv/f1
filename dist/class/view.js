"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
const helper_js_1 = require("./helper.js");
const svgNamespace = "http://www.w3.org/2000/svg";
class View {
    constructor(world, svg) {
        this.pixelsPerMeter = 12;
        this.meterCenter = new Victor(0, 0);
        this.world = world;
        this.svg = svg;
        this.animate();
    }
    get pixelCenterCoords() {
        return new Victor(this.widthInPixels / 2, this.heightInPixels / 2);
    }
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    draw() {
        this.svg.innerHTML = ""; // Clear previous drawings
        this.drawAxis();
        this.world.cars.forEach(car => {
            this.drawCar(car);
        });
    }
    drawRectangleInMeters(positionInMeters, dimensionsInMeters, comInMeters, angleInDegrees, fillColor) {
        const positionInPixels = this.meterCoordsToPixelCoords(positionInMeters);
        const dimensionsInPixels = dimensionsInMeters.clone().multiplyScalar(this.pixelsPerMeter);
        const comInPixels = comInMeters.clone().multiplyScalar(this.pixelsPerMeter);
        this.drawRectangleInPixels(positionInPixels, comInPixels, dimensionsInPixels, angleInDegrees, fillColor);
        this.drawDotInPixels(positionInPixels, 3, "red");
        this.addLabelAtMeterCoords(positionInMeters, `(${positionInMeters.x.toFixed(1)}, ${positionInMeters.y.toFixed(1)}) angle: ${angleInDegrees.toFixed(0)}°`, "red");
    }
    drawDotInPixels(positionInPixels, radiusInPixels, fillColor) {
        const circle = document.createElementNS(svgNamespace, "circle");
        circle.setAttribute("cx", positionInPixels.x);
        circle.setAttribute("cy", positionInPixels.y);
        circle.setAttribute("r", radiusInPixels);
        circle.setAttribute("fill", fillColor);
        this.svg.appendChild(circle);
    }
    drawRectangleInPixels(positionInPixels, comInPixels, dimensionsInPixels, angleInDegrees, fillColor) {
        const rotateTransform = `${-1 * angleInDegrees} ${positionInPixels.x} ${positionInPixels.y}`;
        const translateTranform = `${-1 * comInPixels.x} ${-1 * comInPixels.y}`;
        const rect = document.createElementNS(svgNamespace, "rect");
        rect.setAttribute("x", positionInPixels.x);
        rect.setAttribute("y", positionInPixels.y);
        rect.setAttribute("width", dimensionsInPixels.x);
        rect.setAttribute("height", dimensionsInPixels.y);
        rect.setAttribute("fill", fillColor);
        rect.setAttribute("transform", `rotate(${rotateTransform}) translate(${translateTranform})`);
        this.svg.appendChild(rect);
    }
    get widthInPixels() {
        return this.svg.clientWidth;
    }
    get heightInPixels() {
        return this.svg.clientHeight;
    }
    get widthInMeters() {
        return this.widthInPixels / this.pixelsPerMeter;
    }
    get heightInMeters() {
        return this.heightInPixels / this.pixelsPerMeter;
    }
    meterCoordsToPixelCoords(meterCoords) {
        const pixelCenterCoords = this.pixelCenterCoords;
        const xInPixels = pixelCenterCoords.x + (meterCoords.x - this.meterCenter.x) * this.pixelsPerMeter;
        const yInPixels = pixelCenterCoords.y - (meterCoords.y - this.meterCenter.y) * this.pixelsPerMeter;
        return new Victor(xInPixels, yInPixels);
    }
    pixelCoordsToMeterCoords(pixelCoords) {
        return new Victor((pixelCoords.x - this.widthInPixels / 2) / this.pixelsPerMeter + this.meterCenter.x, (pixelCoords.y - this.heightInPixels / 2) / this.pixelsPerMeter + this.meterCenter.y);
    }
    get minXInMeters() {
        return this.meterCenter.x - this.widthInMeters / 2;
    }
    get maxXInMeters() {
        return this.meterCenter.x + this.widthInMeters / 2;
    }
    get minYInMeters() {
        return this.meterCenter.y - this.heightInMeters / 2;
    }
    get maxYInMeters() {
        return this.meterCenter.y + this.heightInMeters / 2;
    }
    addLineViaMeterCoords(startMeterCoords, endMeterCoords, strokeColor = "black", strokeWidth = 1) {
        const startPixelCoords = this.meterCoordsToPixelCoords(startMeterCoords);
        const endPixelCoords = this.meterCoordsToPixelCoords(endMeterCoords);
        this.addLineViaPixelCoords(startPixelCoords, endPixelCoords, strokeColor, strokeWidth);
    }
    addLineViaPixelCoords(startPixelCoords, endPixelCoords, strokeColor = "black", strokeWidth = 1) {
        const line = document.createElementNS(svgNamespace, "line");
        line.setAttribute("x1", startPixelCoords.x);
        line.setAttribute("y1", startPixelCoords.y);
        line.setAttribute("x2", endPixelCoords.x);
        line.setAttribute("y2", endPixelCoords.y);
        line.setAttribute("stroke", strokeColor);
        line.setAttribute("stroke-width", strokeWidth);
        this.svg.appendChild(line);
    }
    addHorizontalLineAtYMeters(y, strokeColor = "black", strokeWidth = 1) {
        const start = new Victor(this.minXInMeters, y);
        const end = new Victor(this.maxXInMeters, y);
        this.addLineViaMeterCoords(start, end, strokeColor, strokeWidth);
    }
    addVerticalLineAtXMeters(x, strokeColor = "black", strokeWidth = 1) {
        const start = new Victor(x, this.minYInMeters);
        const end = new Victor(x, this.maxYInMeters);
        this.addLineViaMeterCoords(start, end, strokeColor, strokeWidth);
    }
    addLabelAtMeterCoords(meterCoords, text, color, boundHor = false, boundVer = false) {
        const pixelCoords = this.meterCoordsToPixelCoords(meterCoords);
        this.addLabelAtPixelCoords(pixelCoords, text, color, boundHor, boundVer);
    }
    addLabelAtPixelCoords(pixelCoords, text, fillColor, boundHor = false, boundVer = false) {
        const textElement = document.createElementNS(svgNamespace, "text");
        textElement.setAttribute("x", pixelCoords.x + 2);
        textElement.setAttribute("y", pixelCoords.y - 2);
        textElement.setAttribute("font-size", 12);
        textElement.setAttribute("fill", fillColor);
        textElement.textContent = text;
        this.svg.appendChild(textElement);
        const textBBox = textElement.getBBox();
        if (boundHor) {
            textElement.setAttribute("x", (0, helper_js_1.clamp)(pixelCoords.x + 2, 0, this.widthInPixels - textBBox.width));
        }
        if (boundVer) {
            textElement.setAttribute("y", (0, helper_js_1.clamp)(pixelCoords.y - 2, 0 + textBBox.height, this.heightInPixels));
        }
    }
    drawAxis() {
        const oomHeight = Math.pow(10, Math.floor(Math.log10(this.heightInMeters - 1)));
        const oomWidth = Math.pow(10, Math.floor(Math.log10(this.widthInMeters - 1)));
        const oom = Math.min(oomHeight, oomWidth);
        const minXTick = (Math.ceil(this.minXInMeters / oom) - 1) * oom;
        const maxXTick = (Math.floor(this.maxXInMeters / oom) + 1) * oom;
        const minYTick = (Math.ceil(this.minYInMeters / oom) - 1) * oom;
        const maxYTick = (Math.floor(this.maxYInMeters / oom) + 1) * oom;
        for (let yInMeters = minYTick; yInMeters <= maxYTick; yInMeters += oom) {
            this.addYTick(yInMeters);
        }
        for (let xInMeters = minXTick; xInMeters <= maxXTick; xInMeters += oom) {
            this.addXTick(xInMeters);
        }
    }
    addXTick(xInMeters) {
        const color = (xInMeters === 0) ? "black" : "grey";
        const width = (xInMeters === 0) ? 1 : 0.5;
        this.addVerticalLineAtXMeters(xInMeters, color, width);
        this.addLabelAtMeterCoords(new Victor(xInMeters, 0), xInMeters.toFixed(2), "black", false, true);
    }
    addYTick(yInMeters) {
        const color = (yInMeters === 0) ? "black" : "grey";
        const width = (yInMeters === 0) ? 1 : 0.5;
        this.addHorizontalLineAtYMeters(yInMeters, color, width);
        this.addLabelAtMeterCoords(new Victor(0, yInMeters), yInMeters.toFixed(2), false, true);
    }
    drawCar(car) {
        this.drawRectangleInMeters(car.position, car.dimensions, car.com, car.angleInDegrees, car.color);
    }
}
exports.View = View;
