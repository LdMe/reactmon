import { useState, useEffect, useContext, useCallback } from 'react';

import { getTemplatePokemons } from '../../utils/fetchPokemons';
import loggedInContext from '../../context/loggedInContext';
import PokemonCarousel from '../pokemon/carousel/PokemonCarousel';
import TypeSelector from '../types/TypeSelector';
import Pokemon from '../pokemon/PokemonComponent';
const Pokedex = ({ onFinish }) => {

    const [templatePokemons, setTemplatePokemons] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [filterTypes, setFilterTypes] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { user } = useContext(loggedInContext);
    useEffect(() => {
        getPokemons();
    }, []);

    const getPokemons = async () => {
        const seenPokemons = user.seenPokemons;
        console.log("seenPokemons", seenPokemons);
        const pokemons = await getTemplatePokemons(seenPokemons);
        console.log("pokemons", pokemons);
        if (pokemons.length > 0) {
            setTemplatePokemons(pokemons);
            setLoaded(true);
        }
    };
    const handleChangeFilterTypes = (types) => {
        setFilterTypes(types);
    }
    const isCaptured = (pokemon) => {
        return user.capturedPokemons.includes(parseInt(pokemon.id));
    }
    const getPokeball = (pokemon) => {
        if (isCaptured(pokemon)) {
            return <img className={"pokeball-button"} src="/pokeball.svg" alt="capturado" title='capturado' />
        }
        return <img className={"pokeball-button disabled"} src="/pokeball.svg" alt="no capturado" title='no capturado' />
    }
    const filteredPokemons = templatePokemons.filter((pokemon) => {
        if (filterTypes.length === 0) {
            return true;
        }
        console.log("type", pokemon.types)
        return filterTypes.some((type) => pokemon.types.includes(type.name));
    })
    const selectedPokeball = selectedPokemon && getPokeball(selectedPokemon);
    return (
        <div className="pokedex">

            <TypeSelector onChange={handleChangeFilterTypes} selectedTypes={filterTypes} />
            {
                loaded
                    ? <PokemonCarousel
                        pokemons={filteredPokemons}
                        showHp={false}
                        children={getPokeball}
                        onSelect={setSelectedPokemon}
                    />
                    : <h1>Cargando pokemons...</h1>
            }
            {selectedPokemon &&
                <Pokemon
                    data={selectedPokemon}
                    onFinish={onFinish}
                    isView={true}
                    isCombat={true}
                    fullInfo={true}
                    showHp={false}
                    children={selectedPokeball}
                />
            }
            <section className="pokemon-buttons button-footer">
                <button onClick={() => onFinish("map")}>Volver</button>
            </section>
        </div>
    )
}

export default Pokedex
