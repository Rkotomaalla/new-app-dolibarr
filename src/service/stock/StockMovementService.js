import axios from 'axios';
const baseUrl=import.meta.env.VITE_BASE_URL;
const headers= {    
    "Content-Type": "application/json",
     "DOLAPIKEY" : localStorage.getItem("token")
};
export default {
    async saveStockInitial(jsonObject,idProduct){
        if(jsonObject.stock > 0){
            let json = {
                "product_id" : idProduct,
                "warehouse_id": jsonObject.fk_default_warehouse,
                "qty": jsonObject.stock, 
                "type" : 3,
                "movementlabel" : "Stock initial"
        }
        let res= await axios.post(baseUrl+"stockmovements",json,{headers});
        return res.data;
        }
    },
}
