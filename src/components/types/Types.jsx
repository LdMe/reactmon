import Type from "./Type"

const Types = ({types}) => {
    return (
        <div className="types">
            <p><b>Tipos:</b>
            {types.map((type) => <Type key={type.name} type={type} />)}
            </p>
        </div>
    )
}

export default Types