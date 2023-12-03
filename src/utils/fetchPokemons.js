const VITE_BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || "http://localhost:3006";

const addPokemon = async (pokemon) => {
    try {
        const data = await fetch(VITE_BACKEND_HOST+"/api/user/pokemons", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(pokemon)
        });
        const response = await data.json();
        return response;
    } catch (error) {
        return null
    }

}

const getPokemons = async () => {
    const data = await fetch(VITE_BACKEND_HOST+"/api/user/pokemons", {
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
        return [error,null];
    }
    const pokemons = await data.json();
    return [null,pokemons];
}
const getStarters = async () => {
    try {
        const VITE_BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST;
        const response = await fetch(VITE_BACKEND_HOST + "/api/pokemon/starter", {
            method: "GET",
            credentials: "include"
        })
        const data = await response.json();
        const newPokemons = data.map((pokemon) => {
            return pokemon;
        })
        return [null,newPokemons];
    } catch (error) {
        
        console.error(error);
        return [error,null]
    }
}

const getPokemon = async (id=null,level=5) => {
    id =id || "random";
    const data = await fetch(`${VITE_BACKEND_HOST}/api/pokemon/fetch/${id}?level=${level}`, {
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

const savePokemons = async(pokemons) => {
    const data = await fetch(VITE_BACKEND_HOST+"/api/user/pokemons", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(pokemons)
    });
    console.log("data",data);
    const response = await data.json();
    console.log("response",response);
    return response;
}
const healPokemons = async() => {
    const data = await fetch(VITE_BACKEND_HOST+"/api/user/pokemons/heal", {
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
    console.log("pokemonApi",pokemon);
    const data = await fetch(`${VITE_BACKEND_HOST}/api/pokemon/level`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({pokemon})
    });
    const response = await data.json();
    return response;
}

const swapPokemons =async (id1,id2) => {
    const data = await fetch(`${VITE_BACKEND_HOST}/api/user/pokemons/swap/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({id1,id2})
    });
    const response = await data.json();
    return response;
}

const attack = async (pokemon1,pokemon2,move) => {
    const data = await fetch(VITE_BACKEND_HOST+"/api/pokemon/attack", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ pokemon1, pokemon2,move })
    });
    const response = await data.json();
    return response;
}

export {
    getPokemons,
    getStarters,
    getPokemon,
    addPokemon,
    removePokemon,
    savePokemons,
    healPokemons,
    addLevel,
    swapPokemons,
    attack
}