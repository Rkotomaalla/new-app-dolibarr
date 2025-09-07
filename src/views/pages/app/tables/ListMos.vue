<script setup>
import MosService from '@/service/mos/MosService';

// liste a afficher
  const data = []
  const moslist=ref([]);
  
  const loading=ref(false);
  const erroeMessage=ref(null);
  const succesMessage=ref('Etat modifié avec succes');
  const showSucces=ref(false);

const ofToEmit=defineEmits(['sendedMos']);

function getEtat(etat){
        switch (etat) {
            case 0: 
                return "Brouillon";
            case 1:
                return "Validé";
            case 2:
                return "En cours" ;             
            case 3:
                return  "Terminé";
            case 4:
                return "annulé";
        }
    }

  async function changerEtat(item){
    try {
        item.load=true;
      switch (item.etat) {
        case 0:
          await MosService.putValidate(item,1);
          item.etat=1;
          break;
        case 1:
          // await MosService.postPC(item);
          ofToEmit('sendedMos',item);
          
          // item.etat=3;
          // item.ref=data.res;
          break;
      }
      } catch (error) {
        console.log(error.response?.data);
        throw error;
      }finally{item.load=false}
  }


onBeforeMount(async () => {
    try {
        loading.value=true
        moslist.value=await MosService.getList();     
    } catch (error) {
       console.log(error.message);
    }finally{
      loading.value=false;
    }
})
</script>

<template>
    <!-- Affichage du loading si data est en cours de chargement -->
    <div v-if="loading" class="text-center p-4">
      Chargement des données...
    </div>
  <VTable height="300">
    <thead>
      <tr>
        <th>Ref.</th>
        <th>Nomenclature</th>
        <th>Type</th>
        <th>Produit</th>
        <th>Quantité</th>
        <th>Etat</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in moslist"
        :key="item.moslist"
      >
        <td>
          {{ item.ref }}
        </td>
        <td class="text-center">
          {{ item.bom }}
        </td>
        <td class="text-center">
          {{ item.type }}
        </td>
        <td class="text-center">
          {{ item.product }}
        </td>
        <td class="text-center">
          {{ item.qty }}
        </td>
        <td class="text-center">
            <span
              :class="{
                'badge bg-gray-400': item.etat === 0,   // Brouillon
                'badge bg-blue-500': item.etat === 1,   // Validé
                'badge bg-yellow-400': item.etat === 2, // En cours
                'badge bg-green-500': item.etat === 3,  // Terminé
                'badge bg-red-500': item.etat === 4     // Annulé
              }"
            >
          {{ item.load ? "..." :  getEtat(item.etat) }}
            </span>
        </td>
        <td>
          <button  @click="changerEtat(item)" class="btn btn-sm btn-submit">
            {{ item.etat === 0 ? 'Valider' : item.etat === 1 ? 'Produire' : null }}
          </button>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
<style lang="css">
        .badge {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          color: white;
          font-weight: bold;
          font-size: 0.875rem;
        }
        .bg-gray-400 { background-color: #9ca3af; }
        .bg-blue-500 { background-color: #3b82f6; }
        .bg-yellow-400 { background-color: #facc15; color: black; }
        .bg-green-500 { background-color: #22c55e; }
        .bg-red-500 { background-color: #ef4444; }
</style>
