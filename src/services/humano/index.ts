import http from "../api.ts";
import type { APIResponse, ResponseDTO } from "../types.ts";
import type { MedicamentoDTO } from "./types.ts";

const getExpediente = async (
  exp: string
): Promise<APIResponse<MedicamentoDTO>> => {
  const res = await http.get<ResponseDTO<MedicamentoDTO>>(
    `desarrolloHumano?expediente=${exp}`
  );
  if (res.data === null) {
    return {
      success: false,
      content: {} as MedicamentoDTO,
      status: res.status,
    };
  }

  const r = res.data;

  return {
    success: r.success,
    content: r.result ?? ({} as MedicamentoDTO),
    status: res.status,
  };
};

const postExpediente = async (
  medicamento: MedicamentoDTO
): Promise<APIResponse<MedicamentoDTO>> => { };

export default {
  getExpediente,
};
