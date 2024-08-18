<script setup lang="ts">
import { ref } from 'vue';

import Menu from 'primevue/menu';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Logo from '../../../assets/favicon.png'
import type { MenuItem } from 'primevue/menuitem';

const menuUser = ref()
const showMenuUser = (ev: Event) => {
  menuUser.value.toggle(ev)
}
const itemsUser = ref<MenuItem[]>([
  {
    separator: true
  },
  {
    label: 'Tecno Créditos',
    items: [
      {
        label: 'Nuevo',
        icon: 'pi pi-plus',
        shortcut: '⌘+N'
      },
      {
        label: 'Buscar',
        icon: 'pi pi-search',
        shortcut: '⌘+S'
      }
    ]
  },
  {
    label: 'Perfil',
    items: [
      {
        label: 'Opciones',
        icon: 'pi pi-cog',
        shortcut: '⌘+O'
      },
      {
        label: 'Mensajes',
        icon: 'pi pi-inbox',
        badge: 2
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        shortcut: '⌘+Q',
        command: () => {
        }
      }
    ]
  },
  {
    separator: true
  }
])

</script>

<template>
  <Avatar @click="showMenuUser" :image="Logo" class="flex mx-3 hover:cursor-pointer" shape="circle" />
  <Menu ref="menuUser" :model="itemsUser" class="w-15rem" :popup="true">
    <template #start>
      <span class="inline-flex align-items-center gap-1 px-2 py-2">
        <Avatar @click="showMenuUser" :image="Logo" class="flex mx-3 hover:cursor-pointer" shape="circle" />
        <span class="text-primary">Tecno Créditos</span>
      </span>
    </template>
    <template #submenuheader="{ item }">
      <span class="text-primary font-bold">{{ item.label }}</span>
    </template>
    <template #item="{ item, props }">
      <a class="flex align-items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
        <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{
          item.shortcut }}</span>
      </a>
    </template>
    <template #end>
      <button
        class="relative overflow-hidden w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround">
        <Avatar :image="Logo" class="mr-2" shape="circle" />
        <span class="inline-flex flex-col">
          <span class="font-bold">Leonardo Illanez</span>
          <span class="text-xs text-wrap">leonardoillanez@meddyai.com</span>
        </span>
      </button>
    </template>
  </Menu>
</template>
