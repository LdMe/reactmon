import { useState, useEffect, useReducer, useRef } from 'react'
import './App.css'
import gameStates from './utils/gameStates';
import PokemonContext from './context/pokemonContext';
import loggedInContext from './context/loggedInContext';
import dialogContext from './context/dialogContext';
import misPokemonsReducer from './reducers/MispokemonsReducer';
import { addPokemon, savePokemons, healPokemons, addLevel, swapPokemons, removePokemon, getPokemons } from './utils/fetchPokemons';


function App() {

  const [error, setError] = useState("");
  const [currentGameState, setCurrentGameState] = useState("map");
  const [hardcoreMode, setHardcoreMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [misPokemons, dispatch] = useReducer(misPokemonsReducer, []);

  useEffect(() => {
    setIsLoaded(false);
    getMisPokemons();

  }, [isLogged]);

  useEffect(() => {
    if (misPokemons.length !== 0 && misPokemons.filter((pokemon) => pokemon.hp > 0).length === 0) {
      setCurrentGameState("heal");
    }
    if (misPokemons.length === 0 && isLogged && isLoaded) {
      setCurrentGameState("choose");
    }

  }, [currentGameState, isLoaded]);


  const getMisPokemons = async () => {
    try {
      const [error, pokemons] = await getPokemons();
      if (error) {
        setError(error.message);
        if (error.status === 401) {
          setCurrentGameState("logout");
          setIsLogged(false);
          return;
        }
        return;
      }
      dispatch({ type: "set", payload: pokemons });
      setIsLogged(true);
      setIsLoaded(true);
      if (pokemons.length === 0) {
        setCurrentGameState("choose");
        return;
      }

    }
    catch (error) {
      console.log("error", error);
      setError(error.message);
    }


  }
  const handleStateChange = (newState) => {
    setCurrentGameState(newState);
  }
  const handleAddPokemon = async (newPokemon) => {
    const data = await addPokemon(newPokemon);
    if (!data) {
      return null;
    }
    const pokemon = data.pokemons[data.pokemons.length - 1];
    dispatch({ type: "add", payload: pokemon });
    return pokemon;
  }
  const handleRemovePokemon = async (pokemonId) => {
    const data = await removePokemon(pokemonId);
    if (!data) {
      return null;
    }
    dispatch({ type: "set", payload: data.pokemons });
    return data.pokemons;
  }
  const handleUpdatePokemon = async (newPokemon) => {
    const [error, pokemons] = await getPokemons();
    if (!pokemons || pokemons.length === 0) {
      return null;
    }
    if (pokemons[0].hp === 0) {
      dispatch({ type: "update", payload: newPokemon });
      await handleAlivePokemons(pokemons);
    }
    else {
      dispatch({ type: "update", payload: newPokemon });

    }
    return newPokemon;

  }

  const handleAddLevel = async (pokemon) => {
    console.log("addLevel345", pokemon);
    const response = await addLevel(pokemon);
    console.log("addLevel", response);
    if (!response) {
      return null;
    }
    dispatch({ type: "update", payload: response });
    return response;
  }
  const handleSetPokemons = async (newPokemons) => {
    for (const pokemon of newPokemons) {
      console.log("pokemon", pokemon);
    }
    const data = await savePokemons(newPokemons);
    console.log("data", data)
    if (!data) {
      return null;
    }
    dispatch({ type: "set", payload: data.pokemons });
    return data.pokemons;
  }
  const handleSwapPokemons = async (id1, id2) => {
    const data = await swapPokemons(id1, id2);
    if (!data) {
      return null;
    }
    dispatch({ type: "set", payload: data.pokemons });
    return data.pokemons;
  }
  const handleHealPokemons = async () => {
    const data = await healPokemons();
    if (!data) {
      return null;
    }
    dispatch({ type: "set", payload: data.pokemons });
    return data.pokemons;
  }

  const handleAlivePokemons = async (pokemons) => {
    const alivePokemons = pokemons.filter((pokemon) => pokemon.hp > 0);
    console.log("alivePokemons", alivePokemons);
    if (alivePokemons.length === 0) {
      return new Promise( (resolve) => {
        setTimeout(async () => {
        if (hardcoreMode) {
          alert("Has perdido todos tus pokemons");
          await handleSetPokemons([]);
          handleStateChange("choose");
        }
        else {
          alert("Tus pokemons se han desmayado");
          await handleSetPokemons(pokemons);
          handleStateChange("heal");
        }
        resolve(null);
      }, 1000);
    });
    }
    else {
      const firstAlivePokemon = alivePokemons[0];
      const firstPokemon = pokemons[0];
      if (firstAlivePokemon._id !== firstPokemon._id) {
        return new Promise((resolve) => {
          setTimeout(async () => {
            await handleSwapPokemons(firstAlivePokemon._id, firstPokemon._id);
            resolve(null);
          }, 1000);
        });
      }
      return null;
    }

  }


  const pokemonContextValue = {
    misPokemons: misPokemons,
    addPokemon: handleAddPokemon,
    removePokemon: handleRemovePokemon,
    setMisPokemons: handleSetPokemons,
    updatePokemon: handleUpdatePokemon,
    addLevel: handleAddLevel,
    swapPokemons: handleSwapPokemons,
    healPokemons: handleHealPokemons,
    getMisPokemons,
  }

  const GameStateComponent = gameStates[currentGameState].component;
  return (
    <loggedInContext.Provider value={{ isLogged, setIsLogged }}>
      <PokemonContext.Provider value={pokemonContextValue}>
        <img className="title-image" src='/reactmon.png' alt="titulo" />
        <p className="error">{error}</p>
        <GameStateComponent onFinish={handleStateChange} />
      </ PokemonContext.Provider>
    </loggedInContext.Provider>
  )
}

export default App
