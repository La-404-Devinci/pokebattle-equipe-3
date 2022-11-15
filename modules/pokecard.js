import * as util from "./util.js"

export class PokeCard{
    constructor(window, pokemon) {
        this.window = window
        this.pokemon = pokemon
        this.cadre = {
            pathext : new Path2D(),
            pathint : new Path2D(),
            x : 0,
            y : 0,
            width : 50,
            heigth : 150,
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
            heigth : 0
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

    init() {
        this.sprite.img.src = localStorage.getItem(this.pokemon.name + '-front')
        this.sprite.width = this.cadre.width - 2 * this.cadre.offset
        this.sprite.heigth = this.sprite.width * (this.sprite.img.naturalHeight / this.sprite.img.naturalWidth) 
    }

    update() {
        this.drawCadre()
        if (this.pokemon == null) return
        this.drawSprite()
    }
    
    drawCadre() {
        // this.cadre.pathext = new Path2D()
        this.cadre.pathext.roundRect(this.cadre.x - (this.outline / 2), this.cadre.y - (this.cadre.outline / 2), this.cadre.width + (this.cadre.outline / 2), this.cadre.heigth + (this.cadre.outline / 2), [10])
        this.window.ctx.fillStyle = util.toRGB(this.cadre.colorext)
        this.window.ctx.fill(this.cadre.pathext)
        // this.cadre.pathint = new Path2D()
        this.cadre.pathint.roundRect(this.cadre.x, this.cadre.y, this.cadre.width, this.cadre.heigth, [10])
        this.window.ctx.fillStyle = util.toRGB(this.cadre.colorint)
        this.window.ctx.fill(this.cadre.pathint)
    }

    drawSprite() {
        this.window.ctx.drawImage(this.sprite.img, this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.heigth)
    }
}