import { type Template, BLANK_PDF } from "@pdfme/common";
import { Designer } from "@pdfme/ui";

export async function getDoc() {
  const template: Template = {
    basePdf: BLANK_PDF,
    schemas: [
      {
        field1: {
          position: { x: 20, y: 20 },
          width: 50,
          height: 50,
          fontSize: 30,
          type: "text",
        },
        field2: {
          position: { x: 20, y: 35 },
          width: 50,
          height: 50,
          fontSize: 20,
          type: "text",
        },
      },
    ],
  };
  const designer = new Designer({ domContainer, template });
  return designer;
}
