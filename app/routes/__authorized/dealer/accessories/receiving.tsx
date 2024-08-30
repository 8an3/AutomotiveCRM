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
  User2,
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
import { Outlet, Link, useLoaderData, useFetcher, useNavigate } from "@remix-run/react";
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
import { EditableText } from "~/components/actions/shared";
import { Pencil } from "lucide-react";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { FaMotorcycle } from "react-icons/fa";


export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email");

  const user = await GetUser(email);
  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.accOrder.findMany({
    where: { status: 'On Order' },
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
      AccessoriesOnOrders: {
        select: {
          id: true,
          quantity: true,
          accOrderId: true,
          status: true,
          orderNumber: true,
          OrderInvId: true,
          accessoryId: true,
        }
      },
      Clientfile: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          financeId: true,
          userId: true,
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
          Finance: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              name: true,
              address: true,
              city: true,
              postal: true,
              province: true,
              dl: true,
              typeOfContact: true,
              timeToContact: true,
              dob: true,
              AccOrders: {
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
                  AccessoriesOnOrders: {
                    select: {
                      id: true,
                      quantity: true,
                      accOrderId: true,
                      status: true,
                      orderNumber: true,
                      OrderInvId: true,
                    }
                  }
                }
              }
            },
          },
          AccOrder: {
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
              AccessoriesOnOrders: {
                select: {
                  id: true,
                  quantity: true,
                  accOrderId: true,
                  status: true,
                  orderNumber: true,
                  OrderInvId: true,
                  accessoryId: true,
                }
              }
            }
          }
        }
      },

    }
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

export async function action({ request, params }: LoaderFunction) {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
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
  if (intent === 'updateProductCost') {
    const update = await prisma.accessories.update({
      where: { id: formData.id },
      data: {
        [formPayload.colName]: parseFloat(formPayload.name),
      }
    })
    console.log(update, 'update')
    return json({ update })
  }

  const hasAdminPosition = user?.positions.some(position => position.position === 'Administrator' || position.position === 'Manager');

  if (hasAdminPosition) {
    if (intent === 'updateProductManager') {
      const update = await prisma.accessories.update({
        where: { id: formData.id },
        data: {
          [formPayload.colName]: formPayload.name,
        }
      })
      console.log(update, 'update')
      return json({ update })
    } else if (intent === 'updateProductManagerCost') {
      const update = await prisma.accessories.update({
        where: { id: formData.id },
        data: {
          [formPayload.colName]: parseFloat(formPayload.name),
        }
      })
      console.log(update, 'update')
      return json({ update })
    } else return null
  }
}

export function playScanSound() {
  const audio = new Audio(ScanSound);
  audio.play();
}

