import { useState,useContext } from "react";
import HealthBar from "../healthBar/HealthBar";
import Moves from "../moves/Moves";
import Types from "../types/Types";
import Stats from "../stats/Stats";
import loggedInContext from "../../context/loggedInContext";
import './Pokemon.scss';
const Pokemon = ({ data, onClick, isFront = true, showHp = true,isCombat=false, isSelected = false, isEnemy = false, showJustLevel = false, children, defaultClassName = "" ,fullInfo = false}) => {
    const [loaded, setLoaded] = useState(false);
    const {getMaxLevel, setMaxLevel} = useContext(loggedInContext);
    let className = "pokemon-card " + defaultClassName + (isSelected ? " selected" : "") + (isFront ? " " : " reverse") + (showHp ? " hp" : "no-hp") + (fullInfo ? " full-info" : "") + (isCombat ? " combat" : "") + (isEnemy ? " enemy" : "");
    /* if(!loaded){
        className += " hidden";
    } */
    let frontOrBack = isFront ? "front_default" : "back_default";
    if (data.shiny) {
        frontOrBack = isFront ? "front_shiny" : "back_shiny";
    }
    const handleTypes = (types) => {
        console.log("handle types",types)
        if(types.length > 0){
            if(!types[0].name){
                return types.map((type) => {
                    return {name: type}
                })
            }
            return types
        }
    }
    let image = data.sprites[frontOrBack];
    return (
        <article className={className + (loaded ? "" : " hidden")} onClick={onClick} >
            <section className="combat-info">
                <h2>{data.name}</h2>
                {showHp &&
                    <>
                        <div className="combat-info__stats">
                            {!isEnemy && <p>hp: {data.hp}</p>}
                            <p>nivel: <span className={ data.level >= getMaxLevel() ? "max" : ""}>{data.level}</span></p>
                        </div>
                        <HealthBar key={data._id} maxHp={data.maxHp} hp={data.hp} />
                    </>
                }
                {showJustLevel && <p>nivel: <span className={!isEnemy && (data.level >= getMaxLevel() ? "max" : "")}>{data.level}</span></p>}
            </section>
            <section className="combat-info">
                <img src={image} alt={`imagen de ${data.name}`} onLoad={() => setLoaded(true)} />
            </section>
            {fullInfo &&
                <section className="pokemon-actions full">
                   {data.types.length && <Types types={handleTypes(data.types)} /> }
                    {data.activeMoves.length && <Moves moves={data.activeMoves} />}
                    <Stats stats={data.stats} />
                </section>
            }
            {children}
        </article>
    )


}

export default Pokemon;