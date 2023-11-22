import ChoosePokemon from "../views/ChoosePokemon"
import Map from "../views/Map";
import WildCombat from "../views/WildCombat";

const gameStates = {
    "choose": {
        component: ChoosePokemon
    },
    "map" : {
        component: Map
    },
    "wild":{
        component: WildCombat
    }
}

export default gameStates;