import { useState, useEffect, useContext } from 'react';
import { getZones, setZone } from '../../utils/fetchPokemons';
import Habitat from '../habitat/Habitat';
import Zone from './Zone';

const Zones = ({ onFinish }) => {
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    useEffect(() => {
        getZones().then(data => {
            setZones(data);
        })
    }, [])
    const handleSelect = (zone) => {
        setZone(zone);
        console.log("selected zone", zone);
        setSelectedZone(zone);
    }
    return (
        <section className="zones">
            <section className="zone-list">
                {zones.map((zone) => (
                    < article key={zone.name} onClick={() => handleSelect(zone)}>
                        <p>{zone.name}</p>
                        <Habitat habitat={zone.habitat} />
                    </article>
                ))}

            </section>
            {selectedZone &&
                <Zone name={selectedZone.name} onFinish={onFinish} />
            }

        </section>
    )
}

export default Zones