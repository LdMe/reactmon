
import fetchData from "./api/fetch";
const addPokemon = async (pokemon) => {
    const data = await fetchData("/api/user/pokemons", "post", { pokemon: pokemon._id || pokemon.id });
    return data;
}

const getPokemons = async () => {
    const data = await fetchData("/api/user/pokemons", "get");
    return data;
}

const getStarters = async () => {
    const data = await fetchData("/api/pokemon/starter", "get");
    console.log("data", data);
    return data;
}

const getPokemon = async (id = null, level = 5, trainer = false,save=false) => {
    id = id || "random";
    const data = {
        level: level,
        trainer: trainer,
        save:save,
    }
    console.log("datass", data);
    const result = await fetchData(`/api/pokemon/fetch/${id}`, "get", data);
    console.log("result", result);
    return result;
}

const getPokemonById = async (id) => {
    const data = await fetchData(`/api/pokemon/fetch/${id}`, "get");
    return data;
}

const removePokemon = async (pokemonToRemove) => {
    const data = await fetchData(`/api/user/pokemons/${pokemonToRemove._id}`, "delete");
    return data;
}

const clearFight = async () => {
    const data = await fetchData("/api/user/clear", "post");
    return data;
}

const healPokemons = async () => {
    const data = await fetchData("/api/user/pokemons/heal", "put");
    return data;
}

const addLevel = async (pokemon) => {
    const data = await fetchData("/api/pokemon/level", "put", { pokemon: pokemon._id });
    return data;
}

const swapPokemons = async (id1, id2) => {
    const data = await fetchData("/api/user/pokemons/swap", "put", { id1, id2 });
    return data;
}

const attack = async (pokemon1, pokemon2) => {
    if (!pokemon1 || !pokemon2) throw new Error("No se puede atacar");
    if (pokemon1.hp <= 0 || pokemon2.hp <= 0) throw new Error("No se puede atacar");
    const data = await fetchData("/api/pokemon/attack", "post", { pokemon1: pokemon1._id, pokemon2: pokemon2._id });
    return data;
}

const getUserData = async (username) => {
    const data = await fetchData("/api/user/data/" + username, "get");
    return data;
}

const capture = async (pokemon) => {
    const probability = 1.05 - pokemon.hp / pokemon.maxHp;
    if (Math.random() < probability) {
        const data = await addPokemon(pokemon);
        return data;
    }
    else {
        return null;
    }
}

const getWildPokemon = async (maxLevel) => {
    try {
        const level = Math.max(maxLevel, 10);
        const multiplier = Math.floor(Math.random() * maxLevel) + 1;
        const pokemonLevel = Math.min(maxLevel, multiplier);
        //const pokemonLevel = 1;
        const id = "random";
        const pokemonData = await getPokemon(id,pokemonLevel,);
        return pokemonData;
    } catch (error) {
        console.error(error);
        return {error: "No ha habido suerte buscando pokemons salvajes"}
    }
}
const getRandomTrainerPokemons = async (numOfPokemons,maxLevel,zone) => {
    const pokemons = [];
    for (let i = 0; i < numOfPokemons; i++) {
        const randomLevel = Math.max(1, Math.floor(maxLevel * 0.75 + Math.random() * maxLevel * 0.50));
        pokemons.push(getPokemon(null,randomLevel, true));
    }
    return await Promise.all(pokemons);

}
const getTrainerPokemons = async (pokemons=null,zone,maxQuantity=6,maxLevel=10) => {
    if (pokemons === null) {
        const n = Math.min(6, Math.floor(Math.random() * maxQuantity) + 2);
        return  await getRandomTrainerPokemons(n,maxLevel,zone);
    }
    const newPokemons = await Promise.all(pokemons.map(async (pokemon) => {
        return  await getPokemon(pokemon.id, pokemon.level, true,true);
    }));
    return newPokemons;
}
const saveToPc = async (pokemon) => {
    const data = await fetchData("/api/user/pokemons/pc", "post", { pokemon: pokemon._id });
    return data;
}

const getPc = async () => {
    const data = await fetchData("/api/user/pokemons/pc", "get");
    return data;
}


const removeFromPc = async (pokemon) => {
    const data = await fetchData(`/api/user/pokemons/pc/${pokemon._id}`, "delete");
    return data;
}

const getUsers = async () => {
    const data = await fetchData("/api/admin/users", "get");
    return data;
}

const getTemplatePokemons = async (idList = null) => {
    const data = await fetchData("/api/pokemon/templates", "get", {ids:idList });
    return data;
}


const getGyms = async () => {
    const data = await fetchData("/api/gyms/", "get");
    return data;
}

const createGym = async (gym) => {
    const data = await fetchData("/api/gyms/", "post", gym);
    return data;
}

const updateGym = async (gym) => {
    const data = await fetchData("/api/gyms/" + gym._id, "put", gym);
    return data;
}

const getTypes = async () => {
    const data = await fetchData("/api/pokemon/types", "get");
    return data;
}
const getZones = async () => {
    const data = await fetchData("/api/zone", "get");
    return data;
}
const getZone = async (id) => {
    const data = await fetchData("/api/zone/" + id, "get");
    return data;
}
const setMaxLevel = async (maxLevel) => {
    console.log("maxLevel", maxLevel);
    const data = await fetchData("/api/user/maxlevel", "put", { maxLevel });
    return data;
}
const setZone = async (zone) => {
    const data = await fetchData("/api/user/zone", "put", { zone:zone.name });
    return data;
}
export {
    getPokemons,
    getStarters,
    getPokemon,
    getPokemonById,
    addPokemon,
    removePokemon,
    healPokemons,
    addLevel,
    swapPokemons,
    attack,
    getUserData,
    clearFight,
    capture,
    getWildPokemon,
    getTrainerPokemons,
    saveToPc,
    getPc,
    removeFromPc,
    getUsers,
    getTemplatePokemons,
    getGyms,
    createGym,
    updateGym,
    getTypes,
    getZones,
    getZone,
    setZone,
    setMaxLevel
}