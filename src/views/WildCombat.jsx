import { useEffect, useState, useContext, useRef } from "react";
import PokemonContext from "../context/pokemonContext";
import MisPokemons from "./MisPokemons";
import { getPokemon, clearFight, attack, capture } from "../utils/fetchPokemons";
import Combat from "../components/combat/CombatComponent";


const WildCombat = ({ onFinish }) => {
    const [wildPokemon, setWildPokemon] = useState(null);
    const { misPokemons, updatePokemon, addPokemon, addLevel, getMisPokemons } = useContext(PokemonContext);
    const [myPokemon, setMyPokemon] = useState(misPokemons[0]);
    const [isEnded, setIsEnded] = useState(false);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const footerRef = useRef(null);

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
     * useEffect que cambia myPokemon cuando misPokemons cambia
     */
    useEffect(() => {
        if (misPokemons.length > 0) {
            setMyPokemon(misPokemons[0]);
        }
    }
    , [misPokemons[0]]);
    

    /**
     * useEffect que elige el turno del jugador, cuando el pokemon del jugador muere, el turno pasa al pokemon salvaje
     * sino, el turno pasa al jugador despues de 400ms
     */
    useEffect(() => {
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
        finishCombat();

    }, [isEnded, wildPokemon]);

    useEffect(() => {
        if (!isPlayerTurn) {
            handleEnemyAttack();
        }
    }, [isPlayerTurn]);

    /**
     * Si el pokemon salvaje muere, se limpia el combate y se añade un nivel al pokemon del jugador
     */
    const finishCombat = async () => {
        if (isEnded) {
            return;
        }
        if (wildPokemon !== null && wildPokemon.hp === 0) {
            await clearFight();
            if (wildPokemon.level > myPokemon.level) {
                const result = await addLevel(myPokemon);
            }
            setIsEnded(true);
            setTimeout(() => {
                alert("Has ganado la pelea");
                onFinish("map");
            }, 600);
        }
    }

    const getWildPokemon = async () => {
        try {
            let maxLevel = Math.max(...misPokemons.map((pokemon) => pokemon.level));
            maxLevel = Math.max(maxLevel, 10);
            const multiplier = Math.floor(Math.random() * maxLevel) + 1;

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
        console.log("data", data)
        const lastPokemon = data.pokemons[data.pokemons.length - 1];
        const result = await addPokemon(lastPokemon);
        alert("Has capturado al pokemon");
        onFinish("map");
    }

    /**
     * Funcion que se ejecuta cuando el jugador cambia de pokemon, el turno pasa al pokemon salvaje
     */
    const handleSwapPokemons = () => {
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
            const result = await attack(wildPokemon, myPokemon);
            const newPlayerPokemon = { ...myPokemon, hp: result.defender.hp };
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
            const result = await attack(myPokemon, wildPokemon);
            
            setWildPokemon(result.defender);
        } catch (error) {
            setIsPlayerTurn(true);
        }
    }

    if (wildPokemon) {
        return (
            <>
                <Combat
                    playerPokemon={myPokemon}
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
                    disabled={!isPlayerTurn}
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