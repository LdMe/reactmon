
import Pokemon from '../pokemon/PokemonComponent';
import { attack as attackApi } from "../../utils/fetchPokemons";
import './Combat.css';
const Combat = ({ playerPokemon, enemyPokemon, handleAttack, onFinish,  canExit=true,isPlayerTurn = true,  buttons = [] }) => {
    const style = {
        backgroundImage: "url(/forest.jpg)"
    }

    const attack = async () => {
        let attacker = playerPokemon;
        let defender = enemyPokemon;
        if (!isPlayerTurn) {
            attacker = enemyPokemon;
            defender = playerPokemon;
        }
        const result = await attackApi(attacker, defender);
    }
    return (
        <section className="combat" style={style}>
            <Pokemon data={enemyPokemon} isEnemy={true} />
            <Pokemon data={playerPokemon} isFront={false} />
            <section className="button-footer">
                {isPlayerTurn ?
                    <section className={"action-buttons" + (!canExit && buttons.length === 0 ? " center" : "")}>
                        {canExit && <img onClick={() => onFinish("map")} className="pokeball-button yellow" src="/running.png" alt="run" />}
                        <img onClick={handleAttack} className="pokeball-button" src="/swords.svg" alt="attack" />
                        <>
                            {buttons.map((button) => {
                                return <img className="pokeball-button" key={button.name} onClick={() => button.onClick(playerPokemon, enemyPokemon)} src={button.image} alt={button.name} />
                            })}
                        </>
                    </section>
                    :
                    <section className={"action-buttons" + (!canExit && buttons.length === 0 ? " center" : "")}>
                        {canExit && <img className="pokeball-button disabled" src="/running.png" alt="run" />}
                        <img className="pokeball-button disabled" src="/swords.svg" alt="attack" />

                        <>
                            {buttons.map((button) => {
                                return <img className="pokeball-button disabled" key={button.name} onClick={() => button.onClick(playerPokemon, enemyPokemon)} src={button.image} alt={button.name} />
                            })}
                        </>
                    </section>
                }
            </section>
        </section>
    )
}

export default Combat;