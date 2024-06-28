
import { useContext, useEffect, useState } from "react";

import PokemonContext from "../context/pokemonContext";
import Pokemon from "../components/pokemon/PokemonComponent";
import { getPc, saveToPc, removeFromPc } from "../utils/fetchPokemons";
import loggedInContext from "../context/loggedInContext";
import PokemonCarousel from "../components/pokemon/carousel/PokemonCarousel";
const MisPokemons = ({ onFinish, isView = true, onUpdate, onUpdateStart, disabled = false ,isCombat = false}) => {
    const { getMaxLevel } = useContext(loggedInContext);
    const { misPokemons, swapPokemons, removePokemon, getMisPokemons } = useContext(PokemonContext);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [pcPokemons, setPcPokemons] = useState([]);
    const [waitingOrDisabled, setWaitingOrDisabled] = useState(disabled);
    useEffect(() => {
        getMisPokemons();
        handleGetPc();

    }, []);
    useEffect(() => {
        setWaitingOrDisabled(disabled);
    }, [disabled]);

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
        if (waitingOrDisabled) {
            return;
        }
        if (selectedPokemon === null) {
            setSelectedPokemon(pokemon);
            return;
        }

        setSelectedPokemon(null);
        setWaitingOrDisabled(true);
        if (!isView) {
            if (selectedPokemon._id === pokemon._id) {
                if (pokemon.hp === 0) {
                    setWaitingOrDisabled(false);
                    return;
                }
                onUpdateStart && onUpdateStart();
                await swapPokemons(pokemon._id, misPokemons[0]._id)
                onUpdate(misPokemons[0]);
            }
            else {

                await swapPokemons(selectedPokemon._id, pokemon._id);


            }
            setWaitingOrDisabled(false);
            return;
        }
        else if (selectedPokemon._id === pokemon._id) {
            const pcPokemonsIndex = pcPokemons.findIndex((pokemon) => pokemon._id === selectedPokemon._id);
            if (pcPokemonsIndex !== -1) {
                const { error, savedPokemons } = await removeFromPc(selectedPokemon);
                if (error) {
                    console.log(error);
                    setWaitingOrDisabled(false);
                    return;
                }
                setPcPokemons(savedPokemons);
                await getMisPokemons();
                setWaitingOrDisabled(false);
                return;
            }
        }

        const data = await swapPokemons(selectedPokemon._id, pokemon._id);
        if (data) {
            setPcPokemons(data.savedPokemons);
        }
        setWaitingOrDisabled(false);

    }
    const handleFreePokemon = async (e, pokemon) => {
        e.stopPropagation();
        if (confirm(`¿Estás seguro de que quieres soltar a ${pokemon.name}?`)) {
            await removePokemon(pokemon)
        }
    }
    const handleSaveToPc = async (e, pokemon) => {
        e.stopPropagation();
        setWaitingOrDisabled(true);
        const { error, savedPokemons } = await saveToPc(pokemon);
        if (error) {
            alert(error);
            console.log(error);
            setWaitingOrDisabled(false);
            return;
        }
        setPcPokemons(savedPokemons);
        await removePokemon(pokemon, false);
        setWaitingOrDisabled(false);
    }

    let filteredPokemons = misPokemons
    if (!isView) {
        filteredPokemons = filteredPokemons.filter((pokemon) => pokemon._id !== misPokemons[0]._id);
    }
    const getPokemonManagementButtons = (pokemon) => {
        console.log("manage pokemon",pokemon);
        if (isView) {
            return (
                <section className="pokemon-buttons">
                    <button onClick={(e) => handleSaveToPc(e, pokemon)}>Guardar en el PC</button>
                    <button onClick={(e) => handleFreePokemon(e, pokemon)}>Soltar</button>
                </section>
            )
        }
        return null;
    }
   
    return (
        <div className={"mis-pokemons" + (isView ? " view" : "")}>
            {misPokemons.length !== 1 &&
                <section className="pokemons--title">
                    <h2>Mis pokemons</h2>
                    <p>{misPokemons.length} / 6</p>
                    <p>Nivel máximo:{getMaxLevel()}</p>
                </section>
            }
            <PokemonCarousel
                pokemons={filteredPokemons}
                onSelect={handlePokemonClick}
                selected={selectedPokemon}
                disabled={waitingOrDisabled}
                isView={isView}
                fullInfo={isView}
                isCombat={isCombat}
                children={getPokemonManagementButtons}
                className={"pokemon-container" + (isCombat ? " combat" : "")}
            />
            
            {isView &&
                <section className="pc-pokemons">
                    <section className="pokemons--title">
                        <h2>PC</h2>
                        <p>{pcPokemons.length} / 30</p>
                    </section>
                    <section className="pc-pokemons">
                        <PokemonCarousel
                            pokemons={pcPokemons}
                            onSelect={handlePokemonClick}
                            selected={selectedPokemon}
                            disabled={waitingOrDisabled}
                            isView={isView}
                            showHp={false}
                            isCombat={isCombat}
                        />
                        
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
