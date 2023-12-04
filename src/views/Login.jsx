import { useState } from "react";
import loggedInContext from "../context/loggedInContext";
import { useContext } from "react";
import '../styles/Login.css';
const VITE_BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST;
const Login = ({ onFinish }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const { login } = useContext(loggedInContext);

    const handleLogin = async () => {
        try{
            
        const VITE_BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST;
        const response = await fetch(VITE_BACKEND_HOST + "/api/user/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        console.log(data);
        if (data.error) {
            alert(data.error);
        }
        else {
            login(data.result.username);
            onFinish("map");
        }
    }
    catch(e){
        console.log(e);

    }
    }
    const handleRegister = async () => {
        if (password !== passwordConfirm) {
            alert("Las contraseñas no coinciden");
            return;
        }
        const response = await fetch(VITE_BACKEND_HOST + "/api/user/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password, passwordConfirm })
        });
        const data = await response.json();
        if (data.error) {
            alert(data.error);
        }
        else {
            setIsRegister(false);
        }
    }
    return (
        <>
            <h2>{isRegister ? "Registro" : "Login"}</h2>
            <form className="login-form">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {isRegister &&
                    <>
                        <label htmlFor="passwordConfirm">Confirmar Password</label>
                        <input type="password" id="passwordConfirm" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                    </>
                }
                <button type="button" onClick={isRegister ? handleRegister : handleLogin}>{isRegister ? "Registrarse" : "Login"}</button>
                <button type="button" onClick={() => setIsRegister(!isRegister)}>{isRegister ? "Ya tengo cuenta" : "Registrarse"}</button>
                <button type="button" onClick={() => onFinish("map")}>Volver</button>
            </form>
        </>
    )
}

export default Login;