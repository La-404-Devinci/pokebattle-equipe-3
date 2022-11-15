import * as util from './util.js'
import { PokeCard } from './pokecard.js';

export class PokeZone{
    constructor(window, pokeselect) {
        this.window = window
        this.pokeselect = pokeselect
        this.background = {
            path : new Path2D(),
            color : {
                background : [119, 136, 153], // ok ici ca manque un peu de consitence pour les nom 
            },
            x : 0, // comme d'hab les coord du background serront les seules coords abs, les autres serront en relative avec celles-ci
            y : 0,
            width : 0,
            height : 0
        }
        this.pokecards = [] // Liste de tout les pokemons qu'il est cense afficher sous forme de card
        this.column = 0
        this.row = 0
        this.gap = {
            x : 0,
            y : 0
        }
    }

    moveTo(pos) {
        this.background.x = pos.x
        this.background.y = pos.y
    }

    setSize(size) {
        this.background.width = size.width
        this.background.height = size.height
    }

    update() {
        this.drawBackground()
    }

    drawBackground() {
        this.background.path.rect(this.background.x, this.background.y, this.background.width, this.background.height)
        this.window.ctx.fillStyle = util.toRGB(this.background.color.background)
        this.window.ctx.fill(this.background.path)
    }

    setPokemons(pokenamelist) {
        this.pokecards = [] // reset
        for (let index = 0; index < pokenamelist.length && index < (this.column * this.row); index++) {
            const pokename = array[index];
            const pokemon = util.createPokemonFromId(pokename)
            this.pokecards.push(new PokeCard(this.window, pokemon))   
        }
        if (this.pokecards == []) {
            alert("Il semble que nous avont pas ce pokemon en stock")
        }
    }

    calcgrid() {
        const width = this.pokeselect.teamselect.teamInterface.card.width
        const height = this.pokeselect.teamselect.teamInterface.card.height
        const mingap = {
            x : width / 4,
            y : height / 4
        }
        var w = this.background.width
        var column = 0
        while ( w - (width + mingap.x)) { 
            w -= (width + mingap.x)
            column++
        }
        if (w - width) { // Dans le cas final ou on peut toujours renter une card
            column++
            w -= width
        }
        var h = this.background.height
        var row = 0
        while ( h - (height + mingap.y)) { 
            h -= (height + mingap.y)
            row++
        }
        if (h - height) { // Dans le cas final ou on peut toujours renter une card
            row++
            h -= height
        }
        this.gap.x = (mingap.x * (column - 1) + w ) / (column + 1) // bon ici formule math
        this.gap.y = (mingap.y * (row - 1) + h ) / (row + 1)
        this.column = column
        this.row = row

    }

    drawGrid() {
        for (let index = 0; index < this.pokecards.length; index++) {
            const card = this.pokecards[index];
            const width = this.pokeselect.teamselect.teamInterface.card.width
            const height = this.pokeselect.teamselect.teamInterface.card.height
            let x = this.gap.x + (index % this.column) * (this.gap.x + width)
            let y = this.gap.y + (~~(index / this.column)) * (this.gap.y + height)
            this.pokecards[index].moveTo({ x: x, y: y })
            card.update()
        }
    }
}