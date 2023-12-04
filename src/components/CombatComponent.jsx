import { useState, useEffect, useContext,useRef } from 'react';
import Pokemon from './PokemonComponent';
import { attack as attackApi } from "../utils/fetchPokemons";

import '../styles/Combat.css';
const Combat = ({ pokemon1, pokemon2, onChange, onFinish, aiOponent = true, buttons = [] }) => {
    const [isAttacking, setIsAttacking] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [turn, setTurn] = useState(0);
    
    useEffect(() => {
        if (!isStarted) {
            setIsStarted(true);
            return;
        }
        if(aiOponent){
            attack(pokemon2, pokemon1);
        }
    }, [pokemon2]);

    useEffect(() => {
        setTimeout(() => {
            if(pokemon1.hp === 0 || pokemon2.hp === 0){
                return;
            }
            setIsAttacking(false);
        }, 500);
    },[pokemon1]);

    
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
        if(isAttacking){
            return;
        }
        setIsAttacking(true);
        if (aiOponent) {
            const defender =await attack(pokemon1, pokemon2);
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