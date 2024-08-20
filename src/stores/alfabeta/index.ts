// stores/alfabeta/index.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  Alfabeta,
  UploadFile,
  DrogaDTO,
} from "../../services/alfabeta/types";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/errorHandler.ts";

export const useAlfabetaStore = defineStore("alfabeta", () => {
  const state = ref<Alfabeta[]>([]);
  const drogas = ref<DrogaDTO[]>([]);

  function initAlfabeta(data: Alfabeta[]): void {
    state.value = data;
  }

  function initDroga(data: DrogaDTO[]): void {
    drogas.value = data;
  }

  function uploadFileToAlfabeta(files: UploadFile[]) {
    state.value = state.value.map((alfabeta) => {
      const file = files.find((file) => file.nombre === alfabeta.identificador);
      return file?.cargado ? { ...alfabeta, fecha: file.fecha } : alfabeta;
    });
  }

  async function dispatchGetAlfabeta(): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.alfabeta.getAlfabeta();
      if (status === 200) {
        initAlfabeta(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  async function dispatchUploadAlfabeta(
    files: File[]
  ): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.alfabeta.uploadFile(files);
      if (status === 200) {
        uploadFileToAlfabeta(content);
        return { success: true, content: null };
      }

      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  async function dispatchFilterAlfabeta(
    filter: string,
    indice: string
  ): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.alfabeta.getMedicamentos(
        filter,
        indice
      );
      if (status === 200) {
        initDroga(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  async function dispatchGetHistorial(
    filter: number,
    indice: string
  ): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.alfabeta.getHistorialdePrecios(
        filter,
        indice
      );
      if (status === 200) {
        initDroga(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  return {
    state,
    drogas,
    uploadFileToAlfabeta,
    initAlfabeta,
    initDroga,
    dispatchGetAlfabeta,
    dispatchFilterAlfabeta,
    dispatchUploadAlfabeta,
    dispatchGetHistorial,
  };
});
