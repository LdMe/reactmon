import { useEffect, useState, useContext,useRef } from "react";
import Pokemon from "../components/PokemonComponent";
import PokemonContext from "../context/pokemonContext";
import MisPokemons from "./MisPokemons";
import { attack as attackApi,getPokemon } from "../utils/fetchPokemons";
import Combat from "../components/CombatComponent";

const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/";

const WildCombat = ({ onFinish }) => {
    const [wildPokemon, setWildPokemon] = useState(null);
    const { misPokemons, updatePokemon,addPokemon,addLevel } = useContext(PokemonContext);
    const [isEnded, setIsEnded] = useState(false);
    
    useEffect(() => {
        getPokemonState();
    }, []);

    useEffect(() => {
        finishCombat();
        
    }, [isEnded,wildPokemon]);

    const finishCombat = async() => {
        if (wildPokemon!==null && wildPokemon.hp === 0) {
            const result = await addLevel(misPokemons[0]);
            alert("Has ganado la pelea");
            onFinish("map");
        }
    }
    
    const getPokemonState = async () => {
        try {
            const maxLevel = Math.max(...misPokemons.map((pokemon) => pokemon.level));
            const pokemonLevel = Math.floor(Math.random() * maxLevel *1.5) + 1;
            //const pokemonLevel = 1;
            const id="random";
            const pokemonData = await getPokemon(id,pokemonLevel);
            
            setWildPokemon(pokemonData);
        } catch (error) {
            console.error(error);
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

            const newPokemon = {...wildPokemon};
            if (newPokemon.hp === 0) {
                newPokemon.hp = 1;
            }
            addPokemon(newPokemon);
            onFinish("map");
        }
        else {
            alert("El pokemon se ha escapado");
            onFinish("map");
        }
    }
    
    const handleChange = (pokemon) =>{
        
        if(pokemon._id===misPokemons[0]._id){
            updatePokemon(pokemon);
        }
        else{
            setWildPokemon(pokemon);
        }
    }
    if (wildPokemon) {
        return (
            <>
                {/* <Pokemon data={wildPokemon} />
                <Pokemon data={misPokemons[0]} isFront={false} />
                <button onClick={() => onFinish("map")} >Huir</button>
                <button onClick={handleAttack}>Pelear</button>
                <button onClick={capture}>Capturar</button>
                 */}
                <Combat 
                pokemon1={misPokemons[0]} 
                pokemon2={wildPokemon} 
                onChange={handleChange} 
                onFinish={onFinish} 
                buttons ={[{name:"Capturar",onClick:capture,image:"/pokeball.svg"}]}
                />
                <MisPokemons onFinish={()=>{}} isView={false} />
            </>
        )
    }
    return <p>Buscando pelea...</p>
}

export default WildCombat;