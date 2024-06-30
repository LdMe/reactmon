import TrainerCombat from "../../views/TrainerCombat";
import {  useEffect, useState,useContext } from "react";
import { setMaxLevel as setMaxLevelApi } from "../../utils/fetchPokemons"; 
import pokemonContext from "../../context/pokemonContext";
const GymCombat = ({gym,onFinish}) => {
    const [trainerIndex, setTrainerIndex] = useState(0);
    const { setMaxLevel } = useContext(pokemonContext);

    useEffect(() => {
        if (trainerIndex === gym.trainers.length) {
            onFinish("map");
            return;
        }
    }, [trainerIndex]);
    const handleChangeTurn = () => {
        console.log("cambio de turno" , trainerIndex);
        if(trainerIndex === gym.trainers.length - 1) {
            alert(`Has superado el gimnasio ${gym.name}!`);
            setMaxLevelApi(gym.maxLevel + 10);
            setMaxLevel(gym.maxLevel + 10);
            onFinish("map");
            return;
        }
        setTrainerIndex(trainerIndex + 1);
    }
    return (
        <TrainerCombat
            pokemons={gym.trainers[trainerIndex].pokemons}
            onFinish={handleChangeTurn}
        />)

}

export default GymCombat