export class Move {
    constructor(movejson) {
        this.name = movejson.name
        this.pp = movejson.pp
        this.power = movejson.power
        this.type = movejson.type.name
        this.types = {} // dict qui donne la relation entre les différent le move est les types
        //console.log(movejson.damage_class.name)
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