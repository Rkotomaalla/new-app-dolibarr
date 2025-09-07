<script setup>
import ApiService from '@/service/ApiService';
import MosService from '@/service/mos/MosService';
import { computed } from 'vue';

//affichage: 
const load=ref(false);
const evo=ref(0);
const total=ref(0);
const saving=computed(() => {
  if(total.value===0) return "Enregistrement en cours... 0%"
  return "Enregistrement en cours... "+((100*evo.value)/total.value).toFixed(0)+" %";
});

const emit=defineEmits(["dropRow"]);

const savedMos=ref([]);

const props=defineProps({
  listMos:Array
});

function supprimer(i){
  emit("dropRow",i);
}

async function ToutFabriquer(){
    try{
      load.value=true;
      let i=0;
      evo.value=0;
      total.value=props.listMos.length;
      for(let mos of props.listMos){
          console.log(i+"/====================================================================");
// config des donnes de Mos a creer 
          console.log("config des donnes de Mos a creer");
          let data=await MosService.setMosData(mos.idBom,mos.qty,mos.type,mos.fk_product);
          let idMos=await MosService.saveMos(data);
          savedMos.value.push(idMos);

          evo.value+=0.2;
//detail de MOS enregistrer
          console.log("detail de MOS enregistrer");
          let mosToProduce =await ApiService.getById("mos",idMos);

           evo.value+=0.2;
//Validation du Mos
          console.log("Validation du Mos");
          await MosService.putValidate(mosToProduce,1);
          
           evo.value+=0.2;
//configuratiosn de Mos a fabriquer
          console.log("configuratiosn de Mos a fabriquer");
          let mostToSave=await MosService.setDataWithLines(mosToProduce);
          let details=await setPCDetails(mostToSave.lines,mostToSave);

           evo.value+=0.2;
          // enregistrement du mos
          console.log("enregistrement du mos");
          await MosService.postPC(details.consume,details.produce,details.inventory,mostToSave);

           evo.value+=0.2;

           i++;
      }
      evo.value=0;
      total.value=props.listMos.length;
      load.value=!load;
    }catch (error){
        // await deleteAllMos();
        throw error;
    }
}

async function setPCDetails(lines,itemToSave){
  let toProduce=[];
  let toConsume=[];
  let inventory={};
  for(let line of lines ){
    let product=await ApiService.getById("products",line.fk_product); 
    let obj={
          objectid: line.fk_product,
          qty:line.qty, 
          fk_warehouse: Number(product.fk_default_warehouse)
    }
    if(line.role==="toproduce"){
        toProduce.push(obj);
    }
    else if (line.role==="toconsume"){
      toConsume.push(obj);
    }
  }
    inventory= await MosService.getMosInventoryCode(itemToSave);
  return {
    produce:toProduce,
    consume:toConsume,
    inventory:inventory
  };
}
async function deleteAllMos(){
      try{
          for(let s of  savedMos.value){
              await ApiService.deleteId("mos/",s);
              console.log("MOS SUPPRIME");
          }

      }catch(error){
        throw error
      }
}
</script>
<template>
      <VTable height="300">
    <thead>
      <tr>
        <th>Nomenclature</th>
        <th>Produit</th>
        <th>Quantité</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
        <tr         
            v-for="( item , i ) in props.listMos"
            :key="i"
        >
            <td>
                {{ item.refBom }}
            </td>
            <td>
                {{ item.refProduct }}
            </td>
            <td>
                {{ item.qty }}
            </td>
            <td>
                <button  @click="supprimer(i)"  >
                      ❌
                </button>
            </td>
        </tr>
    </tbody>
  </VTable>
        <!-- 👉 submit and reset button -->
      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn type="submit" @click="ToutFabriquer" >
          {{ load ? saving : "Tout fabriquer" }}
        </VBtn>
        <VBtn
          color="secondary"
          variant="tonal"
          type="reset"
        >
          Reset
        </VBtn>
      </VCol>
</template>
<style lang="css">
        .badge {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          color: white;
          font-weight: bold;
          font-size: 0.875rem;
        }
        .bg-red-500 { background-color: #ef4444; }
</style>
