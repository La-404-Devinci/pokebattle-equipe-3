import * as util from "./util.js"
import { Background } from './background.js';

const title_dir = "./rsc/pokelogo.png"
const logo_dir = "./rsc/404logo.png"

export class TitleScreen{
    constructor(window) {
        this.window = window
        this.title = {
            img : new Image(),
            x : this.window.canvas.width / 2,
            y : this.window.canvas.height / 2,
            height : 0,
            width : 0
        }
        this.title.img.src = title_dir
        this.title.height = this.window.canvas.height * (2/10)
        this.title.width = this.title.height * (this.title.img.naturalWidth / this.title.img.naturalHeight)
        console.log((this.title.img.naturalWidth / this.title.img.naturalHeight))

        this.mouseisover = false
        this.titleState = {
            current : 0,
            max : 10
        }

        let logosize = this.window.canvas.width * (3/20)
        this.logo = {
            img : new Image(),
            rotation : 0,
            over : false,
            size  : logosize, 
            x : this.window.canvas.width  - logosize,
            y : this.window.canvas.height - logosize
        }
        this.logo.img.src = logo_dir

        this.buttonPlay = {
            path : new Path2D(),
            colors : [[255,203,5], [60,90,166]],
            color : [242, 93, 24],
            over : false,
            x : this.title.x,
            y : this.title.y + this.title.height,
            width : this.title.width * (2/3) ,
            height : this.title.height / 2,
            triangle : new Path2D()
        }
        this.buttonPlay.path.roundRect(this.buttonPlay.x - (this.buttonPlay.width / 2), this.buttonPlay.y - (this.buttonPlay.height/2), this.buttonPlay.width, this.buttonPlay.height, [10])
        const offset = this.buttonPlay.height / 5
        this.buttonPlay.triangle.moveTo(this.buttonPlay.x - (this.buttonPlay.height / 2) + offset, this.buttonPlay.y + (this.buttonPlay.height/2) - offset);
        this.buttonPlay.triangle.moveTo(this.buttonPlay.x - (this.buttonPlay.height / 2) + offset, this.buttonPlay.y - (this.buttonPlay.height/2) + offset);
        this.buttonPlay.triangle.moveTo(this.buttonPlay.x + (this.buttonPlay.height / 2) - offset, this.buttonPlay.y);
        this.buttonPlay.triangle.moveTo(this.buttonPlay.x - (this.buttonPlay.height / 2) + offset, this.buttonPlay.y + (this.buttonPlay.height/2) - offset);

        this.background = new Background(this.window.canvas)
        this.window.addInterface(this.background)
        
    }

    update() {
        this.buttonAnimation()
        this.titleAnimation()
        this.logoAnimation()
        this.draw()
    }

    draw() {
        //Titre
        this.window.ctx.drawImage(this.title.img, this.title.x -( this.title.width / 2), this.title.y - (this.title.height / 2), this.title.width, this.title.height)
        //Logo 404
        this.drawLogo()
        //Bouton play
        this.window.ctx.fillStyle = util.toRGB(this.buttonPlay.color)
        this.window.ctx.fill(this.buttonPlay.path)

        this.buttonPlay.triangle = new Path2D()
        const offset = this.buttonPlay.height / 5
        this.buttonPlay.triangle.moveTo(this.buttonPlay.x - (this.buttonPlay.height / 2) + offset, this.buttonPlay.y + (this.buttonPlay.height/2) - offset);
        this.buttonPlay.triangle.lineTo(this.buttonPlay.x - (this.buttonPlay.height / 2) + offset, this.buttonPlay.y - (this.buttonPlay.height/2) + offset);
        this.buttonPlay.triangle.lineTo(this.buttonPlay.x + (this.buttonPlay.height / 2) - offset, this.buttonPlay.y);
        this.buttonPlay.triangle.lineTo(this.buttonPlay.x - (this.buttonPlay.height / 2) + offset, this.buttonPlay.y + (this.buttonPlay.height/2) - offset);
        this.buttonPlay.triangle.closePath()
        this.window.ctx.fillStyle = 'rgb(246,117,32)'
        this.window.ctx.fill(this.buttonPlay.triangle)

    }

    titleAnimation() {
        let dy = -1
        if (this.mouseisover) {dy*=-1}
        if (0 <= this.titleState.current + dy && this.titleState.current + dy  <= this.titleState.max) {
            this.titleState.current += dy
            this.title.y -= dy
        }
    }

    buttonAnimation() {
        let colors = []
        if (this.buttonPlay.over) {
            colors = [this.buttonPlay.colors[0], this.buttonPlay.colors[1]]
        }
        else {
            colors = [this.buttonPlay.colors[1], this.buttonPlay.colors[0]]
        }
        if (util.sameColor(this.buttonPlay.color, colors[1])) return
        util.colorGradiant(this.buttonPlay.color, colors, 1.2)
    }

    logoAnimation() {
        console.log(this.logo.rotation)
        var vit = 0.5 / 30
        if (this.logo.rotation > 20) {vit = 0.1}
        if (this.logo.over) {
            this.logo.rotation += vit
        }
        else {
            if (this.logo.rotation > vit) {
                this.logo.rotation -= vit
            }
            else {
                this.logo.rotation = 0
            }
        }
    }

    drawLogo() {
        this.window.ctx.translate(this.logo.x + this.logo.size / 2, this.logo.y + this.logo.size / 2);
        this.window.ctx.rotate(Math.PI * this.logo.rotation);
        this.window.ctx.drawImage(this.logo.img, - this.logo.size / 2, - this.logo.size / 2, this.logo.size, this.logo.size)
        this.window.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    overTitle(pos) {
        if (this.title.x - this.title.width/2 <= pos.x && pos.x <= this.title.x + this.title.width / 2 && this.title.y - this.title.height/2 <= pos.y && pos.y <= this.title.y + this.title.height/2) {
            this.mouseisover = true
        }
        else {
            this.mouseisover = false
        }
    }

    overButton(pos) {
        this.buttonPlay.over = this.window.ctx.isPointInPath(this.buttonPlay.path, pos.x, pos.y)
    }

    overLogo(pos) {
        if (this.logo.x <= pos.x && pos.x <= this.logo.x + this.logo.size && this.logo.y <= pos.y && pos.y <= this.logo.y + this.logo.size) {
            this.logo.over = true
        }
        else {
            this.logo.over = false
        }
    }

    onMouseMove(event) {
        var pos = util.getCanvasRelative(event)
        this.overTitle(pos)
        this.overButton(pos)
        this.overLogo(pos)
    }

    onMouseClick(event){
        this.start()
    }

    start() {
        this.window.removeInterface((inter) => {
            return (inter  == this || inter == this.background)
        });
    }

}