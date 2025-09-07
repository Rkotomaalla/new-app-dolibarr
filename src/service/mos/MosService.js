import axios from "axios";
import ApiService from "../ApiService";

const baseUrl=import.meta.env.VITE_BASE_URL;
const headers= {
    "Content-Type": "application/json",
    "DOLAPIKEY" : localStorage.getItem("token")
};

export default{
    async saveMos(data){
        let jsonData=JSON.stringify(data);
        try {
            console.log(jsonData);
            let id= await axios.post(baseUrl+"mos",jsonData,{headers});
            console.log(id.data);
            return id.data;
        } catch (error) {
            throw error;
        }
    },

    async putValidate(item,status){
        try{
            let mos={};
            mos.status=status;
            mos.ref="auto";
           let json=JSON.stringify(mos);
           console.log(json);
            await axios.put(baseUrl+"mos/"+item.id,json,{headers});
        }catch(error){
            throw error;
        }
    },

     getMosInventoryCode(item){
        let data={};
        data.inventorylabel="Ordre de fabrication N°"+item.id+"-"+item.bom;
        data.inventorycode="MOS-"+this.generateUniqueCode();
        return data;
    },

    async postPC(consume,product,inventory,mosItem){
        try{
            let data={};
            data.inventorylabel=inventory.inventorylabel;
            data.inventorycode=inventory.inventorycode;
            data.autoclose=1;
            data.arraytoconsume=consume;
            data.arraytoproduce=product;
            

            let json=JSON.stringify(data);
            console.log(json);
            await axios.post(baseUrl+"mos/"+mosItem.id+"/produceandconsumeall",json,{headers});
        }catch(error){
            throw error;
        }
    },

// inventaire
    async setConsumeArray(item){
        try {
            let res=await axios.get(baseUrl+"boms/"+item.idBom+"/lines",{headers});
            let consumeData=[];
            for(let d of res.data){
                let row={};
                let prod=await ApiService.getById("products",d.fk_product);
                row.prod=prod.ref
                row.objectid=d.fk_product;
                row.qty=d.qty*item.qty;
                consumeData.push(row);
            }
            return consumeData; 
        } catch (error) {
            throw error;
        }
    },
    async setProductArray(item){
        try {
            let res1=await ApiService.getById("boms",item.idBom);
            let res2=await ApiService.getById("products",item.idProduct); 
            let qty=res1.qty*item.qty;
            let product=res2.ref;
            let res={};
            res.qty=qty;
            res.ref=product;
            res.objectid=item.idProduct;
            return res;
        } catch (error) {
            throw error;
        }
    },
// inventaire
    generateUniqueCode() {
            const timestamp = Date.now();
            return timestamp;
    },


        async getList(){
        try {
            let mos=[];
            let data=await ApiService.getAll("mos");
            for (let d of data) {
                  let line = await this.setData(d);
                  mos.push(line);
            }
            return mos;
        } catch (error) {
            throw error;
        }
    },

    async setData(data){
        try {   
            let bom=await ApiService.getById("boms",data.fk_bom);
            let product=await ApiService.getById("products",data.fk_product);
            let res={};

            res.id=data.id;
            res.ref=data.ref;
//  Boms  
            res.idBom=data.fk_bom;
            res.bom=bom.ref;
//  Types
            res.idType=data.mrptype;
            res.type=this.getType(data.mrptype);
//  Products
            res.idProduct=data.fk_product;
            res.product=product.ref;

            res.qty=Number(data.qty);
            res.etat=data.status;
            res.load=false;
            return res;
        } catch (error) {
            throw error;
        }
    },      
            

    async setDataWithLines(data){
        try {
            let bom=await ApiService.getById("boms",data.fk_bom);
            let product=await ApiService.getById("products",data.fk_product);

            let res={};
            res.id=data.id;
            res.ref=data.ref;
//  Boms  
            res.idBom=data.fk_bom;
            res.bom=bom.ref;
//  Types
            res.idType=data.mrptype;
            res.type=this.getType(data.mrptype);
//  Products
            res.idProduct=data.fk_product;
            res.product=product.ref;

// lines
            res.lines=data.lines;
            res.qty=Number(data.qty);
            res.etat=data.status;

            return res;
        } catch (error) {
            throw error;
        }
    },
    async setMosData(idBom,qty,mosType,fk_product){
         try {
                let id_product=null;
                if(fk_product) id_product=fk_product;
                else {
                    let bomsDetail=await ApiService.getById("boms",idBom); 
                    id_product=bomsDetail.fk_product;
                }
                if(qty <= 0 || !qty || mosType===null){
                    throw new Error("les valeurs ne doivent pas etre vide");
                }
                let data={};
                data["mrptype"]=mosType;
                data["ref"]=this.generateProvisionalRef();
                data["qty"]=Number(qty);
                data["status"]=0;
                data["fk_product"]=id_product;
                data["fk_bom"]=idBom;
                console.log(data);
                return data;
            } catch (error) {
            throw error;
            }
    },

    generateProvisionalRef() {
            const timestamp = Date.now();
            return `(PROV${timestamp})`;
    },

    
  getType(type){
        if(type==1){
            return "Déassemblage";
        }else{
            return "Fabrication";
        }
    }

}
