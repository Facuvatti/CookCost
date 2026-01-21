type method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type anyObject = Record<string,unknown>;
const backend = "http://localhost:3000/";

async function httpRequest(endpoint:string,method:method,body:anyObject | null=null,url=backend,credentials:boolean=false) { // Es un handler para formularios
    const options:RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    if(credentials) options.credentials = "include";
    let data:anyObject | undefined = undefined;
    if (body) data = {...body};
    options.body = JSON.stringify(data);
    const response = await fetch(url + endpoint, options)
    if('error' in response){
        console.log(response.error);
        return;
    }
    try {
        const json = await response.json();
        if(!response.ok) console.log(response);
        return json;
    } catch(e) {
        console.error("Error al intentar convertir el json",e);
        console.log(response);
    }
}



export default httpRequest;