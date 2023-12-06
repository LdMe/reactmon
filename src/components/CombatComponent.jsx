import { useState, useEffect, useContext, useRef } from 'react';
import Pokemon from './PokemonComponent';
import { attack as attackApi } from "../utils/fetchPokemons";
import '../styles/Combat.css';
const Combat = ({ pokemon1, pokemon2, onChange, onFinish, buttons = [] }) => {
    const [isAttacking, setIsAttacking] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const oldPokemonId = useRef(pokemon1._id);
    useEffect(() => {
        if (!isStarted) {
            setIsStarted(true);
            return;
        }
        attack(pokemon2, pokemon1);
    }, [pokemon2]);

    useEffect(() => {
        if (pokemon1._id !== oldPokemonId.current) {
            oldPokemonId.current = pokemon1._id;
            if (!isAttacking) {
                setIsAttacking(true);
                attack(pokemon2, pokemon1);
            }
        }
        setTimeout(() => {
            if (pokemon1.hp === 0 || pokemon2.hp === 0) {
                return;
            }
            setIsAttacking(false);

        }, 500);
    }, [pokemon1]);


    const attack = async (attacker, defender) => {

        if (attacker.hp === 0 || defender.hp === 0) {
            return defender;
        }
        const move = attacker.activeMoves[Math.floor(Math.random() * attacker.activeMoves.length)];
        const data = await attackApi(attacker, defender, move);
        console.log("attack", data)
        if (data.error) {
            alert(data.error);
            onFinish("map");
            return defender;
        }
        const newAttacker = data.attacker;
        const newDefender = data.defender;
        await onChange(newDefender);

        return newDefender;

    }

    const handleAttack = async () => {
        if (isAttacking) {
            return;
        }
        setIsAttacking(true);
        const defender = await attack(pokemon1, pokemon2);
        return;

    }
    const style = {
        backgroundImage: "url(/forest.png)"
    }
    return (
        <section className="combat" style={style}>
            <Pokemon data={pokemon2} isEnemy={true} />
            <Pokemon data={pokemon1} isFront={false} />
            <section className="button-footer">
                {!isAttacking ?
                    <section className="action-buttons">
                        <img onClick={() => onFinish("map")} className="pokeball-button yellow" src="/running.png" alt="run" />
                        <img onClick={handleAttack} className="pokeball-button" src="/swords.svg" alt="attack" />
                        <>
                            {buttons.map((button) => {
                                return <img className="pokeball-button" key={button.name} onClick={() => button.onClick(pokemon1, pokemon2)} src={button.image} alt={button.name} />
                            })}
                        </>
                    </section>
                    :
                    <section className="action-buttons">
                        <img className="pokeball-button disabled" src="/running.png" alt="run" />
                        <img className="pokeball-button disabled" src="/swords.svg" alt="attack" />

                        <>
                            {buttons.map((button) => {
                                return <img className="pokeball-button disabled" key={button.name} onClick={() => button.onClick(pokemon1, pokemon2)} src={button.image} alt={button.name} />
                            })}
                        </>
                    </section>
                }
            </section>
        </section>
    )
}

export default Combat;