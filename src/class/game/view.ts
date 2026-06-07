import { clamp, radiansToDegrees, cartesianRadiansToSvgDegrees } from "../../helper.ts";
import World from "./world.js";
import Body from "../physics/body.js";
import AbstractShape from "../shapes/abstract_shape.ts";
import Rectangle from "../shapes/rectangle.ts";
import Circle from "../shapes/circle.ts";
import Vec from "../../vec.ts";

const svgNamespace = "http://www.w3.org/2000/svg";

export default class View{
    pixelsPerMeter: number = 100;
    meterCenter: Vec = new Vec(0, 0);
    world: World;
    svg: HTMLElement;
    constructor(world: World, svg: HTMLElement) {
        this.world = world;
        this.svg = svg;
        this.animate();
    }

    get pixelCenterCoords() {
        return new Vec(
            this.widthInPixels / 2,
            this.heightInPixels / 2
        );
    }

    animate(){
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    draw() {
        const r = 2
        this.clearCanvas();
        const bodyPos = this.world.bodies[0].position;
        this.meterCenter = new Vec(
            clamp(this.meterCenter.x, bodyPos.x - r, bodyPos.x + r),
            clamp(this.meterCenter.y, bodyPos.y - r, bodyPos.y + r)
        )
        this.drawAxis();
        this.world.bodies.forEach(body => {
            this.drawBody(body);
        });
    }

    clearCanvas(){
        this.svg.innerHTML = `  <defs>
    <marker id="arrowhead" orient="auto" markerWidth="10" markerHeight="7"
            refX="0" refY="2">
      <path d="M0,0 L4,2 L0,4 Z" fill="red" />
    </marker>
  </defs>`;
    }
    

    drawRectangleInMeters(
        positionInMeters: Vec,
        widthInMeters: number,
        heightInMeters: number,
        angleInRadians: number,
        fillColor: string
    ) {
        const positionInPixels = this.meterCoordsToPixelCoords(positionInMeters);
        const widthInPixels = widthInMeters * this.pixelsPerMeter;
        const heightInPixels = heightInMeters * this.pixelsPerMeter;
        this.drawRectangleInPixels(
            positionInPixels,
            widthInPixels,
            heightInPixels,
            radiansToDegrees(angleInRadians),
            fillColor
        );
    }

    drawDotInPixels(
        positionInPixels: Vec,
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

    getRectangleInPixels(
        positionInPixels: Vec,
        widthInPixels: number,
        heightInPixels: number,
        angleInDegrees: number,
        fillColor: string
    ): SVGRectElement{
        const rotateTransform = `${-1 * angleInDegrees} ${positionInPixels.x} ${positionInPixels.y}`;
        const translateTranform = `${-1 * widthInPixels/2} ${-1 * heightInPixels/2}`;
        const rect = document.createElementNS(svgNamespace, "rect");
        rect.setAttribute("x", positionInPixels.x.toString());
        rect.setAttribute("y", positionInPixels.y.toString());
        rect.setAttribute("width", widthInPixels.toString());
        rect.setAttribute("height", heightInPixels.toString());
        rect.setAttribute("fill", fillColor);
        rect.setAttribute("transform", `rotate(${rotateTransform}) translate(${translateTranform})`);
        return rect;
    }

    drawRectangleInPixels(
        positionInPixels: Vec,
        widthInPixels: number,
        heightInPixels: number,
        angleInDegrees: number,
        fillColor: string
    ){
        const rect = this.getRectangleInPixels(
            positionInPixels,
            widthInPixels,
            heightInPixels,
            angleInDegrees,
            fillColor
        )
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

    meterCoordsToPixelCoords(meterCoords: Vec) {
        const pixelCenterCoords = this.pixelCenterCoords;
        const xInPixels = pixelCenterCoords.x + (meterCoords.x-this.meterCenter.x) * this.pixelsPerMeter;
        const yInPixels = pixelCenterCoords.y - (meterCoords.y-this.meterCenter.y) * this.pixelsPerMeter;
        return new Vec(xInPixels, yInPixels);
    }

    pixelCoordsToMeterCoords(pixelCoords: Vec) {
        return new Vec(
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
        startMeterCoords: Vec,
        endMeterCoords: Vec,
        strokeColor: string = "black",
        strokeWidth: number = 1
    ) {
        const startPixelCoords = this.meterCoordsToPixelCoords(startMeterCoords);
        const endPixelCoords = this.meterCoordsToPixelCoords(endMeterCoords);

        this.addLineViaPixelCoords(startPixelCoords, endPixelCoords, strokeColor, strokeWidth); 
    }

    addLineViaPixelCoords(
        startPixelCoords: Vec,
        endPixelCoords: Vec,
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
    
    addArrowViaMeterCoords(
        startMeterCoords: Vec,
        endMeterCoords: Vec,
        strokeColor: string = "black",
        strokeWidth: number = 1
    ) {
        const startPixelCoords = this.meterCoordsToPixelCoords(startMeterCoords);
        const endPixelCoords = this.meterCoordsToPixelCoords(endMeterCoords);
        this.addArrowViaPixelCoords(startPixelCoords, endPixelCoords, strokeColor, strokeWidth);
    }

    addArrowViaPixelCoords(
        startPixelCoords: Vec,
        endPixelCoords: Vec,
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
        line.setAttribute("marker-end", "url(#arrowhead)");
        this.svg.appendChild(line);
    }

    addHorizontalLineAtYMeters(
        y: number,
        strokeColor: string = "black",
        strokeWidth: number = 1
    ) {
        const start = new Vec(this.minXInMeters, y);
        const end = new Vec(this.maxXInMeters, y);
        this.addLineViaMeterCoords(start, end, strokeColor, strokeWidth);
    }

    addVerticalLineAtXMeters(x: number, strokeColor = "black", strokeWidth = 1) {
        const start = new Vec(x, this.minYInMeters);
        const end = new Vec(x, this.maxYInMeters);
        this.addLineViaMeterCoords(start, end, strokeColor, strokeWidth);
    }

    addLabelAtMeterCoords(
        meterCoords: Vec,
        text: string,
        color: string,
        boundHor: boolean=false,
        boundVer: boolean=false
    ) {
        const pixelCoords = this.meterCoordsToPixelCoords(meterCoords);
        this.addLabelAtPixelCoords(pixelCoords, text, color, boundHor, boundVer);
    }

    addLabelAtPixelCoords(
        pixelCoords: Vec,
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
            new Vec(xInMeters, 0),
            xInMeters.toFixed(2),
            color,
            true,
            true
        );
    }

    addYTick(yInMeters: number) {
        const color = (yInMeters === 0) ? "black" : "grey";
        const width = (yInMeters === 0) ? 1 : 0.5;
        this.addHorizontalLineAtYMeters(yInMeters, color, width);
        this.addLabelAtMeterCoords(
            new Vec(0, yInMeters),
            yInMeters.toFixed(2),
            color,
            true,
            true
        );
    }

    rectangleToSVG(rectangle: Rectangle): SVGRectElement{
        const positionInPixels = this.meterCoordsToPixelCoords(rectangle.position)
        const widthInPixels = rectangle.width * this.pixelsPerMeter;
        const heightInPixels = rectangle.height * this.pixelsPerMeter;

        return this.getRectangleInPixels(
            positionInPixels,
            widthInPixels,
            heightInPixels,
            radiansToDegrees(rectangle.ang),
            rectangle.color
        )
    }

    circleToSVG(circle: Circle): SVGElement {
        const positionInPixels = this.meterCoordsToPixelCoords(circle.position)
        const radiusInPixels = circle.radius * this.pixelsPerMeter;

        return this.getCircleInPixels(
            positionInPixels,
            radiusInPixels,
            cartesianRadiansToSvgDegrees(circle.ang),
            circle.color
        )
    }

    createSVGElement(type: string): SVGElement {
        return document.createElementNS(svgNamespace, type);
    }

    getCircleInPixels(
        positionInPixels: Vec,
        radiusInPixels: number,
        angleInDegrees: number,
        color: string
    ): SVGElement {
        const posX = positionInPixels.x.toString();
        const posY = positionInPixels.y.toString();
        const radius = radiusInPixels.toString();
        const strokeWidth = (radiusInPixels/10).toString();
        const group = this.createSVGElement("g");
        const circElement = this.createSVGElement("circle");
        circElement.setAttribute("cx", "0");
        circElement.setAttribute("cy", "0");
        circElement.setAttribute("r", radius);
        circElement.setAttribute("fill", color);
        const lineElement = this.createSVGElement("line");
        lineElement.setAttribute("x1", "0");
        lineElement.setAttribute("y1", "0");
        lineElement.setAttribute("x2", "0");
        lineElement.setAttribute("y2", radius);
        lineElement.setAttribute("style", `stroke:red;stroke-width:${strokeWidth}`);
        
        group.appendChild(circElement);
        group.appendChild(lineElement);
        const rotate = `rotate(${angleInDegrees})`;
        const translate = `translate(${posX}, ${posY})`
        group.setAttribute("transform", `${translate}, ${rotate}`);
        return group
    }

    shapeToSvgElement(shape: AbstractShape): SVGElement {
        let svgElement: SVGElement = document.createElementNS(svgNamespace, "rect");
        if(shape instanceof Rectangle){
            svgElement = this.rectangleToSVG(shape);
        } else if(shape instanceof Circle){
            svgElement = this.circleToSVG(shape);
        }
        return svgElement;
    }

    drawBody(body: Body) {
        const group = document.createElementNS(svgNamespace, "g");
        body.shapes.forEach((shape: AbstractShape) => {
            const svgElement = this.shapeToSvgElement(shape);
            group.appendChild(svgElement);
        });
        const bodyPositionInPixels = this.meterCoordsToPixelCoords(body.position);
        const rotateTransform = `${-1 * body.angle * 180 / Math.PI} ${bodyPositionInPixels.x} ${bodyPositionInPixels.y}`;
        const translateTransform = `${body.position.x * this.pixelsPerMeter} ${-1 * body.position.y * this.pixelsPerMeter}`;
        group.setAttribute("transform", `rotate(${rotateTransform}) translate(${translateTransform})`);

        this.svg.appendChild(group);
        // Draw center of mass

        this.drawDotInPixels(this.meterCoordsToPixelCoords(body.position), 3, "red");
        // this.addLabelAtMeterCoords(
        //     body.position,
        //     `(${body.position.x.toFixed(1)}, ${body.position.y.toFixed(1)}) angle: ${body.angleInDegrees.toFixed(0)}°`,
        //     "red"
        // )
        
        const minVectorMagnitude = 0.05;
        body.leverArms.forEach(leverArm => {
            if(leverArm.force.mag < minVectorMagnitude){
                return;
            }
            // Draw force vector
            const start = body.position.add(leverArm.displacement);
            const end = start.add(leverArm.force.divide(2000)); // Scale down for visualization
            this.addArrowViaMeterCoords(start, end, "red", 2);

        });
    }
}