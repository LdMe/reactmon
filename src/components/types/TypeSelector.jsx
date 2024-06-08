import { useState, useEffect } from 'react'
import { getTypes } from '../../utils/fetchPokemons'
import Type from './Type';

const TypeSelector = ({ onChange, selectedTypes = []}) => {
    const [types, setTypes] = useState([]);
    useEffect(() => {
        getTypes().then((types) => {
            console.log("types", types);
            setTypes(types);
        })
    }, []);
    const unselectedTypes = types.filter((type) => !selectedTypes.includes(type));
    const handleSelectType = (type) => {
        if (selectedTypes.includes(type)) {
            const newSelectedTypes = selectedTypes.filter((t) => t !== type);
            onChange(newSelectedTypes);
        }
        else {
            onChange([...selectedTypes, type]);
        }
    }
    return (
        <div className="type-selector">
            <h3>Tipos</h3>
            <p>Seleccionados:</p>
            {selectedTypes.map((type) => (
                <span key={type.name} onClick={() => handleSelectType(type)}>
                    <Type type={type} />
                </span>
            ))}
            <p>No seleccionados:</p>
            {unselectedTypes.map((type) => (
                <span key={type.name} onClick={() => handleSelectType(type)}>
                    <Type type={type} />
                </span>
            ))}
        </div>
    )
}

export default TypeSelector