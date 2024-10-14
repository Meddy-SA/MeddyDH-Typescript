// stores/prestadores/index.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { PrestadorDTO } from "../../services/prestadores/types";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import { handleApiError } from "../../services/seviceHandler.ts";

export const usePrestadorStore = defineStore("prestador", () => {
  const prestadores = ref<PrestadorDTO[]>([]);

  function setPrestadores(data: PrestadorDTO[]): void {
    // Asignar a nombre la concatenación de apellido y nombre.
    const updatedData = data.map((prestador) => ({
      ...prestador,
      nombre: `${prestador.apellido} ${prestador.nombre}`, // Concatenamos apellido y nombre
    }));
    prestadores.value = updatedData;
  }

  async function fetchFarmacias(): Promise<APIResponse<string | null>> {
    try {
      const { status, content } = await API.prestador.getFarmacias();
      if (status === 200) {
        setPrestadores(content);
        return { success: true, content: null };
      }
      throw new Error(`Unexpected status ${status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  return {
    prestadores,
    fetchFarmacias,
  };
});
