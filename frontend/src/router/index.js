import { createRouter, createWebHistory } from 'vue-router'
import RegisterComponent from '@/components/RegisterComponent.vue'
import LoginComponent from '@/components/LoginComponent.vue'
import LoginHeaderComponent from '@/components/LoginHeaderComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import HeaderSearchComponent from '@/components/HeaderSearchComponent.vue'
import CartComponent from '@/components/CartComponent.vue'
import InforUserComponent from '@/components/InforUserComponent.vue'
import CategoryComponent from '@/components/CategoryComponent.vue'
import PageControllComponent from '@/components/PageControllComponent.vue'
import BodySortComponent from '@/components/BodySortComponent.vue'
import BodyComponent from '@/components/BodyComponent.vue'
import HomePage from '@/views/HomePage.vue'
import ProductComponent from '@/components/ProductComponent.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import FooterDividerComponent from '@/components/FooterDividerComponent.vue'
import TopFooterComponent from '@/components/TopFooterComponent.vue'
import BottomFooterComponent from '@/components/BottomFooterComponent.vue'
import ProductDetailComponent from '@/components/ProductDetailComponent.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import ProductDetailsPage from '@/views/ProductDetailsPage.vue'
import BodyCartComponent from '@/components/BodyCartComponent.vue'
import CartPage from '@/views/CartPage.vue'


const routes = [
   { path: '/',name: 'HomePage',component: HomePage,},
   { path: '/CartPage',name: 'CartPage',component: CartPage,},
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
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
   routes 
})

export default router
