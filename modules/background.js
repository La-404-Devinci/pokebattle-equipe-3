export class Background {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.sol = [new Path2D(), null] // Le path et le gradient pour le fill
        this.ciel = [new Path2D(), null]
        this.intiBackground()
    }

    intiBackground() {
        const horizon = this.canvas.height * 0.3;
        // Les path2d
        this.sol[0].rect(0, horizon, this.canvas.width, this.canvas.height - horizon)
        this.ciel[0].rect(0, 0, this.canvas.width, horizon)
        // Les grad
        this.ciel[1] = this.ctx.createLinearGradient(0, 0, 0, horizon);
        this.ciel[1].addColorStop(0.0, 'rgb(55,121,179)');
        this.ciel[1].addColorStop(0.7, 'rgb(121,194,245)');
        this.ciel[1].addColorStop(1.0, 'rgb(164,200,214)');
        this.sol[1] = this.ctx.createLinearGradient(0, horizon, 0, this.canvas.height);
        this.sol[1].addColorStop(0.0, 'rgb(81,140,20)');
        this.sol[1].addColorStop(1.0, 'rgb(123,177,57)');
    }

    update() {
        this.ctx.fillStyle = this.sol[1]
        this.ctx.fill(this.sol[0])
        this.ctx.fillStyle = this.ciel[1]
        this.ctx.fill(this.ciel[0])
    }
}
