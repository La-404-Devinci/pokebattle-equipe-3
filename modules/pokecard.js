import * as util from "./util.js"

export class PokeCard{
    constructor(window, pokemon) {
        this.window = window
        this.pokemon = pokemon
        this.isactive = false
        this.cadre = {
            pathext : new Path2D(),
            pathint : new Path2D(),
            x : 0,
            y : 0,
            width : 0,
            height : 0,
            outline : 5,
            offset : 5,
            colorext : [108,108,108],
            colorint : [248,248,216],
            colorselect : {
                colorext : [255,203,5] ,
                colorint: [60,90,166]
            }
        }
        this.sprite = { // Les coords sont relative par rapport au cadre
            img : new Image(),
            x : this.cadre.offset,
            y : this.cadre.offset * 2,
            width : 0,
            height : 0
        }
        if (this.pokemon != null) {
            this.init()
        } 
    }

    moveTo(pos) {
        this.cadre.x = pos.x
        this.cadre.y = pos.y
    }

    setPokemon(pokemon) {
        if (pokemon == null) return
        this.pokemon = pokemon
        this.init()
    }

    setSize(size) {
        // size = {width : value, height : value}
        this.cadre.width = size.width
        this.cadre.height = size.height
    }

    init() {
        this.sprite.img.src = localStorage.getItem(this.pokemon.name + '-front')
        this.sprite.width = this.cadre.width - 2 * this.cadre.offset
        this.sprite.height = this.sprite.width * (this.sprite.img.naturalHeight / this.sprite.img.naturalWidth) 
    }

    update() {
        this.drawCadre()
        if (this.pokemon == null) return
        this.drawSprite()
    }
    
    drawCadre() {
        // this.cadre.pathext = new Path2D()
        this.cadre.pathext.roundRect(this.cadre.x, this.cadre.y, this.cadre.width, this.cadre.height, [10])
        if (this.isactive) {
            this.window.ctx.fillStyle = util.toRGB(this.cadre.colorselect.colorext)
        }
        else{
            this.window.ctx.fillStyle = util.toRGB(this.cadre.colorext)
        }
        this.window.ctx.fill(this.cadre.pathext)
        // this.cadre.pathint = new Path2D()
        this.cadre.pathint.roundRect(this.cadre.x + this.cadre.outline, this.cadre.y + this.cadre.outline, this.cadre.width - 2 * this.cadre.outline, this.cadre.height - 2 * this.cadre.outline, [10])
        if (this.isactive) {
            this.window.ctx.fillStyle = util.toRGB(this.cadre.colorselect.colorint)
        }
        else{
            this.window.ctx.fillStyle = util.toRGB(this.cadre.colorint)
        }
        this.window.ctx.fill(this.cadre.pathint)
    }

    drawSprite() {
        this.window.ctx.translate(this.cadre.x, this.cadre.y)
        this.window.ctx.drawImage(this.sprite.img, this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height)
        this.window.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawName() {
        this.window.ctx.translate(this.cadre.x, this.cadre.y)
        this.window.ctx.font = ((this.sprite.height) *(1/4)) + 'px';
        this.window.ctx.textAlign = 'center'
        this.window.ctx.fillText(this.pokemon.name, this.sprite.x + this.sprite.width / 2, this.sprite.y + this.sprite.height*2);
        this.window.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    isOver(pos) {
        return (this.window.ctx.isPointInPath(this.cadre.pathext, pos.x, pos.y))
    }
}