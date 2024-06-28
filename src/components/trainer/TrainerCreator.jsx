import { useEffect, useState } from "react"
import Modal from "../modal/Modal";
import PokemonSelector from '../pokemon/PokemonSelector';
import PokemonComponent from '../pokemon/PokemonComponent';

import './Trainer.css';

const trainerCreator = ({ onFinish,types,onClose=null,oldTrainer = null }) => {
    const [name, setName] = useState(oldTrainer?.name || "");
    const [pokemons, setPokemons] = useState(oldTrainer?.pokemons || []);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (oldTrainer) {
            setName(oldTrainer.name);
            setPokemons(oldTrainer.pokemons);
            setIsOpen(true);
        }
        else {
            setName("");
            setPokemons([]);
        }
    }, [oldTrainer]);
    const handleAddPokemon = (pokemon) => {
        if (pokemons.length >= 6) {
            alert("No puede haber más de 6 pokemons");
            return;
        }
        const newPokemonString = JSON.stringify(pokemon);
        const newPokemon = JSON.parse(newPokemonString);
        newPokemon.level = 5;
        setPokemons([...pokemons, newPokemon]);
    }

    const handleCreateTrainer = async () => {
        const cleanPokemons = pokemons.map((pokemon) => {
            return {
                _id : pokemon._id,
                id : pokemon.id,
                level : pokemon.level,
                sprites: pokemon.sprites,
                name: pokemon.name,
                types: pokemon.types
            }
        })
        const trainerData = {
            name,
            pokemons:cleanPokemons

        }
        setIsOpen(false);
        onFinish(trainerData);
    }
    const handlePokemonLevelChange = (index, level) => {
        console.log("index", index, "level", level)
        if (level < 1 || level > 100) {
            return;
        }
        const newPokemons = [...pokemons];
        newPokemons[index].level = level;
        setPokemons(newPokemons);
    }
    const handleRemovePokemon = (index) => {
        const newPokemons = [...pokemons];
        newPokemons.splice(index, 1);
        setPokemons(newPokemons);
    }
    const handleClose = () => {
        setIsOpen(false);
        console.log("onClose", onClose);
        onClose && onClose();
    }
    return (
        <div className="trainer-creator">
            <button onClick={() => setIsOpen(true)}>Crear Entrenador</button>
            <section className="trainer-creator__form" style={{ display: isOpen ? "block" : "none" }}>
                <Modal onClose={handleClose}>
                    <h1>{oldTrainer ? "Actualizar" : "Crear"} Entrenador</h1>
                    <label htmlFor="name" >Nombre</label>
                    <input type="text" name="name" id="name" placeholder="Nombre" value={name} onChange={(event) => setName(event.target.value)} />
                    <h2>Pokemons</h2>
                    <PokemonSelector onFinish={handleAddPokemon} types={types} />
                    <section className="selected-pokemons">
                        {pokemons.map((pokemon, index) => (
                            <article className="pokemon-card pokemon-card--with-level" key={index}>
                                <PokemonComponent
                                    data={pokemon}
                                />
                                <section className="trainer-pokemon-level">
                                <label htmlFor="level">Nivel</label>
                                <input type="number" placeholder="Nivel"
                                    value={pokemon.level || 5}
                                    onChange={(e) => handlePokemonLevelChange(index, e.target.value)}
                                    min={1}
                                    max={100}
                                />
                                </section>
                                <button onClick={() => handleRemovePokemon(index)}>Eliminar</button>
                            </article>
                        ))}
                    </section>
                    <button onClick={handleCreateTrainer}>{oldTrainer ? "Actualizar" : "Crear"}</button>
                </Modal>
            </section>
        </div>
    )
}

export default trainerCreator