const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);



//Je compte mettre touts les lien graphiques en cache séparément 


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }



const createPokemonFromId = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await fetch(url)
    const data = await response.json()
    return new Pokemon(data)
}
/*
const createMoveFromName = async (name) => {
    const url= `https://pokeapi.co/api/v2/move/${name}`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)
    return new Move(data)
}
*/

const createMoveFromName = async (name) => {
    const url= `https://pokeapi.co/api/v2/move/${name}`
    const response = await fetch(url)
    const data = await response.json()
    return new Move(data)
}

const msetTypes = async (move) => {
    const url= `https://pokeapi.co/api/v2/type/${move.type}`
    const response = await fetch(url)
    const data = await response.json()
    move.setTypes(data)
}


const damageCalculationGen5Onward = (move, pokeATT, pokeDEF) => {
    console.log(move)
    let AttackStat = 0
    let DefenseStat = 1
    if (move.dclass == 'special') {
        AttackStat = pokeATT.stats['special-attack']
        DefenseStat = pokeDEF.stats['special-defense']
    }
    else if (move.dclass == 'physical') {
        AttackStat = pokeATT.stat['attack']
        DefenseStat = pokeDEF.stats['defense']
    }
    let weather = 1
    if (pokeATT.terrain.weather == 'rain' && "water" == move.type || pokeATT.terrain.weather == 'harsh-sunlight' && "fire" == move.type) {
        weather = 1.5
    }
    else if (pokeATT.terrain.weather == 'rain' && "fire" == move.type || pokeATT.terrain.weather == 'harsh-sunlight' && "water" == move.type) {
        weather = 0.5
    }
    let critDamage = 1 // les deg crits ne sont pas implemente

    let random = getRandomInt(85,101) / 100

    let STAB = 1
    if (move.type in pokeATT.types && move.type != 'typeless') {
        if (pokeATT.ability = 'adaptability') {
            STAB = 2
        }
        else {
            STAB = 1.5
        }
    }

    let typeEff = 1
    pokeDEF.types.forEach(type => {
        if (type in move.types['no_damage_to']) {
            typeEff = 0
        }
        else if (type in move.types['half_damage_to']) {
            typeEff = typeEff / 2
        }
        else if (type in move.types['double_damage_to']) {
            typeEff = typeEff * 2
        }
    });
    let burn = 1
    if (pokeATT.status == 'burned' && pokeATT.ability != 'guts' && move.dclass == 'physical') {
        burn = 0.5
    }
    damage = ((((((2 * pokeATT.level)/5) + 2) * move.power * AttackStat / DefenseStat) / 50) + 2) * weather* critDamage * random * STAB * typeEff * burn
    console.log(AttackStat)
    return damage
}

class Pokemon {
    /**
     * 
     * @param {number} id the id of the pokemon
     */
    constructor(pokejson){
        // On va commencer par recup la reponse de l'api
        this.images = {
            'front': pokejson.sprites.front_default,
            'back': pokejson.sprites.back_default
        }

        this.name = pokejson.name
        this.types = ['none', 'none']
        pokejson.types.forEach(element => {
            this.types[element.slot - 1] = element.type.name
        });
        this.stats = {}
        pokejson.stats.forEach(stat => {
            let key = stat.stat.name
            let value = stat.base_stat
            this.stats[key] = value
        });
        console.log(this.stats)
        this.possiblesmoves = [] // pas la peine de tout récup sur les moves vu que on peut appeler l'api pour avoir les detail juste avec leurs noms
        pokejson.moves.forEach(element => {
            let value = element.move.name
            this.possiblesmoves.push(value)
        });
        this.currentHp = this.stats['hp']
        this.currentMoves = [null, null, null, null]
        this.status = "Healthy"
        this.level = 1
        this.terrain = null
        this.team = null
        this.state = null
        this.abilities = []
        pokejson.abilities.forEach(ability => {
            this.abilities.push(ability.ability.name)
        });
        this.ability = this.abilities[0]
    }

    setTerrain(terrain) {
        this.terrain = terrain
    }

    setTeam(team) {
        if (team in ['A', 'B']){
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
        this.currentMoves[index] = await createMoveFromName(moveName)
    }

    /**
     * 
     * @param {int} moveIndex l'index du move que l'on souhaite utiliser dans la liste currentMoves
     * @param {Pokemon} pokemon le pokemon contre lequel on se bat
     * @param {int} gen la generation
     */
    useMove(moveIndex, pokemon, gen) {
        //La fonction ne va rien retourner car elle va directement interagir avec le pokemon adverse qui est en argument :)
        if (gen >= 5){
        damage = damageCalculationGen5Onward(pokemon.currentMoves[moveIndex], this, pokemon)
        console.log(`Dammage = ${damage}`)
        }
    }
}

class Move {
    constructor(movejson){
        this.json = movejson
        this.pp = movejson.pp
        this.power = movejson.power
        this.type = movejson.type.name
        this.types = {} // dict qui donne la relation entre les différent le move est les types
        this.dclass = movejson.damage_class.name
        msetTypes(this)
    }

    setTypes(typesjson) {
        Object.entries(typesjson.damage_relations).forEach(([relationType, types]) => {
            let value = []
            types.forEach(type => {
                value.push(type.name)
            });
            this.types[relationType] = value
        });
    }
}

class Terrain {
    constructor(teamA, teamB){
        this.weather = "normal"
        this.pokemonA = teamA
        this.pokemonB = teamB
        this.pokemonA.forEach(pokemon => {
            pokemon.setTerrain(this)
            pokemon.setTeam('A')
        });
        this.pokemonB.forEach(pokemon => {
            pokemon.setTerrain(this)
            pokemon.setTeam('B')
        });
    }
}

// console.log("Le js est la")
// charizardPromise = createPokemonFromId('charizard')
// pikachuPromise = createPokemonFromId('pikachu')

// Promise.all([charizardPromise, pikachuPromise]).then((result) => {
// 	const charizard = result[0]
//     const pikachu = result[1]


// 	charizard.setMove('fire-punch',0)
// 	charizard.setMove('headbutt',1)
// 	charizard.setMove('solar-beam',2)
// 	charizard.setMove('cut',3)
	
// 	pikachu.setMove('thunderbolt',0)
// 	pikachu.setMove('thunder',1)
	
// 	terrain = new Terrain([charizard], [pikachu])
//     charizard.useMove(0, pikachu, 5)
	
// })

const combatBasique = async () => {
    charizard = await createPokemonFromId('charizard')
    pikachu = await createPokemonFromId('pikachu')
    await charizard.setMove('fire-punch',0)
	await charizard.setMove('headbutt',1)
	await charizard.setMove('solar-beam',2)
	await charizard.setMove('cut',3)
	
	await pikachu.setMove('thunderbolt',0)
	await pikachu.setMove('thunder',1)
	
	terrain = await new Terrain([charizard], [pikachu])
    await charizard.useMove(0, pikachu, 5)
}

combatBasique()