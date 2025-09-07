
import axios from "axios";
const baseUrl=import.meta.env.VITE_BASE_URL;
const headers= { DOLAPIKEY : localStorage.getItem("token")};

export async function deleteBom(){
    console.log("fonction delete Bill of Materials\n");
    const attributes=await axios.get(baseUrl+"boms",{headers});
    console.log(attributes.data.length+" Bom to delete");
    for(let bom of attributes.data){
        await axios.delete(baseUrl+"boms/"+bom.id, {headers})
    }
}
