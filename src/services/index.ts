// Service/index.ts
import { alfabetaController } from "./alfabeta";
import { authenticationController } from "./authentication";
import { medicamentosAPIController } from "./humano";
import { prestadoresAPIController } from "./prestadores";
import { systemController } from "./system";

export const API = {
  alfabeta: alfabetaController(),
  authentication: authenticationController(),
  humano: medicamentosAPIController(),
  prestador: prestadoresAPIController(),
  system: systemController(),
};
