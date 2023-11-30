import { useState } from "react";
import HealthBar from "./healthBar/HealthBar";
import './Pokemon.css';
const Pokemon = ({ data, onClick, isFront = true, isCombat = true ,isSelected=false, children}) => {
    const [loaded, setLoaded] = useState(false);
    let className = "pokemon-card" + (isSelected ? " selected" : "");
    /* if(!loaded){
        className += " hidden";
    } */
    const frontOrBack = isFront ? "front_default" : "back_default";
    return (
        <article className={className + (loaded ? "" : " hidden")} onClick={onClick} >
            <h2>{data.name}</h2>
            {isCombat &&
                <section className="combat-info">
                    <p>hp: {data.hp}</p>
                    <p>level: {data.level}</p>

                    <HealthBar maxHp={data.maxHp} hp={data.hp} />
                </section>
            }
            <img src={data.sprites.versions['generation-v']['black-white'].animated[frontOrBack]} alt={`imagen de ${data.name}`} onLoad={() => setLoaded(true)} />
            {children}
        </article>
    )
}

export default Pokemon;