import Vue from 'vue'
import VueRouter from 'vue-router'
import HighLevelPage from "../views/HighLevelPage";
import NotFound from "../views/NotFound";
import Home from '../views/Home.vue'
import Wallet from '../views/Wallet.vue'
import About from "../views/About";

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    component: NotFound
  },
  {
    path: '/',
    component: HighLevelPage,
    children: [
      {path: '', name: 'main', component: Home},
      {path: 'wallet/:address', name: 'wallet', component: Wallet, props: true},
      {path: 'about', name: 'about', component: About},
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
