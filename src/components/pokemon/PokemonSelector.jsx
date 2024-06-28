import { useState,useEffect } from "react";

import { getTemplatePokemons } from "../../utils/fetchPokemons";
import PokemonCarousel from "./carousel/PokemonCarousel";
const PokemonSelector = ({onFinish, pokemons=null,types=[]}) => {
    const [templatePokemons, setTemplatePokemons] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [filter, setFilter] = useState("");
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        if(pokemons !== null){
            setTemplatePokemons(pokemons);
        }
    }, [pokemons]);

    useEffect(() => {
        if(templatePokemons.length > 0){
            setLoaded(true);
        }
    }, [templatePokemons]);

    useEffect(() => {
        getTemplatePokemons().then((pokemons) => {
            setTemplatePokemons(pokemons);
        })
    }, []);

    const handleSelectPokemon = (pokemon) => {
        if(selectedPokemon === pokemon){
            handleNext();
            return;
        }
        setSelectedPokemon(pokemon);
    }
    const filterByType = (pokemons) => {
        console.log("types", types);
        if(types.length === 0){
            return pokemons;
        }
        return pokemons.filter((pokemon) => types.some((type) => pokemonHasType(pokemon,type)));
    }
    const pokemonHasType = (pokemon,type) => {
        console.log("pokemonHasType", pokemon.types, type);
        return pokemon.types.some((pokemonType) => pokemonType === type.name);
    }
    const handleNext = () => {
        if(selectedPokemon === null){
            return;
        }
        onFinish(selectedPokemon);
        setFilter("");
        setSelectedPokemon(null);
    }
    const filteredPokemons = filterByType(templatePokemons.filter((pokemon) => pokemon.name.includes(filter) || pokemon.id.toString().includes(filter)));
    if(!loaded){
        return <h1>Cargando Pokemons...</h1>
    }
    return (
        <div className="pokemon-selector">
            
            <section className="pokemon-list">
                <PokemonCarousel 
                pokemons={filteredPokemons} 
                onSelect={handleSelectPokemon} 
                selected={selectedPokemon} 
                showHp={false}
                />
                {/* {filteredPokemons.map((pokemon) => (
                    <article key={pokemon._id} className={`pokemon-card no-combat ${selectedPokemon?.id === pokemon.id ? "selected" : ""}`} onClick={() => handleSelectPokemon(pokemon)}>
                        <h3>#{pokemon.id} {pokemon.name} </h3>
                        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    </article>
                ))} */}
            </section>
            <section className="pokemon-buttons ">
                <input type="text" placeholder="Buscar pokemon" value={filter} onChange={(e) => setFilter(e.target.value)} />
                <button onClick={handleNext}>Seleccionar</button>
            </section>
        </div>
    )
}

export default PokemonSelector;