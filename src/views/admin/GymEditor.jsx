import { useState, useEffect, useContext, useRef } from 'react';

import PokemonSelector from '../../components/pokemon/PokemonSelector';
import {getGyms,createGym,updateGym}  from '../../utils/fetchPokemons';

const GymEditor = ({ onFinish, originalGym = null }) => {
    const [gymId, setGymId] = useState(null);
    const [gymName, setGymName] = useState("");
    const [maxLevel, setMaxLevel] = useState(5);
    const [leaderPokemons, setLeaderPokemons] = useState([]);
    const handleAddPokemon = (pokemon) => {
        if(leaderPokemons.length >= 6){
            alert("No puede haber más de 6 pokemons");
            return;
        }
        const newPokemonString = JSON.stringify(pokemon);
        const newPokemon = JSON.parse(newPokemonString); 
        newPokemon.level = maxLevel || 5;
        setLeaderPokemons([...leaderPokemons, newPokemon]);
    }
    const handleSetGym = (gym) => {
        setGymName(gym.name);
        setMaxLevel(gym.maxLevel);
        setLeaderPokemons(gym.leaderPokemons);
    }
    const handleRemovePokemon = (index) => {
        const newPokemons = [...leaderPokemons];
        newPokemons.splice(index, 1);
        setLeaderPokemons(newPokemons);
    }
    const handlePokemonLevelChange = (index, level) => {
        console.log("index", index, "level", level)
        if(level < 1 || level > 100){
            return;
        }
        const newPokemons = [...leaderPokemons];
        newPokemons[index].level = level;
        setLeaderPokemons(newPokemons);
    }
    const handleCreateGym = async () => {  
        const gymData = {
            name: gymName,
            maxLevel,
            leaderPokemons
        }
        console.log("gymData", gymData);
        let data = null;
        if(gymId !== null){
            gymData._id = gymId;
            data = await updateGym( gymData);
        }
        else{
            data = await createGym(gymData);
        }
        console.log("data", data)
        if(data.error){
            alert(data.error);
            return;
        }
        setGymId(data._id);
        if(gymId !== null){
            alert("Gimnasio actualizado correctamente");
            return;
        }
        alert("Gimnasio creado correctamente");
    }
    return (
        <>
            <PokemonSelector
                onFinish={handleAddPokemon}
            />
            <h2>Gimnasio {gymName}</h2>
            <label htmlFor="gymName">Nombre del gimnasio</label>
            <input type="text" placeholder="Nombre del gimnasio" value={gymName} onChange={(e) => setGymName(e.target.value)} />
            <label htmlFor="maxLevel">Nivel máximo</label>
            <input type="number" placeholder="Nivel máximo" value={maxLevel || 5} onChange={(e) => setMaxLevel(e.target.value)}  min={1} max={100}/>
            <h3>Pokemons</h3>
            {leaderPokemons.map((pokemon,index) => (
                <article key={index}>
                    <h3>{pokemon.name}</h3>
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    <label htmlFor="level">Nivel</label>
                    <input type="number" placeholder="Nivel"
                        value={pokemon.level || 5}
                        onChange={(e) => handlePokemonLevelChange(index, e.target.value)}
                        min={1}
                        max={100}
                    />
                    <button onClick={() => handleRemovePokemon(index)}>Eliminar</button>
                </article>
            ))}
            <section className="pokemon-buttons button-footer">
                <button onClick={handleCreateGym}>Guardar</button>
                <button onClick={() => onFinish("map")}>Volver</button>
            </section>
        </>
    )
}

export default GymEditor;