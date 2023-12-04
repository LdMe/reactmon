import Logout from "../components/Logout";
import { useContext } from "react";
import loggedInContext from "../context/loggedInContext";
const Map = ({ onFinish }) => {

    const { isLogged } = useContext(loggedInContext);
    return (
        <>
            <h2>Mapa</h2>
            <section className="pokemon-buttons">
                {isLogged ?
                    <>
                        <button onClick={() => onFinish("wild")}>Busca un pokemon salvaje</button>
                        <button onClick={() => onFinish("heal")}>Curar pokemons</button>
                        <button onClick={() => onFinish("list")}>Mis pokemons</button>
                        <button onClick={() => onFinish("stadium")}>Estadio Pokemon</button>
                        <Logout onFinish={onFinish} auto={false} />

                    </>
                    :
                    <button onClick={() => onFinish("login")}>Login</button>
                }
            </section>

        </>
    )
}

export default Map;