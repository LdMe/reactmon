import "./Icon.scss";

const ConnectedIcon = ({connected=true}) => {
    return (
        <span className={"icon__circle" + (connected ? " connected" : " disconnected")}>
        </span>
    )
}

export default ConnectedIcon;