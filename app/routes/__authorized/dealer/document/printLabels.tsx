import React, { useEffect, useRef, useState } from "react";
import { Template, checkTemplate } from "@pdfme/common";
import { Form, Viewer, Designer } from "@pdfme/ui";
import { text, image, barcodes } from '@pdfme/schemas';
import {
  getFontsData,
  bardCodeTemplate,
  readFile,
  cloneDeep,
  //getPlugins,
  //handleLoadTemplate,
  generatePDF,
  // GeneratePDFWInputs,
  downloadJsonFile,
  getTemplateFromJsonFile,
} from "~/components/document/helper";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Button, Input, } from "~/components";
import { generate } from "@pdfme/generator";

const headerHeight = 65;

export const getPlugins = () => {
  return {
    Text: text,
    // 'Read-Only Text': readOnlyText,
    // 'Multi-Variable Text': multiVariableText,
    // Table: tableBeta,
    // Line: line,
    // Rectangle: rectangle,
    //  Ellipse: ellipse,
    Image: image,
    //  'Read-Only Image': readOnlyImage,
    //   SVG: svg,
    //   'Read-Only SVG': readOnlySvg,
    //   Signature: plugins.signature,
    QR: barcodes.qrcode,
    JAPANPOST: barcodes.japanpost,
    EAN13: barcodes.ean13,
    EAN8: barcodes.ean8,
    Code39: barcodes.code39,
    Code128: barcodes.code128,
    NW7: barcodes.nw7,
    ITF14: barcodes.itf14,
    UPCA: barcodes.upca,
    UPCE: barcodes.upce,
    GS1DataMatrix: barcodes.gs1datamatrix,
  };
};
export default function PrintLabels({ inputs }) {
  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateData, setTemplate] = useState<Template | null>(null);

  const [templateList, setTemplateList] = useState<Template[]>([]);
  const [financeId, setFinanceId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const location = useLocation();
  const [merged, setMerged] = useState(null);

  useEffect(() => {
    let template: Template = bardCodeTemplate();
    setTemplate(template)
    try {
      const templateString = localStorage.getItem("template");
      const templateJson = templateString
        ? JSON.parse(templateString)
        : bardCodeTemplate();
      checkTemplate(templateJson);
      template = templateJson as Template;
    } catch {
      localStorage.removeItem("template");
    }

    getFontsData().then((font) => {
      if (designerRef.current) {
        designer.current = new Designer({
          domContainer: designerRef.current,
          template,
          options: { font },
          plugins: getPlugins(),
        });
        designer.current.onSaveTemplate(onSaveTemplate);
      }
    });
    return () => {
      if (designer.current) {
        designer.current.destroy();
      }
    };
  }, [designerRef]);

  const onDownloadTemplate = () => {
    if (designer.current) {
      downloadJsonFile(designer.current.getTemplate(), "template");
      // console.log(designer.current.getTemplate());
    }
  };
  const onSaveTemplate = async (template?: Template, financeId?: string) => {
    if (designer.current) {
      localStorage.setItem(
        "template",
        JSON.stringify(template || designer.current.getTemplate())
      );
      const templateData = template || designer.current.getTemplate();
      const templateName = window.prompt("Template Name") || "";
      const docName = templateName + financeId;
      const data = {
        userId: userId, // Assuming userId is defined in the scope
        doc: templateData,
        docName: docName,
        dept: "",
        fileName: templateName,
        category: "",
      };

      try {
        let url = window.location.href;
        let response;
        if (url === "http://localhost:3002/") {
          response = await fetch("http://localhost:5066/documents", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        } else if (url === "https://third-kappa.vercel.app/") {
          response = await fetch("https://third-kappa.vercel.app/api/postDocuments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        }

        if (!response?.ok) {
          throw new Error(`HTTP error! status: ${response?.status}`);
        }
        console.log(data, 'data')
        const document = await response.json();
        console.log("Document saved:", document);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const handleLoadSavedTemplate = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const templateName = event.target.value;
    if (templateName) {
      try {
        const response = await axios.get(`/api/get-template/${templateName}`);
        // Load the template into your designer...
        return response
      } catch (error) {
        console.error('Failed to load template:', error);
      }
    }
  }
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const [isFile, setIsfile] = useState(false)
  const [isFile2, setIsfile2] = useState(false)

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsfile(true)
    if (event.target && event.target.files) {
      readFile(event.target.files[0], "dataURL").then(async (basePdf) => {
        if (designer.current) {
          designer.current.updateTemplate(
            Object.assign(cloneDeep(designer.current.getTemplate()), {
              basePdf,
            })
          );
        }
      });
    }
  };
  const handleLoadTemplate = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentRef: Designer | Form | Viewer | null
  ) => {
    setSelectedFile2(e.target.files[0]);
    setIsfile2(true)
    if (e.target && e.target.files) {
      getTemplateFromJsonFile(e.target.files[0])
        .then((t) => {
          if (!currentRef) return;
          currentRef.updateTemplate(t);
        })
        .catch((e) => {
          alert(`Invalid template file.
  --------------------------
  ${e}`);
        });
    }
  };


  const template = templateData

  async function GeneratePDFWInputs(
    inputs: any[],
    currentRef: Designer | Form | Viewer | null
  ) {
    if (!currentRef) {
      throw new Error('Invalid reference for PDF generation');
    }

    // Helper function to paginate the data
    const paginateData = (data: any[], itemsPerPage: number) => {
      const pages: any[][] = [];
      for (let i = 0; i < data.length; i += itemsPerPage) {
        pages.push(data.slice(i, i + itemsPerPage));
      }
      return pages;
    };

    // Number of entries per page
    const itemsPerPage = 30; // Adjust this number as needed

    const template = templateData
    const font = await getFontsData();

    try {
      const pages = paginateData(inputs, itemsPerPage);
      const pdfBuffers: Uint8Array[] = [];

      for (const pageData of pages) {
        const pdf = await generate({
          template,
          inputs: pageData,
          plugins: getPlugins(),
        });

        pdfBuffers.push(new Uint8Array(pdf.buffer));
      }

      // Combine all Uint8Arrays into one
      const combinedPdfBuffer = new Uint8Array(pdfBuffers.reduce((acc, buf) => acc.concat(Array.from(buf)), []));

      if (typeof window !== 'undefined') {
        // Browser environment
        const blob = new Blob([combinedPdfBuffer], { type: 'application/pdf' });
        window.open(URL.createObjectURL(blob));
      } else {
        // Node.js environment
        const fs = require('fs');
        fs.writeFileSync('test.pdf', Buffer.from(combinedPdfBuffer)); // Save PDF to file
        console.log('PDF file generated successfully');
        return 'test.pdf';
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  /**   const template = currentRef.getTemplate();
     const font = await getFontsData();

     try {
       const pdf = await generate({
         template,
         inputs,
         //   options: { font },
         plugins: getPlugins(),
       });


       // Handle PDF generation based on the environment (browser or Node.js)
       if (typeof window !== 'undefined') {
         // Running in the browser
         const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
         window.open(URL.createObjectURL(blob));
       } else {
         // Running in Node.js (server-side)
         fs.writeFileSync('test.pdf', pdf.buffer); // Save PDF to file
         console.log('PDF file generated successfully');
         // You can return a file path or other information if needed
         return 'test.pdf';
       }
     } catch (error) {
       console.error('Error generating PDF:', error);
       throw new Error('Failed to generate PDF'); // Handle error appropriately
     } */


  return (
    <div className='mt-[35px]'>
      <header className='mb-3 items-center' style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginRight: 120, marginLeft: 50 }}>
        <div className="relative ml-2 mt-4">
          <Input id="file" type="file" className='hidden' name='file' onChange={handleFileChange} />
          <label htmlFor="file" className={`h-[37px] cursor-pointer border border-border rounded-md text-foreground bg-background px-4 py-2 inline-block w-[250px]
                    ${isFile2 === false ? 'border-primary' : 'border-[#3dff3d]'}`}  >
            <span className="mr-4">
              {isFile2 === false ? <p>Choose File</p> : <p>{selectedFile}</p>}
            </span>
          </label>
          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
            Change BasePDF
          </label>
        </div>
        <div className="relative ml-2 mt-4">
          <Input id="file" type="file" className='hidden' name='file' onChange={(e) => handleLoadTemplate(e, designer.current)} />
          <label htmlFor="file" className={`h-[37px] cursor-pointer border border-border rounded-md text-foreground bg-background px-4 py-2 inline-block w-[250px]
                    ${isFile === false ? 'border-primary' : 'border-[#3dff3d]'}`}  >
            <span className="mr-4">
              {isFile === false ? <p>Choose File</p> : <p>{selectedFile2}</p>}
            </span>
          </label>
          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
            Load Template
          </label>
        </div>


        <Button
          className='mx-2' onClick={onDownloadTemplate}>
          Download Template
        </Button>
        <Button
          className='mx-2'
          onClick={() => onSaveTemplate(templates[0], financeId)}>
          Save Template
        </Button>
        <Button
          className='mx-2'
          onClick={() => {
            GeneratePDFWInputs(inputs, templateData);
          }}>
          Generate PDF w inputs
        </Button>

      </header>
      <div ref={designerRef} style={{ width: '100%', height: `calc(100vh - ${headerHeight}px)` }} />
    </div>
  );
}
