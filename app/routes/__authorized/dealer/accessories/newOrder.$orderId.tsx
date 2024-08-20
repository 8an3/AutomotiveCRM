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
import { Outlet, Link, useLoaderData, useFetcher, Form, useSubmit, NavLink } from "@remix-run/react";
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
import PrintReceipt from "../document/printReceiptAcc";
import QRCode from 'react-qr-code';
import { Label, TextArea } from '~/components';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu"


export function playScanSound() {
  const audio = new Audio(ScanSound);
  audio.play();
}

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
      updatedAt: true,
      userEmail: true,
      userName: true,
      dept: true,
      total: true,
      discount: true,
      discPer: true,
      paid: true,
      paidDate: true,
      status: true,
      clientfileId: true,
      workOrderId: true,
      financeId: true,
      note: true,
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
      Finance: {
        select: {
          id: true,
          year: true,
          brand: true,
          model: true,
          model1: true,
          color: true,
          modelCode: true,
        }
      },
      AccessoriesOnOrders: {
        select: {
          id: true,
          quantity: true,
          accOrderId: true,
          status: true,
          orderNumber: true,
          OrderInvId: true,
          accessoryId: true,
          accessory: {
            select: {
              partNumber: true,
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
      AccHandoff: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          status: true,
          sendTo: true,
          sendToCompleted: true,
          handOffTime: true,
          completedTime: true,
          notes: true,
          AccOrderId: true,
        },
      },
    },
  });
  const salesPerson = await prisma.user.findUnique({
    where: { email: user.email }
  })
  const tax = await prisma.dealer.findUnique({
    where: { id: 1 },
    select: { userTax: true },
  });
  const dealerImage = await prisma.dealerLogo.findUnique({
    where: { id: 1 }
  })
  await prisma.customerSync.update({
    where: { userEmail: email },
    data: { orderId: id }
  });
  return json({ order, user, tax, salesPerson, dealerImage });
}

