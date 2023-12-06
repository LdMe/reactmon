import { useEffect, useState, useContext,useRef, useLayoutEffect } from "react";
import Pokemon from "../components/PokemonComponent";
import PokemonContext from "../context/pokemonContext";
import MisPokemons from "./MisPokemons";
import { attack as attackApi,getPokemon,removeOwnerlessPokemon } from "../utils/fetchPokemons";
import Combat from "../components/CombatComponent";

const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/";

const WildCombat = ({ onFinish }) => {
    const [wildPokemon, setWildPokemon] = useState(null);
    const { misPokemons, updatePokemon,addPokemon,addLevel,getMisPokemons } = useContext(PokemonContext);
    const [isEnded, setIsEnded] = useState(false);
    const footerRef = useRef(null);
    const wildPokemonRef = useRef(null);
    
    useEffect(() => {
        getMisPokemons();
        getPokemonState();
        setTimeout(() => {
            if (footerRef.current === null) {
                return;
            }
            footerRef.current.scrollIntoView({ behavior: "smooth" });
        }, 1500);
        return () => {
            console.log("exiting",wildPokemonRef.current);
            if(wildPokemonRef.current!==null){
                removeOwnerlessPokemon(wildPokemonRef.current);
            }
        }
    }, []);


    useEffect(() => {
        finishCombat();
        if(wildPokemon){
            wildPokemonRef.current = wildPokemon._id;
        }
        
    }, [isEnded,wildPokemon]);

    const finishCombat = async() => {
        if (isEnded) {
            return;
        }
        if (wildPokemon!==null && wildPokemon.hp === 0) {
            const deletedPokemon = await removeOwnerlessPokemon(wildPokemon._id);
            console.log("deleted",deletedPokemon.name);
            const result = await addLevel(misPokemons[0]);
            setIsEnded(true);
                setTimeout(() => {
                alert("Has ganado la pelea");
                onFinish("map");
                }, 600);
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
            setIsEnded(true);
            onFinish("map");
            return;
        }
        const probability = 1.05 - wildPokemon.hp / wildPokemon.maxHp;
        console.log("probability",probability);
        if (Math.random() < probability) {
            alert("Has capturado al pokemon");
            wildPokemonRef.current = null;
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
    
    const handleChange = async (pokemon) =>{
        
        if(pokemon._id===misPokemons[0]._id){
            return await updatePokemon(pokemon);
        }
        else{
            setWildPokemon(pokemon);
        }
    }
    if (wildPokemon) {
        return (
            <>
                <Combat 
                pokemon1={misPokemons[0]} 
                pokemon2={wildPokemon} 
                onChange={handleChange} 
                onFinish={onFinish} 
                buttons ={[{name:"Capturar",onClick:capture,image:"/pokeball.svg"}]}
                />
                <MisPokemons 
                onFinish={()=>{}} 
                isView={false} 
                />
                <div ref={footerRef} />
            </>
        )
    }
    return (
        <section className="loading-section">
            <img className="pokeball-loading rotate" src="/pokeball.svg"/>
        </section>
    )
}

export default WildCombat;