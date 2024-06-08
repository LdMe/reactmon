import { getName } from "../../utils/utils";
import "./Type.css";
const Type = ({ type }) => {
    console.log("type", type);
    return <span key={type.name} className={type.name + " type__name"}>{getName(type, "es")} </span>
}

export default Type;