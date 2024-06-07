import { getMultiplierColor, getStatWithMultiplier } from "../../utils/utils";
const Stats = ({ stats }) => {
    return (
        <table>
            <tbody>
                <tr className="stat__row">
                    <td>hp</td>
                    <td style={{ color: getMultiplierColor(stats[0].multiplier) }}>{getStatWithMultiplier(stats[0])}</td>
                </tr>
                <tr className="stat__row">
                    <td>ataque</td>
                    <td style={{ color: getMultiplierColor(stats[1].multiplier) }}>{getStatWithMultiplier(stats[1])}</td>
                </tr>
                <tr className="stat__row">
                    <td>defensa</td>
                    <td style={{ color: getMultiplierColor(stats[2].multiplier) }}>{getStatWithMultiplier(stats[2])}</td>
                </tr>
            </tbody>
        </table>
    )
}

export default Stats