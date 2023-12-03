import ChoosePokemon from "../views/ChoosePokemon"
import Map from "../views/Map";
import WildCombat from "../views/WildCombat";
import HealPokemons from "../views/healPokemons/HealPokemons";
import MisPokemons from "../views/MisPokemons";
import Login from "../views/Login";

const gameStates = {
    "choose": {
        component: ChoosePokemon
    },
    "map" : {
        component: Map
    },
    "wild":{
        component: WildCombat
    },
    "heal": {
        component: HealPokemons
    },
    "list": {
        component: MisPokemons
    },
    "login": {
        component: Login
    },
}

export default gameStates;