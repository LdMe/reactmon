
const Map = ({ onFinish }) => {

    return (
        <>
            <h2>Mapa</h2>
            <button onClick={()=>onFinish("choose")}>Elige un pokemon</button>
            <button onClick={()=>onFinish("wild")}>Busca un pokemon salvaje</button>
        </>
    )
}

export default Map;