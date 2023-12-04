/*
componente que tiene un socket como prop y controla la batalla de dos usuarios
*/


import { useState, useEffect, useContext, useRef } from 'react';
import Pokemon from '../../components/PokemonComponent'
import {  attack as attackApi } from "../../utils/fetchPokemons";
import PokemonContext from "../../context/pokemonContext";

import '../../styles/Combat.css';
const Combat = ({ socket, pokemon1, pokemon2, rivalName, onChange1,onChange2, onFinish, buttons = [] }) => {
    const [isAttacking, setIsAttacking] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const isWinner = useRef(false);
    const {addLevel} = useContext(PokemonContext);
    useEffect(() => {
        setTimeout(() => {
            setIsStarted(true);
        }, 1000);
        socket.on("attack", async (data) => {
            console.log("attack", data)
            const newPokemon = await onChange1(data.pokemon);
            setIsAttacking(false);
        });
        socket.on("combat-end", async (data) => {
            alert("Has ganado");
            isWinner.current = true;
            onFinish("map");
        });
        socket.on("update", async (data) => {
            console.log("update data", data)
            onChange2(data.pokemon);
            // onChange(data.pokemon);
        });
        return () => {
            if (!isWinner.current) {
                socket.emit("combat-end", { room: "main", username: rivalName });
                alert("Has perdido");
            }
            onFinish("chat");

            socket.off("attack");
            socket.off("update");
            socket.off("combat-end");

        }
    }, []);
    useEffect(() => {
        
    }, [pokemon2]);

    useEffect(() => {
        socket.emit("update", { room: "main", pokemon: pokemon1, username: rivalName });
    }, [pokemon1]);

    const attack = async (attacker, defender) => {

        if (attacker.hp === 0 || defender.hp === 0) {
            return defender;
        }
        const move = attacker.activeMoves[Math.floor(Math.random() * attacker.activeMoves.length)];
        const data = await attackApi(attacker, defender, move);
        console.log("attack", data.defender._id)
        socket.emit("attack", {pokemon:data.defender ,username:rivalName});
        if (data.error) {
            alert(data.error);
            onFinish("map");
            return defender;
        }
        const newAttacker = data.attacker;
        const newDefender = data.defender;
        

        return newDefender;

    }

    const handleAttack = async () => {
        if (isAttacking) {
            return;
        }
        setIsAttacking(true);
        await attack(pokemon1, pokemon2);
        socket.emit("attack", pokemon2);
    }
    return (
        <>
        <article className="player-container enemy">
            <h2>{rivalName}</h2>
            <Pokemon data={pokemon2} isEnemy={true} />
        </article>
        <article className="player-container">
            <h2>Tú</h2>
            <Pokemon data={pokemon1} isFront={false} />
        </article>
            <section className="button-footer">
                {!isAttacking ?
                    <section className="action-buttons">
                        <img onClick={handleAttack} className="pokeball-button" src="/swords.svg" alt="attack" />
                        <>
                            {buttons.map((button) => {
                                return <img className="pokeball-button" key={button.name} onClick={() => button.onClick(pokemon1, pokemon2)} src={button.image} alt={button.name} />
                            })}
                        </>
                    </section>
                    :
                    <section className="action-buttons">
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