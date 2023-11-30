import { useState,useEffect } from 'react'
import Pokemon from './components/PokemonComponent';
import './App.css'
import gameStates from './utils/gameStates';
import { getPokemons,savePokemons } from './utils/savePokemons';
import PokemonContext from './context/pokemonContext';
import { changeToNextAlivePokemon,getAlivePokemons } from './utils/misPokemons';

function App() {
  
  const [error,setError] = useState("");
  const [currentGameState,setCurrentGameState] = useState("map");
  const [misPokemons,setMisPokemons] = useState(getPokemons());
  const [hardcoreMode,setHardcoreMode] = useState(true);

  useEffect(()=>{
    if(misPokemons.length ===0){
      setCurrentGameState("choose");
    }
  },[misPokemons]);

  const setAndSaveMisPokemons = (newPokemons) =>{

    const pokemons = handlePokemonChange(newPokemons)
  if(!hardcoreMode && getAlivePokemons(pokemons).length === 0){
    setCurrentGameState("heal");
    return;
  }
    setMisPokemons(misPokemons =>pokemons);
    savePokemons(pokemons);
  }


  const handlePokemonChange = (newPokemons) =>{
    if(newPokemons.length === 0){
      setError("No tienes pokemons");
      setCurrentGameState("choose");
      return newPokemons;
    }
    const newPokemon = newPokemons[0];
    if(newPokemon.hp === 0){
      const alivePokemons = getAlivePokemons(newPokemons);
      if(alivePokemons.length === 0){
        setError("No tienes pokemons vivos");

        setCurrentGameState("choose");
        const newMisPokemons = changeToNextAlivePokemon(newPokemons,hardcoreMode);
        return newMisPokemons;
      }
      else{
        const newMisPokemons = changeToNextAlivePokemon(newPokemons,hardcoreMode);
        return newMisPokemons;
        
      }
    }
    return newPokemons;
  }

  const handleStateChange = (newState) =>{
    setCurrentGameState(newState);
  }
  const GameStateComponent = gameStates[currentGameState].component;
  return (
    <PokemonContext.Provider value={{misPokemons,setMisPokemons:setAndSaveMisPokemons}}>
      <img src='/reactmon.png' alt="titulo" />
      <p className="error">{error}</p>
      <GameStateComponent onFinish={handleStateChange}/>
    </ PokemonContext.Provider>
  )
}

export default App
