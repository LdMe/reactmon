import Pokemon from "../PokemonComponent"
import "../Pokemon.scss"
const PokemonCarousel = ({pokemons,className="pokemon-container",pokemonClassName="",showHp=true,selected=null,onSelect,children=()=>{},disabled=false,fullInfo=false,isCombat=false }) =>{
    const handleIsPokemonDisabled = (pokemon) => {
        return disabled || ( pokemon.hp === 0)
    }
    return (
        <section className={className}>
        {pokemons.map((pokemon) => (
            <Pokemon
                key={pokemon._id}
                data={pokemon}
                onClick={() => onSelect(pokemon)}
                isCombat={isCombat}
                defaultClassName={pokemonClassName + " " + (handleIsPokemonDisabled(pokemon) ? "disabled" : "")}
                isSelected={selected !== null && selected._id === pokemon._id}
                fullInfo={fullInfo}
                showHp={showHp}
            >
                {children(pokemon)}
            </Pokemon>
        ))}
    </section>
    )
}

export default PokemonCarousel
