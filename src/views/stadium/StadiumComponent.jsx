import { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import pokemonContext from "../../context/pokemonContext";
import loggedInContext from "../../context/loggedInContext";
import Pokemon from "../../components/PokemonComponent";
import StadiumUserComponent from "./StadiumUserComponent";
import Combat from "./socketCombatComponent";
import { getPokemonById } from "../../utils/fetchPokemons";
import "./Stadium.css";

const VITE_BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST;
const socket = io(VITE_BACKEND_HOST);

const Stadium = ({ onFinish }) => {
    const { misPokemons, updatePokemon } = useContext(pokemonContext);
    const { getUserName } = useContext(loggedInContext);
    const [users, setUsers] = useState([]);
    const [isCombat, setIsCombat] = useState(false);
    const [rival, setRival] = useState(null);

    useEffect(() => {
        const handleConnect = () => {
            console.log("connected");
        }
        const handleDisconnect = () => {
            console.log("disconnected");
        }
        function handleNewMessage(message) {
            console.log(message);
        }
        function handleNewUser(user) {
            console.log(user);
        }
        function handleUserLeft(username) {
            console.log("usuario ha entrado:", user);
            setUsers(users.filter((u) => u.username !== username));
        }
        function handleUserJoined(user) {
            console.log("usuario ha entrado:", user);
            setUsers(users => [...users, user]);
        }
        function handleUserList(users) {
            console.log(users);
        }
        const handleUsers = (users) => {
            console.log(users);
            setUsers(users);
        }
        const handleAskToFight = (user) => {
            if (confirm(`El usuario ${user.username} quiere luchar`)) {
                socket.emit("accept-fight", { room: "main", user });
                setRival(user);
                setIsCombat(true);

            }
            else {
                socket.emit("reject-fight", { room: "main", user });
            }
        }
        const handleAcceptFight = (user) => {
            alert(`El usuario ${user.username} ha aceptado luchar`);
            setRival(user);
            setIsCombat(true);

        }
        const handleRejectFight = (user) => {
            alert(`El usuario ${user.username} ha rechazado luchar`);
        }
        socket.on("members", handleUsers)
        socket.on("message", handleNewMessage);
        socket.on("new-user", handleNewUser);
        socket.on("leave", handleUserLeft);
        socket.on("join", handleUserJoined);
        socket.on("user-list", handleUserList);
        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("ask-to-fight", handleAskToFight);
        socket.on("accept-fight", handleAcceptFight);
        socket.on("reject-fight", handleRejectFight);

        const user = {
            username: getUserName(),
            pokemons: misPokemons
        }
        socket.emit("join", { room: "main", user });
        return () => {
            socket.emit("leave", { room: "main", user });
            socket.off("new-message", handleNewMessage);
            socket.off("new-user", handleNewUser);
            socket.off("leave", handleUserLeft);
            socket.off("join", handleUserJoined);
            socket.off("user-list", handleUserList);
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("members", handleUsers);
            socket.off("ask-to-fight", handleAskToFight);
            socket.off("accept-fight", handleAcceptFight);
            socket.off("reject-fight", handleRejectFight);


        }
    }
        , []);

    const hancleUserClick = (user) => {
        socket.emit("ask-to-fight", { room: "main", user });
    }
    const handleAcceptFight = (user) => {
        socket.emit("accept-fight", { room: "main", user });
    }
    const handleMiPokemonChange = async (pokemon) => {
        return await updatePokemon(pokemon);
    }
    const handleRivalPokemonChange = async (pokemon) => {
        setRival({ ...rival, pokemons: [pokemon] });
        return pokemon;
    }
    const getUpdatedPokemon = async (pokemon) => {
        const pokemonData = await getPokemonById(pokemon._id);
        return pokemonData;
    }
    if (isCombat && rival) {
        return (
            <section className="combat">
                <Combat
                    socket={socket}
                    pokemon1={misPokemons[0]}
                    pokemon2={rival.pokemons[0]}
                    onChange1={handleMiPokemonChange}
                    onChange2={handleRivalPokemonChange}
                    onFinish={() => setIsCombat(false)}
                    rivalName={rival.username}
                />
            </section>
        )
    }
    return (
        <section className="stadium">
            <h1>Stadium</h1>
            <h2>Mis pokemons</h2>
            <section className="pokemons-container">
                {misPokemons.map((pokemon) => (
                    <Pokemon
                        key={pokemon._id}
                        data={pokemon}
                        showJustLevel={true}
                        isCombat={false}
                    />
                ))}
            </section>
            <h2>Usuarios</h2>
            {users.map((user) => (
                <StadiumUserComponent
                    key={user.username}
                    user={user}
                    onClick={() => hancleUserClick(user)}
                />
            ))}
            <section className="pokemon-buttons button-footer">
                <button onClick={() => onFinish("map")}>Volver</button>
            </section>
        </section>
    )
}

export default Stadium;