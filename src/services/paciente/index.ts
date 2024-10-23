import http from "../api.ts";
import type { APIResponse, ResponseDTO } from "../types.ts";
import type { Paciente } from "./types.ts";

const getPaciente = async (dni: string): Promise<APIResponse<Paciente>> => {
  const res = await http.get<ResponseDTO<Paciente>>(`paciente?dni=${dni}`);
  if (res.data === null) {
    return {
      success: false,
      content: {} as Paciente,
      status: res.status,
    };
  }

  const r = res.data;

  return {
    success: r.success,
    content: r.result ?? ({} as Paciente),
    status: res.status,
  };
};

const getListaExpedientes = async (
  desde: string,
  hasta: string
): Promise<APIResponse<Paciente[]>> => {
  const res = await http.get<ResponseDTO<Paciente[]>>(
    `desarrolloHumano/Lista?desde=${desde}&hasta=${hasta}`
  );
  if (res.data === null) {
    return {
      success: false,
      content: [] as Paciente[],
      status: res.status,
    };
  }

  const r = res.data;
  return {
    success: r.success,
    content: r.result ?? ([] as Paciente[]),
    status: res.status,
  };
};

const postExpediente = async (
  medicamento: Paciente
): Promise<APIResponse<Paciente>> => {
  const data = JSON.stringify(medicamento);
  const res = await http.post<ResponseDTO<Paciente>>(`desarrolloHumano`, data);
  if (res.data === null) {
    return {
      success: false,
      content: medicamento,
      status: res.status,
    };
  }

  const r = res.data;
  return {
    success: r.success,
    content: r.result ?? medicamento,
    status: res.status,
  };
};

export default {
  getPaciente,
  getListaExpedientes,
  postExpediente,
};