export default function Purchase() {
  const { user, orders, sevTotal, tax, filteredOrders30, thiryTotal } = useLoaderData();
  let ref = useRef();
  let search = useFetcher();
  const navigate = useNavigate()
  const [ordersList, setOrdersList] = useState([]);
  useEffect(() => {
    setOrdersList(ordersList);
  }, []);

  const taxMultiplier = Number(tax.userTax);

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
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const [showPrevOrder, setShowPrevOrder] = useState(null)
  const [showPrev, setShowPrev] = useState(false)


  const [discount, setDiscount] = useState(false)
  let formRef = useRef();
  let addProduct = useFetcher();

  const [selectedPart, setSelectedPart] = useState({})



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
          if (event.key === 'F1') {
            event.preventDefault();
            codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video', hints).then((result) => {
              console.log(result);
              /// document.getElementById('result').textContent = result.text;
              setScannedCode(result.text)
            }).catch((err) => {
              console.error(err);
              //  document.getElementById('result').textContent = err;
            });
          }
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
          setSelectedPart(result[0])
          //     const formData = new FormData();
          // formData.append("orderId", order.id);
          //    formData.append("accId", result[0].id);
          //     formData.append("intent", 'updateOrder');
          //     console.log(formData, 'formData');

          ///     addProduct.submit(formData, { method: "post" });
        }
      } catch (err) {
        console.error('error', err);
      }
    }

  }, [scannedCode]);

  const [clients, setClients] = useState([]);
  const [finances, setFinances] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);

  console.log(orders, 'orders')
  useEffect(() => {
    let clientsFilter
    if (orders.Clientfile) {
      clientsFilter = orders.filter((order) =>
        order.Clientfile?.some((client) =>
          client.Finance?.some((finance) =>
            finance.AccOrders.some((accOrder) =>
              accOrder.AccessoriesOnOrders.some((accessory) =>
                accessory.accessoryId.includes(scannedCode)
              )
            )
          )
        )
      );
    }
    if (clientsFilter) { setClients(clientsFilter) }
  }, [scannedCode]);

  useEffect(() => {
    let financesFilter
    if (orders.Finance) {
      financesFilter = orders.filter((result) =>
        result.Finance?.some((finance) =>
          finance.AccOrder?.some((accOrder) =>
            accOrder.AccessoriesOnOrders.some((accessory) =>
              accessory.accessoryId.includes(scannedCode)
            )
          )
        )
      );
    }
    if (financesFilter) { setFinances(financesFilter) }
  }, [scannedCode]);

  useEffect(() => {
    let workOrdersFilter
    if (orders.WorkOrder) {
      workOrdersFilter = orders.filter((result) =>
        result.WorkOrder?.some((finance) =>
          finance.AccOrder?.some((accOrder) =>
            accOrder.AccessoriesOnOrders.some((accessory) =>
              accessory.accessoryId.includes(scannedCode)
            )
          )
        )
      );
    }
    if (workOrdersFilter) { setWorkOrders(workOrdersFilter) }
  }, [scannedCode]);


  useEffect(() => {

  }, [scannedCode]);

  const filteredOrders = orders.filter(order =>
    order.AccessoriesOnOrders.some(accessory =>
      accessory.accessoryId === scannedCode && accessory.status === 'On Order'
    )
  );

  // Now, you can categorize them based on their associations

  // Orders related to Clientfile
  const clientfileOrders = filteredOrders.filter(order =>
    order.clientfileId !== null
  );

  // Orders related to Finance
  const financeOrders = filteredOrders.filter(order =>
    order.financeId !== null
  );

  // Orders related to WorkOrder
  const workOrderOrders = filteredOrders.filter(order =>
    order.workOrderId !== null
  );

  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>
                        Product Search
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <div className='flex flex-col gap-2'>
                        <p>Shortcut Tooltip</p>
                        <p>F1 - start scanner</p>
                        <p>F2 - reset scanner</p>
                        <p>F3 - Open global search</p>
                        <p>F4 - Open menu</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
                <CardDescription className='flex items-start flex-col'>
                  <p className='mt-4'>Search By Description</p>

                  <search.Form method="get" action='/dealer/accessories/products/search' className='my-4'>
                    <div className="relative ml-auto flex-1 md:grow-0 ">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={ref}
                        type="search"
                        name="q"
                        onChange={e => {
                          //   search.submit(`/dealer/accessories/search?name=${e.target.value}`);
                          search.submit(e.currentTarget.form);
                        }}
                        autoFocus
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                      />

                    </div>
                  </search.Form>
                  <p className='mt-4'>Search By ID</p>
                  <search.Form method="get" action='/dealer/accessories/products/search/id' className='my-4'>
                    <div className="relative ml-auto flex-1 md:grow-0 ">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={ref}
                        type="search"
                        name="q"
                        onChange={e => {
                          //   search.submit(`/dealer/accessories/search?name=${e.target.value}`);
                          search.submit(e.currentTarget.form);
                          setScannedCode(e.currentTarget)
                        }}
                        autoFocus
                        placeholder="Search..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                      />

                    </div>
                  </search.Form>
                </CardDescription>
              </CardHeader>
            </Card>
            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>Scanner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative flex-1 md:grow-0   ">
                  <main className="wrapper text-white mx-auto " >
                    <section className="container" id="demo-content">
                      <div className='flex items-center'>

                        <div className='flex flex-col items-center  mx-auto' >
                          <div className='rounded-[5px] border border-border relative  group' style={{ padding: 0, width: '150px', maxHeight: '100px', overflow: 'hidden', border: ' ' }}>
                            <video id="video" className='' style={{ width: '150px' }}></video>
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
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription>Last 30 Days</CardDescription>
                <CardTitle className="text-4xl">${thiryTotal}</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter>
                <Progress value={12} aria-label="12% increase" />
              </CardFooter>
            </Card>
          </div>
          <Tabs defaultValue="Products">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="Products">Products</TabsTrigger>
                <TabsTrigger value="Client With Orders">Client With Orders</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="Products">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                  </CardDescription>
                </CardHeader>
                <CardContent className='max-h-[455px] h-auto overflow-y-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow className='border-border'>
                        <TableHead>
                          Brand & Name
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Description
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Category
                        </TableHead>
                        <TableHead className="hidden">
                          Sub Category
                        </TableHead>
                        <TableHead className="hidden">
                          On Order
                        </TableHead>
                        <TableHead className="hidden">
                          Distributer
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Location
                        </TableHead>
                        <TableHead className="hidden">
                          Cost
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Price
                        </TableHead>
                        <TableHead className="text-right">
                          Quantity
                        </TableHead>
                        <TableHead className="text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className='max-h-[700px] h-auto overflow-y-auto'>
                      {search.data &&
                        search.data.map((result, index) => (
                          <TableRow key={index} className="hover:bg-accent border-border">
                            <TableCell>
                              <div className="font-medium">
                                <EditableText
                                  value={result.name}
                                  fieldName="name"
                                  inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  "
                                  buttonClassName="text-center py-1 px-2 text-foreground"
                                  buttonLabel={`Edit name`}
                                  inputLabel={`Edit name`}
                                >
                                  <input type="hidden" name="intent" value='updateProductManager' />
                                  <input type="hidden" name="id" value={result.id} />
                                  <input type="hidden" name="colName" value='name' />
                                </EditableText>
                              </div>
                              <div className="text-sm text-muted-foreground ">
                                <EditableText
                                  value={result.brand}
                                  fieldName="name"
                                  inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  "
                                  buttonClassName="text-center py-1 px-2 text-muted-foreground"
                                  buttonLabel={`Edit brand`}
                                  inputLabel={`Edit brand`}
                                >
                                  <input type="hidden" name="intent" value='updateProductManager' />
                                  <input type="hidden" name="id" value={result.id} />
                                  <input type="hidden" name="colName" value='brand' />
                                </EditableText>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <EditableText
                                value={result.description}
                                fieldName="name"
                                inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  "
                                buttonClassName="text-center py-1 px-2 text-muted-foreground"
                                buttonLabel={`Edit description`}
                                inputLabel={`Edit description`}
                              >
                                <input type="hidden" name="intent" value='updateProductManager' />
                                <input type="hidden" name="id" value={result.id} />
                                <input type="hidden" name="colName" value='description' />
                              </EditableText>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <EditableText
                                value={result.category}
                                fieldName="name"
                                inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  "
                                buttonClassName="text-center py-1 px-2 text-muted-foreground"
                                buttonLabel={`Edit category`}
                                inputLabel={`Edit category`}
                              >
                                <input type="hidden" name="intent" value='updateProductManager' />
                                <input type="hidden" name="id" value={result.id} />
                                <input type="hidden" name="colName" value='category' />
                              </EditableText>
                            </TableCell>
                            <TableCell className="hidden ">
                              <EditableText
                                value={result.subCategory}
                                fieldName="name"
                                inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2"
                                buttonClassName="text-center py-1 px-2 text-muted-foreground"
                                buttonLabel={`Edit subCategory`}
                                inputLabel={`Edit subCategory`}
                              >
                                <input type="hidden" name="intent" value='updateProductManager' />
                                <input type="hidden" name="id" value={result.id} />
                                <input type="hidden" name="colName" value='subCategory' />
                              </EditableText>
                            </TableCell>
                            <TableCell className="hidden">
                              <EditableText
                                value={result.onOrder}
                                fieldName="name"
                                inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[30px] "
                                buttonClassName="text-center py-1 px-2 text-foreground"
                                buttonLabel={`Edit onOrder`}
                                inputLabel={`Edit onOrder`}
                              >
                                <input type="hidden" name="intent" value='updateProductManager' />
                                <input type="hidden" name="id" value={result.id} />
                                <input type="hidden" name="colName" value='onOrder' />
                              </EditableText>
                            </TableCell>
                            <TableCell className="hidden ">
                              <EditableText
                                value={result.distributer}
                                fieldName="name"
                                inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  "
                                buttonClassName="text-center py-1 px-2 text-muted-foreground"
                                buttonLabel={`Edit distributer`}
                                inputLabel={`Edit distributer`}
                              >
                                <input type="hidden" name="intent" value='updateProductManager' />
                                <input type="hidden" name="id" value={result.id} />
                                <input type="hidden" name="colName" value='distributer' />
                              </EditableText>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <EditableText
                                value={result.location}
                                fieldName="name"
                                inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 "
                                buttonClassName="text-center py-1 px-2 text-foreground"
                                buttonLabel={`Edit location`}
                                inputLabel={`Edit location`}
                              >
                                <input type="hidden" name="intent" value='updateProduct' />
                                <input type="hidden" name="id" value={result.id} />
                                <input type="hidden" name="colName" value='location' />
                              </EditableText>
                            </TableCell>
                            <TableCell className="hidden">
                              <EditableText
                                value={result.cost}
                                fieldName="name"
                                inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[50px] "
                                buttonClassName="text-center py-1 px-2 text-foreground"
                                buttonLabel={`Edit cost`}
                                inputLabel={`Edit cost`}
                              >
                                <input type="hidden" name="intent" value='updateProductManagerCost' />
                                <input type="hidden" name="id" value={result.id} />
                                <input type="hidden" name="colName" value='cost' />
                              </EditableText>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <EditableText
                                value={result.price}
                                fieldName="name"
                                inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[50px] "
                                buttonClassName="text-center py-1 px-2 text-foreground"
                                buttonLabel={`Edit price`}
                                inputLabel={`Edit price`}
                              >
                                <input type="hidden" name="intent" value='updateProductManagerCost' />
                                <input type="hidden" name="id" value={result.id} />
                                <input type="hidden" name="colName" value='price' />
                              </EditableText>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <EditableText
                                value={result.quantity}
                                fieldName="name"
                                inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[30px] "
                                buttonClassName="text-right py-1 px-2 text-foreground"
                                buttonLabel={`Edit quantity`}
                                inputLabel={`Edit quantity`}
                              >
                                <input type="hidden" name="intent" value='updateProductCost' />
                                <input type="hidden" name="id" value={result.id} />
                                <input type="hidden" name="colName" value='quantity' />
                              </EditableText>
                            </TableCell>
                            <TableCell className="">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    className='bg-primary mx-auto'
                                    onClick={() => setSelectedPart(result)} >
                                    <Pencil className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <div className='flex flex-col gap-2'>
                                    <p>Edit the part information</p>
                                  </div>
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
            <TabsContent value="Client With Orders">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Client</CardTitle>
                  <CardDescription>
                  </CardDescription>
                </CardHeader>
                <CardContent className='max-h-[455px] h-auto overflow-y-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow className='border-border'>
                        <TableHead>
                          Customer
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Phone
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Email
                        </TableHead>
                        <TableHead className="hidden">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className='max-h-[700px] h-auto overflow-y-auto'>
                      {clientfileOrders &&
                        clientfileOrders.map((result, index) => (
                          <TableRow key={index} className="hover:bg-accent border-border">
                            <TableCell>
                              {result.Clientfile.firstName} {result.Clientfile.lastName}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {result.Clientfile.phone}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {result.Clientfile.email}
                            </TableCell>
                            <TableCell className="">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    className='bg-primary mx-auto'
                                    onClick={() =>
                                      navigate(`/dealer/customer/${result.Clientfile.id}`)
                                    } >
                                    <User2 className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <div className='flex flex-col gap-2'>
                                    <p>Customer File</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    className='bg-primary mx-auto ml-3'
                                    onClick={() =>
                                      navigate(`/dealer/accessories/newOrder/${result.id}`)
                                    } >
                                    <ShoppingCart className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <div className='flex flex-col gap-2'>
                                    <p>Accessory Order</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    className='bg-primary mx-auto ml-3'
                                    onClick={() =>
                                      navigate(`/dealer/customer/${result.Clientfile.id}/${result.finance.id}`)
                                    } >
                                    <FaMotorcycle className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <div className='flex flex-col gap-2'>
                                    <p>Finance File</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-05-chunk-3" className='my-4'>
                <CardHeader className="px-7">
                  <CardTitle>Contracts</CardTitle>
                  <CardDescription>
                  </CardDescription>
                </CardHeader>
                <CardContent className='max-h-[455px] h-auto overflow-y-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow className='border-border'>
                        <TableHead>
                          Customer
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Phone
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Email
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Order Created
                        </TableHead>
                        <TableHead className="hidden">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className='max-h-[700px] h-auto overflow-y-auto'>
                      {financeOrders &&
                        financeOrders.map((result, index) => (
                          <TableRow key={index} className="hover:bg-accent border-border">
                            <TableCell>
                              {result.Clientfile.firstName} {result.Clientfile.lastName}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {result.Clientfile.phone}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {result.Clientfile.email}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {result.createdAt}
                            </TableCell>

                            <TableCell className="">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    className='bg-primary mx-auto'
                                    onClick={() =>
                                      navigate(`/dealer/customer/${result.clientfileId}`)
                                    } >
                                    <User2 className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <div className='flex flex-col gap-2'>
                                    <p>Customer File</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    className='bg-primary mx-auto ml-3'
                                    onClick={() =>
                                      navigate(`/dealer/accessories/newOrder/${result.id}`)
                                    } >
                                    <ShoppingCart className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <div className='flex flex-col gap-2'>
                                    <p>Accessory Order</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    className='bg-primary mx-auto ml-3'
                                    onClick={() =>
                                      navigate(`/dealer/customer/${result.clientfileId}/${result.financeId}`)
                                    } >
                                    <FaMotorcycle className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <div className='flex flex-col gap-2'>
                                    <p>Finance File</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-05-chunk-3" className='my-4'>
                <CardHeader className="px-7">
                  <CardTitle>Work Orders</CardTitle>
                  <CardDescription>
                  </CardDescription>
                </CardHeader>
                <CardContent className='max-h-[455px] h-auto overflow-y-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow className='border-border'>
                        <TableHead>
                          Customer
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Phone
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Email
                        </TableHead>
                        <TableHead className="hidden">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className='max-h-[700px] h-auto overflow-y-auto'>
                      {workOrderOrders &&
                        workOrderOrders.map((result, index) => (
                          <TableRow key={index} className="hover:bg-accent border-border">
                            <TableCell>
                              {result.Clientfile.firstName} {result.Clientfile.lastName}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {result.Clientfile.phone}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {result.Clientfile.email}
                            </TableCell>
                            <TableCell className="">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    className='bg-primary mx-auto'
                                    onClick={() =>
                                      navigate(`/dealer/customer/${result.Clientfile.id}`)
                                    } >
                                    <User2 className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <div className='flex flex-col gap-2'>
                                    <p>Customer File</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    className='bg-primary mx-auto ml-3'
                                    onClick={() =>
                                      navigate(`/dealer/accessories/newOrder/${result.id}`)
                                    } >
                                    <ShoppingCart className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <div className='flex flex-col gap-2'>
                                    <p>Accessory Order</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size='icon'
                                    className='bg-primary mx-auto ml-3'
                                    onClick={() =>
                                      navigate(`/dealer/customer/${result.Clientfile.id}/${result.finance.id}`)
                                    } >
                                    <FaMotorcycle className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <div className='flex flex-col gap-2'>
                                    <p>Finance File</p>
                                  </div>
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
          </Tabs>
        </div>
        <div>
          <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Part / Accessory
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
                  <div className='flex flex-col'>
                    <EditableText
                      value={selectedPart.name}
                      fieldName="name"
                      inputClassName=" border border-border rounded-lg w-[50%] text-foreground bg-background py-1 px-2  "
                      buttonClassName="text-left py-1 px-2 text-foreground"
                      buttonLabel={`Edit name`}
                      inputLabel={`Edit name`}
                    >
                      <input type="hidden" name="intent" value='updateProductManager' />
                      <input type="hidden" name="id" value={selectedPart.id} />
                      <input type="hidden" name="colName" value='name' />
                    </EditableText>
                    <EditableText
                      value={selectedPart.brand}
                      fieldName="name"
                      inputClassName=" border border-border rounded-lg w-[50%] text-foreground bg-background py-1 px-2  "
                      buttonClassName="text-left py-1 px-2 text-muted-foreground"
                      buttonLabel={`Edit brand`}
                      inputLabel={`Edit brand`}
                    >
                      <input type="hidden" name="intent" value='updateProductManager' />
                      <input type="hidden" name="id" value={selectedPart.id} />
                      <input type="hidden" name="colName" value='brand' />
                    </EditableText>
                  </div>
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
                    <DropdownMenuItem>Reprint Receipt</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setDiscount((prevDiscount) => !prevDiscount)}>Show Discount</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => {
                      setShowPrev(false)
                      setShowPrevOrder(null)
                    }}>
                      Back
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-6 max-h-[665px] h-auto overflow-y-auto">
              <div className="grid gap-3">
                <div className="font-semibold">Part Details</div>
                <ul className="grid gap-3 max-h-[300px] h-auto overflow-y-auto">
                  <li className="flex items-center justify-between"  >
                    <div className="font-medium text-muted-foreground">
                      Part Number
                    </div>
                    <div className="hidden  md:inline text-right px-2">
                      {selectedPart.id}
                    </div>
                  </li>
                  <li className="flex items-center justify-between"  >
                    <div className="font-medium text-muted-foreground">
                      Description
                    </div>
                    <div className="hidden  md:inline">
                      <EditableText
                        value={selectedPart.description}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg w-[100%] text-foreground bg-background py-1 px-2  "
                        buttonClassName="text-right py-1 px-2 text-foreground"
                        buttonLabel={`Edit description`}
                        inputLabel={`Edit description`}
                      >
                        <input type="hidden" name="intent" value='updateProductManager' />
                        <input type="hidden" name="id" value={selectedPart.id} />
                        <input type="hidden" name="colName" value='description' />
                      </EditableText>
                    </div>
                  </li>
                  <li className="flex items-center justify-between"  >
                    <div className="hidden text-muted-foreground md:inline">
                      Category
                    </div>
                    <span>
                      <EditableText
                        value={selectedPart.category}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg w-[100%] text-foreground bg-background py-1 px-2  "
                        buttonClassName="text-right py-1 px-2 text-foreground"
                        buttonLabel={`Edit category`}
                        inputLabel={`Edit category`}
                      >
                        <input type="hidden" name="intent" value='updateProductManager' />
                        <input type="hidden" name="id" value={selectedPart.id} />
                        <input type="hidden" name="colName" value='category' />
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-center justify-between"  >
                    <div className="hidden text-muted-foreground md:inline">
                      Sub Category
                    </div>
                    <span>
                      <EditableText
                        value={selectedPart.subCategory}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg w-[100%] text-foreground bg-background py-1 px-2"
                        buttonClassName="text-right py-1 px-2 text-foreground"
                        buttonLabel={`Edit subCategory`}
                        inputLabel={`Edit subCategory`}
                      >
                        <input type="hidden" name="intent" value='updateProductManager' />
                        <input type="hidden" name="id" value={selectedPart.id} />
                        <input type="hidden" name="colName" value='subCategory' />
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-center justify-between"  >
                    <div className="hidden text-muted-foreground md:inline">
                      Location
                    </div>
                    <span>
                      <EditableText
                        value={selectedPart.location}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lgw-[100%]  text-foreground bg-background py-1 px-2 "
                        buttonClassName="text-right py-1 px-2 text-foreground"
                        buttonLabel={`Edit location`}
                        inputLabel={`Edit location`}
                      >
                        <input type="hidden" name="intent" value='updateProduct' />
                        <input type="hidden" name="id" value={selectedPart.id} />
                        <input type="hidden" name="colName" value='location' />
                      </EditableText>
                    </span>
                  </li>
                </ul>

                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between"  >
                    <div className="hidden text-muted-foreground md:inline">
                      Distributer
                    </div>
                    <span>
                      <EditableText
                        value={selectedPart.distributer}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg w-[100%] text-foreground bg-background py-1 px-2  "
                        buttonClassName="text-right py-1 px-2 text-muted-foreground"
                        buttonLabel={`Edit distributer`}
                        inputLabel={`Edit distributer`}
                      >
                        <input type="hidden" name="intent" value='updateProductManager' />
                        <input type="hidden" name="id" value={selectedPart.id} />
                        <input type="hidden" name="colName" value='distributer' />
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-center justify-between"  >
                    <div className="hidden text-muted-foreground md:inline">
                      On Order
                    </div>
                    <span>
                      <EditableText
                        value={selectedPart.onOrder}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[75px] "
                        buttonClassName="text-right py-1 px-2 text-foreground"
                        buttonLabel={`Edit On Order`}
                        inputLabel={`Edit On Order`}
                      >
                        <input type="hidden" name="intent" value='updateProductManagerCost' />
                        <input type="hidden" name="id" value={selectedPart.id} />
                        <input type="hidden" name="colName" value='onOrder' />
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-center justify-between"  >
                    <div className="hidden text-muted-foreground md:inline">
                      In stock
                    </div>
                    <span>
                      <EditableText
                        value={selectedPart.quantity}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[30px] "
                        buttonClassName="text-right py-1 px-2 text-foreground"
                        buttonLabel={`Edit quantity`}
                        inputLabel={`Edit quantity`}
                      >
                        <input type="hidden" name="intent" value='updateProduct' />
                        <input type="hidden" name="id" value={selectedPart.id} />
                        <input type="hidden" name="colName" value='quantity' />
                      </EditableText>
                    </span>
                  </li>
                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between"  >
                    <div className="hidden text-muted-foreground md:inline">
                      Cost
                    </div>
                    <span>
                      <EditableText
                        value={selectedPart.cost}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[50px] "
                        buttonClassName="text-center py-1 px-2 text-foreground"
                        buttonLabel={`Edit cost`}
                        inputLabel={`Edit cost`}
                      >
                        <input type="hidden" name="intent" value='updateProductManagerCost' />
                        <input type="hidden" name="id" value={selectedPart.id} />
                        <input type="hidden" name="colName" value='cost' />
                      </EditableText>
                    </span>
                  </li>
                  <li className="flex items-center justify-between"  >
                    <div className="hidden text-muted-foreground md:inline">
                      Price
                    </div>
                    <span>
                      <EditableText
                        value={selectedPart.price}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2 w-[50px] "
                        buttonClassName="text-center py-1 px-2 text-foreground"
                        buttonLabel={`Edit price`}
                        inputLabel={`Edit price`}
                      >
                        <input type="hidden" name="intent" value='updateProductManagerCost' />
                        <input type="hidden" name="id" value={selectedPart.id} />
                        <input type="hidden" name="colName" value='price' />
                      </EditableText>
                    </span>
                  </li>

                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Note</span>
                    <span>
                      <EditableText
                        value={selectedPart.note}
                        fieldName="name"
                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  "
                        buttonClassName="text-center py-1 px-2 text-foreground"
                        buttonLabel={`Edit name`}
                        inputLabel={`Edit name`}
                      >
                        <input type="hidden" name="intent" value='updateProductManager' />
                        <input type="hidden" name="id" value={selectedPart.note} />
                        <input type="hidden" name="colName" value='note' />
                      </EditableText>
                      { }</span>
                  </li>
                </ul>
              </div>

            </CardContent>
            <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">

                <time dateTime="2023-11-23">
                  {new Date().toLocaleDateString(
                    "en-US",
                    options2
                  )}
                </time>
              </div>
            </CardFooter>
          </Card>
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
