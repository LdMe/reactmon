import { useEffect, useState } from "react"
import { getGyms, getGymByZone } from "../../utils/fetchPokemons"
import Type from "../types/Type";

import './Gym.css';

const Gyms = ({ onSelect }) => {

    const [gym, setGym] = useState(null);
    useEffect(() => {
        handleGetGyms();
    }, []);
    const handleGetGyms = async () => {
        const data = await getGymByZone();

        if(data && !data.error){
            setGym(data);
        }
    }
    if(!gym) return <p>Esta zona no tiene gimnasios</p>
    return (
        <div className="gyms">
            <h1>Gimnasio</h1>
            <div className="gym-instance" key={gym._id} onClick={() => onSelect(gym)}>
                <h3>{gym.name}</h3>
                <p>Entrenadores: {gym.trainers.length}</p>
                <p>Tipos: {gym.types.map((t) => <Type key={t.name} type={t} />)}</p>
                <p>Nivel maximo: {gym.maxLevel}</p>
            </div>
        </div>
    )
}

export default Gyms