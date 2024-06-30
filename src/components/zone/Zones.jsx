import { useState, useEffect, useContext } from 'react';
import { getZones, setZone } from '../../utils/fetchPokemons';
import Habitat from '../habitat/Habitat';
import Zone from './Zone';
import loggedInContext from '../../context/loggedInContext';

const Zones = ({ onFinish }) => {
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const {getMaxLevel} = useContext(loggedInContext);
    useEffect(() => {
        getZones().then(data => {
            console.log("zones data", data);
            setZones(data);
        })
    }, [])
    const handleSelect = (zone) => {
        if(zone.gym && getMaxLevel() < zone.gym.maxLevel){  
            alert(`Nivel maximo de ${zone.gym.name} es ${zone.gym.maxLevel}, el tuyo es ${getMaxLevel()}`);
            return;
        }
        setZone(zone);
        onFinish("map");
    }
    const getZoneImage = (zone) => {
        const lowerCaseZone = zone.name.toLowerCase();
        const zoneName = lowerCaseZone.replace(/\s/g, "-");
        return `/${zoneName}.png`
    }
    return (
        <section className="zones">
            <section className="zone-list">
                {zones.map((zone) => (
                    < article key={zone.name} onClick={() => handleSelect(zone)} className={(zone.gym && zone.gym.maxLevel > getMaxLevel() ? "disabled" : "")}>
                        <p>{zone.name}</p>
                        <img className="zone-image" src={getZoneImage(zone)} />
                        {/* <Habitat habitat={zone.habitat} /> */}
                        {zone.gym && <p>Nivel máximo: <span className={(zone.gym.maxLevel > getMaxLevel() ? "max" : "")}>{zone.gym.maxLevel}</span></p>}
                    </article>
                ))}
            </section>
            <section className="pokemon-buttons button-footer">
                <button onClick={() => onFinish("map")}>Volver</button>
            </section>

        </section>
    )
}

export default Zones