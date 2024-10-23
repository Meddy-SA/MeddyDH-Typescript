// stores/nomenclaturas.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { EnumDTO } from "../../services/nomenclaturas/types.ts";
import { API } from "../../services";
import type { APIResponse } from "../../services/types.ts";
import { handleApiError } from "../../services/seviceHandler.ts";

export const useNomenclaturaStore = defineStore("nomenclatura", () => {
  // Estado
  const sexos = ref<EnumDTO[]>([]);
  const frecuencias = ref<EnumDTO[]>([]);
  const tiposReconoce = ref<EnumDTO[]>([]);
  const tiposDomicilio = ref<EnumDTO[]>([]);
  const opcionesInternacion = ref<EnumDTO[]>([]);
  const situacionesLaborales = ref<EnumDTO[]>([]);
  const roles = ref<EnumDTO[]>([]);
  const isLoading = ref(false);

  // Setters
  const setSexos = (data: EnumDTO[]) => (sexos.value = data);
  const setFrecuencias = (data: EnumDTO[]) => (frecuencias.value = data);
  const setTiposReconoce = (data: EnumDTO[]) => (tiposReconoce.value = data);
  const setTiposDomicilio = (data: EnumDTO[]) => (tiposDomicilio.value = data);
  const setOpcionesInternacion = (data: EnumDTO[]) =>
    (opcionesInternacion.value = data);
  const setSituacionesLaborales = (data: EnumDTO[]) =>
    (situacionesLaborales.value = data);
  const setRoles = (data: EnumDTO[]) => (roles.value = data);

  // Acciones
  const fetchSexos = async () => {
    isLoading.value = true;
    try {
      const response = await API.nomenclaturas.getSexos();
      if (response.success) {
        setSexos(response.content);
        return { success: true, content: null };
      }
      throw new Error(response.error || "Error al obtener sexos");
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchFrecuencias = async () => {
    isLoading.value = true;
    try {
      const response = await API.nomenclaturas.getFrecuencias();
      if (response.success) {
        setFrecuencias(response.content);
        return { success: true, content: null };
      }
      throw new Error(response.error || "Error al obtener frecuencias");
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchTiposReconoce = async () => {
    isLoading.value = true;
    try {
      const response = await API.nomenclaturas.getTipoReconoce();
      if (response.success) {
        setTiposReconoce(response.content);
        return { success: true, content: null };
      }
      throw new Error(
        response.error || "Error al obtener tipos de reconocimiento"
      );
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchTiposDomicilio = async () => {
    isLoading.value = true;
    try {
      const response = await API.nomenclaturas.getTipoDomicilio();
      if (response.success) {
        setTiposDomicilio(response.content);
        return { success: true, content: null };
      }
      throw new Error(response.error || "Error al obtener tipos de domicilio");
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchOpcionesInternacion = async () => {
    isLoading.value = true;
    try {
      const response = await API.nomenclaturas.getOpcionesInternacion();
      if (response.success) {
        setOpcionesInternacion(response.content);
        return { success: true, content: null };
      }
      throw new Error(
        response.error || "Error al obtener opciones de internación"
      );
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchSituacionesLaborales = async () => {
    isLoading.value = true;
    try {
      const response = await API.nomenclaturas.getSituacionLaboral();
      if (response.success) {
        setSituacionesLaborales(response.content);
        return { success: true, content: null };
      }
      throw new Error(
        response.error || "Error al obtener situaciones laborales"
      );
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchRoles = async (): Promise<APIResponse<string | null>> => {
    isLoading.value = true;
    try {
      const response = await API.nomenclaturas.getRoles();
      if (response.status === 200) {
        setRoles(response.content);
        return { success: true, content: null };
      }
      throw new Error(response.error || "Error al obtener roles");
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  };

  // Método para cargar todas las nomenclaturas de una vez
  const fetchAllNomenclaturas = async () => {
    isLoading.value = true;
    try {
      await Promise.all([
        fetchSexos(),
        fetchFrecuencias(),
        fetchTiposReconoce(),
        fetchTiposDomicilio(),
        fetchOpcionesInternacion(),
        fetchSituacionesLaborales(),
        fetchRoles(),
      ]);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // Estado
    sexos,
    frecuencias,
    tiposReconoce,
    tiposDomicilio,
    opcionesInternacion,
    situacionesLaborales,
    roles,
    isLoading,

    // Acciones
    fetchSexos,
    fetchFrecuencias,
    fetchTiposReconoce,
    fetchTiposDomicilio,
    fetchOpcionesInternacion,
    fetchSituacionesLaborales,
    fetchRoles,
    fetchAllNomenclaturas,
  };
});
