import { createRouter, createWebHistory } from 'vue-router'
import CreateView from './views/CreateView.vue'
import ResponseView from './views/ResponseView.vue'
import NotFoundView from './views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'create',
    component: CreateView,
  },
  {
    path: '/d/:id',
    name: 'response',
    component: ResponseView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
