<script setup>
import MosService from '@/service/mos/MosService';
import { onBeforeMount, ref } from 'vue';

const emits=defineEmits(["hideFabDetail" , "inventoryData"]);


const inventoryData=ref({
      inventorylabel:null,
      inventorycode:null
});

const props=defineProps({
  mosItem:Object
});

function changeShowValue(){
  emits('hideFabDetail',false);
}

const data=ref({});
onBeforeMount( ()=>{
  data.value=MosService.getMosInventoryCode(props.mosItem);
  inventoryData.value.inventorylabel=data.value.inventorylabel;
  inventoryData.value.inventorycode=data.value.inventorycode;
});

function confirmMos(){
      emits("inventoryData",{
        inventoryData:inventoryData.value,
        confirm:true
      })
}

</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="6">
        <VRow no-gutters>
          <!-- libelle d inventaire -->
          <VCol
            cols="12"
            md="12"
          >
            <label for="label">Libele d'inventaire</label>
          </VCol>

          <VCol
            cols="12"
            
          >
            <VTextField
              id="label"
              v-model="inventoryData.inventorylabel"
             :placeholder="data.inventorylabel"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- Code D inventaire -->
       <VCol cols="6">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="12"
          >
            <label for="code">Code d'inventaire</label>
          </VCol>

          <VCol
            cols="12"
          >
            <VTextField
              id="code"
              v-model="inventoryData.inventorycode"
              :placeholder="data.inventorycode"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 submit and reset button -->
      <VCol
        offset-md="0"
        cols="12"
        class="d-flex gap-5"
      >
        <VBtn type="submit" @click="confirmMos">
          Confirmer
        </VBtn>
        <VBtn @click="changeShowValue"
          color="secondary"
          variant="tonal"
          type="reset"
        >
          Annuler 
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
