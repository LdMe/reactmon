import { useEffect, useState, useContext, useRef } from "react";
import PokemonContext from "../context/pokemonContext";
import MisPokemons from "./MisPokemons";
import { clearFight, attack, capture,getWildPokemon as getWildPkmn } from "../utils/fetchPokemons";
import Combat from "../components/combat/CombatComponent";


const WildCombat = ({ onFinish }) => {
    const [wildPokemon, setWildPokemon] = useState(null);
    const { misPokemons, updatePokemon, addPokemon, addLevel, getMisPokemons } = useContext(PokemonContext);
    const [isEnded, setIsEnded] = useState(false);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [isWaiting, setIsWaiting] = useState(false);

    /**
     * useEffect inicial que carga los pokemons del usuario y el pokemon salvaje
     * Al finalizar la pelea, se limpia el combate
     */
    useEffect(() => {
        getMisPokemons();
        getWildPokemon();
        return () => {
            clearFight();
        }
    }, []);


    /**
     * useEffect que elige el turno del jugador, cuando el pokemon del jugador muere, el turno pasa al pokemon salvaje
     * sino, el turno pasa al jugador despues de 400ms
     */
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
        if (!isPlayerTurn && !isWaiting) {
            handleEnemyAttack();
        }
    }, [isPlayerTurn,isWaiting]);

    /**
     * Si el pokemon salvaje muere, se limpia el combate y se añade un nivel al pokemon del jugador
     */
    const finishCombat = async () => {
        if (isEnded) {
            return;
        }
        if (wildPokemon !== null && wildPokemon.hp === 0) {
            await clearFight();
            if (wildPokemon.level > misPokemons[0].level) {
                const result = await addLevel(misPokemons[0]);
            }
            setIsEnded(true);
            setTimeout(() => {
                alert("Has ganado la pelea");
                onFinish("map");
            }, 600);
        }
    }

    const getWildPokemon = async () => {
        let maxLevel = Math.max(...misPokemons.map((pokemon) => pokemon.level));
        const pokemon = await getWildPkmn(maxLevel);
        if(pokemon.error || !pokemon) {
            alert("No ha habido suerte buscando pokemons salvajes");
            onFinish("map");
        }
        setWildPokemon(pokemon);
    }

    const handleCapture = async () => {
        if (!isPlayerTurn || isEnded) {
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
        const lastPokemon = data.pokemons[data.pokemons.length - 1];
        addPokemon(lastPokemon);
        alert("Has capturado al pokemon");
        onFinish("map");
    }

    /**
     * Funcion que se ejecuta cuando el jugador cambia de pokemon, el turno pasa al pokemon salvaje
     */
    const handleSwapPokemons = () => {
        setIsWaiting(false);
    }
    const handleWaitNextTurn = () => {
        console.log("waiting next turn");
        setIsWaiting(true);
        setIsPlayerTurn(false);
    }
    
    const handleEnemyAttack = async () => {
        if (isEnded) {
            return;
        }
        setTimeout(async () => {
            aiAttack();
        }, 400);
    }

    const aiAttack = async () => {
        try {
            
            const result = await attack(wildPokemon, misPokemons[0]);
            if(result.error) {
                console.error(result.error);
                return;
            }
            const newPlayerPokemon = { ...misPokemons[0], hp: result.defender.hp };
            updatePokemon(newPlayerPokemon);
        } catch (error) {
            console.error(error);
        }
    }

    const handleAttack = async () => {
        try {
            if (!isPlayerTurn || isEnded) {
                return;
            }
            setIsPlayerTurn(false);
            const result = await attack(misPokemons[0], wildPokemon);
            
            setWildPokemon(result.defender);
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
                    onAttack={handleAttack}
                    buttons={[{ name: "Capturar", onClick: handleCapture, image: "/pokeball.svg" }]}
                />
                <MisPokemons
                    onFinish={() => { }}
                    isView={false}
                    onUpdate={handleSwapPokemons}
                    onUpdateStart={handleWaitNextTurn}
                    disabled={!isPlayerTurn}
                />
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