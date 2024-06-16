import Gyms from "../components/gym/Gyms";
import GymCombat from "../components/gym/GymCombat";
import { useState } from "react";
const GymsView = ({onFinish}) => {
    const [selectedGym, setSelectedGym] = useState(null);

    const onSelect = (gym) => {
        if (confirm("¿Quieres entrar al gimnasio?")) {
            setSelectedGym(gym);
        }
    }
    if (selectedGym) {
        return <GymCombat gym={selectedGym} onFinish={() => setSelectedGym(null)} />
    }
    return (
        <>
            <Gyms onSelect={onSelect} />
            <section className="pokemon-buttons button-footer">
                <button onClick={() => onFinish("map")}>Volver</button>
            </section>
        </>
    )
}

export default GymsView