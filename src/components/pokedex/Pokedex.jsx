import { useState, useEffect, useContext, useCallback } from 'react';

import { getTemplatePokemons } from '../../utils/fetchPokemons';
import pokemonContext from '../../context/pokemonContext';
import PokemonCarousel from '../pokemon/carousel/PokemonCarousel';
import TypeSelector from '../types/TypeSelector';
import Pokemon from '../pokemon/PokemonComponent';

import "./Pokedex.scss";
const Pokedex = ({ onFinish }) => {

    const [templatePokemons, setTemplatePokemons] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [filterTypes, setFilterTypes] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { seenPokemons,capturedPokemons } = useContext(pokemonContext);
    useEffect(() => {
        getPokemons();
    }, []);

    const getPokemons = async () => {
        console.log("seenPokemons", seenPokemons);
        const pokemons = await getTemplatePokemons(seenPokemons);
        console.log("pokemons", pokemons);
        if (pokemons.length > 0) {
            setTemplatePokemons(pokemons);
            setLoaded(true);
        }
    };
    const handleChangeFilterTypes = (types) => {
        setSelectedPokemon(null);
        setFilterTypes(types);
    }
    const isCaptured = (pokemon) => {
        return capturedPokemons.includes(parseInt(pokemon.id));
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
        const typeNames = pokemon.types.map((type) => type.name || type);
        return filterTypes.some((type) => typeNames.includes(type.name));
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
                    defaultClassName='full-size'
                />
            }
            <section className="pokemon-buttons button-footer">
                <button onClick={() => onFinish("map")}>Volver</button>
            </section>
        </div>
    )
}

export default Pokedex
