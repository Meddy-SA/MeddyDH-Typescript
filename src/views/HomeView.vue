<script setup lang="ts">
import HelloWorld from '../components/HelloWorld.vue';
import Button from 'primevue/button';
</script>

<template>
  <HelloWorld :msg="'Hola Leonardo'" />
  <div class="grid grid-cols-4 gap-2 dark-gradient">
    <div><Button label="Primario" /></div>
    <div><Button label="Botón Secundario" severity="secondary" /></div>
    <div><Button label="Botón de exito" severity="success" /></div>
    <div><Button label="Botón infomativo" severity="info" /></div>
    <div><Button label="Precaución" severity="warn" /></div>
    <div><Button label="Ayuda" severity="help" /></div>
    <div><Button label="Peligro" severity="danger" /></div>
    <div><Button label="Contraste" severity="contrast" /></div>
  </div>
</template>
