import Pokemon from "../../components/PokemonComponent";


const ChatUserComponent = ({ user, onClick }) => {
    return (
        <section className="user-card" key={user.username} onClick={onClick}>
                    <h2>{user.username}</h2>
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
                </section>
    );
}

export default ChatUserComponent;
