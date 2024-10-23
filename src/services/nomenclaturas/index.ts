import http from "../api";
import { handleResWithoutDTO, handleServiceError } from "../seviceHandler";
import type { APIResponse } from "../types";
import type { EnumDTO } from "./types";

export function nomenclaturasController() {
  const getSexos = async (): Promise<APIResponse<EnumDTO[]>> => {
    try {
      const response = await http.get<EnumDTO[]>("Nomenclaturas/sexo");
      return handleResWithoutDTO<EnumDTO[]>(response, []);
    } catch (error) {
      return handleServiceError<EnumDTO[]>(error, []);
    }
  };

  const getFrecuencias = async (): Promise<APIResponse<EnumDTO[]>> => {
    try {
      const response = await http.get<EnumDTO[]>("Nomenclaturas/frecuencia");
      return handleResWithoutDTO<EnumDTO[]>(response, []);
    } catch (error) {
      return handleServiceError<EnumDTO[]>(error, []);
    }
  };

  const getTipoReconoce = async (): Promise<APIResponse<EnumDTO[]>> => {
    try {
      const response = await http.get<EnumDTO[]>("Nomenclaturas/tipo_reconoce");
      return handleResWithoutDTO<EnumDTO[]>(response, []);
    } catch (error) {
      return handleServiceError<EnumDTO[]>(error, []);
    }
  };

  const getTipoDomicilio = async (): Promise<APIResponse<EnumDTO[]>> => {
    try {
      const response = await http.get<EnumDTO[]>(
        "Nomenclaturas/tipo_domicilio"
      );
      return handleResWithoutDTO<EnumDTO[]>(response, []);
    } catch (error) {
      return handleServiceError<EnumDTO[]>(error, []);
    }
  };

  const getOpcionesInternacion = async (): Promise<APIResponse<EnumDTO[]>> => {
    try {
      const response = await http.get<EnumDTO[]>(
        "Nomenclaturas/internacion_opciones"
      );
      return handleResWithoutDTO<EnumDTO[]>(response, []);
    } catch (error) {
      return handleServiceError<EnumDTO[]>(error, []);
    }
  };

  const getSituacionLaboral = async (): Promise<APIResponse<EnumDTO[]>> => {
    try {
      const response = await http.get<EnumDTO[]>(
        "Nomenclaturas/situacion_laboral"
      );
      return handleResWithoutDTO<EnumDTO[]>(response, []);
    } catch (error) {
      return handleServiceError<EnumDTO[]>(error, []);
    }
  };

  const getRoles = async (): Promise<APIResponse<EnumDTO[]>> => {
    try {
      const response = await http.get<EnumDTO[]>("Nomenclaturas/roles");
      return handleResWithoutDTO<EnumDTO[]>(response, []);
    } catch (error) {
      return handleServiceError<EnumDTO[]>(error, []);
    }
  };

  return {
    getSexos,
    getFrecuencias,
    getTipoReconoce,
    getTipoDomicilio,
    getOpcionesInternacion,
    getSituacionLaboral,
    getRoles,
  };
}
