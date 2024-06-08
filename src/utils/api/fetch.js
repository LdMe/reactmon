const API_URL = import.meta.env.VITE_BACKEND_HOST

const fetchData = async(route,method,inputData=null)=>{
    const url = new URL(API_URL + route);
    const fetchOptions = {
        method:method,
        headers:{
            "Content-Type": "application/json"
        },
        credentials: "include"
    }
    if(inputData){
        if(method === "get"){
            Object.keys(inputData).forEach(key=>{
                url.searchParams.append(key,inputData[key]);
            })
        }
        else if(method === "post" || method === "put" || method === "patch"){
            fetchOptions.body = JSON.stringify(inputData);
        }
    }
    try {
        const result = await fetch(url.toString(),fetchOptions);
        checkStatus(result);
        const data  = await result.json();
        return data;
    } catch (error) {
        console.log("error",error);
        return ({error:error.message})
    }
}
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        console.log("response",response);
        const error = new Error(response.statusText);
        error.response = response;
        error.status = response.status;
        throw error;
    }
}
export default fetchData;
