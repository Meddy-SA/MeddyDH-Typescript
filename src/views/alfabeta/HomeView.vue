<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { useAlfabetaStore } from '../../stores/alfabeta/index.ts'
import { useAlertStore } from '../../stores/alert.store.ts'

import { usePrimeVue } from 'primevue/config'
import Badge from 'primevue/badge'
import BlockUI from 'primevue/blockui'
import type { UploadFile } from '../../services/alfabeta/types.ts'

const $primevue = usePrimeVue()
const alfabetaStore = useAlfabetaStore()
const alertStore = useAlertStore()
const loading = ref(false)
const filesToUpload = ref<UploadFile[]>([])
const fileInput = ref()

onMounted(async () => {
  await alfabetaStore.dispatchGetAlfabeta()
})

const fechaFormateada = (fecha: string) => {
  const f = new Date(fecha)
  return f.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
}

const uploadFiles = async () => {
  loading.value = true
  try {
    const files: File[] = filesToUpload.value.map((f) => f.contenido)
    const { success } = await alfabetaStore.dispatchUploadAlfabeta(files);
    if (success) {
      // Debe cambiar el estado a cargado en true.
      filesToUpload.value.forEach((f) => f.cargado = true)
      alertStore.toastAlert("Archivo cargados correctamente", 'success', 10, 'Proceso terminado')
    }
    else {
      alertStore.toastAlert("Verifique si todos los archivos se subieron correctamente", 'info', 10, 'Proceso terminado')
    }
    loading.value = false
  }
  catch (error) {
    console.error("Error al subir archivos:", error)
    loading.value = false
    alertStore.toastAlert("Ocurrió un error al subir los archivos", 'error', 20, 'Error')
  }
}

const onAddFiles = () => {
  if (fileInput.value.files.length > 0) {
    let totalSize = 0
    for (let i = 0; i < fileInput.value.files.length; i++) {
      const f: File = fileInput.value.files[i]
      totalSize += f.size
      // Validar el tamaño total de los archivos
      if (totalSize > 30 * 1024 * 1024) { // 30MB
        alertStore.toastAlert(`La suma del tamaño de los archivos excede el límite de 30MB.`, 'warn', 5, 'Tamaño de archivo excedido')
      }
      else {
        const newFile: UploadFile = {
          nombre: f.name,
          contenido: f,
          cargado: false,
          fecha: fechaFormateada(new Date().toString()),
          observacion: formatSize(f.size),
          ordenOriginal: filesToUpload.value.length
        };
        filesToUpload.value.push(newFile)
      }
    }
  }
}

const removeFile = (index: number) => {
  filesToUpload.value = [...filesToUpload.value].filter((_, i) => i !== index)
}

const clearFiles = () => {
  filesToUpload.value = []
}

const formatSize = (bytes: number) => {
  const k = 1024
  const dm = 2
  const sizes = $primevue.config?.locale?.fileSizeTypes ?? ['']
  if (bytes === 0) { return `0 ${sizes[0]}` }
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
  return `${formattedSize} ${sizes[i]}`
}

</script>

<template>
  <div>
    <h2
      class="mb-8 text-xl font-extrabold tracking-tight leading-none text-gray-500 lg:text-4xl sm:px-16 xl:px-48 dark:text-gray-400">
      Subir Archivos de Alfabeta
    </h2>
    <div class="card">

      <BlockUI :blocked="loading">
        <div class="grid grid-cols-6 grid-rows-2 gap-4">

          <div class="col-span-6 sm:col-span-3">
            <div v-if="filesToUpload.length === 0" class="flex items-center justify-center w-full">
              <label for="dropzone-file"
                class="flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer 
                bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                  </svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Clic para
                      subir</span> o arrastre y suelte aquí</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">TXT, DAT</p>
                </div>
                <input ref="fileInput" id="dropzone-file" @change="onAddFiles()" type="file" class="hidden"
                  accept=".txt,.dat" />
              </label>
            </div>
            <div v-else class="flex flex-wrap justify-center p-0 sm:p-5 gap-5 border-2 shadow-md shadow-cyan-600/50">
              <div v-for="(file, index) of filesToUpload" :key="file.ordenOriginal"
                class="card m-0 px-6 py-4 flex flex-col w-64 relative border-2 border-cyan-600 items-center gap-3 rounded-lg shadow-lg shadow-cyan-600/50">
                <div>
                  <box-icon type='solid' name='file-txt' class="w-20 h-20 fill-gray-500 dark:fill-gray-300"></box-icon>
                </div>
                <span class="font-semibold text-gray-400 dark:text-gray-300">{{ file.nombre }}</span>
                <div class="text-gray-400 dark:text-gray-300">{{ file.observacion }}</div>
                <Badge v-if="!file.cargado" value="Pendiente" severity="warn" />
                <Badge v-else value="Subido" severity="success" />
                <button type="button" @click="removeFile(index)"
                  class="absolute right-0 mr-2 text-red-700 border border-red-700 hover:bg-red-100 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center 
                  dark:border-red-500 dark:text-white dark:hover:text-red-300 dark:focus:ring-red-800 dark:hover:bg-red-500">
                  <i class="pi pi-times w-4 h-4" />
                  <span class="sr-only">Icon</span>
                </button>
              </div>
            </div>

          </div>
          <div class="col-span-6 sm:col-span-3 row-span-2">
            <div
              class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 border-solid border border-blue-300 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800">
              <svg class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span class="sr-only">Info</span>
              <div>
                <span class="font-medium">Tratar de subir los archivos de a uno y en el siguiente orden:</span>
                <ul class="mt-1.5 list-disc list-inside">
                  <li v-for="item in alfabetaStore.state" class="relative justify-between flex gap-4">
                    <span>{{ item.identificador }}</span>
                    <span class="font-semibold absolute right-0 text-right">({{
                      fechaFormateada(item.fecha)
                      }})</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-span-6 sm:col-span-3">
            <div class="flex flex-row mt-4 justify-center">
              <button type="button" @click="uploadFiles"
                :disabled="!filesToUpload || filesToUpload.length === 0 || loading"
                class="text-white bg-cyan-700 hover:bg-cyan-600 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50
                  focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 inline-flex items-center font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                <box-icon v-if="loading" name="radio-circle" animation="burst"
                  class="w-6 h-6 ms-2 me-1 fill-white"></box-icon>
                <box-icon v-else name='cloud-upload' class="w-6 h-6 me-2 -ms-1 fill-white"></box-icon>
                <span>Subir</span>
              </button>
              <button type="button" @click="clearFiles"
                :disabled="!filesToUpload || filesToUpload.length === 0 || loading"
                class="text-white bg-cyan-700 hover:bg-cyan-600 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50
                  focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 inline-flex items-center font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                <box-icon v-if="loading" name="radio-circle" animation="burst"
                  class="w-6 h-6 ms-2 me-1 fill-white"></box-icon>
                <i v-else class="pi pi-times me-2 -ms-1 w-4 h-4" />
                <span>Cancelar</span>
              </button>
            </div>
          </div>

        </div>
      </BlockUI>
    </div>
  </div>
</template>
