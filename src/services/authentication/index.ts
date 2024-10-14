import http from "../api.ts";
import { handleServiceError } from "../seviceHandler.ts";
import type { APIResponse, ResponseData } from "../types.ts";
import type { LoginDto, UserData } from "./types.ts";

export function authenticationController() {
  async function login(credentials: LoginDto): Promise<APIResponse<UserData>> {
    try {
      const response = await http.post<ResponseData<UserData>>(
        "Authentication/login",
        credentials
      );

      if (!response.data || !response.data.response) {
        throw new Error("No se obtuvo respuesta del servidor");
      }

      const { success, result } = response.data.response;

      return {
        success,
        content: result ?? ({} as UserData),
        status: response.status,
        error: response.data?.response.error,
      };
    } catch (error) {
      return handleServiceError<UserData>(error, {} as UserData);
    }
  }

  return { login };
}
