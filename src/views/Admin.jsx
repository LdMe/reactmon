import { useState, useEffect, useRef } from "react";
import { getUsers } from "../utils/fetchPokemons";

import '../styles/Admin.css';

const AdminView = ({onFinish}) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        handleGetUsers();
    }
        , []);

    const handleGetUsers = async () => {
        try {
            const users = await getUsers();
            setUsers(users);
        }
        catch (e) {
            alert(e.message);
        }

    }

    return (
        <div>
            <section className="users-list">
                {users.map((user) => (
                    <article key={user._id}>
                        <h3>{user.username}</h3>
                        <p>role:{user.role}</p>
                        <p>
                            connected:
                            <span>
                                {user.isConnected ? "true" : "false"}
                            </span>
                        </p>
                        <p>minutes played:{Math.round(user.activeTime / 60)}</p>
                        <p>team pokemons: {user.pokemons.length}</p>
                        <p>pc pokemons: {user.savedPokemons.length}</p>
                    </article>
                ))}
            </section>
            <section className="pokemon-buttons button-footer">
                <button onClick={() => onFinish("map")}>Volver</button>
            </section>
        </div>
    )

}

export default AdminView;