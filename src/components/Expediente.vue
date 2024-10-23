<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from "vue";
import { useAlertStore } from "../stores";
import { useHumanoStore } from "../stores/humano";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import InputGroup from "primevue/inputgroup";
import InputMask from "primevue/inputmask";
import type {
  ExpedienteMotherDTO,
  MedicamentoDTO,
} from "../services/humano/types";

interface Props {
  masterExpediente?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  masterExpediente: false,
});

const emit = defineEmits<{
  (e: "onGetExpediente", value: MedicamentoDTO | ExpedienteMotherDTO): void;
  (e: "onCleanExpediente"): void;
}>();

const alerts = useAlertStore();
const humanoStore = useHumanoStore();
const { medicamento, isLoading, expMother } = storeToRefs(humanoStore);

const expediente = ref<InstanceType<typeof InputMask> | null>(null); // Ref to inputmask
const expedienteCargado = ref(false);
const expedienteNumber = ref("");

const iconButton = computed(() =>
  expedienteCargado.value ? "pi pi-refresh" : "pi pi-check"
);

onMounted(() => {
  expediente.value?.$el.focus();
});

const onClickButton = async () => {
  expedienteCargado.value ? cleanExpediente() : await getDesarrolloHumano();
};

const getDesarrolloHumano = async () => {
  if (!expedienteNumber.value) return;

  try {
    let response;
    if (!props.masterExpediente) {
      response = await humanoStore.fetchExpediente(expedienteNumber.value);
      if (response.success && medicamento.value) {
        expedienteCargado.value = true;
        if (medicamento.value.expediente === null) {
          medicamento.value.expediente = expedienteNumber.value;
        }
        emit("onGetExpediente", medicamento.value!);
      }
    } else {
      response = await humanoStore.fetchExpedienteMaster(
        expedienteNumber.value
      );
      if (response.success) {
        expedienteCargado.value = true;
        if (expMother.value && expMother.value.expediente === null) {
          expMother.value.expediente = expedienteNumber.value;
          expMother.value.children = [];
        }
      }
      emit("onGetExpediente", expMother.value!);
    }

    if (!response.success) {
      alerts.toastAlert(
        "Error al recuperar expediente",
        "warn",
        10,
        "Atención ⚠️"
      );
    }
  } catch (error) {
    alerts.exception(error, 10);
  }
};

const cleanExpediente = async () => {
  expedienteCargado.value = false;
  expedienteNumber.value = "";
  emit("onCleanExpediente");

  await nextTick();

  // Forzar una actualización del InputMask
  if (expediente.value && expediente.value.$el instanceof HTMLInputElement) {
    expediente.value.$el.value = "";
    // Disparar un evento de input para asegurar que PrimeVue actualice su estado interno
    expediente.value.$el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  await nextTick();
  expediente.value?.$el.focus();
};
</script>

<template>
  <div class="w-full p-2 bg-blue-100 border rounded-lg dark:bg-zinc-800">
    <div class="grid grid-cols-6 gap-4">
      <div class="col-span-6 sm:col-span-2">
        <label for="expediente" class="labelInput">Nº Expediente</label>
        <InputGroup>
          <InputMask ref="expediente" id="expediente" autocomplete="off" autofocus v-model="expedienteNumber"
            @keydown.enter="getDesarrolloHumano" :readonly="expedienteCargado" mask="999-999999-9999"
            slot-char="000-000000-0000" placeholder="Número de Expediente" pt:root:class="w-full" />

          <Button :icon="iconButton" severity="contrast" outlined @click="onClickButton" :loading="isLoading" />
        </InputGroup>
      </div>
    </div>
  </div>
</template>
