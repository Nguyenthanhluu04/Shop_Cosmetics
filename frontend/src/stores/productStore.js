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
const searchResults = ref([])
const searchQuery = ref('')
const searchHistory = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'))


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

 const handleSearchProducts = async (query) => {
   if (!query || !query.trim()) {
      searchResults.value = []
      return
   }
   
   try {
      const res = await api.get(`/api/product/search?q=${encodeURIComponent(query)}`)
      searchResults.value = res.data.products
   } catch (error) {
      console.error('Lỗi tìm kiếm:', error)
      searchResults.value = []
   }
 }

 const addSearchHistory = (query) => {
   if (!query || !query.trim()) return
   
   const searchQuery = query.trim()
   
   // Xóa query cũ nếu đã tồn tại
   searchHistory.value = searchHistory.value.filter(item => item !== searchQuery)
   
   // Thêm query mới vào đầu
   searchHistory.value.unshift(searchQuery)
   
   // Giới hạn 10 lịch sử
   if (searchHistory.value.length > 10) {
      searchHistory.value = searchHistory.value.slice(0, 10)
   }
   
   // Lưu vào localStorage
   localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
 }

 const removeSearchHistoryItem = (query) => {
   searchHistory.value = searchHistory.value.filter(item => item !== query)
   localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
 }

 const clearSearchHistory = () => {
   searchHistory.value = []
   localStorage.removeItem('searchHistory')
 }


return {accessToken,refreshToken,pageCurrent,totalPages,listProduct,limit,error,sortType,listCategory,categorys,productDetails,searchResults,searchQuery,searchHistory,
   handleGetProduct,handleGoToPage,handleNextPage,handlePrePage,handleSort,handleGetCategory,handleGetProductCategory,handleProductDetails,handleSearchProducts,addSearchHistory,removeSearchHistoryItem,clearSearchHistory}
})