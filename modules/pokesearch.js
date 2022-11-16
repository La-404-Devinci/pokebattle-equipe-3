import * as util from './util.js'

export class PokeSearch{
    constructor(window, pokeselect) {
        this.window = window
        this.pokeselect = pokeselect
        this.text = ''
        this.bar = {
            pathout : new Path2D(),
            pathint : new Path2D(),
            color : {
                inactive : [248, 248, 216],
                active : [217, 217, 189],
                outline : [158, 158, 150],
            },
            x : 0,
            y : 0,
            width : 0,
            height : 0,
            gap : 5
        }
        this.resetButton = {
            path : new Path2D(),
            color : {
                cross : this.bar.color.outline
            },
            x : this.bar.width - this.bar.height - this.bar.gap,
            y : this.bar.gap,
            width : this.bar.height,
            height : this.bar.height,
            gap : 5, 
            linewidth : 5
        }
        this.active = false
    }

    moveTo(pos) {
        this.bar.x = pos.x
        this.bar.y = pos.y
    }

    setSize(size) {
        this.bar.width = size.width
        this.bar.height = size.height
    }

    update(){
        // if(this.pokeselect.teamselect.activewindow != this) return
        this.drawBar()
        this.drawButton()
    }

    addChar(char) {
        console.log(char)
        if (this.active) {
            this.text += char.toLowerCase()    
        }
        this.pokeselect.newText(this.text)
    }

    delChar() {
        console.log('del')
        if (this.active) {
            this.text = this.text.slice(0, -1)
        }
        this.pokeselect.newText(this.text)
    }

    resetText() {
        console.log('reset')
        this.text = ''
        this.pokeselect.newText(this.text)
    }

    drawBar() {
        this.bar.pathout.roundRect(this.bar.x, this.bar.y, this.bar.width, this.bar.height, [10])
        this.window.ctx.fillStyle = util.toRGB(this.bar.color.outline)
        this.window.ctx.fill(this.bar.pathout)
        
        this.bar.pathint.roundRect(this.bar.x + this.bar.gap, this.bar.y + this.bar.gap, this.bar.width - 2 * this.bar.gap, this.bar.height - 2 * this.bar.gap, [10])
        if (this.active) {
            this.window.ctx.fillStyle = util.toRGB(this.bar.color.active)
        }
        else {
            this.window.ctx.fillStyle = util.toRGB(this.bar.color.inactive)
        }
        this.window.ctx.fill(this.bar.pathint)
        this.window.ctx.font = ((this.bar.height - this.bar.gap) *(9/10)) + 'px';
        this.window.ctx.textAlign = 'center'
        this.window.ctx.fillText(this.text, this.bar.x + (this.bar.width / 2), this.bar.y + (this.bar.height / 2));
    }

    click(pos) {
        if (this.window.ctx.isPointInPath(this.resetButton.path, pos.x, pos.y)) {
            this.resetText()
            this.active = true
        }
        else if (this.window.ctx.isPointInPath(this.bar.pathint, pos.x, pos.y)) { 
            this.active = true
        }
        else {
            this.active = false
        }
    }

    drawButton() {
        this.window.ctx.translate(this.bar.x, this.bar.y)
        this.resetButton.path.rect(this.resetButton.x, this.resetButton.y, this.resetButton.width, this.resetButton.height)
        this.window.ctx.beginpath
        this.window.ctx.lineWidth = this.resetButton.linewidth;
        this.window.ctx.beginPath();
        this.window.ctx.moveTo(this.resetButton.x, this.resetButton.y);
        this.window.ctx.lineTo(this.resetButton.x + this.resetButton.width, this.resetButton.y + this.resetButton.height);
        this.window.ctx.strokeStyle = this.resetButton.color.cross
        this.window.ctx.stroke();
        this.window.ctx.lineWidth = this.resetButton.linewidth;
        this.window.ctx.beginPath();
        this.window.ctx.moveTo(this.resetButton.x + this.resetButton.width, this.resetButton.y);
        this.window.ctx.lineTo(this.resetButton.x, this.resetButton.y + this.resetButton.height);
        this.window.ctx.strokeStyle = this.resetButton.color.cross
        this.window.ctx.stroke();
        this.window.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

}