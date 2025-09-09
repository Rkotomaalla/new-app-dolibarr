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
    getMovementPerType(ListStockMovement){
        let movPerType={}
        movPerType.sortie=0;
        movPerType.entree=0;
        for(let list of ListStockMovement){
                if(Number(list.qty) >= 0){
                    movPerType.entree+=Number(list.qty);
                }else movPerType.sortie+=Number(list.qty);
        } 
        return movPerType;  
    },

    getStockInitialPerProduct(ListStockMouvement){
        let initialStock={};
        let stockInitialRow=ListStockMouvement.filter(list => list.inventorycode===null && list.qty!==null);
        if(stockInitialRow.length > 0){
            initialStock.idStock=stockInitialRow[0].id;
            initialStock.initialStock=stockInitialRow[0].qty;
        }else{
            initialStock.idStock=undefined;
            initialStock.initialStock=0;
        }
        return initialStock;
    }
}
