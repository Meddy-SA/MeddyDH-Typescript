<script setup lang="ts">
import { onMounted, ref } from "vue";
import Button from "primevue/button";
import InputGroup from "primevue/inputgroup";
import InputText from "primevue/inputtext";
import type { Paciente } from "../../../services/paciente/types";

const emit = defineEmits(["onGetPatient", "onCleanPatient"]);
const loading = ref(false);
const identifier = ref();
const pacienteCargado = ref(false);
const iconButton = ref("pi pi-check");
const modelData: Paciente = {
  pacienteId: 0,
  nombre: "",
  apellido: "",
  dni: "",
  sexo: "",
  fechaNacimiento: new Date(),
  estado: {
    id: 0,
    nombre: "Activo",
    severity: "success",
  },
};
const paciente = ref<Paciente>(modelData);

onMounted(() => {
  identifier.value.$el.focus();
});

const onClickButton = async () => {
  loading.value = true;
  if (pacienteCargado.value) {
    cleanAfiliado();
  } else {
    await getPaciente();
  }
};

const getPaciente = async () => {
  if (paciente.value.dni === "") {
    loading.value = false;
    return;
  }
  loading.value = true;
};

const cleanAfiliado = () => {
  iconButton.value = "pi pi-check";
  loading.value = false;
  identifier.value.$el.focus();
};
</script>

<template>
  <div class="w-full p-2 bg-blue-100 border rounded-lg dark:bg-zinc-800">
    <div class="grid grid-cols-6 gap-4">
      <div class="col-span-6 sm:col-span-2">
        <label for="identifier" class="labelInput">Nº Identificación</label>
        <InputGroup>
          <InputText ref="identifier" name="identifier" v-model="paciente.dni" @keyup.enter="getPaciente"
            :readonly="pacienteCargado" placeholder="Identificación del afiliado" pt:root:class="w-full"
            autocomplete="off" autofocus />
          <Button :icon="iconButton" severity="contrast" outlined @click="onClickButton" :loading="loading" />
        </InputGroup>
      </div>
      <div class="col-span-6 sm:col-span-4">
        <label for="name" class="labelInput">Nombre</label>
        <InputText name="nombre" v-model="paciente.fullName" disabled
          pt:root:class="w-full disabled:bg-gray-50 dark:disabled:bg-zinc-800 dark:disabled:text-gray-100" />
      </div>
      <div class="col-span-6">
        <div v-if="paciente.pacienteId !== 0"
          class="flex flex-col sm:flex-row justify-between gap-4 rounded-lg items-center border-2 border-cyan-950 bg-white shadow-lg p-4 dark:bg-gray-800">
          <div class="flex flex-row items-center">
            <box-icon type="solid" name="user" class="w-8 h-8 fill-gray-800 dark:fill-gray-100"></box-icon>
            <div class="flex flex-wrap sm:flex-row gap-2 text-center items-center">
              <div>
                <dt class="labelInput">Fecha Nacimiento</dt>
                <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                  {{ paciente.fechaNacimiento }}
                </dd>
              </div>
              <div>
                <dt class="labelInput">Sexo</dt>
                <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                  {{ paciente.sexo }}
                </dd>
              </div>
            </div>
          </div>

          <div class="mr-8 flex flex-row gap-4 ml-5 sm:ml-0">
            <Button label="Consumo" text raised severity="secondary">
              <box-icon name="bar-chart-alt-2"
                class="w-8 h-8 sm:w-5 sm:h-5 mr-2 fill-[var(--text-color-secondary)]"></box-icon>
              Consumo
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
