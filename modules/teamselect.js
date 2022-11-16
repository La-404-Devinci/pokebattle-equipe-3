import { PokeCard } from "./pokecard.js"
import { PokeEdit } from "./pokeedit.js"
import { PokeSelect } from "./pokeselect.js"
import * as util from "./util.js"

export class TeamSelect {
    constructor(window) {
        this.window = window
        this.teamInterface = {
            path: new Path2D(),
            color: {
                background: [119, 136, 153]
            },
            x: 0,
            y: 0,
            width: this.window.canvas.width * (1 / 3),
            height: this.window.canvas.height,
            row: 3,
            column: 2,
            offset: {
                x: 5,
                y: 15
            },
            interoffset: {
                x: 10,
                y: 10
            },
            card: {
                width: 0,
                height: 0
            }
        }
        this.pokecards = []
        this.initCards()
        this.calcCardSize()
        this.pokeselect = new PokeSelect(this.window, this)
        this.pokeedit = new PokeEdit(this.window, this)
        this.activecard = 0
        this.pokecards[this.activecard].isactive = true
        this.activewindow = this.pokeselect
    }

    update() {
        // this.drawInterface()
        this.drawCards()
        this.pokeselect.update()
    }

    drawCards() {
        for (let index = 0; index < this.pokecards.length; index++) {
            // Calc pos :
            let x = this.teamInterface.offset.x + (index % this.teamInterface.column) * (this.teamInterface.interoffset.x + this.teamInterface.card.width)
            let y = this.teamInterface.offset.y + (~~(index / this.teamInterface.column)) * (this.teamInterface.interoffset.y + this.teamInterface.card.height)
            this.pokecards[index].moveTo({ x: x, y: y })
            this.pokecards[index].update()
        }
    }

    drawInterface() {
        // Basiquement juste le background
        this.teamInterface.path.rect(this.teamInterface.x, this.teamInterface.y, this.teamInterface.width, this.teamInterface.height)
        this.window.ctx.fillStyle = util.toRGB(this.teamInterface.color.background)
        this.window.ctx.fill(this.teamInterface.path)
    }

    initCards() {
        for (let index = 0; index < 6; index++) {
            let pokeid = localStorage.getItem("poketeam" + index)
            if (pokeid != null) {
                this.pokecards.push(new PokeCard(this.window, util.createPokemonFromId(pokeid)))
            }
            else {
                this.pokecards.push(new PokeCard(this.window, null))
            }
        }
    }

    calcCardSize() {
        this.teamInterface.card.width = (this.teamInterface.width - this.teamInterface.offset.x * 2 - this.teamInterface.interoffset.x * (this.teamInterface.column - 1)) / this.teamInterface.column
        this.teamInterface.card.height = (this.teamInterface.height - this.teamInterface.offset.y * 2 - this.teamInterface.interoffset.y * (this.teamInterface.row -1)) / this.teamInterface.row
        this.applyCardSize()
    }

    applyCardSize() {
        this.pokecards.forEach(card => {
            card.setSize({width : this.teamInterface.card.width, height : this.teamInterface.card.height})
        });
    }


    isOverCard(pos) {
        // Renvoie l'index de la carte si on est dessus une, sinon renvoie -1, plutot basique
        for (let index = 0; index < this.pokecards.length; index++) {
            const card = this.pokecards[index]
            if (card.isOver(pos)) {
                return index
            }
        }
        return -1
    }

    onMouseClick(event) {
        var pos = util.getCanvasRelative(event)
        var index = this.isOverCard(pos)
        if (index != -1) {
            if (index != this.activecard) {
                this.pokecards[this.activecard].isactive = false
                this.activecard = index
                this.pokecards[this.activecard].isactive = true
            }
        }
        this.activewindow.onMouseClick(event)
    }

    onKeyPress(event) {
        this.activewindow.onKeyPress(event)
    }



}