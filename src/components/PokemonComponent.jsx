import { useState } from "react";
import HealthBar from "./healthBar/HealthBar";
import '../styles/Pokemon.css';
const Pokemon = ({ data, onClick, isFront = true, isCombat = true, isSelected = false,isEnemy=false, children }) => {
    const [loaded, setLoaded] = useState(false);
    let className = "pokemon-card" + (isSelected ? " selected" : "") + (isFront ? " " : " reverse") + (isCombat ? " combat" : " no-combat");
    /* if(!loaded){
        className += " hidden";
    } */
    let frontOrBack = isFront ? "front_default" : "back_default";
    if (data.shiny) {
        frontOrBack = isFront ? "front_shiny" : "back_shiny";
    }
    let image = data.sprites.versions['generation-v']['black-white'].animated[frontOrBack];

    return (
        <article className={className + (loaded ? "" : " hidden")} onClick={onClick} >
            <section className="combat-info">
                <h2>{data.name}</h2>
                {isCombat &&
                    <>
                        <div className="combat-info__stats">
                            {!isEnemy && <p>hp: {data.hp}</p>}
                            <p>nivel: {data.level}</p>
                        </div>



                        <HealthBar key={data._id} maxHp={data.maxHp} hp={data.hp} />
                    </>
                }
            </section>
            <section className="combat-info">
                <img src={image} alt={`imagen de ${data.name}`} onLoad={() => setLoaded(true)} />
            </section>
            {children}
        </article>
    )


}

export default Pokemon;