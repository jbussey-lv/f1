export class Controller{
    gamepad: Gamepad;
    throttleButtonIndex: number = 7; // Right trigger
    steeringAxisIndex: number = 0; // Left stick horizontal
    deadZone: number = 0.03; // Dead zone for joystick
    constructor(gamepad: Gamepad) {
        console.log("Controller initialized with gamepad:", gamepad.id);
        this.gamepad = gamepad;
    }

    updateGamepad() {
        const gamepad = navigator.getGamepads()[this.gamepad.index];
        if(gamepad){
            this.gamepad = gamepad;
        }
    }

    get throttle() {
        this.updateGamepad();
        const throttleButton = this.gamepad.buttons[this.throttleButtonIndex];
        if (throttleButton && Math.abs(throttleButton.value) > this.deadZone) {
            return throttleButton.value;
        } else {
            return 0;
        }
    }

    get steering() {
        this.updateGamepad();
        const steeringAxisIndex = this.gamepad.axes[this.steeringAxisIndex];
        if (steeringAxisIndex && Math.abs(steeringAxisIndex) > this.deadZone) {
            return -1* steeringAxisIndex;
        } else {
            return 0;
        }
    }

    get leftX() {
        return this.getAxesValue(0);
    }
    get leftY() {
        return this.getAxesValue(1);
    }
    get rightX() {
        return this.getAxesValue(2);
    }
    get rightY() {
        return this.getAxesValue(3);
    }
    get r1() {
        return this.getButtonValue(5);
    }
    get r2() {
        return this.getButtonValue(7);
    }
    get l1() {
        return this.getButtonValue(4);
    }
    get l2() {
        return this.getButtonValue(6);
    }

    getAxesValue(index: number) {
        this.updateGamepad();
        const axis = this.gamepad.axes[index];
        if (axis && Math.abs(axis) > this.deadZone) {
            return axis;
        } else {
            return 0;
        }
    }

    getButtonValue(index: number) {
        this.updateGamepad();
        const button = this.gamepad.buttons[index];
        return button ? button.value : 0;
    }

}
