import { useState, useEffect } from 'react';

import { getZone } from '../../utils/fetchPokemons';
import Habitat from '../habitat/Habitat';
import GymEditor from '../gym/GymEditor';
import Modal from '../modal/Modal';
import './Zone.scss';

const Zone = ({ name, onFinish }) => {
    const [zone, setZone] = useState(null);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        getZone(name).then(data => {

            setZone(data);
        })
    }, [name])
    const handleChangeName = (e) => {

        setZone({ ...zone, name: e.target.value });
    }
    if(!zone){
        return <p>Cargando...</p>
    }
    return (
        <article>

            <h2>Zona: {zone.name}</h2>
            <h3>Habitat: {zone && <Habitat habitat={zone.habitat} />}</h3>
            
            {showModal ?
            <Modal onClose={() => setShowModal(false)}>
                <>
                    <h3>Pokemons:</h3>
                    {zone?.pokemon_species?.map((pokemon) => (
                        <p>{pokemon}</p>
                    ))}
                </>
            </Modal>
            :
            <button onClick={() => setShowModal(true)}>Pokemons</button>
            }
            {zone &&
                <>
                    <h3>Gimnasio</h3>
                    <GymEditor  originalGym={zone?.gym} zone={zone} onFinish={onFinish}/>
                </>
            }
        </article>
    )
}

export default Zone