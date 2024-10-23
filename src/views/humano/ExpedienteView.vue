<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { storeToRefs } from "pinia";
import Expediente from "../../components/Expediente.vue";
import Toolbar from "primevue/toolbar";
import Card from "primevue/card";
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import ConfirmPopup from "primevue/confirmpopup";
import Dialog from "primevue/dialog";
import { useConfirm } from "primevue/useconfirm";
import { useAlertStore } from "../../stores";
import { useHumanoStore } from "../../stores/humano";
import type {
  DetailsMed,
  ExpedienteMotherDTO,
  MedicamentoDTO,
} from "../../services/humano/types";
import { useDateFormat } from "@vueuse/core";
import ExpedientePDF from "./components/ExpedientePdf.vue";

const alertStore = useAlertStore();
const humanoStore = useHumanoStore();
const confirm = useConfirm();
const {
  expedientes,
  isLoading,
  expMother: expMaster,
} = storeToRefs(humanoStore);

const expMother = reactive<ExpedienteMotherDTO>({
  id: 0,
  expediente: "",
  children: [],
});

const filteredExpedientes = ref<MedicamentoDTO[]>([]);
const selectedExpediente = ref<MedicamentoDTO | null>(null);
const showPDF = ref(false);

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });
const formatDate = (value: string) =>
  useDateFormat(new Date(value), "DD/MM/YYYY").value;

// Crear una funcion para obtener el precio unitario con descuento
const getDescuento = (precio: number, reconoce: number) => {
  const desc = (reconoce / 100) * precio;
  return formatCurrency(Number((precio - desc).toFixed(2)));
};

const onExpediente = (expedienteData: MedicamentoDTO | ExpedienteMotherDTO) => {
  if ("children" in expedienteData) {
    Object.assign(expMother, expedienteData);
  }
};

const cleanData = () => {
  expMother.expediente = "";
  expMother.children = [];
};

const searchExpedientes = async (event: { query: string }) => {
  isLoading.value = true;
  const query = event.query.toLowerCase();
  try {
    const response = await humanoStore.fetchChildrenMaster(query);
    if (response.success) {
      filteredExpedientes.value = expedientes.value;
    } else {
      alertStore.toastAlert("Error al buscar expedientes", "error", 5, "Error");
    }
  } catch (error) {
    console.error("Error searching expedientes:", error);
    alertStore.toastAlert("Error al buscar expedientes", "error", 5, "Error");
  } finally {
    isLoading.value = false;
  }
};

const addExpedienteSelected = () => {
  if (
    selectedExpediente.value &&
    !expMother.children.some(
      (exp) => exp.expediente === selectedExpediente.value?.expediente
    )
  ) {
    expMother.children.push(selectedExpediente.value);
    selectedExpediente.value = null;
  }
};

const printExpediente = () => {
  alertStore.toastAlert("Impresión iniciada", "success", 5, "Éxito");
  showPDF.value = true;
};

const deleteRow = (expediente: string) => {
  expMother.children = expMother.children.filter(
    (exp) => exp.expediente !== expediente
  );
};

const confirmDeleteExpediente = (event: Event, expediente: string) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: "¿Seguro que desea eliminar esta fila?",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancelar",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Eliminar",
    },
    accept: () => {
      deleteRow(expediente);
    },
    reject: () => { },
  });
};

const calculateSubTotal = (medicamentos: DetailsMed[]): number => {
  return medicamentos.reduce((sum, med) => sum + med.total, 0);
};

const montoTotal = computed(() => {
  return expMother.children.reduce((total, exp) => {
    return total + calculateSubTotal(exp.medicamentos);
  }, 0);
});

const isDisabled = computed(() => {
  return expMother.children.length === 0;
});

