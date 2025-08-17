const svgNamespace = "http://www.w3.org/2000/svg";

class Car{
    position = new Victor(8, 16);
    velocity = new Victor(0, 0);
    angle = 0; // in radians
    angulerVelocity = 0; // in radians per second
    width = 2; // in meters
    length = 4; // in meters
    mass = 1500; // in kg
    com = new Victor(this.width / 2, this.length / 2);
    moment = (1/12) * this.mass * (this.length**2 + this.width**2);
    id = crypto.randomUUID();
}

class World{
    timestep = 1 / 60; // 60 FPS
    constructor(cars = []){
        this.cars = cars;
    }
}


class View{
    pixelsPerMeter = 10;
    meterCenter = new Victor(0, 0);
    constructor(world, svgCanvas){
        this.world = world;
        this.svgCanvas = svgCanvas;
    }

    get pixelCenterCoords() {
        return new Victor(
            this.widthInPixels / 2,
            this.heightInPixels / 2
        );
    }

    draw() {
        this.svgCanvas.innerHTML = ""; // Clear previous drawings
        this.drawAxis();
        this.world.cars.forEach(car => {
            this.drawCar(car);
        });
    }

    get widthInPixels() {
        return this.svgCanvas.clientWidth;
    }

    get heightInPixels() {
        return this.svgCanvas.clientHeight;
    }

    get widthInMeters() {
        return this.widthInPixels / this.pixelsPerMeter;
    }
    get heightInMeters() {
        return this.heightInPixels / this.pixelsPerMeter;
    }

    meterCoordsToPixelCoords(meterCoords) {
        const pixelCenterCoords = this.pixelCenterCoords;
        const xInPixels = pixelCenterCoords.x + meterCoords.x * this.pixelsPerMeter;
        const yInPixels = pixelCenterCoords.y - meterCoords.y * this.pixelsPerMeter;
        return new Victor(xInPixels, yInPixels);
    }

    pixelCoordsToMeterCoords(pixelCoords) {
        return new Victor(
            (pixelCoords.x - this.widthInPixels / 2) / this.pixelsPerMeter + this.meterCenter.x,
            (pixelCoords.y - this.heightInPixels / 2) / this.pixelsPerMeter + this.meterCenter.y
        );
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

    get heightInMeters() {
        return this.heightInPixels / this.pixelsPerMeter;
    }
    get widthInMeters() {
        return this.widthInPixels / this.pixelsPerMeter;
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
        this.svgCanvas.appendChild(line);
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

    addLabelAtMeterCoords(meterCoords, text, fontSize = 12, fillColor = "black") {
        const pixelCoords = this.meterCoordsToPixelCoords(meterCoords);
        this.addLabelAtPixelCoords(pixelCoords, text, fontSize, fillColor);
    }

    addLabelAtPixelCoords(pixelCoords, text, fontSize = 12, fillColor = "black") {
        const textElement = document.createElementNS(svgNamespace, "text");
        textElement.setAttribute("x", pixelCoords.x+2);
        textElement.setAttribute("y", pixelCoords.y-2);
        textElement.setAttribute("font-size", fontSize);
        textElement.setAttribute("fill", fillColor);
        textElement.textContent = text;
        this.svgCanvas.appendChild(textElement);
    }
    
    drawAxis() {
        const oomHeight = 10**Math.floor(Math.log10(this.heightInMeters-1));
        const oomWidth = 10**Math.floor(Math.log10(this.widthInMeters-1));
        const oom = Math.min(oomHeight, oomWidth);

        const minXTick = Math.ceil(this.minXInMeters / oom) * oom;
        const maxXTick = Math.floor(this.maxXInMeters / oom) * oom;
        const minYTick = Math.ceil(this.minYInMeters / oom) * oom;
        const maxYTick = Math.floor(this.maxYInMeters / oom) * oom;

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
        const yInMeters = 0
        this.addLabelAtMeterCoords(new Victor(xInMeters, yInMeters), xInMeters.toFixed(2), 10, "black");
    }

    addYTick(yInMeters) {
        const color = (yInMeters === 0) ? "black" : "grey";
        const width = (yInMeters === 0) ? 1 : 0.5;
        this.addHorizontalLineAtYMeters(yInMeters, color, width);
        const xInMeters = 0
        this.addLabelAtMeterCoords(new Victor(xInMeters, yInMeters), yInMeters.toFixed(2), 10, "black");
    }

    drawCar(car) {
        const x = (car.position.x - car.com.x) * this.pixelsPerMeter + this.meterCenter.x;
        const y = (car.position.y - car.com.y) * this.pixelsPerMeter + this.meterCenter.y;

        const rectWidth = car.width * this.pixelsPerMeter;
        const rectLength = car.length * this.pixelsPerMeter;

        const fillColor = "blue"; // Default color for the car

        drawRectangle(this.svgCanvas, x, y, rectWidth, rectLength, fillColor);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cars = [new Car()]
    const world = new World(cars);
    const svgCanvas = document.getElementById("svgCanvas");
    const view = new View(world, svgCanvas);
    view.draw();
});




function drawRectangle(svg, x, y, width, height, fillColor) {
    const rect = document.createElementNS(svgNamespace, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", fillColor);
    rect.setAttribute("data-center-x", x + width / 2);
    rect.setAttribute("data-center-y", y + height / 2);
    svg.appendChild(rect);
}

