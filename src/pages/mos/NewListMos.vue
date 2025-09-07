<script setup>
import TableDetailMosToInsert from '@/views/pages/app/tables/TableDetailMosToInsert.vue';
import FormNewListMos from '@/views/pages/forms/FormNewListMos.vue';

const ListMos=ref([]);
const MosItem=ref({});

function insertIntoList(obj){
    ListMos.value.push(obj);
}
function dropRow(obj){
  ListMos.value.splice(obj,1);
}
</script>
<template>
  <div>
<!-- formulaire d en tete =====================================================-->

    <VRow>
       <VCol
        cols="12"
      >
        <VCard title="Fabrication Multiples">
          <VCardText>
            <FormNewListMos @sendMos="insertIntoList"/>
          </VCardText>
        </VCard>
      </VCol>

    </VRow>
  
  <!-- liste des BOMS Preenregistres -->
    <VRow>
    <VCol cols="12">
      <VCard title="">
        <VCardText>
          Liste des <code>Produit  à Fabriquer</code>
        </VCardText>
        <TableDetailMosToInsert
              :listMos="ListMos"
              @dropRow="dropRow"
            />
      </VCard>
    </VCol>
    
  </VRow>
  </div>
</template>
