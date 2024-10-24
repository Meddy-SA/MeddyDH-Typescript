// stores/alfabeta/index.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type {
  Alfabeta,
  UploadFile,
  DrogaDTO,
  PrecioDTO,
} from "../../services/alfabeta/types";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/seviceHandler.ts";

export const useAlfabetaStore = defineStore("alfabeta", () => {
  const alfabeta = ref<Alfabeta[]>([]);
  const drogas = ref<DrogaDTO[]>([]);
  const precios = ref<PrecioDTO[]>([]);

  function setAlfabeta(data: Alfabeta[]): void {
    alfabeta.value = data;
  }

  function setDroga(data: DrogaDTO[]): void {
    drogas.value = data;
  }

  const setPrecios = (data: PrecioDTO[]): void => {
    precios.value = data;
  };

  function uploadFileToAlfabeta(files: UploadFile[]) {
    alfabeta.value = alfabeta.value.map((med) => {
      const file = files.find((file) => file.nombre === med.identificador);
      return file?.cargado ? { ...med, fecha: file.fecha } : med;
    });
  }

  async function fetchUpdatedAlfabeta(): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.alfabeta.getActualizaAlfabeta();
      if (status === 200) {
        setAlfabeta(content);
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
      const { status, content } = await API.alfabeta.postSubirArchivosAlfabeta(
        files
      );
      if (status === 200) {
        uploadFileToAlfabeta(content);
        return { success: true, content: null };
      }

      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  async function fetchSearchMedicineAlfabeta(
    filter: string,
    indice: string
  ): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.alfabeta.getBuscarMedicamentos(
        filter,
        indice
      );
      if (status === 200) {
        setDroga(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  async function fetchSearchMedicine(
    nombre: string,
    fecha: string
  ): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.alfabeta.getMedicineByDate(
        nombre,
        fecha
      );
      if (status === 200) {
        setDroga(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  async function fetchPriceHistory(
    filter: number,
    indice: string
  ): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.alfabeta.getHistorialPrecios(
        filter,
        indice
      );
      if (status === 200) {
        setDroga(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  const fetchMedByName = async (
    filter: string
  ): Promise<APIResponse<string | null>> => {
    try {
      const { status, content, success } =
        await API.alfabeta.getBuscarPorNombreComercial(filter);
      if (status === 200) {
        setDroga(content);
        return { success: success, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  };

  const fetchPriceByManualDat = async (
    id: number
  ): Promise<APIResponse<string | null>> => {
    try {
      const { status, content, success } =
        await API.alfabeta.getPrecioPorManualDat(id);
      if (status === 200) {
        setPrecios(content);
        return { success: success, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  };

  return {
    alfabeta,
    drogas,
    precios,
    fetchUpdatedAlfabeta,
    dispatchUploadAlfabeta,
    fetchSearchMedicineAlfabeta,
    fetchSearchMedicine,
    fetchPriceHistory,
    fetchMedByName,
    fetchPriceByManualDat,
  };
});
