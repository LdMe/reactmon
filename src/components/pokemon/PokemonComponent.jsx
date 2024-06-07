import { useState } from "react";
import HealthBar from "../healthBar/HealthBar";
import Moves from "../moves/Moves";
import Types from "../types/Types";
import Stats from "../stats/Stats";

import './Pokemon.css';
const Pokemon = ({ data, onClick, isFront = true, isCombat = true, isSelected = false, isEnemy = false, showJustLevel = false, children, defaultClassName = "" ,fullInfo = false}) => {
    const [loaded, setLoaded] = useState(false);
    let className = "pokemon-card " + defaultClassName + (isSelected ? " selected" : "") + (isFront ? " " : " reverse") + (isCombat ? " combat" : " no-combat")
    /* if(!loaded){
        className += " hidden";
    } */
    let frontOrBack = isFront ? "front_default" : "back_default";
    if (data.shiny) {
        frontOrBack = isFront ? "front_shiny" : "back_shiny";
    }
    let image = data.sprites[frontOrBack];

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
                {showJustLevel && <p>nivel: {data.level}</p>}
            </section>
            <section className="combat-info">
                <img src={image} alt={`imagen de ${data.name}`} onLoad={() => setLoaded(true)} />
            </section>
            {fullInfo &&
                <section className="pokemon-actions full">
                    <Types types={data.types} />
                    <Moves moves={data.activeMoves} />
                    <Stats stats={data.stats} />
                    {children}
                </section>
            }
        </article>
    )


}

export default Pokemon;