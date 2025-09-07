<script setup>
import ApiService from '@/service/ApiService';
import MosService from '@/service/mos/MosService';
import { default as DetailConsommation } from '@/views/pages/app/tables/DetailConsommation.vue';
import DetailProduction from '@/views/pages/app/tables/DetailProduction.vue';
import ListMos from '@/views/pages/app/tables/ListMos.vue';
import MosInventory from '@/views/pages/forms/MosInventory.vue';
import { onBeforeMount, ref, watch } from 'vue';

const mosItem=ref(null);
const showFabDetail=ref(false);
const send=ref(false);
const allWh=ref([]);

 const consumeData=ref([]);
 const productData=ref(null);
 const inventoryDetail=ref(null);

// cette conputed verifiera si les trois data sont completes  
const allDataComplete = computed(() => {
    return consumeData.value.length > 0 &&  // Vérifier que l'array n'est pas vide
         productData.value !== null && 
         inventoryDetail.value !== null;
});

// Watch sur le computed
watch(allDataComplete, (isComplete) => {
  if (isComplete) {
    saveConsumeAndProduct();
  }
});


async function saveConsumeAndProduct(){
      try {
        console.log(consumeData.value);
        console.log(productData.value);
        console.log(inventoryDetail.value);

        await MosService.postPC(consumeData.value,productData.value,inventoryDetail.value,mosItem.value);
        // return res;
      } catch (error) {
        throw error;
      }
} 

function handleMosItem(item){
  showFabDetail.value=true;
  mosItem.value=item;
}
function hideFabDetail(obj){
  showFabDetail.value=false;
}

function confirmInvetory(obj){
      inventoryDetail.value=obj.inventoryData;
      send.value=true;
}

function confirmConsume(obj){
     consumeData.value=obj;
}

function confirmProduction(obj){
    productData.value=obj;
}


onBeforeMount( async () => {
     allWh.value=await ApiService.getAll("warehouses");
});

</script>
<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Ordres de Fabrication Mos">
        <VCardText>
          Liste des <code>Ordres de Fabrication</code>
        </VCardText>
        <ListMos 
              @sendedMos="handleMosItem"
        />
      </VCard>
    </VCol>
      <VCol cols="12" v-if=showFabDetail>
      <VCard title="consommation">
        <DetailConsommation
          @consumeData="confirmConsume"
          :mosItem="mosItem"
          :send="send"
          :allWh="allWh"
        />
      </VCard>
    </VCol>
     <VCol cols="12" v-if=showFabDetail >
      <VCard title="production">
        <DetailProduction
          @productData="confirmProduction"
          :mosItem="mosItem"
          :send="send"
          :allWh="allWh"
        />
      </VCard>
    </VCol>
  </VRow>

<!-- affichage de ... -->
     <div  v-if=showFabDetail>
    <VRow>
      <VCol
        cols="12"
        md="12"
      >
        <!-- 👉 Horizontal Form -->
        <VCard title="Inventaire">
          <VCardText>
              <MosInventory 
                @hideFabDetail="hideFabDetail"
                @inventoryData="confirmInvetory"
                :mosItem="mosItem"
              />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>

</template>
