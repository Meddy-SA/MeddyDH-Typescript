<script setup lang="ts">
defineProps<{ msg: string }>()
</script>

<template>
  <h1 class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500 my-2">
    Hola {{ msg }}
  </h1>

  <div class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
    <span class="font-medium">Info!</span> Bienvenido al software de desarrollo humano.
  </div>
</template>
