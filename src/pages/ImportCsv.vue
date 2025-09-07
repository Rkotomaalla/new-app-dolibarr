<script setup>
 import ImportCsv from '@/views/pages/forms/ImportCsv.vue';
</script>
<template>
    <div>
    <VRow>
      <VCol
        cols="12"
        md="6"
      >
        <!-- 👉 Horizontal Form -->
        <VCard title="Fichier Produits Csv">
          <VCardText>
            <ImportCsv />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
