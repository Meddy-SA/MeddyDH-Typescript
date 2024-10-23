import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalizedGeneric,
  type RouteRecordRaw,
} from "vue-router";

import HomeRoute from "./home.ts";
import AlfabetaRoute from "./alfabeta.ts";
import UserRoute from "./user.ts";
import AuthRoute from "./auth.ts";

const routes: RouteRecordRaw[] = [
  { ...HomeRoute },
  { ...AlfabetaRoute },
  { ...UserRoute },
  { ...AuthRoute },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "router-link-active",
  routes,
});

router.beforeEach(
  async (
    to: RouteLocationNormalizedGeneric,
    _: RouteLocationNormalizedGeneric,
    next: NavigationGuardNext
  ): Promise<void> => {
    if (to.matched.some((r) => r.meta.auth)) {
      const token = localStorage.getItem("token");
      if (!token) {
        next({ path: "/users/login", query: { redirect: to.path } });
      } else {
        next();
      }
    } else {
      next();
    }
  }
);

export default router;
