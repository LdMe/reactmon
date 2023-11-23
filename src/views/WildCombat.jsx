import { useEffect, useState,useContext } from "react";
import Pokemon from "../components/PokemonComponent";
import PokemonContext from "../context/pokemonContext";
import { getPokemonData,getMoveData } from "../utils/fetchPokemons";

const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/";

const WildCombat = ({ onFinish }) => {
    const [wildPokemon, setWildPokemon] = useState(null);
    useEffect(() => {
        attack(misPokemons[0]);
        getPokemonState();
    }, []);
    const attack = async(pokemon)=>{
        const moveIndex = Math.floor(Math.random() * pokemon.moves.length);
        const move = pokemon.moves[moveIndex].move;
        const moveData = await getMoveData(move);
        console.log("atacando...",moveData);
    }
    const {misPokemons} = useContext(PokemonContext);
    const getPokemonState = async () => {
        try {
            const pokemonId = Math.floor(Math.random() * 152);
            const pokemonLevel = Math.floor(Math.random() * 20) + 1;
            const pokemonData = await getPokemonData(pokemonId,pokemonLevel);
            console.log(pokemonData);
            setWildPokemon(pokemonData);
        } catch (error) {
            alert("No ha habido suerte buscando pokemons salvajes");
            onFinish("map");
        }
    }
    if (wildPokemon) {
        return (
            <>
                <Pokemon data={wildPokemon} />
                <Pokemon data={misPokemons[0]} isFront={false} />
                <button onClick={() => onFinish("map")} >Huir</button>
                <button>Pelear, aunque no haga nada</button>

            </>
        )
    }
    return <p>Buscando pelea...</p>
}

export default WildCombat;