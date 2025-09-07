import axios from "axios";

const baseUrl=import.meta.env.VITE_BASE_URL;
const headers= {    
    "Content-Type": "application/json",
     "DOLAPIKEY" : localStorage.getItem("token")
};

export default{
        async  setEntrepot(whrRef){
            let whs=await this.getEntrepotByRef(whrRef);
            if(!whs){
                whs=await this.createEntrepot(whrRef);
            }
            // console.log("entrepot id "+whs[0].id);
            return whs;
        },
        async  getEntrepotByRef(whrRef){
            let whr=await axios.get(baseUrl+"warehouses?sqlfilters=(t.ref:=:'"+whrRef+"')",{headers});
            
            if(whr.data.length > 0 ){
                //  console.log("entrepot  "+whr.data[0].id);
                return whr.data[0].id;
            }
        },

            async   createEntrepot(whrRef){
                let wh={};
                wh.label=whrRef;
                wh.ref=whrRef;
                wh.statut=1;
                let Json=JSON.stringify(wh);
                console.log(Json);
                    let whr=await axios.post(baseUrl+"warehouses",Json,{headers});

                    return whr.data;
            }
}

// la requette api pour le faire:
// http://localhost/api/index.php/warehouses?sqlfilters=(t.ref:=:'e1')
