<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useDateFormat } from "@vueuse/core";
import { useAlfabetaStore } from "../../../stores/alfabeta";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { FilterMatchMode } from "@primevue/core/api";

const props = defineProps({ id: Number, indice: String, filter: String });
const emit = defineEmits(["onSelect", "onClose"]);
const filters = ref({
  global: { value: props.filter, matchMode: FilterMatchMode.CONTAINS },
  nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const alfabetaStore = useAlfabetaStore();
const { drogas } = storeToRefs(alfabetaStore);

const products = computed(() => drogas.value); // ref<DrogaDTO[]>([]);
const expandedRows = ref({});
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  await alfabetaStore.fetchPriceHistory(props.id!, props.indice!);
  loading.value = false;
});

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatDate = (value: string) =>
  useDateFormat(new Date(value), "DD/MM/YYYY").value;

const closeModal = () => emit("onClose");
const selectPrice = (val: number) => emit("onSelect", val);
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <DataTable v-model:expandedRows="expandedRows" v-model:filters="filters" :value="products" show-gridlines
      class="w-full" :loading="loading" :paginator="true" :rows="3" data-key="id" scrollable scrollHeight="flex"
      filter-display="row" options="small">
      <template #header>
        <div class="flex justify-end">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
          </IconField>
        </div>
      </template>
      <Column expander style="width: 5rem" />
      <Column field="nombre" header="Medicamento" sortable style="width: 50%" pt:filterInput:class="w-full leo">
        <template #body="{ data }">
          {{ data.nombre }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" class="p-column-filter" pt:root:class="w-full"
            @input="filterCallback()" placeholder="Buscar por nombre" />
        </template>
      </Column>
      <Column field="precio" header="Precio" sortable style="width: 30%">
        <template #body="slotProps">
          {{ formatCurrency(slotProps.data.precio) }}
        </template>
      </Column>
      <Column header="Selec." style="width: 10%; text-align: center">
        <template #body="slotProps">
          <Button type="button" icon="pi pi-check-circle" @click="selectPrice(slotProps.data.precio)" />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div>
          <h5>Historial de Precios</h5>
          <DataTable :value="slotProps.data.historialPrecios">
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
        </div>
      </template>
    </DataTable>
    <div class="items-center mt-4">
      <Button label="Cerrar" icon="pi pi-times" @click="closeModal" />
    </div>
  </div>
</template>
