import { useState, useContext, useEffect } from 'react'
import pokemonContext from '../../context/pokemonContext';
import './HealPokemons.css';
const HealPokemons = ({ onFinish }) => {
    const { misPokemons, healPokemons } = useContext(pokemonContext);
    const [isHealing, setIsHealing] = useState(false);

    const handleHeal = () => {
        setIsHealing(true);
        healPokemons();
    }
    return (
        <div>
            <h2>Centro reactMon</h2>
            {misPokemons.map((pokemon) => {
                return (
                    <img className={"pokeball-heal " + (isHealing && "darker")} key={pokemon._id} src="/pokeball.svg" alt={pokemon.name} />
                )
            })
            }
            {isHealing ?
                <section className="healing">
                    <p>Curando...</p>
                    <section className="pokemon-buttons">
                        <button onClick={() => onFinish("map")}>Volver</button>
                    </section>
                    <audio
                        onEnded={() => {
                            healPokemons();
                            alert("Tus pokemons han sido curados");
                            setIsHealing(false);
                            onFinish("map");
                        }}
                        src="heal.mp3"
                        autoPlay />
                </section>
                :
                <>
                    <p>¿Quieres curar a tus pokemons?</p>
                    <section className="pokemon-buttons">
                        <button onClick={handleHeal}>Curar</button>
                        <button onClick={() => onFinish("map")}>Volver</button>
                    </section>
                </>
            }

        </div>
    )
}

export default HealPokemons
