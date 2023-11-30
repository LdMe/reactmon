import ChoosePokemon from "../views/ChoosePokemon"
import Map from "../views/Map";
import WildCombat from "../views/WildCombat";
import HealPokemons from "../views/HealPokemons";
import MisPokemons from "../views/MisPokemons";

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
    }
}

export default gameStates;