<template>
      <VRow>
    <VCol cols="12">
      <VCard title="Stocks">
        <VCardText>
          Liste des <code>Mouvement de Stock</code>
        </VCardText>
        <TableListMovement/>
      </VCard>
    </VCol>
  </VRow>  
</template>
<script setup>
import TableListMovement from '@/views/pages/app/tables/TableListMovement.vue';


</script>
