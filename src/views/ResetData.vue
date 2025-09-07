<script setup>
import { deleteMos } from "@/service/Fabrication";
import { deleteBom } from "@/service/Nomenclatures";
import ProductService from "@/service/products/ProductService";
import { deleteWarehouses } from "@/service/Warehouses";
import axios from "axios";
      const modules = ref({
        produit:'',
        entrepot:'',  
        stock:'',
        mos:'',
        bom:''
      })
      const baseUrl=ref(import.meta.env.VITE_BASE_URL);
      const headers =ref( { DOLAPIKEY : localStorage.getItem("token")})
      const load=ref(false )
      const error=ref({
          er:false,
          messageError:''
      })

      async function resetAll(){
        load.value=true;

        try {
              // produit{}
              if(modules.value.produit){
                await ProductService.deleteProducts();
              }
            // entrepot
              if(modules.value.entrepot){
                await deleteWarehouses();
              }
            // stock
              if(modules.value.stock){
                  const res=await axios.get(baseUrl+"stockmovements",{headers});
                  for(let p of res.data){
                    await axios.delete(baseUrl+"stockmovements/"+p.id, {headers}) 
                  }
              }
            //ordre de fabrication  fabrication
              if(modules.value.mos ){
                await deleteMos();
              }
              //nomenclature
              if(modules.value.bom){
                await deleteMos();
                await deleteBom();
              }
              alert("Donnes Effaces")
        } catch (er) {
              error.value.er=true;
              error.value.messageError=er.message;
              alert("Error => "+error.value.messageError);
        }finally{
          load.value=false;
        }
      }
</script>
<template>
  <div>
    <VRow>
      <VCol
        cols="12"
        md="6"
      >
       <!-- 👉 Vertical Form -->
        <VCard title="Initialisation des Donnees">
          <VCardText>
            <VForm @submit.prevent="() => {}">
                    <VRow>
<!-- produit -->
                        <VCol cols="12">
                          <VCheckbox
                            v-model="modules.produit"
                            label="Tout les produits"
                          />
                        </VCol>
<!-- entrepot -->
                        <VCol cols="12">
                          <VCheckbox
                            v-model="modules.entrepot"
                            label="Tout les entrepots"
                          />
                        </VCol>
<!-- stock -->
                        <VCol cols="12">
                          <VCheckbox
                            v-model="modules.stock"
                            label="Tout le stock"
                          />
                        </VCol>
<!-- fabrication -->
                        <VCol cols="12">
                          <VCheckbox
                            v-model="modules.mos"
                            label="Toutes les Ordres de Fabrications"
                          />
                        </VCol>
<!-- nomenclatures-->
                        <VCol cols="12">
                          <VCheckbox
                            v-model="modules.bom"
                            label="Toutes les nomenclatures (BOM)"
                          />
                        </VCol>
                      <VCol
                        cols="12"
                        class="d-flex gap-4"
                      >
                        <VBtn @click="resetAll" type="submit">
                          {{ load? 'Initialisation en cours...' : 'Initialiser' }}
                        </VBtn>
                      </VCol>
                    </VRow>
                  </VForm>
          </VCardText>
        </VCard>
      </VCol> 
    </VRow>
  </div>
</template>

