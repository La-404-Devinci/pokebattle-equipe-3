export class InfoWindow {
    constructor(canvas, pos, pokemon) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.x = pos.x
        this.y = pos.y
        this.pokemon = pokemon
        this.healthBarCurrentHp = pokemon.currentStats['hp']
        this.healthBar = null
        this.deltaHp = 0
            // ------------------------------------------------------
            // Des var accesible pour pouvoir edit la gueule des trucs
        this.gap = 10
        this.width = 275
        this.height = 75
        this.curve = [10]
            //def des couleurs utiles
        this.colorExt = 'rgb(108,108,108)'
        this.colorInt = 'rgb(248,248,216)'
            // ------------------------------------------------------
    }


    drawBackground() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colorExt
        this.ctx.roundRect(this.x, this.y, this.width, this.height, this.curve)
        this.ctx.fill()
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colorInt
        this.ctx.roundRect(this.x + (this.gap / 2), this.y + (this.gap / 2), this.width - this.gap, this.height - this.gap, this.curve)
        this.ctx.fill()
    }

    drawInformation() {
        this.ctx.font = '16px arial'
        this.ctx.fillStyle = 'black'
        this.ctx.textAlign = 'left';
        this.ctx.fillText(this.pokemon.name.toUpperCase(), this.x + this.width / 10, this.gap + this.y + this.height / 6)
        this.ctx.fillText(`LV.${this.pokemon.level}`, this.x + this.width * 0.8, this.gap + this.y + this.height / 6)
    }

    drawHPbar() {
        const hpx = this.gap + this.x + this.width / 6.5
        const hpy = this.gap + this.y + this.height / 3
        const hpwidth = this.width * (0.6)
        const hpheight = this.height * 0.15
        const currentHPwidth = hpwidth * (this.healthBarCurrentHp / this.pokemon.stats['hp'])
        this.healthBar = new Path2D()
        var hpcolor = 'green'
        if (4 * this.healthBarCurrentHp < this.pokemon.stats['hp']) {
            hpcolor = 'red'
        } else if (2 * this.healthBarCurrentHp < this.pokemon.stats['hp']) {
            hpcolor = 'orange'
        }
        this.ctx.font = '16px arial bold'
        this.ctx.fillStyle = 'black'
        this.ctx.textAlign = 'left';
        this.ctx.fillText('HP', hpx - this.width / 10, hpy + hpheight)
        this.ctx.fillText(`${Math.round(this.healthBarCurrentHp)}/${this.pokemon.stats['hp']}`, hpx + hpwidth, hpy + hpheight)
        this.ctx.fillStyle = this.colorExt
        this.ctx.beginPath()
        this.ctx.roundRect(hpx, hpy, hpwidth, hpheight, [0, 10, 0, 10])
        this.ctx.fill()
        this.ctx.fillStyle = hpcolor
        this.healthBar.roundRect(hpx, hpy, currentHPwidth, hpheight, [0, 10, 0, 10])
        this.ctx.fill(this.healthBar)
    }

    update() {
        //Ici on peut faire une animation mais flemme
        this.animations() //on fait toutes les animations dans cette fonction
        this.drawBackground()
        this.drawInformation()
        this.drawHPbar()
        return
    }

    animations() {
        this.healthBarAnimation()
    }

    healthBarAnimation() {
        if (this.healthBarCurrentHp <= this.pokemon.currentStats['hp']) {
            this.healthBarCurrentHp = this.pokemon.currentStats['hp']
            this.deltaHp = 0
            return
        }
        const numberOfFrames = 2 * 60
        if (this.deltaHp == 0) {
            this.deltaHp = (this.healthBarCurrentHp - this.pokemon.currentStats['hp']) / numberOfFrames
        }
        this.healthBarCurrentHp -= this.deltaHp;
    }
}