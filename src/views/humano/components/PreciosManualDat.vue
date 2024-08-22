<script setup lang="ts">
import { ref, onMounted } from "vue";

import { useAlfabetaStore } from "../../../stores/alfabeta";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { FilterMatchMode } from "@primevue/core/api";
import type { PrecioDTO } from "../../../services/alfabeta/types";

const props = defineProps({ id: Number, product: String });
const emit = defineEmits(["onSelect", "onClose"]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const alfabeta = useAlfabetaStore();
const products = ref<PrecioDTO[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  const { success } = await alfabeta.dispatchGetPrecioPorManualDat(props.id!);
  if (success) {
    products.value = alfabeta.precios;
  }
  loading.value = false;
});

const formatCurrency = (value: number) => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const formatDate = (value: string) => {
  const fecha = new Date(value);
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

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
