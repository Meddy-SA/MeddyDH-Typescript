<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
import { useAlfabetaStore } from "../../../stores/alfabeta";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { FilterMatchMode } from "@primevue/core/api";

const props = defineProps({
  id: { type: Number, required: true },
  product: { type: String, required: true },
});
const emit = defineEmits(["onSelect", "onClose"]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const alfabetaStore = useAlfabetaStore();
const { precios } = storeToRefs(alfabetaStore);

const products = computed(() => precios.value); // ref<PrecioDTO[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await alfabetaStore.fetchPriceByManualDat(props.id!);
  loading.value = false;
});

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatDate = (value: string) =>
  useDateFormat(new Date(value), "DD/MM/YYYY").value;

const closeModal = () => {
  emit("onClose");
};

const selectPrice = (val: number) => {
  emit("onSelect", val);
};
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <h5>{{ props.product }}</h5>
    <DataTable v-model:filters="filters" :value="products" show-gridlines class="w-full" :loading="loading"
      :paginator="true" :rows="10" scrollable scrollHeight="flex" options="small">
      <Column field="fecha" header="Última Actualización" sortable>
        <template #body="props">
          {{ formatDate(props.data.fecha) }}
        </template>
      </Column>
      <Column field="Precio" header="Precio" sortable>
        <template #body="props">
          {{ formatCurrency(props.data.precio) }}
        </template>
      </Column>
      <Column header="Selec." style="width: 10%; text-align: center">
        <template #body="props">
          <Button type="button" icon="pi pi-check-circle" @click="selectPrice(props.data.precio)" />
        </template>
      </Column>
    </DataTable>

    <div class="items-center mt-4">
      <Button label="Cerrar" icon="pi pi-times" @click="closeModal" />
    </div>
  </div>
</template>
