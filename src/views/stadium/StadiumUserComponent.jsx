import Pokemon from "../../components/PokemonComponent";
import { useState } from "react";

const StadiumUserComponent = ({ user, onClick }) => {
    const [showPokemons, setShowPokemons] = useState(false);
    const toggleShowPokemons = () => {
        setShowPokemons(showPokemons => !showPokemons);
    }

    return (
        <section className="user-card" key={user.username} onClick={toggleShowPokemons}>
            <h2>{user.username}</h2>
            <img className="pokeball-button" src="/swords.svg" alt="attack" onClick={onClick} />
            {showPokemons &&
                <section className="pokemons-container">
                    {user.pokemons.map((pokemon) => (
                        <Pokemon
                            key={pokemon._id}
                            data={pokemon}
                            showJustLevel={true}
                            isCombat={false}
                        />
                    ))}

                </section>
            }
        </section>
    );
}

export default StadiumUserComponent;
