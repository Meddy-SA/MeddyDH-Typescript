import Layout from '../components/layouts/Default.vue'
import { Home } from '../views/index.ts'
import { Medicamentos } from '../views/humano/index.ts'
import { type RouteRecordRaw } from 'vue-router'

const meta = { auth: false }

const route: RouteRecordRaw = {
  path: '/',
  component: Layout,
  children: [
    { path: '', redirect: 'home' },
    { path: 'home', meta, component: Home },
    { path: 'medicamentos', meta, component: Medicamentos }
  ]
}

export default route
