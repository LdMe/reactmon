import { useState, useEffect, useReducer } from 'react'
import './App.css'
import gameStates from './utils/gameStates';
import PokemonContext from './context/pokemonContext';
import loggedInContext from './context/loggedInContext.js';
import misPokemonsReducer from './reducers/MispokemonsReducer.js';
import { addPokemon, savePokemons, healPokemons, addLevel, swapPokemons, removePokemon, getPokemons } from './utils/fetchPokemons.js';


function App() {

  const [error, setError] = useState("");
  const [currentGameState, setCurrentGameState] = useState("map");
  const [hardcoreMode, setHardcoreMode] = useState(false);
  const [misPokemons, dispatch] = useReducer(misPokemonsReducer, []);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

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
    if (currentGameState === "login") {
      setIsLoaded(true);
    }

  }, [currentGameState, isLoaded]);


  const getMisPokemons = async () => {
    try {
      const [error, pokemons] = await getPokemons();
      if (error) {
        setError(error.message);
        if (error.status === 401) {
          setCurrentGameState("login");
          setIsLogged(false);
          return;
        }
        return;
      }
      setIsLogged(true);
      if (pokemons.length === 0) {
        setCurrentGameState("choose");
        return;
      }
      dispatch({ type: "set", payload: pokemons });
    }
    catch (error) {
      console.log("error", error);
      setError(error.message);
    }
    setIsLoaded(true);

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
      handleAlivePokemons(pokemons);
    }
    else {
      dispatch({ type: "update", payload: newPokemon });
    }

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

  const handleAlivePokemons = (pokemons) => {
    /*
    si hay algun pokemon vivo, cambiamos el primer pokemon por el primero vivo
    si no hay ninguno vivo, acabamos el juego y vamos a "heal" o a "choose" en caso de que esté en modo hardcore
    */
    const alivePokemons = pokemons.filter((pokemon) => pokemon.hp > 0);
    console.log("alivePokemons", alivePokemons);
    if (alivePokemons.length === 0) {
      if (hardcoreMode) {
        handleSetPokemons([]);
        handleStateChange("choose");
      }
      else {
        handleSetPokemons(pokemons);
        handleStateChange("heal");
      }
    }
    else {
      const firstAlivePokemon = alivePokemons[0];
      const firstPokemon = pokemons[0];
      if (firstAlivePokemon._id !== firstPokemon._id) {
        handleSwapPokemons(firstAlivePokemon._id, firstPokemon._id);
      }
    }

  }


  const pokemonContextValue = {
    misPokemons,
    addPokemon: handleAddPokemon,
    removePokemon: handleRemovePokemon,
    setMisPokemons: handleSetPokemons,
    updatePokemon: handleUpdatePokemon,
    addLevel: handleAddLevel,
    swapPokemons: handleSwapPokemons,
    healPokemons: handleHealPokemons
  }

  const GameStateComponent = gameStates[currentGameState].component;
  return (
    <loggedInContext.Provider value={{ isLogged,setIsLogged }}>
      <PokemonContext.Provider value={pokemonContextValue}>
        <img className="title-image" src='/reactmon.png' alt="titulo" />
        <p className="error">{error}</p>
        <GameStateComponent onFinish={handleStateChange} />
      </ PokemonContext.Provider>
    </loggedInContext.Provider>
  )
}

export default App
