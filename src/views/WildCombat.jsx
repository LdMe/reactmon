import { useEffect, useState, useContext, useRef, useLayoutEffect } from "react";
import PokemonContext from "../context/pokemonContext";
import MisPokemons from "./MisPokemons";
import { getPokemon, clearFight, attack, capture } from "../utils/fetchPokemons";
import Combat from "../components/combat/CombatComponent";


const WildCombat = ({ onFinish }) => {
    const [wildPokemon, setWildPokemon] = useState(null);
    const { misPokemons, updatePokemon, addPokemon, addLevel, getMisPokemons } = useContext(PokemonContext);
    const [isEnded, setIsEnded] = useState(false);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const footerRef = useRef(null);

    useEffect(() => {
        getMisPokemons();
        getPokemonState();
        setTimeout(() => {
            if (footerRef.current === null) {
                return;
            }
            footerRef.current.scrollIntoView({ behavior: "smooth" });
        }, 1500);
        return () => {
            clearFight();
        }
    }, []);
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
        finishCombat();

    }, [isEnded, wildPokemon]);

    useEffect(() => {
        if (!isPlayerTurn) {
            handleEnemyAttack();
        }
    }, [isPlayerTurn]);

    const finishCombat = async () => {
        if (isEnded) {
            return;
        }
        if (wildPokemon !== null && wildPokemon.hp === 0) {
            await clearFight();
            const result = await addLevel(misPokemons[0]);
            setIsEnded(true);
            setTimeout(() => {
                alert("Has ganado la pelea");
                onFinish("map");
            }, 600);
        }
    }
    const getPokemonState = async () => {
        try {
            const maxLevel = Math.max(...misPokemons.map((pokemon) => pokemon.level));
            const multiplier = Math.floor(Math.random() * maxLevel) + 3;

            const pokemonLevel = Math.min(maxLevel, multiplier);
            //const pokemonLevel = 1;
            const id = "random";
            const pokemonData = await getPokemon(id, pokemonLevel);

            setWildPokemon(pokemonData);
        } catch (error) {
            console.error(error);
            alert("No ha habido suerte buscando pokemons salvajes");
            onFinish("map");
        }
    }

    const handleCapture = async () => {
        if(!isPlayerTurn || isEnded){
            return;
        }
        setIsEnded(true);
        if (misPokemons.length === 6) {
            alert("No puedes capturar más pokemons");
            
            onFinish("map");
            return;
        }
        setIsPlayerTurn(false);
        const data = await capture(wildPokemon);
        if (data === null) {
            alert("el pokemon se ha escapado");
            onFinish("map");
            return;
        }
        alert("Has capturado al pokemon");
        onFinish("map");
    }


    const handleSwapPokemons = () => {
        setIsPlayerTurn(false);
        //setWildPokemon(wildPokemon => wildPokemon);
    }
    const handleEnemyAttack = async () => {
        if (isEnded) {
            return;
        }
        setTimeout(async () => {
            try {
                const result = await attack(wildPokemon, misPokemons[0]);
                const newPlayerPokemon = { ...misPokemons[0], hp: result.defender.hp };
                updatePokemon(newPlayerPokemon);
            } catch (error) {
                console.error(error);
            }

        }, 400);
    }
    const handleAttack = async () => {
        try {
            if (!isPlayerTurn || isEnded) {
                return;
            }
            setIsPlayerTurn(false);
            const result = await attack(misPokemons[0], wildPokemon);
            const newWildPokemon = { ...wildPokemon, hp: result.defender.hp };
            setWildPokemon(newWildPokemon);
        } catch (error) {
            setIsPlayerTurn(true);

        }

    }

    if (wildPokemon) {
        return (
            <>
                <Combat
                    playerPokemon={misPokemons[0]}
                    enemyPokemon={wildPokemon}
                    onFinish={onFinish}
                    isPlayerTurn={isPlayerTurn}
                    handleAttack={handleAttack}
                    buttons={[{ name: "Capturar", onClick: handleCapture, image: "/pokeball.svg" }]}
                />
                <MisPokemons
                    onFinish={() => { }}
                    isView={false}
                    onUpdate={handleSwapPokemons}
                />
                <div ref={footerRef} />
            </>
        )
    }
    return (
        <section className="loading-section">
            <img className="pokeball-loading rotate" src="/pokeball.svg" />
        </section>
    )
}

export default WildCombat;