import { useState, useContext, useEffect } from 'react'
import pokemonContext from '../../context/pokemonContext';
import './HealPokemons.css';
const HealPokemons = ({ onFinish }) => {
    const { misPokemons, healPokemons } = useContext(pokemonContext);
    const [isHealing, setIsHealing] = useState(false);
    const [isHealed, setIsHealed] = useState(false);

    const handleHeal = async () => {
        if (!isHealing) {
            setIsHealing(true);
            await healPokemons();
            setIsHealed(true);
        }
    }
    return (
        <div className="heal-pokemons" onClick={isHealed ? () => onFinish("map") : handleHeal}>
            <section className="heal-pokemons--pokeballs" >
                {misPokemons.map((pokemon) => {
                    return (
                        <img className={"pokeball-heal " + (isHealing && "darker")} key={pokemon._id} src="/pokeball.svg" alt={pokemon.name} />
                    )
                })
                }
                {isHealing &&
                    <section className="healing">
                        <audio
                            onEnded={() => {
                                alert("Tus pokemons han sido curados");
                                setIsHealing(false);
                                onFinish("map");
                            }}
                            src="heal.mp3"
                            autoPlay />
                    </section>

                }
                {isHealed &&
                    <section className="pokemon-buttons button-footer">
                        <button className="heal-pokemons--button">Volver al mapa</button>
                    </section>
                }
            </section>
        </div>
    )
}

export default HealPokemons
