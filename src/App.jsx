import { useState,useEffect } from 'react'
import Pokemon from './components/PokemonComponent';
import './App.css'
import gameStates from './utils/gameStates';
import { getPokemons } from './utils/savePokemons';
import PokemonContext from './context/pokemonContext';

function App() {
  
  const [error,setError] = useState("");
  const [currentGameState,setCurrentGameState] = useState("map");
  const [misPokemons,setMisPokemons] = useState(getPokemons());

  useEffect(()=>{
    if(misPokemons.length ===0){
      setCurrentGameState("choose");
    }
  },[misPokemons]);

  const handleStateChange = (newState) =>{
    setCurrentGameState(newState);
  }
  const GameStateComponent = gameStates[currentGameState].component;
  return (
    <PokemonContext.Provider value={{misPokemons,setMisPokemons}}>
      <img src='/reactmon.png' alt="titulo" />
      <p className="error">{error}</p>
      <GameStateComponent onFinish={handleStateChange}/>
    </ PokemonContext.Provider>
  )
}

export default App
