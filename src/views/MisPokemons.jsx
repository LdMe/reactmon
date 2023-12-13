
import { useContext, useEffect, useState } from "react";

import PokemonContext from "../context/pokemonContext";

import Pokemon from "../components/PokemonComponent";
import { getPc, saveToPc, removeFromPc } from "../utils/fetchPokemons";

const MisPokemons = ({ onFinish, isView = true, onUpdate, disabled = false }) => {

    const { misPokemons, swapPokemons, removePokemon, getMisPokemons } = useContext(PokemonContext);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [pcPokemons, setPcPokemons] = useState([]);
    useEffect(() => {
        getMisPokemons();
        handleGetPc();

    }, []);
    useEffect(() => {
        setSelectedPokemon(null);
    }, [misPokemons, pcPokemons]);
    const handleGetPc = async () => {
        try {
            const pokemons = await getPc();
            console.log("pokemons", pokemons);
            setPcPokemons(pokemons);
        }
        catch (error) {
            console.log(error);
        }
    }
    const handlePokemonClick = async (pokemon) => {

        if (selectedPokemon === null) {
            setSelectedPokemon(pokemon);
        }
        else {
            setSelectedPokemon(null);
            if (!isView) {
                if (selectedPokemon._id === pokemon._id) {


                    if (pokemon.hp === 0) {
                        return;
                    }
                    if (disabled) {
                        return;
                    }
                    await swapPokemons(pokemon._id, misPokemons[0]._id)
                    onUpdate();
                }
                else {
                    await swapPokemons(selectedPokemon._id, pokemon._id);

                }
                return;
            }
            else if (selectedPokemon._id === pokemon._id) {
                const pcPokemonsIndex = pcPokemons.findIndex((pokemon) => pokemon._id === selectedPokemon._id);
                if (pcPokemonsIndex !== -1) {
                    const { error, savedPokemons } = await removeFromPc(selectedPokemon);
                    if (error) {
                        console.log(error);
                        return;
                    }
                    console.log("savedPokemons", savedPokemons);
                    setPcPokemons(savedPokemons);
                    await getMisPokemons();
                    return;
                }
            }

            const data = await swapPokemons(selectedPokemon._id, pokemon._id);
            if (data) {
                setPcPokemons(data.savedPokemons);
            }
        }
    }
    const handleFreePokemon = async (e, pokemon) => {
        e.stopPropagation();
        if (confirm(`¿Estás seguro de que quieres soltar a ${pokemon.name}?`)) {
            await removePokemon(pokemon)
        }
    }
    const handleSaveToPc = async (e, pokemon) => {
        e.stopPropagation();
        const { error, savedPokemons } = await saveToPc(pokemon);
        if (error) {
            alert(error);
            console.log(error);
            return;
        }
        setPcPokemons(savedPokemons);
        await removePokemon(pokemon, false);
    }

    const getStatWithMultiplier = (stat) => {
        return Math.round(stat.base_stat * stat.multiplier);
    }
    let filteredPokemons = misPokemons.map((pokemon) => pokemon);
    if (!isView) {
        filteredPokemons = filteredPokemons.filter((pokemon) => pokemon._id !== misPokemons[0]._id);
    }
    const getName = (element, lang = "es") => {
        if (element.names && element.names.length > 0) {
            return element.names.filter((name) => name.language.name === lang)[0].name;
        }
        return element.name;
    }
    const getMultiplierColor = (multiplier) => {
        // multiplier goes from 0.75 to 1.25
        if (multiplier > 1) {
            // return color between black and green
            const green = (multiplier - 1) / 0.25 * 255;
            return "rgb(0," + green + ",0)";

        }
        if (multiplier < 1) {
            // return color between black and red .
            const red = (1 - multiplier) / 0.25 * 255;
            return "rgb(" + red + ",0,0)";

        }
        return "black";
    }

    return (
        <div className={"mis-pokemons" + (isView ? " view" : "")}>
            {misPokemons.length !== 1 &&
                <section className="pokemons--title">
                    <h2>Mis pokemons</h2>
                    <p>{misPokemons.length} / 6</p>
                </section>
            }
            <section className="pokemons-container">
                {filteredPokemons.map((pokemon) => {
                    const movesPad = [];
                    for (let i = pokemon.activeMoves.length; i < 4; i++) {
                        movesPad.push(
                            <tr key={"pad" + i}>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        )
                    }
                    return <Pokemon
                        key={pokemon._id}
                        data={pokemon}
                        onClick={() => handlePokemonClick(pokemon)}
                        isCombat={true}
                        defaultClassName={disabled || (!isView && pokemon.hp === 0) ? "disabled" : ""}
                        isSelected={selectedPokemon !== null && selectedPokemon._id === pokemon._id}
                    >

                        {isView &&
                            <section className="pokemon-actions full">

                                <p><b>Tipos:</b> {
                                    pokemon.types.map((type) => {
                                        return <span key={type.name} className={type.name + " type__name"}>{getName(type, "es")} </span>
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
                                                    <td>{getName(move, "es")}</td>
                                                    <td>{move.power}</td>
                                                    <td className={move.type.name}>{getName(move.type, "es")}</td>
                                                </tr>
                                            )
                                        }
                                        )}
                                        {
                                            movesPad
                                        }

                                        <tr></tr>
                                        <tr className="stat__row">
                                            <td>hp</td>
                                            <td style={{ color: getMultiplierColor(pokemon.stats[0].multiplier) }}>{getStatWithMultiplier(pokemon.stats[0])}</td>
                                        </tr>
                                        <tr className="stat__row">
                                            <td>ataque</td>
                                            <td style={{ color: getMultiplierColor(pokemon.stats[1].multiplier) }}>{getStatWithMultiplier(pokemon.stats[1])}</td>
                                        </tr>
                                        <tr className="stat__row">
                                            <td>defensa</td>
                                            <td style={{ color: getMultiplierColor(pokemon.stats[2].multiplier) }}>{getStatWithMultiplier(pokemon.stats[2])}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <section className="pokemon-buttons ">
                                    <button onClick={(e) => handleSaveToPc(e, pokemon)}>Guardar en el PC</button>
                                    <button onClick={(e) => handleFreePokemon(e, pokemon)}>Soltar</button>
                                </section>
                            </section>
                        }
                    </Pokemon>
                })}
            </section>
            {isView &&
                <section className="pc-pokemons-section">
                    <section className="pokemons--title">
                        <h2>PC</h2>
                        <p>{pcPokemons.length} / 30</p>
                    </section>
                    <section className="pc-pokemons">
                        {pcPokemons.map((pokemon) => (
                            <Pokemon
                                key={pokemon._id}
                                data={pokemon}
                                onClick={() => handlePokemonClick(pokemon)}
                                isCombat={false}
                                defaultClassName={disabled || (!isView && pokemon.hp === 0) ? "disabled" : ""}
                                isSelected={selectedPokemon !== null && selectedPokemon._id === pokemon._id}
                            />
                        ))
                        }
                    </section>
                    <section className="pokemon-buttons button-footer">
                        <button onClick={() => onFinish("map")}>Volver</button>
                    </section>
                </section>
            }
        </div>
    )
}

export default MisPokemons;
