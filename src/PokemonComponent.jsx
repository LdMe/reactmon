import {useState} from "react";

const Pokemon = ({data}) =>{
    const [loaded,setLoaded] = useState(false);
    let className = "pokemon-card";
    /* if(!loaded){
        className += " hidden";
    } */
    return (
        <article className={className + (loaded ? "": " hidden")} >
            <h2>{data.name}</h2>
            <img src={data.sprites.front_default} alt={`imagen de ${data.name}`}  onLoad={()=>setLoaded(true)}/>
            <h3>Types:</h3>
            <ul>
                {data.types.map((type)=>(
                    <li key={type.slot}>{type.type.name}</li>
                ))}
            </ul>
        </article>
    )
}

export default Pokemon;