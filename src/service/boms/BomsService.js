import Boms from "@/model/Boms";
import ApiService from "../ApiService";

export default{
    async getAllValidateBoms(){
        let boms=await ApiService.getAll("boms");
        return boms.filter(item => item["status"] === 1);
    },
    async generateCsv(data){
        let bm=[];
        for(let d of data){
            let bom=new Boms();
            bom.ref=d["bom_numero"];
            bom.label=d["bom_libelle"];
            bom.bomtype=this.getBomsType(d["bom_type"]);
            bom.qty=Number(d["bom_qte"]);
            let prod_id=await ApiService.getSthByRef(d["bom_produit"],"products");
            bom.fk_product=Number(prod_id.id);
            bom.bom_composition=d["bom_composition"];
            
            let str=JSON.stringify(bom);
            let json=JSON.parse(str);
            // console.log(json);
            bm.push(json);
        }
        return bm;
    },

    getBomsType(type){
        if(type=="fabrication"){
            return 0;
        }else if(type==="Déassemblage" || type==="deassemblage" || type=="Deassemblage"){
            return 1;
        }
    },

    Empty(jsonList) {
                    return (
                        jsonList["ref"] === null || jsonList["ref"] === "" ||
                        jsonList["label"] === null || jsonList["label"] === "" ||
                        jsonList["bomtype"] === null || jsonList["bomtype"] === "" ||
                        jsonList["qty"] === null || jsonList["qty"] === "" ||
                        jsonList["fk_product"] === null || jsonList["fk_product"] === "" ||
                        jsonList["bom_composition"] === null || jsonList["bom_composition"] === ""
                    );
            },
    
}
