<template>
    <div class="grid-wrap">
        <ProductsGrideItem v-for="product in products"  :key="product.id" :product="product" />
    </div>
</template>
<script setup>
import ProductsGrideItem from './ProductsGrideItem.vue';
 defineProps(['products'])
</script>
<style scoped>
 .grid-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 16px;
  }

</style>

