// api.ts file

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

const getToken = (): string | null => {
  return localStorage.getItem("token");
};

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a cada solicitud.
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance
