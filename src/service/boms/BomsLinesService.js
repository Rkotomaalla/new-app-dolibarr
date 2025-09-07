import axios from "axios";
import ApiService from "../ApiService";
const baseUrl=import.meta.env.VITE_BASE_URL;
const headers= {

    // "Content-Type": "application/json",
    "DOLAPIKEY" : localStorage.getItem("token"),
      "Accept": "application/json",
  "Content-Type": "application/json"

};
export default {
    async saveBomsLines(StrBomsLine,bomId){
        let bomlines=await this.setBomsLines(StrBomsLine,bomId);
        for(let line of bomlines){
            // console.log("line to insert "+JSON.stringify(line));
            let JsonStr=JSON.stringify(line);
            let id=await axios.post(baseUrl+"boms/"+bomId+"/lines" ,JsonStr,{headers});
            // return id.data;
        }
    },

    async setBomsLines(strBomsLines){
            const composition = strBomsLines;

    const bomlines = await Promise.all(
        composition.split('+').map(async item => {
            const cleanItem = item.replace(/[()]/g, '');
            const [fk_product, qty] = cleanItem.split(','); // sépare par ','
            
            const val = await ApiService.getSthByRef(fk_product, "products");
            const id = val.id;
            // console.log("id product for bom line "+id);

            return {
                fk_product: Number(id),
                qty: Number(qty)
            };
        })
    );

    return bomlines;

    }
}
