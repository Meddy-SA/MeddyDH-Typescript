<script setup lang="ts">
import MainMenu from './components/MainMenu.vue';
import NotifyTopbar from './components/NotifyTopbar.vue';
import UserTopbar from './components/UserTopbar.vue';
</script>

<template>
  <!-- <Toast /> -->
  <div class="layout-dark static h-screen min-w-full min-h-screen">
    <div class="layout-dark-wrapper z-1 overflow-x-hidden relative">
      <nav class="px-4 py-2.5 fixed bg-red-600 left-0 right-0 top-0 z-50 shadow-lg">
        <div class="flex flex-wrap justify-between items-center">
          <div class="flex justify-start items-center">
            <MainMenu />
          </div>
          <div clas="">
          </div>
          <div class="flex items-center lg:order-2">
            <NotifyTopbar />
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
