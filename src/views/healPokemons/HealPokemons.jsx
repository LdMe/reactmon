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
        <div className="heal-pokemons" onClick={isHealing ? ()=>onFinish("map"): handleHeal}>
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
                                healPokemons();
                                alert("Tus pokemons han sido curados");
                                setIsHealing(false);
                                onFinish("map");
                            }}
                            src="heal.mp3"
                            autoPlay />
                    </section>
                    
                }
            </section>
        </div>
    )
}

export default HealPokemons
