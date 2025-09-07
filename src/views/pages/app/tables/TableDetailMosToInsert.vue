<script setup>
import ApiService from '@/service/ApiService';
import MosService from '@/service/mos/MosService';

const load=ref(false);
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
      for(let mos of props.listMos){
          let data=await MosService.setMosData(mos.idBom,mos.qty,mos.type,mos.fk_product);
          let idMos=await MosService.saveMos(data);
          let mosToProduce =await ApiService.getById("mos",idMos); 
          let mostToSave=await MosService.setDataWithLines(mosToProduce.data);
          let details=setPCDetails(mostToSave.lines);
          savedMos.value.push(idMos);
      }
    }catch (error){
        await deleteAllMos();
        throw error;
    }
}

function setPCDetails(lines){
  let toProduce=[];
  let toConsume=[];
  let inventory={};
  for(let line of lines ){
    if(line.role==="toproduce"){
        toProduce.push({
          
        });
    }
    elseif(line.role==="toconsume"){

    }
  }
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
          {{ load ? "Enregistrement en cours" : "Tout fabriquer" }}
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
