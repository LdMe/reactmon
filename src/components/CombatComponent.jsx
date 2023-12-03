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
            <h2>Selecciona una acción</h2>
            {!isAttacking ?
                <section className="action-buttons">
                    <button onClick={() => onFinish("map")} >Huir</button>
                    <button onClick={handleAttack}>Pelear</button>
                    <>
                        {buttons.map((button) => {
                            return <button key={button.name} onClick={() => button.onClick(firstPokemon, secondPokemon)}>{button.name}</button>
                        })}
                    </>
                </section>
                :
                <section className="action-buttons">
                    <button disabled={true} >Huir</button>
                    <button disabled={true}>Pelear</button>
                    <>
                        {buttons.map((button) => {
                            return <button key={button.name} onClick={()=>{}} disabled={true}>{button.name}</button>
                        })}
                    </>
                </section>
            }
        </>
    )
}

export default Combat;