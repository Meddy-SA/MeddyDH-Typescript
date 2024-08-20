import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalizedGeneric, type RouteRecordRaw } from 'vue-router'

import HomeRoute from './home.ts'
import AlfabetaRoute from './alfabeta.ts'
import UserRoute from './user.ts'

const routes: RouteRecordRaw[] = [
  { ...HomeRoute },
  { ...AlfabetaRoute },
  { ...UserRoute },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'router-link-active',
  routes
})

router.beforeEach(async (to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedGeneric, next: NavigationGuardNext): Promise<void> => {
  console.log(`${from} ${to}`)
  next()
})

export default router
