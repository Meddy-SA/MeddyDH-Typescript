<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from "vue";
// Types
import type { PrestadorDTO } from "../../services/prestadores/types";
import type { DetailsMed, MedicamentoDTO } from "../../services/humano/types";
import type { EnumDTO } from "../../services/system/types";
// Components
import Expediente from "../../components/Expediente.vue";
import Medicamentos from "./components/Medicamentos.vue";
// Services
import { useSystemStore } from "../../stores/system";
import { usePrestadorStore } from "../../stores/prestadores";
import { FilterMatchMode } from "@primevue/core/api";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";
// Tools
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Toolbar from "primevue/toolbar";
import Select from "primevue/select";
import Card from "primevue/card";
import DatePicker from "primevue/datepicker";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

// Constant for Services
const system = useSystemStore();
const prestador = usePrestadorStore();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Constant of system
const loading = ref(false);
const minDate = ref(new Date());
const showDialog = ref(false);
const deleteProductDialog = ref(false);
const farmaciaSelected = ref<PrestadorDTO>();
const farmacias = ref<PrestadorDTO[]>([]);
const rowsMedic = ref<DetailsMed[]>([]);
const product = ref<DetailsMed | null>();

const baseFarmacia: PrestadorDTO = {
  prestadorId: 0,
  nombre: "",
  apellido: "",
  matricula: "",
};
const baseEstado: EnumDTO = { id: 0, nombre: "Activo", severity: "success" };

const medDTO = reactive({
  id: -1,
  expediente: "",
  fecha: minDate.value,
  fechaString: minDate.value.toISOString().split("T")[0],
  farmacia: baseFarmacia,
  prestadoresId: 0,
  estado: baseEstado,
  medicamentos: [],
  rows: 0,
});

// Validate
const rules = {
  fecha: { required },
  farmacia: { nombre: { required } },
  rows: { minValue: minValue(1) },
};
const v$ = useVuelidate(rules, medDTO);

// Vue Method
onMounted(async () => {
  const r = await system.dispatchGetFecha();
  if (r.success) {
    minDate.value = system.state ?? new Date();
  }
  const { success } = await prestador.dispatchGetFarmacias();
  if (success) {
    farmacias.value = prestador.state;
  }
});

const formatCurrency = (value: number) => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const sumTotal = computed(() => {
  const total = rowsMedic.value.reduce((acc, row) => acc + (row.total || 0), 0);
  return formatCurrency(total);
});

const editProduct = (prod: DetailsMed) => {
  prod.oldDrogaId = prod.drogaId;
  product.value = prod;
  showDialog.value = true;
};

const confirmDeleteProduct = (prod: DetailsMed) => {
  product.value = prod;
  deleteProductDialog.value = true;
};

const deleteProduct = () => {
  rowsMedic.value = rowsMedic.value.filter(
    (val) => val.drogaId !== product.value?.drogaId
  );
  deleteProductDialog.value = false;
  product.value = null;
  medDTO.rows = rowsMedic.value.length;
};

// Expediente Zone
const onExpediente = async (m: MedicamentoDTO) => {
  try {
    medDTO.id = m.id;
    const fecha = new Date(m.fecha);
    medDTO.fecha = fecha;
    medDTO.fechaString = fecha.toISOString();
    medDTO.expediente = m.expediente;
    medDTO.farmacia = m.farmacia!;
    medDTO.prestadoresId = m.prestadoresId;
    medDTO.estado = m.estado;
    if (m.medicamentos && m.medicamentos.length > 0) {
      rowsMedic.value = [...m.medicamentos];
      rowsMedic.value.forEach((row) => {
        const sub = row.precio * row.cantidad;
        row.subtotal = Number(sub.toFixed(2));
      });
      medDTO.rows = rowsMedic.value.length;
    }
    await nextTick();
    farmaciaSelected.value = m.farmacia;
  } catch (error) {
    console.log(error);
  }
};

// Medicamento Zone
const onAddMedicamento = (medicamento: DetailsMed) => {
  if (!medicamento) return;

  // Buscar si el medicamento ya existe en rowsMedic por id o algún criterio único
  const existingIndex = rowsMedic.value.findIndex(
    (med: DetailsMed) => med.id === medicamento.id
  );

  if (existingIndex > -1) {
    // Si ya existe el medicamento, actualizarlo si es necesario
    const existingMed = rowsMedic.value[existingIndex];
    rowsMedic.value[existingIndex] = { ...existingMed };
  } else {
    // Si no existe, agregarlo a la lista
    rowsMedic.value = [...rowsMedic.value, medicamento];
  }

  onCloseMedicamento();
};

