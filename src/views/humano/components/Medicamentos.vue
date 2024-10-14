<script setup lang="ts">
import {
  reactive,
  ref,
  onMounted,
  nextTick,
  computed,
  watch,
  type PropType,
} from "vue";
import { useAlertStore } from "../../../stores/index.ts";
import { useAlfabetaStore } from "../../../stores/alfabeta/index.ts";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue, maxValue } from "@vuelidate/validators";

import AutoComplete from "primevue/autocomplete";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import InputGroup from "primevue/inputgroup";
import Select from "primevue/select";
import Button from "primevue/button";

import ListaPrecio from "../components/ListaPrecio.vue";
import Dialog from "primevue/dialog";
import type { DetailsMed } from "../../../services/humano/types.ts";
import type { DrogaDTO } from "../../../services/alfabeta/types.ts";
import { storeToRefs } from "pinia";

const emit = defineEmits(["onAdd", "onCancel"]);
const props = defineProps({ row: Object as PropType<DetailsMed | null> });
const alerts = useAlertStore();
const alfabetaStore = useAlfabetaStore();
const { drogas } = storeToRefs(alfabetaStore);

const showModalHistory = ref(false);
const loading = ref(false);
const indices = ref([
  { name: "Monodroga", code: "nuevadro" },
  { name: "Multi Droga", code: "monodro" },
]);
const indice = ref("nuevadro");
const labelGrabar = ref("Agregar");
const selectedDroga = ref<DrogaDTO>();
const filteredDrogas = ref<DrogaDTO[]>([]);
const medicamento = reactive({
  drogaId: 0,
  oldDrogaId: 0,
  indice: "nuevadro",
  presentacion: "",
  nombre: "",
  precio: 0,
  cantidad: 1,
  reconoce: 15,
  subtotal: 0,
  total: 0,
  comentario: "",
});

onMounted(async () => {
  if (props.row && Object.keys(props.row).length !== 0) {
    labelGrabar.value = "Modificar";
    medicamento.drogaId = props.row.drogaId;
    medicamento.indice = props.row.indice;
    medicamento.presentacion = props.row.presentacion;
    medicamento.nombre = props.row.nombre;
    medicamento.precio = props.row.precio;
    medicamento.cantidad = props.row.cantidad;
    medicamento.reconoce = props.row.reconoce;
    medicamento.subtotal = props.row.subtotal ?? 0;
    medicamento.total = props.row.total;
    medicamento.comentario = props.row.comentario;
    medicamento.oldDrogaId = props.row.oldDrogaId ?? 0;
    indice.value = medicamento.indice;
    assignToDroga(medicamento as DetailsMed);
  } else {
    labelGrabar.value = "Agregar";
  }

  await nextTick();
});

const roundToTwo = (value: number) => {
  return Number(value.toFixed(2));
};

const subtotal = computed(() => {
  return roundToTwo(medicamento.precio * medicamento.cantidad);
});

const total = computed(() => {
  const descuento = subtotal.value * (medicamento.reconoce / 100);
  return roundToTwo(subtotal.value - descuento);
});

watch([subtotal, total, indice], ([newSubtotal, newTotal, newIndice]) => {
  medicamento.subtotal = newSubtotal;
  medicamento.total = newTotal;
  medicamento.indice = newIndice;
});

const rules = {
  nombre: { required },
  cantidad: { required, minValue: minValue(1) },
  reconoce: { minValue: minValue(0), maxValue: maxValue(100) },
};
const v$ = useVuelidate(rules, medicamento);

interface Query {
  query: string;
}

const searchMedicamento = async (query: Query) => {
  loading.value = true;
  try {
    const q = encodeURIComponent(query.query);
    const { success } = await alfabetaStore.fetchSearchMedicineAlfabeta(
      q,
      indice.value
    );
    if (success) {
      filteredDrogas.value = drogas.value;
    }
  } catch (error) {
    alerts.exception(error, 10);
  } finally {
    loading.value = false;
  }
};

const medicamentoSelected = (det: any) => {
  if (det && typeof det === "object") {
    Object.assign(medicamento, {
      drogaId: det.value.id,
      indice: det.value.tipo ?? indice.value,
      nombre: det.value.nombre,
      presentacion: det.value.presentacion,
      precio: det.value.precio,
    });
  }
};

const assignToDroga = (med: DetailsMed) => {
  if (med) {
    selectedDroga.value = {
      id: med.drogaId,
      indice: med.indice,
      nombre: med.nombre,
      presentacion: med.presentacion,
      precio: med.precio,
    };
  }
};