export async function action({ request, params }: LoaderFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session2 = await getSession(request.headers.get("Cookie"));
  console.log(formPayload, 'formpayload')
  const intent = formData.intent;
  //  <input type='hidden' name='total' value={total} />
  // <input type='hidden' name='accOrderId' value={order.id} />
  if (formPayload.remaining === 0) {
    const currentAccOrder = await prisma.accOrder.findUnique({
      where: { id: formPayload.accOrderId },
      select: { paidDate: true },
    });

    await prisma.accOrder.update({
      where: { id: formPayload.accOrderId },
      data: {
        paid: true,
        paidDate: currentAccOrder.paidDate ? currentAccOrder.paidDate : String(new Date()),
      },
    });
  }
  if (intent === 'updateAccOnOrders') {
    const update = await prisma.accessoriesOnOrders.update({
      where: { id: formPayload.accOnOrderId },
      data: { status: formPayload.status }
    })
    return json({ update })
  }
  if (intent === 'pushSubtotal') {
    const finance = await prisma.finance.findUnique({ where: { id: formData.financeId } })
    const subTotal = parseFloat(finance.accessories + formPayload.subTotal).toFixed(2)
    const update = await prisma.finance.update({ where: { id: formData.financeId }, data: { accessories: Number(subTotal) } })
    return json({ update })
  }
  if (intent === 'updateOrder') {
    try {
      // Find if there is an existing entry with the same accOrderId and accessoryId
      const existingEntry = await prisma.accessoriesOnOrders.findFirst({
        where: {
          accOrderId: formPayload.orderId,
          accessoryId: formPayload.accId,
        },
      });

      if (existingEntry) {
        // If an entry exists, update the quantity
        const updatedEntry = await prisma.accessoriesOnOrders.update({
          where: {
            id: existingEntry.id,
          },
          data: {
            quantity: existingEntry.quantity + 1, // Increment the quantity
          },
        });
        return updatedEntry;
      } else {
        // If no entry exists, create a new one
        const newEntry = await prisma.accessoriesOnOrders.create({
          data: {
            quantity: 1,
            accOrderId: formPayload.orderId,
            accessoryId: formPayload.accId,
          },
        });
        return newEntry;
      }
    } catch (error) {
      console.error('Error updating or creating accessory order:', error);
      throw error;
    }
  }
  if (intent === 'updateDept') {
    try {
      const update = await prisma.accOrder.update({
        where: { id: formPayload.orderId },
        data: {
          total: parseFloat(formPayload.total),
          dept: formPayload.dept,
        },
      });

      return update
    } catch (error) {
      console.error('Error updating or creating accessory order:', error);
      throw error;
    }
  }
  if (intent === 'submitNote') {
    try {
      const update = await prisma.accOrder.update({
        where: { id: formPayload.orderId },
        data: {
          note: formPayload.note,
        },
      });
      return update
    } catch (error) {
      console.error('Error updating or creating accessory order:', error);
      throw error;
    }
  }
  if (intent === 'updateCompleted') {
    try {
      const update = await prisma.accHandoff.update({
        where: { id: formPayload.orderId },
        data: {
          sendToCompleted: formPayload.sendToCompleted,
        },
      });
      return update
    } catch (error) {
      console.error('Error updating or creating accessory order:', error);
      throw error;
    }
  }
  if (intent === 'updateStatus') {
    try {
      const update = await prisma.accOrder.update({
        where: { id: formPayload.orderId },
        data: {
          total: parseFloat(formPayload.total),
          status: formPayload.status,
        },
      });

      return update
    } catch (error) {
      console.error('Error updating or creating accessory order:', error);
      throw error;
    }
  }
  if (intent === 'createPayment') {
    const payment = await prisma.payment.create({
      data: {
        accOrderId: formPayload.accOrderId,
        paymentType: formPayload.paymentType === 'Visa' || formPayload.paymentType === 'Mastercard' || formPayload.paymentType === 'AMEX' ? 'Credit Card' : formPayload.paymentType,
        cardType: formPayload.paymentType === 'Visa' || formPayload.paymentType === 'Mastercard' || formPayload.paymentType === 'AMEX' ? formPayload.paymentType : '',
        amountPaid: parseFloat(formPayload.amountPaid),
        cardNum: formPayload.cardNum,
        receiptId: formPayload.receiptId,
      },
    });
    if (formPayload.remaining === '0') {
      await prisma.accOrder.update({
        where: { id: formPayload.accOrderId },
        data: {
          total: parseFloat(formPayload.total),
          paid: true,
        },
      });
    } else {
      await prisma.accOrder.update({
        where: { id: formPayload.accOrderId },
        data: {
          total: parseFloat(formPayload.total),
        },
      });
    }

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
  const { user, order, tax, salesPerson, dealerImage } = useLoaderData();

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
    // console.log('useEffect triggered');
    // console.log('order.discount:', order.discount);
    if (order.discount) {
      //  console.log('Setting discount:', order.discount);
      setDiscDollar(order.discount);
    } else {
      //    console.log('Discount is 0 or less');
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

  const [data, setData] = useState({})
  const client = order.Clientfile
  const { AccessoriesOnOrders } = order;
  const maxAccessories = 19;

  const toReceipt = {
    qrCode: order.id,
    subTotal: `$${totalAccessoriesCost.toFixed(2)}`,
    tax: `${tax.userTax}%`,
    total: `$${total}`,
    remaining: `$${parseFloat(total) - parseFloat(totalAmountPaid)}`,
    firstName: client.firstName,
    lastName: client.lastName,
    phone: client.phone,
    email: client.email,
    address: client.address,
    date: new Date(order.createdAt).toLocaleDateString("en-US", options2),
    cardNum: '',
    paymentType: '',
    image: dealerImage.dealerLogo
  };

  AccessoriesOnOrders.forEach((result, index) => {
    if (index < maxAccessories) {
      toReceipt[`desc${index + 1}`] = `${result.accessory.brand} ${result.accessory.name}`;
      toReceipt[`qt${index + 1}`] = String(result.quantity);
      toReceipt[`price${index + 1}`] = String(result.accessory.price);
    }
  });

  for (let i = AccessoriesOnOrders.length + 1; i <= maxAccessories; i++) {
    toReceipt[`desc${i}`] = '';
    toReceipt[`qt${i}`] = '';
    toReceipt[`price${i}`] = '';
  }

  const [value, setValue] = useState(order.id);
  const [back, setBack] = useState('#FFFFFF');
  const [fore, setFore] = useState('#000000');
  const [size, setSize] = useState(100);
  const remaining = parseFloat(total) - parseFloat(totalAmountPaid)
  useEffect(() => {
    if (remaining === 0) {
      toast.success('Order is paid in full!', {
        duration: Infinity
      })
    }
  }, [remaining]);

  const orderStatus = order.status ? order.status : user.dept
  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
              <Card x-chunk="dashboard-05-chunk-1" className="sm:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Orders Dashboard for Seamless
                    Management and Insightful Analysis.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to="/dealer/accessories/search">
                    <Button size='sm'>Create New Order</Button>
                  </Link>
                  <Link to={`/dealer/customer/${order.clientfileId}/${order.financeId}`} >
                    <Button
                      className='ml-4'
                      disabled={!order.financeId}
                      size='sm'>Customer's profile</Button>
                  </Link>
                  {order.AccHandoff && order.AccHandoff.handOffTime && (
                    <p>Sent to acc/parts: {order.AccHandoff.handOffTime}</p>
                  )}
                  {order.AccHandoff && order.AccHandoff.completedTime && (
                    <p>Completed by acc/parts: {order.AccHandoff.completedTime}</p>
                  )}
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2" className="" >
                <CardHeader className="pb-3">
                  <CardTitle className=''>
                    Part Scanner
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
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>Order QR Code</CardDescription>
                </CardHeader>
                <CardContent className=' '>

                  <div className=' mx-auto my-auto items-center justify-center'
                  >
                    <QRCode
                      className='mx-auto bg-white p-2'
                      value={value}
                      bgColor={back}
                      fgColor={fore}
                      size={size === '' ? 0 : size}
                    />
                  </div>

                </CardContent>
              </Card>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
              <Card x-chunk="dashboard-07-chunk-3" className="sm:col-span-2">
                <CardHeader>
                  <CardTitle>Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 grid-cols-2 ">
                    <div>
                      <div className="relative mt-4">
                        <Select
                          name='status'
                          defaultValue={orderStatus}
                          onValueChange={(value) => {
                            const formData = new FormData();
                            formData.append("orderId", order.id);
                            formData.append("total", total);
                            formData.append("intent", 'updateStatus');
                            formData.append("status", value);
                            console.log(formData, 'formData');

                            payment.submit(formData, { method: "post" });
                          }}>
                          <SelectTrigger className="w-[200px] " >
                            <SelectValue defaultValue={orderStatus} />
                          </SelectTrigger>
                          <SelectContent className='border-border'>
                            <SelectGroup>
                              <SelectLabel>Status</SelectLabel>
                              <SelectItem value="Quote">Quote</SelectItem>
                              <SelectItem value="Review and Approved">Review and Approved</SelectItem>
                              <SelectItem value="Need to Order">Need to Order</SelectItem>
                              <SelectItem value="On Order">On Order</SelectItem>
                              <SelectItem value="Back Order">Back Order</SelectItem>
                              <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                              <SelectItem value="Layaway">Layaway</SelectItem>
                              <SelectItem value="Deposit">Deposit</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Status</label>
                      </div>
                      <div className="relative mt-4">
                        <Select
                          name='dept'
                          defaultValue={order.dept}
                          onValueChange={(value) => {
                            const formData = new FormData();
                            formData.append("orderId", order.id);
                            formData.append("total", total);
                            formData.append("intent", 'updateDept');
                            formData.append("dept", value);
                            console.log(formData, 'formData');

                            payment.submit(formData, { method: "post" });
                          }}>
                          <SelectTrigger className="w-[200px]  ">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className='border-border'>
                            <SelectGroup>
                              <SelectLabel>Deptarment</SelectLabel>
                              <SelectItem value="Accessories">Accessories</SelectItem>
                              <SelectItem value="Sales">Sales</SelectItem>
                              <SelectItem value="Parts">Parts</SelectItem>
                              <SelectItem value="Service">Service</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Dept</label>
                      </div>
                      {order.AccHandoff && (
                        <div className="relative mt-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Select
                                name='dept'
                                defaultValue={order.sendToCompleted}
                                onValueChange={(value) => {
                                  const formData = new FormData();
                                  formData.append("orderId", order.AccHandoff.id);
                                  formData.append("intent", 'updateCompleted');
                                  formData.append("sendToCompleted", value);
                                  console.log(formData, 'formData');
                                  payment.submit(formData, { method: "post" });
                                }}>
                                <SelectTrigger className="w-[200px]  ">
                                  <SelectValue defaultValue={order.sendToCompleted} />
                                </SelectTrigger>
                                <SelectContent className='border-border'>
                                  <SelectGroup>
                                    <SelectLabel>Send back to sales?</SelectLabel>
                                    <SelectItem value='true'>True</SelectItem>
                                    <SelectItem value='false'>False</SelectItem>

                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </TooltipTrigger>
                            <TooltipContent side="right">Once accessories has added and confirmed all parts needed to complete the customers requests, change to true.</TooltipContent>
                          </Tooltip>
                          <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Order Completed</label>
                        </div>
                      )}

                    </div>
                    <div>
                      <Form method='post' >
                        <input type='hidden' name='orderId' value={order.id} />
                        <div className="relative mt-4">
                          <TextArea className='w-[200px]' defaultValue={order.note} name='note' />
                          <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Order Notes</label>
                        </div>
                        <Button
                          type='submit'
                          name='intent'
                          value='submitNote'
                          size='sm'
                          className='mt-4 ml-auto'
                        >Save</Button>
                      </Form>

                      {order.dept === 'Sales' && order.sendTo && order.sendToCompleted === 'false' && (
                        <Button size='sm' className='bg-primary mt-4'>
                          Send To Accessories
                        </Button>
                      )}
                    </div>

                  </div>
                </CardContent>
              </Card>
              <Card className='sm:col-span-2 ' x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
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
                      </dl>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>More Info</AccordionTrigger>
                          <AccordionContent>
                            <ul className="grid gap-3 text-sm mt-2">
                              <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Address
                                </span>
                                <span>{order.Clientfile.address}</span>
                              </li>
                              <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  City, Province
                                </span>
                                <span>{order.Clientfile.city}, {order.Clientfile.province}</span>
                              </li>
                              <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Postal Code
                                </span>
                                <span>{order.Clientfile.postal}</span>
                              </li>
                              <Separator className='my-4' />
                              {order.Finance && (
                                <>
                                  {order.Finance.year && (
                                    <li className="flex items-center justify-between">
                                      <span className="text-muted-foreground">
                                        Year
                                      </span>
                                      <span>{order.Finance.year}</span>
                                    </li>
                                  )}
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Brand
                                    </span>
                                    <span>{order.Finance.brand}</span>
                                  </li>
                                  <li className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                      Model
                                    </span>
                                    <span>{order.Finance.model}</span>
                                  </li>
                                  {order.Finance.trim && (
                                    <li className="flex items-center justify-between">
                                      <span className="text-muted-foreground">
                                        Trim
                                      </span>
                                      <span>{order.Finance.trim}</span>
                                    </li>
                                  )}
                                  {order.Finance.color && (
                                    <li className="flex items-center justify-between">
                                      <span className="text-muted-foreground">
                                        Color
                                      </span>
                                      <span>{order.Finance.color}</span>
                                    </li>
                                  )}
                                  {order.Finance.modelCode && (
                                    <li className="flex items-center justify-between">
                                      <span className="text-muted-foreground">
                                        Model Code
                                      </span>
                                      <span>{order.Finance.modelCode}</span>
                                    </li>
                                  )}
                                </>
                              )}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue="account">
              <TabsList>
                <TabsTrigger value="account">Search for Parts</TabsTrigger>
                <TabsTrigger value="password">Accessory Order</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <Card
                  x-chunk="dashboard-05-chunk-3"
                  onClick={() => setChangeSize(false)}
                  className={cn('h-[475px] max-h-[475px]')}>
                  <CardHeader className="px-7">
                    <CardTitle className='flex items-center'>
                      <p className='mr-5'>
                        Search Parts
                      </p>
                    </CardTitle>
                    <CardDescription>
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
                            className="w-[250px] rounded-lg bg-background pl-8 max-w-[250px]"
                          />
                        </div>
                      </search.Form>
                    </CardDescription>
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
              </TabsContent>
              <TabsContent value="password">
                <Card
                  x-chunk="dashboard-05-chunk-3"
                  className={cn('h-[475px] max-h-[475px]')}>
                  <CardHeader className="px-7">
                    <CardTitle className='flex items-center'>
                      <p className='mr-5'>
                        Parts On Accessory Order
                      </p>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={cn('h-auto overflow-y-auto ', changeSize === true ? "max-h-[115px]" : "max-h-[400px]", "")}             >
                    <div className="grid gap-3">
                      <div className="font-semibold">Order Details</div>
                      <ul className="grid gap-3 max-h-[400px] h-auto overflow-y-auto">
                        {order.AccessoriesOnOrders && order.AccessoriesOnOrders.map((result, index) => (
                          <li
                            className="flex items-center justify-between"
                            key={index}
                          >
                            <div>
                              <ContextMenu>
                                <ContextMenuTrigger>
                                  <div className='grid grid-cols-1'>
                                    <div className='flex items-center group '>
                                      <div className="font-medium">
                                        {result.accessory.name}
                                      </div>
                                      <addProduct.Form method="post" ref={formRef} className='mr-auto'>
                                        <input type="hidden" name="id" value={result.id} />
                                        <input type='hidden' name='total' value={total} />
                                        <input type='hidden' name='accOrderId' value={order.id} />
                                        <Button
                                          size="icon"
                                          variant="outline"
                                          name="intent" value='deleteOrderItem'
                                          className=" ml-2 bg-primary  opacity-0 transition-opacity group-hover:opacity-100"
                                          type='submit'
                                        >
                                          <X className="h-4 w-4 text-foreground" />
                                        </Button>
                                      </addProduct.Form>
                                    </div>
                                    <p className="hidden text-sm text-muted-foreground md:inline">
                                      {result.accessory.brand}
                                    </p>
                                    <p className="hidden text-sm text-muted-foreground md:inline">
                                      Category: {result.accessory.category}
                                    </p>
                                    <p className="hidden text-sm text-muted-foreground md:inline">
                                      Desc: {result.accessory.description}
                                    </p>
                                    <p className="hidden text-sm text-muted-foreground md:inline">
                                      {result.accessory.location} with {result.accessory.quantity} in stock.
                                    </p>
                                    <p className="hidden text-sm text-muted-foreground md:inline">
                                      Part #: {result.accessory.partNumber}
                                    </p>
                                    <div>
                                      <Badge className='text-sm  px-2 py-1 '>{result.status}</Badge>
                                    </div>
                                  </div>
                                </ContextMenuTrigger>
                                <ContextMenuContent className='border-border'>
                                  <ContextMenuCheckboxItem
                                    checked={result.status === 'In Stock'}
                                    onSelect={() => {
                                      const formData = new FormData();
                                      formData.append("accOnOrderId", result.id);
                                      formData.append("status", 'In Stock');
                                      formData.append("intent", 'updateAccOnOrders');
                                      submit(formData, { method: "post", });
                                    }}
                                  >In Stock</ContextMenuCheckboxItem>
                                  <ContextMenuCheckboxItem
                                    checked={result.status === 'On Order'}
                                    onSelect={() => {
                                      const formData = new FormData();
                                      formData.append("accOnOrderId", result.id);
                                      formData.append("status", 'On Order');
                                      formData.append("intent", 'updateAccOnOrders');
                                      submit(formData, { method: "post", });
                                    }}
                                  >On Order</ContextMenuCheckboxItem>
                                  <ContextMenuCheckboxItem
                                    checked={result.status === 'Back Order'}
                                    onSelect={() => {
                                      const formData = new FormData();
                                      formData.append("accOnOrderId", result.id);
                                      formData.append("status", 'Back Order');
                                      formData.append("intent", 'updateAccOnOrders');
                                      submit(formData, { method: "post", });
                                    }}
                                  >Back Order</ContextMenuCheckboxItem>
                                  <ContextMenuCheckboxItem
                                    checked={result.status === 'Fulfilled'}
                                    onSelect={() => {
                                      const formData = new FormData();
                                      formData.append("accOnOrderId", result.id);
                                      formData.append("status", 'Fulfilled');
                                      formData.append("intent", 'updateAccOnOrders');
                                      submit(formData, { method: "post", });
                                    }}
                                  >Fulfilled</ContextMenuCheckboxItem>
                                </ContextMenuContent>
                              </ContextMenu>
                            </div>
                            <span>${result.accessory.price}{" "}{" "}x{" "}{" "}{result.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

          </div>
        </div>
        <div className='flex flex-col'>
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
                    <DropdownMenuItem>Discount</DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        const formData = new FormData();
                        formData.append("financeId", order.financeId);
                        formData.append("subTotal", totalAccessoriesCost);
                        formData.append("intent", 'pushSubtotal');
                        submit(formData, { method: "post", });
                      }}
                    >Push Sub Total to Finance</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => {

                      }}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm max-h-[780px] h-[780px] overflow-y-auto">
              <div className="grid gap-3">
                <div className="font-semibold">Order Details</div>
                <ul className="grid gap-3 max-h-[400px] h-auto overflow-y-auto">
                  {order.AccessoriesOnOrders && order.AccessoriesOnOrders.map((result, index) => (
                    <li
                      className="flex items-center justify-between"
                      key={index}
                    >
                      <div>
                        <ContextMenu>
                          <ContextMenuTrigger>
                            <div className='grid grid-cols-1'>
                              <div className='flex items-center group '>
                                <div className="font-medium">
                                  {result.accessory.name}
                                </div>
                                <addProduct.Form method="post" ref={formRef} className='mr-auto'>
                                  <input type="hidden" name="id" value={result.id} />
                                  <input type='hidden' name='total' value={total} />
                                  <input type='hidden' name='accOrderId' value={order.id} />
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    name="intent" value='deleteOrderItem'
                                    className=" ml-2 bg-primary  opacity-0 transition-opacity group-hover:opacity-100"
                                    type='submit'
                                  >
                                    <X className="h-4 w-4 text-foreground" />
                                  </Button>
                                </addProduct.Form>
                              </div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                {result.accessory.brand}
                              </div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                {result.accessory.category}{" "}{result.accessory.description}
                              </div>
                              <div>
                                <Badge className='text-sm  px-2 py-1 '>{result.status}</Badge>
                              </div>
                            </div>
                          </ContextMenuTrigger>
                          <ContextMenuContent className='border-border'>
                            <ContextMenuCheckboxItem
                              checked={result.status === 'In Stock'}
                              onSelect={() => {
                                const formData = new FormData();
                                formData.append("accOnOrderId", result.id);
                                formData.append("status", 'In Stock');
                                formData.append("intent", 'updateAccOnOrders');
                                submit(formData, { method: "post", });
                              }}
                            >In Stock</ContextMenuCheckboxItem>
                            <ContextMenuCheckboxItem
                              checked={result.status === 'On Order'}
                              onSelect={() => {
                                const formData = new FormData();
                                formData.append("accOnOrderId", result.id);
                                formData.append("status", 'On Order');
                                formData.append("intent", 'updateAccOnOrders');
                                submit(formData, { method: "post", });
                              }}
                            >On Order</ContextMenuCheckboxItem>
                            <ContextMenuCheckboxItem
                              checked={result.status === 'Back Order'}
                              onSelect={() => {
                                const formData = new FormData();
                                formData.append("accOnOrderId", result.id);
                                formData.append("status", 'Back Order');
                                formData.append("intent", 'updateAccOnOrders');
                                submit(formData, { method: "post", });
                              }}
                            >Back Order</ContextMenuCheckboxItem>
                            <ContextMenuCheckboxItem
                              checked={result.status === 'Fulfilled'}
                              onSelect={() => {
                                const formData = new FormData();
                                formData.append("accOnOrderId", result.id);
                                formData.append("status", 'Fulfilled');
                                formData.append("intent", 'updateAccOnOrders');
                                submit(formData, { method: "post", });
                              }}
                            >Fulfilled</ContextMenuCheckboxItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      </div>
                      <span>${result.accessory.price}{" "}{" "}x{" "}{" "}{result.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='mt-auto'>
                <Separator className="my-2 mt-auto" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalAccessoriesCost.toFixed(2)}</span>
                  </li>
                  {order.discount && (
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span>${order.discount}</span>
                    </li>
                  )}
                  {order.discPer && (
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span>{order.discPer}%</span>
                    </li>
                  )}
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
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Payment</div>
                  <dl className="grid gap-3">

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
                          className={cn(' bg-primary mr-2', paymentType === 'Debit' ? "bg-secondary" : "", "")}
                        >
                          <CreditCard className="h-4 w-4 text-foreground" />
                          <p className="">Debit</p>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPaymentType('Cheque')}
                          className={cn(' bg-primary', paymentType === 'Cheque' ? "bg-secondary" : "", "")}
                        >
                          <CreditCard className="h-4 w-4 text-foreground" />
                          <p className="">Cheque</p>
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
                          className={cn(' bg-primary mr-2', paymentType === 'Online Transaction' ? "bg-secondary" : "", "")}
                          onClick={() => setPaymentType('Online Transaction')}
                        >
                          <PanelTop className="h-4 w-4 text-foreground" />
                          <p className="">Online Transaction</p>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(' bg-primary', paymentType === 'E-Transfer' ? "bg-secondary" : "", "")}
                          onClick={() => setPaymentType('E-Transfer')}
                        >
                          <PanelTop className="h-4 w-4 text-foreground" />
                          <p className="">E-Transfer</p>
                        </Button>
                      </div>
                    </div>
                  </dl>
                </div>
                <div className="grid gap-3">
                  <ul className="grid gap-3">
                    {order.Payments && order.Payments.map((result, index) => (
                      <li className="flex items-center justify-between" key={index}                    >
                        <span className="text-muted-foreground">{result.paymentType}</span>
                        <span>${result.amountPaid}</span>
                      </li>
                    ))}
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Balance</span>
                      <span>${remaining}</span>

                    </li>
                    {remaining === 0 && (
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground"></span>
                        <Badge className='bg-[#30A46C]'>PAID</Badge>
                      </li>
                    )}
                    {paymentType !== '' && (
                      <>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Amount to be charged on {paymentType}</span>
                          <payment.Form method="post" ref={formRef} >
                            <input type='hidden' name='accOrderId' value={order.id} />
                            <input type='hidden' name='paymentType' value={paymentType} />
                            <input type='hidden' name='remaining' value={remaining} />
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground flex items-center justify-between">
                <div>
                  <Badge size='sm' className='text-foreground text-center mx-auto w-auto'>
                    {salesPerson.name}
                  </Badge>
                </div>

                <ClientOnly fallback={<p>Fallback component ...</p>}>
                  {() => (
                    <React.Suspense fallback={<div>Loading...</div>}>
                      <Button
                        variant='outline'
                        className='bg-background text-foreground border-border border ml-3'
                        onClick={() => {
                          console.log(toReceipt)
                          PrintReceipt(toReceipt)
                        }}>
                        Print Receipt
                      </Button>
                    </React.Suspense>
                  )}
                </ClientOnly>

              </div>
            </CardFooter>
          </Card>
        </div >
      </main >
    </div >
  );
}
/**  <Card
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
            <CardContent className={cn('h-auto overflow-y-auto ', changeSize === true ? "max-h-[380px]" : "max-h-[115px]", "")}            >
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
          </Card> */
