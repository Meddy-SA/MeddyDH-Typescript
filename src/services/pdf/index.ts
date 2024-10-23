import type { AxiosResponse } from "axios";
import http from "../api.ts";
import type { ExpedienteMotherDTO } from "../humano/types.ts";

export function pdfAPIController() {
  const convertHtmlToPdf = async (
    htmlContent: string
  ): Promise<AxiosResponse<Blob>> => {
    return await http.post(
      `Pdf`,
      { htmlContent },
      { responseType: "blob", headers: { "Content-Type": "application/json" } }
    );
  };

  const pdfExpedienteMaster = async (
    dto: ExpedienteMotherDTO
  ): Promise<AxiosResponse<Blob>> => {
    return await http.post(`Pdf/ExpedienteMaster`, JSON.stringify(dto), {
      responseType: "blob",
      headers: { "Content-Type": "application/json" },
    });
  };

  return {
    convertHtmlToPdf,
    pdfExpedienteMaster,
  };
}
