import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { getSession, commitSession } from "~/sessions/auth-session.server";
import { GetUser } from "~/utils/loader.server";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import {
  Form,
  Link,
  useLoaderData,
  useLocation,
  Await,
  useFetcher,
  useSubmit,
  useNavigate,
  useActionData,
} from "@remix-run/react";
import { prisma } from "~/libs";
import { useEffect, useRef, useState } from "react";
import { Button, DropdownMenuItem, DropdownMenuShortcut } from "~/components";
import { Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Scan } from "lucide-react";
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import ScanSound from '~/images/scan.mp4'
import { cn } from "~/utils";

export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData());
  let formData = financeFormSchema.parse(formPayload);
  const intent = formPayload.intent;
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email");
  console.log(formPayload, 'from actiuon')
  if (intent === "Accessories") {
    await prisma.customerSync.update({
      where: { userEmail: email },
      data: { orderId: formPayload.orderId }
    });
    return redirect('/dealer/accessories/currentOrder')
  }
  if (intent === "Service") {
    await prisma.customerSync.update({
      where: { userEmail: email },
      data: { orderId: formPayload.orderId }
    });
    return redirect('/dealer/accessories/currentOrder')
  }
  if (intent === "Sales") {
    await prisma.customerSync.update({
      where: { userEmail: email },
      data: { orderId: formPayload.orderId }
    });
    return redirect('/dealer/overview/new/previousQuote')
  }
  return null;
}

export function playScanSound() {
  const audio = new Audio(ScanSound);
  audio.play();
}

