
const Map = ({ onFinish }) => {

    return (
        <>
            <h2>Mapa</h2>
            <button onClick={()=>onFinish("choose")}>Elige un pokemon</button>
            <button onClick={()=>onFinish("wild")}>Busca un pokemon salvaje</button>
            <button onClick={()=>onFinish("heal")}>Curar pokemons</button>
            <button onClick={()=>onFinish("list")}>Mis pokemons</button>
        </>
    )
}

export default Map;