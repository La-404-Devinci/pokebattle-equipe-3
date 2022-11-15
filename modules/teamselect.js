import { PokeCard } from "./pokecard.js"
import { PokeEdit } from "./pokeedit.js"
import { PokeSearch } from "./pokesearch.js"
import * as util from "./util.js"

export class TeamSelect{
    constructor(window) {
        this.window = window
        this.teamInterface = {
            path : new Path2D(),
            x : 0,
            y : 0,
            width : 0,
            height : 0,
            row : 3,
            column : 2,
            offset : {
                x : 5,
                y : 15
            },
            interoffset : {
                x : 10,
                y : 20
            },
            card : {
                width : 0,
                heigth : 0
            }
        }
        this.pokecards = []
        this.activewindow = null
        this.pokesearch = new PokeSearch(this.window, this)
        this.pokeedit = new PokeEdit(this.window, this)
        this.activecard = null
    }

    drawCards() {
        for (let index = 0; index < this.pokecards.length; index++) {
            // Calc pos :
            let x = this.teamInterface.offset.x + (index % column) * (this.teamInterface.interoffset.x + this.teamInterface.card.width)
            let y = this.teamInterface.offset.y + (~~(index / column)) * (this.teamInterface.interoffset.y + this.teamInterface.card.heigth)
            this.pokecards.moveTo({x: x, y : y})
            this.pokecards[index].update()
        }
    }

    initCards() {
        for (let index = 0; index < 6; index++) {
            let pokeid = localStorage.getItem("poketeam" + index)
            if (pokeid != null) {
                this.pokecards[index] = new PokeCard(this.window, util.createPokemonFromId(pokeid))    
            }
            else {
                this.pokecards[index] = new PokeCard(this.window, null)
            }
        }
    }

    calcCardSize() {
        this.teamInterface.card.width = (this.teamInterface.width - this.teamInterface.offset.x * 2 - this.teamInterface.interoffset.x * (this.teamInterface.column - 1)) / 2
        this.teamInterface.card.heigth = (this.teamInterface.height - this.teamInterface.offset.y * 2 - this.teamInterface.interoffset.y * (this.teamInterface.row - 1)) / 2
    }
}