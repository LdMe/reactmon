import { useEffect, useState } from "react";
import Pokemon from "../components/PokemonComponent";

const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/";

const WildCombat = ({ onFinish }) => {
    const [wildPokemon, setWildPokemon] = useState(null);
    useEffect(() => {
        getPokemonData();
    }, []);

    const getPokemonData = async () => {
        try {
            const pokemonId = Math.floor(Math.random() * 152);
            const data = await fetch(pokemonUrl + pokemonId);
            const result = await data.json();
            setWildPokemon(result);
        } catch (error) {
            alert("No ha habido suerte buscando pokemons salvajes");
            onFinish("map");
        }
    }
    if (wildPokemon) {
        return (
            <>
                <Pokemon data={wildPokemon} />
                <button onClick={() => onFinish("map")} >Huir</button>
                <button>Pelear, aunque no haga nada</button>

            </>
        )
    }
    return <p>Buscando pelea...</p>
}

export default WildCombat;