<script setup lang="ts">
import { ref } from 'vue'

import Logo from '../assets/logo.png'

import Card from 'primevue/card';
import Image from 'primevue/image';

import carousel from './examples/carousel.vue';
import team from './examples/team.vue';
import payment from './examples/payment.vue';

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1 class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500 my-2">
    {{ msg }}
  </h1>

  <div class="flex items-center justify-center text-center mx-16">
    <Image :src="Logo" alt="Image" width="250" />
  </div>

  <div class="my-16">
    <carousel />
  </div>

  <div class="my-16">
    <team />
  </div>
  <div class="my-16">
    <payment />
  </div>


  <div class="grid grid-cols-4 gap-4">
    <Card pt:root:class="bg-transparent/10 p-4 mx-4">
      <template #title>Simple Card</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque
          quas!
        </p>
      </template>
    </Card>
    <Card pt:root:class="bg-transparent/10 p-4 mx-4">
      <template #title>Simple Card</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque
          quas!
        </p>
      </template>
    </Card>
    <Card pt:root:class="bg-transparent/10 p-4 mx-4">
      <template #title>Simple Card</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque
          quas!
        </p>
      </template>
    </Card>
    <Card pt:root:class="bg-transparent/10 p-4 mx-4">
      <template #title>Simple Card</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam
          deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate
          neque
          quas!
        </p>
      </template>
    </Card>
  </div>

  <div class="card bg-transparent/20 rounded-lg mx-4 my-8">
    <button type="button" @click="count++" class="black-button">Contar {{ count }}</button>
  </div>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
