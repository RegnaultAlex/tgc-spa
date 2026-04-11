import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import CreateDeckPage from './pages/CreateDeckPage.vue'
import DetailsDeckPage from './pages/DetailsDeckPage.vue'
import EditDeckPage from './pages/EditDeckPage.vue'
import GamePage from './pages/GamePage.vue'
import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import SignUpPage from './pages/SignUpPage.vue'
import { useAuthStore } from './store/auth.store'

export const isAuthenticated = ref(false)

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/sign-up',
  CREATE_DECK: '/deck-create',
  EDIT_DECK: '/deck-edit',
  DETAILS_DECK: '/deck-details',
  GAME: '/game',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.LOGIN, component: LoginPage, meta: { guestOnly: true } },
  { path: ROUTES.SIGNUP, component: SignUpPage, meta: { guestOnly: true } },
  {
    path: ROUTES.CREATE_DECK,
    component: CreateDeckPage,
    meta: { requireAuth: true },
  },
  {
    path: ROUTES.EDIT_DECK,
    component: EditDeckPage,
    meta: { requireAuth: true },
  },
  {
    path: ROUTES.DETAILS_DECK,
    component: DetailsDeckPage,
    meta: { requireAuth: true },
  },
  {
    path: ROUTES.GAME,
    component: GamePage,
    meta: { requireAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return ROUTES.LOGIN
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return ROUTES.HOME
  }

  return true
})

export default router
