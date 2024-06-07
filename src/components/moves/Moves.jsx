import { getName } from "../../utils/utils"

const Moves = ({ moves }) => {
    const movesPad = [];
    for (let i = moves.length; i < 4; i++) {
        movesPad.push(
            <tr key={"pad" + i}>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        )
    }
    return (
        <table >
            <thead>
                <tr>
                    <th>nombre</th>
                    <th>valor</th>
                    <th>tipo</th>
                </tr>
            </thead>
            <tbody>
                {moves.map((move) => {
                    return (
                        <tr key={move.name}>
                            <td>{getName(move, "es")}</td>
                            <td>{move.power}</td>
                            <td className={move.type.name}>{getName(move.type, "es")}</td>
                        </tr>
                    )
                }
                )}
                {
                    movesPad
                }
            </tbody>
        </table>
    )
}

export default Moves