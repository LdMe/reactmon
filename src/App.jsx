import { useState, useEffect, useReducer, useRef } from 'react'
import './App.css'
import gameStates from './utils/gameStates';
import PokemonContext from './context/pokemonContext';
import loggedInContext from './context/loggedInContext';
import dialogContext from './context/dialogContext';
import misPokemonsReducer from './reducers/MispokemonsReducer';
import { addPokemon,  healPokemons, addLevel, swapPokemons, removePokemon, getPokemons } from './utils/fetchPokemons';

import socket from './utils/socket';
import SocketContext from './context/socketContext';

function App() {

  const [error, setError] = useState("");
  const [currentGameState, setCurrentGameState] = useState("map");
  const [hardcoreMode, setHardcoreMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [misPokemons, dispatch] = useReducer(misPokemonsReducer, []);
  const scrollRef = useRef(null);


  useEffect(() => {
    setIsLoaded(false);
    getMisPokemons();
    if (isLogged) {
      socket.connect();
      socket.emit("login", {username:getUserName()});
    }
  }, [isLogged]);

  useEffect(() => {
    if (misPokemons.length !== 0 && misPokemons.filter((pokemon) => pokemon.hp > 0).length === 0) {
      setCurrentGameState("heal");
    }
    if (misPokemons.length === 0 && isLogged && isLoaded) {
      setCurrentGameState("choose");
    }
    scrollRef.current.scrollIntoView({ behavior: "smooth" });

  }, [currentGameState, isLoaded]);


  const getMisPokemons = async () => {
    try {
      const [error, pokemons] = await getPokemons();
      if (error) {
        setError(error.message);
        if (error.status === 401) {
          setCurrentGameState("logout");
          setIsLogged(false);
          return [];
        }
        return [];
      }
      dispatch({ type: "set", payload: pokemons });
      setIsLogged(true);
      setIsLoaded(true);
      if (pokemons.length === 0) {
        setCurrentGameState("choose");
        return [];
      }
      return pokemons;

    }
    catch (error) {
      console.error("error", error);
      setError(error.message);
      return [];
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
    dispatch({ type: "remove", payload: pokemonId });
    const data = await removePokemon(pokemonId);
    if (!data) {
      return null;
    }
    dispatch({ type: "set", payload: data.pokemons });
    return data.pokemons;
  }
  const handleUpdatePokemon = async (newPokemon) => {
    dispatch({ type: "update", payload: newPokemon });

    const [error, pokemons] = await getPokemons();
    if (error) {
      setError(error.message);
      if (error.status === 401) {
        setCurrentGameState("logout");
        setIsLogged(false);
        return null;
      }
      return null;
    }
    if (newPokemon.hp === 0) {
      await handleAlivePokemons(pokemons);
      return newPokemon;
    }

    return newPokemon;
  }
  

  const handleAddLevel = async (pokemon) => {
    const response = await addLevel(pokemon);
    if (!response) {
      return null;
    }
    dispatch({ type: "update", payload: response });
    return response;
  }
  
  const handleSwapPokemons = async (id1, id2) => {
    if (id1 === id2) {
      return null;
    }
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
    if (alivePokemons.length === 0) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          if (hardcoreMode) {
            alert("Has perdido todos tus pokemons");
            //
            handleStateChange("choose");
          }
          else {
            alert("Tus pokemons se han desmayado");
            //await handleSetPokemons(pokemons);
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
    updatePokemon: handleUpdatePokemon,
    addLevel: handleAddLevel,
    swapPokemons: handleSwapPokemons,
    healPokemons: handleHealPokemons,
    getMisPokemons,
  }
  const login = (username) => {
    setIsLogged(true);
    setUsername(username);
    localStorage.setItem("username", username);
  }
  const logout = () => {
    setIsLogged(false);
    setUsername("");
  }
  const getUserName = () => {
    let user = username || localStorage.getItem("username");
    if (!user) {
      user = "";
    }
    return user;
  }
  const loggedInContextValue = {
    isLogged,
    login,
    logout,
    getUserName
  }

  const GameStateComponent = gameStates[currentGameState].component;
  return (
    <div className={`App ${currentGameState}`} >
      <loggedInContext.Provider value={loggedInContextValue}>
        <SocketContext.Provider value={socket}>
          <PokemonContext.Provider value={pokemonContextValue}>
            <div ref={scrollRef} />
            <img className="title-image" src='/reactmon.png' alt="titulo" />
            {/* <p className="error">{error}</p> */}
            <GameStateComponent onFinish={handleStateChange} />
          </ PokemonContext.Provider>
        </SocketContext.Provider>
      </loggedInContext.Provider>
    </div>
  )
}

export default App
