import { useContext, useEffect } from "react";
import loggedInContext from "../context/loggedInContext";

const Logout = ({onFinish,auto=true}) => {
    const { logout } = useContext(loggedInContext);
    
    useEffect(() => {
        if(auto){
            handleLogout();
        }
    }, []);
    const handleLogout = async() => {
        const VITE_BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST;
        const response = await fetch(VITE_BACKEND_HOST+"/api/user/logout",{
            method:"POST",
            credentials:"include"
        });
        logout();
        onFinish("login");
        
    };
    return (
        <>
        {!auto && <button onClick={handleLogout}>Logout</button>}
        </>
    );
}

export default Logout