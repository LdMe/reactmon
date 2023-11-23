import { createContext } from "react";

const pokemonContext = createContext({
    misPokemons:[],
    setMisPokemons : () =>{}
});

export default pokemonContext;