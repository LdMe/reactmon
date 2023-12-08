const VITE_BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || "http://localhost:3006";

const addPokemon = async (pokemon) => {
    try {
        const data = await fetch(VITE_BACKEND_HOST + "/api/user/pokemons", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ pokemon: pokemon._id || pokemon.id })
        });
        const response = await data.json();
        return response;
    } catch (error) {
        return null
    }

}

const getPokemons = async () => {
    try {
        const data = await fetch(VITE_BACKEND_HOST + "/api/user/pokemons", {
            credentials: "include"
        });
        const errors = [
            {
                status: 401,
                message: "No estas logeado"
            },
            {
                status: 500,
                message: "Error del servidor"
            },
            {
                status: 404,
                message: "No se encontraron pokemons"
            },
        ]
        if (data.status !== 200) {
            let error = errors.find((error) => error.status === data.status);
            if (!error) {
                error = {
                    status: data.status,
                    message: "Error desconocido"
                }
            }
            return [error, null];
        }
        const pokemons = await data.json();
        return [null, pokemons];
    } catch (error) {
        console.error(error);
        return [error, null]
    }

}
const getStarters = async () => {
    try {
        const response = await fetch(VITE_BACKEND_HOST + "/api/pokemon/starter", {
            method: "GET",
            credentials: "include"
        })
        const data = await response.json();
        const newPokemons = data.map((pokemon) => {
            return pokemon;
        })
        return [null, newPokemons];
    } catch (error) {

        console.error(error);
        return [error, null]
    }
}

const getPokemon = async (id = null, level = 5, trainer = false) => {
    id = id || "random";
    const url = new URL(`${VITE_BACKEND_HOST}/api/pokemon/fetch/${id}`);
    url.searchParams.append("level", level);
    url.searchParams.append("trainer", trainer);
    const data = await fetch(url.toString(), {
        credentials: "include"
    });
    const pokemon = await data.json();
    return pokemon;
}
const getPokemonById = async (id) => {
    const data = await fetch(`${VITE_BACKEND_HOST}/api/pokemon/fetch/${id}`, {
        credentials: "include"
    });
    const pokemon = await data.json();
    return pokemon;
}

const removePokemon = async (pokemonToRemove) => {
    const data = await fetch(`${VITE_BACKEND_HOST}/api/user/pokemons/${pokemonToRemove._id}`, {
        method: "DELETE",
        credentials: "include"
    });
    const response = await data.json();
    return response;
}


const clearFight = async () => {
    const data = await fetch(`${VITE_BACKEND_HOST}/api/user/clear`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    
}

const healPokemons = async () => {
    const data = await fetch(VITE_BACKEND_HOST + "/api/user/pokemons/heal", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    const response = await data.json();
    return response;
}

const addLevel = async (pokemon) => {
    const data = await fetch(`${VITE_BACKEND_HOST}/api/pokemon/level`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ pokemon: pokemon._id })
    });
    const response = await data.json();
    return response;
}

const swapPokemons = async (id1, id2) => {
    const data = await fetch(`${VITE_BACKEND_HOST}/api/user/pokemons/swap/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ id1, id2 })
    });
    const response = await data.json();
    return response;
}

const attack = async (pokemon1, pokemon2) => {
    if (!pokemon1 || !pokemon2) throw new Error("No se puede atacar");
    if (pokemon1.hp <= 0 || pokemon2.hp <= 0) throw new Error("No se puede atacar");
    const data = await fetch(VITE_BACKEND_HOST + "/api/pokemon/attack", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ pokemon1: pokemon1._id, pokemon2: pokemon2._id })
    });
    const response = await data.json();
    return response;
}
const getUserData = async (username) => {
    const data = await fetch(VITE_BACKEND_HOST + "/api/user/data/" + username, {
        credentials: "include"
    });
    const user = await data.json();
    return user;
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
    capture
}