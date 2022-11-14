import * as util from "./util.js"

export class Terrain {
    constructor(teamA, teamB) {
        this.weather = "normal"
        this.pokeTeamA = teamA
        this.pokemonA = util.getFirstNonNull(teamA)
        this.pokeTeamB = teamB
        this.pokemonB = util.getFirstNonNull(teamB)
        this.pokeTeamA.forEach(pokemon => {
            if (pokemon != null) {
                pokemon.setTerrain(this)
                pokemon.setTeam('A')
            }
        });
        this.pokeTeamB.forEach(pokemon => {
            if (pokemon != null) {
                pokemon.setTerrain(this)
                pokemon.setTeam('B')
            }
        });
    }
}