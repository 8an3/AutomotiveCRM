import React, { useEffect, useRef, useState } from "react";
import { Template, checkTemplate } from "@pdfme/common";
import { Form, Viewer, Designer } from "@eightanthreepdfme/ui"//"@pdfme/ui";
import {
  getFontsData,
  getTemplate,
  readFile,
  cloneDeep,
  getPlugins,
  //handleLoadTemplate,
  generatePDF,
  GeneratePDFWInputs,
  downloadJsonFile,
  getTemplateFromJsonFile,
} from "~/components/document/helper";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import levesixBack from '~/components/document/levesixBack.json'
import levesixFront from '~/components/document/levesixFront.json'
import fileFrontTemplate from '~/components/document/fileFront.json'
import stickyBackTemplate from '~/components/document/stickyBack.json'
import QUEBECATTOURNEYTemplate from '~/components/document/QUEBECATTOURNEY.json'
import yelJacket from '~/components/document/yellowJacket.json'
import workOrder from '~/components/document/workOrderTemplate.json'
import ucdasheet from '~/components/document/ucda.json'
import {
  AvatarAuto, Badge, Debug, RemixLink, Button,
  ButtonLink,
  PageAdminHeader,
  RemixForm, Card, CardContent, Input, Label, Avatar, AvatarFallback, AvatarImage, PopoverTrigger, PopoverContent, Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Popover, CardHeader, CardTitle, CardDescription,
  SelectContent, SelectLabel, SelectGroup,
  SelectValue, Select, SelectTrigger, SelectItem,
  Separator,
} from "~/components";
import { generate } from "@pdfme/generator";
import { ClientOnly } from "remix-utils";


export default function DesignerApp() {

  return (
    <>
      <div className="h-screen justify-center bg-background">
        <ClientOnly fallback={<p>Fallback component ...</p>}>
          {() => (
            <React.Suspense fallback={<div>Loading...</div>}>
              <PrintButton />
            </React.Suspense>
          )}
        </ClientOnly>
      </div>
    </>
  );
}
const headerHeight = 65;


