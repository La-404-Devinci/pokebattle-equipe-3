const canvas = document.querySelector('canvas');

canvas.width = 1024;
canvas.height = 576;



//ctx.fillRect(0, 0, canvas.width, canvas.height);



//Je compte mettre touts les lien graphiques en cache séparément 
//Ok cette idée c'est de la merde


var getCanvasRelative = function (e) {
    var canvas = e.target,
        bx = canvas.getBoundingClientRect();
    return {
        x: e.clientX - bx.left,
        y: e.clientY - bx.top,
        bx: bx
    };
};

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
    if (move.dclass == null) return
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

const windowToCanvas = (canvas, x, y) => {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

const getMultiplierFromStage = (stage) => {
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

const formatMoveName = (name) => {
    let fname = ""
    let toUpper = true
    for (let index = 0; index < name.length; index++) {
        const char = name[index];
        if (toUpper) {
            fname += char.toUpperCase()
            toUpper = false
        }
        else if (char == '-') {
            toUpper = true
            fname += ' '
        }
        else {
            fname += char
        }
    }
    return fname
}


const drawBackground = (self,) => {
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
    this.ctx.fillRect(0, horizon, this.width, this.height - horizon);
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
    useMove(moveIndex, pokemon) {
        let res = [this.currentMoves[moveIndex].category, null]
        if (res[0] == null) return
        if (res[0].includes('damage')) {
            res[1] = this.useAttackMove(moveIndex, pokemon)
        }
        return res
    }

    useAttackMove(moveIndex, pokemon) {
        return damageCalculationGen5Onward(pokemon.currentMoves[moveIndex], this, pokemon)
    }

    addStatStage(statName, value) {
        if (this.statsStage[statName] + value > 6) {
            this.statsStage[statName] = 6
        }
        else if (this.statsStage[statName] + value < -6) {
            this.statsStage[statName] = -6
        }
        else {
            this.statsStage[statName] += value
        }
        this.currentStatsCalculation()
    }

    currentStatsCalculation() {
        Object.entries(this.currentStats).forEach(([name, value]) => {
            if (name != 'hp') {
                this.currentStats[name] = this.stats[name] * getMultiplierFromStage(this.statsStage[name])
            }
        });
    }


}

class Move {
    constructor(movejson) {
        this.name = movejson.name
        this.pp = movejson.pp
        this.power = movejson.power
        this.type = movejson.type.name
        this.types = {} // dict qui donne la relation entre les différent le move est les types
        this.dclass = movejson.damage_class.name
        this.category = movejson.meta.category.name
        this.ailment = movejson.meta.ailment.name
        this.target = movejson.target.name
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
        this.pokeTeamA = teamA
        this.pokemonA = getFirstNonNull(teamA)
        this.pokeTeamB = teamB
        this.pokemonB = getFirstNonNull(teamB)
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

class Combat {
    constructor(InterfaceGlobale, terrain) {
        this.interfaceGlobale = InterfaceGlobale
        this.interfaceGlobale.currentMode = 'combat'
        this.canvas = this.interfaceGlobale.canvas
        this.terrain = terrain
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        console.log(this.ctx)
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
        console.log('backgrf')
        this.interfaceGlobale.addInterface(new Background(this.canvas))
    }

    

    initPokeInterface() {
        this.pokeInterfaceA = new PokeInterface(this, 'A')
        this.pokeInterfaceB = new PokeInterface(this, 'B')
        this.interfaceGlobale.addInterface(this.pokeInterfaceA)
        this.interfaceGlobale.addInterface(this.pokeInterfaceB)
    }

    initUserInterface() {
        this.interfaceGlobale.addInterface(new UserInterface(this))
    }

    useMove(moveIndex) {
        const res = this.terrain.pokemonA.useMove(moveIndex, this.terrain.pokemonB)
        if (res[0].includes('damage')) {
            this.pokeInterfaceA.attackAnimation()
            this.terrain.pokemonB.currentStats['hp'] -= res[1]
            console.log(`PokeB Hp : ${this.terrain.pokemonB.currentStats['hp']}`)
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
        console.log('err in fonc pokemon out: wrong reference')
    }

    pokemonAOut() {
        this.terrain.pokemonA.currentStats['hp'] = 0
        //Ici on rajoute des fonctions d'animation si besoin
        return
    }

    pokemonBOut() {
        this.terrain.pokemonB.currentStats['hp'] = 0
        alert('GG tu viens de gqgner un combat litéralement imperdable')
        //Ici on rqjoute des fonctions d'animation si besoin
        return
    }

}

class PokeInterface {
    constructor(combat, team) {
        this.combat = combat
        this.canvas = this.combat.canvas
        this.ctx = this.canvas.getContext('2d')
        this.team = team
        this.pokemon = null
        this.infoWindow = null
        this.pokeSprite = null
        this.getNewPokemon()
    }

    getNewPokemon() {
        if (this.team == 'A') {
            this.pokemon = this.combat.terrain.pokemonA
        }

        if (this.team == 'B') {
            this.pokemon = this.combat.terrain.pokemonB
        }
        this.initPokemon()
        this.initInfoWindow()
    }

    initPokemon() {
        var spriteType = '-back'
        var x = 200
        var y = 400
        if (this.team == 'B') {
            spriteType = '-front'
            x = 800
            y = 200
        }
        const sprite = new Image()
        sprite.src = localStorage.getItem(this.pokemon.name + spriteType)
        this.pokeSprite = new PokeSprite(this, {x : x, y : y}, sprite)
        return
    }

    initInfoWindow() {
        var x = this.canvas.width / 2
        var y = 325
        if (this.team == 'B') {
            x = 75
            y = 100
        }
        this.infoWindow = new InfoWindow(this.canvas, {x : x, y : y}, this.pokemon)
    }

    drawPokemons() {
        this.ctx.drawImage(pokeImg, this.width * 0.6, this.height / 7, pokeAImg.naturalWidth * 2.7, pokeAImg.naturalHeight * 2.7)
    }

    update() { 
        if (this.infoWindow != null) {
            this.infoWindow.update()
        }
        if (this.pokeSprite != null) {
            this.pokeSprite.update()
        }
    }

    attackAnimation() {
        this.pokeSprite.attackAnimation()
    }
}

class UserInterface {
    constructor(battle) {
        this.battle = battle
        this.canvas = this.battle.canvas
        this.ctx = this.canvas.getContext('2d')
        this.terrain = this.battle.terrain
        this.menu = 'attack'
        //def des couleurs 
        this.colorExt = 'rgb(108,108,108)'
        this.colorInt = 'rgb(248,248,216)'
        this.moveBaseColor = this.colorExt
        this.x = this.canvas.width / 2
        this.y = this.canvas.height * (0.70)
        this.width = this.canvas.width - this.x
        this.height = this.canvas.height - this.y
        this.gap = 10
        this.mousedown = -1 //-1: la mouse n'est pas down, 0 si il est down sur le move 0, 1 si c'est le move 1, ect...
        this.moves = [[null, null, this.moveBaseColor], [null, null, this.moveBaseColor], [null, null, this.moveBaseColor], [null, null, this.moveBaseColor]] //format : [Move, Path2D, color]
    }

    update() { 
        this.drawBackground()
        this.drawFrontground()
    }

    drawBackground() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colorExt
        this.ctx.roundRect(this.x, this.y, this.width, this.height, [20, 0, 0, 0])
        this.ctx.fill()
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colorInt
        this.ctx.roundRect(this.x + this.gap / 2, this.y + this.gap / 2, this.width - this.gap, this.height - this.gap, [20, 0, 0, 0])
        this.ctx.fill()

    }

    drawFrontground() {
        if (this.menu == 'attack') {
            this.drawAttack()
        }
    }

    drawAttack() {
        let i = 0
        const gapx = 65
        const gapy = 20
        const width = 150
        const height = 60
        // console.log(this.terrain.pokemonA.currentMoves)
        this.terrain.pokemonA.currentMoves.forEach(move => {
            if (move != null) {
                let x = this.x + gapx + (width + gapx) * (i % 2)
                let y = this.y + gapy + (height + gapy) * Math.floor(i / 2)
                this.moves[i][0] = move
                this.moves[i][1] = new Path2D()
                this.moves[i][1].roundRect(x, y, width, height, [5])
                this.moves[i][1].closePath()
                this.ctx.fillStyle = this.moves[i][2]
                this.ctx.fill(this.moves[i][1])
                this.ctx.font = '16px arial'
                this.ctx.fillStyle = 'black'
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`${formatMoveName(move.name)}`, x + width / 2, y + height / 2)
                i++
            }
        });
    }

    updateMoves() {
        let i = 0
        const gapx = 65
        const gapy = 20
        const width = 150
        const height = 60
        this.moves.forEach(moveInformation => {
            let x = this.x + gapx + (width + gapx) * (i % 2)
            let y = this.y + gapy + (height + gapy) * Math.floor(i / 2)
            const move = moveInformation[0]
            const path = moveInformation[1]
            let color = moveInformation[2]
            if (path == null) return
            this.ctx.fillStyle = color
            this.ctx.fill(path)
            this.ctx.font = '16px arial'
            this.ctx.fillStyle = 'black'
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${formatMoveName(move.name)}`, x + width / 2, y + height / 2)
            i++
        });
    }

    onMouseMove(event) {
        if (this.mousedown != -1) return;
        var pos = getCanvasRelative(event)
        //console.log(`X : ${pos.x}, Y : ${pos.y}`)
        const moveIndex = this.isOnMove(pos.x, pos.y)
        if (moveIndex == -1) {
            this.mouseOverNothing()
        }
        else {
            this.mouseOverMove(moveIndex)
        }
    }

    onMouseRelease(event) {
        console.log('Mouse released')
        var pos = getCanvasRelative(event)
        const moveIndex = this.isOnMove(pos.x, pos.y)
        if (moveIndex == -1 || this.mousedown != moveIndex) {
            this.mouseOverNothing()
        }
        if (moveIndex != -1) {
            this.mouseOverMove(moveIndex)
            if (this.mousedown == moveIndex) {
                this.battle.useMove(moveIndex)
            }
        } 
        
        this.mousedown = -1
    }
    onMouseClick(event) {
        var pos = getCanvasRelative(event)
        const moveIndex = this.isOnMove(pos.x, pos.y)
        if (moveIndex == -1) return;
        this.mousedown = moveIndex
        this.clickOnMove(moveIndex)
        return
    }

    /**4
     * Fonction qui donne le move sur lequel la souri est
     * @param {int} x x coordinate in canvas
     * @param {int} y y coordinate in canvas
     * @returns moveindex si la souris est sur un move, -1 sinon 
     */
    isOnMove(x, y) {
        for (let index = 0; index < this.moves.length; index++) {
            const moveInformation = this.moves[index]
            const path = moveInformation[1]
            if (this.ctx.isPointInPath(path, x, y)) {
                return index
            }
        }
        return -1
    }

    mouseOverNothing() {
        this.moves.forEach(moveInformation => {
            moveInformation[2] = this.moveBaseColor
        })
        this.updateMoves()
    }

    mouseOverMove(moveIndex) {
        const overColor = 'rgb(255,165,0)'
        this.moves[moveIndex][2] = overColor
        this.updateMoves()
        return
    }

    clickOnMove(moveIndex) {
        console.log(`Move ${moveIndex} used`);
        const clickColor = 'rgb(255,140,0)'
        this.moves[moveIndex][2] = clickColor
        this.updateMoves()
    }
}

class InfoWindow {
    constructor(canvas, pos, pokemon) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.x = pos.x
        this.y = pos.y
        this.pokemon = pokemon
        this.healthBarCurrentHp = pokemon.currentStats['hp']
        this.healthBar = null
        this.deltaHp = 0
        // ------------------------------------------------------
        // Des var accesible pour pouvoir edit la gueule des trucs
        this.gap = 10 
        this.width = 275
        this.height = 75
        this.curve = [10]
        //def des couleurs utiles
        this.colorExt = 'rgb(108,108,108)'
        this.colorInt = 'rgb(248,248,216)'
        // ------------------------------------------------------
    }

    
    drawBackground() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colorExt
        this.ctx.roundRect(this.x, this.y, this.width, this.height, this.curve)
        this.ctx.fill()
        this.ctx.beginPath();
        this.ctx.fillStyle = this.colorInt
        this.ctx.roundRect(this.x + (this.gap / 2), this.y + (this.gap / 2), this.width - this.gap, this.height - this.gap, this.curve)
        this.ctx.fill()
    }

    drawInformation() {
        this.ctx.font = '16px arial'
        this.ctx.fillStyle = 'black'
        this.ctx.textAlign = 'left';
        this.ctx.fillText(this.pokemon.name.toUpperCase(), this.x + this.width / 10, this.gap + this.y + this.height / 6)
        this.ctx.fillText(`LV.${this.pokemon.level}`, this.x + this.width * 0.8, this.gap + this.y + this.height / 6)
    }

    drawHPbar() {
        const hpx = this.gap + this.x + this.width / 6.5
        const hpy = this.gap + this.y + this.height / 3
        const hpwidth = this.width * (0.6)
        const hpheight = this.height * 0.15
        const currentHPwidth = hpwidth * (this.healthBarCurrentHp / this.pokemon.stats['hp'])
        this.healthBar = new Path2D()
        var hpcolor = 'green'
        if (4 * this.healthBarCurrentHp < this.pokemon.stats['hp']) {
            hpcolor = 'red'
        }
        else if (2 * this.healthBarCurrentHp < this.pokemon.stats['hp']) {
            hpcolor = 'orange'
        }
        this.ctx.font = '16px arial bold'
        this.ctx.fillStyle = 'black'
        this.ctx.textAlign = 'left';
        this.ctx.fillText('HP', hpx - this.width / 10, hpy + hpheight)
        this.ctx.fillText(`${Math.round(this.healthBarCurrentHp)}/${this.pokemon.stats['hp']}`, hpx + hpwidth, hpy + hpheight)
        this.ctx.fillStyle = this.colorExt
        this.ctx.beginPath()
        this.ctx.roundRect(hpx, hpy, hpwidth, hpheight, [0, 10, 0, 10])
        this.ctx.fill()
        this.ctx.fillStyle = hpcolor
        this.healthBar.roundRect(hpx, hpy, currentHPwidth, hpheight, [0, 10, 0, 10])
        this.ctx.fill(this.healthBar)
    }

    update() {
        //Ici on peut faire une animation mais flemme
        this.animations() //on fait toutes les animations dans cette fonction
        this.drawBackground()
        this.drawInformation()
        this.drawHPbar()
        return
    }

    animations() {
        this.healthBarAnimation()
    }

    healthBarAnimation() {
        if (this.healthBarCurrentHp <= this.pokemon.currentStats['hp']) {
            this.healthBarCurrentHp = this.pokemon.currentStats['hp']
            this.deltaHp = 0
            return
        }
        const numberOfFrames = 2*60
        if (this.deltaHp == 0) {
            this.deltaHp = (this.healthBarCurrentHp - this.pokemon.currentStats['hp'])/ numberOfFrames
        }
        this.healthBarCurrentHp -= this.deltaHp;
    }
}

class PokeSprite {
    constructor(pokeInterface, pos , sprite) {
        this.pokeInterface = pokeInterface
        this.canvas = this.pokeInterface.canvas
        this.ctx = this.canvas.getContext('2d')
        this.pos = pos
        this.absolutePos = pos
        this.sprite = sprite
        this.isAttacking = 0 // C'est en gros le compteur de frame d'animation de l'attaque, donc si c'est = 0 il n'y a pas d'animation
        this.speed = {
            x : 0,
            y : 0
        }
        this.animationTiming = { //ptit espace pour stocker les key frames d'animation 
            attack : {
                moveForward : 0.3 * 60,
                moveBackward : 0.6 * 60
            }
        }
    }

    update() {
        this.animations()//on fait toutes les animations dans cette fonction
        this.draw()
    }
    
    animations() {
        if (this.isAttacking != 0) this.attackAnimation()
    }

    draw() {
        //On calcule un coef pour avoir un effet d'eloignement des pokemons
        const multiplier = 2.2 + (this.pos.y / this.canvas.width)
        const width = this.sprite.naturalWidth * multiplier
        const height = this.sprite.naturalHeight * multiplier
        //Les coord this.x et this.y sont les coord du centre du sprite, on fait donc ici une conversion
        const x = this.pos.x - (width / 2)
        const y = this.pos.y - (height / 2)
        //Et on dessine
        this.ctx.drawImage(this.sprite, x, y, width, height)
    }

    attackAnimation() {
        this.isAttacking++
        console.log(this.isAttacking)
        const dx = 1
        const dy = 2
        
        // if (this.isAttacking == 0) {
        //     //Des constantes pour modif la vitesse des animations
        //     //Si on rentre ici c'est que l'attaque viens de commencer
        //     if (this.pos.y > (this.canvas.height/2)) {
        //         //On est donc sur le pokemon supérieur de l'écran
        //         this.speed.x = - dx
        //         this.speed.y = - dy
        //     }
        //     else{
        //         this.speed.x = dx
        //         this.speed.y = dy
        //     }
        // }
        if (this.isAttacking <= this.animationTiming.attack.moveForward) {
            if (this.pokeInterface.team == 'A') {
                //On est donc sur le pokemon inf de l'écran
                this.speed.x =  dx
                this.speed.y = - dy
            }
            else{
                this.speed.x = - dx
                this.speed.y = dy
            }
        }
        else if (this.isAttacking <= this.animationTiming.attack.moveBackward) {
            if (this.pokeInterface.team == 'A') {
                //On est donc sur le pokemon inf de l'écran
                this.speed.x = - dx
                this.speed.y =   dy
            }
            else{
                this.speed.x =   dx
                this.speed.y = - dy
            }
        }
        else {
            //Si on rentre ici c'est que l'animation est finito
            this.isAttacking = 0
            this.speed.x = 0
            this.speed.y = 0
            this.pos = this.absolutePos
        }
        this.move()
    }

    move() {
        //On integre la speed
        this.pos.x += this.speed.x
        this.pos.y += this.speed.y
    }

    
}


class Background {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.sol = [new Path2D(), null] //Le path et le gradient pour le fill
        this.ciel = [new Path2D(), null]
        this.intiBackground()
    }

    intiBackground() {
        const horizon = this.canvas.height * 0.3;
        // Les path2d
        this.sol[0].rect(0, horizon, this.canvas.width, this.canvas.height - horizon)
        this.ciel[0].rect(0, 0, this.canvas.width, horizon)
        // Les grad
        this.ciel[1] = this.ctx.createLinearGradient(0, 0, 0, horizon);
        this.ciel[1].addColorStop(0.0, 'rgb(55,121,179)');
        this.ciel[1].addColorStop(0.7, 'rgb(121,194,245)');
        this.ciel[1].addColorStop(1.0, 'rgb(164,200,214)');
        this.sol[1] = this.ctx.createLinearGradient(0, horizon, 0, this.canvas.height);
        this.sol[1].addColorStop(0.0, 'rgb(81,140,20)');
        this.sol[1].addColorStop(1.0, 'rgb(123,177,57)');
    }

    update() {
        this.ctx.fillStyle = this.sol[1]
        this.ctx.fill(this.sol[0])
        this.ctx.fillStyle = this.ciel[1]
        this.ctx.fill(this.ciel[0])
    }
}

//Je commence une nouvelle classe qui sera l'interface globale, car je suis en train de faire de la grosse merde avec la classe combat
// et le code sera vite encore plus imbitable

class InterfaceGlobale {
    constructor(canvas) {
        this.canvas = canvas
        this.interfaces = [] // Une liste des interfaces filles (en gros dans la cas actuel du projet c'es)
        this.currentMode = 'none'
        this.initCanvas()
        this.tick()
    }

    addInterface(interfaceToAdd) {
        if (interfaceToAdd == null) return;
        this.interfaces.push(interfaceToAdd)
    }

    removeInterface(interfaceToRemove) {
        if (interfaceToRemove == null) return;
        for (let index = 0; index < this.interfaces.length; index++) {
            const currentInterface = array[index];
            if (currentInterface == interfaceToRemove) {
                this.interfaces.splice(index, 1)
            }
        }
    }

    getInterfaceOfType(type) {
        var interfaceList =[]
        this.interfaces.forEach(inter => {
            if (inter instanceof type) {
                interfaceList.push(inter)
            }
        });
        return interfaceList
    }

    tick() {
        this.update()
        window.requestAnimationFrame(this.tick.bind(this))
    }
    
    update() {
        this.interfaces.forEach(inter => {
            if (inter != null) {
                inter.update()
            }
        });
    }

    initCanvas() {
        var fClick = this.onMouseClick.bind(this)
        this.canvas.addEventListener('mousedown', fClick)
        var fMove = this.onMouseMove.bind(this)
        this.canvas.addEventListener('mousemove', fMove)
        var fRelease = this.onMouseRelease.bind(this)
        this.canvas.addEventListener('mouseup', fRelease)
    }

    onMouseClick(e) {
        this.interfaces.forEach(inter => {
            if (typeof inter.onMouseClick == 'function') {
                inter.onMouseClick(e)
            }
        });
    }

    onMouseMove(e) {
        this.interfaces.forEach(inter => {
            if (typeof inter.onMouseMove == 'function') {
                inter.onMouseMove(e)
            }
        });
    }

    onMouseRelease(e) {
        this.interfaces.forEach(inter => {
            if (typeof inter.onMouseRelease == 'function') {
                inter.onMouseRelease(e)
            }
        });
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

    terrain = await new Terrain([charizard, null, null, null, null, null], [pikachu, null, null, null, null, null])
    await charizard.useMove(1, pikachu, 5)
    charizard.currentStats['hp'] -= 50

    const interfaceGlobale = new InterfaceGlobale(document.querySelector('canvas'))

    const combat = new Combat(interfaceGlobale, terrain)
    console.log(typeof combat)
}


combatBasique()