import React, { useState, useReducer, useEffect, forwardRef, useRef, } from 'react'
import { flushSync } from "react-dom";
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
import { Outlet, Link, useLoaderData, useFetcher, Form, useSubmit } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { GetUser } from "~/utils/loader.server";
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import { Printer } from "lucide-react";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { ScanQrCode } from "iconoir-react";
import { BiBarcode } from "react-icons/bi";
import { BanknoteIcon } from "lucide-react";
import { toast } from "sonner";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType, NotFoundException, ChecksumException, FormatException } from '@zxing/library';
import ScanSound from '~/images/scan.mp4'
import { EditableText, options2 } from "~/components/shared/shared";
import { Percent } from "lucide-react";
import { ArrowDownUp } from 'lucide-react';
import { cn } from '~/utils';
import useSWR from 'swr'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export function playScanSound() {
  const audio = new Audio(ScanSound);
  audio.play();
}

export default function Purchase({ user, order, tax, }) {


  const [paymentType, setPaymentType] = useState('');
  const [input, setInput] = useState("");
  const inputLength = input.trim().length
  let ref = useRef();
  let payment = useFetcher();
  let formRef = useRef();
  let addProduct = useFetcher();
  let inputRef = useRef<HTMLInputElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);
  let search = useFetcher();
  let fetcher = useFetcher();
  const submit = useSubmit()

  const lastOrder = order[0];
  const taxMultiplier = Number(tax.userTax);
  const taxRate = 1 + taxMultiplier / 100;

  const totalAccessoriesCost = order.AccessoriesOnOrders.reduce((total, accessoryOnOrder) => {
    return total + (accessoryOnOrder.quantity * accessoryOnOrder.accessory.price);
  }, 0);

  const totalAmountPaid = order.Payments.reduce((total, payment) => {
    return total + payment.amountPaid;
  }, 0);



  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const [hidden, setHidden] = useState(false)
  const hasAdminPosition = user.positions.some(position => position.position === 'Administrator' || position.position === 'Manager');

  const [scannedCode, setScannedCode] = useState('')
  const [discount, setDiscount] = useState(false)
  const [custInfo, setCustInfo] = useState(false)
  const [newScan, setNewScan] = useState(false)

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
          setNewScan(false)
          console.log('Reset.');
        });

        let listener = (event) => {
          // if ((event.metaKey || event.ctrlKey) && event.key === "s") {
          if (event.key === 'F1') {
            event.preventDefault();
            codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints).then((result) => {
              console.log(result);
              /// document.getElementById('result').textContent = result.text;
              setScannedCode(result.text)
            }).catch((err) => {
              setNewScan(false)
              console.error(err);
              //  document.getElementById('result').textContent = err;
            });
          }
          // if ((event.metaKey || event.ctrlKey) && event.key === "r") {
          if (event.key === 'F2') {
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

  const { data, error, isLoading } = useSWR('/dealer/accessories/products/search/all', swrFetcher)
  useEffect(() => {
    if (scannedCode) {
      try {
        console.log(data, 'result');
        if (!Array.isArray(data)) {
          console.error('Products is not an array or is undefined', data);
          return;
        }

        const result = data.filter((product) =>
          product.id?.toLowerCase().includes(scannedCode.toLowerCase())
        );
        console.log(result, 'filtered result');

        if (result.length > 0) {
          const formData = new FormData();
          formData.append("orderId", order.id);
          formData.append("accId", result[0].id);
          formData.append("intent", 'updateOrder');
          console.log(formData, 'formData');

          addProduct.submit(formData, { method: "post" });
        }
      } catch (err) {
        console.error('error', err);
      }
    }

  }, [scannedCode]);

  const [discDollar, setDiscDollar] = useState(0.00)
  const [discPer, setDiscPer] = useState(0.00)
  useEffect(() => {
    console.log('useEffect triggered');
    console.log('order.discount:', order.discount);
    if (order.discount) {
      console.log('Setting discount:', order.discount);
      setDiscDollar(order.discount);
    } else {
      console.log('Discount is 0 or less');
    }
  }, [order.discount]);

  useEffect(() => {

    if (order.discPer > 0.00) {
      setDiscPer(order.discPer)
    }
  }, []);

  const total2 = ((totalAccessoriesCost - parseFloat(discDollar)) * taxRate).toFixed(2)
  const total1 = (((totalAccessoriesCost * (100 - parseFloat(discPer))) / 100) * taxRate).toFixed(2)
  const total = discPer === 0 ? total2 : total1
  const [changeSize, setChangeSize] = useState(false)

  // md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4
  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 grid-cols-1 md:col-span-2">
            <div className='grid grid-cols-1 md:flex  items-center'>
              <Card x-chunk="dashboard-05-chunk-1" className="h-full grow mb-8 md:mb-0 md:mr-8">
                <CardHeader className="pb-3">
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Orders Dashboard for Seamless
                    Management and Insightful Analysis.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/dealer/accessories/search">
                    <Button>Create New Order</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2" className="" >
                <CardHeader className="pb-3">
                  <CardTitle className=''>
                    Scanner
                  </CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed w-[100%] mx-auto">
                    <div className="relative flex-1 md:grow-0   ">
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

                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
            <Card
              x-chunk="dashboard-05-chunk-3"
              onClick={() => setChangeSize(false)}
              className={cn('h-auto', changeSize === true ? "max-h-[200px]" : "max-h-[475px]", "")}>
              <CardHeader className="px-7">
                <CardTitle className='flex items-center'>
                  <p>
                    Search Parts
                  </p>
                  <search.Form method="get" action='/dealer/accessories/products/search' className='mx-auto w-[100%]'>
                    <div className="relative ml-auto flex-1 md:grow-0 ">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={ref}
                        type="search"
                        name="q"
                        autoFocus
                        onChange={e => {
                          //   search.submit(`/dealer/accessories/search?name=${e.target.value}`);
                          search.submit(e.currentTarget.form);
                        }}
                        placeholder="Search..."
                        className="w-auto rounded-lg bg-background pl-8 max-w-[350px]"
                      />
                    </div>
                  </search.Form></CardTitle>
              </CardHeader>
              <CardContent className={cn('h-auto overflow-y-auto ', changeSize === true ? "max-h-[115px]" : "max-h-[400px]", "")}             >
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

                      {hidden &&
                        <TableHead className="hidden md:table-cell">
                          Cost
                        </TableHead>}
                      <TableHead className="">
                        Price
                      </TableHead>
                      <TableHead className="">
                        In Stock Quantity
                      </TableHead>
                      <TableHead className="">
                        Add To Order
                      </TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
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
                          {hidden &&
                            <TableCell className="hidden md:table-cell">
                              {result.cost}
                            </TableCell>}
                          <TableCell className="">
                            {result.price}
                          </TableCell>
                          <TableCell className="">
                            {result.quantity}
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <fetcher.Form method='post' preventScrollReset >
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="bg-primary"
                                    name='intent'
                                    value='updateOrder'

                                  >
                                    <Plus className="h-5 w-5" />
                                  </Button>
                                  <input type='hidden' name='accId' value={result.id} />
                                  <input type='hidden' name='orderId' value={order.id} />
                                </fetcher.Form>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                Add To Order
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card
            x-chunk="dashboard-05-chunk-3"
            onClick={() => setChangeSize(true)}
            className={cn(' md:col-span-2  h-auto', changeSize === true ? "max-h-[475px]" : "max-h-[200px]", "")} >
            <CardHeader className="px-7">
              <CardTitle>New Order</CardTitle>
              <CardDescription>
                <div className='flex justify-between items-center'>
                  <p>
                    Starting a new order for...
                  </p>
                  <div className='flex items-center' >
                    <div className="font-medium mr-3">
                      {order.Clientfile.name}
                    </div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.Clientfile.email}
                    </div>
                  </div>

                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className={cn('h-auto overflow-y-auto ', changeSize === true ? "max-h-[400px]" : "max-h-[115px]", "")}            >
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
                    <TableHead className="hidden sm:table-cell">
                      Location
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      In Stock
                    </TableHead>
                    {hidden &&
                      <TableHead className="hidden md:table-cell">
                        Cost
                      </TableHead>}
                    <TableHead className="hidden sm:table-cell">
                      Price
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Quantity
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Order #
                    </TableHead>
                    <TableHead className="">
                      Delete
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody >
                  {order &&
                    order.AccessoriesOnOrders.map((result, index) => (
                      <TableRow key={index} className="border-border rounded-[6px] hover:bg-accent" >
                        <TableCell>
                          <div>
                            {result.accessory.name}
                          </div>
                          <div className='text-muted-foreground'>
                            {result.accessory.brand}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.accessory.description}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.accessory.category}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.accessory.subCategory}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {result.accessory.onOrder}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.accessory.distributer}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {result.accessory.location}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {result.accessory.quantity}
                        </TableCell>
                        {hidden &&
                          <TableCell className="hidden md:table-cell">
                            {result.accessory.cost}
                          </TableCell>}
                        <TableCell className="hidden sm:table-cell">
                          {result.accessory.price}
                        </TableCell>
                        <TableCell className=" ">
                          <EditableText
                            value={result.quantity}
                            fieldName="quantity"
                            inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[50px] "
                            buttonClassName="text-center py-1 px-2 text-foreground"
                            buttonLabel={`Edit quantity`}
                            inputLabel={`Edit quantity`}
                          >
                            <input type="hidden" name="intent" value='updateOrderQuantity' />
                            <input type='hidden' name='total' value={total} />
                            <input type='hidden' name='accOrderId' value={order.id} />

                            <input type="hidden" name="id" value={result.id} />
                          </EditableText>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Select onValueChange={(value) => {
                            const formData = new FormData();
                            formData.append("colName", 'status');
                            formData.append("name", value);
                            formData.append("total", total);
                            formData.append("accOrderId", order.id);
                            formData.append("id", result.id);
                            formData.append("intent", 'updateOrderQuantity');
                            search.submit(formData, { method: "post", });
                          }} >
                            <SelectTrigger className="w-[125px]">
                              <SelectValue defaultValue={result.status} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                              <SelectItem value="In Stock">In Stock</SelectItem>
                              <SelectItem value="On Order">On Order</SelectItem>
                              <SelectItem value="To Be Ordered">To Be Ordered</SelectItem>
                              <SelectItem value="Back Order">Back Order</SelectItem>
                              <SelectItem value="EOL">EOL</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {result.status === 'On Order' && (
                            <EditableText
                              value={result.orderNumber}
                              fieldName="orderNumber"
                              inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[50px] "
                              buttonClassName="text-center py-1 px-2 text-foreground"
                              buttonLabel={`Edit orderNumber`}
                              inputLabel={`Edit orderNumber`}
                            >
                              <input type="hidden" name="intent" value='updateOrderOrderNumber' />
                              <input type='hidden' name='total' value={total} />
                              <input type='hidden' name='accOrderId' value={order.id} />

                              <input type="hidden" name="id" value={result.id} />
                            </EditableText>
                          )}
                        </TableCell>
                        <TableCell className=" ">
                          <addProduct.Form method="post" ref={formRef} className='mr-auto'>
                            <input type="hidden" name="id" value={result.id} />
                            <input type='hidden' name='total' value={total} />
                            <input type='hidden' name='accOrderId' value={order.id} />
                            <Button
                              size="icon"
                              variant="outline"
                              name="intent" value='deleteOrderItem'
                              className=" mr-2 bg-primary"
                              type='submit'
                            >
                              <X className="h-4 w-4 text-foreground" />
                            </Button>
                          </addProduct.Form>

                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Current Order: {order.id}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Date:{" "}
                  {new Date(order.createdAt).toLocaleDateString(
                    "en-US",
                    options2
                  )}
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <MoreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="border border-border"
                  >
                    <DropdownMenuItem onSelect={() => setDiscount((prevDiscount) => !prevDiscount)}>Show Discount</DropdownMenuItem>
                    <DropdownMenuItem>Reprint Receipt</DropdownMenuItem>
                    <DropdownMenuItem>Go To Cash</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Trash</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm max-h-[665px] h-auto overflow-y-auto">
              <div className="grid gap-3">
                <div className="font-semibold">Order Details</div>
                <ul className="grid gap-3 max-h-[300px] h-auto overflow-y-auto">
                  {order.AccessoriesOnOrders && order.AccessoriesOnOrders.map((result, index) => (
                    <li
                      className="flex items-center justify-between"
                      key={index}
                    >
                      <div>
                        <div className="font-medium">
                          {result.accessory.brand}{" "}
                          {result.accessory.name}
                        </div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {result.accessory.category}{" "}
                        </div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {result.accessory.description}
                        </div>
                      </div>
                      <span>${result.accessory.price}{" "}{" "}x{" "}{" "}{result.quantity}</span>
                    </li>
                  ))}
                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalAccessoriesCost.toFixed(2)}</span>
                  </li>
                  {discount && (
                    <>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Discount $</span>
                        <fetcher.Form
                          method="post"
                          onSubmit={() => {
                            buttonRef.current?.focus();
                          }}
                          preventScrollReset
                        >
                          <input
                            name='accOrderId'
                            defaultValue={order.id}
                            type='hidden'
                          />
                          <input
                            name='intent'
                            defaultValue='updateDiscount'
                            type='hidden'
                          />
                          <input
                            name='total'
                            defaultValue={totalAccessoriesCost}
                            type='hidden'
                          />
                          <div className="relative ml-auto flex-1 md:grow-0 ">
                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground" />
                            <Input
                              ref={inputRef}
                              name='discDollar'
                              className='text-right pr-10 w-[100px]'
                              defaultValue={discDollar}
                              onChange={(event) => setDiscDollar(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Escape") {
                                  buttonRef.current?.focus();
                                }
                              }}
                              onBlur={(event) => {
                                if (
                                  inputRef.current?.value !== discDollar &&
                                  inputRef.current?.value.trim() !== ""
                                ) {
                                  fetcher.submit(event.currentTarget);
                                }
                              }}
                            />
                            <Button
                              type="submit"
                              size="icon"

                              disabled={!discDollar}
                              className='bg-primary mr-2 absolute right-1.5 top-2.5 h-4 w-4 text-foreground '>
                              <PaperPlaneIcon className="h-4 w-4" />
                              <span className="sr-only">Cash</span>
                            </Button>
                          </div>
                        </fetcher.Form>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Discount %</span>
                        <fetcher.Form
                          method="post"
                          onSubmit={() => {
                            buttonRef.current?.focus();
                          }}
                          preventScrollReset
                        >
                          <input
                            name='accOrderId'
                            defaultValue={order.id}
                            type='hidden'
                          />
                          <input
                            name='intent'
                            defaultValue='updateDiscPerc'
                            type='hidden'
                          />
                          <input
                            name='total'
                            defaultValue={totalAccessoriesCost}
                            type='hidden'
                          />
                          <div className="relative ml-auto flex-1 md:grow-0 ">
                            <Input
                              ref={inputRef}
                              name='discPer'
                              className='text-right pr-[43px] w-[100px]'
                              value={discPer}
                              onChange={(event) => setDiscPer(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Escape") {
                                  buttonRef.current?.focus();
                                }
                              }}
                              onBlur={(event) => {
                                if (
                                  inputRef.current?.value !== discPer &&
                                  inputRef.current?.value.trim() !== ""
                                ) {
                                  fetcher.submit(event.currentTarget);
                                }
                              }}
                            />
                            <Percent className="absolute right-10 top-[8px] h-4 w-4 text-foreground" />
                            <Button
                              type="submit"
                              size="icon"

                              disabled={!discPer}
                              className='bg-primary mr-2 absolute right-1.5 top-[8px] h-4 w-4 text-foreground '>
                              <PaperPlaneIcon className="h-4 w-4" />
                              <span className="sr-only">Cash</span>
                            </Button>
                          </div>
                        </fetcher.Form>

                      </li>
                    </>
                  )}
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{tax.userTax}%</span>
                  </li>
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>${total}</span>
                  </li>
                </ul>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold flex justify-between">
                  <p>
                    Customer Information
                  </p>
                  <Button
                    size="icon"
                    variant="outline"
                    className=" mr-2 bg-primary"
                    onClick={() => setCustInfo((prevCustInfo) => !prevCustInfo)}
                  >
                    <ArrowDownUp className="h-4 w-4 text-foreground" />
                  </Button>
                </div>
                {custInfo && (<>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Customer</dt>
                      <dd>
                        {order.Clientfile.firstName}{" "}
                        {order.Clientfile.lastName}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>
                        <a href="mailto:">{order.Clientfile.email}</a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>
                        <a href="tel:">{order.Clientfile.phone}</a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Address</dt>
                      <dd>
                        <p>{order.Clientfile.address}</p>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">City, Province</dt>
                      <dd>
                        <p>{order.Clientfile.city}, {order.Clientfile.province}</p>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Postal Code</dt>
                      <dd>
                        <p>{order.Clientfile.postal}</p>
                      </dd>
                    </div>
                  </dl>
                </>)}

              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Payment Information</div>
                <dl className="grid gap-3">
                  {order.paymentType ? (
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        {order.paymentType}
                      </dt>
                      {order.cardNum}
                    </div>
                  ) : (
                    <div className="flex flex-col" >
                      <div className='flex items-center justify-center text-foreground'>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn('mr-2 bg-primary', paymentType === 'Visa' ? "bg-secondary" : "", "")}
                          onClick={() => setPaymentType('Visa')}
                        >
                          <CreditCard className="h-4 w-4 text-foreground" />
                          <p className="">Visa</p>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn('mr-2 bg-primary', paymentType === 'Mastercard' ? "bg-secondary" : "", "")}
                          onClick={() => setPaymentType('Mastercard')}
                        >
                          <CreditCard className="h-4 w-4 text-foreground" />
                          <p className="">Mastercard</p>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPaymentType('Debit')}
                          className={cn(' bg-primary', paymentType === 'Debit' ? "bg-secondary" : "", "")}
                        >
                          <CreditCard className="h-4 w-4 text-foreground" />
                          <p className="">Debit</p>
                        </Button>
                      </div>
                      <div className='flex items-center justify-center text-foreground mt-2'>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn('mr-2 bg-primary', paymentType === 'Cash' ? "bg-secondary" : "", "")}
                          onClick={() => setPaymentType('Cash')}
                        >
                          <BanknoteIcon className="h-4 w-4 text-foreground" />
                          <p className="">Cash</p>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(' bg-primary', paymentType === 'Online Transaction' ? "bg-secondary" : "", "")}
                          onClick={() => setPaymentType('Online Transaction')}
                        >
                          <PanelTop className="h-4 w-4 text-foreground" />
                          <p className="">Online Transaction</p>
                        </Button>
                      </div>
                    </div>
                  )}
                </dl>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Payment</div>
                <ul className="grid gap-3">
                  {order.Payments && order.Payments.map((result, index) => (
                    <li className="flex items-center justify-between" key={index}                    >
                      <span className="text-muted-foreground">{result.paymentType}</span>
                      <span>${result.amountPaid}</span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Balance</span>
                    <span>${parseFloat(total) - parseFloat(totalAmountPaid)}</span>

                  </li>
                  {paymentType !== '' && (
                    <>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Amount to be charged on {paymentType}</span>
                        <payment.Form method="post" ref={formRef} >
                          <input type='hidden' name='accOrderId' value={order.id} />
                          <input type='hidden' name='paymentType' value={paymentType} />
                          <input type='hidden' name='intent' value='createPayment' />
                          <input type='hidden' name='total' value={total} />
                          <div className="relative ml-auto flex-1 md:grow-0 ">
                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              name='amountPaid'
                              className='text-right pr-9'
                              value={input}
                              onChange={(event) => setInput(event.target.value)}
                            />
                            <Button
                              type="submit"
                              size="icon"
                              onClick={() => {
                                toast.success(`Payment rendered!`)
                              }}
                              disabled={inputLength === 0}
                              className='bg-primary mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>
                              <PaperPlaneIcon className="h-4 w-4" />
                              <span className="sr-only">Cash</span>
                            </Button>
                          </div>
                        </payment.Form>
                      </li>
                    </>
                  )}

                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Updated{" "}
                <time dateTime="2023-11-23">
                  {new Date(order.createdAt).toLocaleDateString(
                    "en-US",
                    options2
                  )}
                </time>
              </div>
            </CardFooter>
          </Card>
        </div >
      </main >
    </div >
  );
}






/**


* import React, { useState, useReducer, useEffect, forwardRef, useRef, } from 'react'
import { flushSync } from "react-dom";
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
import { Outlet, Link, useLoaderData, useFetcher, Form, useSubmit } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { GetUser } from "~/utils/loader.server";
import { getSession } from "~/sessions/auth-session.server";
import { prisma } from "~/libs";
import { Printer } from "lucide-react";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { ScanQrCode } from "iconoir-react";
import { BiBarcode } from "react-icons/bi";
import { BanknoteIcon } from "lucide-react";
import { toast } from "sonner";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType, NotFoundException, ChecksumException, FormatException } from '@zxing/library';
import ScanSound from '~/images/scan.mp4'
import { EditableText } from "~/components/actions/shared";
import { Percent } from "lucide-react";
import { ArrowDownUp } from 'lucide-react';
import { cn } from '~/utils';
import useSWR from 'swr'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email");

  const user = await GetUser(email);
  if (!user) {
    redirect("/login");
  }
  const id = params.orderId
  const order = await prisma.accOrder.findUnique({
    where: { id: id },
    select: {
      id: true,
      createdAt: true,
      userEmail: true,
      fulfilled: true,
      total: true,
      clientfileId: true,
      discount: true,
      discPer: true,
      Clientfile: {
        select: {
          id: true,
          financeId: true,
          firstName: true,
          lastName: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          postal: true,
          province: true,
          dl: true,
          typeOfContact: true,
          timeToContact: true,
          conversationId: true,
          billingAddress: true,
        },
      },
      AccessoriesOnOrders: {
        select: {
          id: true,
          quantity: true,
          accOrderId: true,
          accessoryId: true,
          accessory: {
            select: {
              accessoryNumber: true,
              brand: true,
              name: true,
              price: true,
              cost: true,
              quantity: true,
              description: true,
              category: true,
              subCategory: true,
              onOrder: true,
              distributer: true,
              location: true,
            },
          },
        },
      },
      Payments: {
        select: {
          id: true,
          paymentType: true,
          cardNum: true,
          amountPaid: true,
          receiptId: true,
          accOrderId: true,
        },
      },
    },
  });

  const tax = await prisma.dealer.findUnique({
    where: { id: 1 },
    select: { userTax: true },
  });


  return json({ order, user, tax, });
}
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
  //  <input type='hidden' name='total' value={total} />
  // <input type='hidden' name='accOrderId' value={order.id} />

  if (intent === 'updateOrder') {
    const update = await prisma.accessoriesOnOrders.update({
      where: { id: formPayload.id },
      data: {
        quantity: 1,
        accOrder: {
          connect: {
            id: formPayload.orderId,
          }
        },
        accessory: {
          connect: {
            id: formPayload.accId,
          }
        }
      }
    });

    console.log(update, 'update')
    return json({ update })
  }
  if (intent === 'createPayment') {
    const payment = await prisma.payment.create({
      data: {
        accOrderId: formPayload.accOrderId,
        paymentType: formPayload.paymentType,
        amountPaid: parseFloat(formPayload.amountPaid),
        cardNum: formPayload.cardNum,
        receiptId: formPayload.receiptId,
      },
    });
    await prisma.accOrder.update({
      where: { id: formPayload.accOrderId },
      data: {
        total: parseFloat(formPayload.total),
      },
    });
    return payment;
  }
  if (intent === 'updateOrderQuantity') {
    const payment = await prisma.accessoriesOnOrders.update({
      where: { id: formPayload.id },
      data: {
        quantity: Number(formPayload.quantity),

      },
    });
    await prisma.accOrder.update({
      where: { id: formPayload.accOrderId },
      data: {
        total: parseFloat(formPayload.total),
      },
    });
    return payment;
  }
  if (intent === 'updateDiscount') {
    const payment = await prisma.accOrder.update({
      where: { id: formPayload.accOrderId },
      data: {
        discount: parseFloat(formPayload.discDollar),
        total: parseFloat(formPayload.total),
      },
    });
    return payment;
  }
  if (intent === 'updateDiscPerc') {
    const payment = await prisma.accOrder.update({
      where: { id: formPayload.accOrderId },
      data: {
        discPer: parseFloat(formPayload.discPer),
        total: parseFloat(formPayload.total),
      },
    });
    return payment;
  }
  if (intent === 'deleteOrderItem') {
    const payment = await prisma.accessoriesOnOrders.delete({ where: { id: formPayload.id } });
    await prisma.accOrder.update({
      where: { id: formPayload.accOrderId },
      data: {
        total: parseFloat(formPayload.total),
      },
    });
    return payment;
  }


}

export default function Purchase() {
  const { user, order, tax, } = useLoaderData();

  const [paymentType, setPaymentType] = useState('');
  const [input, setInput] = useState("");
  const inputLength = input.trim().length
  let ref = useRef();
  let payment = useFetcher();
  let formRef = useRef();
  let addProduct = useFetcher();
  let inputRef = useRef<HTMLInputElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);
  let search = useFetcher();
  let fetcher = useFetcher();
  const submit = useSubmit()

  const lastOrder = order[0];
  const taxMultiplier = Number(tax.userTax);
  const taxRate = 1 + taxMultiplier / 100;

  const totalAccessoriesCost = order.AccessoriesOnOrders.reduce((total, accessoryOnOrder) => {
    return total + (accessoryOnOrder.quantity * accessoryOnOrder.accessory.price);
  }, 0);

  const totalAmountPaid = order.Payments.reduce((total, payment) => {
    return total + payment.amountPaid;
  }, 0);

  const options2 = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZoneName: "short"
};

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const [hidden, setHidden] = useState(false)
  const hasAdminPosition = user.positions.some(position => position.position === 'Administrator' || position.position === 'Manager');

  const [scannedCode, setScannedCode] = useState('')
  const [discount, setDiscount] = useState(false)
  const [custInfo, setCustInfo] = useState(false)
  const [newScan, setNewScan] = useState(false)

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
          setNewScan(false)
          console.log('Reset.');
        });

        let listener = (event) => {
          // if ((event.metaKey || event.ctrlKey) && event.key === "s") {
          if (event.key === 'F1') {
            event.preventDefault();
            codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints).then((result) => {
              console.log(result);
              /// document.getElementById('result').textContent = result.text;
              setScannedCode(result.text)
            }).catch((err) => {
              setNewScan(false)
              console.error(err);
              //  document.getElementById('result').textContent = err;
            });
          }
          // if ((event.metaKey || event.ctrlKey) && event.key === "r") {
          if (event.key === 'F2') {
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

  const { data, error, isLoading } = useSWR('/dealer/accessories/products/search/all', swrFetcher)
  useEffect(() => {
    if (scannedCode) {
      try {
        console.log(data, 'result');
        if (!Array.isArray(data)) {
          console.error('Products is not an array or is undefined', data);
          return;
        }

        const result = data.filter((product) =>
          product.id?.toLowerCase().includes(scannedCode.toLowerCase())
        );
        console.log(result, 'filtered result');

        if (result.length > 0) {
          const formData = new FormData();
          formData.append("orderId", order.id);
          formData.append("accId", result[0].id);
          formData.append("intent", 'updateOrder');
          console.log(formData, 'formData');

          addProduct.submit(formData, { method: "post" });
        }
      } catch (err) {
        console.error('error', err);
      }
    }

  }, [scannedCode]);

  const [discDollar, setDiscDollar] = useState(0.00)
  const [discPer, setDiscPer] = useState(0.00)
  useEffect(() => {
    console.log('useEffect triggered');
    console.log('order.discount:', order.discount);
    if (order.discount) {
      console.log('Setting discount:', order.discount);
      setDiscDollar(order.discount);
    } else {
      console.log('Discount is 0 or less');
    }
  }, [order.discount]);

  useEffect(() => {

    if (order.discPer > 0.00) {
      setDiscPer(order.discPer)
    }
  }, []);

  const total2 = ((totalAccessoriesCost - parseFloat(discDollar)) * taxRate).toFixed(2)
  const total1 = (((totalAccessoriesCost * (100 - parseFloat(discPer))) / 100) * taxRate).toFixed(2)
  const total = discPer === 0 ? total2 : total1
  const [changeSize, setChangeSize] = useState(false)

  // md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4
  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 grid-cols-1 md:col-span-2">
            <div className='grid grid-cols-1 md:flex  items-center'>
              <Card x-chunk="dashboard-05-chunk-1" className="h-full grow mb-8 md:mb-0 md:mr-8">
                <CardHeader className="pb-3">
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Orders Dashboard for Seamless
                    Management and Insightful Analysis.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/dealer/accessories/search">
                    <Button>Create New Order</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2" className="" >
                <CardHeader className="pb-3">
                  <CardTitle className=''>
                    Scanner
                  </CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed w-[100%] mx-auto">
                    <div className="relative flex-1 md:grow-0   ">
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

                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
            <Card
              x-chunk="dashboard-05-chunk-3"
              onClick={() => setChangeSize(false)}
              className={cn('h-auto', changeSize === true ? "max-h-[200px]" : "max-h-[475px]", "")}>
              <CardHeader className="px-7">
                <CardTitle className='flex items-center'>
                  <p>
                    Search Parts
                  </p>
                  <search.Form method="get" action='/dealer/accessories/products/search' className='mx-auto w-[100%]'>
                    <div className="relative ml-auto flex-1 md:grow-0 ">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={ref}
                        type="search"
                        name="q"
                        autoFocus
                        onChange={e => {
                          //   search.submit(`/dealer/accessories/search?name=${e.target.value}`);
                          search.submit(e.currentTarget.form);
                        }}
                        placeholder="Search..."
                        className="w-auto rounded-lg bg-background pl-8 max-w-[350px]"
                      />
                    </div>
                  </search.Form></CardTitle>
              </CardHeader>
              <CardContent className={cn('h-auto overflow-y-auto ', changeSize === true ? "max-h-[115px]" : "max-h-[400px]", "")}             >
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

                      {hidden &&
                        <TableHead className="hidden md:table-cell">
                          Cost
                        </TableHead>}
                      <TableHead className="">
                        Price
                      </TableHead>
                      <TableHead className="">
                        In Stock Quantity
                      </TableHead>
                      <TableHead className="">
                        Add To Order
                      </TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
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
                          {hidden &&
                            <TableCell className="hidden md:table-cell">
                              {result.cost}
                            </TableCell>}
                          <TableCell className="">
                            {result.price}
                          </TableCell>
                          <TableCell className="">
                            {result.quantity}
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <fetcher.Form method='post' preventScrollReset >
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="bg-primary"
                                    name='intent'
                                    value='updateOrder'

                                  >
                                    <Plus className="h-5 w-5" />
                                  </Button>
                                  <input type='hidden' name='accId' value={result.id} />
                                  <input type='hidden' name='orderId' value={order.id} />
                                </fetcher.Form>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                Add To Order
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card
            x-chunk="dashboard-05-chunk-3"
            onClick={() => setChangeSize(true)}
            className={cn(' md:col-span-2  h-auto', changeSize === true ? "max-h-[475px]" : "max-h-[200px]", "")} >
            <CardHeader className="px-7">
              <CardTitle>New Order</CardTitle>
              <CardDescription>
                <div className='flex justify-between items-center'>
                  <p>
                    Starting a new order for...
                  </p>
                  <div className='flex items-center' >
                    <div className="font-medium mr-3">
                      {order.Clientfile.name}
                    </div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.Clientfile.email}
                    </div>
                  </div>

                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className={cn('h-auto overflow-y-auto ', changeSize === true ? "max-h-[400px]" : "max-h-[115px]", "")}            >
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
                    <TableHead className="hidden sm:table-cell">
                      Location
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      In Stock
                    </TableHead>
                    {hidden &&
                      <TableHead className="hidden md:table-cell">
                        Cost
                      </TableHead>}
                    <TableHead className="hidden sm:table-cell">
                      Price
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Quantity
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Order #
                    </TableHead>
                    <TableHead className="">
                      Delete
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody >
                  {order &&
                    order.AccessoriesOnOrders.map((result, index) => (
                      <TableRow key={index} className="border-border rounded-[6px] hover:bg-accent" >
                        <TableCell>
                          <div>
                            {result.accessory.name}
                          </div>
                          <div className='text-muted-foreground'>
                            {result.accessory.brand}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.accessory.description}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.accessory.category}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.accessory.subCategory}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {result.accessory.onOrder}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {result.accessory.distributer}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {result.accessory.location}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {result.accessory.quantity}
                        </TableCell>
                        {hidden &&
                          <TableCell className="hidden md:table-cell">
                            {result.accessory.cost}
                          </TableCell>}
                        <TableCell className="hidden sm:table-cell">
                          {result.accessory.price}
                        </TableCell>
                        <TableCell className=" ">
                          <EditableText
                            value={result.quantity}
                            fieldName="quantity"
                            inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[50px] "
                            buttonClassName="text-center py-1 px-2 text-foreground"
                            buttonLabel={`Edit quantity`}
                            inputLabel={`Edit quantity`}
                          >
                            <input type="hidden" name="intent" value='updateOrderQuantity' />
                            <input type='hidden' name='total' value={total} />
                            <input type='hidden' name='accOrderId' value={order.id} />

                            <input type="hidden" name="id" value={result.id} />
                          </EditableText>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Select onValueChange={(value) => {
                            const formData = new FormData();
                            formData.append("colName", 'status');
                            formData.append("name", value);
                            formData.append("total", total);
                            formData.append("accOrderId", order.id);
                            formData.append("id", result.id);
                            formData.append("intent", 'updateOrderQuantity');
                            search.submit(formData, { method: "post", });
                          }} >
                            <SelectTrigger className="w-[125px]">
                              <SelectValue defaultValue={result.status} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                              <SelectItem value="In Stock">In Stock</SelectItem>
                              <SelectItem value="On Order">On Order</SelectItem>
                              <SelectItem value="To Be Ordered">To Be Ordered</SelectItem>
                              <SelectItem value="Back Order">Back Order</SelectItem>
                              <SelectItem value="EOL">EOL</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {result.status === 'On Order' && (
                            <EditableText
                              value={result.orderNumber}
                              fieldName="orderNumber"
                              inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[50px] "
                              buttonClassName="text-center py-1 px-2 text-foreground"
                              buttonLabel={`Edit orderNumber`}
                              inputLabel={`Edit orderNumber`}
                            >
                              <input type="hidden" name="intent" value='updateOrderOrderNumber' />
                              <input type='hidden' name='total' value={total} />
                              <input type='hidden' name='accOrderId' value={order.id} />

                              <input type="hidden" name="id" value={result.id} />
                            </EditableText>
                          )}
                        </TableCell>
                        <TableCell className=" ">
                          <addProduct.Form method="post" ref={formRef} className='mr-auto'>
                            <input type="hidden" name="id" value={result.id} />
                            <input type='hidden' name='total' value={total} />
                            <input type='hidden' name='accOrderId' value={order.id} />
                            <Button
                              size="icon"
                              variant="outline"
                              name="intent" value='deleteOrderItem'
                              className=" mr-2 bg-primary"
                              type='submit'
                            >
                              <X className="h-4 w-4 text-foreground" />
                            </Button>
                          </addProduct.Form>

                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Current Order: {order.id}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Order ID</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Date:{" "}
                  {new Date(order.createdAt).toLocaleDateString(
                    "en-US",
                    options2
                  )}
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <MoreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="border border-border"
                  >
                    <DropdownMenuItem onSelect={() => setDiscount((prevDiscount) => !prevDiscount)}>Show Discount</DropdownMenuItem>
                    <DropdownMenuItem>Reprint Receipt</DropdownMenuItem>
                    <DropdownMenuItem>Go To Cash</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Trash</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm max-h-[665px] h-auto overflow-y-auto">
              <div className="grid gap-3">
                <div className="font-semibold">Order Details</div>
                <ul className="grid gap-3 max-h-[300px] h-auto overflow-y-auto">
                  {order.AccessoriesOnOrders && order.AccessoriesOnOrders.map((result, index) => (
                    <li
                      className="flex items-center justify-between"
                      key={index}
                    >
                      <div>
                        <div className="font-medium">
                          {result.accessory.brand}{" "}
                          {result.accessory.name}
                        </div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {result.accessory.category}{" "}
                        </div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {result.accessory.description}
                        </div>
                      </div>
                      <span>${result.accessory.price}{" "}{" "}x{" "}{" "}{result.quantity}</span>
                    </li>
                  ))}
                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalAccessoriesCost.toFixed(2)}</span>
                  </li>
                  {discount && (
                    <>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Discount $</span>
                        <fetcher.Form
                          method="post"
                          onSubmit={() => {
                            buttonRef.current?.focus();
                          }}
                          preventScrollReset
                        >
                          <input
                            name='accOrderId'
                            defaultValue={order.id}
                            type='hidden'
                          />
                          <input
                            name='intent'
                            defaultValue='updateDiscount'
                            type='hidden'
                          />
                          <input
                            name='total'
                            defaultValue={totalAccessoriesCost}
                            type='hidden'
                          />
                          <div className="relative ml-auto flex-1 md:grow-0 ">
                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground" />
                            <Input
                              ref={inputRef}
                              name='discDollar'
                              className='text-right pr-10 w-[100px]'
                              defaultValue={discDollar}
                              onChange={(event) => setDiscDollar(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Escape") {
                                  buttonRef.current?.focus();
                                }
                              }}
                              onBlur={(event) => {
                                if (
                                  inputRef.current?.value !== discDollar &&
                                  inputRef.current?.value.trim() !== ""
                                ) {
                                  fetcher.submit(event.currentTarget);
                                }
                              }}
                            />
                            <Button
                              type="submit"
                              size="icon"
                              onClick={() => {
                                toast.success(`Text sent!`)
                              }}
                              disabled={!discDollar}
                              className='bg-primary mr-2 absolute right-1.5 top-2.5 h-4 w-4 text-foreground '>
                              <PaperPlaneIcon className="h-4 w-4" />
                              <span className="sr-only">Cash</span>
                            </Button>
                          </div>
                        </fetcher.Form>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Discount %</span>
                        <fetcher.Form
                          method="post"
                          onSubmit={() => {
                            buttonRef.current?.focus();
                          }}
                          preventScrollReset
                        >
                          <input
                            name='accOrderId'
                            defaultValue={order.id}
                            type='hidden'
                          />
                          <input
                            name='intent'
                            defaultValue='updateDiscPerc'
                            type='hidden'
                          />
                          <input
                            name='total'
                            defaultValue={totalAccessoriesCost}
                            type='hidden'
                          />
                          <div className="relative ml-auto flex-1 md:grow-0 ">
                            <Input
                              ref={inputRef}
                              name='discPer'
                              className='text-right pr-[43px] w-[100px]'
                              value={discPer}
                              onChange={(event) => setDiscPer(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Escape") {
                                  buttonRef.current?.focus();
                                }
                              }}
                              onBlur={(event) => {
                                if (
                                  inputRef.current?.value !== discPer &&
                                  inputRef.current?.value.trim() !== ""
                                ) {
                                  fetcher.submit(event.currentTarget);
                                }
                              }}
                            />
                            <Percent className="absolute right-10 top-[8px] h-4 w-4 text-foreground" />
                            <Button
                              type="submit"
                              size="icon"
                              onClick={() => {
                                toast.success(`Text sent!`)
                              }}
                              disabled={!discPer}
                              className='bg-primary mr-2 absolute right-1.5 top-[8px] h-4 w-4 text-foreground '>
                              <PaperPlaneIcon className="h-4 w-4" />
                              <span className="sr-only">Cash</span>
                            </Button>
                          </div>
                        </fetcher.Form>

                      </li>
                    </>
                  )}
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{tax.userTax}%</span>
                  </li>
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>${total}</span>
                  </li>
                </ul>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold flex justify-between">
                  <p>
                    Customer Information
                  </p>
                  <Button
                    size="icon"
                    variant="outline"
                    className=" mr-2 bg-primary"
                    onClick={() => setCustInfo((prevCustInfo) => !prevCustInfo)}
                  >
                    <ArrowDownUp className="h-4 w-4 text-foreground" />
                  </Button>
                </div>
                {custInfo && (<>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Customer</dt>
                      <dd>
                        {order.Clientfile.firstName}{" "}
                        {order.Clientfile.lastName}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>
                        <a href="mailto:">{order.Clientfile.email}</a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>
                        <a href="tel:">{order.Clientfile.phone}</a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Address</dt>
                      <dd>
                        <p>{order.Clientfile.address}</p>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">City, Province</dt>
                      <dd>
                        <p>{order.Clientfile.city}, {order.Clientfile.province}</p>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Postal Code</dt>
                      <dd>
                        <p>{order.Clientfile.postal}</p>
                      </dd>
                    </div>
                  </dl>
                </>)}

              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Payment Information</div>
                <dl className="grid gap-3">
                  {order.paymentType ? (
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        {order.paymentType}
                      </dt>
                      {order.cardNum}
                    </div>
                  ) : (
                    <div className="flex flex-col" >
                      <div className='flex items-center justify-center text-foreground'>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn('mr-2 bg-primary', paymentType === 'Visa' ? "bg-secondary" : "", "")}
                          onClick={() => setPaymentType('Visa')}
                        >
                          <CreditCard className="h-4 w-4 text-foreground" />
                          <p className="">Visa</p>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn('mr-2 bg-primary', paymentType === 'Mastercard' ? "bg-secondary" : "", "")}
                          onClick={() => setPaymentType('Mastercard')}
                        >
                          <CreditCard className="h-4 w-4 text-foreground" />
                          <p className="">Mastercard</p>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPaymentType('Debit')}
                          className={cn(' bg-primary', paymentType === 'Debit' ? "bg-secondary" : "", "")}
                        >
                          <CreditCard className="h-4 w-4 text-foreground" />
                          <p className="">Debit</p>
                        </Button>
                      </div>
                      <div className='flex items-center justify-center text-foreground mt-2'>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn('mr-2 bg-primary', paymentType === 'Cash' ? "bg-secondary" : "", "")}
                          onClick={() => setPaymentType('Cash')}
                        >
                          <BanknoteIcon className="h-4 w-4 text-foreground" />
                          <p className="">Cash</p>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(' bg-primary', paymentType === 'Online Transaction' ? "bg-secondary" : "", "")}
                          onClick={() => setPaymentType('Online Transaction')}
                        >
                          <PanelTop className="h-4 w-4 text-foreground" />
                          <p className="">Online Transaction</p>
                        </Button>
                      </div>
                    </div>
                  )}
                </dl>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Payment</div>
                <ul className="grid gap-3">
                  {order.Payments && order.Payments.map((result, index) => (
                    <li className="flex items-center justify-between" key={index}                    >
                      <span className="text-muted-foreground">{result.paymentType}</span>
                      <span>${result.amountPaid}</span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Balance</span>
                    <span>${parseFloat(total) - parseFloat(totalAmountPaid)}</span>

                  </li>
                  {paymentType !== '' && (
                    <>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Amount to be charged on {paymentType}</span>
                        <payment.Form method="post" ref={formRef} >
                          <input type='hidden' name='accOrderId' value={order.id} />
                          <input type='hidden' name='paymentType' value={paymentType} />
                          <input type='hidden' name='intent' value='createPayment' />
                          <input type='hidden' name='total' value={total} />
                          <div className="relative ml-auto flex-1 md:grow-0 ">
                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              name='amountPaid'
                              className='text-right pr-9'
                              value={input}
                              onChange={(event) => setInput(event.target.value)}
                            />
                            <Button
                              type="submit"
                              size="icon"
                              onClick={() => {
                                toast.success(`Text sent!`)
                              }}
                              disabled={inputLength === 0}
                              className='bg-primary mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>
                              <PaperPlaneIcon className="h-4 w-4" />
                              <span className="sr-only">Cash</span>
                            </Button>
                          </div>
                        </payment.Form>
                      </li>
                    </>
                  )}

                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Updated{" "}
                <time dateTime="2023-11-23">
                  {new Date(order.createdAt).toLocaleDateString(
                    "en-US",
                    options2
                  )}
                </time>
              </div>
            </CardFooter>
          </Card>
        </div >
      </main >
    </div >
  );
}

*/
