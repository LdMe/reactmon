import { useState, useEffect, useContext } from "react";
import Pokemon from "../components/PokemonComponent";
import PokemonContext from "../context/pokemonContext";
import { addPokemon as addPokemonToUser, getStarters} from "../utils/fetchPokemons";
import Logout from "../components/Logout";

const ChoosePokemon = ({ idList = [1, 4, 7], onFinish }) => {
    const [pokemonList, setPokemonList] = useState([]);
    const [error, setError] = useState(null);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const { misPokemons, addPokemon } = useContext(PokemonContext);
    useEffect(() => {
        getPokemons();
    }, []);

    const getPokemons = async () => {
        const [error,starters] = await getStarters();
        if (error) {
            setError(error.message);
            return;
        }
        setPokemonList(starters);
    }
    const choosePokemon = async (pokemon) => {
        if (selectedPokemon !== null) {
            return;
        }
        setSelectedPokemon(pokemon);
        const data = await addPokemonToUser(pokemon);
        if (!data) {
            alert("No se ha podido añadir el pokemon");
            return;
        }

        const result = await addPokemon(pokemon);
        if (result) {
            alert("Has elegido a " + pokemon.name + " como tu pokemon inicial, cuidalo bien");
        }
        else {
            alert("No se ha podido añadir el pokemon");
            setSelectedPokemon(null);
        }
    }
    const handleSelectPokemon = async (pokemon) => {

        if (misPokemons.length < 6) {
            await choosePokemon(pokemon);
        }
        else {
            alert("Profesor Oak: ya tienes 6 pokemons, no te pases chaval")
        }
        onFinish("map");
    }

    const pokemonComponents = pokemonList.map((pokemon) => {
        return <Pokemon
            key={pokemon.id}
            data={pokemon}
            onClick={() => handleSelectPokemon(pokemon)}
            isCombat={false}
        />
    })

    return (
        <section className="choose-pokemon">
            <div>
                <h2>Elige tu pokemon</h2>
                <img src="/oak.png" alt="profesor oak" />

            </div>
            <div>
            <section className="pokemon-container">
                {pokemonComponents}
            </section>
            </div>
        </section>
    )
}

export default ChoosePokemon;