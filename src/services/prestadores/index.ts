import http from "../api.ts";
import type { APIResponse, ResponseDTO } from "../types.ts";
import type { PrestadorDTO } from "./types.ts";
import { handleServiceError } from "../seviceHandler.ts";

export function prestadoresAPIController() {
  const getFarmacias = async (): Promise<APIResponse<PrestadorDTO[]>> => {
    try {
      const response = await http.get<ResponseDTO<PrestadorDTO[]>>(
        `prestadores/farmacias`
      );
      return {
        success: response.data?.success ?? false,
        content: response.data?.result ?? [],
        status: response.status,
        error: response.data?.error,
      };
    } catch (error: unknown) {
      return handleServiceError<PrestadorDTO[]>(error, []);
    }
  };

  return { getFarmacias };
}
