<script setup lang="ts">
import type { ExpedienteMotherDTO } from "../../../services/humano/types";
import { jsPDF } from "jspdf";
import Button from "primevue/button";
import { ref, onMounted, type PropType } from "vue";
import { useDateFormat } from "@vueuse/core";
import { usePDFStore } from "../../../stores/pdf";
import Logo from "@/assets/imgs/dh.jpg";

const props = defineProps({
  data: { type: Object as PropType<ExpedienteMotherDTO>, required: true },
});

const pdfStore = usePDFStore();
const content = ref();
const imagenLogo = ref();
const loading = ref(false);

onMounted(() => {
  const img = new Image();
  img.src = Logo;
  img.onload = () => {
    imagenLogo.value = img;
  };
});

const downloadPdf = async () => {
  const doc = new jsPDF({
    orientation: "p",
    unit: "px",
    format: "a4",
    hotfixes: ["px_scaling"],
  });

  doc.html(content.value, {
    callback: function (doc) {
      doc.save(`expediente_master_${props.data.expediente}.pdf`);
    },
  });
};

const downloadPdfFromServer = async () => {
  if (!content.value) return;

  loading.value = true;

  try {
    const { success, content: pdfBlob } = await pdfStore.expedienteMasterForDTO(
      props.data
    );
    if (success && pdfBlob instanceof Blob) {
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `expediente_master_${props.data.expediente}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } else {
      throw new Error("Failed to generate PDF");
    }
  } catch (error) {
    console.error("Error al generar el PDF:", error);
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatDate = (value: Date) => useDateFormat(value, "DD/MM/YYYY").value;

const getDescuento = (precio: number, reconoce: number) => {
  const desc = (reconoce / 100) * precio;
  return formatCurrency(Number((precio - desc).toFixed(2)));
};
</script>

<template>
  <div class="card flex flex-col gap-4">
    <div class="flex justify-center">
      <Button label="Imprimir Informe" severity="help" icon="pi pi-print" @click="downloadPdfFromServer"
        :loading="loading" />
    </div>
    <div ref="content" class="pdf-content text-center border border-gray-200 rounded-lg shadow-lg p-2">
      <div class="flex justify-center mb-4">
        <img ref="imagenLogo" :src="Logo" alt="Obra Social Provincia" class="h-36 w-full" />
      </div>

      <div>
        <hr class="px-8" />
        <h2 class="mb-4 text-xl font-semibold leading-none text-gray-900 md:text-2xl dark:text-white">
          Informe de Medicamentos por Expediente
        </h2>

        <dl class="flex items-center space-x-6 border border-gray-200 rounded-lg p-4">
          <div>
            <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
              Nº Expediente Master
            </dt>
            <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {{ data.expediente }}
            </dd>
          </div>
        </dl>

        <hr class="px-8" />
        <p class="my-4 text-xl text-left font-extrabold leading-none text-cyan-900 md:text-2xl dark:text-white">
          Listado de Expedientes
        </p>

        <div v-for="(child, index) in data.children" :key="index" class="mb-8">
          <dl class="flex items-center space-x-6 border border-gray-200 rounded-lg p-4">
            <div>
              <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                Nº Expediente
              </dt>
              <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                {{ child.expediente }}
              </dd>
            </div>
            <div>
              <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                Fecha
              </dt>
              <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                {{ formatDate(child.fecha) }}
              </dd>
            </div>
            <div>
              <dt class="mb-2 font-semibold leading-none text-gray-900 dark:text-white">
                Farmacia
              </dt>
              <dd class="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                {{ child.farmacia!.apellido }}, {{ child.farmacia!.nombre }}
              </dd>
            </div>
          </dl>

          <div class="relative overflow-x-auto mt-4">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">Medicamento</th>
                  <th scope="col" class="px-6 py-3">Cantidad</th>
                  <th scope="col" class="px-6 py-3">Precio Unit.</th>
                  <th scope="col" class="px-6 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="med in child.medicamentos" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td scope="col"
                    class="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white text-wrap max-w-52">
                    {{ med.nombre }}
                  </td>
                  <td scope="col" class="px-6 py-4 text-wrap max-w-52">
                    {{ med.cantidad }}
                  </td>
                  <td scope="col" class="px-6 py-4 text-wrap max-w-52">
                    {{ getDescuento(med.precio, med.reconoce) }}
                  </td>
                  <td scope="col" class="px-6 py-4 text-wrap max-w-52">
                    {{ formatCurrency(med.total) }}
                  </td>
                </tr>
                <tr class="bg-gray-100 font-semibold">
                  <th scope="col" colspan="3" class="px-6 py-4 text-right">
                    SubTotal:
                  </th>
                  <th scope="col" class="px-6 py-4">
                    {{
                      formatCurrency(
                        child.medicamentos.reduce(
                          (sum, med) => sum + med.total,
                          0
                        )
                      )
                    }}
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-8 p-4 bg-gray-100 rounded-lg">
          <p class="text-xl font-bold text-right text-cyan-900">
            Monto Total:
            {{
              formatCurrency(
                data.children.reduce(
                  (sum, child) =>
                    sum +
                    child.medicamentos.reduce(
                      (medSum, med) => medSum + med.total,
                      0
                    ),
                  0
                )
              )
            }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex justify-center">
      <Button label="Descargar PDF" icon="pi pi-download" @click="downloadPdf" />
      <Button class="ml-4" label="Descargar PDF (Server)" severity="help" icon="pi pi-download"
        @click="downloadPdfFromServer" :loading="loading" />
    </div>
  </div>
</template>

<style scoped>
.pdf-content {
  width: 210mm;
  padding: 10mm;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

@media print {
  .pdf-content {
    width: 100%;
    padding: 0;
    box-shadow: none;
  }
}
</style>