const saveMasterExpediente = async () => {
  isLoading.value = true;
  try {
    const response = await humanoStore.createOrUpdateMaster(expMother);
    if (response.success) {
      Object.assign(expMother, expMaster.value);
      alertStore.toastAlert(
        "Expediente actualizado con exito",
        "success",
        5,
        "Éxito"
      );
    } else {
      if (response.error) {
        alertStore.toastAlert(response.error, "error", 5, "Error");
      } else {
        alertStore.toastAlert("Error al crear expediente", "error", 5, "Error");
      }
    }
  } catch (error) {
    alertStore.exception(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="card w-full h-full bg-sky-50">
    <ConfirmPopup></ConfirmPopup>
    <Toolbar class="mb-4">
      <template #center>
        <span class="text-2xl text-cyan-900 dark:text-cyan-600">
          Gestión de Expedientes
        </span>
      </template>
    </Toolbar>

    <Card>
      <template #content>
        <Expediente @on-get-expediente="onExpediente" @on-clean-expediente="cleanData" :masterExpediente="true"
          :exp="expMother.expediente" class="w-full" />
      </template>
    </Card>

    <div class="flex flex-col gap-4 mt-4">
      <div v-if="expMother.expediente" class="p-4 bg-white border-2 border-cyan-700 rounded-lg">
        <label for="expediente" class="labelInput">Buscar Expediente Hijo</label>
        <div class="flex gap-2">
          <AutoComplete v-model="selectedExpediente" :suggestions="filteredExpedientes" @complete="searchExpedientes"
            field="expediente" option-label="expediente" dropdown placeholder="Buscar expediente hijo" class="w-full" />
          <Button label="Agregar" icon="pi pi-plus" @click="addExpedienteSelected" :disabled="!selectedExpediente" />
        </div>
      </div>

      <DataTable :value="expMother.children" class="mt-4" :loading="isLoading">
        <Column field="expediente" header="Expediente"></Column>
        <Column field="fecha" header="Fecha">
          <template #body="{ data }">
            {{ formatDate(data.fecha) }}
          </template>
        </Column>
        <Column header="Medicamentos">
          <template #body="{ data }">
            <span class="text-slate-300">
              {{ data.farmacia.apellido }}, {{ data.farmacia.nombre }}
            </span>
            <DataTable :value="data.medicamentos">
              <Column field="nombre" header="Nombre"></Column>
              <Column field="cantidad" header="Cantidad"></Column>
              <Column field="precio" header="Precio Unit.">
                <template #body="{ data }">
                  {{ getDescuento(data.precio, data.reconoce) }}
                </template>
              </Column>
              <Column field="total" header="Total">
                <template #body="{ data }">
                  {{ formatCurrency(data.total) }}
                </template>
              </Column>
              <ColumnGroup type="footer">
                <Row>
                  <Column footer="Monto SubTotal:" :colspan="3" footerStyle="text-align:right" />
                  <Column :footer="formatCurrency(calculateSubTotal(data.medicamentos))
                    " />
                </Row>
              </ColumnGroup>
            </DataTable>
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 8rem">
          <template #body="{ data }">
            <Button icon="pi pi-trash" outlined rounded severity="danger"
              @click="confirmDeleteExpediente($event, data.expediente)" />
          </template>
        </Column>
        <ColumnGroup type="footer">
          <Row>
            <Column footer="Monto Total:" :colspan="2" footer-class="text-lg font-semibold text-cyan-700"
              footerStyle="text-align:right" />
            <Column :footer="formatCurrency(montoTotal)" :colspan="2" footer-class="text-xl font-bold text-cyan-800" />
          </Row>
        </ColumnGroup>
      </DataTable>

      <div class="flex justify-end my-4">
        <Button label="Imprimir Expedientes" severity="secondary" icon="pi pi-print" @click="printExpediente"
          :disabled="isDisabled" />
        <Button label="Grabar Cambios" icon="pi pi-save" class="ml-4" @click="saveMasterExpediente" :loading="isLoading"
          :disabled="isDisabled" />
      </div>
    </div>
    <Dialog v-model:visible="showPDF" modal>
      <ExpedientePDF :data="expMother" />
    </Dialog>
  </div>
</template>
