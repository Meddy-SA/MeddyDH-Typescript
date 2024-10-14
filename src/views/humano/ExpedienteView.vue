<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import Toolbar from "primevue/toolbar";
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Expediente from "../../components/Expediente.vue";
import { useAlertStore } from "../../stores";

interface Medicamento {
  nombre: string;
  dosis: string;
  cantidad: number;
}

interface ExpedienteHijo {
  numero: string;
  fecha: string;
  medicamentos: Medicamento[];
}

interface ExpedienteMadre {
  numero: string;
  expedientesHijos: ExpedienteHijo[];
}

const alertStore = useAlertStore();

const expMother = reactive<ExpedienteMadre>({
  numero: "",
  expedientesHijos: [],
});

const filteredExpedientes = ref<ExpedienteHijo[]>([]);
const selectedExpediente = ref<ExpedienteHijo | null>(null);

const onExpediente = (expedienteData: any) => {
  expMother.numero = expedienteData.expediente;

  expMother.expedientesHijos = [
    {
      numero: "001-000001-0001",
      fecha: "2023-09-01",
      medicamentos: [
        { nombre: "Paracetamol", dosis: "500mg", cantidad: 30 },
        { nombre: "Ibuprofeno", dosis: "400mg", cantidad: 20 },
      ],
    },
    {
      numero: "001-000002-0001",
      fecha: "2023-09-15",
      medicamentos: [{ nombre: "Amoxicilina", dosis: "500mg", cantidad: 21 }],
    },
  ];
};

const cleanData = () => {
  expMother.numero = "";
  expMother.expedientesHijos = [];
};

const searchExpedientes = (event: { query: string }) => {
  // Aquí iría la lógica para buscar expedientes en la base de datos
  // Por ahora, simularemos algunos resultados
  const query = event.query.toLowerCase();
  const allExpedientes = [
    { numero: "001-000003-0001", fecha: "2023-09-20", medicamentos: [] },
    { numero: "001-000004-0001", fecha: "2023-09-25", medicamentos: [] },
    { numero: "001-000005-0001", fecha: "2023-09-30", medicamentos: [] },
  ];
  filteredExpedientes.value = allExpedientes.filter(
    (exp) =>
      exp.numero.toLowerCase().includes(query) || exp.fecha.includes(query)
  );
};

const addExpedienteSelected = () => {
  if (
    selectedExpediente.value &&
    !expMother.expedientesHijos.some(
      (exp) => exp.numero === selectedExpediente.value?.numero
    )
  ) {
    expMother.expedientesHijos.push(selectedExpediente.value);
    selectedExpediente.value = null;
  }
};

const printExpediente = () => {
  console.log("Imprimiendo expediente:", expMother);
  alertStore.toastAlert("Impresión iniciada", "success", 5, "Éxito");
  // Aquí iría la lógica para imprimir el expediente
};

onMounted(() => {
  // Aquí podrías inicializar datos si es necesario
});
</script>

<template>
  <div class="card w-full">
    <Toolbar class="mb-4">
      <template #start>
        <span class="text-2xl text-cyan-900 dark:text-cyan-600">
          Gestión de Expedientes
        </span>
      </template>
    </Toolbar>

    <Toolbar class="rounded-3xl border border-cyan-700">
      <template #start>
        <div class="flex flex-row gap-4 items-center">
          <div>
            <Expediente @on-get-expediente="onExpediente" @on-clean-expediente="cleanData" :exp="expMother.numero" />
          </div>
        </div>
      </template>
    </Toolbar>

    <div class="flex flex-col gap-4 mt-4">
      <div v-if="expMother.numero">
        <label for="expediente" class="labelInput">Buscar Expediente Hijo</label>
        <div class="flex gap-2">
          <AutoComplete v-model="selectedExpediente" :suggestions="filteredExpedientes" @complete="searchExpedientes"
            field="numero" dropdown placeholder="Buscar expediente hijo" class="w-full" />
          <Button label="Agregar" icon="pi pi-plus" @click="addExpedienteSelected" :disabled="!selectedExpediente" />
        </div>
      </div>

      <DataTable :value="expMother.expedientesHijos" class="mt-4">
        <Column field="numero" header="Expediente"></Column>
        <Column field="fecha" header="Fecha"></Column>
        <Column header="Medicamentos">
          <template #body="{ data }">
            <DataTable :value="data.medicamentos">
              <Column field="nombre" header="Nombre"></Column>
              <Column field="dosis" header="Dosis"></Column>
              <Column field="cantidad" header="Cantidad"></Column>
            </DataTable>
          </template>
        </Column>
      </DataTable>

      <div class="flex justify-end mt-4">
        <Button label="Imprimir Expedientes" icon="pi pi-print" @click="printExpediente"
          :disabled="expMother.expedientesHijos.length === 0" />
      </div>
    </div>
  </div>
</template>
