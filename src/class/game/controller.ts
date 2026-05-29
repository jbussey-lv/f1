export class Controller{
    _gamepad: Gamepad | null;
    brakeButtonIndex: number = 6;
    throttleButtonIndex: number = 7; // Right trigger
    steeringAxisIndex: number = 0; // Left stick horizontal
    deadZone: number = 0.03; // Dead zone for joystick
    constructor(gamepad: Gamepad | null = null) {
        this._gamepad = gamepad;
        if(!gamepad){return}
        console.log("Controller initialized with gamepad:", gamepad.id);
        this._gamepad = gamepad;
    }

    set gamePad(gamepad: Gamepad){
        this._gamepad = gamepad;
    }

    updateGamepad() {
        if(!this._gamepad){return}
        const gamepad = navigator.getGamepads()[this._gamepad.index];
        if(gamepad){
            this._gamepad = gamepad;
        }
    }

    get throttle() {
        if(!this._gamepad){return 0;}
        this.updateGamepad();
        const throttleButton = this._gamepad.buttons[this.throttleButtonIndex];
        if (throttleButton && Math.abs(throttleButton.value) > this.deadZone) {
            return throttleButton.value;
        } else {
            return 0;
        }
    }

    get brake() {
        if(!this._gamepad){return 0;}
        return this.getButtonValue(this.brakeButtonIndex);
    }

    get steering(): number {
        if(!this._gamepad){return 0;}
        this.updateGamepad();
        const steeringAxisIndex = this._gamepad.axes[this.steeringAxisIndex];
        if (steeringAxisIndex && Math.abs(steeringAxisIndex) > this.deadZone) {
            return -1* steeringAxisIndex;
        } else {
            return 0;
        }
    }

    get leftX(): number {
        return this.getAxesValue(0);
    }
    get leftY(): number {
        return this.getAxesValue(1);
    }
    get rightX(): number {
        return this.getAxesValue(2);
    }
    get rightY(): number {
        return this.getAxesValue(3);
    }
    get r1(): number {
        return this.getButtonValue(5);
    }
    get r2(): number {
        return this.getButtonValue(7);
    }
    get l1(): number {
        return this.getButtonValue(4);
    }
    get l2(): number {
        return this.getButtonValue(6);
    }

    getAxesValue(index: number): number {
        if(!this._gamepad){return 0;}
        this.updateGamepad();
        const axis = this._gamepad.axes[index];
        if (axis && Math.abs(axis) > this.deadZone) {
            return axis;
        } else {
            return 0;
        }
    }

    getButtonValue(index: number): number {
        if(!this._gamepad){return 0;}
        this.updateGamepad();
        const button = this._gamepad.buttons[index];
        return button ? button.value : 0;
    }

}