const onCloseMedicamento = () => {
  showDialog.value = false;
  product.value = null;
  medDTO.rows = rowsMedic.value.length;
};
</script>

<template>
  <div class="card w-full">
    <Toolbar class="mb-4">
      <template #start>
        <span class="text-2xl text-cyan-900 dark:text-cyan-600">Medicamentos por Expedientes</span>
      </template>

      <template #end> </template>
    </Toolbar>

    <div class="flex flex-col gap-4">
      <Expediente @on-get-expediente="onExpediente" />
      <div v-if="medDTO.id > -1" class="grid grid-cols-6 gap-4">
        <div class="col-span-6 sm:col-span-3">
          <label for="plan" class="labelInput">Farmacia</label>
          <Select inputId="plan" v-model="farmaciaSelected" :options="farmacias" :loading="loading" optionLabel="nombre"
            pt:root:class="w-full" placeholder="Seleccione una Farmacia" checkmark />
          <p class="mt-0 text-sm text-red-600 dark:text-red-500">
            <span v-if="v$.farmacia.nombre.required.$invalid">Debe seleccionar una farmacia</span>
          </p>
        </div>

        <div class="col-span-6 sm:col-span-3">
          <label for="fecha" class="labelInput">Fecha</label>
          <DatePicker v-model="medDTO.fecha" dateFormat="dd/mm/yy" pt:root:class="w-full h-11" showIcon
            icon-display="input" showButtonBar :minDate="minDate" />
          <p class="mt-0 text-sm text-red-600 dark:text-red-500">
            <span v-if="v$.fecha.required.$invalid">Debe ingresar una fecha</span>
          </p>
        </div>

        <div class="col-span-6">
          <Card>
            <template #title>Medicamentos</template>
            <template #content>
              <DataTable ref="dt" :value="rowsMedic" dataKey="id" :filters="filters" :loading="loading">
                <template #header>
                  <div class="flex flex-wrap gap-2 items-center justify-between">
                    <Button label="Agregar Medicamentos" icon="pi pi-plus" @click="showDialog = true" />
                    <div></div>
                    <IconField iconPosition="left">
                      <InputIcon class="pi pi-search"></InputIcon>
                      <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                    </IconField>
                  </div>
                </template>
                <Column field="nombre" header="Medicamento"></Column>
                <Column field="precio" header="Precio Unitario">
                  <template #body="props">
                    {{ formatCurrency(props.data.precio) }}
                  </template>
                </Column>
                <Column field="cantidad" header="Cantidad"></Column>
                <Column field="subtotal" header="SubTotal">
                  <template #body="props">
                    {{ formatCurrency(props.data.subtotal) }}
                  </template>
                </Column>
                <Column field="reconoce" header="Reconoce">
                  <template #body="props">
                    {{ props.data.reconoce }}%
                  </template>
                </Column>
                <Column field="total" header="Total">
                  <template #body="props">
                    {{ formatCurrency(props.data.total) }}
                  </template>
                </Column>
                <Column field="comentario" header="Observación"></Column>
                <Column :exportable="false" style="min-width: 8rem">
                  <template #body="{ data }">
                    <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(data)" />
                    <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(data)" />
                  </template>
                </Column>
                <ColumnGroup type="footer">
                  <Row>
                    <Column footer="TOTAL" :colspan="5" footer-style="text-align:right" />
                    <Column :footer="sumTotal" />
                  </Row>
                </ColumnGroup>
              </DataTable>
              <p class="mt-0 text-sm text-red-600 dark:text-red-500">
                <span v-if="v$.rows.minValue.$invalid">Debe ingresar un medicamento</span>
              </p>
            </template>
          </Card>
        </div>

        <div class="col-span-6 flex justify-center p-2">
          <Button label="Guardar cambios" icon="pi pi-save" severity="success" :loading="loading" />
        </div>
      </div>
    </div>

    <Dialog v-model:visible="showDialog" maximizable :style="{ width: '50rem' }" header="Agregar Medicamento"
      :modal="true" class="p-fluid" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <template v-if="showDialog">
        <Medicamentos :row="product" @on-add="onAddMedicamento" @on-cancel="onCloseMedicamento" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Eliminar?" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product">¿Esta seguro que desea elimnar <b>{{ product.nombre }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
        <Button label="Si" icon="pi pi-check" text @click="deleteProduct" />
      </template>
    </Dialog>
  </div>
</template>
