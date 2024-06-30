import { useState, useEffect, useContext } from 'react';
import { getZones, setZone } from '../../utils/fetchPokemons';
import Zone from './Zone';
import ZoneCard from './ZoneCard';

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
                    <ZoneCard key={zone.name} zone={zone} onClick={handleSelect} />
                ))}

            </section>
            {selectedZone &&
                <Zone name={selectedZone.name} onFinish={onFinish} />
            }

        </section>
    )
}

export default Zones