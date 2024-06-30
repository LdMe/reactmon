import { useContext } from "react"
import pokemonContext from "../../context/pokemonContext"

const ZoneCard = ({ zone,onClick }) => {
    const {getMaxLevel} = useContext(pokemonContext);
    const getZoneImage = (zone) => {
        const lowerCaseZone = zone.name.toLowerCase();
        const zoneName = lowerCaseZone.replace(/\s/g, "-");
        return `/${zoneName}.png`
    }
    return (
        < article key={zone.name} onClick={() => onClick(zone)} className={(zone.gym && zone.gym.maxLevel > getMaxLevel() ? "disabled" : "")}>
            <p>{zone.name}</p>
            <img className="zone-image" src={getZoneImage(zone)} />
            {/* <Habitat habitat={zone.habitat} /> */}
            {zone.gym && <p>Nivel máximo: <span className={(zone.gym.maxLevel > getMaxLevel() ? "max" : "")}>{zone.gym.maxLevel}</span></p>}
        </article>
    )

}

export default ZoneCard