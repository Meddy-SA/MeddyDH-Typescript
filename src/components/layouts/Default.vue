<script setup lang="ts">
import { watch } from "vue";

import { useAlertStore } from "../../stores";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

import MainMenu from "./components/MainMenu.vue";
import UserTopbar from "./components/UserTopbar.vue";

const alertStore = useAlertStore();
const toast = useToast();

watch(
  alertStore.alerts,
  (newAlerts) => {
    for (const alert of newAlerts) {
      if (!alert.read) {
        const { severity, summary, msg, id } = alert;
        toast.add({ severity, summary, detail: msg, life: 3000 });
        alertStore.markAsRead(id);
      }
    }
  },
  { deep: true }
);
</script>

<template>
  <Toast />
  <div class="static h-screen w-screen min-w-screen min-h-screen bg-sky-50 sm:pr-24">
    <div class="z-1 overflow-x-hidden relative">
      <nav class="px-4 py-2.5 fixed left-0 right-0 top-0 z-50 shadow-lg bg-indigo-200/20">
        <div class="flex flex-wrap justify-between items-center">
          <div class="flex justify-start items-center">
            <MainMenu />
          </div>
          <div class="flex items-center lg:order-2">
            <UserTopbar />
          </div>
        </div>
      </nav>
      <div class="layout-content pt-24">
        <main class="flex-auto overflow-y-auto">
          <!-- Section MAIN -->
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </main>
      </div>
    </div>
  </div>
</template>
