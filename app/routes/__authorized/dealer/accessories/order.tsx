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
import { Outlet, Link, useLoaderData, useFetcher, useNavigate, useSubmit } from "@remix-run/react";
import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
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
import PrintLabels from "../document/printLabels";
import useSWR from 'swr'
import ScanSound from '~/images/scan.mp4'
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType, NotFoundException, ChecksumException, FormatException } from '@zxing/library';
import QRCode from 'react-qr-code';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Check } from "lucide-react";


export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email");

  const user = await GetUser(email);
  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.accOrder.findMany({
    select: {
      id: true,
      createdAt: true,
      userEmail: true,
      total: true,
      discount: true,
      discPer: true,
      clientfileId: true,
      dept: true,
      status: true,
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
          accessory: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
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
          amountPaid: true,
          cardNum: true,
          receiptId: true,
        },
      },
    },
  });



  const tax = await prisma.dealer.findUnique({
    where: { id: 1 },
    select: { userTax: true },
  });

  const sevTotal = await getTotalFromLast7Days();

  const thiryTotal = await getTotalFromLast30Days()

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const filteredOrders30 = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= thirtyDaysAgo && orderDate <= today;
  });

  return json({ orders, user, sevTotal, tax, filteredOrders30, thiryTotal });
}

export function playScanSound() {
  const audio = new Audio(ScanSound);
  audio.play();
}
export async function action({ request, params }: ActionFunction) {
  const formPayload = Object.fromEntries(await request.formData());
  const intent = formPayload.intent;
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email");
  console.log(formPayload, 'from actiuon')
  if (intent === "scanOrder") {
    await prisma.customerSync.update({
      where: { userEmail: email },
      data: { orderId: formPayload.orderId }
    });
    return redirect('/dealer/accessories/currentOrder')
  }

  return null;
}

