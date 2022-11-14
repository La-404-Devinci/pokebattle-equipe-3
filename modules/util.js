import {
    Move
} from "./move.js"
import {
    Pokemon
} from "./pokemon.js"
import {
    Terrain
} from "./terrain.js";
import {
    Window
} from "./window.js";
import {
    Combat
} from "./combat.js";


export const getCanvasRelative = (e) => {
    var canvas = e.target,
        bx = canvas.getBoundingClientRect();
    return {
        x: e.clientX - bx.left,
        y: e.clientY - bx.top,
        bx: bx
    };
};

export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}



export const createPokemonFromId = async(id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await fetch(url)
    const data = await response.json()
    return new Pokemon(data)
}


export const createMoveFromName = async(name) => {
    const url = `https://pokeapi.co/api/v2/move/${name}`
    const response = await fetch(url)
    const data = await response.json()
    return new Move(data)
}

export const damageCalculationGen5Onward = (move, pokeATT, pokeDEF) => {
    const AD = getADStats(move, pokeATT, pokeDEF)
    const AttackStat = AD[0]
    const DefenseStat = AD[1]
    const weather = getWeather(move, pokeATT)
    const critDamage = 1 // les deg crits ne sont pas implemente
    const random = getRandomInt(85, 101) / 100
    const STAB = getSTAB(move, pokeATT)
    const typeEff = getTypeEff(move, pokeDEF)
    const burn = getBurn(move, pokeATT)
    let damage = ((((((2 * pokeATT.level) / 5) + 2) * move.power * AttackStat / DefenseStat) / 50) + 2) * weather * critDamage * random * STAB * typeEff * burn
    return damage
}

export const getTypeEff = (move, pokeDEF) => {
    let typeEff = 1
    Object.entries(move.types).forEach(([relationType, types]) => {
        pokeDEF.types.forEach(type => {
            if (type in types) {
                if (relationType == 'no_damage_to') {
                    typeEff = 0
                }
                if (relationType == 'half_damage_to') {
                    typeEff = typeEff / 2
                }
                if (relationType == 'double_damage_to') {
                    typeEff = typeEff * 2
                }
            }
        });
    });
    return typeEff
}

export const getSTAB = (move, pokeATT) => {
    let STAB = 1
    if (move.type in pokeATT.types && move.type !== 'typeless') {
        if (pokeATT.ability === 'adaptability') {
            STAB = 2
        } else {
            STAB = 1.5
        }
    }
    return STAB
}

export const getADStats = (move, pokeATT, pokeDEF) => {
    let AttackStat = 0
    let DefenseStat = 1
    if (move.dclass == null) return
    if (move.dclass === 'special') {
        AttackStat = pokeATT.stats['special-attack']
        DefenseStat = pokeDEF.stats['special-defense']
    } else if (move.dclass === 'physical') {
        AttackStat = pokeATT.stats['attack']
        DefenseStat = pokeDEF.stats['defense']
    }
    return [AttackStat, DefenseStat]
}

export const getWeather = (move, pokeATT) => {
    let weather = 1
    if (pokeATT.terrain.weather === 'rain' && "water" === move.type || pokeATT.terrain.weather === 'harsh-sunlight' && "fire" === move.type) {
        weather = 1.5
    } else if (pokeATT.terrain.weather === 'rain' && "fire" === move.type || pokeATT.terrain.weather === 'harsh-sunlight' && "water" === move.type) {
        weather = 0.5
    }
    return weather;
}

export const getBurn = (move, pokeATT) => {
    let burn = 1
    if (pokeATT.status === 'burned' && pokeATT.ability !== 'guts' && move.dclass === 'physical') {
        burn = 0.5
    }
    return burn
}

export const getFirstNonNull = (pokeTeam) => {
    let i = 0
    let pokemon = null
    while (pokeTeam[i] == null && i < 6) {
        i++
    }
    if (pokeTeam[i] != null) {
        pokemon = pokeTeam[i]
    }
    return pokemon
}

export const windowToCanvas = (canvas, x, y) => {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

export const getMultiplierFromStage = (stage) => {
    if (stage >= 0) {
        return 1 + stage * 0.5
    }
    if (stage == -1) {
        return 0.66
    }
    if (stage == -2) {
        return 0.5
    }
    if (stage == -3) {
        return 0.4
    }
    if (stage == -4) {
        return 0.33
    }
    if (stage == -5) {
        return 0.28
    }
    if (stage == -6) {
        return 0.25
    }
}

export const formatMoveName = (name) => {
    let fname = ""
    let toUpper = true
    for (let index = 0; index < name.length; index++) {
        const char = name[index];
        if (toUpper) {
            fname += char.toUpperCase()
            toUpper = false
        } else if (char == '-') {
            toUpper = true
            fname += ' '
        } else {
            fname += char
        }
    }
    return fname
}


export const randomMoves = async(pokemon) => {
    const nbOfMove = pokemon.possiblesmoves.length - 1
    for (let index = 0; index < pokemon.currentMoves.length; index++) {
        let move = await createMoveFromName(pokemon.possiblesmoves[getRandomInt(0, nbOfMove)])
        while (move in pokemon.currentMoves) {
            move = await createMoveFromName(pokemon.possiblesmoves[getRandomInt(0, nbOfMove)])
        }
        pokemon.currentMoves[index] = move
    }
}

export const combatBasique = async() => {
    let pokemonA1 = await createPokemonFromId('pikachu')
    let pokemonB1 = await createPokemonFromId('pikachu')
    randomMoves(pokemonA1)
    randomMoves(pokemonB1)
    let terrain = new Terrain([pokemonA1, null, null, null, null, null], [pokemonB1, null, null, null, null, null])

    let window = new Window(document.querySelector('canvas'))

    let combat = new Combat(window, terrain)
}

export const colorGradiant = (color, colors, t) => {
    for (let index = 0; index < color.length; index++) {
        let delta = (colors[1][index] - colors[0][index]) / (t*60)

        if (delta > 0) {
            if (color[index] + delta < colors[1][index]) {
                color[index] += delta
            }
            else {
                color[index] = colors[1][index]
            }
        }
        if (delta < 0) {
            if (color[index] + delta > colors[1][index]) {
                color[index] += delta
            }
            else {
                color[index] = colors[1][index]
            }
        }
    }
}

export const toRGB = (color) => {
    return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')'
}

export const sameColor = (c1, c2) => {
    for (let index = 0; index < c1.length; index++) {
        if (c1[index] != c2[index]) return false
    }
    return true
}