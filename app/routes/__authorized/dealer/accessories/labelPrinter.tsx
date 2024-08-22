
import React, { useEffect, useState, useRef } from "react";
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
  Percent,
  PanelTop,
  Scan,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "~/components/ui/pagination";
import { Progress } from "~/components/ui/progress";
import { Separator } from "~/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Outlet, Link, useLoaderData, useFetcher } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { GetUser } from "~/utils/loader.server";
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import { Printer } from "lucide-react";
import { DollarSign } from "lucide-react";
import { toast } from "sonner";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { cn } from "~/utils";
import { BanknoteIcon } from "lucide-react";
import { ArrowDownUp } from "lucide-react";
import { ClientOnly } from "remix-utils";
import PrintLabels from "../document/printLabels.client";
import useSWR from 'swr'
import ScanSound from '~/images/scan.mp4'
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType, NotFoundException, ChecksumException, FormatException } from '@zxing/library';

export function playScanSound() {
  const audio = new Audio(ScanSound);
  audio.play();
}

export default function LabelMaker() {
  const [scannedCode, setScannedCode] = useState('')
  let products = useFetcher();
  let search = useFetcher();
  let addProduct = useFetcher();
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

        document.getElementById('resetButton').addEventListener('click', () => {
          document.getElementById('result').textContent = '';
          codeReader.reset();
          setScannedCode('')
          console.log('Reset.');
        });

        let listener = (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "s") {
            //    event.preventDefault();
            codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints).then((result) => {
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
  useEffect(() => {
    if (scannedCode) {
      const formData = new FormData();
      formData.append("q", scannedCode);
      search.submit(formData, { method: "get", action: '/dealer/accessories/products/search/id' });
    }
  }, [scannedCode]);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, quantity) => {
    setQuantities(prev => ({ ...prev, [id]: quantity }));
  };

  const handleAddToOrder = (product) => {
    const quantity = quantities[product.id] || 1;

    const newProducts = Array.from({ length: quantity }, (_, index) => {
      return {
        name: product.name,
        price: product.price,
        location: product.location,
        id: product.id,
      };
    });

    setSelectedProducts(prev => {
      const updatedProducts = [...prev];
      newProducts.forEach(newProduct => {
        if (updatedProducts.length === 0 || Object.keys(updatedProducts[updatedProducts.length - 1]).length / 3 >= 30) {
          updatedProducts.push({});
        }
        const currentPage = updatedProducts.length - 1;
        const baseIndex = Object.keys(updatedProducts[currentPage]).length / 3 + 1;
        updatedProducts[currentPage][`free${baseIndex}1`] = newProduct.name
        updatedProducts[currentPage][`free${baseIndex}2`] = `${newProduct.location} - $${newProduct.price}`//newProduct.location;
        updatedProducts[currentPage][`code128${baseIndex}`] = newProduct.id;
      });
      return updatedProducts;
    });
  };

  const test = [
    {
      free11: "Accessory 1 100",
      free12: "Location 1",
      code1281: "clz7zeobm00vuuolkmddrpbf3",
      free21: "Accessory 2 200",
      free22: "Location 2",
      code1282: "clz7zeobr00vvuolkgtz7dew1",
      free31: "Accessory 2 200",
      free32: "Location 2",
      code1283: "clz7zeobr00vvuolkgtz7dew1",
    }
  ]

  const options2 = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };


  // Function to aggregate products for display
  const aggregateProducts = (products) => {
    const productMap = {};

    products.forEach(page => {
      for (let i = 1; i <= Object.keys(page).length / 3; i++) {
        const namePriceKey = `free${i}1`;
        const locationKey = `free${i}2`;
        const idKey = `code128${i}`;

        if (page[idKey]) {
          const id = page[idKey];
          if (!productMap[id]) {
            productMap[id] = {
              namePrice: page[namePriceKey],
              location: page[locationKey],
              id,
              count: 0
            };
          }
          productMap[id].count += 1;
        }
      }
    });

    return Object.values(productMap);
  };

  // Displaying aggregated products
  const aggregatedProducts = aggregateProducts(selectedProducts);

  console.log(aggregatedProducts, selectedProducts, 'checking')
  return (
    <Tabs defaultValue="Labels" className='m-8'>
      <TabsList>
        <TabsTrigger value="Labels">Labels</TabsTrigger>
        <TabsTrigger value="Label Maker">Label Maker</TabsTrigger>
      </TabsList>
      <TabsContent value="Labels">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Labels</CardTitle>
                <CardDescription>
                  <div className='flex justify-between '>
                    <products.Form method="get" action='/dealer/accessories/products/search' className='mt-auto'>
                      <div className="relative mt-auto ml-auto flex-1 md:grow-0 ">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          ref={ref}
                          type="search"
                          name="q"
                          autoFocus
                          onChange={e => {
                            //   search.submit(`/dealer/accessories/search?name=${e.target.value}`);
                            products.submit(e.currentTarget.form);
                          }}
                          placeholder="Search..."
                          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px] mb-2"
                        />
                      </div>
                    </products.Form>
                    <div className='flex mb-2' >
                      <main className="wrapper text-white mx-auto " >
                        <section className="container" id="demo-content">
                          <div className='flex items-center'>

                            <div className='flex flex-col items-center  mx-auto' >
                              <div className='rounded-[5px] border border-border relative group' style={{ padding: 0, width: '150px', maxHeight: '100px', overflow: 'hidden', border: ' ' }}>
                                <video id="video" style={{ width: '150px' }}></video>
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
                                  <select id="sourceSelect" className='b-rounded-[5px] px-3 py-1 bg-background text-foreground border-border border   opacity-0 transition-opacity group-hover:opacity-100 ' style={{ maxWidth: '150px' }}></select>
                                </div>
                              </div>
                              <div style={{ display: 'none' }}>
                                <div style={{ padding: 0, width: '100px', maxHeight: '100px', overflow: 'hidden', border: '1px solid gray' }}>
                                  <video id="video" style={{ width: '100px' }}></video>
                                </div>
                                <input className='text-background bg-background border-background' type="file" id="imageUploadButton" accept="image/*" style={{ display: 'inline-block', }} />
                                <label className='text-background' htmlFor="sourceSelect">Change video source:</label>
                                <label className='text-background' >Result:</label>
                                <pre><code className='text-background' id="result"></code></pre>
                                <addProduct.Form method="post" ref={formRef} className='mr-auto'>
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
                          </div>
                        </section>
                      </main>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className='max-h-[600px] h-auto overflow-y-auto'>
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow className='border-border'>
                        <TableHead>
                          Name & Price
                        </TableHead>
                        <TableHead className="">
                          Location
                        </TableHead>
                        <TableHead className="">
                          ID
                        </TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="">
                          Add To Order
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.data &&
                        products.data.map((result, index) => (
                          <TableRow key={index} className="hover:bg-accent border-border">
                            <TableCell>
                              <div>
                                {result.name}
                              </div>
                              <div className='text-muted-foreground'>
                                ${result.price}
                              </div>
                            </TableCell>
                            <TableCell className="">
                              {result.location}
                            </TableCell>
                            <TableCell className="">
                              {result.id}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                className='w-[50px]'
                                value={quantities[result.id] || 1}
                                onChange={(e) => handleQuantityChange(result.id, parseInt(e.target.value))}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="bg-primary"
                                    onClick={() => handleAddToOrder(result)}
                                  >
                                    <Plus className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  Add To Labels
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Labels To Be Printed
                  </CardTitle>
                  <CardDescription>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm max-h-[665px] h-auto overflow-y-auto">
                <div className="grid gap-3">
                  <div className="font-semibold">Order Details</div>
                  <ul className="grid gap-3 max-h-[300px] h-auto overflow-y-auto">
                    {aggregatedProducts && aggregatedProducts.map((result, index) => (
                      <li
                        className="flex items-center justify-between"
                        key={index}
                      >
                        <div>
                          <div>
                            {result.namePrice}
                          </div>

                        </div>
                        <div>
                          <div className='text-right'>
                            {result.location} x {result.count}
                          </div>
                          <div className='text-right text-muted-foreground'>
                            {result.id}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                </div>

              </CardContent>
              <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Current Time{" "}
                  <time dateTime="2023-11-23">
                    {new Date().toLocaleDateString(
                      "en-US",
                      options2
                    )}
                  </time>
                </div>
              </CardFooter>
            </Card>
          </div >
        </main >
      </TabsContent>
      <TabsContent value="Label Maker">
        <Card x-chunk="dashboard-05-chunk-3">
          <CardHeader className="px-7">
            <CardTitle>Print Labels</CardTitle>
            <CardDescription>

            </CardDescription>
          </CardHeader>
          <CardContent className='max-h-[600px] h-auto overflow-y-auto'>
            <ClientOnly fallback={<SimplerStaticVersion />} >
              {() => (
                <PrintLabels inputs={selectedProducts} />
              )}
            </ClientOnly>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function SimplerStaticVersion() {
  return (
    <p>Not working contact support...</p>
  )
}
