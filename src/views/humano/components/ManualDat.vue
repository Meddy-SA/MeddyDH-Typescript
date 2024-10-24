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
import { storeToRefs } from "pinia";
import { useAlertStore } from "../../../stores/index.ts";
import { useAlfabetaStore } from "../../../stores/alfabeta/index.ts";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue, maxValue } from "@vuelidate/validators";

import AutoComplete from "primevue/autocomplete";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import InputGroup from "primevue/inputgroup";
import Button from "primevue/button";

import ListaPrecio from "../components/PreciosManualDat.vue";
import Dialog from "primevue/dialog";
import type { DetailsMed } from "../../../services/humano/types.ts";
import type { DrogaDTO } from "../../../services/alfabeta/types.ts";

const props = defineProps({
  row: Object as PropType<DetailsMed | null>,
  fecha: {
    type: Date,
    required: false,
    default: () => new Date(),
  },
});
const emit = defineEmits(["onAdd", "onCancel"]);

const alerts = useAlertStore();
const alfabetaStore = useAlfabetaStore();
const { drogas } = storeToRefs(alfabetaStore);

const showModalHistory = ref(false);
const loading = ref(false);

const labelGrabar = computed(() => (props.row ? "Modificar" : "Agregar"));
const selectedDroga = ref<DrogaDTO>();
const filteredDrogas = ref<DrogaDTO[]>([]);
const medicamento = reactive({
  drogaId: 0,
  oldDrogaId: 0,
  indice: "manual",
  presentacion: "",
  nombre: "",
  precio: 0,
  cantidad: 1,
  reconoce: 15,
  subtotal: 0,
  total: 0,
  comentario: "",
});

const rules = {
  nombre: { required },
  cantidad: { required, minValue: minValue(1) },
  reconoce: { minValue: minValue(0), maxValue: maxValue(100) },
};
const v$ = useVuelidate(rules, medicamento);

onMounted(async () => {
  if (props.row && Object.keys(props.row).length !== 0) {
    Object.assign(medicamento, props.row);
    medicamento.subtotal = props.row.subtotal ?? 0;
    medicamento.oldDrogaId = props.row.oldDrogaId ?? 0;
    assignToDroga(medicamento as DetailsMed);
  }
  await nextTick();
});

const subtotal = computed(() =>
  Number((medicamento.precio * medicamento.cantidad).toFixed(2))
);
const total = computed(() => {
  const descuento = subtotal.value * (medicamento.reconoce / 100);
  return Number((subtotal.value - descuento).toFixed(2));
});

watch([subtotal, total], ([newSubtotal, newTotal]) => {
  medicamento.subtotal = newSubtotal;
  medicamento.total = newTotal;
});

const searchMedicamento = async (event: { query: string }) => {
  loading.value = true;
  try {
    const q = encodeURIComponent(event.query);
    const fechaString = props.fecha.toISOString().split("T")[0];
    console.log(fechaString);
    const { success } = await alfabetaStore.fetchSearchMedicine(q, fechaString);
    if (success) {
      filteredDrogas.value = drogas.value;
    }
  } catch (error) {
    alerts.exception(error, 10);
  } finally {
    loading.value = false;
  }
};

const medicamentoSelected = (event: { value: DrogaDTO }) => {
  Object.assign(medicamento, {
    drogaId: event.value.id,
    indice: "manual",
    nombre: event.value.nombre,
    presentacion: event.value.presentacion,
    precio: event.value.precio,
  });
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
  if (!isFormCorrect) return;
  emit("onAdd", medicamento);
};

const closeMedicine = () => emit("onCancel");

const changePrice = (value: number) => {
  alerts.toastAlert(value.toString(), "warn", 10, "Nuevo precio");
  medicamento.precio = value;
  showModalHistory.value = false;
};
</script>

<template>
  <div class="card w-full">
    <div class="grid grid-cols-6 gap-4">
      <div class="col-span-6">
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
        :product="medicamento.nombre" />
    </Dialog>
  </div>
</template>
