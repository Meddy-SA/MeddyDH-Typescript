<script setup lang="ts">
import { onMounted, ref, type PropType } from "vue";
import { useAlertStore } from "../stores";
import { useHumanoStore } from "../stores/humano";
import { storeToRefs } from "pinia";
import Button from "primevue/button";
import InputGroup from "primevue/inputgroup";
import InputMask from "primevue/inputmask";

const emit = defineEmits(["onGetExpediente", "onCleanExpediente"]);
const props = defineProps({
  masterExpediente: Boolean as PropType<boolean | false>,
});

console.log(props);

const alerts = useAlertStore();
const humanoStore = useHumanoStore();
const { medicamento, isLoading } = storeToRefs(humanoStore);

const expediente = ref<InstanceType<typeof InputMask>>(); // Ref to inputmask
const expedienteCargado = ref(false);
const iconButton = ref("pi pi-check");
const expedienteNumber = ref("");

onMounted(() => {
  expediente.value?.$el.focus();
});

const onClickButton = async () => {
  if (expedienteCargado.value) {
    cleanExpediente();
  } else {
    await getDesarrolloHumano();
  }
};

const getDesarrolloHumano = async () => {
  if (expedienteNumber.value === "") {
    return;
  }
  try {
    const response = await humanoStore.fetchExpediente(expedienteNumber.value);
    if (response.success) {
      iconButton.value = "pi pi-refresh";
      expedienteCargado.value = true;

      emit("onGetExpediente", medicamento);
    } else {
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

const cleanExpediente = () => {
  iconButton.value = "pi pi-check";
  expedienteCargado.value = false;
  expedienteNumber.value = "";
  emit("onCleanExpediente");
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
