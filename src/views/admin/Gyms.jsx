import { useEffect, useState } from "react"
import { getGyms} from "../../utils/fetchPokemons"
const Gyms = ({onSelect}) => {

    const [gyms, setGyms] = useState([]);
    useEffect(() => {
        getGyms().then((data) => {
            console.log("data", data);
            setGyms(data);
        });
    }, []);

    return (
        <div>
            <h1>Gimnasios</h1>

            {gyms.map((gym) => (
                <div key={gym._id} onClick={() => onSelect(gym)}>
                    <h3>{gym.name}</h3>
                    <p>{gym.leaderPokemons.length}</p>
                </div>
            ))}
        </div>
    )
}

export default Gyms