export default function SearchByOrderFunction() {
  const location = useLocation();
  let [show, setShow] = useState(false);
  let ref = useRef();
  const fetcher = useFetcher();
  let search = useFetcher();
  const submit = useSubmit();
  const data = useActionData<typeof action>();


  useEffect(() => {
    setShow(false);
  }, [location]);

  // bind command + k
  useEffect(() => {
    let listener = (event) => {
      // if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      if (event.key === 'F12') {
        event.preventDefault();
        setShow(true);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);


  const [finances, setFinances] = useState([]);

  const selectedCustomer = async (email) => {
    console.log("selected search", email);
    try {
      const response = await fetch(`/dealer/api/searchFinance/${email}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const finance = await response.json();
      console.log("finance", finance);
      setFinances(finance);
    } catch (error) {
      console.error("Error fetching finance data:", error);
    }
  };

  const handleMouseEnter = (email) => () => {
    selectedCustomer(email);
  };

  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState('Service');

  const [scannedOrder, setScannedOrder] = useState('')


  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    console.log('ZXing code reader initialized');

    const hints = new Map();
    const formats = [
      BarcodeFormat.PDF_417,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.ITF,
      BarcodeFormat.CODE_128,
      BarcodeFormat.EAN_13,
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    codeReader.getVideoInputDevices()
      .then((videoInputDevices) => {
        const sourceSelect = document.getElementById('sourceSelect');
        let selectedDeviceId = videoInputDevices[0].deviceId;

        if (videoInputDevices.length > 1) {
          videoInputDevices.forEach((element) => {
            const sourceOption = document.createElement('option');
            sourceOption.text = element.label;
            sourceOption.value = element.deviceId;
            sourceSelect.appendChild(sourceOption);
          });

          sourceSelect.onchange = () => {
            selectedDeviceId = sourceSelect.value;
          };

          const sourceSelectPanel = document.getElementById('sourceSelectPanel');
          sourceSelectPanel.style.display = 'block';
        }


        document.getElementById('startButton').addEventListener('click', async () => {
          let stopScanning = false;

          while (!stopScanning) {
            try {
              const result = await codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints);
              setScannedOrder(result.text);
              playScanSound();
              console.log('result', result);
              await new Promise(resolve => setTimeout(resolve, 5000));
              codeReader.reset();
            } catch (err) {
              console.error('error', err);
            }
          }
          console.log('Stopped scanning');
        });

        document.getElementById('resetButton').addEventListener('click', () => {
          document.getElementById('result').textContent = '';
          codeReader.reset();
          setScannedOrder('')

          console.log('Reset.');
        });

        let listener = (event) => {
          // if ((event.metaKey || event.ctrlKey) && event.key === "s") {
          if (event.key === 'F12') {
            event.preventDefault();
            codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints).then((result) => {
              console.log(result);
              /// document.getElementById('result').textContent = result.text;
              setScannedOrder(result.text)
            }).catch((err) => {
              console.error(err);
              //  document.getElementById('result').textContent = err;
            });
          }
          // if ((event.metaKey || event.ctrlKey) && event.key === "r") {
          if (event.key === 'F2') {
            event.preventDefault();
            codeReader.reset();
            setScannedOrder('')
            console.log('Reset.');
          }
        };

        window.addEventListener("keydown", listener);
        return () => window.removeEventListener("keydown", listener);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (scannedOrder) {
      console.log('scanned coide')
      try {
        const formData = new FormData();
        formData.append("orderId", scannedOrder);
        formData.append("intent", intent);
        const submitOrder = submit(formData, { method: "post", action: '/dealer/searchByOrder' });
        console.log(submitOrder, 'sibmiteedd')
        return submitOrder
      } catch (err) {
        console.error('error', err);
      }
    }
  }, [scannedOrder]);


  return (
    <div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <>
              <Button
                variant="ghost"
                size="icon"
                id="startButton"
                onClick={(e) => {
                  e.preventDefault();
                  setShow(true);
                }}
                className=" fixed right-[75px] top-[25px]"
              >
                <Scan className="text-foreground" />
              </Button>
            </>
          </TooltipTrigger>
          <TooltipContent>
            <p>Customer Search</p>
            <p>F3 - Open search</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div
        onClick={() => {
          setShow(false);
        }}
        hidden={!show}
        className="bg-background/80"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vw",
          margin: "auto",
          //   background: 'hsla(0, 100%, 100%, 0.9)',
          zIndex: 95,
          overflow: "hidden",
        }}
      >
        <div
          className="fixed left-[50%] top-[50%] translate-x-[-50%]  translate-y-[-50%] border border-border bg-background text-foreground"
          style={{
            //   background: 'white',
            width: 400,
            maxHeight: "350px",
            height: "350px",
            // overflow: 'auto',
            // margin: '20px auto',
            // border: 'solid 1px #ccc',
            borderRadius: 10,
            // boxShadow: '0 0 10px #ccc',
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setShow(false);
            }
          }}
        >
          <div className=''>
            <div className='flex items-center justify-center text-foreground mt-3'>
              <Button
                size="sm"
                variant="outline"
                className={cn('mr-2 bg-primary', intent === 'Sales' ? "bg-secondary" : "", "")}
                onClick={() => setIntent('Sales')}
              >
                <p className="">Sales</p>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={cn('mr-2 bg-primary', intent === 'Service' ? "bg-secondary" : "", "")}
                onClick={() => setIntent('Service')}
              >
                <p className="">Service</p>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIntent('Accessories')}
                className={cn(' bg-primary', intent === 'Accessories' ? "bg-secondary" : "", "")}
              >
                <p className="">Accessories</p>
              </Button>
            </div>
            <main className="justify-center wrapper text-white mx-auto mt-3" >
              <section className="container" id="demo-content">
                <div className='flex items-center'>

                  <div className='flex flex-col items-center  mx-auto' >
                    <div className='rounded-[5px] border border-border relative group' style={{ padding: 0, width: '350px', maxHeight: '300px', overflow: 'hidden', border: ' ' }}>
                      <video id="video" style={{ width: '350px' }}></video>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-sm  bg-primary absolute left-2.5 top-2.5  opacity-0 transition-opacity group-hover:opacity-100 "
                        id="startButton"
                      >
                        <Scan className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only text-foreground">Scan</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-sm   absolute right-2.5 top-2.5  opacity-0 transition-opacity group-hover:opacity-100 "
                        id="resetButton"
                      >
                        <Scan className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only text-foreground">Reset</span>
                      </Button>
                      <div id="sourceSelectPanel" style={{ display: 'none' }}>
                        <select id="sourceSelect" className='b-rounded-[5px] px-3 py-1 bg-background text-foreground border-border border   opacity-0 transition-opacity group-hover:opacity-100 ' style={{ maxWidth: '350px' }}></select>
                      </div>
                    </div>
                    <div style={{ display: 'none' }}>
                      <div style={{ padding: 0, width: '350px', maxHeight: '300px', overflow: 'hidden', border: '1px solid gray' }}>
                        <video id="video" style={{ width: '350px' }}></video>
                      </div>
                      <input className='text-background bg-background border-background' type="file" id="imageUploadButton" accept="image/*" style={{ display: 'inline-block', }} />
                      <label className='text-background' htmlFor="sourceSelect">Change video source:</label>
                      <label className='text-background' >Result:</label>
                      <pre><code className='text-background' id="result"></code></pre>

                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}



/**                 <Link
                    to={`/dealer/customer/${result.id}/check`}
                    className='mb-5 justify-start'
                    key={index}
                  >
                    <Button
                      variant='ghost'
                      className='w-[99%] hover:bg-background/40 rounded-[6px] my-2 h-[75px] hover:text-black'
                    >
                      <div>
                        <p className="text-2xl text-left text-foreground"> {capitalizeFirstLetter(result.firstName)} {capitalizeFirstLetter(result.lastName)}</p>
                        <p className='text-muted-foreground text-left '>{result.phone}</p>
                        <p className='text-muted-foreground text-left '>{result.email}</p>
                      </div>
                    </Button>
                  </Link> */



/**
 *
 *
*/

/**                 <Link
                    to={`/dealer/customer/${result.id}/check`}
                    className='mb-5 justify-start'
                    key={index}
                  >
                    <Button
                      variant='ghost'
                      className='w-[99%] hover:bg-background/40 rounded-[6px] my-2 h-[75px] hover:text-black'
                    >
                      <div>
                        <p className="text-2xl text-left text-foreground"> {capitalizeFirstLetter(result.firstName)} {capitalizeFirstLetter(result.lastName)}</p>
                        <p className='text-muted-foreground text-left '>{result.phone}</p>
                        <p className='text-muted-foreground text-left '>{result.email}</p>
                      </div>
                    </Button>
                  </Link> */
