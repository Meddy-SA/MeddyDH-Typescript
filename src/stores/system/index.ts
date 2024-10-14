// stores/system/index.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { FechaDTO, MesesDTO } from "../../services/system/types";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/seviceHandler.ts";

export const useSystemStore = defineStore("system", () => {
  const hoy = ref<Date>();
  const meses = ref<MesesDTO>();

  function initSystem(data: FechaDTO): void {
    hoy.value = new Date(data.fecha);
  }

  function initMeses(data: MesesDTO): void {
    meses.value = data;
  }

  async function fetchFecha(): Promise<APIResponse<string | null>> {
    try {
      const { status, content, success } = await API.system.getFecha();
      if (status === 200) {
        initSystem(content);
        return { success: success, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  const fetchMesActual = async (): Promise<APIResponse<string | null>> => {
    try {
      const { status, content, success } = await API.system.getMesActual();
      if (status === 200) {
        initMeses(content);
        return { success: success, content: null };
      }

      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  };

  return {
    hoy,
    meses,
    fetchFecha,
    fetchMesActual,
  };
});
