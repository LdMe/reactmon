

const getAlivePokemons = (pokemons) => {
    const alivePokemons = pokemons.filter((pokemon) => pokemon.hp > 0);
    return alivePokemons;
}

const swapPokemons = (pokemons, pokemon1,pokemon2) => {
    const newPokemons = [...pokemons];
    const index1 = pokemons.findIndex((pokemon) => pokemon.uniqueId === pokemon1.uniqueId);
    const index2 = pokemons.findIndex((pokemon) => pokemon.uniqueId === pokemon2.uniqueId);
    newPokemons[index1] = pokemons[index2];
    newPokemons[index2] = pokemons[index1];
    return newPokemons;
}

const changeToNextAlivePokemon = (pokemons, hardcoreMode) => {
    const newPokemons = [...pokemons];
    const alivePokemons = getAlivePokemons(pokemons);
    if(hardcoreMode) return alivePokemons;
    if(alivePokemons.length === 0) return newPokemons;
    const pokemon2 = alivePokemons[0];
    return swapPokemons(pokemons, pokemons[0], pokemon2);
}


export {
    getAlivePokemons,
    swapPokemons,
    changeToNextAlivePokemon
}