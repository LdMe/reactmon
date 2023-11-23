import {useState} from "react";
import HealthBar from "./healthBar/HealthBar";

const Pokemon = ({data, onClick,isFront=true,isCombat=true}) =>{
    const [loaded,setLoaded] = useState(false);
    let className = "pokemon-card";
    /* if(!loaded){
        className += " hidden";
    } */
    const frontOrBack =  isFront ? "front_default": "back_default";
    return (
        <article className={className + (loaded ? "": " hidden")} onClick={onClick} >
            <h2>{data.name}</h2>
            {isCombat && 
            <HealthBar maxHp={data.maxHp} hp={data.hp}/>
            }
            <img src={data.sprites.versions['generation-v']['black-white'].animated[frontOrBack]} alt={`imagen de ${data.name}`}  onLoad={()=>setLoaded(true)}/>
        </article>
    )
}

export default Pokemon;