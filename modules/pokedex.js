import * as util from './util.js'

export class Pokedex{
    constructor() {
        this.pokemonNames = []
        this.count = 0
        fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0').then((response) => {
            response.json().then((data) => {
                this.init(data)
            })
        })
    }

    init(data) {
        this.count = data.count
        data.results.forEach(res => {
            this.pokemonNames.push(res.name)
        });
        this.pokemonNames.sort()
    }

    getStartingWith(str) {
        if (str == '') return this.pokemonNames
        res = []
        //On trouve le bon indice de début
        var index = 0
        while (!(util.startWith(this.pokemonNames[index], str)) && index <= this.count) {
            index++
        }
        const index1 = index
        while (util.startWith(this.pokemonNames[index], str) && index <= this.count) {
            res.push(this.pokemon.name[index])
            index++
        }
        const index2 = index - 1
        return res
    }
}