import Layout from "../components/layouts/Default.vue";
import { Home } from "../views/alfabeta/index.ts";
import { type RouteRecordRaw } from "vue-router";

const meta = { auth: true };

const route: RouteRecordRaw = {
  path: "/alfabeta",
  meta: { breadcrumb: "Alfabeta" },
  component: Layout,
  children: [
    { path: "", redirect: "home" },
    {
      path: "home",
      meta: { ...meta, breadcrumb: "Archivos" },
      component: Home,
    },
  ],
};

export default route;
