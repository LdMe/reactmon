import ChoosePokemon from "../views/ChoosePokemon"
import Map from "../views/Map";
import WildCombat from "../views/WildCombat";
import HealPokemons from "../views/healPokemons/HealPokemons";
import MisPokemons from "../views/MisPokemons";
import Login from "../views/Login";
import Logout from "../components/Logout";
import Stadium from "../views/stadium/StadiumComponent";
import TrainerCombat from "../views/TrainerCombat";
import AdminView from "../views/admin/Admin";

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
    "trainer":{
        component: TrainerCombat
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
    "logout": {
        component: Logout
    },
    "stadium": {
        component: Stadium
    },
    "admin": {
        component: AdminView
    }
}

export default gameStates;