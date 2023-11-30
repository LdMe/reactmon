import { useState, useEffect,useContext } from "react";
import Pokemon from "../components/PokemonComponent";
import { addPokemon } from "../utils/savePokemons";
import { getPokemonData } from "../utils/fetchPokemons";
import PokemonContext from "../context/pokemonContext";

const ChoosePokemon = ({ idList = [1, 4, 7], onFinish}) => {
    const [pokemonList, setPokemonList] = useState([]);
    const [error, setError] = useState(null);
    const {misPokemons,setMisPokemons} = useContext(PokemonContext);
    useEffect(() => {
        getPokemons();
    }, []);

    const getPokemons = async () => {
        try {
            const newPokemons = await Promise.all(
                idList.map(async (id) => {
                    const pokemon = await getPokemonData(id,5);
                    return pokemon;
                })
            )
            setPokemonList(newPokemons);
        } catch (error) {
            setError("El profesor Oak no está disponible, vuelve más tarde.");
        }
    }

    const handleSelectPokemon = (pokemon) =>{
        if(addPokemon(pokemon)){
            const newMisPokemons = [...misPokemons,pokemon];
            setMisPokemons(newMisPokemons);
            alert(`has escogido el pokemon ${pokemon.name}, ¡cuídalo mucho!`);
        }
        else{
            alert("Profesor Oak: ya tienes 6 pokemons, no te pases chaval")
        }
        onFinish("map");
    }

    const pokemonComponents = pokemonList.map((pokemon) => {
        return <Pokemon 
            key={pokemon.id} 
            data={pokemon} 
            onClick={()=>handleSelectPokemon(pokemon)} 
            isCombat={false}
            />
    })

    return (
        <>
            <h2>Elige tu pokemon</h2>
            <img src="data:image/jpeg;base64,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" alt="professor oak"/>
            <section className="pokemon-container">
                {pokemonComponents}
            </section>
        </>
    )
}

export default ChoosePokemon;