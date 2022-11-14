import { PokeSprite } from "./pokesprite.js"
import { InfoWindow } from "./infoWindow.js"

export class PokeInterface {
    constructor(combat, team) {
        this.combat = combat
        this.canvas = this.combat.canvas
        this.ctx = this.canvas.getContext('2d')
        this.team = team
        this.pokemon = null
        this.infoWindow = null
        this.pokeSprite = null
        this.getNewPokemon()
    }

    getNewPokemon() {
        if (this.team == 'A') {
            this.pokemon = this.combat.terrain.pokemonA
        }

        if (this.team == 'B') {
            this.pokemon = this.combat.terrain.pokemonB
        }
        this.initPokemon()
        this.initInfoWindow()
    }

    initPokemon() {
        var spriteType = '-back'
        var x = 200
        var y = 400
        if (this.team == 'B') {
            spriteType = '-front'
            x = 800
            y = 200
        }
        const sprite = new Image()
        sprite.src = localStorage.getItem(this.pokemon.name + spriteType)
        this.pokeSprite = new PokeSprite(this, {
            x: x,
            y: y
        }, sprite)
        return
    }

    initInfoWindow() {
        var x = this.canvas.width / 2
        var y = 325
        if (this.team == 'B') {
            x = 75
            y = 100
        }
        this.infoWindow = new InfoWindow(this.canvas, {
            x: x,
            y: y
        }, this.pokemon)
    }

    drawPokemons() {
        this.ctx.drawImage(pokeImg, this.width * 0.6, this.height / 7, pokeAImg.naturalWidth * 2.7, pokeAImg.naturalHeight * 2.7)
    }

    update() {
        if (this.infoWindow != null) {
            this.infoWindow.update()
        }
        if (this.pokeSprite != null) {
            this.pokeSprite.update()
        }
    }

    attackAnimation() {
        this.pokeSprite.attackAnimation()
    }

    koAnimation() {
        this.pokeSprite.koAnimation()
    }
}