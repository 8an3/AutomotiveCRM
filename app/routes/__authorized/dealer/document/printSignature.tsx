import { text, image, barcodes } from "@pdfme/schemas";
import { generate } from "@pdfme/generator";


export const PrintSignature = (data: any) => {

  async function RunIt(data: any) {
    const pdfString = data.signature
    const template = {
      "schemas": [],
      "basePdf": pdfString,
      "pdfmeVersion": "4.0.0"
    };
    const plugins = {};
    const inputs = [{}]

    const pdf = await generate({ template, plugins, inputs });
    const blob = new Blob([pdf.buffer], { type: "application/pdf" });
    window.open(URL.createObjectURL(blob));
  }
  return RunIt(data);
}
