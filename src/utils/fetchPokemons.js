import { getLastPokemonUniqueId,setLastPokemonUniqueId } from "./savePokemons";
const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/";

const getPokemonData = async (pokemonId,level=5) => {
    try {
        const data = await fetch(pokemonUrl + pokemonId);
        const result = await data.json();
        const base_hp = result.stats[0].base_stat;
        const uniqueId = getLastPokemonUniqueId() + 1;
        setLastPokemonUniqueId(uniqueId);
        const pokemonData = {
            name: result.name,
            sprites: result.sprites,
            types:result.types,
            moves:result.moves,
            level:level,
            hp:  base_hp * level,
            maxHp: base_hp * level,
            id:result.id,
            uniqueId:uniqueId
        }
        return pokemonData;
    } catch (error) {
        console.error(error);
        return null;
    }
}

const getMoveData = async(move) =>{
    try {
        const response  = await fetch(move.url);
        const data = await response.json();
        const moveData = {
            name: move.name,
            accuracy: data.accuracy || 100,
            power: data.power || 0
        }
        return moveData;
    } catch (error) {
        console.error(error);
        return null
    }

}

export {
    getPokemonData,
    getMoveData
}