import { useContext } from "react";
import loggedInContext from "../context/loggedInContext";

const Logout = ({onFinish,auto=false}) => {
    const { setIsLogged } = useContext(loggedInContext);
    
    const logout = async() => {
        const VITE_BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST;
        const response = await fetch(VITE_BACKEND_HOST+"/api/user/logout",{
            method:"POST",
            credentials:"include"
        });
        setIsLogged(false);
        onFinish("login");
        
    };
    return (
        <>
            <button onClick={logout}>Logout</button>
        </>
    );
}

export default Logout