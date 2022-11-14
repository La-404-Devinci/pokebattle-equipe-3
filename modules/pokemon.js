import * as util from "./util.js"

export class Pokemon {
    /**
     *
     * @param pokejson
     */
    constructor(pokejson) {
        this.name = pokejson.name
        this.types = ['none', 'none']
        pokejson.types.forEach(element => {
            this.types[element.slot - 1] = element.type.name
                //On oublie pas d'ajouter les ressources img
            if (localStorage.getItem(element.type.name) == null) {
                localStorage.setItem(element.type.name, element.type.url)
            }
        });
        this.stats = {}
        this.currentStats = {}
        this.statsStage = {} //https://gamefaqs.gamespot.com/boards/925601-pokemon-diamond-version/52912319
        pokejson.stats.forEach(stat => {
            let key = stat.stat.name
            let value = stat.base_stat
            this.stats[key] = value
            this.currentStats[key] = value
            this.statsStage[key] = 0
            if (localStorage.getItem(key) == null) {
                localStorage.setItem(key, stat.stat.url)
            }
        });
        this.possiblesmoves = [] // pas la peine de tout récup sur les moves vu que on peut appeler l'api pour avoir les detail juste avec leurs noms
        pokejson.moves.forEach(element => {
            let value = element.move.name
            this.possiblesmoves.push(value)
        });
        this.currentMoves = [null, null, null, null]
        this.status = "Healthy"
        this.level = 50
        this.terrain = null
        this.team = null
        this.state = null
        this.abilities = []
        pokejson.abilities.forEach(ability => {
            this.abilities.push(ability.ability.name)
        });
        this.ability = this.abilities[0]


        // On met dans le cache les ressources img
        // On commence par les sprites du pokemon
        if (localStorage.getItem(this.name + '-front') == null) {
            localStorage.setItem(this.name + '-front', pokejson.sprites.front_default)
            localStorage.setItem(this.name + '-back', pokejson.sprites.back_default)
        }
    }

    calcStats() {

    }

    setTerrain(terrain) {
        this.terrain = terrain
    }

    setTeam(team) {
        if (team in ['A', 'B']) {
            this.team = team
        }
    }

    setAbility(abName) {
        if (abName in this.abilities) {
            this.ability = abName
        }
    }

    /**
     * 
     * @param {string} moveName le nom du move
     * @param {int} index l'index au quel le move serra mit
     */
    async setMove(moveName, index) {
        this.currentMoves[index] = await util.createMoveFromName(moveName)
    }

    /**
     * 
     * @param {int} moveIndex l'index du move que l'on souhaite utiliser dans la liste currentMoves
     * @param {Pokemon} pokemon le pokemon contre lequel on se bat
     * @param {int} gen la generation
     */
    useMove(moveIndex, pokemon) {
        let res = [this.currentMoves[moveIndex].category, null]
        if (res[0] == null) return
        if (res[0].includes('damage')) {
            res[1] = this.useAttackMove(moveIndex, pokemon)
        }
        return res
    }

    useAttackMove(moveIndex, pokemon) {
        //console.log(pokemon.currentMoves)
        return util.damageCalculationGen5Onward(this.currentMoves[moveIndex], this, pokemon)
    }

    addStatStage(statName, value) {
        if (this.statsStage[statName] + value > 6) {
            this.statsStage[statName] = 6
        } else if (this.statsStage[statName] + value < -6) {
            this.statsStage[statName] = -6
        } else {
            this.statsStage[statName] += value
        }
        this.currentStatsCalculation()
    }

    currentStatsCalculation() {
        Object.entries(this.currentStats).forEach(([name, value]) => {
            if (name != 'hp') {
                this.currentStats[name] = this.stats[name] * util.getMultiplierFromStage(this.statsStage[name])
            }
        });
    }


}