import { createRouter, createWebHistory } from 'vue-router'
import RegisterComponent from '@/components/user/RegisterComponent.vue'
import LoginComponent from '@/components/user/LoginComponent.vue'
import LoginHeaderComponent from '@/components/user/LoginHeaderComponent.vue'
import HeaderComponent from '@/components/user/HeaderComponent.vue'
import HeaderSearchComponent from '@/components/user/HeaderSearchComponent.vue'
import CartComponent from '@/components/user/CartComponent.vue'
import InforUserComponent from '@/components/user/InforUserComponent.vue'
import CategoryComponent from '@/components/user/CategoryComponent.vue'
import PageControllComponent from '@/components/user/PageControllComponent.vue'
import BodySortComponent from '@/components/user/BodySortComponent.vue'
import BodyComponent from '@/components/user/BodyComponent.vue'
import HomePage from '@/views/user/HomePage.vue'
import ProductComponent from '@/components/user/ProductComponent.vue'
import PaginationComponent from '@/components/user/PaginationComponent.vue'
import FooterComponent from '@/components/user/FooterComponent.vue'
import FooterDividerComponent from '@/components/user/FooterDividerComponent.vue'
import TopFooterComponent from '@/components/user/TopFooterComponent.vue'
import BottomFooterComponent from '@/components/user/BottomFooterComponent.vue'
import ProductDetailComponent from '@/components/user/ProductDetailComponent.vue'
import LoginPage from '@/views/user/LoginPage.vue'
import RegisterPage from '@/views/user/RegisterPage.vue'
import ProductDetailsPage from '@/views/user/ProductDetailsPage.vue'
import BodyCartComponent from '@/components/user/BodyCartComponent.vue'
import CartPage from '@/views/user/CartPage.vue'
import UserProfilePage from '@/views/user/UserProfilePage.vue'
import AdminLayout from '@/views/admin/AdminLayout.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminUsers from '@/views/admin/AdminUsers.vue'
import { jwtDecode } from 'jwt-decode'


const routes = [
   { path: '/',name: 'HomePage',component: HomePage,},
   { path: '/CartPage',name: 'CartPage',component: CartPage,},
   { path: '/UserProfile',name: 'UserProfilePage',component: UserProfilePage,},
   { path: '/ProductDetails/:id',name: 'ProductDetailsPage',component: ProductDetailsPage,},
   { path: '/RegisterPage',name: 'RegisterPage',component: RegisterPage,},
   { path: '/LoginPage',name: 'LoginPage',component: LoginPage,},
   { path: '/BottomFooterComponent',name: 'BottomFooterComponent',component: BottomFooterComponent,},
   { path: '/TopFooterComponent',name: 'TopFooterComponent',component: TopFooterComponent,},
   { path: '/FooterDividerComponent',name: 'FooterDividerComponent',component: FooterDividerComponent,},
   { path: '/FooterComponent',name: 'FooterComponent',component: FooterComponent,},
   { path: '/PaginationComponent',name: 'PaginationComponent',component: PaginationComponent,},
   { path: '/ProductComponent',name: 'ProductComponent',component: ProductComponent,},
   { path: '/HeaderComponent',name: 'HeaderComponent',component: HeaderComponent,},
   { path: '/BodyComponent',name: 'BodyComponent',component: BodyComponent,},
   { path: '/BodySortComponent',name: 'BodySortComponent',component: BodySortComponent,},
   { path: '/PageControllComponent',name: 'PageControllComponent',component: PageControllComponent,},
   { path: '/CategoryComponent',name: 'CategoryComponent',component: CategoryComponent,},
   { path: '/InforUserComponent',name: 'InforUserComponent',component: InforUserComponent,},
   { path: '/CartComponent',name: 'CartComponent',component: CartComponent,},
   { path: '/LoginHeaderComponent',name: 'LoginHeaderComponent',component: LoginHeaderComponent,},
   { path: '/HeaderSearchComponent',name: 'HeaderSearchComponent',component: HeaderSearchComponent,},
   { path: '/LoginComponent',name: 'LoginComponent',component: LoginComponent,},
   { path: '/RegisterComponent',name: 'RegisterComponent',component: RegisterComponent,},
   { path: '/ProductDetailComponent',name: 'ProductDetailComponent',component: ProductDetailComponent},
   { path: '/BodyCartComponent',name: 'BodyCartComponent',component: BodyCartComponent},
    { 
      path: '/admin', 
      name: 'AdminLayout', 
      component: AdminLayout,
      redirect: '/admin/dashboard',
      children: [
        { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard },
        { path: 'users', name: 'AdminUsers', component: AdminUsers }
      ]
    },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
   routes 
})

// Route guard để bảo vệ trang admin và user
router.beforeEach((to, from, next) => {
  const currentUserId = sessionStorage.getItem('currentUserId')
  const token = currentUserId ? localStorage.getItem(`user_${currentUserId}_accessToken`) : null
  
  // Bảo vệ trang admin - chỉ admin và staff được vào
  if (to.path.startsWith('/admin')) {
    if (!token) {
      next({ name: 'LoginPage' })
      return
    }
    
  }
  
  // Ngăn admin/staff truy cập trang user (trừ login/register)
  if (token) {
    try {
      const decoded = jwtDecode(token)
      
      // Nếu là admin/staff và cố vào trang user (không phải login/register)
      if ((decoded.role === 'admin' || decoded.role === 'staff') && 
          !to.path.startsWith('/admin') && 
          to.name !== 'LoginPage' && 
          to.name !== 'RegisterPage') {
        next({ name: 'AdminDashboard' })
        return
      }
    } catch (err) {
      // Token không hợp lệ hoặc hết hạn - xóa token và cho phép tiếp tục
      const currentUserId = sessionStorage.getItem('currentUserId')
      if (currentUserId) {
        localStorage.removeItem(`user_${currentUserId}_accessToken`)
        localStorage.removeItem(`user_${currentUserId}_refreshToken`)
      }
      sessionStorage.removeItem('currentUserId')
    }
  }
  
  // Cho phép tất cả các trường hợp khác (không có token, role user, login, register)
  next()
})

export default router
