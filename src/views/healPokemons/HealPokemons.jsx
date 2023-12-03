import { useState, useContext, useEffect } from 'react'
import pokemonContext from '../../context/pokemonContext';
import './HealPokemons.css';
const HealPokemons = ({ onFinish }) => {
    const { misPokemons, healPokemons } = useContext(pokemonContext);
    const [isHealing, setIsHealing] = useState(false);
    useEffect(() => {
        if (isHealing) {
            healPokemons();
        }
    }, [isHealing]);
    return (
        <div>
            <h2>Centro reactMon</h2>
            {misPokemons.map((pokemon) => {
                return (
                    <img className={"pokeball-heal " + (isHealing && "dark")} key={pokemon._id} src="/pokeball.svg" alt={pokemon.name} />
                )
            })
            }
            {isHealing ?
                <section className="healing">
                    <p>Curando...</p>

                    <audio
                        onEnded={() => {
                            healPokemons();
                            setTimeout(() => {
                                alert("Tus pokemons han sido curados");
                                setIsHealing(false);
                                onFinish("map");
                            }, 1000);
                        }}
                        src="heal.mp3"
                        autoPlay />
                </section>
                :
                <>
                    <p>¿Quieres curar a tus pokemons?</p>
                    <section className="action-buttons">
                        <button onClick={() => setIsHealing(true)}>Curar</button>
                        <button onClick={() => onFinish("map")}>Volver</button>
                    </section>
                </>
            }

        </div>
    )
}

export default HealPokemons
