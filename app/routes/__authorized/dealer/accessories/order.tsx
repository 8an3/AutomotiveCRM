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
  Users2Icon,
  Eye,
  Navigation,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
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
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { ArrowDownUp } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import axios from "axios";
import { FileCheck } from "lucide-react";
import PrintReceipt from "../document/printReceiptAcc.client";
import { Users } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Avatar } from "~/components";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
import { ColumnDef, ColumnFiltersState, FilterFn, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, sortingFns, } from "@tanstack/react-table"
import { fuzzyFilter, fuzzySort, TableMeta, getTableMeta, DebouncedInput } from "~/components/shared/shared";
import { DataTablePagination } from "~/components/dashboard/calls/pagination";

export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email");

  const user = await GetUser(email);
  if (!user) { redirect("/login"); }

  const orders = await prisma.accOrder.findMany({
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
              id: true,
              createdAt: true,
              updatedAt: true,
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
          createdAt: true,
          paymentType: true,
          amountPaid: true,
          cardNum: true,
          receiptId: true,
          financeId: true,
          userEmail: true,
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

  const dealerImage = await prisma.dealerLogo.findUnique({ where: { id: 1 } })

  return json({ orders, user, sevTotal, tax, filteredOrders30, thiryTotal, dealerImage });
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
  const user = await GetUser(email)
  console.log(formPayload, 'from actiuon')
  if (intent === "scanOrder") {
    await prisma.customerSync.update({
      where: { userEmail: email },
      data: { orderId: formPayload.orderId }
    });
    return redirect('/dealer/accessories/currentOrder')
  }
  if (formPayload.intent === 'createNewOrder') {
    const order = await prisma.accOrder.create({
      data: {
        userName: user.name,
        userEmail: email,
        dept: 'Accessories',
        status: 'Quote',
        total: 0.00,
        clientfileId: formPayload.clientfileId,
      }
    })
    await prisma.customerSync.update({
      where: { userEmail: email },
      data: { orderId: order.id }
    })
    return redirect(`/dealer/accessories/newOrder/${order.id}`)
  }
  return null;
}

export default function Purchase() {
  const { user, orders, sevTotal, tax, filteredOrders30, thiryTotal, dealerImage } = useLoaderData();
  let ref = useRef();
  let payment = useFetcher();
  let search = useFetcher();
  const submit = useSubmit();
  const navigate = useNavigate()
  const [ordersList, setOrdersList] = useState([]);
  const userIsManager = user.positions.some(
    (pos) => pos.position === 'Manager' || pos.position === 'Administrator'
  );
  const [referrer, setReferrer] = useState()

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
    hour12: false,
    timeZoneName: "short"
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

  let totalAccessoriesCost;
  let totalAmountPaid;
  if (lastOrder) {
    totalAmountPaid = calculateTotalAmountPaid(lastOrder)
    totalAccessoriesCost = calculateTotalAccessoriesCost(lastOrder);
  }
  useEffect(() => {

  }, []);

  useEffect(() => {
    if (showPrevOrder) {
      totalAmountPaid = calculateTotalAmountPaid(showPrevOrder)
      totalAccessoriesCost = calculateTotalAccessoriesCost(showPrevOrder)
    }
  }, [showPrevOrder]);

  const [paymentType, setPaymentType] = useState('');
  const [discount, setDiscount] = useState(false)
  const [custInfo, setCustInfo] = useState(false)
  let fetcher = useFetcher();
  let buttonRef = useRef<HTMLButtonElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);
  let products = useFetcher();

  let addProduct = useFetcher();
  let formRef = useRef();

  const [discDollar, setDiscDollar] = useState(0.00)
  const [discPer, setDiscPer] = useState(0.00)

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

  const [pageIndex, setPageIndex] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // ---- pagination parts
  const [partsTable, setPartsTable] = useState([]);
  const swrFetcher = url => axios.get(url).then(res => res.data)
  const { data: partsData } = useSWR(`/dealer/api/orders/parts/${pageIndex}/${perPage}`, swrFetcher, { refreshInterval: 20000 });
  useEffect(() => { if (partsData) { setPartsTable(partsData.allOrders) } }, [partsData]);
  // ---- pagination parts
  // ---- pagination acc
  const [accTable, setAccTable] = useState([]);
  const { data: dataAcc } = useSWR(`/dealer/api/orders/accessories/${pageIndex}/${perPage}`, swrFetcher, { refreshInterval: 20000 });

  useEffect(() => { if (dataAcc) { setAccTable(dataAcc.allOrders) } }, [dataAcc]);

  // ---- pagination acc
  // ---- pagination all orders
  const [pageIndexAll, setPageIndexAll] = useState(1);
  const [perPageAll, setPerPageAll] = useState(10);
  const [accTableAll, setAccTableAll] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const { data: dataAll } = useSWR(`/dealer/api/orders/all/${pageIndexAll}/${perPageAll}`, swrFetcher, { refreshInterval: 20000 });

  useEffect(() => { if (dataAll) { setAccTableAll(dataAll) } }, [dataAll]);

  const totalOrders = accTableAll.total;
  const totalPages = Math.ceil(totalOrders / perPageAll);
  const maxPages = 5;
  const halfMaxPages = Math.floor(maxPages / 2);
  const pageNumbers = [];

  let startPage = Math.max(pageIndexAll - halfMaxPages, 1);
  let endPage = startPage + maxPages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxPages + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (page) => {
    setPageIndexAll(page);
  };

  // ---- pagination all orders
  let toReceipt
  if (showPrevOrder) {
    const client = showPrevOrder.Clientfile
    const maxAccessories = 19;

    toReceipt = {
      qrCode: showPrevOrder.id,
      subTotal: `$${totalAccessoriesCost.toFixed(2)}`,
      tax: `${tax.userTax}%`,
      total: `$${total}`,
      remaining: `$${parseFloat(total) - parseFloat(totalAmountPaid)}`,
      firstName: client.firstName,
      lastName: client.lastName,
      phone: client.phone,
      email: client.email,
      address: client.address,
      date: new Date().toLocaleDateString("en-US", options2),
      cardNum: '',
      paymentType: '',
      image: dealerImage.dealerLogo
    };

    showPrevOrder.AccessoriesOnOrders.forEach((result, index) => {
      if (index < maxAccessories) {
        toReceipt[`desc${index + 1}`] = `${result.accessory.brand} ${result.accessory.name}`;
        toReceipt[`qt${index + 1}`] = String(result.quantity);
        toReceipt[`price${index + 1}`] = String(result.accessory.price);
      }
    });

    for (let i = showPrevOrder.AccessoriesOnOrders.length + 1; i <= maxAccessories; i++) {
      toReceipt[`desc${i}`] = '';
      toReceipt[`qt${i}`] = '';
      toReceipt[`price${i}`] = '';
    }
  }
  // end of day
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const paidOrder = orders.filter(order => {
    if (order.paid === true) {
      const paidDate = new Date(order.paidDate);
      paidDate.setHours(0, 0, 0, 0);
      return paidDate.getTime() === todayDate.getTime();
    }
    return false;
  });

  const totalValue = paidOrder.reduce((sum, order) => sum + order.total, 0);
  const numberOfSales = paidOrder.length;


  //  table
  const [data, setData] = useState(orders);

  const defaultColumn = {
    cell: ({ row, column: { id } }) => {
      const data = row.original
      return (
        <p
          className="text-center py-1 px-2 text-foreground mx-auto flex justify-center"
        >
          {row.getValue(id)}
        </p>
      )
    },
  }

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const savedVisibility = user.ColumnStateInventory.state
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedModel, setSelectedModel] = useState({})
  const [filterBy, setFilterBy] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedGlobal, setSelectedGlobal] = useState(false);
  const [todayfilterBy, setTodayfilterBy] = useState(null);
  const [models, setModels] = useState([]);
  const [modelName, setModelName] = useState([]);
  const [subModel, setSubModel] = useState([]);

  const handleDropdownChange = (value) => {
    setGlobalFilter(value);
  };

  const [date, setDate] = useState<Date>()

  const newDate = new Date()
  const [datefloorPlanDueDate, setDatefloorPlanDueDate] = useState<Date>()


  const columns = [

    {
      id: 'Customer',
      accessorKey: "Customer",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,

      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <div className='grid grid-cols-1'>
            <p>{data.Clientfile.firstName} {data.Clientfile.lastName}</p>
            <p className='text-muted-foreground'>{data.Clientfile.email} </p>
          </div>
        )
      },
    },
    {
      id: 'Salesperson',
      accessorKey: "Salesperson",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,

      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <p>{data.userName} </p>
        )
      },
    },
    {
      id: 'status',
      accessorKey: "status",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => {
        return (
          <Select
            onValueChange={(value) => {
              const status = table.getColumn("status");
              status.setFilterValue(value);
            }}

            name='filter'>
            <SelectTrigger className="w-auto focus:border-primary mx-auto">
              <SelectValue placeholder='Filter' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="Quote">Quote</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Waiting On Parts">Waiting On Parts</SelectItem>
              <SelectItem value="Waiter">Waiter</SelectItem>
              <SelectItem value="In Works">In Works</SelectItem>
              <SelectItem value="Work Completed">Work Completed</SelectItem>
              <SelectItem value="Scheduled for Delivery">Scheduled for Delivery</SelectItem>
              <SelectItem value="Long Term Storage">Long Term Storage</SelectItem>
              <SelectItem value="Winter Storage">Winter Storage</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
    {
      id: 'status',
      accessorKey: "status",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => {
        return (
          <Select
            onValueChange={(value) => {
              let status = table.getColumn("status");
              status.setFilterValue(value);
            }}
            name='filter'>
            <SelectTrigger className="w-auto focus:border-primary mx-auto">
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent className='bg-background text-foreground border-border'>
              <SelectItem value="Quote">Quote</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="On Order">On Order</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
    {
      id: 'Dept',
      accessorKey: "Dept",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => {
        return (
          <p className='text-center'>Dept</p>
        )
      },
      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <p className='text-center'>{data.dept} </p>
        )
      },
    },
    {
      id: 'Date',
      accessorKey: "Date",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => {
        return (
          <p className='text-center'>Sale Date</p>
        )
      },
      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <p className='text-center'>{new Date(data.createdAt).toLocaleDateString("en-US", options2)}</p>
        )
      },
    },
    {
      id: 'total',
      header: ({ column }) => {
        return (
          <p className='text-center'>Amount</p>
        )
      },
      accessorKey: "total",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <p className='text-center'>{data.total}</p>
        )
      },
    },
    {
      id: 'paid',
      header: ({ column }) => {
        return (
          <p className='text-center'>Paid</p>
        )
      },
      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <p className='text-center'>  {data.paid ? (<Check className='mx-auto' />) : (<X className='mx-auto' />)}</p>
        )
      },
      accessorKey: "paid",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
    },
    {
      id: 'sellingDept',
      accessorKey: "sellingDept",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => {
        return (
          <p className='text-center'>Sent From</p>
        )
      },
      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <p className='text-center'>{data.sellingDept}</p>
        )
      },
    },
    {
      id: 'Actions',
      header: ({ column }) => {
        return (
          <p className='text-center'>Actions</p>
        )
      },
      accessorKey: "Actions",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: ({ row, column: { id } }) => {
        const data = row.original
        return (
          <div className='flex items-center'>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="mr-3 hover:bg-primary"
                  onClick={() => {
                    setValue(data.workOrderId);
                    showPrevOrderById(data.workOrderId)
                  }}
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Show Order
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/dealer/acceessories/order/${data.workOrderId}`} >

                  <Button
                    size="icon"
                    variant="ghost"
                    className="mr-3 hover:bg-primary"

                  >
                    <Navigation className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                Go To Order
              </TooltipContent>
            </Tooltip>
          </div>
        )
      },
    },
  ]
  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    filterFns: { fuzzy: fuzzyFilter, },
    globalFilterFn: 'fuzzy',
    initialState: { columnVisibility },

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,


    onRowSelectionChange: setRowSelection,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onGlobalFilterChange: setGlobalFilter,
    enableRowSelection: true,
  });

  // clears filters
  const setAllFilters = () => {
    setColumnFilters([]);
    setSorting([]);
    setFilterBy("");
    setGlobalFilter([]);
  };
  const toggleFilter = () => {
    setAllFilters()
    setShowFilter(!showFilter);
  };
  const setColumnFilterDropdown = (event) => {
    const columnId = event.target.getAttribute("data-value");
    setSelectedColumn(columnId);
    console.log("Selected column:", columnId);
    // Add your logic here to handle the column selection
  };
  const handleGlobalChange = (value) => {
    console.log("value", value);
    table.getColumn(selectedColumn)?.setFilterValue(value);
  };

  const CallsList = [
    {
      key: "inStock",
      name: "In Stock",
    },
    {
      key: "available",
      name: "Available",
    },
    {
      key: "inStockArrived",
      name: "In Stock and Available",
    },
    {
      key: "newStock",
      name: "New Stock",
    },
    {
      key: "usedStock",
      name: "Used Stock",
    },
    {
      key: "sold",
      name: "Sold",
    },
    {
      key: "otd",
      name: "Out The Door",
    },
    {
      key: "deposits",
      name: "Sold Units - Waiting To Be Picked Up",
    },
  ];
  const DeliveriesList = [
    {
      key: "todaysDeliveries",
      name: "Deliveries - Today",
    },
    {
      key: "tomorowsDeliveries",
      name: "Deliveries - Tomorrow",
    },
    {
      key: "yestDeliveries",
      name: "Deliveries - Yesterday",
    },
    {
      key: "deliveredThisMonth",
      name: "Delivered - Current Month",
    },
    {
      key: "deliveredLastMonth",
      name: "Delivered - Last Month",
    },
    {
      key: "deliveredThisYear",
      name: "Delivered - Year",
    },
  ];
  const DepositsTakenList = [
    {
      key: "depositsToday",
      name: "Deposit Taken - Need to Finalize Deal",
    },
  ];
  const handleFilterChange = (selectedFilter) => {
    setAllFilters()
    const customerStateColumn = table.getColumn('customerState');
    const nextAppointmentColumn = table.getColumn('nextAppointment');
    const deliveredDate = table.getColumn('deliveredDate');
    const pickUpDate = table.getColumn('pickUpDate');
    const status = table.getColumn('status');
    const depositMade = table.getColumn('depositMade');
    const sold = table.getColumn('sold')
    const delivered = table.getColumn('delivered')
    const signed = table.getColumn('signed')
    const financeApp = table.getColumn('financeApp')

    switch (selectedFilter) {
      case 'inStock':
        table.getColumn('status')?.setFilterValue('available');
        table.getColumn('onOrder')?.setFilterValue('false');
        break;
      case 'available':
        table.getColumn('status')?.setFilterValue('available');
        break;
      case 'inStockArrived':
        table.getColumn('status')?.setFilterValue('available');
        table.getColumn('orderStatus')?.setFilterValue('STOCK');
        break;
      case 'newStock':
        table.getColumn('new')?.setFilterValue(true);
        break;
      case 'usedStock':
        table.getColumn('new')?.setFilterValue(false);
        break;
      case 'sold':
        table.getColumn('status')?.setFilterValue('reserved');
        break;
      case 'otd':
        table.getColumn('status')?.setFilterValue('sold');
        break;
      case 'deposits':
        table.getColumn('status')?.setFilterValue('reserved');
        break;
      case 'customerOrders':
        table.getColumn('orderStatus')?.setFilterValue('WISH');
        break;
      case 'deliveredThisMonth':
        customerStateColumn?.setFilterValue('delivered');
        deliveredDate?.setFilterValue(getFirstDayOfCurrentMonth);
        status?.setFilterValue('active');
        break;
      case 'todaysDeliveries':
        pickUpDate?.setFilterValue(getToday);
        status?.setFilterValue('active');
        sold?.setFilterValue(sold && sold.length > 3);
        delivered?.setFilterValue(null)
        break;
      case 'tomorowsDeliveries':
        pickUpDate?.setFilterValue(getTomorrow);
        status?.setFilterValue('active');
        depositMade?.setFilterValue(depositMade && depositMade.length > 3);
        sold?.setFilterValue(sold && sold.length > 3);
        delivered?.setFilterValue(null)
        break;
      case 'yestDeliveries':
        pickUpDate?.setFilterValue(getYesterday);
        status?.setFilterValue('active');
        depositMade?.setFilterValue(depositMade && depositMade.length > 3);
        sold?.setFilterValue(sold && sold.length > 3);
        delivered?.setFilterValue(null)
        break;

      case 'deliveredThisYear':
        customerStateColumn?.setFilterValue('delivered');
        deliveredDate?.setFilterValue(getThisYear);
        status?.setFilterValue('active');
        break;
      case 'depositsToday':
        status?.setFilterValue('active');
        depositMade?.setFilterValue('on');
        sold?.setFilterValue('on');
        delivered?.setFilterValue('off')
        signed?.setFilterValue('off')
        financeApp?.setFilterValue('off')
        break;
      default:
        null;
    }
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}`;
  };

  const now = new Date(); // Current date and time
  const formattedDate = formatDate(now);
  function getToday() {
    const today = new Date();
    today.setDate(today.getDate());
    console.log(formatDate(today), 'today')
    return formatDate(today);
  }
  function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDate(tomorrow);
  }
  function getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDate(yesterday);
  }
  function getLastDayOfPreviousMonth() {
    const date = new Date();
    date.setDate(1); // sets the day to the last day of the previous month
    return formatMonth(date);
  }
  function getFirstDayOfCurrentMonth() {
    const date = new Date();
    date.setDate(1); // sets the day to the first day of the current month
    return formatDate(date);
  }
  function getFirstDayOfTwoMonthsAgo() {
    const date = new Date();
    date.setMonth(date.getMonth() - 2);
    date.setDate(1); // sets the day to the first day of the month two months ago
    return formatMonth(date);
  }
  function getYear() {
    const today = new Date();
    return today.getFullYear().toString();
  }
  const getThisYear = getYear();



  return (
    <div>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>Accessories / Parts</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">

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
          <Tabs defaultValue="Orders">
            <TabsList>
              <TabsTrigger value="Orders">Orders</TabsTrigger>
              <TabsTrigger value="End Of Day">End Of Day</TabsTrigger>
            </TabsList>
            <TabsContent value="Orders">
              <div className="w-[95%] mt-[5px]">

                <div className="container mx-auto py-3">
                  <div className="flex items-center py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size='sm' variant="outline" className='mr-3' >Menu</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 border border-border bg-background text-foreground">
                        <DropdownMenuLabel>Dashboard Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => setSelectedGlobal(true)}
                          >
                            Global Filter
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer">
                              Default Filters
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="h-auto max-h-[175px] overflow-y-auto border border-border bg-background text-foreground">
                                <DropdownMenuLabel>
                                  {todayfilterBy || "Default Filters"}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {CallsList.map((item) => (
                                  <DropdownMenuItem
                                    onSelect={(event) => {
                                      const value =
                                        event.currentTarget.getAttribute("data-value");
                                      const item =
                                        CallsList.find((i) => i.key === value) ||
                                        DeliveriesList.find((i) => i.key === value) ||
                                        DepositsTakenList.find((i) => i.key === value);
                                      if (item) {
                                        handleFilterChange(item.key);
                                        setTodayfilterBy(item.name);
                                      }
                                    }}
                                    data-value={item.key}
                                    textValue={item.key}
                                  >
                                    {item.name}
                                  </DropdownMenuItem>
                                ))}

                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer">
                              Global Filters
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="h-[350px] max-h-[350px] overflow-y-auto border border-border bg-background text-foreground">
                                {table
                                  .getAllColumns()
                                  .filter((column) => column.getCanHide())
                                  .map((column) => (
                                    <DropdownMenuItem
                                      onSelect={(event) => {
                                        setColumnFilterDropdown(event);
                                      }}
                                      data-value={column.id}
                                      key={column.id}
                                      className="cursor-pointer bg-background capitalize text-foreground  hover:text-primary hover:underline"
                                    >
                                      {column.id}
                                    </DropdownMenuItem>
                                  ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={() => {
                              setAllFilters([]);
                              setSelectedGlobal(false);
                            }}
                          >
                            Clear
                          </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={toggleFilter}
                          >
                            Toggle All Columns
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="cursor-pointer">
                              Column Toggle
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent className="h-[350px] max-h-[350px] overflow-y-auto border border-border bg-background text-foreground">
                                {table
                                  .getAllColumns()
                                  .filter((column) => column.getCanHide())
                                  .map((column) => {
                                    return (
                                      <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="cursor-pointer bg-background  capitalize text-foreground"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                          column.toggleVisibility(!!value)
                                        }
                                      >
                                        {column.id}
                                      </DropdownMenuCheckboxItem>
                                    );
                                  })}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {selectedColumn && (
                      <div className="relative flex-1 md:grow-0 ">

                        <Input
                          placeholder={`Filter ${selectedColumn}...`}
                          onChange={(e) => handleGlobalChange(e.target.value)}
                          className="ml-2 max-w-sm w-auto "
                          autoFocus
                        />
                        <Button
                          onClick={() => {
                            setAllFilters([]);
                            setSelectedGlobal(false);
                          }}
                          size="icon"
                          variant="ghost"
                          className='bg-transparent mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>

                          <X />
                        </Button>
                      </div>
                    )}
                    <div className="relative flex-1 md:grow-0 ">
                      <DebouncedInput
                        value={globalFilter ?? ""}
                        onChange={(value) => setGlobalFilter(String(value))}
                        className="mx-1 ml-3 rounded-md border border-border bg-background p-2 text-foreground shadow w-[300px] "
                        placeholder="Search..." autoFocus
                      />

                      <Button
                        onClick={() => {
                          setGlobalFilter([]);
                          setSelectedGlobal(false);
                        }}
                        size="icon"
                        variant="ghost"
                        className='bg-transparent mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>
                        <X size={16} />
                      </Button>
                    </div>


                    {referrer === '/dealer/manager/inventory' && (
                      <Button size='sm' variant="outline" className='mr-3' onClick={() => {
                        navigate(-1)
                      }} >Back to Manager Dash</Button>
                    )}
                    <div className="ml-auto">
                      <Button size='sm' variant="outline" className='ml-3' >All</Button>
                      <Button size='sm' variant="outline" className='ml-3' >Parts</Button>
                      <Button size='sm' variant="outline" className='ml-3' >Accessories</Button>
                    </div>
                  </div>
                  <div className="rounded-md border border-border    h-auto max-h-[600px] overflow-y-auto  ">
                    <Table className='border border-border text-foreground bg-background'>
                      <TableHeader className='border border-border text-muted-foreground bg-background text-center'>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id} className='border-border'>
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead key={header.id}>
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                  {header.column.getCanFilter() && showFilter && (
                                    <div className="sticky  z-5 mx-auto items-center justify-center cursor-pointer text-center ">
                                      <Filter column={header.column} table={table} />
                                    </div>
                                  )}
                                </TableHead>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableHeader>

                      <TableBody className='border border-border text-foreground bg-background '>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                              className='border border-border text-foreground bg-background'
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center border border-border text-foreground bg-background">
                              No results.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>

                    </Table>
                  </div>
                  <DataTablePagination table={table} />

                </div>
              </div>
            </TabsContent>
            <TabsContent value="Acc Orders">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Accessories Orders</CardTitle>
                  <CardDescription>
                    Review orders from staff that have been requested from their customers.
                  </CardDescription>
                </CardHeader>
                <CardContent className='max-h-[455px] h-auto overflow-y-auto'>
                  <OtherTable tableData={accTable} setValue={setValue} showPrevOrderById={showPrevOrderById} options2={options2} navigate={navigate} dept={'Accessories'} />
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50 px-6 py-3">
                  <div className='mx-auto mt-4'>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            className='cursor-pointer'
                            isActive={pageIndex > 1}
                            onClick={() => setPageIndex(pageIndex - 1)}
                          />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink isActive>
                            {pageIndex}
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext
                            className='cursor-pointer'
                            onClick={() => setPageIndex(pageIndex + 1)} />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </CardFooter>
              </Card>
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

                  <PACTable tableData={filteredOrders7} setValue={setValue} showPrevOrderById={showPrevOrderById} options2={options2} navigate={navigate} dept={'Accessories'} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="month">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className='max-h-[455px] h-auto overflow-y-auto'>
                  <PACTable tableData={accTableAll.allOrders} setValue={setValue} showPrevOrderById={showPrevOrderById} options2={options2} navigate={navigate} dept={'All'} />
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50 px-6 py-3">
                  <div className='mx-auto mt-4'>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            className='cursor-pointer'
                            isActive={pageIndexAll > 1}
                            onClick={() => handlePageChange(pageIndexAll - 1)}
                          />
                        </PaginationItem>
                        {pageNumbers.map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={page === pageIndexAll}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        {endPage < totalPages && (
                          <>
                            <PaginationItem>
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                              <PaginationLink
                                onClick={() => handlePageChange(totalPages)}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            isActive={pageIndexAll < totalPages}
                            onClick={() => handlePageChange(pageIndexAll + 1)} />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </CardFooter>

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
                        <TableRow className='border-border'>
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
                              <TableRow key={index} className="hover:bg-accent border-border cursor-pointer"
                                onClick={() => {
                                  setShowPrev(false)
                                  setShowPrevOrder(null)
                                  setSearchResults(result)
                                }}>
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
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="mr-3 hover:bg-primary"
                                        onClick={() => {
                                          const formData = new FormData();
                                          formData.append("clientfileId", result.id);
                                          formData.append("intent", 'createNewOrder');
                                          submit(formData, { method: "post", });
                                        }}
                                      >
                                        <Plus className="h-5 w-5" />
                                      </Button>
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
                            </>
                          ))}
                      </TableBody>
                    </Table>
                  </>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="End Of Day">
              <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                  <Card x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Revenue
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground">
                        {/**  +20.1% from last month*/}
                      </p>
                    </CardContent>
                  </Card>
                  <Card x-chunk="dashboard-01-chunk-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Number of Sales
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{numberOfSales}</div>
                      <p className="text-xs text-muted-foreground">
                        {/** +180.1% from last month*/}
                      </p>
                    </CardContent>
                  </Card>
                  {/**
                  <Card x-chunk="dashboard-01-chunk-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sales</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+12,234</div>
                      <p className="text-xs text-muted-foreground">
                       +19% from last month
                      </p>
                    </CardContent>
                  </Card>
                  */}
                  {/**
                  <Card x-chunk="dashboard-01-chunk-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+573</div>
                      <p className="text-xs text-muted-foreground">
                         +201 since last hour
                      </p>
                    </CardContent>
                  </Card>
                  */}
                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                  <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"  >
                    <CardHeader className="flex flex-row items-center">
                      <div className="grid gap-2">
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>
                          Todays transactions from your store.
                        </CardDescription>
                      </div>
                      <Button size="sm" className="ml-auto gap-1">
                        Print Report
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className='h-[400px] max-h-[400px] overflow-y-auto'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden xl:table-column">
                              Staff
                            </TableHead>
                            <TableHead className="hidden xl:table-column">
                              Dept
                            </TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paidOrder && paidOrder.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="font-medium">{result.Clientfile.name}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                  {result.Clientfile.email}
                                </div>
                              </TableCell>
                              <TableCell className="hidden xl:table-column">
                                {result.dept}
                              </TableCell>
                              <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                                {new Date(result.paidDate).toLocaleDateString("en-US", options2)}
                              </TableCell>
                              <TableCell className="text-right">${result.total}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  <Card x-chunk="dashboard-01-chunk-5">
                    <CardHeader>
                      <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-8 h-[400px] max-h-[400px] overflow-y-auto">
                      {paidOrder && paidOrder.map((result, index) => (
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <Users2Icon />
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">
                              {result.userName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {result.userEmail}
                            </p>
                          </div>
                          <div className="ml-auto font-medium">${result.total}</div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </main>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <MySidebar
            showPrev={showPrev}
            lastOrder={lastOrder}
            searchResults={searchResults}
            totalAccessoriesCost={totalAccessoriesCost}
            tax={tax}
            totalAmountPaid={totalAmountPaid}
            toggleOrderDetails={toggleOrderDetails}
            showPrevOrderById={showPrevOrderById}
            showPrevOrder={showPrevOrder}
            showOrder={showOrder}
            total={total}
            taxRate={taxRate}
            toReceipt={toReceipt}
            options2={options2}
            setShowPrev={setShowPrev}
            setShowPrevOrder={setShowPrevOrder}
          />
        </div >
      </main >
    </div >
  );
}

export const meta = () => {

  return [
    { title: `PAC Dashboard | Dealer Sales Assistant` },
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
export const calculateTotalAccessoriesCost = (order) => {
  if (!order || !order.AccessoriesOnOrders) { return 0; }
  return order.AccessoriesOnOrders.reduce((total, accessoryOnOrder) => {
    return total + (accessoryOnOrder.quantity * accessoryOnOrder.accessory.price);
  }, 0);
};
export const calculateTotalAmountPaid = (order) => {
  if (!order || !order.Payments) { return 0; }
  return order.Payments.reduce((total, payment) => {
    return total + payment.amountPaid;
  }, 0);
};

const MySidebar = ({
  showPrev, lastOrder, searchResults, showPrevOrder, options2, setShowPrev, setShowPrevOrder, tax, toggleOrderDetails, showPrevOrderById, showOrder, taxRate, toReceipt
}) => {
  const navigate = useNavigate()
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
  const submit = useSubmit()

  const [totalAccessoriesCost, setTotalAccessoriesCost] = useState(0.00);
  const [totalAmountPaid, setTotalAmountPaid] = useState(0.00);
  const [total, setTotal] = useState(0.00);

  useEffect(() => {
    if (showPrev && showPrevOrder) {
      const calculatedTotalAmountPaid = calculateTotalAmountPaid(showPrevOrder);
      const calculatedTotalAccessoriesCost = calculateTotalAccessoriesCost(showPrevOrder);
      setTotalAmountPaid(calculatedTotalAmountPaid);
      setTotalAccessoriesCost(calculatedTotalAccessoriesCost);

      const total2 = ((parseFloat(calculatedTotalAccessoriesCost) - parseFloat(discDollar)) * taxRate).toFixed(2);
      const total1 = (((parseFloat(calculatedTotalAccessoriesCost) * (100 - parseFloat(discPer))) / 100) * taxRate).toFixed(2);
      const calculatedTotal = discDollar && discDollar > 0.00 ? total1 : total2;

      setTotal(calculatedTotal);
    }
  }, [showPrev, showPrevOrder, discDollar, discPer, taxRate]);
  if (showPrev) {
    return (
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
                {new Date().toLocaleDateString(
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
                      console.log(toReceipt)
                      PrintReceipt(toReceipt)
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      const formData = new FormData();
                      formData.append("orderId", showPrevOrder.id);
                      formData.append("intent", 'deleteOrder');
                      submit(formData, { method: "post", });
                    }}>
                    Delete
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
                  <li className="flex items-center justify-between" key={index}  >
                    <div>
                      <div className="font-medium">
                        {result.accessory.brand}{" "}
                        {/*result.accessory.name*/}
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

              </div>
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
    );
  }

  if (lastOrder) {
    return (
      <>
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
                        {/*result.accessory.name*/}
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
      </>
    );
  }

  if (searchResults?.AccOrder && searchResults?.AccOrder?.length > 0) {
    return (
      <>

        <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Customer Search Result
                <Button
                  size="icon"
                  variant="outline"
                  className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Copy className="h-3 w-3" />
                  <span className="sr-only">Copy Order ID</span>
                </Button>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                All orders under their customer file
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
            {searchResults.AccOrder.map((result, index) => (
              <>
                <Table className='w-[p'>
                  <TableBody>
                    <TableRow
                      key={index}
                      className="rounded-[6px] hover:bg-accent cursor-pointer"
                      onClick={() => {
                        toggleOrderDetails(result.id)
                      }}
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
                    <div className="grid w-[300px] gap-3 rounded-lg border border-border p-6 m-3">
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
                                {/*result.accessory.name*/}
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

          </CardContent>
          <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">

            </div>
          </CardFooter>
        </Card>
      </>
    );
  }

  return (
    <>
      {/* Fallback content if no conditions are met */}
      <div>No content available</div>
    </>
  );
};


export function PACTable({ tableData, setValue, showPrevOrderById, options2, navigate, dept }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className='border-border'>
          <TableHead>Customer</TableHead>
          <TableHead className="hidden sm:table-cell">Salesperson</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="hidden sm:table-cell">Dept</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="hidden sm:table-cell text-center">Paid</TableHead>
          <TableHead className="hidden sm:table-cell text-center">Sent From</TableHead>
          <TableHead className="hidden sm:table-cell text-center">Completed </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData &&
          tableData.map((result, index) => (
            <TableRow key={index} className="rounded-[6px] hover:bg-accent border-border"                          >
              <TableCell>  <div className="font-medium"> {result.Clientfile.name}  </div>
                <div className="hidden text-sm text-muted-foreground md:inline"> {result.Clientfile.email}  </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <p className='text-muted-foreground'>{result.userName}</p>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">{result.status}</Badge>
              </TableCell>
              <TableCell className=" ">
                <Badge className="text-xs" variant="secondary">{result.AccHandoff.sendTo && (result.AccHandoff.sendTo)}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(result.createdAt).toLocaleDateString("en-US", options2)}
              </TableCell>
              <TableCell className="text-right">${result.total}</TableCell>
              <TableCell className="text-right">
                {result.paid ? (<Check className='mx-auto' />) : (<X className='mx-auto' />)}</TableCell>
              <TableCell className="text-right">
                {result.AccHandoff.dept !== null ? (result.AccHandoff.dept) : ('')}
              </TableCell>
              <TableCell className="text-right">
                {result.AccHandoff.sendToCompleted === 'true' ? (<Check className='mx-auto' />) : (<X className='mx-auto' />)}
              </TableCell>
              <TableCell className="text-right flex">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="mr-3 hover:bg-primary"
                      onClick={() => {
                        setValue(result.id);
                        showPrevOrderById(result.id)
                      }}
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Show Order
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="mr-3 hover:bg-primary"
                      onClick={() => {
                        navigate(`/dealer/accessories/newOrder/${result.id}`)
                      }}
                    >
                      <FileCheck className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Go To Order
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
  )
}
function OtherTable({ tableData, setValue, showPrevOrderById, options2, navigate, dept }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className='border-border'>
          <TableHead>Customer</TableHead>
          <TableHead className="hidden sm:table-cell">Salesperson</TableHead>
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
        {tableData &&
          tableData.map((result, index) => (
            <TableRow key={index} className="rounded-[6px] hover:bg-accent border-border"                          >
              <TableCell>  <div className="font-medium"> {result.AccOrder.Clientfile.name}  </div>
                <div className="hidden text-sm text-muted-foreground md:inline"> {result.AccOrder.Clientfile.email}  </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <p className='text-muted-foreground'>{result.AccOrder.userName}</p>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge className="text-xs" variant="secondary">{result.AccOrder.status}</Badge>
              </TableCell>
              <TableCell className=" ">
                <Badge className="text-xs" variant="secondary">{result.sendTo && (result.sendTo)}</Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(result.createdAt).toLocaleDateString("en-US", options2)}
              </TableCell>
              <TableCell className="text-right">${result.AccOrder.total}</TableCell>
              <TableCell className="text-right">
                {result.AccOrder.paid ? (<Check className='mx-auto' />) : (<X className='mx-auto' />)}</TableCell>
              <TableCell className="text-right">
                {result.sendTo ? (<Check className='mx-auto' />) : (<X className='mx-auto' />)}
              </TableCell>
              <TableCell className="text-right">
                {result.sendToCompleted === 'true' ? (<Check className='mx-auto' />) : (<X className='mx-auto' />)}
              </TableCell>
              <TableCell className="text-right flex">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="mr-3 hover:bg-primary"
                      onClick={() => {
                        setValue(result.AccOrder.id);
                        showPrevOrderById(result.AccOrder.id)
                      }}
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Show Order
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="mr-3 hover:bg-primary"
                      onClick={() => {
                        navigate(`/dealer/accessories/newOrder/${result.AccOrder.id}`)
                      }}
                    >
                      <FileCheck className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Go To Order
                  </TooltipContent>
                </Tooltip>

                {result.fullfilled === false && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={`/dealer/accessories/order/${result.AccOrder.id}`}
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



