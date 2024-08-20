import http from '../api.ts';
import type { APIResponse } from '../types.ts';
import type { FechaDTO } from './types.ts';

async function getFecha(): Promise<APIResponse<FechaDTO>> {
  const res = await http.get<FechaDTO>('system');
  if (res.data === null) {
    return { success: false, content: {} as FechaDTO, status: res.status };
  }

  const r = res.data;

  return {
    success: true,
    content: r ?? new Date().toISOString().slice(0, 10),
    status: res.status
  }
}

export default {
  getFecha,
}
