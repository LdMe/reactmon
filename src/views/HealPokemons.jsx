import { useState, useContext, useEffect } from 'react'
import pokemonContext from '../context/pokemonContext';

const HealPokemons = ({ onFinish }) => {
    const { misPokemons, setMisPokemons } = useContext(pokemonContext);
    const [isHealing, setIsHealing] = useState(false);
    const healPokemons = () => {
        const newMisPokemons = misPokemons.map((pokemon) => {
            pokemon.hp = pokemon.maxHp;
            return pokemon;
        })
        setMisPokemons(newMisPokemons);
    }
    return (
        <div>
            <h2>Centro reactMon</h2>
            {isHealing ?
                <section className="healing">
                    <p>Curando...</p>
                    <audio
                        onEnded={() => {
                            healPokemons();
                            setIsHealing(false);
                            onFinish("map");

                        }}
                        src="heal.mp3"
                        autoPlay />
                </section>
                :
                <>
                    <p>¿Quieres curar a tus pokemons?</p>
                    <button onClick={() => setIsHealing(true)}>Curar</button>
                    <button onClick={() => onFinish("map")}>Volver</button>
                </>
            }

        </div>
    )
}

export default HealPokemons
