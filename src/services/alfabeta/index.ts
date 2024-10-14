import http from "../api.ts";
import { handleResponseData, handleServiceError } from "../seviceHandler.ts";
import type { APIResponse, ResponseDTO } from "../types.ts";
import type { Alfabeta, UploadFile, DrogaDTO, PrecioDTO } from "./types.ts";

export function alfabetaController() {
  async function getActualizaAlfabeta(): Promise<APIResponse<Alfabeta[]>> {
    try {
      const response = await http.get<ResponseDTO<Alfabeta[]>>(
        "Alfabeta/Actualiza"
      );
      return handleResponseData<Alfabeta[]>(response, []);
    } catch (error) {
      return handleServiceError<Alfabeta[]>(error, []);
    }
  }

  async function getBuscarMedicamentos(
    filtro: string,
    tipo: string
  ): Promise<APIResponse<DrogaDTO[]>> {
    try {
      const response = await http.get<ResponseDTO<DrogaDTO[]>>(
        `Alfabeta?filter=${filtro}&type=${tipo}`
      );
      return handleResponseData<DrogaDTO[]>(response, []);
    } catch (error) {
      return handleServiceError<DrogaDTO[]>(error, []);
    }
  }

  async function getHistorialPrecios(
    id: number,
    tipo: string
  ): Promise<APIResponse<DrogaDTO[]>> {
    try {
      const response = await http.get<ResponseDTO<DrogaDTO[]>>(
        `Alfabeta/History?filter=${id}&type=${tipo}`
      );
      return handleResponseData<DrogaDTO[]>(response, []);
    } catch (error) {
      return handleServiceError<DrogaDTO[]>(error, []);
    }
  }

  async function getBuscarPorNombreComercial(
    nombre: string
  ): Promise<APIResponse<DrogaDTO[]>> {
    try {
      const response = await http.get<ResponseDTO<DrogaDTO[]>>(
        `Alfabeta/ManualDat?filter=${nombre}`
      );
      return handleResponseData<DrogaDTO[]>(response, []);
    } catch (error) {
      return handleServiceError<DrogaDTO[]>(error, []);
    }
  }

  async function getPrecioPorManualDat(
    id: number
  ): Promise<APIResponse<PrecioDTO[]>> {
    try {
      const response = await http.get<ResponseDTO<PrecioDTO[]>>(
        `Alfabeta/ManualDat/${id}`
      );
      return handleResponseData<PrecioDTO[]>(response, []);
    } catch (error) {
      return handleServiceError<PrecioDTO[]>(error, []);
    }
  }

  async function postSubirArchivosAlfabeta(
    archivos: File[]
  ): Promise<APIResponse<UploadFile[]>> {
    try {
      const formData = new FormData();
      archivos.forEach((archivo) => {
        formData.append("files[]", archivo);
      });
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxBodyLength: Infinity,
      };
      const response = await http.post<ResponseDTO<UploadFile[]>>(
        "Alfabeta",
        formData,
        config
      );
      return handleResponseData<UploadFile[]>(response, []);
    } catch (error) {
      return handleServiceError<UploadFile[]>(error, []);
    }
  }

  return {
    getActualizaAlfabeta,
    getBuscarMedicamentos,
    getHistorialPrecios,
    getBuscarPorNombreComercial,
    getPrecioPorManualDat,
    postSubirArchivosAlfabeta,
  };
}
