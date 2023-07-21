<template>
  <div id="page-wrap">
   <ProductsGrid :products="products" />
  </div>
</template>
<script>
import axios from 'axios';
import { ref ,onMounted } from 'vue';
import ProductsGrid from '../components/ProductsGrid.vue';

export default {
    setup() {
        const title = ref("Hello everyone!");
        const products = ref([]);
        onMounted(async () => {
            try {
                const response = await axios.get('/api/products');
                products.value = response.data;
            } catch (error) {
                console.error('Error fetching products:', error);
            }
            });
        return {
            title,
            products
        };

    },

    components: { ProductsGrid }
}
</script>

