<template>
    <div>
      <VRow>
        <VCol
          cols="12"
          md="7"
          offset-md="3"
        >
          <!-- 👉 Horizontal Form -->
          <VCard title="Creation d'une Ordre de Fabrication">
            <VCardText>
              <NewMosForm />
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
  </div>
</template>
<script setup>
import NewMosForm from '@/views/pages/forms/NewMosForm.vue';

  </script>
