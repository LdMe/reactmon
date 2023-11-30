
import { useContext,useState } from "react";

import PokemonContext from "../context/pokemonContext";

import Pokemon from "../components/PokemonComponent";


const MisPokemons = ({ onFinish, isView=true }) => {
    
        const { misPokemons, setMisPokemons } = useContext(PokemonContext);
        const [selectedPokemon, setSelectedPokemon] = useState(null);

        const handlePokemonClick = (pokemon) => {
            if (selectedPokemon === null) {
                setSelectedPokemon(pokemon);
            }
            else {
                const newMisPokemons = [...misPokemons];
                const index1 = newMisPokemons.findIndex((pok) => pok.uniqueId === selectedPokemon.uniqueId);
                const index2 = newMisPokemons.findIndex((pok) => pok.uniqueId === pokemon.uniqueId);
                const aux = newMisPokemons[index1];
                newMisPokemons[index1] = newMisPokemons[index2];
                newMisPokemons[index2] = aux;
                setMisPokemons(newMisPokemons);
                setSelectedPokemon(null);
            }
        }
        const handleFreePokemon = (e,pokemon) => {
            e.stopPropagation();
            if(confirm(`¿Estás seguro de que quieres soltar a ${pokemon.name}?`) ){
                const newMisPokemons = misPokemons.filter((pok) => pok.uniqueId !== pokemon.uniqueId);
                setMisPokemons(newMisPokemons);
            }
        }
        return (
            <div className="mis-pokemons">
                <h2>Mis pokemons</h2>
                <section className="pokemons-container">
                    {misPokemons.map((pokemon) => {
                        return <Pokemon 
                        key={pokemon.uniqueId} 
                        data={pokemon} 
                        onClick={() => handlePokemonClick(pokemon)} 
                        isCombat={true} 
                        isSelected={selectedPokemon !== null && selectedPokemon.uniqueId === pokemon.uniqueId}
                        >
                            {isView && <button onClick={(e) => handleFreePokemon(e,pokemon)}>Soltar</button>}
                            
                        </Pokemon>
                    })}
                </section>
                {isView && <button onClick={() => onFinish("map")}>Volver</button>}
            </div>
        )
    }

export default MisPokemons;
