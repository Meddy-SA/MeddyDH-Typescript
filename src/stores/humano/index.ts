// stores/humano/index.ts

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { MedicamentoDTO } from "../../services/humano/types";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/seviceHandler.ts";

export const useHumanoStore = defineStore("humano", () => {
  const medicamento = ref<MedicamentoDTO | null>(null);
  const expedientes = ref<MedicamentoDTO[]>([]);
  const isLoading = ref(false);

  const hasExpedientes = computed(() => expedientes.value.length > 0);

  function setCurrentMedicamento(data: MedicamentoDTO | null): void {
    medicamento.value = data;
  }

  function setExpedientes(data: MedicamentoDTO[]): void {
    expedientes.value = data;
  }

  async function fetchExpediente(
    exp: string
  ): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const { status, content } = await API.humano.getExpediente(exp);
      if (status === 200) {
        setCurrentMedicamento(content);
        return { success: true, content: null };
      }

      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchExpedientes(
    desde: string,
    hasta: string
  ): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const { status, content } = await API.humano.getListaExpedientes(
        desde,
        hasta
      );
      if (status === 200) {
        setExpedientes(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createExpediente(
    medicamento: MedicamentoDTO
  ): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const { status, content, success } = await API.humano.postExpediente(
        medicamento
      );
      if (status === 200) {
        setCurrentMedicamento(content);
        return { success, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    medicamento,
    expedientes,
    isLoading,
    hasExpedientes,
    fetchExpediente,
    fetchExpedientes,
    createExpediente,
  };
});
