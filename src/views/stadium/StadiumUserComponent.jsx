import Pokemon from "../../components/pokemon/PokemonComponent";
import { useEffect, useState } from "react";
import { getUserData } from "../../utils/fetchPokemons";
const StadiumUserComponent = ({ username, onClick }) => {
    const [showPokemons, setShowPokemons] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        getUser(username);
    }, [username]);
    const toggleShowPokemons = () => {
        setShowPokemons(showPokemons => !showPokemons);
    }
    const getUser = async (username) =>{
        const user = await getUserData(username);
        setUser(user);
    }
    if (user === null) {
        return <div></div>
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
