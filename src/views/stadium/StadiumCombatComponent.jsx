/*
componente que tiene un socket como prop y controla la batalla de dos usuarios
*/


import { useState, useEffect, useContext, useRef } from 'react';
import Pokemon from '../../components/PokemonComponent'
import { attack as attackApi, getPokemonById } from "../../utils/fetchPokemons";
import PokemonContext from "../../context/pokemonContext";
import MisPokemons from '../MisPokemons';
import Combat from '../../components/combat/CombatComponent';

import '../../components/combat/Combat.css';
const StadiumCombat = ({ socket, pokemon1, pokemon2, rivalName, onChange1, onChange2, onFinish, buttons = [] }) => {
    const [isAttacking, setIsAttacking] = useState(false);
    const isWinner = useRef(false);
    const footerRef = useRef(null);
    const { addLevel, misPokemons } = useContext(PokemonContext);
    useEffect(() => {
        setTimeout(() => {
            if (footerRef.current === null) {
                return;
            }
            footerRef.current.scrollIntoView({ behavior: "smooth" });
        }, 1500);
        socket.on("attack", async (data) => {
            const pokemon = await getPokemonById(data.pokemon);
            const newPokemon = await onChange1(pokemon);
            const alivePokemons = misPokemons.filter((pokemon) => pokemon.hp > 0);
            if (alivePokemons.length <= 1 && newPokemon.hp === 0) {
                socket.emit("combat-end", { room: "main", username: rivalName });
                return;
            }
            setIsAttacking(false);
        });
        socket.on("combat-end", async (data) => {
            alert("Has ganado");
            isWinner.current = true;
            onFinish("stadium");
        });
        socket.on("update", async (data) => {
            onChange2(data.pokemon);
        });
        // si llega un mensaje de swap, el pokemon rival ha cambiado, por lo que es nuestro turno
        socket.on("swap", async (data) => {
            setIsAttacking(false);
        });
        return () => {
            if (!isWinner.current) {
                socket.emit("combat-end", { room: "main", username: rivalName });
                alert("Has perdido");
                onFinish("stadium");
            }
            socket.off("attack");
            socket.off("update");
            socket.off("combat-end");

        }
    }, []);
    useEffect(() => {

    }, [pokemon2]);

    useEffect(() => {
        socket.emit("update", { room: "main", pokemon: pokemon1._id, username: rivalName });
    }, [pokemon1]);

    const attack = async (attacker, defender) => {
        if (attacker.hp === 0 || defender.hp === 0) {
            return defender;
        }
        const move = attacker.activeMoves[Math.floor(Math.random() * attacker.activeMoves.length)];
        const data = await attackApi(attacker, defender, move);
        socket.emit("attack", { pokemon: data.defender._id, username: rivalName });
        if (data.error) {
            socket.emit("combat-end", { room: "main", username: rivalName });
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
    const handleSwap = async () => {
        socket.emit("swap", { room: "main", username: rivalName });
        setIsAttacking(true);
    }
    
    const style = {
        backgroundImage: "url('/stadium.png')",
    }
    return (
        <>
            <section className="combat" style={style}>
                
                <Combat
                    playerPokemon={pokemon1}
                    enemyPokemon={pokemon2}
                    onFinish={onFinish}
                    isPlayerTurn={!isAttacking}
                    handleAttack={handleAttack}
                    canExit={false}
                    buttons={buttons}
                />



            </section>
            <MisPokemons 
            onFinish={() => { }} 
            isView={false} 
            onUpdate={handleSwap}
            disabled={isAttacking}
            />
            <div ref={footerRef}></div>
        </>
    )
}

export default StadiumCombat;