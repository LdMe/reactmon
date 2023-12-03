
import { useContext, useState } from "react";

import PokemonContext from "../context/pokemonContext";

import Pokemon from "../components/PokemonComponent";


const MisPokemons = ({ onFinish, isView = true }) => {

    const { misPokemons, swapPokemons, removePokemon } = useContext(PokemonContext);
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    const handlePokemonClick = (pokemon) => {
        if (selectedPokemon === null) {
            setSelectedPokemon(pokemon);
        }
        else {
            swapPokemons(selectedPokemon._id, pokemon._id);
            setSelectedPokemon(null);
        }
    }
    const handleFreePokemon = (e, pokemon) => {
        e.stopPropagation();
        if (confirm(`¿Estás seguro de que quieres soltar a ${pokemon.name}?`)) {
            removePokemon(pokemon)
        }
    }
    return (
        <div className="mis-pokemons">
            <h2>Mis pokemons</h2>
            <section className="pokemons-container">
                {misPokemons.map((pokemon) => {
                    return <Pokemon
                        key={pokemon._id}
                        data={pokemon}
                        onClick={() => handlePokemonClick(pokemon)}
                        isCombat={true}
                        isSelected={selectedPokemon !== null && selectedPokemon._id === pokemon._id}
                    >

                        {isView &&
                            <section className="pokemon-actions">
                                <ul>
                                    {pokemon.activeMoves.map((move) => {
                                        return <li key={move.name}>{move.name} | {move.power} | {move.type.name}</li>
                                    })
                                    }
                                </ul>
                                <section className="pokemon-buttons">
                                    <button onClick={(e) => handleFreePokemon(e, pokemon)}>Soltar</button>
                                </section>
                            </section>
                        }
                    </Pokemon>
                })}
            </section>
            <section className="action-buttons">
                {isView && <button onClick={() => onFinish("map")}>Volver</button>}
            </section>
        </div>
    )
}

export default MisPokemons;
