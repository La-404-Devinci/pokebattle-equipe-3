export class PokeSprite {
    constructor(pokeInterface, pos, sprite) {
        this.pokeInterface = pokeInterface
        this.canvas = this.pokeInterface.canvas
        this.ctx = this.canvas.getContext('2d')
        this.pos = pos
        this.absolutePos = pos
        this.sprite = sprite
        this.attackTick = 0 // C'est en gros le compteur de frame d'animation de l'attaque, donc si c'est = 0 il n'y a pas d'animation
        this.koTick = 0
        this.speed = {
            x: 0,
            y: 0
        }
        this.animationTiming = { //ptit espace pour stocker les key frames d'animation 
            attack: {
                moveForward: 0.3 * 60,
                moveBackward: 0.6 * 60
            },
            ko: {
                moveup: 0.2 * 60,
                movedown: 20 * 60
            }
        }
    }

    update() {
        this.animations() //on fait toutes les animations dans cette fonction
        this.draw()
    }

    animations() {
        if (this.attackTick != 0) this.attackAnimation()
        if (this.koTick != 0) this.koAnimation()
        this.move()
    }

    isAnimation() {
        if (this.attackTick != 0 || this.koTick != 0) {
            return true
        }
        return false
    }

    draw() {
        //On calcule un coef pour avoir un effet d'eloignement des pokemons
        const multiplier = 2.2 + (this.pos.y / this.canvas.width)
        const width = this.sprite.naturalWidth * multiplier
        const height = this.sprite.naturalHeight * multiplier
            //Les coord this.x et this.y sont les coord du centre du sprite, on fait donc ici une conversion
        const x = this.pos.x - (width / 2)
        const y = this.pos.y - (height / 2)
            //Et on dessine
        this.ctx.drawImage(this.sprite, x, y, width, height)
    }

    attackAnimation() {
        if (this.attackTick == 0 && !this.isAnimation) return
        this.attackTick++
            const dx = 1
        const dy = 2
        if (this.attackTick <= this.animationTiming.attack.moveForward) {
            if (this.pokeInterface.team == 'A') {
                //On est donc sur le pokemon inf de l'écran
                this.speed.x = dx
                this.speed.y = -dy
            } else {
                this.speed.x = -dx
                this.speed.y = dy
            }
        } else if (this.attackTick <= this.animationTiming.attack.moveBackward) {
            if (this.pokeInterface.team == 'A') {
                //On est donc sur le pokemon inf de l'écran
                this.speed.x = -dx
                this.speed.y = dy
            } else {
                this.speed.x = dx
                this.speed.y = -dy
            }
        } else {
            //Si on rentre ici c'est que l'animation est finito
            this.attackTick = 0
            this.speed.x = 0
            this.speed.y = 0
            this.pos = this.absolutePos
        }
    }

    koAnimation() {
        if (this.koTick == 0 && !this.isAnimation) return
        this.koTick++
            const dy = 1
        if (this.koTick <= this.animationTiming.ko.moveup) {
            this.speed.y = -dy
        } else if (this.koTick <= this.animationTiming.ko.movedown) {
            this.speed.y = dy
        } else {
            this.koTick = 0
            this.speed.y = 0
        }
    }

    move() {
        //On integre la speed
        this.pos.x += this.speed.x
        this.pos.y += this.speed.y
    }


}