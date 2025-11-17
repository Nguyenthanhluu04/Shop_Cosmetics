import { defineStore } from "pinia";
import api from "@/services/api";
import { ref, computed } from "vue";

export const useCartStore = defineStore('cartStore', ()=> {

  const listCartItems = ref([])

const handleAddToCart = async (productId,quantity) => {
   
  
   try {
   
     await api.post('/api/user/cart/addcart',{productId,quantity})

       return true;
    
   } catch (error) {
    return false;
   }

}

const getCartItems = async () => {

  try {
     const res = await api.get('/api/user/cart/getcartitems')

     listCartItems.value = res.data.listCartItems;
     

     
    
  } catch (error) {
    
  }

}

const updateQuantity = async (productId, newQuantity) => {
  if (newQuantity < 1) return;
  
  try {
    await api.put('/api/user/cart/updatequantity', { productId, quantity: newQuantity });
    
    // Cập nhật local state - tìm theo product_id
    const item = listCartItems.value.find(item => item.product_id === productId);
    if (item) {
      item.quantity = newQuantity;
      // Tính lại tổng tiền cho sản phẩm
      const priceNumber = parseInt(item.priceNew.replace(/\./g, ''));
      const totalPrice = priceNumber * newQuantity;
      item.totalPrice = totalPrice.toLocaleString('vi-VN');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating quantity:', error);
    return false;
  }
}

const increaseQuantity = async (productId) => {
  console.log('productId', productId);
  const item = listCartItems.value.find(item => item.product_id === productId);
  if (item) {
    return await updateQuantity(productId, item.quantity + 1);
  }
}

const decreaseQuantity = async (productId) => {
  const item = listCartItems.value.find(item => item.product_id === productId);
  if (item && item.quantity > 1) {
    return await updateQuantity(productId, item.quantity - 1);
  }
}

const removeCartItem = async (productId) => {
  try {
    await api.delete(`/api/user/cart/removeitem/${productId}`);
    
    // Xóa khỏi local state - tìm theo product_id
    listCartItems.value = listCartItems.value.filter(item => item.product_id !== productId);
    
    return true;
  } catch (error) {
    console.error('Error removing item:', error);
    return false;
  }
}

// Tính tổng thanh toán
const totalAmount = computed(() => {
  const total = listCartItems.value.reduce((sum, item) => {
    const itemTotal = parseInt(item.totalPrice.replace(/\./g, ''));
    return sum + itemTotal;
  }, 0);
  
  return total.toLocaleString('vi-VN');
})

// Alias để tương thích với CheckoutPage
const cartItems = computed(() => listCartItems.value)

const fetchCartItems = async () => {
  return await getCartItems()
}


    return {
      listCartItems,
      cartItems,
      handleAddToCart,
      getCartItems,
      fetchCartItems,
      increaseQuantity,
      decreaseQuantity,
      removeCartItem,
      totalAmount
    };
})