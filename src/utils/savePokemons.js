// funciones de localStorage

const getPokemons = ()=>{
    const pokemonsString = localStorage.getItem("pokemons") || "[]";
    const pokemons = JSON.parse(pokemonsString);
    return pokemons;
}

const savePokemons = (pokemons)=>{
    const pokemonsString = JSON.stringify(pokemons);
    localStorage.setItem("pokemons",pokemonsString);
}

const addPokemon = (pokemon) => {
    const pokemons  = getPokemons();
    if(pokemons.length >= 6){
        return false;
    }
    const uniqueId = getLastPokemonUniqueId() + 1;
    setLastPokemonUniqueId(uniqueId);
    pokemon.uniqueId = uniqueId;
    pokemons.push(pokemon);
    savePokemons(pokemons);
    return true;
}

const getLastPokemonUniqueId = () =>{
    const lastId = localStorage.getItem("lastUniqueId") || "1";
    return parseInt(lastId);
}
const setLastPokemonUniqueId = (newUniqueId) =>{
    localStorage.setItem("lastUniqueId",newUniqueId);
}

const removePokemon = (pokemonToRemove) => {
    const pokemons = getPokemons();
    const filteredPokemons = pokemons.filter(pokemon => pokemon.uniqueId !== pokemonToRemove.uniqueId);
    savePokemons(filteredPokemons);
}

export {
    getPokemons,
    addPokemon,
    removePokemon
}