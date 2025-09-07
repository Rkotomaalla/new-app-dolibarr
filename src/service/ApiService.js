import axios from "axios";

const baseUrl=import.meta.env.VITE_BASE_URL;
const headers= { DOLAPIKEY : localStorage.getItem("token"),  Accept: 'application/json'};

export default{
    async getSthByRef(ref,apiName){
        let res=await axios.get(baseUrl+apiName+"?sqlfilters=(t.ref:=:'"+ref+"')",{headers});
        if(res.data.length > 0 ){
            return res.data[0];
        }
    },

    async getAllWithCondition(apiName,condition){
        try {
            let result=await axios.get(baseUrl+apiName+condition,{headers});
            return result.data;    
        } catch (error) {
            throw error;
        }
        
    },
    async getAll(apiName){
          try {
            let result=await axios.get(baseUrl+apiName,{headers});
            return result.data;    
        } catch (error) {
            throw error;
        }
    },
    async getById(apiName,id){
        try{
            let res=await axios.get(baseUrl+apiName+"/"+id,{headers});
            return res.data;
        }catch(error){
            throw error;
        }
    },
    
    async deleteId(apiName,id){
        try {
            await axios.delete(baseUrl+apiName+id,{headers});
        } catch (error) {
                throw error;
        }
    },
        async  setWarehouse(idProduct,allWh) {
        try {
            let data = [];
            let response = await axios.get(baseUrl + "products/" + idProduct + "/stock", { headers });

            if (response.data && response.data.stock_warehouses) {
            let stock_warehouses = response.data.stock_warehouses;

            for (let [warehouseId, s] of Object.entries(stock_warehouses)) {
                let row = {};
                row.reel = s.real;            // quantité réelle
                row.fk_entrepot = warehouseId; // id entrepôt (clé de l’objet dans l’API)
                // récupérer les infos sur l’entrepôt
                let whrRef = await this.getById("warehouses", warehouseId);
                row.whRef = whrRef.ref;
                row.title=row.whRef+ "(Stock: "+row.reel+")";
                row.value=row.fk_entrepot;
                data.push(row);
            }
            }
            data=this.setTheRestWh(data,allWh);
            return data;
        } catch (error) {
            console.error("Erreur setWarehouse:", error);
            throw error;
        }
        },

        setTheRestWh(datas,allWh){
            try {      
                const idsData=new Set(datas.map(item => item.fk_entrepot));
                const dataInter=allWh.filter(item => !idsData.has(item.id));
                for(let d of dataInter){
                        let row={};
                        row.reel=0;
                        row.fk_entrepot=d.id;
                        row.whRef=d.ref;
                        row.title=d.ref+"(Stock: 0)";
                        row.value=d.id;
                        datas.push(row);
                }
                return datas;
            } catch (error) {
                throw error;
            }
        }

}
