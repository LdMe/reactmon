import ConnectedIcon from "../icons/ConnectedIcon";

const ShowUsers = ({ users }) => {
    const connectedUsers = users.filter((user) => user.isConnected);
    const disconnectedUsers = users.filter((user) => !user.isConnected);
    return (
        <section className="general-users-list">
            <h2>Conectados: {connectedUsers.length}</h2><h2>Desconectados: {disconnectedUsers.length}</h2>
            <UsersList users={connectedUsers} />
            <UsersList users={disconnectedUsers} />
        </section>

    )

}

const UsersList = ({ users }) => {
    return (
        <section className="users-list">
            {users.map((user) => (
                <article key={user._id}>
                    <h3>{user.username} <ConnectedIcon connected={user.isConnected} /></h3>
                    <p>rol:{user.role}</p>
                    <p>minutos jugados:{Math.round(user.activeTime / 60)}</p>
                    <p>pokemons en el equipo: {user.pokemons.length}</p>
                    <p>pokemons en el pc: {user.savedPokemons.length}</p>
                </article>
            ))}
        </section>
    )
}

export default ShowUsers