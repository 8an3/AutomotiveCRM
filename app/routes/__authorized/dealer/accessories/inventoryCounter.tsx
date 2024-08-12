import React, { useState, useReducer, useEffect, forwardRef, useRef, } from 'react'
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType, NotFoundException, ChecksumException, FormatException } from '@zxing/library';
import useSWR from 'swr'
import ScanSound from '~/images/scan.mp4'
import { Button, Input } from '~/components';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useFetcher } from '@remix-run/react'
import {
  Banknote,
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
  Plus,
  Settings,
  ShoppingCart,
  Truck,
  User,
  Users2,
  PanelTop,
  DollarSign,
  Scan,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { EditableText } from "~/components/actions/shared";
import { prisma } from "~/libs";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { getSession } from "~/sessions/auth-session.server";
import financeFormSchema from "~/overviewUtils/financeFormSchema";


export function playScanSound() {
  const audio = new Audio(ScanSound);
  audio.play();
}
export async function action({ request, params }: LoaderFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session2 = await getSession(request.headers.get("Cookie"));
  console.log(formPayload, 'formpayload')
  const intent = formData.intent;
  if (intent === 'updateProduct') {
    const update = await prisma.accessories.update({
      where: { id: formData.id },
      data: {
        [formPayload.colName]: formPayload.name,
      }
    })
    console.log(update, 'update')
    return json({ update })
  }
}
export default function InventoryCounter() {
  const [scannedCode, setScannedCode] = useState('')
  let addProduct = useFetcher();
  const [order, setOrder] = useState(null)
  let search = useFetcher();
  let ref = useRef();
  let formRef = useRef();


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
        const sourceSelect = document.getElementById('sourceSelectOrder');
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

          const sourceSelectPanel = document.getElementById('sourceSelectPanelOrder');
          sourceSelectPanel.style.display = 'block';
        }


        document.getElementById('startButtonOrder').addEventListener('click', async () => {
          let stopScanning = false;

          while (!stopScanning) {
            try {
              const result = await codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'videoOrder', hints);
              setScannedCode(result.text);

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

        document.getElementById('resetButtonOrder').addEventListener('click', () => {
          document.getElementById('resultOrder').textContent = '';
          codeReader.reset();
          setScannedCode('')
          console.log('Reset.');
        });

        let listener = (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "s") {
            //    event.preventDefault();
            codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'videoOrder', hints).then((result) => {
              console.log(result);
              /// document.getElementById('result').textContent = result.text;
              setScannedCode(result.text)

            }).catch((err) => {
              console.error(err);
              //  document.getElementById('result').textContent = err;
            });
          }
          if ((event.metaKey || event.ctrlKey) && event.key === "r") {
            event.preventDefault();
            codeReader.reset();
            setScannedCode('')
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

  const swrFetcher = (url) => fetch(url).then((res) => res.json());

  const { data: swrData, error, isLoading } = useSWR('/dealer/accessories/products/search/all', swrFetcher)
  useEffect(() => {
    if (scannedCode) {
      try {
        console.log(swrData, 'result');
        if (!Array.isArray(swrData)) {
          console.error('Products is not an array or is undefined', swrData);
          return;
        }

        const result = swrData.filter((product) =>
          product.id?.toLowerCase().includes(scannedCode.toLowerCase())
        );
        console.log(result, 'filtered result');

        if (result.length > 0) {
          let q = scannedCode
          q = q.toLowerCase();
          const searchResult = swrData.filter(
            (result) =>
              result.id?.toLowerCase().includes(q)
          );
          setOrder(searchResult)


        }
      } catch (err) {
        console.error('error', err);
      }
    }

  }, [scannedCode]);

  return (
    <div className='grid grid-cols-1 mx-auto'>
      <Card x-chunk="dashboard-05-chunk-2" className=" m-4 max-w-lg mx-auto " >
        <CardHeader className="pb-3">
          <CardTitle className=''>
            Order Scanner
          </CardTitle>
          <CardDescription className="max-w-lg text-balance leading-relaxed w-[100%] items-center">
            <div className="relative flex-1 md:grow-0   ">
              <main className="wrapper text-white mx-auto " >
                <section className="container" id="demo-content">
                  <div className='flex items-center'>

                    <div className='flex flex-col items-center  mx-auto' >
                      <div className='rounded-[5px] border border-border relative group' style={{ padding: 0, width: '150px', maxHeight: '100px', overflow: 'hidden', border: ' ' }}>
                        <video id="videoOrder" style={{ width: '150px' }}></video>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 gap-1 text-sm  bg-primary absolute left-2.5 top-2.5  opacity-0 transition-opacity group-hover:opacity-100 "
                          id="startButtonOrder"
                        >
                          <Scan className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only text-foreground">Scan</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 gap-1 text-sm   absolute right-2.5 top-2.5  opacity-0 transition-opacity group-hover:opacity-100 "
                          id="resetButtonOrder"
                        >
                          <Scan className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only text-foreground">Reset</span>
                        </Button>
                        <div id="sourceSelectPanelOrder" style={{ display: 'none' }}>
                          <select id="sourceSelectOrder" className='b-rounded-[5px] px-3 py-1 bg-background text-foreground border-border border   opacity-0 transition-opacity group-hover:opacity-100 ' style={{ maxWidth: '150px' }}></select>
                        </div>
                      </div>
                      <div style={{ display: 'none' }}>

                        <input className='text-background bg-background border-background' type="file" id="imageUploadButton" accept="image/*" style={{ display: 'inline-block', }} />
                        <label className='text-background' htmlFor="sourceSelect">Change video source:</label>
                        <label className='text-background' >Result:</label>
                        <pre><code className='text-background' id="result"></code></pre>

                      </div>
                      <addProduct.Form method="post" ref={formRef} className='mx-auto mt-4'>
                        <div className="relative ml-auto flex-1 md:grow-0">
                          <input
                            name='intent'
                            defaultValue='updateOrder'
                            type='hidden'
                          />
                          <Input
                            name="accessoryId"
                            defaultValue={scannedCode}
                            type='hidden'
                            onChange={() => {
                              setOrder(null)
                              let products;
                              products = addProduct.load('/dealer/accessories/products/search/all')
                              console.log(products, 'products')
                              let result;
                              result = products.filter(
                                (result) =>
                                  result.id?.toLowerCase().includes(scannedCode)
                              );
                            }}
                            placeholder="Search..."
                            className="w-full rounded-lg bg-background pl-8 max-w-[400px]"
                          />
                        </div>
                      </addProduct.Form>
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mx-auto justify-center'>
            <search.Form method="get" action='/dealer/accessories/products/search/ic' className='mx-auto w-[100%]'>
              <div className="relative flex-1 md:grow-0 mx-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={ref}
                  type="search"
                  name="q"
                  autoFocus
                  defaultValue={scannedCode}
                  onChange={e => {
                    setOrder(null)

                    //   search.submit(`/dealer/accessories/search?name=${e.target.value}`);
                    search.submit(e.currentTarget.form);
                  }}
                  placeholder="Search..."
                  className="w-[250px] rounded-lg bg-background pl-8 max-w-[250px]"
                />
              </div>
            </search.Form>
          </div>
        </CardContent>
      </Card>
      <Card x-chunk="dashboard-05-chunk-2" className="m-4" >
        <CardHeader className="pb-3">
          <CardTitle className=''>
            Search Parts
          </CardTitle>
          <CardDescription className="leading-relaxed w-[100%] mx-auto mt-5 items-center">
            <Table>
              <TableHeader>
                <TableRow className='border-border'>
                  <TableHead>
                    Brand & Name
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Sub Category
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    On Order
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Distributer
                  </TableHead>
                  <TableHead className="">
                    Location
                  </TableHead>
                  <TableHead className="">
                    Price
                  </TableHead>
                  <TableHead className="">
                    In Stock Quantity
                  </TableHead>


                </TableRow>
              </TableHeader>
              <TableBody>
                {order ? (
                  <>
                    {order &&
                      order.map((result, index) => (
                        <TableRow key={index} className="hover:bg-accent border-border">
                          <TableCell>
                            <div>
                              {result.name}
                            </div>
                            <div className='text-muted-foreground'>
                              {result.brand}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {result.description}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {result.category}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {result.subCategory}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {result.onOrder}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {result.distributer}
                          </TableCell>
                          <TableCell className="">
                            {result.location}
                          </TableCell>
                          <TableCell className="">
                            {result.price}
                          </TableCell>
                          <TableCell className="">
                            <EditableText
                              value={result.quantity}
                              fieldName="name"
                              inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[30px] "
                              buttonClassName="text-right py-1 px-2 text-foreground"
                              buttonLabel={`Edit quantity`}
                              inputLabel={`Edit quantity`}
                            >
                              <input type="hidden" name="intent" value='updateProduct' />
                              <input type="hidden" name="id" value={result.id} />
                              <input type="hidden" name="colName" value='quantity' />
                            </EditableText>
                          </TableCell>
                          <TableCell>

                          </TableCell>
                        </TableRow>
                      ))}
                  </>) : (<>
                    {search.data &&
                      search.data.map((result, index) => (
                        <TableRow key={index} className="hover:bg-accent border-border">
                          <TableCell>
                            <div>
                              {result.name}
                            </div>
                            <div className='text-muted-foreground'>
                              {result.brand}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {result.description}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {result.category}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {result.subCategory}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {result.onOrder}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {result.distributer}
                          </TableCell>
                          <TableCell className="">
                            {result.location}
                          </TableCell>
                          <TableCell className="">
                            {result.price}
                          </TableCell>
                          <TableCell className="">
                            <EditableText
                              value={result.quantity}
                              fieldName="name"
                              inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[30px] "
                              buttonClassName="text-right py-1 px-2 text-foreground"
                              buttonLabel={`Edit quantity`}
                              inputLabel={`Edit quantity`}
                            >
                              <input type="hidden" name="intent" value='updateProduct' />
                              <input type="hidden" name="id" value={result.id} />
                              <input type="hidden" name="colName" value='quantity' />
                            </EditableText>
                          </TableCell>
                          <TableCell>

                          </TableCell>
                        </TableRow>
                      ))}
                  </>)}
              </TableBody>
            </Table>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
