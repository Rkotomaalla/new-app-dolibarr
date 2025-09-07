<script setup>
import ApiService from '@/service/ApiService';
import BomsService from '@/service/boms/BomsService';
import { ref } from 'vue';

// les Erreurs
// message to show 
const errorMessage=ref(null);

const qty=ref(0);
const listBoms=ref([]);
const bomSelected=ref(null);

const res=ref([]);
const load=ref(null);
const emitMos=defineEmits(["sendMos"]);

async function setMosInput(){
    try{
          if(qty.value <= 0 ){
            throw new Error("la quantite est invalide");
          }else{
              errorMessage.value=null;
              load.value=true;
              let bomDetail=res.value.find(p => p.id === bomSelected.value);
              let product=await ApiService.getById("products",bomDetail.fk_product);
              let data={};
              data.type=0;
              data.idBom=bomSelected.value;
              data.refBom=bomDetail.ref;
              data.qty=qty.value;
              data.fk_product=bomDetail.fk_product;
              data.refProduct=product.ref;
            emitMos("sendMos",data);
            load.value=false;
          }
    }catch(error){
        errorMessage.value=error.message;
    }
}
 
function setListBoms(){
    listBoms.value=res.value
    .filter(b=>b.status === 1)
    .map(b=>({
        title:b.ref,
        value:b.id,
        fk_product:b.fk_product
    }))
 }

 onBeforeMount(async () => {
  try {
    res.value=await BomsService.getAllValidateBoms();
    setListBoms();
  } catch (error) {
      console.error(error);
  } 
 });

</script>
<template>
      <VForm @submit.prevent="() => {}">
          <VRow>
                <VCol cols="6">
                      <VRow no-gutters>
                        <!-- 👉 First Name -->
                        <VCol
                          cols="12"
                        >
                          <label for="bom">Nomenclature</label>
                        </VCol>

                      <VCol
                        cols="12"
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

<!-- Pour la quantite-->

              <VCol cols="6">
                      <VRow no-gutters>
                              <!-- quatitie-->
                              <VCol
                                cols="12"
                              >
                                <label for="qty">Quantite</label>
                              </VCol>
                              <VCol
                                  cols="12"
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
<!-- Affichage message d erreur -->
              
            <VCol
              cols="12"
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
              </VCol>
<!--ubmit and reset button -->
              <VCol
               
                cols="12"
                class="d-flex gap-4"
              >
                <VBtn type="submit" @click="setMosInput">
                  {{ load  ? "patientez..." : "ajouter à la liste" }}
                </VBtn>

              </VCol>
                  </VRow>
      </VForm>
</template>
