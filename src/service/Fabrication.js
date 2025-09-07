
import axios from "axios";
const baseUrl=import.meta.env.VITE_BASE_URL;
const headers= { DOLAPIKEY : localStorage.getItem("token")};

export async function deleteMos(){
    console.log("Fontion delete ordre de fabrication\n");
    const attributes=await axios.get(baseUrl+"mos",{headers});
    console.log(attributes.data.length+" Ordre de fabrications to delete");
    for(let mos of attributes.data){
        await axios.delete(baseUrl+"mos/"+mos.id, {headers})
    }
}
