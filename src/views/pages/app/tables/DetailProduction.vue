<script setup>
import ApiService from '@/service/ApiService';
import MosService from '@/service/mos/MosService';
import { onBeforeMount, watchEffect } from 'vue';

const prodData=ref({});
const prodDetail=ref({});
const warehouses=ref([]);
const selectedWarehouse=ref(null);
const baseUrl=import.meta.env.VITE_BASE_URL;
const headers= {
    "Content-Type": "application/json",
    "DOLAPIKEY" : localStorage.getItem("token")
};

const props=defineProps({
  mosItem:Object,
  send:Boolean,
    allWh:Array
});

const productEmit=defineEmits(["productData"]);
watchEffect(() => {
  if (props.send) {
      prodData.value=setProductData();
      productEmit("productData",prodData.value);
  }
});

function setProductData(){
    let data=[]
    data.push({
      objectid: prodDetail.value.objectid,
      qty:prodDetail.value.qty,
      fk_warehouse:Number(prodDetail.value.fk_warehouse)
    });
    return data;
}
onBeforeMount(async () => {
    try {
       prodDetail.value=await MosService.setProductArray(props.mosItem);
       warehouses.value=await ApiService.setWarehouse(props.mosItem.idProduct,props.allWh);
       prodDetail.value["fk_warehouse"]=null;
    } catch (error) {
      throw error;
    }
});



</script>
<template>
    <VTable>
    <thead>
      <tr>  
        <th>Produit</th>
        <th>Quantite total</th>
        <th>Entrepot</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          {{ prodDetail.ref }}
        </td>
        <td>
          {{ prodDetail.qty }}
        </td>
        <td>
              <v-select
                  :items="warehouses"  
                  item-title="title"
                  item-value="value"
                  v-model="prodDetail.fk_warehouse"

                  placeholder="Selectionner un entrepot"
                  persistent-placeholder
            />
        </td>
      </tr>
    </tbody>
    </VTable>
</template>
