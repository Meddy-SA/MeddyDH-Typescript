<script setup lang="ts">
import { onMounted, ref } from "vue";
import DatePicker from "primevue/datepicker";
import Button from "primevue/button";
import Tag from "primevue/tag";
// import Dialog from "primevue/dialog";
import Toolbar from "primevue/toolbar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { FilterMatchMode } from "@primevue/core/api";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";

import { useSystemStore } from "../../stores/system";
import { useHumanoStore } from "../../stores/humano";
import type { MedicamentoDTO } from "../../services/humano/types";

// import RecetaPDF from './receta_pdf.vue'
const system = useSystemStore();
const humano = useHumanoStore();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const desde = ref<Date>();
const hasta = ref<Date>();
const rows = ref<MedicamentoDTO[]>([]);
const medicamentos = ref([]);

const loading = ref(false);
const showPDF = ref(false);
const dataPdf = ref<MedicamentoDTO>();

onMounted(async () => {
  try {
    const r = await system.dispatchGetMesActual();
    if (r) {
      desde.value = new Date(system.meses?.startDate!);
      hasta.value = new Date(system.meses?.endDate!);
    }
  } catch (e) {
    console.log(e);
  }
});

const filtrarLista = async () => {
  loading.value = true;
  try {
    const formatDesde = desde.value?.toISOString().split("T")[0] ?? "";
    const formatHasta = hasta.value?.toISOString().split("T")[0] ?? "";
    const { success } = await humano.dispatchGetExpedientes(
      formatDesde,
      formatHasta
    );
    if (success) {
      rows.value = humano.expedientes;
    }
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
};

const showModalPdf = (d: MedicamentoDTO) => {
  dataPdf.value = d;
  showPDF.value = true;
};
</script>

<template>
  <div class="card">
    <Toolbar class="mb-4">
      <template #start>
        <span class="text-2xl text-cyan-900 dark:text-cyan-600">Listado de Expedientes</span>
      </template>
    </Toolbar>

    <Toolbar class="rounded-3xl border border-cyan-700">
      <template #start>
        <div class="flex flex-row gap-4 items-center">
          <div>
            <label for="desde" class="labelInput">Desde</label>
            <DatePicker id="desde" v-model="desde" dateFormat="dd/mm/yy" pt:root:class="w-full h-11" showIcon
              icon-display="input" showButtonBar />
          </div>
          <div>
            <label for="hasta" class="labelInput">Hasta</label>
            <DatePicker id="hasta" v-model="hasta" dateFormat="dd/mm/yy" pt:root:class="w-full h-11" showIcon
              icon-display="input" showButtonBar />
          </div>
          <Button label="Filtrar" icon="pi pi-filter" pt:root:class="h-11 mt-7" @click="filtrarLista"
            :loading="loading" />
        </div>
      </template>
    </Toolbar>

    <div class="card mt-4">
      <DataTable v-model:expandedRows="medicamentos" :value="rows" :filters="filters" data-key="id" size="small"
        :loading="loading">
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-end">
            <IconField iconPosition="left">
              <InputIcon class="pi pi-search"></InputIcon>
              <InputText v-model="filters['global'].value" placeholder="Buscar..." />
            </IconField>
          </div>
        </template>

        <Column expander style="width: 5rem" />
        <Column field="estado" header="Estado" style="max-width: 5rem">
          <template #body="{ data }">
            <Tag :value="data.estado.nombre" :severity="data.estado.severity" />
          </template>
        </Column>
        <Column field="id" header="Nº Receta"></Column>
        <Column field="fecha" header="Fecha">
          <template #body="{ data }">
            {{ data.fecha }}
          </template>
        </Column>
        <Column field="afiliado" header="Afiliado">
          <template #body="{ data }">
            <div v-if="data.afiliado">
              {{ data.afiliado.documento }} - {{ data.afiliado.nombre }}
              {{ data.afiliado.apellido }}
            </div>
          </template>
        </Column>
        <Column field="cie10" header="Diagnóstico">
          <template #body="{ data }">
            ({{ data.cie10.codigo }}) {{ data.cie10.nombre }}
          </template>
        </Column>
        <Column field="plan" header="Plan">
          <template #body="{ data }">
            {{ data.plan.nombre }}
          </template>
        </Column>
        <Column headerStyle="width:4rem">
          <template #body="{ data }">
            <Button icon="pi pi-print" @click="showModalPdf(data)" />
          </template>
        </Column>
        <template #expansion="slotProps">
          <div class="p-3">
            <h5>Receta Nº {{ slotProps.data.id }}</h5>
            <DataTable :value="slotProps.data.medicamentos" :show-gridlines="true">
              <Column field="nombre" header="Nombre" sortable></Column>
              <Column field="presentacion" header="Presentación" sortable></Column>
              <Column field="dosis" header="Dosis" sortable></Column>
              <Column field="frecuencia" header="Frecuencia" sortable></Column>
              <Column field="reconoce" header="Reconoce" sortable>
                <template #body="{ data }">
                  {{ data.reconoce }} {{ data.tipoReconoce.nombre }}
                </template>
              </Column>
              <Column field="estado" header="Estado" sortable>
                <template #body="slotProps">
                  <Tag :value="slotProps.data.estado.nombre.toLowerCase()" :severity="slotProps.data.estado.severity" />
                </template>
              </Column>
            </DataTable>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- <Dialog v-model:visible="showPDF" model> -->
    <!--   <RecetaPDF :data="dataPdf" /> -->
    <!-- </Dialog> -->
  </div>
</template>
