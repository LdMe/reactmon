import { useEffect, useState, useContext, useRef, useLayoutEffect } from "react";
import PokemonContext from "../context/pokemonContext";
import MisPokemons from "./MisPokemons";
import { attack, getPokemon, clearFight,getTrainerPokemons as getTrainerPkmns } from "../utils/fetchPokemons";
import Combat from "../components/combat/CombatComponent";


const TrainerCombat = ({ pokemons = null, onFinish }) => {
    const { misPokemons, addLevel, updatePokemon } = useContext(PokemonContext);
    const [trainer, setTrainer] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [isWaiting, setIsWaiting] = useState(false);

    useEffect(() => {
        if (trainer !== null) {
            return;
        }
        getTrainerPokemons();
        return () => {
            clearFight();
        }
    }, [pokemons]);

    useEffect(() => {
        if (misPokemons[0].hp === 0) {
            if (isPlayerTurn) {
                setIsPlayerTurn(false);
            }
            return;
        }
        setTimeout(() => {
            setIsPlayerTurn(true);
        }, 400);
    }, [misPokemons[0]]);

    useEffect(() => {
        if (!isPlayerTurn && !isWaiting) {
            handleEnemyAttack();
        }
    }, [isPlayerTurn,isWaiting]);

    useEffect(() => {
        if (trainer && trainer.pokemons.length > 0 && trainer.pokemons[0].hp === 0) {
            setTimeout(() => {
                onTrainerPokemonDead();
            }, 600);
        }
    }, [trainer]);

    const onTrainerPokemonDead = async () => {
        const firstPokemon = trainer.pokemons[0];
        const firstAlivePokemon = trainer.pokemons.find((pokemon) => pokemon.hp > 0);
        await addLevel(misPokemons[0]);
        if (!firstAlivePokemon) {

            alert("Has ganado");
            onFinish("map");
            return;
        }
        swapTrainerPokemons(firstPokemon, firstAlivePokemon);
    }
    const swapTrainerPokemons = async (pokemon1, pokemon2) => {
        const newTrainerPokemons = [...trainer.pokemons];
        const index1 = newTrainerPokemons.findIndex((pokemon) => pokemon._id === pokemon1._id);
        const index2 = newTrainerPokemons.findIndex((pokemon) => pokemon._id === pokemon2._id);
        const temp = newTrainerPokemons[index1];
        newTrainerPokemons[index1] = newTrainerPokemons[index2];
        newTrainerPokemons[index2] = temp;
        setTrainer({ ...trainer, pokemons: newTrainerPokemons });
    }
    const getTrainerPokemons = async () => {

        const numMyPokemons = misPokemons.length;
        const maxLevel = Math.max(...misPokemons.map((pokemon) => pokemon.level));
        const trainerPokemons = await getTrainerPkmns(pokemons,numMyPokemons,maxLevel);
        setTrainer({ pokemons: trainerPokemons });
    }
    const handleAttack = async () => {
        try {
            if (!isPlayerTurn) {
                return;
            }
            setIsPlayerTurn(false);
            const result = await attack(misPokemons[0], trainer.pokemons[0]);
            if (result === null) {
                return;
            }
            const newTrainerPokemon = { ...result.defender };
            const newPokemons = [...trainer.pokemons];
            newPokemons[0] = newTrainerPokemon;
            setTrainer({ ...trainer, pokemons: newPokemons });

        } catch (error) {
            setIsPlayerTurn(true);

        }

    }
    const handleEnemyAttack = async () => {
        setTimeout(async () => {
            try {
                aiAttack();
            } catch (error) {
                console.error(error);
            }

        }, 400);
    }
    const aiAttack = async () => {
        try {
            const result = await attack(trainer.pokemons[0], misPokemons[0]);
            const newPlayerPokemon = { ...misPokemons[0], hp: result.defender.hp };
            updatePokemon(newPlayerPokemon);
        } catch (error) {
            console.error(error);
        }
    }
    const handleSwapPokemons = () => {
        setIsWaiting(false);
    }
    const handleWaitNextTurn = () => {
        console.log("waiting next turn");
        setIsWaiting(true);
        setIsPlayerTurn(false);
    }
    if (trainer !== null) {
        return (
            <section className="combat-section">

                {trainer.pokemons.map((pokemon) => {
                    const isDead = pokemon.hp === 0;
                    return <img key={pokemon._id} className={"pokeball-button " + (isDead && "disabled")} src="/pokeball.svg" alt="pokemon" />

                })}

                <Combat
                    playerPokemon={misPokemons[0]}
                    enemyPokemon={trainer.pokemons[0]}
                    onFinish={onFinish}
                    isPlayerTurn={isPlayerTurn}
                    onAttack={handleAttack}
                    canExit={false}
                />
                <MisPokemons
                    onFinish={() => { }}
                    isView={false}
                    onUpdate={handleSwapPokemons}
                    onUpdateStart={handleWaitNextTurn}
                    disabled={!isPlayerTurn}
                />
            </section>
        );
    }
    return (
        <section className="loading-section">
            <img className="pokeball-loading rotate" src="/pokeball.svg" />
        </section>
    )
}

export default TrainerCombat;