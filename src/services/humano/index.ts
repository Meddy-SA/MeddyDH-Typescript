import http from "../api.ts";
import { handleResponseData, handleServiceError } from "../seviceHandler.ts";
import type { APIResponse, ResponseDTO } from "../types.ts";
import type { ExpedienteMotherDTO, MedicamentoDTO } from "./types.ts";

export function medicamentosAPIController() {
  const getExpediente = async (
    exp: string
  ): Promise<APIResponse<MedicamentoDTO>> => {
    try {
      const response = await http.get<ResponseDTO<MedicamentoDTO>>(
        `desarrolloHumano?expediente=${exp}`
      );
      return handleResponseData<MedicamentoDTO>(response, {} as MedicamentoDTO);
    } catch (error: unknown) {
      return handleServiceError<MedicamentoDTO>(error, {} as MedicamentoDTO);
    }
  };

  const getExpedienteList = async (
    desde: string,
    hasta: string
  ): Promise<APIResponse<MedicamentoDTO[]>> => {
    try {
      const response = await http.get<ResponseDTO<MedicamentoDTO[]>>(
        `desarrolloHumano/Lista?desde=${desde}&hasta=${hasta}`
      );
      return handleResponseData<MedicamentoDTO[]>(response, []);
    } catch (error: unknown) {
      return handleServiceError<MedicamentoDTO[]>(error, []);
    }
  };

  const postExpediente = async (
    medicamento: MedicamentoDTO
  ): Promise<APIResponse<MedicamentoDTO>> => {
    try {
      const response = await http.post<ResponseDTO<MedicamentoDTO>>(
        "desarrolloHumano",
        JSON.stringify(medicamento)
      );
      return handleResponseData<MedicamentoDTO>(response, medicamento);
    } catch (error: unknown) {
      return handleServiceError<MedicamentoDTO>(error, {} as MedicamentoDTO);
    }
  };

  const getExpedienteMaster = async (
    exp: string
  ): Promise<APIResponse<ExpedienteMotherDTO>> => {
    try {
      const response = await http.get<ResponseDTO<ExpedienteMotherDTO>>(
        `desarrolloHumano/Mother?expediente=${exp}`
      );
      return handleResponseData<ExpedienteMotherDTO>(
        response,
        {} as ExpedienteMotherDTO
      );
    } catch (error: unknown) {
      return handleServiceError<ExpedienteMotherDTO>(
        error,
        {} as ExpedienteMotherDTO
      );
    }
  };

  const getChildrenMasterList = async (
    query: string
  ): Promise<APIResponse<MedicamentoDTO[]>> => {
    try {
      const response = await http.get<ResponseDTO<MedicamentoDTO[]>>(
        `desarrolloHumano/Children?search=${query}`
      );
      return handleResponseData<MedicamentoDTO[]>(response, []);
    } catch (error: unknown) {
      return handleServiceError<MedicamentoDTO[]>(error, []);
    }
  };

  const postExpedienteMaster = async (
    master: ExpedienteMotherDTO
  ): Promise<APIResponse<ExpedienteMotherDTO>> => {
    try {
      const response = await http.post<ResponseDTO<ExpedienteMotherDTO>>(
        `desarrolloHumano/Mother`,
        JSON.stringify(master)
      );
      return handleResponseData<ExpedienteMotherDTO>(
        response,
        {} as ExpedienteMotherDTO
      );
    } catch (error: unknown) {
      return handleServiceError<ExpedienteMotherDTO>(
        error,
        {} as ExpedienteMotherDTO
      );
    }
  };

  return {
    getExpediente,
    getExpedienteList,
    postExpediente,
    getExpedienteMaster,
    getChildrenMasterList,
    postExpedienteMaster,
  };
}
