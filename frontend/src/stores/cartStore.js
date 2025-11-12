import { defineStore } from "pinia";
import api from "@/services/api";
import { ref } from "vue";

export const useCartStore = defineStore('cartStore', ()=> {

  const listCartItems = ref([])

const handleAddToCart = async (productId,quantity) => {

   try {
   
     await api.post('/api/cart/addcart',{productId,quantity})

       return true;
    
   } catch (error) {
    return false;
   }

}

const getCartItems = async () => {

  try {
     const res = await api.get('/api/cart/getcartitems')

     listCartItems.value = res.data.listCartItems;
     
     console.log('ok');
     
     console.log('listCartItems',res.data.listCartItems);
     
    
  } catch (error) {
    
  }

}


    return {listCartItems,handleAddToCart,getCartItems};
})