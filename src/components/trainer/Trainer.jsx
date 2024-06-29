
import Pokemon from "../pokemon/PokemonComponent";

const Trainer = ({ trainer, onDelete, onSelect }) => {
    return (
        <div className="trainer">
            <h2>{trainer.name}</h2>
            <p>{trainer.pokemons.length} / 6</p>
            <div className="trainer__pokemons">
                {trainer.pokemons.map((pokemon) => <Pokemon key={pokemon._id} data={pokemon}  isCombat={false} showJustLevel={true} showHp={false}/>)}
            </div>
            <div className="trainer__buttons">
                <button onClick={() => onSelect(trainer)}>Editar</button>
                <button onClick={() => onDelete(trainer)}>Eliminar</button>
            </div>
        </div>
    )
}

export default Trainer