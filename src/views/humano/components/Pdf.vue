<script setup lang="ts">
import type { MedicamentoDTO } from "../../../services/humano/types";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Button from "primevue/button";
import { ref, onMounted, type PropType } from "vue";

const props = defineProps({
  data: { type: Object as PropType<MedicamentoDTO>, required: true },
});
const doc = new jsPDF({
  orientation: "p",
  unit: "px",
  format: "a4",
  hotfixes: ["px_scaling"],
});

onMounted(() => {
  console.log(doc.getFontList());
});

const content = ref();
const logoContent = ref();
const downloadPdf = () => {
  html2canvas(logoContent.value).then(() => {
    doc.html(content.value, {
      callback: function (doc) {
        doc.save(`expediente_${props.data.expediente}.pdf`);
      },
      x: 10,
      y: 180,
    });
  });
};
</script>

<template>
  <div class="card flex flex-col gap-4">
    <div class="text-center border border-gray-200 rounded-lg shadow-lg p-2">
      <div class="flex justify-between max-w-2xl">
        <div class="p-4">Ministerio de Desarrollo Humano</div>
        <div ref="logoContent" class="mr-8">
          Ministerio de Desarrollo Humano
        </div>
      </div>

      <div ref="content">
        <hr class="px-8" />
        <h2 class="mb-4 text-xl font-semibold leading-none text-gray-900 md:text-2xl dark:text-white">
          Medicamentos del Expediente
        </h2>

        <dl class="flex items-center space-x-6 border border-gray-200 rounded-lg p-4">
          <div>
            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
              Nº Expediente
            </dt>
            <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {{ data.expediente }}
            </dd>
          </div>

          <div>
            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
              Fecha
            </dt>
            <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {{
                new Date(data.fecha).toLocaleString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              }}
            </dd>
          </div>
        </dl>

        <hr class="px-8" />
        <p class="my-4 text-xl text-left font-extrabold leading-none text-cyan-900 md:text-2xl dark:text-white">
          Farmacia
        </p>

        <dl class="flex items-center space-x-6 border border-gray-200 rounded-lg p-4">
          <div>
            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
              Nombre
            </dt>
            <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {{ data.farmacia?.apellido }} {{ data.farmacia?.nombre }}
            </dd>
          </div>
        </dl>

        <div class="relative overflow-x-auto">
          <hr class="px-8" />
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">Medicamento</th>
                <th scope="col" class="px-6 py-3">Cantidad</th>
                <th scope="col" class="px-6 py-3">Precio</th>
                <th scope="col" class="px-6 py-3">Reconoce</th>
                <th scope="col" class="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="med in data.medicamentos" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="col"
                  class="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white text-wrap max-w-52">
                  {{ med.nombre }}
                </th>
                <th scope="col" class="px-6 py-4 text-wrap max-w-52">
                  {{ med.cantidad }}
                </th>
                <th scope="col" class="px-6 py-4 text-wrap max-w-52">
                  $ {{ med.precio }}
                </th>
                <th scope="col" class="px-6 py-4 text-wrap max-w-52">
                  {{ med.reconoce }} %
                </th>
                <th scope="col" class="px-6 py-4 text-wrap max-w-52">
                  $ {{ med.total }}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <Button label="Descargar PDF" icon="pi pi-download" @click="downloadPdf" />
    </div>
  </div>
</template>
