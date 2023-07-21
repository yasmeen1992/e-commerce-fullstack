<template>
  <div id="page-wrap">
     <h1>Shopping Cart</h1>
     <ProductsList :products="cartItemsRef"
     v-on:remove-from-cart="removeFromCart($event)"
      />
      
     <h3 id="total-price">Total: ${{ totalPrice }}</h3>
      <button id="checkout-button">Proceed to Checkout</button>
    </div>
</template>
<script setup>
import ProductsList from '../components/ProductsList.vue';
import axios from 'axios'
import { ref,computed ,onMounted} from 'vue';
const cartItemsRef = ref([]);
const fetchCartItems = async () => {
  try {
    const result = await axios.get(`/api/users/1234/cart`);
    cartItemsRef.value = result.data;
  } catch (error) {
    console.error(error);
  }
};


onMounted(fetchCartItems);
const removeFromCart=async(productId)=>{
  const result=await axios.delete(`/api/users/1234/cart/${productId}`);
  cartItemsRef.value =result.data;


}
const totalPrice = computed(() => {
  return cartItemsRef.value.reduce((sum, item) => {
    if (item && item.price) {
      return sum + Number(item.price);
    }
    return sum;
  }, 0);
});

</script>
<style scoped>

#total-price {
    padding: 16px;
    text-align: right;
}

#checkout-button {
    width: 100%;
  }

</style>