const addMedicine = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) {
    return;
  }

  emit("onAdd", medicamento);
};

const closeMedicine = () => {
  emit("onCancel");
};

const changePrice = (value: number) => {
  alerts.toastAlert(value.toString(), "warn", 10, "Nuevo precio");
  medicamento.precio = value;
  showModalHistory.value = false;
};
</script>

<template>
  <div class="card w-full">
    <div class="grid grid-cols-6 gap-4">
      <div class="col-span-6 sm:col-span-2">
        <label for="indice" class="labelInput">Buscar por</label>
        <Select v-model="indice" :options="indices" optionValue="code" optionLabel="name"
          class="w-full h-10 md:w-14rem" />
      </div>
      <div class="col-span-6 sm:col-span-4">
        <label for="droga" class="labelInput">Medicamento</label>
        <AutoComplete v-model="selectedDroga" :suggestions="filteredDrogas" optionLabel="nombre" class="w-full"
          pt:pcinput:class="w-full" pt:inputMultiple:class="w-full" :loading="loading"
          placeholder="Escriba nombre del medicamento" @item-select="medicamentoSelected" @complete="searchMedicamento"
          forceSelection :minLength="2" input-id="droga">
          <template #option="slotProps">
            <div class="flex align-options-center">
              {{ slotProps.option.nombre }} ($ {{ slotProps.option.precio }})
            </div>
          </template>
        </AutoComplete>
        <p class="mt-0 text-sm text-red-600 dark:text-red-500">
          <span v-if="v$.nombre.required?.$invalid">Debe ingresar un medicamento</span>
        </p>
      </div>

      <div class="col-span-6 sm:col-span-2">
        <label for="preciounitario" class="labelInput">Precio Unitario</label>
        <InputGroup>
          <Button type="button" icon="pi pi-history" @click="showModalHistory = true" />
          <InputNumber v-model="medicamento.precio" prefix="$" :min="0" class="w-full" />
        </InputGroup>
        <p class="mt-0 text-sm text-red-600 dark:text-red-500">
          <span v-if="v$.reconoce.minvalue?.$invalid">debe ser un valor positivo.</span>
        </p>
        <!-- Agregar modal de lista de precios  -->
      </div>

      <div class="col-span-6 sm:col-span-2">
        <label for="cantidad" class="labelInput">Cantidad</label>
        <InputNumber v-model="medicamento.cantidad" :min="1" class="w-full" />
        <p class="mt-0 text-sm text-red-600 dark:text-red-500">
          <span v-if="v$.cantidad.minValue?.$invalid">Cantidad debe ser mayor a 0.</span>
        </p>
      </div>

      <div class="col-span-6 sm:col-span-2">
        <label for="reconoce" class="labelInput">Reconoce</label>
        <InputNumber v-model="medicamento.reconoce" suffix="%" :min="0" :max="100" class="w-full" />
        <p class="mt-0 text-sm text-red-600 dark:text-red-500">
          <span v-if="v$.reconoce.minValue?.$invalid">Debe ser un valor positivo.</span>
        </p>
        <p class="mt-0 text-sm text-red-600 dark:text-red-500">
          <span v-if="v$.reconoce.maxValue?.$invalid">No puede separar el 100%</span>
        </p>
      </div>

      <div class="col-span-6 sm:col-span-3">
        <label for="subtotal" class="labelInput">Sub Total</label>
        <InputNumber v-model="subtotal" disabled prefix="$" class="w-full" />
      </div>

      <div class="col-span-6 sm:col-span-3">
        <label for="total" class="labelInput">Total</label>
        <InputNumber v-model="total" disabled prefix="$" class="w-full" />
      </div>

      <div class="col-span-6">
        <label for="observaciones" class="labelInput">Observaciones</label>
        <Textarea v-model="medicamento.comentario" rows="3" cols="30" class="w-full" />
      </div>

      <div class="col-span-6 mt-4">
        <div class="flex justify-end gap-4">
          <Button label="Cancelar" icon="pi pi-times" @click="closeMedicine" severity="secondary" />
          <Button :label="labelGrabar" icon="pi pi-plus" @click="addMedicine" :loading="loading" />
        </div>
      </div>
    </div>

    <Dialog v-model:visible="showModalHistory" maximizable :style="{ width: '50vw' }" header="Historial de precios"
      :modal="true" class="p-fluid" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <ListaPrecio @onSelect="changePrice" @onClose="showModalHistory = false" :id="medicamento.drogaId"
        :indice="indice" :filter="selectedDroga?.nombre ?? ''" />
    </Dialog>
  </div>
</template>
