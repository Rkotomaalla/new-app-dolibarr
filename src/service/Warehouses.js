
import axios from "axios";
const baseUrl=import.meta.env.VITE_BASE_URL;
const headers= { DOLAPIKEY : localStorage.getItem("token")};

export async function deleteWarehouses(){
    console.log("Fontion delete Warehouses\n");
    const warehouses=await axios.get(baseUrl+"warehouses",{headers});
    console.log(warehouses.data.length+" warehouses to delete");
    for(let wh of warehouses.data){
        await axios.delete(baseUrl+"warehouses/"+wh.id, {headers})
    }
}
