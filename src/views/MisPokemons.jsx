
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
    const getStatWithMultiplier = (stat) => {
        return Math.round(stat.base_stat * stat.multiplier);
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
                            <section className="pokemon-actions full">
                                {/* <section className="pokemon-stats">
                                    {pokemon.activeMoves.map((move) => {
                                        return <div key={move.name}>{move.name} | {move.power} | {move.type.name}</div>
                                    })
                                    }
                                    <div>hp: {getStatWithMultiplier(pokemon.stats[0])}</div>
                                    <div>attack: {getStatWithMultiplier(pokemon.stats[1])}</div>
                                    <div>defense: {getStatWithMultiplier(pokemon.stats[2])}</div>
                                </section> */}
                                <p><b>Tipos:</b> {
                                    pokemon.types.map((type) => {
                                        return <span key={type.name} className={type.name}>{type.nameEs} </span>
                                    })
                                }</p>
                                <table >
                                    <thead>
                                        <tr>
                                            <th>nombre</th>
                                            <th>valor</th>
                                            <th>tipo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pokemon.activeMoves.map((move) => {
                                            return (
                                                <tr key={move.name}>
                                                    <td>{move.nameEs}</td>
                                                    <td>{move.power}</td>
                                                    <td className={move.type.name}>{move.type.nameEs}</td>
                                                </tr>
                                            )
                                        }
                                        )}
                                        <tr>
                                            <td>hp</td>
                                            <td>{getStatWithMultiplier(pokemon.stats[0])}</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>ataque</td>
                                            <td>{getStatWithMultiplier(pokemon.stats[1])}</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>defensa</td>
                                            <td>{getStatWithMultiplier(pokemon.stats[2])}</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <section className="pokemon-buttons">
                                    <button onClick={(e) => handleFreePokemon(e, pokemon)}>Soltar</button>
                                </section>
                            </section>
                        }
                    </Pokemon>
                })}
            </section>
            {isView &&
                <section className="pokemon-buttons">
                    <button onClick={() => onFinish("map")}>Volver</button>
                </section>
            }
        </div>
    )
}

export default MisPokemons;