export function PrintButton() {
  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateList, setTemplateList] = useState<Template[]>([]);
  const [financeId, setFinanceId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const location = useLocation();
  // console.log(location.pathname);
  // console.log(window.location.href); // logs the full URL

  const [merged, setMerged] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      const templatesFromServer = await getTemplateFromServer();
      console.log('Templates:', templatesFromServer); // log the templates
      const templateArray = Array.isArray(templatesFromServer) ? templatesFromServer : [templatesFromServer];

      setTemplateList(templateArray);
      console.log(templateList)
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    let template: Template = getTemplate();
    // console.log(window.location.href); // logs the full URL

    try {
      const templateString = localStorage.getItem("template");
      const templateJson = templateString
        ? JSON.parse(templateString)
        : getTemplate();
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


  const getTemplateFromServer = async () => {
    try {
      let url = window.location.href;
      let response;
      if (url === 'http://localhost:3002/') {
        response = await fetch('http://localhost:5066/documents', { method: 'GET', headers: { 'Content-Type': 'application/json', }, });
        console.log(response, 'response')
      }
      if (url === 'https://third-kappa.vercel.app/') {
        response = await fetch('https://third-kappa.vercel.app/api/getDocuments', { method: 'GET', headers: { 'Content-Type': 'application/json', }, });
      }
      console.log(response, 'response')

      if (!response?.ok) {
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const template = await response.json();
      return template;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };
  const onLoadTemplate = async (value) => {
    const templateName = value;
    if (!templateName) return;
    try {
      let template;
      if (templateName === 'Quebec - Power of Attourney') {
        template = QUEBECATTOURNEYTemplate;
      } else if (templateName === 'File Front') {
        template = fileFrontTemplate;
      } else if (templateName === 'LV6 Front') {
        template = levesixFront;
      } else if (templateName === 'LV6 Back') {
        template = levesixBack;
      } else if (templateName === 'Sticky Back') {
        template = stickyBackTemplate;
      } else if (templateName === 'Yellow Jacket') {
        template = yelJacket;
      } else if (templateName === 'Work Order') {
        template = workOrder;
      } else if (templateName === 'UCDA') {
        template = ucdasheet;
      } else {
        const getTemp = await getTemplateFromServer();
        template = getTemp.find((t: { fileName: string }) => t.fileName === templateName);
      }
      if (designer.current) {
        designer.current.updateTemplate(template);
      }
    } catch (e) {
      console.log(e);
      alert(`Failed to load template.
  --------------------------
  ${e}`);
    }
  };


  const onChangeBasePDF = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      readFile(e.target.files[0], "dataURL").then(async (basePdf) => {
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
        userId: userId,
        doc: templateData,
        docName: docName,
        dept: "",
        fileName: templateName,
        category: "",
      };

      try {
        let url = window.location.href;
        let response;
        if (url === "http://localhost:3000/") {
          response = await fetch("http://localhost:3000/dealer/document/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        } else if (url === "https://www.dealersalesassistant.ca/") {
          response = await fetch("https://www.dealersalesassistant.ca/dealer/document/save", {
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

  useEffect(() => {
    const data = window.localStorage.getItem("data");

    if (data) {
      setMerged(data?.merged);
      setUserId(data?.userId);
      console.log(data, 'data')
      window.localStorage.setItem("userId", data?.userId);
      window.localStorage.setItem("user", data?.user);
      window.localStorage.setItem("sentData", data);
    } else {
      let mergedData = {
        userLoanProt: '1500',
        userTireandRim: '799',
        userGap: '780',
        userExtWarr: '1500',
        userServicespkg: '1500',
        vinE: '799',
        lifeDisability: '1500',
        rustProofing: '450',
        userLicensing: '60',
        userFinance: '650',
        userDemo: '555',
        userGasOnDel: '85',
        userOMVIC: '0',
        userOther: '0',
        userTax: '13',
        userAirTax: '25',
        userTireTax: '10.68',
        userGovern: '60',
        userPDI: '750',
        userLabour: '240',
        userMarketAdj: '1500',
        userCommodity: '850',
        destinationCharge: '200',
        userFreight: '750',
        userAdmin: '289',
        iRate: '10.99',
        months: '60',
        discount: '0',
        total: '20059',
        onTax: '22726.67',
        on60: '483.15',
        biweekly: '222.99',
        weekly: '111.5',
        weeklyOth: '111.5',
        biweekOth: '222.99',
        oth60: '483.15',
        weeklyqc: '111.5',
        biweeklyqc: '222.99',
        qc60: '483.15',
        deposit: '500',
        biweeklNatWOptions: '196.23',
        weeklylNatWOptions: '98.11',
        nat60WOptions: '425.16',
        weeklyOthWOptions: '111.5',
        biweekOthWOptions: '222.99',
        oth60WOptions: '483.15',
        biweeklNat: '196.83',
        weeklylNat: '98.42',
        nat60: '426.47',
        qcTax: '22726.67',
        otherTax: '22726.67',
        totalWithOptions: '20059',
        otherTaxWithOptions: '22726.67',
        desiredPayments: 'Standard Payment',
        freight: '0',
        admin: '0',
        commodity: '0',
        pdi: '0',
        discountPer: null,
        deliveryCharge: null,
        paintPrem: null,
        msrp: '19999',
        licensing: '60',
        options: null,
        accessories: 0,
        labour: '0',
        year: '2023',
        brand: 'Harley-Davidson',
        model: 'Street Bob 114 - Vivid Black - FXBBS',
        stockNum: 'b1234',
        model1: null,
        color: 'Vivid Black',
        modelCode: '23-202020',
        tradeValue: '0',
        tradeDesc: 'S100RR',
        tradeColor: 'Black',
        tradeYear: '2023',
        tradeMake: 'BMW',
        tradeVin: 'ZBAS5411654161',
        tradeTrim: null,
        tradeMileage: '2525',
        trim: null,
        vin: 'zasxc651651',
        typeOfContact: null,
        timeToContact: null,
        date: new Date().toLocaleDateString(),
        id: 'clpuqa39a0004uoxolo2exta8',
        financeId: null,
        clientfileId: 'clpuqa34u0003uoxoq2uji9js',
        userEmail: 'skylerzanth@gmail.com',
        dl: 'T123412341234',
        email: 'Test1234@gmail.com',
        firstName: 'Skyler',
        lastName: 'Test',
        phone: '6136136134',
        name: 'Skyler Test',
        address: '1234 Test st',
        city: 'Testville',
        postal: 'k1k1k1',
        province: 'Test',
        referral: 'off',
        visited: 'off',
        bookedApt: 'off',
        aptShowed: 'off',
        aptNoShowed: 'off',
        testDrive: 'off',
        metService: 'off',
        metManager: 'off',
        metParts: 'off',
        sold: 'off',
        depositMade: 'off',
        refund: 'off',
        turnOver: 'off',
        financeApp: 'off',
        approved: 'off',
        signed: 'off',
        pickUpSet: 'off',
        demoed: 'off',
        delivered: 'off',
        status: 'Active',
        customerState: 'Reached',
        result: 'Reached',
        lastContact: '2023-12-07T05:50:02.697Z',
        timesContacted: null,
        nextAppointment: '2023-12-08T05:50:02.696Z',
        followUpDay: '2023-12-08T05:50:02.696Z',
        deliveredDate: null,
        notes: 'off',
        visits: null,
        progress: null,
        metSalesperson: 'off',
        metFinance: 'off',
        financeApplication: 'off',
        pickUpDate: '',
        pickUpTime: 'off',
        depositTakenDate: 'off',
        docsSigned: 'off',
        tradeRepairs: 'off',
        seenTrade: 'off',
        lastNote: 'off',
        dLCopy: 'off',
        insCopy: 'off',
        testDrForm: 'off',
        voidChq: 'off',
        loanOther: 'off',
        signBill: 'off',
        ucda: 'off',
        tradeInsp: 'off',
        customerWS: 'off',
        otherDocs: 'off',
        urgentFinanceNote: 'off',
        funded: 'off',
        countsInPerson: null,
        countsPhone: null,
        countsSMS: null,
        countsOther: null,
        countsEmail: null,
        createdAt: '2023-12-07T04:58:50.494Z',
        updatedAt: '2023-12-07T05:50:02.699Z',
        dashboardId: 'clpuqa3ev0005uoxoua34yhgi',
      }
      setMerged(mergedData);

    }

  }, []);
  if (!merged) {


  }

  /**window.addEventListener('message', (event) => {
    const data = event.data;

    setMerged(data.merged);
    setUserId(data.user.id);
    console.log('merged1', merged);
    window.localStorage.setItem("userId", data.user.id);
    window.localStorage.setItem("user", data.user);
    window.localStorage.setItem("sentData", data);


    console.log('Received message:', event.data);
  }); */
  // Define state variables for the data you want to track
  const inputs = Array.isArray(merged) ? merged : [merged];
  const [id, setId] = useState(null)

  /**  // Set up the event listener in a useEffect hook
    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        const data = event.data;

          setMerged(data.merged);
       //  setId(data.merged.id);
          console.log(data.merged);

        setUserId(data.user);
        console.log('merged1', data);
      };

      window.addEventListener('message', handleMessage);

      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }, []); */

  // Use another useEffect hook to perform side effects when the data changes
  if (merged && userId && id) {
    console.log('merged2', merged, 'userid', userId, 'id',);
    // Perform other side effects here
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

  ///-------------------------dnd
  const [list, setList] = useState('Documentation')
  const [theList, setTheList] = useState([])
  const copyText = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(""), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };
  const [copiedText, setCopiedText] = useState("");
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);


  const [open, setOpen] = useState(false)



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
        <div className="relative ">
          <Select name='userRole' onValueChange={onLoadTemplate} >
            <SelectTrigger className="w-[250px] mx-2 bg-background text-foreground border border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border border-border '>
              <SelectGroup>
                <SelectLabel>Templates</SelectLabel>
                <SelectItem value='LV6 Front' className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                  LV6 Front
                </SelectItem>
                <SelectItem value='LV6 Back' className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                  LV6 Back
                </SelectItem>
                <SelectItem value='Yellow Jacket' className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                  Yellow Jacket
                </SelectItem>
                <SelectItem value='Work Order' className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                  Work Order
                </SelectItem>
                <SelectItem value='UCDA' className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                  UCDA
                </SelectItem>
                <SelectItem value='Sticky Back' className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                  Sticky Back
                </SelectItem>
                <SelectItem value='UCFile FrontDA' className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                  File Front
                </SelectItem>
                <SelectItem value='Quebec - Power of Attourney' className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                  Quebec - Power of Attourney
                </SelectItem>
                {templateList.map((template, index) => (
                  template && 'fileName' in template ? (
                    <SelectItem key={index} value={template.fileName} className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline">
                      {template.fileName}
                    </SelectItem>
                  ) : null
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground"> Templates</label>
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
            console.log(merged, inputs, 'inputs')

            GeneratePDFWInputs(inputs, designer.current);
          }}>
          Generate PDF w inputs
        </Button>


      </header>
      <div ref={designerRef} style={{ width: '100%', height: `calc(100vh - ${headerHeight}px)` }} />

    </div>
  );
}


export const meta = () => {
  return [
    { title: 'Document Builder || Dealer Sales Assistant' },
    {
      property: "og:title",
      content: "Your very own assistant!",
    },
    {
      name: "description",
      content: "To help sales people achieve more. Every automotive dealer needs help, especialy the sales staff. Dealer Sales Assistant will help you close more deals more efficiently.",
      keywords: 'Automotive Sales, dealership sales, automotive CRM',
    },
  ];
};
/**  {open && (
          <div className={`  border-[5px] border-black rounded-[12px] bg-white text-black p-5 w-[250px] h-screen z-100`}>
            <div className='grid grid-cols-1 mx-auto justify-center'>
              <p
                className={`text-3xl text-center`}>DB Glossary</p>
              <Separator className='w-[80%] text-border border-border bg-border mb-5' />

              <Select onValueChange={(value) => {
                setList(value)
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Type Of Document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Documents</SelectLabel>
                    <SelectItem value="BOS">BOS</SelectItem>
                    <SelectItem value="Licensing">Licensing</SelectItem>
                    <SelectItem value="Work Order">Work Order</SelectItem>
                    <SelectItem value="Receipt">Receipt</SelectItem>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Documentation">Documentation</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

            </div>
          </div>
        )} */

/**
 * import { useEffect, useRef, useState } from "react";
import { Template, checkTemplate } from "@pdfme/common";
import { Designer } from "@pdfme/ui";
import {
  getFontsData,
  getTemplate,
  readFile,
  cloneDeep,
  getPlugins,
  handleLoadTemplate,
  generatePDF,
  downloadJsonFile,
} from "~/components/document/helper";
import React from "react";
import axios from 'axios';

const headerHeight = 65;

function App() {
  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);
  const [templates, setTemplates] = useState<string[]>([]);


  useEffect(() => {
    let template: Template = getTemplate();
    let inputs = Array.isArray(template.sampledata) ? template.sampledata : [{}];

    try {
      const templateString = localStorage.getItem("template");
      const inputsString = localStorage.getItem("inputs");

      const inputsJson = inputsString ? JSON.parse(inputsString) : null;
      inputs = Array.isArray(inputsJson) ? inputsJson : inputs;

      const templateJson = templateString
        ? JSON.parse(templateString)
        : getTemplate();
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

  /**
   * In the parent iframe:
   * // Save the filename
  let filename = 'template12';

  // Get a reference to the child iframe
  let childIframe = document.getElementById('childIframe');

  // Send the filename to the child iframe
  childIframe.contentWindow.postMessage(filename, '*');

  In the child iframe:
  // Listen for messages from the parent iframe
  window.addEventListener('message', (event) => {
    // The filename is in event.data
    let filename = event.data;

    // Now you can use the filename to make a request to the server
    fetch(`/api/get-template/${filename}`)
      .then(response => response.json())
      .then(data => {
        // Do something with the data
      });
  });
   */
/*
  const fileNames = ['bos', 'ucda', 'tempalte12.json','tempalte1234.json'];


  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3066/api/schemas/${fileNames}`);
        setTemplates(data);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    };

    fetchTemplates();
  }, []);


const getTemplateFromServer = async (templateName: string) => {
  try {
    const response = await axios.get(`http://localhost:3066/api/get-template/${templateName}`);
    console.log(response);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data; // return the data
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
    } else {
      console.log('Error', error);
    }
  }
};


const onLoadTemplate = async (event: React.ChangeEvent<HTMLSelectElement>) => {
  const templateName = event.target.value;
  console.log(templateName);
  if (!templateName) return;

  try {
    const t = await getTemplateFromServer(templateName);
    console.log('Template data:', t); // log the template data
    if (designer.current) {
      designer.current.updateTemplate(t);
    }
  } catch (e) {
    console.log(e);
    alert(`Failed to load template.
  --------------------------
  ${e}`);
  }
};

const onChangeBasePDF = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target && e.target.files) {
    readFile(e.target.files[0], "dataURL").then(async (basePdf) => {
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

const onDownloadTemplate = () => {
  if (designer.current) {
    downloadJsonFile(designer.current.getTemplate(), "template");
    console.log(designer.current.getTemplate());
  }
};

const onSaveTemplate = async (template?: Template) => {
  if (designer.current) {
    localStorage.setItem(
      "template",
      JSON.stringify(template || designer.current.getTemplate())
    );
    const templateData = template || designer.current.getTemplate();
    try {
      const templateName = 'tempalte1234';

      // await fetch('https://mypdfgen.vercel.app:3066/api/save-template', {
      await fetch('http://localhost:3066/api/save-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template: templateData,
          'name': templateName,
        })
      });
      console.log('script saved')
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
/**const response =  await fetch('http://localhost:3066/api/save-template', { mode: 'cors' } );
      const data = await response.json();
      console.log({ data })
      alert('Saved!');
const onResetTemplate = () => {
  if (designer.current) {
    designer.current.updateTemplate(getTemplate());
    localStorage.removeItem("template");
  }
};
const handleLoadSavedTemplate = async (event: React.ChangeEvent<HTMLSelectElement>) => {
  const templateName = event.target.value;
  if (templateName) {
    try {
      const response = await axios.get(`/api/get-template/${templateName}`);
      // Load the template into your designer...
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  }
}

window.addEventListener('message', (event) => {
  console.log(event.data); // Logs { message: "Hello, world!" }
});

return (
  <div>
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginRight: 120, }}>
      <strong>Designer</strong>
      <span style={{ margin: "0 1rem" }}>:</span>
      <label style={{ width: 180 }}>
        Change BasePDF
        <input type="file" accept="application/pdf" onChange={onChangeBasePDF} />
      </label>
      <span style={{ margin: "0 1rem" }}>/</span>
      <label style={{ width: 180 }}>
        Load Template
        <input type="file" accept="application/json" onChange={(e) => handleLoadTemplate(e, designer.current)} />
      </label>
      <span style={{ margin: "0 1rem" }}>/</span>
      <label style={{ width: 180 }}>
        Load Saved Template
        <select onChange={onLoadTemplate}>
          <option value="">Select a template</option>
          {templates.map((template, index) => (
            <option key={index} value={template}>{template}</option>
          ))}
        </select>
      </label>
      <span style={{ margin: "0 1rem" }}>/</span>
      <button onClick={onDownloadTemplate}>Download Template</button>
      <span style={{ margin: "0 1rem" }}>/</span>
      <button onClick={() => onSaveTemplate()}>Save Template</button>
      <span style={{ margin: "0 1rem" }}>/</span>
      <button onClick={onResetTemplate}>Reset Template</button>
      <span style={{ margin: "0 1rem" }}>/</span>
      <button onClick={() => generatePDF(designer.current)}>Generate PDF</button>
    </header>
    <div ref={designerRef} style={{ width: '100%', height: `calc(100vh - ${headerHeight}px)` }} />
  </div>
);
}

export default App;
 */
