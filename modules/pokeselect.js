import { Pokedex } from "./pokedex.js"
import { PokeSearch } from "./pokesearch.js"
import { PokeZone } from "./pokezone.js"

export class PokeSelect{
    constructor(window, teamselect) {
        this.window = window
        this.teamselect = teamselect
        this.background = {
            path : new Path2D(),
            x : this.window.canvas.width * (1 / 3),
            y : 0,
            width : this.window.canvas.width * (2 / 3),
            height : this.window.canvas.height
        }
        this.searchoffset = {
            x : this.window.canvas.width * (1 / 10),
            y : this.window.canvas.height * (1 /10)
        }
        this.pokesearch = new PokeSearch(this.window, this)
        this.pokedex = new Pokedex()
        this.pokezone = new PokeZone(this.window, this)
        this.init()
    }

    update(){
        if(this.teamselect.activewindow != this) return
        this.pokesearch.update()
        this.pokezone.update()
    }

    onMouseClick(event) { 
        if(this.teamselect.activewindow != this) return
        var pos = util.getCanvasRelative(event)
    }

    onKeyPress(event) {
        if(this.teamselect.activewindow != this) return
        if (event.location == 0) {
            if (event.code == 8) {
                // Le 8 c'est backspace
                this.pokesearch.delChar()
            }
            else {
                this.pokesearch.addChar(String.fromCharCode(event.code))
            }
        }
    }

    newText(text) {
        const pokemonNameList = this.pokedex.getStartingWith(text)
        this.pokezone.setPokemons(pokemonNameList)
    }

    init() {
        this.pokesearch.moveTo({
            x : this.background.x + this.searchoffset.x,
            y: this.background.y + this.searchoffset.y
        })
        this.pokesearch.setSize({
            width : this.background.width - (2 * this.searchoffset.x),
            height : 3 * this.searchoffset.y
        })
        this.pokezone.moveTo({
            x : this.background.x,
            y : this.background.y + 4 * this.searchoffset.y
        })
        this.pokezone.setSize({
            width : this.background.width,
            height : this.background.height - 4 * this.searchoffset.y
        })
    }
}