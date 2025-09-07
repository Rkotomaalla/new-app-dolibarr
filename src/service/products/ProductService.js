import Products from '@/model/Products';
import EntrepotService from '@/service/entrepot/EntrepotService';
import axios from 'axios';
import Product_nature from './Product_nature';
const baseUrl=import.meta.env.VITE_BASE_URL;
const headers= { DOLAPIKEY : localStorage.getItem("token")};

export default {
            Empty(jsonList) {
                    return (
                        jsonList["label"] === null || jsonList["label"] === "" ||
                        jsonList["ref"] === null || jsonList["ref"] === "" ||
                        jsonList["type"] === null || jsonList["type"] === "" ||
                        jsonList["entrepot"] === null || jsonList["entrepot"] === ""
                    );
            },

// fonction pour transformer les données data en json
            async generateCsv(data){
                let ps=[]
                for(let d of data){
                         let product=new Products();
                        product.ref=d["produit_ref"];
                        product.label=d["produit_nom"];
                        product.finished= Product_nature.getNatureType(d["produit_type"]);
                        product.fk_default_warehouse=Number(await EntrepotService.setEntrepot(d["entrepot"]));
                        product.stock=Number(d["stock_initial"]);
                        if(d["prix_vente"]){
                            product.price=Number(d["prix_vente"]);
                        }else{
                            product.price=Number(d["valeur_stock_initial"] / d ["stock_initial"]);
                        }
                        let str=JSON.stringify(product);
                        let json=JSON.parse(str);
                        ps.push(json);
                    }   
                return ps;
            },
             async  deleteProducts(){
                console.log("Fontion delete Products\n");
            // first attribute and next products
                const attributes=await axios.get(baseUrl+"products/attributes",{headers});
                for(let att of attributes.data){
                    await this.deleteProductAttribute(att.id);
                    await axios.delete(baseUrl+"products/attributes/"+att.id,{headers})
                }
                const products=await axios.get(baseUrl+"products",{headers});
                for(let prod of products.data){
                    await this.deleteProductDetails(prod.id);
                    await axios.delete(baseUrl+"products/"+prod.id,{headers})
                }
            },

             async  deleteProductDetails(idProduct){
    
                    const prices=await axios.get(baseUrl+"products/"+idProduct+"/purchase_prices",{headers});
                    await Promise.all(
                        prices.data.map(p=>
                        axios.delete(baseUrl+"products/"+idProduct+"/purchase_prices/"+p.priceid,{headers})
                    ));

                    const subs=await axios.get(baseUrl+"products/"+idProduct+"/subproducts",{headers});
                    await Promise.all(
                        subs.data.map(s=>
                            axios.delete(baseUrl+"products/"+idProduct+"/subproducts/remove/"+s.subproduct_id,{headers})
                    ));
                },

        async  deleteProductAttribute(idAttribute){
            const values=await axios.get(baseUrl+"products/attributes/"+idAttribute+"/values",{headers});
            await Promise.all(
                values.data.map(v=>
                        axios.delete(baseUrl+"products/attributes/values/"+v.id,{headers})
            ));
        }
}

 
 