export default function Purchase() {
  const { user, orders, sevTotal, tax, filteredOrders30, thiryTotal } = useLoaderData();
  let ref = useRef();
  let payment = useFetcher();
  let search = useFetcher();
  const submit = useSubmit();
  const navigate = useNavigate()
  const [ordersList, setOrdersList] = useState([]);
  useEffect(() => {
    setOrdersList(ordersList);
  }, []);
  const lastOrder = orders[0];
  const taxMultiplier = Number(tax.userTax);
  const taxRate = 1 + taxMultiplier / 100;

  const options2 = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const filteredOrders7 = filteredOrders30.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= sevenDaysAgo && orderDate <= today;
  });
  const [showOrder, setShowOrder] = useState(false);

  const toggleOrderDetails = (orderId) => {
    if (showOrder === orderId) {
      setShowOrder(null);
    } else {
      setShowOrder(orderId);
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const [showPrevOrder, setShowPrevOrder] = useState(null)
  const [showPrev, setShowPrev] = useState(false)

  const showPrevOrderById = (id) => {
    const filteredOrder = orders.find(order => order.id === id);
    setShowPrev(true)
    setShowPrevOrder(filteredOrder);
  }

  let totalAccessoriesCost
  if (lastOrder) {
    totalAccessoriesCost = lastOrder.AccessoriesOnOrders.reduce((total, accessoryOnOrder) => {
      return total + (accessoryOnOrder.quantity * accessoryOnOrder.accessory.price);
    }, 0);
  }

  let totalAmountPaid
  if (lastOrder) {
    totalAmountPaid = lastOrder.Payments.reduce((total, payment) => {
      return total + payment.amountPaid;
    }, 0);
  }

  const [paymentType, setPaymentType] = useState('');
  const [discount, setDiscount] = useState(false)
  const [custInfo, setCustInfo] = useState(false)
  let fetcher = useFetcher();
  let buttonRef = useRef<HTMLButtonElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);
  let addProduct = useFetcher();
  let formRef = useRef();
  let products = useFetcher();

  const [discDollar, setDiscDollar] = useState(0.00)
  const [discPer, setDiscPer] = useState(0.00)
  /**  useEffect(() => {
      console.log('useEffect triggered');
      console.log('order.discount:', lastOrder.discount);
      if (lastOrder.discount > 0.00) {
        console.log('Setting discount:', lastOrder.discount);
        setDiscDollar(lastOrder.discount);
      } else {
        console.log('Discount is 0 or less');
      }
    }, [lastOrder.discount]);
      useEffect(() => {

    if (lastOrder.discPer > 0.00) {
      setDiscPer(lastOrder.discPer)
    }
  }, []);
   */

  const [value, setValue] = useState('');
  const [back, setBack] = useState('#FFFFFF');
  const [fore, setFore] = useState('#000000');
  const [size, setSize] = useState(100);
  const total2 = ((parseFloat(totalAccessoriesCost) - parseFloat(discDollar)) * taxRate).toFixed(2)
  const total1 = (((parseFloat(totalAccessoriesCost) * (100 - parseFloat(discPer))) / 100) * taxRate).toFixed(2)
  const total = discDollar && discDollar > 0.00 ? total1 : total2
  const [scannedCode, setScannedCode] = useState('')
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
  useEffect(() => {
    if (scannedCode) {
      const formData = new FormData();
      formData.append("orderId", scannedCode);
      formData.append("intent", 'scanOrder');
      const submitOrder = submit(formData, { method: "post", action: '/dealer/accessories/order' });
      console.log(submitOrder, 'sibmiteedd')
      return submitOrder
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
      const baseIndex = selectedProducts.length + index + 1;
      return {
        [`{${baseIndex}}free1`]: `${product.name} ${product.price}`,
        [`{${baseIndex}}free2`]: product.location,
        [`{${baseIndex}}code128`]: product.id,
      };
    });
    setSelectedProducts(prev => [...prev, ...newProducts]);
  };
  const localData = selectedProducts

  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
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

                {value && (
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

                )}
              </CardContent>
            </Card>
          </div>
          {/**lists all customers orders  */}
          <Tabs defaultValue="week">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="Parts Orders">Parts</TabsTrigger>
                <TabsTrigger value="Acc Orders">Accessories</TabsTrigger>
                <TabsTrigger value="week">Last 7 Days</TabsTrigger>
                <TabsTrigger value="month">Last 30 Days</TabsTrigger>
                <TabsTrigger value="Search Orders">Search Orders</TabsTrigger>
                <TabsTrigger value="End Of Day">End Of Day</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="Parts Orders">
            </TabsContent>
            <TabsContent value="Acc Orders">
            </TabsContent>
            <TabsContent value="week">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className='max-h-[455px] h-auto overflow-y-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow className='border-border'>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead className="hidden sm:table-cell">Dept</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="hidden sm:table-cell text-center">Paid</TableHead>
                        <TableHead className="hidden sm:table-cell text-center">Sent From Sales</TableHead>
                        <TableHead className="hidden sm:table-cell text-center">Completed for Sales</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders7 &&
                        filteredOrders7.map((result, index) => (
                          <TableRow key={index} className="rounded-[6px] hover:bg-accent border-border"                          >
                            <TableCell>  <div className="font-medium">  {result.Clientfile.name}  </div>
                              <div className="hidden text-sm text-muted-foreground md:inline"> {result.Clientfile.email}  </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge className="text-xs" variant="secondary">{result.status}</Badge>
                            </TableCell>
                            <TableCell className=" ">
                              <Badge className="text-xs" variant="secondary">{result.dept}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(result.createdAt).toLocaleDateString("en-US", options2)}
                            </TableCell>
                            <TableCell className="text-right">${result.total}</TableCell>
                            <TableCell className="text-right">paid?</TableCell>
                            <TableCell className="text-right">{result.sendToAccessories === false ? (<Check className='mx-auto' />) : (<X className='mx-auto' />)}</TableCell>
                            <TableCell className="text-right">{result.accessoriesCompleted === false ? (<Check className='mx-auto' />) : (<X className='mx-auto' />)}</TableCell>
                            <TableCell className="text-right">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="mr-3 hover:bg-primary"
                                    onClick={() => { setValue(result.id); showPrevOrderById(result.id) }}
                                  >
                                    <ShoppingCart className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  Previous Order
                                </TooltipContent>
                              </Tooltip>

                              {result.fullfilled === false && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link
                                      to={`/dealer/accessories/order/${result.id}`}
                                    >
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="hover:bg-primary"
                                      >
                                        <Banknote className="h-5 w-5" />
                                      </Button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    Go To Cash
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="month">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className='max-h-[455px] h-auto overflow-y-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden sm:table-cell">Type</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders30 &&
                        filteredOrders30.map((result, index) => (
                          <TableRow key={index} className="rounded-[6px] hover:bg-accent" >
                            <TableCell>
                              <div className="font-medium">{result.Clientfile.name}</div>
                              <div className="hidden text-sm text-muted-foreground md:inline"> {result.Clientfile.email}</div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">Sale</TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge className="text-xs" variant="secondary">
                                {result.fullfilled ? (<p>Fullfilled</p>) : (<p>Not Completed</p>)}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(result.createdAt).toLocaleDateString("en-US", options2)}
                            </TableCell>
                            <TableCell className="text-right">${result.total}</TableCell>
                            <TableCell className="text-right">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="mr-3 hover:bg-primary"
                                    onClick={() => showPrevOrderById(result.id)}
                                  >
                                    <ShoppingCart className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  Previous Order
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link to={`/dealer/accessories/previousOrder/${result.id}`} >
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="hover:bg-primary"
                                    >
                                      <Printer className="h-5 w-5" />
                                    </Button>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  Reprint Receipt
                                </TooltipContent>
                              </Tooltip>
                              {result.fullfilled === false && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link to={`/dealer/accessories/order/${result.id}`}  >
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="hover:bg-primary"
                                      >
                                        <Banknote className="h-5 w-5" />
                                      </Button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    Go To Cash
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="Search Orders">
              <Card x-chunk="dashboard-05-chunk-3 " className=" ">
                <CardHeader className="px-7">
                  <CardTitle>
                    <div className="flex items-center justify-between">
                      <p>Search Orders By Customer</p>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    <search.Form
                      method="get"
                      action="/dealer/accessories/order/search"
                    >
                      <div className="relative ml-auto flex-1 md:grow-0 ">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          ref={ref}
                          type="search"
                          name="q"
                          onChange={(e) => {
                            //   search.submit(`/dealer/accessories/search?name=${e.target.value}`);
                            search.submit(e.currentTarget.form);
                          }}
                          placeholder="Search..."
                          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                        />
                      </div>
                    </search.Form>
                  </CardDescription>
                </CardHeader>
                <CardContent className='max-h-[455px] h-auto overflow-y-auto'>
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Phone
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Address
                          </TableHead>
                          <TableHead className=" text-center hidden md:table-cell">
                            Actions
                          </TableHead>
                          <TableHead className="text-right"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="">
                        {search.data &&
                          search.data.map((result, index) => (
                            <>
                              <TableRow key={index} className="hover:bg-accent">
                                <TableCell>
                                  <div className="font-medium">
                                    {capitalizeFirstLetter(result.firstName)}{" "}
                                    {capitalizeFirstLetter(result.lastName)}
                                  </div>
                                  <div className="text-sm text-muted-foreground ">
                                    {result.email}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  {result.phone}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {result.address}
                                </TableCell>
                                <TableCell className="text-center text-lg text-muted-foreground">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        to={`/dealer/accessories/order/${result.AccOrder.id}`}
                                      >
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="mr-3 hover:bg-primary"
                                        >
                                          <Plus className="h-5 w-5" />
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                      Create New Order
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Link
                                        to={`/dealer/customer/${result.id}`}
                                        className="h-5 w-5 hover:bg-primary "
                                      >
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="hover:bg-primary"
                                        >
                                          <User className="h-5 w-5" />
                                        </Button>
                                      </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                      Customer Profile
                                    </TooltipContent>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                              {result.AccOrder.map((result, index) => (
                                <>
                                  <Table className='ml-5'>
                                    <TableBody>
                                      <TableRow
                                        key={index}
                                        className="rounded-[6px] hover:bg-accent"
                                        onClick={() => toggleOrderDetails(result.id)}
                                      >

                                        <TableCell className="hidden sm:table-cell">
                                          <Badge
                                            className="text-xs"
                                            variant="secondary"
                                          >
                                            {!result.fullfilled ? (
                                              <p>Fullfilled</p>
                                            ) : (
                                              <p>Not Completed</p>
                                            )}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                          {new Date(
                                            result.createdAt
                                          ).toLocaleDateString("en-US", options2)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {result.dept}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          ${result.total}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <Tooltip>
                                            <TooltipTrigger asChild>

                                              <Button
                                                size="icon"
                                                variant="ghost"
                                                className="mr-2 hover:bg-primary"
                                                onClick={() => showPrevOrderById(result.id)}
                                              >
                                                <ShoppingCart className="h-5 w-5" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                              See Details
                                            </TooltipContent>
                                          </Tooltip>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Link
                                                to={`/dealer/accessories/newOrder/${result.id}`}
                                              >
                                                <Button
                                                  size="icon"
                                                  variant="ghost"
                                                  className="hover:bg-primary mr-2"
                                                >
                                                  <Printer className="h-5 w-5" />
                                                </Button>
                                              </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="right">
                                              Go To Order
                                            </TooltipContent>
                                          </Tooltip>

                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                  {showOrder === result.id && (
                                    <>
                                      <div className="grid w-[500px] gap-3 rounded-lg border border-border p-6 m-3">
                                        <div className="font-semibold">
                                          Order Details
                                        </div>
                                        <ul className="grid gap-3">
                                          {result.AccessoriesOnOrders && result.AccessoriesOnOrders.map((result, index) => (
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
                                          )
                                          )}
                                        </ul>
                                        <Separator className="my-2" />
                                        <ul className="grid gap-3">
                                          <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                              Subtotal
                                            </span>
                                            <span>${result.total}</span>
                                          </li>
                                          <li className="flex items-center justify-between">
                                            <span className="text-muted-foreground">
                                              Tax
                                            </span>
                                            <span>{tax.userTax}%</span>
                                          </li>
                                          <li className="flex items-center justify-between font-semibold">
                                            <span className="text-muted-foreground">
                                              Total
                                            </span>
                                            <span>
                                              $
                                              {(result.total * taxRate).toFixed(2)}
                                            </span>
                                          </li>
                                        </ul>
                                      </div>
                                    </>
                                  )}
                                </>
                              ))}
                            </>
                          ))}
                      </TableBody>
                    </Table>
                  </>

                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          {showPrev ? (
            <>
              <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                <CardHeader className="flex flex-row items-start bg-muted/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      Show Order
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
                      {new Date(showPrevOrder.createdAt).toLocaleDateString(
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
                        <DropdownMenuItem
                          onSelect={() => {
                            navigate(`/dealer/accessories/newOrder/${showPrevOrder.id}`)
                          }}>
                          Go To Order
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            return null
                          }}>
                          Reprint Receipt
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => setDiscount((prevDiscount) => !prevDiscount)}>
                          Show Discount
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={() => {
                            setShowPrev(false)
                            setShowPrevOrder(null)
                          }}>
                          Back
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm max-h-[665px] h-auto overflow-y-auto">
                  <div className="grid gap-3">
                    <div className="font-semibold">Order Details</div>
                    <ul className="grid gap-3 max-h-[300px] h-auto overflow-y-auto">
                      {showPrevOrder.AccessoriesOnOrders && showPrevOrder.AccessoriesOnOrders.map((result, index) => (
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
                        <span>${ }</span>
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
                                defaultValue={showPrevOrder.id}
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
                                defaultValue={showPrevOrder.id}
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
                                <Percent className="absolute right-10 top-[9px] h-4 w-4 text-foreground" />
                                <Button
                                  type="submit"
                                  size="icon"

                                  disabled={!discPer}
                                  className='bg-primary mr-2 absolute right-1.5 top-[9px] h-4 w-4 text-foreground '>
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
                        <span>${ }</span>
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
                            {showPrevOrder.Clientfile.firstName}{" "}
                            {showPrevOrder.Clientfile.lastName}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Email</dt>
                          <dd>
                            <a href="mailto:">{showPrevOrder.Clientfile.email}</a>
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Phone</dt>
                          <dd>
                            <a href="tel:">{showPrevOrder.Clientfile.phone}</a>
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Address</dt>
                          <dd>
                            <address className="grid gap-0.5 not-italic  ">
                              <span className='text-right'>{showPrevOrder.Clientfile.address}</span>
                              <span>
                                {showPrevOrder.Clientfile.city},{" "}
                                {showPrevOrder.Clientfile.province}{" "}
                                {showPrevOrder.Clientfile.postal}
                              </span>
                            </address>
                          </dd>
                        </div>
                      </dl>
                    </>)}
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Payment Information</div>
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
                    </dl>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid gap-3">
                    <div className="font-semibold">Payment</div>
                    <ul className="grid gap-3">
                      {showPrevOrder.Payments && showPrevOrder.Payments.map((result, index) => (
                        <li className="flex items-center justify-between" key={index}                    >
                          <span className="text-muted-foreground">{result.paymentType}</span>
                          <span>${result.amountPaid}</span>
                        </li>
                      ))}
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Balance</span>
                        <span>${parseFloat(total) - parseFloat(totalAmountPaid)}</span>
                      </li>
                    </ul>
                  </div>

                </CardContent>
                <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Updated{" "}
                    <time dateTime="2023-11-23">
                      {new Date(showPrevOrder.createdAt).toLocaleDateString(
                        "en-US",
                        options2
                      )}
                    </time>
                  </div>
                </CardFooter>
              </Card>
            </>
          ) : (
            <>
              {lastOrder && (
                <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
                  <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Last Order
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
                        {new Date(lastOrder.createdAt).toLocaleDateString(
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
                          <DropdownMenuItem>Go To Order</DropdownMenuItem>
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
                        {lastOrder.AccessoriesOnOrders && lastOrder.AccessoriesOnOrders.map((result, index) => (
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
                                  defaultValue={lastOrder.id}
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
                                  defaultValue={lastOrder.id}
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
                                  <Percent className="absolute right-10 top-[9px] h-4 w-4 text-foreground" />
                                  <Button
                                    type="submit"
                                    size="icon"

                                    disabled={!discPer}
                                    className='bg-primary mr-2 absolute right-1.5 top-[9px] h-4 w-4 text-foreground '>
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
                              {lastOrder.Clientfile.firstName}{" "}
                              {lastOrder.Clientfile.lastName}
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Email</dt>
                            <dd>
                              <a href="mailto:">{lastOrder.Clientfile.email}</a>
                            </dd>
                          </div>
                          <div className="flex items-center justify-between">
                            <dt className="text-muted-foreground">Phone</dt>
                            <dd>
                              <a href="tel:">{lastOrder.Clientfile.phone}</a>
                            </dd>
                          </div>
                        </dl>
                      </>)}
                    </div>
                    <Separator className="my-4" />
                    <div className="grid gap-3">
                      <div className="font-semibold">Payment Information</div>
                      <dl className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <dt className="flex items-center gap-1 text-muted-foreground">
                            <CreditCard className="h-4 w-4" />
                            {lastOrder.paymentType}
                          </dt>
                          {lastOrder.cardNum}
                        </div>
                      </dl>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50 px-6 py-3">
                    <div className="text-xs text-muted-foreground">
                      Updated{" "}
                      <time dateTime="2023-11-23">
                        {new Date(lastOrder.createdAt).toLocaleDateString(
                          "en-US",
                          options2
                        )}
                      </time>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
function SimplerStaticVersion() {
  return (
    <p>Not working contact support...</p>
  )
}

async function getTotalFromLast7Days() {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  console.log("Today's Date:", today);
  console.log("Seven Days Ago:", sevenDaysAgo);

  const allOrders = await prisma.accOrder.findMany({
    select: {
      id: true,
      createdAt: true,
      total: true,
    },
  });

  const filteredOrders = allOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= sevenDaysAgo && orderDate <= today;
  });

  const sumTotal = filteredOrders.reduce((sum, order) => {
    const total = parseFloat(order.total || "0");
    console.log(`Order Total: ${order.total} Parsed Total: ${total}`);
    return sum + total;
  }, 0);

  const formattedSumTotal = sumTotal.toFixed(2);

  console.log(
    "Total sum of orders from last 7 days:",
    formattedSumTotal,
    sumTotal,
    filteredOrders,
    allOrders
  );
  return formattedSumTotal;
}


async function getTotalFromLast30Days() {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 30);

  console.log("Today's Date:", today);
  console.log("Seven Days Ago:", sevenDaysAgo);

  const allOrders = await prisma.accOrder.findMany({
    select: {
      id: true,
      createdAt: true,
      total: true,
    },
  });

  const filteredOrders = allOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= sevenDaysAgo && orderDate <= today;
  });

  const sumTotal = filteredOrders.reduce((sum, order) => {
    const total = parseFloat(order.total || "0");
    console.log(`Order Total: ${order.total} Parsed Total: ${total}`);
    return sum + total;
  }, 0);

  const formattedSumTotal = sumTotal.toFixed(2);

  console.log(
    "Total sum of orders from last 7 days:",
    formattedSumTotal,
    sumTotal,
    filteredOrders,
    allOrders
  );
  return formattedSumTotal;
}
/** <TabsContent value="Print Labels">
              <Tabs defaultValue="Labels">
                <TabsList>
                  <TabsTrigger value="Labels">Labels</TabsTrigger>
                  <TabsTrigger value="Label Maker">Label Maker</TabsTrigger>
                </TabsList>
                <TabsContent value="Labels">
                  <div>
                    <div className='flex'>
                      <products.Form method="get" action='/dealer/accessories/products/search'>
                        <div className="relative ml-auto flex-1 md:grow-0 ">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            ref={ref}
                            type="search"
                            name="q"
                            onChange={e => {
                              //   search.submit(`/dealer/accessories/search?name=${e.target.value}`);
                              products.submit(e.currentTarget.form);
                            }}
                            placeholder="Search..."
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                          />
                        </div>
                      </products.Form>
                      <div className='grid grid-cols-1' >
                        <div id="sourceSelectPanel" className='mx-auto w-[100%] mt-2' style={{ display: 'none' }}>
                          <select id="sourceSelect" className='w-[100%] text-sm mx-auto rounded-lg px-3 py-1 bg-background text-foreground border-border border' style={{ maxWidth: '400px' }}></select>
                        </div>
                        <div className='flex  justify-between' >
                          <div className='flex flex-col mt-auto'>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 gap-1 text-sm mb-3 bg-primary"
                              id="startButton"
                            >
                              <Scan className="h-3.5 w-3.5" />
                              <span className="sr-only sm:not-sr-only text-foreground">Scan</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 gap-1 text-sm  "
                              id="resetButton"
                            >
                              <Scan className="h-3.5 w-3.5" />
                              <span className="sr-only sm:not-sr-only text-foreground">Reset</span>
                            </Button>
                          </div>
                          <div className='grid grid-cols-1 ml-2 mt-auto ' >
                            <div className='rounded-[5px] border border-border mx-auto mt-auto' style={{ padding: 0, width: '150px', maxHeight: '100px', overflow: 'hidden', }}>
                              <video id="video" style={{ width: '150px', maxHeight: '100px', }}></video>
                            </div>
                          </div>
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

                      </div>
                    </div>
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
                                  <div>
                                    {result.price}
                                  </div>
                                </TableCell>
                                <TableCell className="">
                                  {result.location}
                                </TableCell>
                                <TableCell className="">
                                  {result.id}
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    min="1"
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
                    <pre>{JSON.stringify(localData, null, 2)}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="Label Maker">
                  <ClientOnly fallback={<SimplerStaticVersion />} >
                    {() => (
                      <PrintLabels inputs={localData} />
                    )}
                  </ClientOnly>
                </TabsContent>
              </Tabs>
            </TabsContent> */
