import { useState,useEffect } from 'react'
import Pokemon from './components/PokemonComponent';
import './App.css'
import gameStates from './utils/gameStates';

function App() {
  const [pokemonList,setPokemonList] = useState([]);
  const [error,setError] = useState("");
  const [pokemonData,setPokemonData] = useState([]);
  const [currentUrl,setCurrentUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [nextUrl,setNextUrl] = useState(null);
  const [previousUrl,setPreviousUrl] =useState(null);
  const [currentGameState,setCurrentGameState] = useState("choose");

  useEffect(()=>{
    setPokemonData([]);
    getPokemons();
  },[currentUrl]);

  useEffect(()=>{
    if(pokemonList.length > 0){
      getPokemonData();
    }
  },[pokemonList])


  const getPokemonData = async() =>{
    try{
      const data = await Promise.all(
        pokemonList.map(async(pokemon) =>{
          const pokemonData = await fetch(pokemon.url);
          const result = await pokemonData.json();
          return result;
        })
      );
      console.log(data);
      setPokemonData(data);
    }
    catch (e){
      setError("Algo ha salido mal...");
    }

  }

  const getPokemons = async()=> {
    try{
      const data = await fetch(currentUrl);
      const results = await data.json();
      console.log(results);
      setNextUrl(results.next);
      setPreviousUrl(results.previous);
      setPokemonList(results.results);
    }
    catch (e){
      setError("Algo salió mal...");
      console.error(e);
    }
  }
  const goToNext = ()=>{
    setCurrentUrl(nextUrl);
  }
  const goToPrevious = ()=>{
    setCurrentUrl(previousUrl);
  }
  const handleStateChange = (newState) =>{
    setCurrentGameState(newState);
  }
  const GameStateComponent = gameStates[currentGameState].component;
  return (
    <>
      <h1>Welcome to Reactmon</h1>
      <p className="error">{error}</p>
      <GameStateComponent onFinish={handleStateChange}/>
      
      {pokemonData.length !== 0 && previousUrl && <button onClick={goToPrevious}>Previous</button>}
      {pokemonData.length !== 0 && nextUrl && <button onClick={goToNext}>Next</button>}
      {pokemonData.length === 0 && 
      <p>Loading data...</p>
      }
      <section className="pokemon-container">
        {pokemonData.map((pokemon)=>(
          <Pokemon key={pokemon.id} data={pokemon} />
        ))}
      </section>


    </>
  )
}

export default App
