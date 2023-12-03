

const swapPokemons = (misPokemons, pokemon1, pokemon2) => {
    const index1 = misPokemons.indexOf(pokemon1);
    const index2 = misPokemons.indexOf(pokemon2);
    const newMisPokemons = [...misPokemons];
    newMisPokemons[index1] = pokemon2;
    newMisPokemons[index2] = pokemon1;
    return newMisPokemons;
}

const getAlive = (misPokemons) => {
    return misPokemons.filter((pokemon) => pokemon.hp > 0);
}



function misPokemonsReducer(misPokemons, action) {
    switch (action.type) {
        case "add":
            return [...misPokemons, action.payload];
        case "remove":
            return misPokemons.filter((pokemon) => pokemon._id !== action.payload._id);
        case "update":
            return misPokemons.map((pokemon) => {
                if (pokemon._id === action.payload._id) {
                    return action.payload;
                }
                return pokemon;
            });
        case "set":
            return action.payload;
        default:
            return misPokemons;
    }
}

export default misPokemonsReducer;