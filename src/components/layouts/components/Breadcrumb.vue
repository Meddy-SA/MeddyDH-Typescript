<script setup lang="ts">
import { ref } from 'vue';
import type { BreadcrumbItem } from '../../../types/types.primevue';


const items = ref<BreadcrumbItem[]>([
  { label: 'Tecno', route: '/' },
  { label: 'Crédito' },
]);
</script>

<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
      <li class="inline-flex items-center cursor-pointer">
        <a to="/" class="ms-1 text-sm font-medium text-emerald-50 mt-1">
          <i class="pi pi-home hover:text-indigo-600" style="font-size: 0.75rem;" />
          <span class="ms-1 bg-transparent">Inicio</span>
        </a>
      </li>
      <li class="flex items-center mt-1" v-for="item in items">
        <i class="pi pi-angle-right" />
        <a v-if="item.route" :to="item.route" class="ms-1 text-sm font-medium text-emerald-50 cursor-pointer">{{
          item.label }}</a>
        <span v-else class="ms-1 text-sm font-medium">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
