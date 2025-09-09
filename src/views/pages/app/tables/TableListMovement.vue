<script setup>
import ApiService from '@/service/ApiService';
import StockMovementService from '@/service/stock/StockMovementService';
import { onMounted, ref } from 'vue';


const loading=ref(false);

const productList=ref(null);
const stockMovementList=ref(null);
const stockDataToShow=ref(null);

  onMounted( async  () => {
      try {
        loading.value=true;
        productList.value= await ApiService.getAll("products");
        stockMovementList.value= await ApiService.getAll("stockmovements");
        stockDataToShow.value=setDataToShow();
        loading.value=false;
      } catch (error) {
        loading.value=true;
        throw error;
      }
  });

function setDataToShow(){
  try {
    let data=[];
    for(let prod  of productList.value){
      let p={}
        let stockMovement=stockMovementList.value.filter(s => s.product_id === prod.id);
        let initialData=StockMovementService.getStockInitialPerProduct(stockMovement);
        stockMovement=stockMovement.filter(s => Number(s.id) !== Number(initialData.idStock));
        let movementPerType=StockMovementService.getMovementPerType(stockMovement);

  // configuration de l object  
        p.id=prod.id;
        p.label=prod.label;
        p.ref=prod.ref;
        p.initial=Number(initialData.initialStock);
        p.sortie=movementPerType.sortie*-1;
        p.entree=movementPerType.entree;
        p.actuel=Number(prod.stock_reel);
        data.push(p);
    }  
    return data;
  } catch (error) {
      throw error;
  }
}
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
        <th>Nom Produit</th>
        <th>Stock Initial</th>
        <th>Entrees</th>
        <th>Sorties</th>
        <th>Stock Actuel</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in stockDataToShow"
        :key="item.id"
      >
        <td>
          {{ item.ref }}
        </td>
        <td class="text-center">
          {{ item.label }}
        </td>
        <td class="text-center">
          {{ item.initial }}
        </td>
        <td class="text-center">
          {{ item.entree }}
        </td>
        <td  class="text-center">
          {{ item.sortie }}
        </td>
        <td class="text-center">
          {{ item.actuel }}
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
