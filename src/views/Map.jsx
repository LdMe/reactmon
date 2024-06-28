import Logout from "../components/Logout";
import { useContext,useEffect } from "react";
import loggedInContext from "../context/loggedInContext";
const Map = ({ onFinish }) => {
    const { isLogged,getUserRole,refreshUserData } = useContext(loggedInContext);
    useEffect(() => {
        
        refreshUserData();
    }, []);
    return (
        <section className="map">
            <section className={"pokemon-buttons " + (isLogged ? "" : "button-footer")}>
                {isLogged ?
                    <>
                        <button onClick={() => onFinish("wild")}>Busca un pokemon salvaje</button>
                        <button onClick={() => onFinish("trainer")}>Busca un entrenador</button>
                        <button onClick={() => onFinish("gym")}>Ir al gimnasio</button>
                        <button onClick={() => onFinish("heal")}>Curar pokemons</button>
                        <button onClick={() => onFinish("pokedex")}>Pokedex</button>
                        <button onClick={() => onFinish("stadium")}>Estadio Pokemon</button>
                        {/* <button                                    >Gimnasio </button> */}
                        <button onClick={() => onFinish("list")}>Mis pokemons</button>
                        {getUserRole() === "admin" &&
                            <button onClick={() => onFinish("admin")}>Admin</button>
                        }
                        <Logout onFinish={onFinish} auto={false} />

                    </>
                    :
                    <button onClick={() => onFinish("login")}>Login</button>
                }
            </section>

        </section>
    )
}

export default Map;