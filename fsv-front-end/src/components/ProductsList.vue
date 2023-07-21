<template>
    <div v-if="products.length>0" >
    <ProductsListItem 
      v-for="product in products"  :key="product.id"  :product="product" 
      v-on:remove-from-cart="$emit('remove-from-cart',$event)"
      />
    </div>
    <p v-else>You haven't added anything to the cart yet</p>

</template>
<script setup>
import ProductsListItem from './ProductsListItem.vue';
const props =defineProps(['products'])
</script>


