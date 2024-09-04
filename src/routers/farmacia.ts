import Layout from "../components/layouts/Default.vue";
import { Home, List } from "../views/farmacia/index.ts";
import { type RouteRecordRaw } from "vue-router";

const meta = { auth: true };

const route: RouteRecordRaw = {
  path: "/farmacia",
  meta: { breadcrumb: "Farmacia" },
  component: Layout,
  children: [
    { path: "", redirect: "home" },
    {
      path: "home",
      meta: { ...meta, breadcrumb: "Presupuesto" },
      component: Home,
    },
    {
      path: "list",
      meta: { ...meta, breadcrumb: "Lista de presupuestos" },
      component: List,
    },
  ],
};

export default route;
