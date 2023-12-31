import { useEffect, useState, useContext, useRef, useLayoutEffect } from "react";
import Pokemon from "../components/PokemonComponent";
import PokemonContext from "../context/pokemonContext";
import MisPokemons from "./MisPokemons";
import { attack, getPokemon, clearFight } from "../utils/fetchPokemons";
import Combat from "../components/combat/CombatComponent";


const TrainerCombat = ({ pokemons = null, onFinish }) => {
    const { misPokemons, swapPokemons, removePokemon, getMisPokemons, addLevel, updatePokemon } = useContext(PokemonContext);
    const [myPokemon, setMyPokemon] = useState(misPokemons[0]);
    const [trainer, setTrainer] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const footerRef = useRef(null);
    const myPokemonRef = useRef(null);
    const trainerRef = useRef(null);

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
        if (misPokemons.length > 0) {
            setMyPokemon(misPokemons[0]);
        }
    }, [misPokemons[0]]);

    useEffect(() => {
        myPokemonRef.current = myPokemon;
        if (myPokemon.hp === 0) {
            if (isPlayerTurn) {
                setIsPlayerTurn(false);
            }
            return;
        }
        setTimeout(() => {
            setIsPlayerTurn(true);
        }, 400);
    }, [myPokemon]);
    useEffect(() => {
        if (!isPlayerTurn) {
            handleEnemyAttack();
        }
    }, [isPlayerTurn]);

    useEffect(() => {
        trainerRef.current = trainer;
        if (trainer && trainer.pokemons.length > 0 && trainer.pokemons[0].hp === 0) {
            setTimeout(() => {

                onTrainerPokemonDead();
            }, 600);
        }
    }, [trainer]);

    const onTrainerPokemonDead = async () => {
        const firstPokemon = trainerRef.current.pokemons[0];
        const firstAlivePokemon = trainerRef.current.pokemons.find((pokemon) => pokemon.hp > 0);
        await addLevel(myPokemonRef.current);
        if (firstAlivePokemon === undefined) {

            alert("Has ganado");
            onFinish("map");
            return;
        }
        swapTrainerPokemons(firstPokemon, firstAlivePokemon);
    }
    const swapTrainerPokemons = async (pokemon1, pokemon2) => {
        const newTrainerPokemons = [...trainerRef.current.pokemons];
        const index1 = newTrainerPokemons.findIndex((pokemon) => pokemon._id === pokemon1._id);
        const index2 = newTrainerPokemons.findIndex((pokemon) => pokemon._id === pokemon2._id);
        const temp = newTrainerPokemons[index1];
        newTrainerPokemons[index1] = newTrainerPokemons[index2];
        newTrainerPokemons[index2] = temp;
        setTrainer({ ...trainerRef.current, pokemons: newTrainerPokemons });
    }
    const getTrainerPokemons = async () => {
        if (pokemons === null) {
            const numMyPokemons = misPokemons.length;
            const n = Math.min(6, Math.floor(Math.random() * numMyPokemons) + 2);
            return getRandomTrainerPokemons(n);
        }
        const newPokemons = await Promise.all(pokemons.map(async (pokemon) => {
            return await getPokemon(pokemon.id, pokemon.level, true);
        }));
        setTrainer({ pokemons: newPokemons });
    }
    const getRandomTrainerPokemons = async (numOfPokemons) => {
        const pokemons = [];
        for (let i = 0; i < numOfPokemons; i++) {
            const maxLevel = Math.max(...misPokemons.map((pokemon) => pokemon.level));
            const randomLevel = Math.max(1, Math.floor(maxLevel * 0.75 + Math.random() * maxLevel * 0.50));
            pokemons.push(getPokemon(null, randomLevel, true));
        }
        await Promise.all(pokemons).then((values) => {
            setTrainer({ pokemons: values });
        });
    }
    const handleAttack = async () => {
        try {
            if (!isPlayerTurn) {
                return;
            }
            setIsPlayerTurn(false);
            const result = await attack(myPokemon, trainer.pokemons[0]);
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
            const result = await attack(trainerRef.current.pokemons[0], myPokemonRef.current);
            const newPlayerPokemon = { ...myPokemonRef.current, hp: result.defender.hp };
            updatePokemon(newPlayerPokemon);
        } catch (error) {
            console.error(error);
        }
    }
    const handleSwapPokemons = () => {
        setIsPlayerTurn(false);
        //setWildPokemon(wildPokemon => wildPokemon);
    }
    if (trainer !== null) {
        return (
            <section className="combat-section">

                {trainer.pokemons.map((pokemon) => {
                    const isDead = pokemon.hp === 0;
                    return <img key={pokemon._id} className={"pokeball-button " + (isDead && "disabled")} src="/pokeball.svg" alt="pokemon" />

                })}

                <Combat
                    playerPokemon={myPokemon}
                    enemyPokemon={trainer.pokemons[0]}
                    onFinish={onFinish}
                    isPlayerTurn={isPlayerTurn}
                    handleAttack={handleAttack}
                    canExit={false}
                />
                <MisPokemons
                    onFinish={() => { }}
                    isView={false}
                    onUpdate={handleSwapPokemons}
                    disabled={!isPlayerTurn}
                />
                <div ref={footerRef} />
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