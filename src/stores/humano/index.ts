// stores/humano/index.ts

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  MedicamentoDTO,
  ExpedienteMotherDTO,
} from "../../services/humano/types";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/seviceHandler.ts";

export const useHumanoStore = defineStore("humano", () => {
  const medicamento = ref<MedicamentoDTO | null>(null);
  const expedientes = ref<MedicamentoDTO[]>([]);
  const expMother = ref<ExpedienteMotherDTO | null>(null);
  const isLoading = ref(false);

  const hasExpedientes = computed(() => expedientes.value.length > 0);

  function setCurrentMedicamento(data: MedicamentoDTO | null): void {
    medicamento.value = data;
  }

  function setExpedientes(data: MedicamentoDTO[]): void {
    expedientes.value = data;
  }

  function setExpMother(data: ExpedienteMotherDTO): void {
    expMother.value = data;
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
      const { status, content } = await API.humano.getExpedienteList(
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

  async function fetchExpedienteMaster(
    exp: string
  ): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const { status, content } = await API.humano.getExpedienteMaster(exp);
      if (status === 200) {
        setExpMother(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchChildrenMaster(
    query: string
  ): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const { status, content } = await API.humano.getChildrenMasterList(query);
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

  const createOrUpdateMaster = async (
    master: ExpedienteMotherDTO
  ): Promise<APIResponse<string | null>> => {
    isLoading.value = true;
    try {
      const { status, content } = await API.humano.postExpedienteMaster(master);
      if (status === 200) {
        setExpMother(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    medicamento,
    expedientes,
    expMother,
    isLoading,
    hasExpedientes,
    fetchExpediente,
    fetchExpedientes,
    createExpediente,
    fetchExpedienteMaster,
    fetchChildrenMaster,
    createOrUpdateMaster,
  };
});
