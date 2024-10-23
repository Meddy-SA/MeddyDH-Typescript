export interface EnumDTO {
  id: number;
  nombre: string;
}

export type NomenclaturaState = {
  sexos: EnumDTO[];
  frecuencias: EnumDTO[];
  tiposReconoce: EnumDTO[];
  tiposDomicilio: EnumDTO[];
  opcionesInternacion: EnumDTO[];
  situacionesLaborales: EnumDTO[];
  roles: EnumDTO[];
  isLoading: boolean;
};
