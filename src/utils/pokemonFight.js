import { getMoveData,getTypeData } from "./fetchPokemons";

const attack = async(pokemon1,pokemon2,move) => {
    const attackType = await getTypeData(move.type);
    const pokemon2Types = await Promise.all(pokemon2.types.map(async(type) => {
        return await getTypeData(type.type);
    }
    ));
    console.log("attack type",attackType)
    console.log("pokemon2 types",pokemon2Types)
    console.log("pokemon2",pokemon2)
    const accuracy = move.accuracy;
    const random = Math.random() * 100;
    let damage = 0;
    if (random <= accuracy) {
    
      damage = move.power * pokemon1.level / 10;

    }
    // calculate damage multiplier from types ( double_damage_from, half_damage_from, no_damage_from)
    let typeMultiplier = 1;
    pokemon2Types.forEach((type) => {
        if (type.damage_relations.double_damage_from.find((doubleDamageType) => doubleDamageType.name === attackType.name)) {
            typeMultiplier *= 2;
        }
        if (type.damage_relations.half_damage_from.find((halfDamageType) => halfDamageType.name === attackType.name)) {
            typeMultiplier *= 0.5;
        }
        if (type.damage_relations.no_damage_from.find((noDamageType) => noDamageType.name === attackType.name)) {
            typeMultiplier *= 0;
        }
    });
    damage = damage * typeMultiplier;
    console.log("multiplier",typeMultiplier)
    console.log("damage",damage)
    return Math.round(damage);
};
const addLevel = (pokemon) => {
    pokemon.level++;
    pokemon.maxHp += pokemon.baseHp;
    return pokemon;
}
const getMove = async (pokemon) => {
    const random = Math.floor(Math.random() * pokemon.moves.length);
    const move = pokemon.moves[random];
    const moveData = await getMoveData(move.move);
    return moveData;
}
const updateHp = (pokemon, damage) => {
    pokemon.hp -= damage;
    if (pokemon.hp < 0) {
        pokemon.hp = 0;
    }
    return pokemon;

}
const fight = async (pokemon1, pokemon2) => {
    const move = await getMove(pokemon1);
    const damage = await attack(pokemon1,pokemon2, move);
    pokemon2 = updateHp(pokemon2, damage);
    return pokemon2;
}


export {
    fight,
    updateHp,
    addLevel
}
