import { useState, useEffect, useContext } from 'react';
import { getZones, setZone } from '../../utils/fetchPokemons';
import pokemonContext from '../../context/pokemonContext';
import loggedInContext from '../../context/loggedInContext';
import ZoneCard from './ZoneCard';
const Zones = ({ onFinish }) => {
    const [zones, setZones] = useState([]);
    const {getMaxLevel} = useContext(pokemonContext);
    const {refreshUserData} = useContext(loggedInContext);
    useEffect(() => {
        getZones().then(data => {

            setZones(data);
        })
    }, [])
    const handleSelect = async(zone) => {
        if(zone.gym && getMaxLevel() < zone.gym.maxLevel){  
            alert(`Nivel maximo de ${zone.gym.name} es ${zone.gym.maxLevel}, el tuyo es ${getMaxLevel()}`);
            return;
        }
        await setZone(zone);
        refreshUserData();
        onFinish("map");
    }
    
    return (
        <section className="zones">
            <section className="zone-list">
                {zones.map((zone) => (
                    <ZoneCard key={zone.name} zone={zone} onClick={handleSelect} />
                ))}
            </section>
            <section className="pokemon-buttons button-footer">
                <button onClick={() => onFinish("map")}>Volver</button>
            </section>

        </section>
    )
}

export default Zones