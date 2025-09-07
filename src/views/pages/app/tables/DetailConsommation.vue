<script setup>
import ApiService from '@/service/ApiService';
import MosService from '@/service/mos/MosService';
import { onBeforeMount, watchEffect } from 'vue';

const consDetail=ref(null);
const whrs=ref([]);
const consData=ref([]);

const props=defineProps({
  mosItem:Object,
  send:Boolean,
  allWh:Array
});

const consumeEmit=defineEmits(["consumeData"]);

watchEffect(() => {
  if (props.send) {
      consData.value=setConsumeData();
      consumeEmit("consumeData",consData.value);
  }
});

function setConsumeData(){
    return consDetail.value.map(d => ({
    objectid: d.objectid,
    qty: d.qty,
    fk_warehouse: Number(d.selectedwh)
  }));
}

onBeforeMount(async () => {
   consDetail.value= await MosService.setConsumeArray(props.mosItem);
   for(let [ i , c ] of consDetail.value.entries()){
      let warehouse=await ApiService.setWarehouse(c.objectid,props.allWh);
      consDetail.value[i]["warehouse"]=warehouse;
      consDetail.value[i]["selectedwh"]=null;
   }
  //  console.log(consDetail.value);

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
          <tr
                v-for="item in consDetail"
          >
          <td>
            {{ item.prod }}
          </td>
          <td>
            {{ item.qty }}
          </td>
          <td>
              <v-select
                  :items="item.warehouse"
                  v-model="item.selectedwh"
                  placeholder="Selectionner un entrepot"
                  persistent-placeholder
            />
          </td>
        </tr>
    </tbody>
    </VTable>
</template>
