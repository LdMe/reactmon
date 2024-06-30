import { useEffect, useState, useContext } from "react";
import pokemonContext from "../../context/pokemonContext";
import loggedInContext from "../../context/loggedInContext";
import Pokemon from "../../components/pokemon/PokemonComponent";
import StadiumUserComponent from "./StadiumUserComponent";
import Combat from "./StadiumCombatComponent";
import { getUserData,getPokemonById } from "../../utils/fetchPokemons";
import "./Stadium.css";
import socketContext from "../../context/socketContext";


const Stadium = ({ onFinish }) => {
    const { misPokemons, updatePokemon } = useContext(pokemonContext);
    const { getUserName } = useContext(loggedInContext);
    const [myUsername, setMyUsername] = useState(getUserName());
    const socket = useContext(socketContext);
    
    const [users, setUsers] = useState([]);
    const [isCombat, setIsCombat] = useState(false);
    const [rival, SetRival] = useState(null);

    const setRival = async (username) => {
        const newRival = await getUserData(username);
        SetRival(newRival);
    }
    const updateRivalPokemon = async (pokemon) => {
        const newPokemon = await getPokemonById(pokemon);
        const newPokemons = rival.pokemons;
        newPokemons[0] = newPokemon;
        SetRival({ ...rival, pokemons: newPokemons });
        return newPokemon;
    }
    
    useEffect(() => {
        if (myUsername === null) {
            setMyUsername(getUserName());
            return;
        }
        const handleConnect = () => {

        }
        const handleDisconnect = () => {

        }
        function handleNewMessage(message) {

        }
        function handleNewUser(user) {

        }
        function handleUserLeft(username) {

            setUsers(users.filter((u) => u !== username));
        }
        function handleUserJoined(username) {

            setUsers(users => [...users, username]);
        }
        function handleUserList(users) {

        }
        const handleUsers = (users) => {

            setUsers(users.filter((user) => user !== myUsername));
        }
        const handleAskToFight = async(username) => {

            if (confirm(`El usuario ${username} quiere luchar`)) {
                socket.emit("accept-fight", { room: "main", username });
                await setRival(username);
                setIsCombat(true);

            }
            else {
                socket.emit("reject-fight", { room: "main", username });
            }
        }
        const handleAcceptFight = async (username) => {

            alert(`El usuario ${username} ha aceptado luchar`);
            await setRival(username);
            setIsCombat(true);

        }
        const handleRejectFight = (username) => {
            alert(`El usuario ${username} ha rechazado luchar`);
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

        
        socket.emit("join", { room: "main", username:myUsername });
        return () => {
            socket.emit("leave", { room: "main", username:myUsername });
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
        , [myUsername]);

    const hancleUserClick = (username) => {
        socket.emit("ask-to-fight", { room: "main", username });
    }
    
    const handleMiPokemonChange = async (pokemon) => {
        return await updatePokemon(pokemon);
    }
    const handleRivalPokemonChange = async (pokemon) => {
        const newPokemon = await updateRivalPokemon(pokemon);
        return newPokemon;
    }
    /* const getUpdatedPokemon = async (pokemon) => {
        const pokemonData = await getPokemonById(pokemon._id);
        return pokemonData;
    } */
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
                    key={user}
                    username={user}
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