import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/api";


export const useProductStore = defineStore('productStore',() => {

const accessToken = ref(localStorage.getItem('accessToken') || null) 
const refreshToken = ref(localStorage.getItem('refreshToken') || null) 
const listProduct = ref([])
const pageCurrent = ref(1)
const totalPages = ref(1)
const limit = 10
const error = ref('')
const sortType = ref('default')
const listCategory = ref([])
const categorys = ref('')
const productDetails = ref([])


const handleGetProduct = async (sort = sortType.value , categoryName = categorys.value  ) => {
    
 try {
    const res = await api.get(`/api/product/getproducts?page=${pageCurrent.value}&limit=${limit}&sort=${sort}&category=${categoryName}`)


    listProduct.value = res.data.products
    totalPages.value = res.data.totalPages
    
 } catch (error) {
    error.value = 'Không nhận được danh sách sản phẩm';
 }

}
 
const handleSort = async (sort) => {
  sortType.value = sort;
   handleGetProduct(sort);
}

const handleGoToPage =  (page) => {
    
    pageCurrent.value = page
    handleGetProduct(sortType.value,categorys.value);
}
 const handleNextPage = () => {
   if(pageCurrent.value < totalPages.value){

      handleGoToPage(pageCurrent.value + 1);
   }
 }

  const handlePrePage = () => {
   if(pageCurrent.value > 1){
      handleGoToPage(pageCurrent.value - 1);
   }
 }

const handleGetCategory = async () => {
    const res = await api.get('/api/product/getcategory')
     
    listCategory.value = res.data.category;

}

 const handleGetProductCategory = (category) =>{
    categorys.value = category;
    handleGetProduct(sortType.value,category)
 }

 const handleProductDetails =  async (id) => {

   try {
      const res = await api.get(`/api/product/gotodetail/${id}`)
       
      productDetails.value = res.data.productDetail;
      

      return true ;
   } catch (error) {
      return false ;
   }

 }


return {accessToken,refreshToken,pageCurrent,totalPages,listProduct,limit,error,sortType,listCategory,categorys,productDetails,handleGetProduct,handleGoToPage,handleNextPage,handlePrePage,handleSort,handleGetCategory,handleGetProductCategory,handleProductDetails}
})