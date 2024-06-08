import { useState, useEffect, useContext } from "react";
import { getUsers } from "../../utils/fetchPokemons";
import loggedInContext from "../../context/loggedInContext";
import GymEditor from "./GymEditor";
import Gyms from "./Gyms";
import '../../styles/Admin.css';
import ShowUsers from "../../components/users/ShowUsers";

const AdminView = ({ onFinish }) => {
    const [users, setUsers] = useState([]);
    const [state, setState] = useState("users");
    const [selectedGym, setSelectedGym] = useState(null);
    const { getUserRole } = useContext(loggedInContext);

    useEffect(() => {
        console.log(getUserRole());
        if (getUserRole() !== "admin") {
            onFinish("login");
            return;
        }
        handleGetUsers();
    }
        , []);
        useEffect(() => {
            if (selectedGym) {
                setState("new-gym");
            }
        }, [selectedGym]);
    const handleGetUsers = async () => {
        try {
            const users = await getUsers();
            if (users.error) {
                onFinish("login");
                throw new Error(users.error);
            }
            setUsers(users);
        }
        catch (e) {
            alert(e.message);
        }

    }
    const handleGymClick = (gym) => {
        console.log("gym", gym);
        setSelectedGym(gym);
    }

    return (
        <div>
            <section className="pokemon-navbar ">
                <button onClick={() => setState("show-gym")}>Mostrar gimnasios</button>
                <button onClick={() => setState("new-gym")}>Crear gimnasio</button>
                <button onClick={() => setState("users")}>Usuarios</button>
                <button onClick={() => setState("pokemons")}>Pokemons</button>
                <button onClick={() => setState("items")}>Items</button>
            </section>
            {state === "users" &&
                <ShowUsers users={users} />
            }
            {state === "new-gym" &&
                <GymEditor onFinish={onFinish} originalGym={selectedGym} />
            }
            {state === "show-gym" &&
                <Gyms onFinish={onFinish} onSelect={handleGymClick} />
            }
            <section className="pokemon-buttons button-footer">
                <button onClick={() => onFinish("map")}>Volver</button>
            </section>

        </div>
    )

}

export default AdminView;