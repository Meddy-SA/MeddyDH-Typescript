<script setup lang="ts">
import { ref } from 'vue';
import type { BreadcrumbItem } from '../../../types/types.primevue';


const items = ref<BreadcrumbItem[]>([
  { label: 'Medicamentos', route: '/' },
  { label: 'Por Expediente' },
]);
</script>

<template>
  <nav class="flex text-gray-700" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
      <li class="inline-flex items-center cursor-pointer">
        <a to="/" class="ms-1 text-sm font-medium text-emerald-50 mt-1">
          <i class="pi pi-home text-gray-700 hover:text-indigo-600" style="font-size: 0.75rem;" />
          <span class="ms-1 text-gray-700">Inicio</span>
        </a>
      </li>
      <li class="flex items-center mt-1" v-for="item in items">
        <i class="pi pi-angle-right" />
        <a v-if="item.route" :to="item.route" class="ms-1 text-sm font-medium text-gray-700 cursor-pointer">{{
          item.label }}</a>
        <span v-else class="ms-1 text-gray-700 text-sm font-medium">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
