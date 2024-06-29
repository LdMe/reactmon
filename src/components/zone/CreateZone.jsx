import {useState} from 'react';


const CreateZone = ({onFinish}) => {
    const [name, setName] = useState("");
    const [habitat, setHabitat] = useState("");
    const [error, setError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        
