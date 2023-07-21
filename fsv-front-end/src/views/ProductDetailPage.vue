<template>
   <div id="page-wrap" v-if="product">
    <div id="img-wrap">
      <img :src="product.imageUrl" />
    </div>
    <div id="product-details">
      <h1>{{ product.name }}</h1>
      <h3 id="price">${{ product.price }}</h3>
      <p>Average rating: {{ product.averageRating }}</p>
      <button id="add-to-cart" v-on:click="addToCart" v-if="!itemisInCart&&!showSuccessMessage">Add to Cart</button>
      <button id="add-to-cart"  v-if="!itemisInCart&&showSuccessMessage" class="green-button">Successfully Added item To Cart</button>
      <button id="add-to-cart"  v-if="itemisInCart" class="grey-button">Item is already in Cart</button>

      <h4>Description</h4>
      <p>{{ product.description }}</p>
      </div>
    </div>
    <NotFoundPage v-else></NotFoundPage>
</template>
<script>
import axios from 'axios';
import { ref, onMounted ,computed} from 'vue';
import { useRoute } from 'vue-router';
import NotFoundPage from './NotFoundPage.vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
      const route = ref(useRoute());
      const router = useRouter();
      const product = ref(null);
      const showSuccessMessage=ref(false);
      const cartItems=ref([]);
        onMounted(async () => {
          
          const {data:response}  = await axios.get(`/api/products/${route.value.params.id}`);
          product.value = response;

          const {data:cartItemsData }  = await axios.get(`/api/users/1234/cart`);
          cartItems.value = cartItemsData ;
        });
        const addToCart=async () => {
          
          await axios.post(`/api/users/1234/cart`,{
            productId: route.value.params.id
          });
          showSuccessMessage.value = true;
          setTimeout(()=>{
            router.push('/products');
          },1500)
         
        }
        const itemisInCart = computed(() => {
          
          return cartItems.value.some(item=>item.id===product.value.id)
          });
        
        return {
            product,
            cartItems,
            addToCart,
            showSuccessMessage,
            itemisInCart
        };
       
    },
    components: { NotFoundPage }
};
</script>
<style scoped>
#page-wrap {
    margin-top: 16px;
    padding: 16px;
    max-width: 600px;
  }

  #img-wrap {
    text-align: center;
  }

  img {
    width: 400px;
  }

  #product-details {
    padding: 16px;
    position: relative;
  }

  #add-to-cart {
    width: 100%;
  }

  #price {
    position: absolute;
    top: 24px;
    right: 16px;
  }
  .green-button{
    background-color: green;
  }
  .grey-button{
    background-color: #888;
  }
</style>