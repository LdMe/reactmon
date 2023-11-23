import './HealthBar.css';
const HealthBar = ({maxHp,hp})=>{

    const width = (hp / maxHp) * 100;
    const color = width > 50 ? "" : width > 20 ? "medium-health" : "low-health"
    const style = {width: width+"%"}
    return (
        <div className="health-bar">
            <div className={"health-bar-fill "+color } style={style}/>
        </div>
    )
}

export default HealthBar;