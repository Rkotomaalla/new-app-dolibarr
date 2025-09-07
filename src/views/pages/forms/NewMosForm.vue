<script setup>
import BomsService from '@/service/boms/BomsService';
import MosService from '@/service/mos/MosService';
import { onBeforeMount } from 'vue';
// data to send
const bomSelected=ref(null);
const qty=ref(0);
const type=ref(0);

//data for forms
const show=ref(false);
const listBoms=ref([]);

const res=ref([]);

const listType=ref([
  {
    title:"Fabrication",
    value:"0"
  },
  {
    title:"Déassemblage",
    value:"1"
  }
]);


// message to show 
const errorMessage=ref(null);
const succesMessage=ref("Insertion Effectuée");
const showSucces=ref(false);
const loadSaving=ref(false);

 onBeforeMount(async () => {
  try {
    res.value=await BomsService.getAllValidateBoms();
    setListBoms();
    show.value=true;
  } catch (error) {
      console.error(error);
  } 
 });
 
 function setListBoms(){
    listBoms.value=res.value
    .filter(b=>b.status === 1)
    .map(b=>({
        title:b.ref,
        value:b.id,
        fk_product:b.fk_product
    }))
 }

 

async function saveMos(){
    try {
        loadSaving.value=true;
        errorMessage.value=null;
        showSucces.value=false;
         let data=await MosService.setMosData(bomSelected.value,qty.value,type.value,null);
         let idSaved=await MosService.saveMos(data);
        showSucces.value=true;
    } catch (error) {
        errorMessage.value=error.message;
    }finally{
      loadSaving.value=false;
    }
 }

// console.log(res);
</script>

<template>
  <VForm v-if="show" @submit.prevent="() => {}">
    <VRow>
<!-- Liste des BOMS -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="bom">Nomenclature (BOM)</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <v-select
              id="bom"
              :items="listBoms"
              v-model="bomSelected"
              placeholder="Selectionner une nomenclature"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="qty">Quantite</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <VTextField
            type="number"
              id="qty"
              v-model="qty"
              placeholder="Entrer la quantite"
              persistent-placeholder
            />
          </VCol>
        </VRow>

      </VCol>
<!-- /list de BOMS -->

<!-- liste des MrpType -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
          >
            <label for="type">Type de Mos</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <v-select
              id="type"
              :items="listType"
              v-model="type"
              placeholder="Selectionner une nomenclature"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>
<!-- /liste des mrptype -->

      <VCol
        offset-md="3"
        cols="12"
        md="9"
        class="d-flex gap-4"
      >
       <VAlert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mb-2"
            border="start"
          >
            {{ errorMessage }}
          </VAlert>

          <VAlert
            v-if="showSucces"
            type="success"
            variant="tonal"
            class="mb-2"
            border="start"
          >
            {{ succesMessage }}
          </VAlert>
        </VCol>
      <VCol
        offset-md="3"
        cols="12"
        md="9"
        class="d-flex gap-4"
      >

        <VBtn @click="saveMos" :loading="loadSaving">
          {{ loadSaving ? "Enregistrement en cours" : "enregistrer" }}
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
