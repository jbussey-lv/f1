export class Controller{
    gamepad: Gamepad;
    throttleButtonIndex: number = 7; // Right trigger
    steeringAxisIndex: number = 0; // Left stick horizontal
    deadZone: number = 0.03; // Dead zone for joystick
    constructor(gamepad: Gamepad) {
        console.log("Controller initialized with gamepad:", gamepad.id);
        this.gamepad = gamepad;
        setInterval(() => {
            this.logit()
        }, 500);
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

    logit() {

        console.log(this.steering, this.throttle);
        
    }
}
