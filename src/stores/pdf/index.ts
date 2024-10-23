import { defineStore } from "pinia";
import type { APIResponse } from "../../services/types";
import { API } from "../../services";
import type { ExpedienteMotherDTO } from "../../services/humano/types";

export const usePDFStore = defineStore("pdf", () => {
  async function htmlToPdf(
    htmlContent: string
  ): Promise<APIResponse<Blob | null>> {
    try {
      const response = await API.pdf.convertHtmlToPdf(htmlContent);
      if (response.status === 200) {
        return { success: true, content: response.data };
      }
      throw new Error(`Unexpected status ${response.status}`);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        content: null,
      };
    }
  }

  const expedienteMasterForDTO = async (
    dto: ExpedienteMotherDTO
  ): Promise<APIResponse<Blob | null>> => {
    try {
      const response = await API.pdf.pdfExpedienteMaster(dto);
      if (response.status === 200) {
        return { success: true, content: response.data };
      }
      throw new Error(`Unexpected status ${response.status}`);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        content: null,
      };
    }
  };

  return {
    htmlToPdf,
    expedienteMasterForDTO,
  };
});
