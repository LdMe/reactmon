import { useEffect, useState, useContext } from "react";
import Pokemon from "../components/PokemonComponent";
import PokemonContext from "../context/pokemonContext";
import { getPokemonData, getMoveData } from "../utils/fetchPokemons";
import { fight,addLevel } from "../utils/pokemonFight";
import MisPokemons from "./MisPokemons";

const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/";

const WildCombat = ({ onFinish }) => {
    const [wildPokemon, setWildPokemon] = useState(null);
    const { misPokemons, setMisPokemons } = useContext(PokemonContext);
    const [isEnded, setIsEnded] = useState(false);
    useEffect(() => {
        getPokemonState();
    }, []);

    useEffect(() => {
        if (wildPokemon!==null && wildPokemon.hp === 0) {
            const newMisPokemons = [...misPokemons];
            const newPokemon = addLevel({...misPokemons[0]});
            console.log("level up",newPokemon);
            newMisPokemons[0] = newPokemon;
            setMisPokemons(newMisPokemons);
            onFinish("map");
        }
    }, [wildPokemon]);

    const attack = async (pokemon1, pokemon2) => {
        const newPokemon = await fight(pokemon1, pokemon2);
        if (newPokemon.uniqueId === wildPokemon.uniqueId) {
            setWildPokemon(newPokemon);
        }
        else {
            const newMisPokemons = [...misPokemons];
            newMisPokemons[0] = newPokemon;
            setMisPokemons(newMisPokemons);
        }
    }

    const getPokemonState = async () => {
        try {
            const pokemonId = Math.floor(Math.random() * 152);
            const maxLevel = Math.max(...misPokemons.map((pokemon) => pokemon.level));
            const pokemonLevel = Math.floor(Math.random() * maxLevel * 1.5) + 1;
            const pokemonData = await getPokemonData(pokemonId, pokemonLevel);
            setWildPokemon(pokemonData);
        } catch (error) {
            alert("No ha habido suerte buscando pokemons salvajes");
            onFinish("map");
        }
    }
    
    const capture = () => {
        if (misPokemons.length === 6) {
            alert("No puedes capturar más pokemons");
            onFinish("map");
            return;
        }
        const probability = 1.05 - wildPokemon.hp / wildPokemon.maxHp;
        console.log("probability",probability);

        if (Math.random() < probability) {
            alert("Has capturado al pokemon");

            const newPokemon = addLevel({...wildPokemon});
            if (newPokemon.hp === 0) {
                newPokemon.hp = 1;
            }
            const newMisPokemons = [...misPokemons, newPokemon];
            console.log(newMisPokemons);
            setMisPokemons(newMisPokemons);
            onFinish("map");
            
        }
        else {
            alert("El pokemon se ha escapado");
            onFinish("map");
        }
    }
    const handleAttack = async () => {

        attack(misPokemons[0], {...wildPokemon});
        attack(wildPokemon, {...misPokemons[0]});
        
    }

    if (wildPokemon) {
        return (
            <>
                <Pokemon data={wildPokemon} />
                <Pokemon data={misPokemons[0]} isFront={false} />
                <button onClick={() => onFinish("map")} >Huir</button>
                <button onClick={handleAttack}>Pelear</button>
                <button onClick={capture}>Capturar</button>
                <MisPokemons onFinish={()=>{}} isView={false} />
            </>
        )
    }
    return <p>Buscando pelea...</p>
}

export default WildCombat;