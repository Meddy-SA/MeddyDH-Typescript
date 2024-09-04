import type { EnumDTO } from "../system/types";

export type Paciente = {
  pacienteId: number;
  dni: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  sexo: string;
  estado: EnumDTO;
  fullName?: string;
};
