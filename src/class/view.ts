import Victor from "victor";
import { clamp } from "../module/helper.ts";
import { World } from "./world.js";
import { Car } from "./car.js";

const svgNamespace = "http://www.w3.org/2000/svg";

export class View{
    pixelsPerMeter: number = 6;
    meterCenter: Victor = new Victor(0, 0);
    world: World;
    svg: HTMLElement;
    constructor(world: World, svg: HTMLElement) {
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
        requestAnimationFrame(() => this.animate());
    }

    draw() {
        this.svg.innerHTML = ""; // Clear previous drawings
        this.drawAxis();
        this.world.bodies.forEach(car => {
            this.drawCar(car);
        });
    }

    drawRectangleInMeters(
        positionInMeters: Victor,
        dimensionsInMeters: Victor,
        comInMeters: Victor,
        angleInDegrees: number,
        fillColor: string
    ) {
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
            positionInMeters,
            `(${positionInMeters.x.toFixed(1)}, ${positionInMeters.y.toFixed(1)}) angle: ${angleInDegrees.toFixed(0)}°`,
            "red"
        )
    }

    drawDotInPixels(
        positionInPixels: Victor,
        radiusInPixels: number,
        fillColor: string
    ) {
        const circle = document.createElementNS(svgNamespace, "circle");
        circle.setAttribute("cx", positionInPixels.x.toString());
        circle.setAttribute("cy", positionInPixels.y.toString());
        circle.setAttribute("r", radiusInPixels.toString());
        circle.setAttribute("fill", fillColor);
        this.svg.appendChild(circle);
    }

    drawRectangleInPixels(
        positionInPixels: Victor,
        comInPixels: Victor,
        dimensionsInPixels: Victor,
        angleInDegrees: number,
        fillColor: string
    ){
        const rotateTransform = `${-1 * angleInDegrees} ${positionInPixels.x} ${positionInPixels.y}`;
        const translateTranform = `${-1 * comInPixels.x} ${-1 * comInPixels.y}`;
        const rect = document.createElementNS(svgNamespace, "rect");
        rect.setAttribute("x", positionInPixels.x.toString());
        rect.setAttribute("y", positionInPixels.y.toString());
        rect.setAttribute("width", dimensionsInPixels.x.toString());
        rect.setAttribute("height", dimensionsInPixels.y.toString());
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

    meterCoordsToPixelCoords(meterCoords: Victor) {
        const pixelCenterCoords = this.pixelCenterCoords;
        const xInPixels = pixelCenterCoords.x + (meterCoords.x-this.meterCenter.x) * this.pixelsPerMeter;
        const yInPixels = pixelCenterCoords.y - (meterCoords.y-this.meterCenter.y) * this.pixelsPerMeter;
        return new Victor(xInPixels, yInPixels);
    }

    pixelCoordsToMeterCoords(pixelCoords: Victor) {
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

    addLineViaMeterCoords(
        startMeterCoords: Victor,
        endMeterCoords: Victor,
        strokeColor: string = "black",
        strokeWidth: number = 1
    ) {
        const startPixelCoords = this.meterCoordsToPixelCoords(startMeterCoords);
        const endPixelCoords = this.meterCoordsToPixelCoords(endMeterCoords);

        this.addLineViaPixelCoords(startPixelCoords, endPixelCoords, strokeColor, strokeWidth); 
    }

    addLineViaPixelCoords(
        startPixelCoords: Victor,
        endPixelCoords: Victor,
        strokeColor = "black",
        strokeWidth = 1
    ) {
        const line = document.createElementNS(svgNamespace, "line");
        line.setAttribute("x1", startPixelCoords.x.toString());
        line.setAttribute("y1", startPixelCoords.y.toString());
        line.setAttribute("x2", endPixelCoords.x.toString());
        line.setAttribute("y2", endPixelCoords.y.toString());
        line.setAttribute("stroke", strokeColor);
        line.setAttribute("stroke-width", strokeWidth.toString());
        this.svg.appendChild(line);
    }

    addHorizontalLineAtYMeters(
        y: number,
        strokeColor: string = "black",
        strokeWidth: number = 1
    ) {
        const start = new Victor(this.minXInMeters, y);
        const end = new Victor(this.maxXInMeters, y);
        this.addLineViaMeterCoords(start, end, strokeColor, strokeWidth);
    }

    addVerticalLineAtXMeters(x: number, strokeColor = "black", strokeWidth = 1) {
        const start = new Victor(x, this.minYInMeters);
        const end = new Victor(x, this.maxYInMeters);
        this.addLineViaMeterCoords(start, end, strokeColor, strokeWidth);
    }

    addLabelAtMeterCoords(
        meterCoords: Victor,
        text: string,
        color: string,
        boundHor: boolean=false,
        boundVer: boolean=false
    ) {
        const pixelCoords = this.meterCoordsToPixelCoords(meterCoords);
        this.addLabelAtPixelCoords(pixelCoords, text, color, boundHor, boundVer);
    }

    addLabelAtPixelCoords(
        pixelCoords: Victor,
        text: string,
        fillColor: string,
        boundHor: boolean=false,
        boundVer: boolean=false
    ) {
        const textElement = document.createElementNS(svgNamespace, "text");
        textElement.setAttribute("x", (pixelCoords.x+2).toString());
        textElement.setAttribute("y", (pixelCoords.y-2).toString());
        textElement.setAttribute("font-size", (12).toString());
        textElement.setAttribute("fill", fillColor);
        textElement.textContent = text;
        this.svg.appendChild(textElement);
        const textBBox = textElement.getBBox();
        if(boundHor){
            const x = clamp(pixelCoords.x+2, 0, this.widthInPixels-textBBox.width);
            textElement.setAttribute("x", x.toString());
        }
        if(boundVer){
            const y = clamp(pixelCoords.y-2, 0+textBBox.height, this.heightInPixels);
            textElement.setAttribute("y", y.toString());
        }
    }
    
    drawAxis() {
        const oomHeight = 10**Math.floor(Math.log10(this.heightInMeters-1));
        const oomWidth = 10**Math.floor(Math.log10(this.widthInMeters-1));
        const oom = Math.min(oomHeight, oomWidth);

        const minXTick = (Math.ceil(this.minXInMeters / oom)-1) * oom;
        const maxXTick = (Math.floor(this.maxXInMeters / oom)+1) * oom;
        const minYTick = (Math.ceil(this.minYInMeters / oom)-1) * oom;
        const maxYTick = (Math.floor(this.maxYInMeters / oom)+1) * oom;

        for (let yInMeters = minYTick; yInMeters <= maxYTick; yInMeters += oom) {
            this.addYTick(yInMeters);
        }

        for (let xInMeters = minXTick; xInMeters <= maxXTick; xInMeters += oom) {
            this.addXTick(xInMeters);
        }
    }

    addXTick(xInMeters: number) {
        const color = (xInMeters === 0) ? "black" : "grey";
        const width = (xInMeters === 0) ? 1 : 0.5;
        this.addVerticalLineAtXMeters(xInMeters, color, width);
        this.addLabelAtMeterCoords(
            new Victor(xInMeters, 0),
            xInMeters.toFixed(2),
            "black",
            false,
            true
        );
    }

    addYTick(yInMeters: number) {
        const color = (yInMeters === 0) ? "black" : "grey";
        const width = (yInMeters === 0) ? 1 : 0.5;
        this.addHorizontalLineAtYMeters(yInMeters, color, width);
        this.addLabelAtMeterCoords(
            new Victor(0, yInMeters),
            yInMeters.toFixed(2),
            color,
            false,
            true
        );
    }

    drawCar(car: Car) {
        this.drawRectangleInMeters(
            car.position,
            car.dimensions,
            car.com,
            car.angleInDegrees,
            car.color);
    }
}