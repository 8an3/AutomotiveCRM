import React, { useEffect, useRef, useState } from "react";
import { Designer } from "@pdfme/ui";

import {
    getFontsData,
    getTemplate,
    readFile,
    cloneDeep,
    getPlugins,
    handleLoadTemplate,
    generatePDF,
    GeneratePDFWInputs,

    downloadJsonFile,

    generateAllPDFs,
} from "~/components/document/helpertheone";
import { checkTemplate } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import ucdaTemplate from '~/components/document/ucda.json'
import yellowJacketTemplate from '~/components/document/yellowJacket.json'
import workOrdereTemplate from '~/components/document/workOrderTemplate.json'
import fileFrontTemplate from '~/components/document/fileFront.json'
import lvsixTemplate from '~/components/document/levesixFront.json'
import lvsixTemplateBack from '~/components/document/levesixBack.json'
import QUEBECATTOURNEYTemplate from '~/components/document/QUEBECATTOURNEY.json'
import stickyBackTemplate from '~/components/document/stickyBack.json'
import bosTemplate from '~/components/document/bos.json'
import { Button } from "~/components";
import {
    ChevronLeft,
    ChevronRight,
    Copy,
    CreditCard,
    File,
    Home,
    LineChart,
    ListFilter,
    MoreVertical,
    Package,
    Package2,
    PanelLeft,
    Search,
    Settings,
    ShoppingCart,
    Truck,
    Users2,
} from "lucide-react"
import { generate } from "@pdfme/generator";
import { ClientOnly } from "remix-utils";
export default function CustomerGen() {

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
interface Template { fileName: string; }

export function PrintButton() {
    const [templateList, setTemplateList] = useState<Template[]>([]); // Ensure Template is the correct type
    const [userId, setUserId] = useState<string>('');

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


    const [ucda, setucda] = useState('');
    const [workOrder, setworkOrder] = useState('');
    const [yellow, setyellow] = useState('');
    const [fileFront, setfileFront] = useState('');
    const [lvsix, setlvsix] = useState('');
    const [lvsixBack, setlvsixBack] = useState('');
    const [QUEBECATTOURNEY, setQUEBECATTOURNEY] = useState('');
    const [stickyBack, setstickyBack] = useState('');
    const [bos, setbos] = useState('');

    async function Yellow(inputs: any, template: any) {
        if (!template.doc.schemas || !template.doc.basePdf || !inputs || !inputs[0]) {
            console.error('Invalid template or inputs');
            return;
        }
        const makePdf = await generate({ template: template.doc, inputs }).then((pdf: any) => {
            console.log(pdf);
            const blob = new Blob([pdf.buffer], { type: "application/pdf" });
            window.open(URL.createObjectURL(blob));
        });
        return makePdf;
    }
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (workOrder || ucda || yellow || fileFront || lvsix || QUEBECATTOURNEY || stickyBack || bos) {
            OtherWorksheets(inputs);
        }
    }, [workOrder, ucda, yellow, fileFront, lvsix, QUEBECATTOURNEY, stickyBack, bos, OtherWorksheets]);

    async function OtherWorksheets(inputs: any) {
        setIsLoading(true);

        let template;
        if (ucda === 'ucda') { template = ucdaTemplate; }
        if (workOrder === 'workOrder') { template = workOrdereTemplate; }
        if (yellow === 'yellow') { template = yellowJacketTemplate; }
        if (fileFront === 'fileFront') { template = fileFrontTemplate; }
        if (lvsix === 'lvsix') { template = lvsixTemplate; }
        if (lvsixBack === 'lvsixBack') { template = lvsixTemplateBack; }
        if (QUEBECATTOURNEY === 'QUEBECATTOURNEY') { template = QUEBECATTOURNEYTemplate; }
        if (stickyBack === 'stickyBack') { template = stickyBackTemplate; }
        if (bos === 'bos') { template = bosTemplate; }
        if (!template?.schemas || !template.basePdf || !inputs || !inputs[0]) {
            console.error('Invalid template or inputs');
            setIsLoading(false);
            return;
        }

        const makePdf = await generate({ template, inputs }).then((pdf: any) => {
            console.log(pdf);
            const blob = new Blob([pdf.buffer], { type: "application/pdf" });
            window.open(URL.createObjectURL(blob));
        });
        setyellow('')
        setworkOrder('')
        setucda('')
        setfileFront('')
        setlvsix('')
        setQUEBECATTOURNEY('')
        setstickyBack('')
        setlvsixBack('')
        console.log(template, 'tempasltea')
        setIsLoading(false);
        return makePdf;
    }
    // <button onClick={() => Yellow(inputs, template)}  >Print2</button>
    //
    const button = document.getElementById('myButton');
    const button2 = document.getElementById('myButton2');
    const button3 = document.getElementById('myButton3');
    const button4 = document.getElementById('myButton4');
    const button5 = document.getElementById('myButton5');
    const button6 = document.getElementById('button6');
    if (button5) {
        button5.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button5.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button) {
        button.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button2) {
        button2.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button2.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button3) {
        button3.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button3.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button4) {
        button4.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button4.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button6) {
        button6.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button6.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }

    /**    window.addEventListener('message', (event) => {
            const data = event.data;
            console.log(data)

            const merged = data.merged

            setMerged(merged);
            setUserId(data.userId);
            console.log('merged1', data);

            console.log('Received message:', event.data);
        }); */
    // Define state variables for the data you want to track
    const [merged, setMerged] = useState(null);
    const inputs = Array.isArray(merged) ? merged : [merged];
    const [id, setId] = useState(null)
    useEffect(() => {
        if (merged && userId && id) {
            console.log('merged2', merged, 'userid', userId, 'id',);
            // Perform other side effects here
        }
    }, [merged, userId]);

    useEffect(() => {
        const data = window.localStorage.getItem("data");
        setMerged(data?.merged);
        setUserId(data?.userId);
    }, [merged, userId]);

    const inputsPDF = Array.isArray(merged) ? merged : [merged];
    // <button onClick={generateAllPDFs}>Print</button>
    return (
        <div className="mx-auto justify-center mt-10">
            <h1>PDF Generator</h1>
            <hr className="text-muted-foreground" />
            {templateList.map((template: any, index) => (
                template && 'fileName' in template ? (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {template.fileName && (
                            <p className="text-muted-foreground">{template.fileName}</p>
                        )}
                        <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => Yellow(inputs, template)}>
                            <File className="h-3.5 w-3.5" />
                            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                                Print
                            </span>
                        </Button>
                    </div>
                ) : null
            ))}
            <div className='mt-5 ' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p className="text-muted-foreground" > Work Order </p>
                <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => setworkOrder('workOrder')}>
                    <File className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Print
                    </span>
                </Button>
            </div>
            <div className='mt-5 ' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p className="text-muted-foreground" >UCDA</p>
                <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => setucda('ucda')}>
                    <File className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Print
                    </span>
                </Button>
            </div>
            <div className='mt-5 ' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p className="text-muted-foreground" >Yellow Jacket</p>
                <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => setfileFront('fileFront')}>
                    <File className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Print
                    </span>
                </Button>
            </div>
            <div className='mt-5 ' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p className="text-muted-foreground" >LV6</p>
                <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => setlvsix('lvsix')}>
                    <File className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Print
                    </span>
                </Button>
            </div>
            <div className='mt-5 align-center ' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p className="text-muted-foreground" >LV6 - 2</p>
                <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => setlvsixBack('lvsixBack')}>
                    <File className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Print
                    </span>
                </Button>
            </div>
            <div className='mt-5 ' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p className="text-muted-foreground" >Quebec - Power of Attourney</p>
                <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => setQUEBECATTOURNEY('QUEBECATTOURNEY')}>
                    <File className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Print
                    </span>
                </Button>
            </div>
            <div className='mt-5 ' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p className="text-muted-foreground" >Sticky Back - Into Customers Name</p>
                <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => setstickyBack('stickyBack')}>
                    <File className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Print
                    </span>
                </Button>
            </div>
            <div className='mt-5 ' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p className="text-muted-foreground" >BOS</p>
                <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => setbos('bos')}>
                    <File className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Print
                    </span>
                </Button>
            </div>
        </div>
    );
}
/*





                    import React, { useEffect, useRef, useState } from "react";
import { Designer } from "@pdfme/ui";
import './test.css'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./card"
import {
    getFontsData,
    getTemplate,
    readFile,
    cloneDeep,
    getPlugins,
    handleLoadTemplate,
    generatePDF,
    GeneratePDFWInputs,
    ucdaTemplate,
    workOrdereTemplate,
    downloadJsonFile,
    yellowJacketTemplate,
    generateAllPDFs,
} from "./helper";
import { checkTemplate } from "@pdfme/common";
import { generate } from "@pdfme/generator";

interface Template {
    fileName: string;
    // include other properties of the template object if necessary
}

export default function CustomerGen() {
    const designerRef = useRef<HTMLDivElement | null>(null);
    const designer = useRef<any>(null);
    const [templates, setTemplates] = useState<string[]>([]);
    const [templateList, setTemplateList] = useState<Template[]>([]);
    const [financeId, setFinanceId] = useState<string>('');
    const [userId, setUserId] = useState<string>('');

    const getTemplateFromServer = async () => {
        try {
         //  const response = await fetch('http://localhost:5066/documents', {
                  const response = await fetch('https://third-kappa.vercel.app/api/getDocuments', {
                method: 'GET', // or 'POST'
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify(data), // Uncomment this if you need to send data
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const template = await response.json();
            return template;
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        }
    };

    useEffect(() => {
        const fetchTemplates = async () => {
            const templatesFromServer = await getTemplateFromServer();
           // console.log('Templates:', templatesFromServer); // log the templates
            const templateArray = Array.isArray(templatesFromServer) ? templatesFromServer : [templatesFromServer];

            setTemplateList(templateArray);
        };

        fetchTemplates();
    }, []);


    const [ucda, setucda] = useState('');
    const [workOrder, setworkOrder] = useState('');
    const [yellow, setyellow] = useState('');
   // const inputs = Array.isArray(merged) ? merged : [merged];

    //const generateAllPDFs = () => {
    //   templateList.forEach((template) => {
    //       GeneratePDFWInputs(inputs, designer.template);
    //  });
    //};
    // <button onClick={generateAllPDFs}>Print</button>

    async function Yellow(inputs: any, template: any) {
        if (!template.doc.schemas || !template.doc.basePdf || !inputs || !inputs[0]) {
            console.error('Invalid template or inputs');
            return;
        }
        const makePdf = await generate({ template: template.doc, inputs }).then((pdf: any) => {
            console.log(pdf);
            const blob = new Blob([pdf.buffer], { type: "application/pdf" });
            window.open(URL.createObjectURL(blob));
        });
        return makePdf;
    }
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (workOrder || ucda || yellow) {
            OtherWorksheets(inputs);
        }
    }, [workOrder, ucda, yellow]);

    async function OtherWorksheets(inputs: any) {
        setIsLoading(true);
        let template;
        if (ucda === 'ucda') { template = ucdaTemplate(); }
        if (workOrder === 'workOrder') { template = workOrdereTemplate(); }
        if (yellow === 'yellow') { template = yellowJacketTemplate(); }
        if (!template?.schemas || !template.basePdf || !inputs || !inputs[0]) {
            console.error('Invalid template or inputs');
            setIsLoading(false);
            return;
        }
        const makePdf = await generate({ template, inputs }).then((pdf: any) => {
            console.log(pdf);
            const blob = new Blob([pdf.buffer], { type: "application/pdf" });
            window.open(URL.createObjectURL(blob));
        });
        setyellow('')
        setworkOrder('')
        setucda('')
        setIsLoading(false);
        return makePdf;
    }
   // <button onClick={() => Yellow(inputs, template)}  >Print2</button>
    //
    const button = document.getElementById('myButton');
    const button2 = document.getElementById('myButton2');
    const button3 = document.getElementById('myButton3');
    const button4 = document.getElementById('myButton4');
    const button5 = document.getElementById('myButton5');
    const button6 = document.getElementById('button6');
    if (button5) {
        button5.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button5.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button) {
        button.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button2) {
        button2.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button2.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button3) {
        button3.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button3.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button4) {
        button4.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button4.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }
    if (button6) {
        button6.addEventListener('mousedown', function () {
            this.style.transform = 'translateY(2px)';
        });

        button6.addEventListener('mouseup', function () {
            this.style.transform = 'translateY(-2px)';
        });
    }

    window.addEventListener('message', (event) => {
        const data = event.data;

        setMerged(data.merged);
        setUserId(data.user);
        console.log('merged1', data);

        console.log('Received message:', event.data);
    });
    // Define state variables for the data you want to track
    const [merged, setMerged] = useState(null);
    const inputs = Array.isArray(merged) ? merged : [merged];
    const [id, setId] = useState(null)

    return (
        <div className="centered-container mx-auto my-auto justify-center items-center">
            <Card className="w=[95%] sm:w-1/3 fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%]">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">PDF Generator</CardTitle>
                    <CardDescription>
                        Print needed documents for your customers
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {templateList.map((template, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p>{template.fileName}</p>
                            <button id='myButton' onClick={() => Yellow(inputs, template)}>Print</button>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p> Work Order </p>
                        <button
                            disabled={isLoading}
                            id='myButton2'
                            onClick={() => {
                                setworkOrder('workOrder');
                            }}
                        >Print</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p>UCDA</p>
                        <button
                            disabled={isLoading}
                            id='myButton3'
                            onClick={() => {
                                setucda('ucda');
                            }}
                        >Print</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p>Yellow Jacket</p>
                        <button
                            disabled={isLoading}
                            id='myButton4'
                            onClick={() => {
                                setyellow('yellow');
                            }}
                        >Print</button>
                    </div>

                </CardContent>

            </Card>
        </div>
    );
}
*/
