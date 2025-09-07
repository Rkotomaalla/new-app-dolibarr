import Boms from '@/model/Boms';
import Products from '@/model/Products';
import axios from 'axios';
import Papa from "papaparse";
import BomsLinesService from './boms/BomsLinesService';
import BomsService from './boms/BomsService';
import ProductService from './products/ProductService';
import StockMovementService from './stock/StockMovementService';
const baseUrl=import.meta.env.VITE_BASE_URL;
const headers= {
    "Content-Type": "application/json",
    "DOLAPIKEY" : localStorage.getItem("token")
};



export async function importFile(file,model){
    try {
        let tableData = null;
        if(!file || !(file instanceof File)){
            throw new Error("Veuillez sélectionner un fichier.");
        }
        else {
            tableData=await papaparseFile(file);
            await generateData(tableData,model);
        }
    } catch (error) {
        throw error;
    }
}

function papaparseFile(file){
    return new Promise ((resolve, reject)=>{
            Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                resolve(results.data);
            },
             error: function(err) {
                reject(err); 
            }
        })
    });
}

async function generateData(tableData,model){
try {
    if(model instanceof Products){
        let arrayJsonProduct=await ProductService.generateCsv(tableData);
        await saveAll(arrayJsonProduct,model);
    }
    if(model instanceof Boms){
        let arrayJsonBoms=await BomsService.generateCsv(tableData);
        await saveAll(arrayJsonBoms,model);
    }
} catch (error) {
    throw error;
}
}

async function saveAll(jsonList,model){
    let savedPk=[];
    let savedId=[];
    try {
        const ref_pk = model.primaryKey;
        let i=1;
        for(let json of jsonList){
            console.log("référence "+json[ref_pk]);
            if(!model.Empty(json)){
                console.log("json ===" +json);
                if(isUnique(json[ref_pk],savedPk)){
                    let id = await  saveData(json,model);
                    console.log("id="+id);
                    savedId.push(id);
                    savedPk.push(json[ref_pk]);
                    // sauvegarde de Stock iniial
                    await saveExternalData(json,id,model);

                    i++;
                }
                else{
                    throw new Error("La valeur "+json[ref_pk]+" du champ "+ref_pk+" n'est pas unique\n Erreur à la ligne "+i );
                }
            }
            else{
                    throw new Error("Le fichier contient des lignes vides\n Erreur à la ligne "+i );
            }
        }
        } catch (error) {
            await deleteAll(savedId,model);
            savedId=[];
            throw error;
        }
}


async function saveExternalData(json,id,model){
    try {
        if(model instanceof Products){
            let id_stock=await StockMovementService.saveStockInitial(json,id);
            console.log("id stock mouvement "+id_stock);
        }        
        else if(model instanceof Boms){
            let id_line=await BomsLinesService.saveBomsLines(json.bom_composition,id);
        }
    } catch (error) {
        throw new Error("Erreur lors de l'insertion des données externes \n"+error.message);
    }
}


async function saveData(jsonData,model){
    try {
        console.log("model api "+model.api);
        // console.log("saveData => "+ jsonData);
        console.log(baseUrl+model.api+" json "+JSON.stringify(jsonData));
        let id = await axios.post(baseUrl+model.api,JSON.stringify(jsonData),{headers});         
        console.log("données insérées id "+id.data);
        return  id.data;
    } catch (error) {
        throw new Error("Erreur lors de l'insertion des données \n"+error.message);
    }
}

async function deleteAll(savedId,model){
try {
        for(let id of savedId){
        console.log("delete id "+id);
         await axios.delete(baseUrl+model.api+"/"+id,{headers});
    }
} catch (error) {
        throw new Error("Erreur lors de la suppression des données insérées");
}
}

function isUnique(value,savedPk){
    if(savedPk.includes(value)){
        return false;
    }
    return true;
}


