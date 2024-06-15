import { useState, useEffect, useContext, useRef } from 'react';

import Trainers from '../trainer/Trainers';
import TrainerCreator from '../trainer/TrainerCreator';
import TypeSelector from '../types/TypeSelector';
import { getGyms, createGym, updateGym } from '../../utils/fetchPokemons';
import "./Gym.css";

const GymEditor = ({ onFinish, originalGym = null }) => {
    const [gymId, setGymId] = useState(originalGym ? originalGym._id : null);
    const [gymName, setGymName] = useState(originalGym ? originalGym.name : "");
    const [maxLevel, setMaxLevel] = useState(originalGym ? originalGym.maxLevel : 5);
    const [trainers, setTrainers] = useState(originalGym ? originalGym.trainers.filter((t) => t) : []);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [types, setTypes] = useState(originalGym ? originalGym.types : []);

    const handleCreateGym = async () => {
        const gymData = {
            name: gymName,
            maxLevel,
            trainers,
            types
        }
        console.log("gymData", gymData);
        let data = null;
        if (gymId !== null) {
            gymData._id = gymId;
            data = await updateGym(gymData);
        }
        else {
            data = await createGym(gymData);
        }
        console.log("data", data)
        if (data.error) {
            alert(data.error);
            return;
        }
        setGymId(data._id);
        if (gymId !== null) {
            alert("Gimnasio actualizado correctamente");
            return;
        }
        alert("Gimnasio creado correctamente");
    }
    const handleAddTrainer = (trainer) => {
        if(selectedTrainer) {
            const oldTrainer = trainers.find(t => t._id === selectedTrainer._id);
            const filteredTrainers = trainers.filter(t => t !== selectedTrainer);
            setSelectedTrainer(null);
            setTrainers([...filteredTrainers, trainer]);
            return;
        }
        setTrainers([...trainers, trainer]);
    }
    const onDeleteTrainer = (trainer) => {
        const filteredTrainers = trainers.filter(t => t !== trainer);
        setTrainers(filteredTrainers);
    }
    const onSelectTrainer = (trainer) => {
        setSelectedTrainer(trainer);
    }
    return (
        <div className="gym">
            <TypeSelector onChange={(types) => setTypes(types)} selectedTypes={types}/>
            {/* <PokemonSelector
                onFinish={handleAddPokemon}
                types={types}
            /> */}
            <h2>Gimnasio {gymName}</h2>
            <label htmlFor="gymName">Nombre del gimnasio</label>
            <input type="text" placeholder="Nombre del gimnasio" value={gymName} onChange={(e) => setGymName(e.target.value)} />
            <label htmlFor="maxLevel">Nivel máximo</label>
            <input type="number" placeholder="Nivel máximo" value={maxLevel || 5} onChange={(e) => setMaxLevel(e.target.value)} min={1} max={100} />
            <h3>Entrenadores</h3>
            <TrainerCreator  onFinish={handleAddTrainer} types={types} oldTrainer={selectedTrainer} onClose={() => setSelectedTrainer(null)}/>
            <Trainers trainers={trainers} onSelect={onSelectTrainer} onDelete={onDeleteTrainer}/>
            <section className="pokemon-buttons button-footer">
                <button onClick={handleCreateGym}>Guardar</button>
                <button onClick={() => onFinish("map")}>Volver</button>
            </section>
        </div>
    )
}

export default GymEditor;