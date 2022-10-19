const canvas = document.querySelector('canvas');

canvas.width = 1024;
canvas.height = 576;



//ctx.fillRect(0, 0, canvas.width, canvas.height);



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
    const url = `https://pokeapi.co/api/v2/move/${name}`
    const response = await fetch(url)
    const data = await response.json()
    return new Move(data)
}

const damageCalculationGen5Onward = (move, pokeATT, pokeDEF) => {
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

const getTypeEff = (move, pokeDEF) => {
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

const getSTAB = (move, pokeATT) => {
    let STAB = 1
    if (move.type in pokeATT.types && move.type !== 'typeless') {
        if (pokeATT.ability === 'adaptability') {
            STAB = 2
        }
        else {
            STAB = 1.5
        }
    }
    return STAB
}

const getADStats = (move, pokeATT, pokeDEF) => {
    let AttackStat = 0
    let DefenseStat = 1
    if (move.dclass === 'special') {
        AttackStat = pokeATT.stats['special-attack']
        DefenseStat = pokeDEF.stats['special-defense']
    }
    else if (move.dclass === 'physical') {
        AttackStat = pokeATT.stat['attack']
        DefenseStat = pokeDEF.stats['defense']
    }
    return [AttackStat, DefenseStat]
}

const getWeather = (move, pokeATT) => {
    let weather = 1
    if (pokeATT.terrain.weather === 'rain' && "water" === move.type || pokeATT.terrain.weather === 'harsh-sunlight' && "fire" === move.type) {
        weather = 1.5
    }
    else if (pokeATT.terrain.weather === 'rain' && "fire" === move.type || pokeATT.terrain.weather === 'harsh-sunlight' && "water" === move.type) {
        weather = 0.5
    }
    return weather;
}

const getBurn = (move, pokeATT) => {
    let burn = 1
    if (pokeATT.status === 'burned' && pokeATT.ability !== 'guts' && move.dclass === 'physical') {
        burn = 0.5
    }
    return burn
}

const getFirstNonNull = (pokeTeam) => {
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

const drawBackground = (self, ) => {
    const horizon = this.height * 0.3;
    // This creates the sky gradient (from a darker blue to white at the bottom)
    const sky = this.ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0.0, 'rgb(55,121,179)');
    sky.addColorStop(0.7, 'rgb(121,194,245)');
    sky.addColorStop(1.0, 'rgb(164,200,214)');
    // this creates the grass gradient (from a darker green to a lighter green)
    const earth = this.ctx.createLinearGradient(0, horizon, 0, this.height);
    earth.addColorStop(0.0, 'rgb(81,140,20)');
    earth.addColorStop(1.0, 'rgb(123,177,57)');
    this.ctx.fillStyle = sky;
    this.ctx.fillRect(0, 0, this.width, horizon);
    this.ctx.fillStyle = earth;
    this.ctx.fillRect(0, horizon, this.width, this.height-horizon);
}



//Classes -------------------

class Pokemon {
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
        pokejson.stats.forEach(stat => {
            let key = stat.stat.name
            let value = stat.base_stat
            this.stats[key] = value
            if (localStorage.getItem(key) == null) {
                localStorage.setItem(key, stat.stat.url)
            }
        });
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


        // On met dans le cache les ressources img
        // On commence par les sprites du pokemon
        if (localStorage.getItem(this.name + '-front') == null) {
            localStorage.setItem(this.name + '-front', pokejson.sprites.front_default)
            localStorage.setItem(this.name + '-back', pokejson.sprites.back_default)
        }
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
        if (gen >= 5) {
            let damage = damageCalculationGen5Onward(pokemon.currentMoves[moveIndex], this, pokemon)
            console.log(`Dammage = ${damage}`)
        }
    }
}

class Move {
    constructor(movejson) {
        this.json = movejson
        this.pp = movejson.pp
        this.power = movejson.power
        this.type = movejson.type.name
        this.types = {} // dict qui donne la relation entre les différent le move est les types
        this.dclass = movejson.damage_class.name
        this.setTypes()
    }

    async setTypes() {
        const url = `https://pokeapi.co/api/v2/type/${this.type}`
        const response = await fetch(url)
        const typesjson = await response.json()
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
    constructor(teamA, teamB) {
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

class Combat {
    constructor(canvas, teamA, teamB) {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        console.log(this.ctx)
        this.teamA = teamA
        this.teamB = teamB
        this.pokeA = getFirstNonNull(teamA)
        this.pokeB = getFirstNonNull(teamB)
        if (this.pokeA == null || this.pokeB == null) {
            alert("il n'y a pas de pokemon dans une ou deux des teams")
        }
        this.initCanvas()
        this.pokeInterfaceA = null
        this.pokeInterfaceB = null
    }

    initCanvas() {
        this.drawBackground()
        this.drawPokemons()
        this.drawPokeInterface()
    }

    drawBackground() {
        const horizon = this.height * 0.3;
        // This creates the sky gradient (from a darker blue to white at the bottom)
        const sky = this.ctx.createLinearGradient(0, 0, 0, horizon);
        sky.addColorStop(0.0, 'rgb(55,121,179)');
        sky.addColorStop(0.7, 'rgb(121,194,245)');
        sky.addColorStop(1.0, 'rgb(164,200,214)');
        // this creates the grass gradient (from a darker green to a lighter green)
        const earth = this.ctx.createLinearGradient(0, horizon, 0, this.height);
        earth.addColorStop(0.0, 'rgb(81,140,20)');
        earth.addColorStop(1.0, 'rgb(123,177,57)');
        this.ctx.fillStyle = sky;
        this.ctx.fillRect(0, 0, this.width, horizon);
        this.ctx.fillStyle = earth;
        this.ctx.fillRect(0, horizon, this.width, this.height-horizon);
    }

    drawPokemons() {
        var pokeAImg = new Image()
        pokeAImg.src = localStorage.getItem(this.pokeA.name+ '-back')
        var pokeBImg = new Image()
        pokeBImg.src = localStorage.getItem(this.pokeB.name + '-front')
        console.log(pokeAImg)
        console.log(`Height = ${this.height}, Width = ${this.width}`)
        this.ctx.drawImage(pokeAImg, this.width/15, this.height / 2.5,pokeAImg.naturalWidth * 3 ,pokeAImg.naturalHeight * 3)
        this.ctx.drawImage(pokeBImg, this.width*0.6, this.height / 7,pokeAImg.naturalWidth * 2.7 ,pokeAImg.naturalHeight * 2.7)
    }

    drawPokeInterface() {
        this.pokeInterfaceA = new PokeInterface(this.canvas, this.pokeA,)
        const gap = 10
        let x = 100
        let y = 20
        let width = 275
        let height = 125
        let curve = [10]
        this.pokeInterfaceA = new PokeInterface(this.canvas, this.pokeA,x, y, width, height, gap, curve)
    }

}

class PokeInterface {
    constructor(canvas, pokemon, x, y, width, height, gap=10, curve=[20, 0, 20, 20]) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.pokemon = pokemon
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.colorExt = 'rgb(108,108,108)'
        this.colorInt = 'rgb(248,248,216)'
        this.gap = gap
        this.curve = curve
        this.initInterface()
    }

    initInterface() {
        this.drawBackground()
        this.drawInformation()
        this.drawHPbar()
    }

    drawBackground() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colorExt
        this.ctx.roundRect(this.x, this.y, this.width, this.height, this.curve)
        this.ctx.fill()
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colorInt
        this.ctx.roundRect(this.x+(this.gap/2), this.y+(this.gap/2), this.width-this.gap, this.height-this.gap, this.curve)
        this.ctx.fill()
    }

    drawInformation() {
        this.ctx.font = '16px arial'
        this.ctx.fillStyle = 'black'
        this.ctx.fillText(this.pokemon.name.toUpperCase(), this.x + this.width / 10, this.y + this.height/4)
        this.ctx.fillText(`LV.${this.pokemon.level}`, this.x + this.width*0.8, this.y + this.height/4)
    }

    drawHPbar() {
        this.ctx.beginPath()
        this.ctx.fillStyle = 'green'
        this.ctx.roundRect(this.x + this.width * 0.2, this.y + this.height*0.7, this.width*0,7, this.height*0.2, [10,10,10,10])
        this.ctx.fill()
    }
}

const combatBasique = async () => {
    charizard = await createPokemonFromId('charizard')
    pikachu = await createPokemonFromId('pikachu')
    await charizard.setMove('fire-punch', 0)
    await charizard.setMove('headbutt', 1)
    await charizard.setMove('solar-beam', 2)
    await charizard.setMove('cut', 3)

    await pikachu.setMove('thunderbolt', 0)
    await pikachu.setMove('thunder', 1)

    terrain = await new Terrain([charizard], [pikachu])
    await charizard.useMove(1, pikachu, 5)

    const combat = new Combat(document.querySelector('canvas'), [charizard, null, null, null, null, null], [pikachu, null, null, null, null, null])
}

combatBasique()