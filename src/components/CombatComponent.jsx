import { useState, useEffect, useContext,useRef } from 'react';
import Pokemon from './PokemonComponent';
import { attack as attackApi } from "../utils/fetchPokemons";

import '../styles/Combat.css';
const Combat = ({ pokemon1, pokemon2, onChange, onFinish, aiOponent = true, buttons = [] }) => {
    const [isAttacking, setIsAttacking] = useState(false);
    const [turn, setTurn] = useState(0);
    

    const attack = async (attacker, defender) => {
        if (attacker.hp === 0 || defender.hp === 0) {
            return;
        }
        const move = attacker.activeMoves[Math.floor(Math.random() * attacker.activeMoves.length)];
        const data = await attackApi(attacker, defender, move);
        console.log("attack", data)
        if (data.error) {
            alert(data.error);
            onFinish("map");
            return;
        }
        const newAttacker = data.attacker;
        const newDefender = data.defender;
        await onChange(newDefender);
        const endAttackTimeout = setTimeout(() => {
            setIsAttacking(false);
        }, 1000);
        
    }

    const handleAttack = async () => {
        setIsAttacking(true);
        if (aiOponent) {
            await attack(pokemon1, pokemon2);
            await attack(pokemon2, pokemon1);
            return;
        }
        if (turn === 0) {
            await attack(pokemon1, pokemon2);
            setTurn(1);
        }
        else {
            await attack(pokemon2, pokemon1);
            setTurn(0);
        }
    }
    return (
        <>
            <Pokemon data={pokemon2} isEnemy={true}/>
            <Pokemon data={pokemon1} isFront={false} />
            <section className="button-footer">
                {!isAttacking ?
                    <section className="action-buttons">
                        <img onClick={() => onFinish("map")} className="pokeball-button" src="/running.svg" alt="run" />
                        <img onClick={handleAttack} className="pokeball-button" src="/swords.svg" alt="attack" />
                        <>
                            {buttons.map((button) => {
                                return <img className="pokeball-button" key={button.name} onClick={() => button.onClick(pokemon1, pokemon2)} src={button.image} alt={button.name} />
                            })}
                        </>
                    </section>
                    :
                    <section className="action-buttons">
                        <img className="pokeball-button disabled" src="/running.svg" alt="run" />
                        <img className="pokeball-button disabled" src="/swords.svg" alt="attack" />

                        <>
                            {buttons.map((button) => {
                                return <img className="pokeball-button disabled" key={button.name} onClick={() => button.onClick(pokemon1, pokemon2)} src={button.image} alt={button.name} />
                            })}
                        </>
                    </section>
                }
            </section>
        </>
    )
}

export default Combat;