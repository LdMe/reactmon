import { useEffect, useState } from "react"
import { getGyms} from "../../utils/fetchPokemons"
import Type from "../types/Type";

import './Gym.css';

const Gyms = ({onSelect}) => {

    const [gyms, setGyms] = useState([]);
    useEffect(() => {
        getGyms().then((data) => {
            console.log("data", data);
            setGyms(data);
        });
    }, []);
console.log("gyms", gyms)
    return (
        <div className="gyms">
            <h1>Gimnasios</h1>
            {gyms.map((gym) => (
                <div className="gym-instance" key={gym._id} onClick={() => onSelect(gym)}>
                    <h3>{gym.name}</h3>
                    <p>Entrenadores: {gym.trainers.length}</p>
                    <p>Tipos: {gym.types.map((t) => <Type key={t.name} type={t} />)}</p>
                    <p>Nivel maximo: {gym.maxLevel}</p>
                </div>
            ))}
        </div>
    )
}

export default Gyms