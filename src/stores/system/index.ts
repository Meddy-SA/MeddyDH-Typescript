// stores/system/index.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { FechaDTO } from "../../services/system/types";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/errorHandler.ts";

export const useSystemStore = defineStore("system", () => {
  const state = ref<Date>();

  function initSystem(data: FechaDTO): void {
    state.value = new Date(data.fecha);
  }

  async function dispatchGetFecha(): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.system.getFecha();
      if (status === 200) {
        initSystem(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  return {
    state,
    dispatchGetFecha,
  }
})
