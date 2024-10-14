import Layout from "../components/layouts/Default.vue";
import { Home } from "../views/index.ts";
import { Medicamentos, Listado, Expediente } from "../views/humano/index.ts";
import { type RouteRecordRaw } from "vue-router";

const meta = { auth: true };

const route: RouteRecordRaw = {
  path: "/",
  component: Layout,
  children: [
    { path: "", redirect: "home" },
    { path: "home", meta, component: Home },
    {
      path: "medicamentos",
      meta: { ...meta, breadcrumb: "Medicamentos" },
      component: Medicamentos,
    },
    {
      path: "listado",
      meta: { ...meta, breadcrumb: "Listado de Medicamentos" },
      component: Listado,
    },
    {
      path: "expediente",
      meta: { ...meta, breadcrumb: "Gestión de Expediente" },
      component: Expediente,
    },
  ],
};

export default route;
