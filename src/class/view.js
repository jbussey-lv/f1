const svgNamespace = "http://www.w3.org/2000/svg";

export class View{
    pixelsPerMeter = 12;
    meterCenter = new Victor(0, 0);
    constructor(world, svg){
        this.world = world;
        this.svg = svg;
        this.animate();
    }

    get pixelCenterCoords() {
        return new Victor(
            this.widthInPixels / 2,
            this.heightInPixels / 2
        );
    }

    animate(){
        this.draw();
        // requestAnimationFrame(() => this.animate());
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
        this.drawRectangleInPixels(
            positionInPixels,
            comInPixels,
            dimensionsInPixels,
            angleInDegrees,
            fillColor
        );
        this.drawDotInPixels(positionInPixels, 3, "red");
        this.addLabelAtMeterCoords(
            positionInMeters.clone().subtractX(comInMeters).addY(comInMeters),
            `(${positionInMeters.x.toFixed(1)}, ${positionInMeters.y.toFixed(1)}) angle: ${angleInDegrees.toFixed(0)}°`,
            "red"
        )
    }

    drawDotInPixels(positionInPixels, radiusInPixels, fillColor) {
        const circle = document.createElementNS(svgNamespace, "circle");
        circle.setAttribute("cx", positionInPixels.x);
        circle.setAttribute("cy", positionInPixels.y);
        circle.setAttribute("r", radiusInPixels);
        circle.setAttribute("fill", fillColor);
        this.svg.appendChild(circle);
    }

    // positionInPixels,
    // comInPixels,
    // dimensionsInPixels,
    // angleInDegrees
    // color
    drawRectangleInPixels(positionInPixels, comInPixels, dimensionsInPixels, angleInDegrees, fillColor){
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

    addLabelAtMeterCoords(meterCoords, text, color) {
        const pixelCoords = this.meterCoordsToPixelCoords(meterCoords);
        this.addLabelAtPixelCoords(pixelCoords, text, color);
    }

    addLabelAtPixelCoords(pixelCoords, text, fillColor) {
        const textElement = document.createElementNS(svgNamespace, "text");
        textElement.setAttribute("x", pixelCoords.x+2);
        textElement.setAttribute("y", pixelCoords.y-2);
        textElement.setAttribute("font-size", 12);
        textElement.setAttribute("fill", fillColor);
        textElement.textContent = text;
        this.svg.appendChild(textElement);
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
        this.addLabelAtMeterCoords(new Victor(xInMeters, yInMeters), xInMeters.toFixed(2), "black");
    }

    addYTick(yInMeters) {
        const color = (yInMeters === 0) ? "black" : "grey";
        const width = (yInMeters === 0) ? 1 : 0.5;
        this.addHorizontalLineAtYMeters(yInMeters, color, width);
        const xInMeters = 0
        this.addLabelAtMeterCoords(new Victor(xInMeters, yInMeters), yInMeters.toFixed(2), "black");
    }

    drawCar(car) {
        this.drawRectangleInMeters(
            car.position,
            car.dimensions,
            car.com,
            car.angleInDegrees,
            car.color);
    }
}