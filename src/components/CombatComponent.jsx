import { useState, useEffect, useContext } from 'react';
import Pokemon from './PokemonComponent';
import { attack as attackApi } from "../utils/fetchPokemons";

import '../styles/Combat.css';
const Combat = ({ pokemon1, pokemon2, onChange, onFinish, aiOponent = true, buttons = [] }) => {
    const [firstPokemon, setFirstPokemon] = useState(pokemon1);
    const [secondPokemon, setSecondPokemon] = useState(pokemon2);
    const [isAttacking, setIsAttacking] = useState(false);
    const [turn, setTurn] = useState(0);

    useEffect(() => {
        setFirstPokemon(pokemon1);
        setSecondPokemon(pokemon2);
    }
        , [pokemon1, pokemon2]);



    const attack = async (attacker, defender) => {
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
        setIsAttacking(false);
    }

    const handleAttack = () => {
        setIsAttacking(true);
        if (aiOponent) {
            attack(firstPokemon, secondPokemon);
            attack(secondPokemon, firstPokemon);
            return;
        }
        if (turn === 0) {
            attack(firstPokemon, secondPokemon);
            setTurn(1);
        }
        else {
            attack(secondPokemon, firstPokemon);
            setTurn(0);
        }
    }

    return (
        <>
            <Pokemon data={pokemon2} />
            <Pokemon data={pokemon1} isFront={false} />
            <section className="button-footer">
            {!isAttacking ?
                <section className="action-buttons">
                    <img onClick={() => onFinish("map")} className="pokeball-button" src="/running.svg" alt="run" />
                    <img onClick={handleAttack} className="pokeball-button" src="/swords.svg" alt="attack" />
                    <>
                        {buttons.map((button) => {
                            return <img  className="pokeball-button" key={button.name} onClick={() => button.onClick(firstPokemon, secondPokemon)} src={button.image} alt={button.name} />
                        })}
                    </>
                </section>
                :
                <section className="action-buttons">
                    <img  className="pokeball-button disabled" src="/running.svg" alt="run" />
                    <img  className="pokeball-button disabled" src="/swords.svg" alt="attack" />

                    <>
                    {buttons.map((button) => {
                            return <img  className="pokeball-button disabled" key={button.name} onClick={() => button.onClick(firstPokemon, secondPokemon)} src={button.image} alt={button.name} />
                        })}
                    </>
                </section>
            }
            </section>
        </>
    )
}

export default Combat;