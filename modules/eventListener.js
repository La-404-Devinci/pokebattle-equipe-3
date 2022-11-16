export class EventListener {
    constructor(window) {
        this.window = window
    }

    onMouseClick(e) {
        this.window.interfaces.forEach(inter => {
            if (typeof inter.onMouseClick == 'function') {
                inter.onMouseClick(e)
            }
        });
    }

    onMouseMove(e) {
        this.window.interfaces.forEach(inter => {
            if (typeof inter.onMouseMove == 'function') {
                inter.onMouseMove(e)
            }
        });
    }

    onMouseRelease(e) {
        this.window.interfaces.forEach(inter => {
            if (typeof inter.onMouseRelease == 'function') {
                inter.onMouseRelease(e)
            }
        });
    }

    onKeyPress(e) { 
        this.window.interfaces.forEach(inter => {
            if (typeof inter.onKeyPress == 'function') {
                inter.onKeyPress(e)
            }
        });
    }
}