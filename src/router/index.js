import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home')
  },
  {
    name: 'Image',
    path: '/image/:id',
    component: () => import(/* webpackChunkName: "image" */ '../views/Image')
  },
  {
    name: 'Search',
    path: '/search/:query',
    props: route => ({ query: route.params.query }),
    component: () => import(/* webpackChunkName: "search" */ '../views/Search')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
