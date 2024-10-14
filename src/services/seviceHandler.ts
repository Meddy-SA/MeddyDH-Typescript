import { AxiosError, type AxiosResponse } from "axios";
import type { APIResponse, ResponseDTO } from "./types";

export function handleResponseData<T>(
  response: AxiosResponse<ResponseDTO<T>>,
  defaultValue: T
): APIResponse<T> {
  if (!response.data) {
    throw new Error("No se obtuvo respuesta del servidor");
  }
  return {
    success: response.data.success,
    content: response.data.result ?? defaultValue,
    status: response.status,
    error: response.data.error,
  };
}

export function handleApiError(error: unknown): APIResponse<string | null> {
  if (error instanceof AxiosError) {
    console.log("API Error:", error);
    return {
      success: false,
      status:
        error.response?.status ?? error.code === "ERR_NETWORK" ? 503 : 500,
      content: error.message,
    };
  }

  if (error instanceof Error) {
    console.log("Unexpected error:", error);
    return {
      success: false,
      status: 500,
      content: error.message,
    };
  }

  console.log("Unknown error:", error);
  return {
    success: false,
    status: 500,
    content: null,
  };
}

export function handleServiceError<T>(
  error: unknown,
  emptyContent: T
): APIResponse<T> {
  if (error instanceof AxiosError) {
    console.log("API Error:", error);
    return {
      success: false,
      content: emptyContent,
      status:
        error.response?.status ?? error.code === "ERR_NETWORK" ? 503 : 500,
      error: error.message,
    };
  }
  if (error instanceof Error) {
    console.log("Unexpected error:", error);
    return {
      success: false,
      content: emptyContent,
      status: getErrorStatus(error),
      error: error.message,
    };
  }
  return {
    success: false,
    content: emptyContent,
    status: 500,
  };
}

function getErrorStatus(error: Error): number {
  if ("status" in error && typeof (error as any).status === "number") {
    return (error as any).status;
  }
  switch (error.name) {
    case "TypeError":
      return 400;
    case "RangeError":
      return 416;
    case "SyntaxError":
      return 400;
    default:
      return 500;
  }
}
