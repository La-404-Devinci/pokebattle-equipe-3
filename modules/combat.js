//Imports
import { Background } from "./background.js"
import { PokeInterface } from "./pokeinterface.js"
import { UserInterface } from "./userinterface.js"
//

export class Combat {
    constructor(window, terrain) {
        this.window = window
        this.window.currentMode = 'combat'
        this.canvas = this.window.canvas
        this.terrain = terrain
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        //console.log(this.ctx)
        if (this.terrain.pokemonA == null || this.terrain.pokemonB == null) {
            alert("il n'y a pas de pokemon dans une ou deux des teams")
        }
        this.pokeInterfaceA = null
        this.pokeInterfaceB = null
        this.UserInterface = null
        this.initCombatMode()
    }


    initCombatMode() {
        this.initBackground()
        this.initPokeInterface()
        this.initUserInterface()
    }

    initBackground() {
        //console.log('backgrf')
        this.window.addInterface(new Background(this.canvas))
    }



    initPokeInterface() {
        this.pokeInterfaceA = new PokeInterface(this, 'A')
        this.pokeInterfaceB = new PokeInterface(this, 'B')
        this.window.addInterface(this.pokeInterfaceA)
        this.window.addInterface(this.pokeInterfaceB)
    }

    initUserInterface() {
        this.window.addInterface(new UserInterface(this))
    }

    useMove(moveIndex) {
        const res = this.terrain.pokemonA.useMove(moveIndex, this.terrain.pokemonB)
        if (res[0].includes('damage')) {
            this.pokeInterfaceA.attackAnimation()
            this.terrain.pokemonB.currentStats['hp'] -= res[1]
            //console.log(`PokeB Hp : ${this.terrain.pokemonB.currentStats['hp']}`)
            if (this.terrain.pokemonB.currentStats['hp'] <= 0) {
                this.pokemonOut('B')
            }
        }
        if (res[0] == 'statusA') {
            res[1].forEach(stat => { // format res dans ce cas par ex: ['statusA', [['defence', 1], ['attack'], 2]]]
                this.terrain.pokemonA.addStatStage(stat[0], stat[1])
            });
        }
    }

    /**
     * Fonction qui gère le ko d'un pokemon, son nom est quand même plutôt explicite
     * @param {string} pokemonRef Est censé être soit 'A' soit 'B' et indiaue donc si le pokemon ko est le pokemon A ou le B 
     * @returns Rien / nada / le vide
     */
    pokemonOut(pokemonRef) {
        if (pokemonRef == 'A') {
            this.pokemonAOut()
            return
        }
        if (pokemonRef == 'B') {
            this.pokemonBOut()
            return
        }
        //console.log('err in fonc pokemon out: wrong reference')
    }

    pokemonAOut() {
        this.terrain.pokemonA.currentStats['hp'] = 0
        this.pokeInterfaceA.koAnimation()
        //Ici on rajoute des fonctions d'animation si besoin
        return
    }

    pokemonBOut() {
        this.terrain.pokemonB.currentStats['hp'] = 0
        this.pokeInterfaceB.koAnimation()
        console.log('GG tu viens de gqgner un combat litéralement imperdable')
        //Ici on rqjoute des fonctions d'animation si besoin
        return
    }

}