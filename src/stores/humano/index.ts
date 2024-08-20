// stores/humano/index.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { MedicamentoDTO } from "../../services/humano/types";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/errorHandler.ts";

export const useHumanoStore = defineStore("humano", () => {
  const state = ref<MedicamentoDTO>();

  function initHumano(data: MedicamentoDTO): void {
    state.value = data;
  }

  async function dispatchGetExpediente(exp: string): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.humano.getExpediente(exp);
      if (status === 200) {
        initHumano(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  return {
    state,
    dispatchGetExpediente,
  }
})
