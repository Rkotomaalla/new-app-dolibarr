<script setup>
import Boms from '@/model/Boms';
import Product from '@/model/Products';
import { importFile } from '@/service/CsvService';
import { ref } from 'vue';

// PRODUITS
const file = ref(null);
const load = ref(false);
const wh = ref(new Product());
const errorMessage = ref('');


function onChangeProducts(e) {
  // Prend le premier fichier voafidy
  file.value = e.target.files[0]; 
}

async function importDataProducts() {
  if (!file.value) {
    errorMessage.value = "Veuillez sélectionner un fichier.";
    return;
  }
  try {
    load.value = true;
    await importFile(file.value, wh.value);
    alert("Produits importés avec succès !");
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = error.message || "Erreur lors de l'importation des produits";
  } finally {
    load.value = false;
  }
}


// BOMS
const fileBoms = ref(null);
const loadBoms = ref(false);
const coms = ref(new Boms());
const errorMessageBoms = ref('');


function onChangeBoms(e) {
  fileBoms.value = e.target.files[0]; 
}


async function importDataBoms() {
  if (!fileBoms.value) {
    errorMessageBoms.value = "Veuillez sélectionner un fichier.";
    return;
  }
  try {
    loadBoms.value = true;
    await importFile(fileBoms.value, coms.value);
    alert("Boms importés avec succès !");
    errorMessageBoms.value = '';
  } catch (error) {
    errorMessageBoms.value = error.message || "Erreur lors de l'importation des Boms";
  } finally {
    loadBoms.value = false;
  }
}
</script>

<template>
  <VForm @submit.prevent>

    <!-- ================== IMPORT PRODUITS ================== -->
    <VRow>
      <VCol cols="12" md="3">
        <label for="file">Fichier Produit</label>
        <p v-if="file">{{ file.name }}</p>
      </VCol>

      <VCol cols="12" md="9">
        <v-file-input
          id="file"
          v-model="file"
          accept=".csv"
          placeholder="Fichier CSV Produits"
          persistent-placeholder
          @change="onChangeProducts"
        />
      </VCol>

      <VCol cols="12" class="mt-2">
        <VAlert v-if="errorMessage" border="left" prominent colored-border type="error">
          {{ errorMessage }}
        </VAlert>
      </VCol>

      <VCol cols="12" md="9" class="d-flex gap-4 mt-2">
        <VBtn :loading="load" @click="importDataProducts">
          {{ load ? 'Importation en cours...' : 'Importer Produits' }}
        </VBtn>
      </VCol>
    </VRow>

    <hr class="my-6" />

    <!-- ================== IMPORT BOMS ================== -->
    <VRow>
      <VCol cols="12" md="3">
        <label for="fileBoms">Fichier Boms</label>
        <p v-if="fileBoms">{{ fileBoms.name }}</p>
      </VCol>

      <VCol cols="12" md="9">
        <v-file-input
          id="fileBoms"
          v-model="fileBoms"
          accept=".csv"
          placeholder="Fichier CSV Boms"
          persistent-placeholder
          @change="onChangeBoms"
        />
      </VCol>

      <VCol cols="12" class="mt-2">
        <VAlert v-if="errorMessageBoms" border="left" prominent colored-border type="error">
          {{ errorMessageBoms }}
        </VAlert>
      </VCol>

      <VCol cols="12" md="9" class="d-flex gap-4 mt-2">
        <VBtn :loading="loadBoms" @click="importDataBoms">
          {{ loadBoms ? 'Importation en cours...' : 'Importer Boms' }}
        </VBtn>
      </VCol>
    </VRow>

  </VForm>
</template>
