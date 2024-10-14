//types.ts file

export type APIResponse<T> = {
  success: boolean;
  content: T;
  status?: number;
  error?: string;
  response?: ResponseDTO<T>;
};

export interface ResponseDTO<T> {
  success: boolean;
  message: string;
  result: T | null;
  error?: string;
}

export type ResponseData<T> = {
  response: ResponseDTO<T>;
  status?: number;
};
