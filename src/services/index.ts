// Service/index.ts
import { alfabetaController } from "./alfabeta";
import { authenticationController } from "./authentication";
import { medicamentosAPIController } from "./humano";
import { prestadoresAPIController } from "./prestadores";
import { systemController } from "./system";
import { pdfAPIController } from "./pdf";
import { nomenclaturasController } from "./nomenclaturas";

export const API = {
  alfabeta: alfabetaController(),
  auth: authenticationController(),
  humano: medicamentosAPIController(),
  prestador: prestadoresAPIController(),
  system: systemController(),
  pdf: pdfAPIController(),
  nomenclaturas: nomenclaturasController(),
};
