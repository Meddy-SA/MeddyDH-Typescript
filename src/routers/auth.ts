import Layout from "../components/layouts/Default.vue";
import { ChangePassword, Setting } from "../views/authentication";
import { type RouteRecordRaw } from "vue-router";

const meta = { auth: true };

const route: RouteRecordRaw = {
  path: "/auth",
  meta: { breadcrumb: "Autenticación" },
  component: Layout,
  children: [
    { path: "", redirect: "profile" },
    {
      path: "profile",
      meta: { ...meta, breadcrumb: "Perfil" },
      component: Setting,
    },
    {
      path: "change-password",
      meta: { ...meta, breadcrumb: "Cambiar contraseña" },
      component: ChangePassword,
    },
  ],
};

export default route;
