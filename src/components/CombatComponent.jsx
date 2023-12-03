import { useState, useEffect, useContext,useRef } from 'react';
import Pokemon from './PokemonComponent';
import { attack as attackApi } from "../utils/fetchPokemons";

import '../styles/Combat.css';
const Combat = ({ pokemon1, pokemon2, onChange, onFinish, aiOponent = true, buttons = [] }) => {
    const [firstPokemon, setFirstPokemon] = useState(pokemon1);
    const [secondPokemon, setSecondPokemon] = useState(pokemon2);
    const [isAttacking, setIsAttacking] = useState(true);
    const [turn, setTurn] = useState(0);
    const timeoutRef = useRef(null);
    useEffect(() => {
        setFirstPokemon(pokemon1);
        setSecondPokemon(pokemon2);
        timeoutRef.current = setTimeout(() => {
            setIsAttacking(false);
        }, 400);
        return () => {
            clearTimeout(timeoutRef.current);
        }
    }
        , [pokemon1, pokemon2]);



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

        if (newDefender._id === firstPokemon._id) {
            setFirstPokemon(newDefender);
        }
        else {
            setSecondPokemon(newDefender);
        }
        onChange(newDefender);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 200);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                if(timeoutRef.current!==null){
                setIsAttacking(false);
                }
            }, 400);
        });
    }

    const handleAttack = async () => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        setIsAttacking(isAttacking => true);
        if (aiOponent) {
            await attack(firstPokemon, secondPokemon);
            await attack(secondPokemon, firstPokemon);
            return;
        }
        if (turn === 0) {
            await attack(firstPokemon, secondPokemon);
            setTurn(1);
        }
        else {
            await attack(secondPokemon, firstPokemon);
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
                                return <img className="pokeball-button" key={button.name} onClick={() => button.onClick(firstPokemon, secondPokemon)} src={button.image} alt={button.name} />
                            })}
                        </>
                    </section>
                    :
                    <section className="action-buttons">
                        <img className="pokeball-button disabled" src="/running.svg" alt="run" />
                        <img className="pokeball-button disabled" src="/swords.svg" alt="attack" />

                        <>
                            {buttons.map((button) => {
                                return <img className="pokeball-button disabled" key={button.name} onClick={() => button.onClick(firstPokemon, secondPokemon)} src={button.image} alt={button.name} />
                            })}
                        </>
                    </section>
                }
            </section>
        </>
    )
}

export default Combat;