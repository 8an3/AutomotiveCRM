
/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, useActionData, useFetcher, useLoaderData, useSubmit, useNavigation, useParams, useNavigate } from "@remix-run/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import { ClientResultFunction, ClientStateFunction, } from "~/components/lists/clientResultList";
import { type DataFunctionArgs, type ActionFunction, json, type LinksFunction, redirect } from '@remix-run/node'
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { getDataKawasaki, getFinanceWithDashboard, getLatestBMWOptions, getLatestBMWOptions2, getDataBmwMoto, getDataByModel, getDataHarley, getDataTriumph, findQuoteById, findDashboardDataById, getDataByModelManitou, getLatestOptionsManitou, getFinance, getClientFileByEmail, getClientFileById } from "~/utils/finance/get.server";
import { getAllFinanceNotes } from '~/utils/financeNote/get.server';
import { getAllFinanceApts, getAllFinanceApts2 } from "~/utils/financeAppts/get.server";
import { getDocsbyUserId } from "~/utils/docTemplates/get.server";
import { getAppointmentsForFinance } from "~/utils/client/getClientAptsForFile.server";
import { Topsection } from "~/components/dashboardCustId/topSection";
import { ClientTab } from "~/components/dashboardCustId/clientTab";
import { PartsTab } from "~/components/dashboardCustId/partsTab";
import { SalesTab } from "~/components/dashboardCustId/salesTab";
import { SalesComms } from "~/components/dashboardCustId/salesComs";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { updateClientFileRecord, updateFinanceWithDashboard } from "~/utils/finance/update.server";
import DeleteCustomer from "~/components/dashboard/calls/actions/DeleteCustomer";
import { deleteFinanceNote } from "~/utils/financeNote/delete.server";
import { updateFinanceNote } from "~/utils/financeNote/update.server";
import UpdateAppt from "~/components/dashboard/calls/actions/updateAppt";
import { getMergedFinance, getMergedFinanceOnFinance, getClientListMerged } from "~/utils/dashloader/dashloader.server";
import { getComsOverview } from "~/utils/communications/communications.server";
import { prisma } from "~/libs";
import { commitSession as commitIds, getSession as getIds, SetClient66 } from '~/utils/misc.user.server';
import { getSession } from "~/sessions/auth-session.server";
import { UpdateLeadBasic, UpdateLeadApiOnly, UpdateClientFromActivix, UpdateLeadEchangeVeh, UpdateLeadPhone, UpdateLeadWantedVeh, UpdateLeademail, CreateNote, CompleteTask, UpdateTask, ListAllTasks, UpdateNote } from "~/routes/__authorized/dealer/api/activix";
import axios from "axios";
import { GetUser } from "~/utils/loader.server";
import base from "~/styles/base.css";
import { Cross2Icon, CaretSortIcon, CalendarIcon, ClockIcon, ChevronDownIcon, DotsHorizontalIcon, } from "@radix-ui/react-icons";
import { Calendar } from '~/components/ui/calendar';
import { format } from "date-fns"
import { cn } from "~/components/ui/utils"
import harleyDavidson from '~/logos/hd.png'
import clsx from 'clsx'
import { isDate } from 'date-fns';
import { FaCheck } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  X, CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Send,
  FileText,
  Package2,
  PanelLeft,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
  Eye,
  PanelTop,
} from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "~/components/ui/dropdown-menu"
//import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, } from "~/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "~/components/ui/pagination"
import { Progress } from "~/components/ui/progress"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  Tabs, Badge,
  TabsContent,
  TabsList,
  TabsTrigger, Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger, Card,
  CardContent,
  CardDescription,
  CardFooter,
  Alert,
  Debug,
  InputPassword,
  Layout,
  PageHeader,
  RemixForm,
  RemixLinkText,
  CardHeader,
  CardTitle, Avatar,
  AvatarFallback,
  AvatarImage,
  Select, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectGroup,
  RemixNavLink, Input, Separator, Button, TextArea, Label, PopoverTrigger, PopoverContent, Popover,
} from "~/components"
import { CheckIcon, PaperPlaneIcon, PlusIcon, UploadIcon } from "@radix-ui/react-icons"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import { ButtonLoading } from "~/components/ui/button-loading";
import { toast } from "sonner"
import { FaMotorcycle } from "react-icons/fa";
import { ScrollArea } from "~/components/ui/scroll-area";
import IndeterminateCheckbox from "~/components/dashboard/calls/InderterminateCheckbox"
import { ImageSelectNav } from '~/overviewUtils/imageselect'
import canamIndex from '~/logos/canamIndex.png'
import manitouIndex from '~/logos/manitouIndex.png'
import Harley from '~/components/dashboardCustId/hdIcon.png'
import second from '~/styles/second.css'
import CustomerGen from "../document/customerGen.client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
import { overviewLoader, overviewAction, financeIdLoader } from '~/components/actions/overviewActions'
import EmailSheet from '~/overviewUtils/Emails'
import FeaturePop from '~/overviewUtils/FeaturePop'
import BMWOptions from '~/overviewUtils/bmwOptions'
import ManitouOptions from '~/overviewUtils/manitouOptions'
import DisplayModel from '~/overviewUtils/modelDisplay'
import DealerFeesDisplay from '~/overviewUtils/dealerFeesDisplay'
import ContactInfoDisplay from '~/overviewUtils/contactInfoDisplay'
import ClientProfile from '~/components/dashboard/calls/actions/clientProfile'
// <Sidebar />
import NotificationSystem from "~/routes/__authorized/dealer/notifications";
import { PrintSpec } from "~/overviewUtils/printSpec";
import { CiEdit } from "react-icons/ci";
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import { FaSave } from "react-icons/fa";
import UnitPicker from "~/routes/__authorized/dealer/stockUnit";
import { cors } from "remix-utils";
import { TextFunction } from "~/components/dashboard/calls/logText";
import { ModelPage } from "~/overviewUtils/modelPage";
import timeline from "~/styles/timeline.css";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import useSWR from "swr";
import { ClientOnly } from "remix-utils";
import PrintReceipt from "../document/printReceiptSales.client";
import EmailPreview, { TemplatePreviewThree, TemplatePreviewTwo, TemplatePreview } from "~/emails/preview";
import { Printer } from "lucide-react";
import { BanknoteIcon } from "lucide-react";
import { DollarSign } from "lucide-react";
import { Wrench } from "lucide-react";
import { Shirt } from "lucide-react";
import PrintReceiptAcc from "../document/printReceiptAcc.client";
import { Receipt } from "lucide-react";
import WorkOrderSales from "~/components/leads/workOrderSale.client";
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
import { EditableText } from "~/components/actions/shared";
import UnitDialog from "~/components/dashboard/inventory/diaolog";


/**  const [formData, setFormData] = useState({
    referral: mergedFinanceList.referral || "off",
    visited: mergedFinanceList.visited || "off",
    bookedApt: mergedFinanceList.bookedApt || "off",
    aptShowed: mergedFinanceList.aptShowed || "off",
    aptNoShowed: mergedFinanceList.aptNoShowed || "off",
    testDrive: mergedFinanceList.testDrive || "off",
    metService: mergedFinanceList.metService || "off",
    metManager: mergedFinanceList.metManager || "off",
    metParts: mergedFinanceList.metParts || "off",
    sold: mergedFinanceList.sold || "off",
    depositMade: mergedFinanceList.depositMade || "off",
    refund: mergedFinanceList.refund || "off",
    turnOver: mergedFinanceList.turnOver || "off",
    financeApp: mergedFinanceList.financeApp || "off",
    approved: mergedFinanceList.approved || "off",
    signed: mergedFinanceList.signed || "off",
    pickUpSet: mergedFinanceList.pickUpSet || "off",
    demoed: mergedFinanceList.demoed || "off",
    seenTrade: mergedFinanceList.seenTrade || "off",
    delivered: mergedFinanceList.delivered || "off",
    setPickUpDate: mergedFinanceList.setPickUpDate || "off",
  }); */

export const headers = ({ loaderHeaders, parentHeaders }) => {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
  };
};

export default function Dashboard() {
  const { finance, user, clientFile, sliderWidth, aptFinance3, Coms, getTemplates, merged, clientUnit, mergedFinanceList, financeNotes, userList, deFees, modelData, manOptions, bmwMoto, bmwMoto2, notifications, emailTemplatesDropdown, salesPeople, financeManagers, services, dealerImage, tax, orders, assignedUnit, tableData } = useLoaderData();
  // console.log(orders, tax, services, ' inside workordersales2222')

  const [financeIdState, setFinanceIdState] = useState();
  const fetcher = useFetcher();
  const submit = useSubmit();
  const navigate = useNavigate()
  let formRef = useRef();
  const [value, onChange] = useState();
  const timerRef = React.useRef(0);
  let addProduct = useFetcher();

  const [tradeToggled, setTradeToggled] = useState(true);
  const [financeInfo, setFinanceInfo] = useState(true);
  const [PickUpCalendar, setPickUpCalendar] = useState('off');

  useEffect(() => {
    const serializedUser = JSON.stringify(user);
    const cust = {
      email: finance.email,
      name: finance.name,
      financeId: finance.id,
    }
    const serializedCust = JSON.stringify(cust);
    window.localStorage.setItem("user", serializedUser);
    window.localStorage.setItem("customer", serializedCust);
  }, []);

  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);
  const MyIFrameComponent = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const handleHeightMessage = (event: MessageEvent) => {
        if (
          event.data &&
          event.data.type === "iframeHeight" &&
          event.data.height
        ) {
          setIsLoading(false);
          if (iFrameRef.current) {
            iFrameRef.current.style.height = `${event.data.height}px`;
          }
        }
      };
      const currentHost =
        typeof window !== "undefined" ? window.location.host : null;
      if (iFrameRef.current) {
        if (currentHost === "localhost:3000") {
          iFrameRef.current.src = "http://localhost:3000/IFrameComp/email/file";
        }
        if (currentHost === "dealersalesassistant.ca") {
          iFrameRef.current.src =
            "https://www.dealersalesassistant.ca/IFrameComp/email/file";
        }
        window.addEventListener("message", handleHeightMessage);
      }
      return () => {
        if (iFrameRef.current) {
          window.removeEventListener("message", handleHeightMessage);
        }
      };
    }, []);

    return (
      <>
        <div className="size-full ">
          <iframe
            ref={iFrameRef}
            title="my-iframe"
            width="100%"
            className=" border-none"
            style={{
              minHeight: '30vh'
            }}
          />
        </div>
      </>
    );
  };

  let isAdding =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("intent") === "saveFinanceNote";

  useEffect(() => {
    if (!isAdding) {
      formRef.current?.reset();
    }
  }, [isAdding]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (finance.id) {
      setFinanceIdState(finance.id)
    }
  }, [finance.id]);

  let data = { ...finance, ...finance, ...user }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const [date, setDate] = useState<Date>()

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const [hour, setHour] = useState(currentHour)
  const [min, setMin] = useState(currentMinute)
  const currentTime = `${hour}:${min}:${currentSecond}`
  const time = `${hour}:${min}:00`

  useEffect(() => {
    if (mergedFinanceList.tradeDesc === null || mergedFinanceList.tradeDesc === undefined || mergedFinanceList.tradeDesc === '') {
      setTradeToggled(false);
    }
    if (mergedFinanceList.approved !== 'on' || mergedFinanceList.turnOver !== 'on' || mergedFinanceList.financeApp !== 'on') {
      setFinanceInfo(false);
    }
  }, []);

  const generateHiddenInputs = () => {
    return ClientResultFunction({ formData }).map((item) => (
      <input
        key={item.name}
        type="hidden"
        defaultValue={item.value === "on" ? "on" : "off"}
        name={item.name}
      />
    ));
  };

  const generateHiddenInputsForState = () => {
    return ClientStateFunction().map((item) => {
      // Check if the value of the first input is 'on'
      const isFirstInputOn =
        ClientResultFunction({ formData }).find(
          (result) => result.name === item.name
        )?.value === "on";

      return (
        <>
          {isFirstInputOn && (
            <input
              key={`${item.name}-second`}
              type="hidden"
              defaultValue={item.value}
              name="customerState"
            />
          )}
        </>
      );
    });
  };


  let NewListForStatus = [

    { name: 'lastContact', value: mergedFinanceList.lastContact === '1969-12-31 19:00' || mergedFinanceList.lastContact === null ? 'TBD' : formatDate(mergedFinanceList.lastContact), label: 'Last Contacted', },
    { name: 'nextAppointment', value: null, label: 'Next Appt', },
    {
      name: 'deliveryDate',
      value: mergedFinanceList.customerState !== 'depositMade' ?
        (<>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] px-4 text-foreground mx-auto  h-[55px] font-normal bg-transparent hover:bg-transparent hover:text-primary hover:border-primary",
                  !date && " text-foreground"
                )}
              >
                <div className=' text-foreground  mx-auto flex justify-center  '>
                  <ClockIcon className="mr-2 size-8 " />
                  {currentTime ? (time) : <span>Pick a Time</span>}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] bg-white p-0 text-black" align="start">
              <div className='align-center my-3 flex justify-center   '>
                <Select name='pickHour' value={hour} onValueChange={setHour}>
                  <SelectTrigger className="m-3 w-auto bg-transparent hover:bg-transparent hover:text-primary hover:border-primary" >
                    <SelectValue placeholder={hour} defaultValue={hour} />
                  </SelectTrigger>
                  <SelectContent className='bg-white text-black' >
                    <SelectGroup>
                      <SelectLabel>Hour</SelectLabel>
                      <SelectItem value="09">09</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="11">11</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="13">13</SelectItem>
                      <SelectItem value="14">14</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="17">17</SelectItem>
                      <SelectItem value="18">18</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select name='pickMin' value={min} onValueChange={setMin} >
                  <SelectTrigger className="m-3 w-auto" >
                    <SelectValue placeholder={min} defaultValue={min} />
                  </SelectTrigger>
                  <SelectContent className='bg-white text-black'  >
                    <SelectGroup>
                      <SelectLabel>Minute</SelectLabel>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="40">40</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>


        </>

        ) :
        mergedFinanceList.customerState !== 'pickUpSet' ?
          (<Badge onClick={() => setPickUpCalendar(PickUpCalendar === 'yes' ? 'no' : 'yes')} className="cursor-pointer transform transform:translate-x-1 bg-green-600">{result}</Badge>) :
          mergedFinanceList.customerState !== 'delivered' ?
            (<Badge className="bg-green-600">Delivered</Badge>) :
            (<Badge onClick={() => setPickUpCalendar(PickUpCalendar === 'yes' ? 'no' : 'yes')} className="cursor-pointer transform transform:translate-x-1 bg-green-600">{result}</Badge>
            ),

      label: 'Pick Up Date',
    }

  ]

  const [editItemId, setEditItemId] = useState(null);

  const handleEditClick = (itemId) => {
    setEditItemId(itemId);
  };

  let isDeleting = fetcher.state === "submitting" && fetcher.formData?.get("intent") === "deleteFinanceNote";

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text);
        setTimeout(() => setCopiedText(''), 3000); // Reset after 3 seconds
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
      });
  };
  const [copiedText, setCopiedText] = useState('');
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, [])

  const users = [
    {
      name: "Olivia Martin",
      email: "m@example.com",
      avatar: "/avatars/01.png",
    },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      avatar: "/avatars/03.png",
    },
    {
      name: "Emma Wilson",
      email: "emma@example.com",
      avatar: "/avatars/05.png",
    },
    {
      name: "Jackson Lee",
      email: "lee@example.com",
      avatar: "/avatars/02.png",
    },
    {
      name: "William Kim",
      email: "will@email.com",
      avatar: "/avatars/04.png",
    },
  ] as const

  type User = (typeof users)[number]

  const [open, setOpen] = useState(false)
  const [openAppt, setOpenAppt] = useState(false)
  const [openComms, setOpenComms] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  const [messages, setMessages] = useState([
    {
      role: "agent",
      content: "Hi, how can I help you today?",
    },
    {
      role: "user",
      content: "Hey, I'm having trouble with my account.",
    },
    {
      role: "agent",
      content: "What seems to be the problem?",
    },
    {
      role: "user",
      content: "I can't log in.",
    },
  ])
  const [input, setInput] = useState("")
  const inputLength = input.trim().length
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const WantedData = [
    { name: 'year', value: finance.year, placeholder: 'Year' },
    { name: 'brand', value: finance.brand, placeholder: 'Brand' },
    { name: 'model', value: finance.model, placeholder: 'Model' },
    { name: 'trim', value: finance.submodel, placeholder: 'Trim' },
    { name: 'stockNum', value: finance.stockNum, placeholder: 'Stock Number' },
    { name: 'modelCode', value: finance.modelCode, placeholder: 'Model Code' },
    { name: 'color', value: finance.color, placeholder: 'Color' },
    { name: 'mileage', value: finance.mileage, placeholder: 'Mileage' },
    { name: 'location', value: finance.location, placeholder: 'Location' },
    { name: 'vin', value: finance.vin, placeholder: 'VIN' },
  ]
  const TradeData = [
    { name: 'tradeYear', value: finance.tradeYear, placeholder: 'Year' },
    { name: 'tradeMake', value: finance.tradeMake, placeholder: 'Brand' },
    { name: 'tradeDesc', value: finance.tradeDesc, placeholder: 'Model' },
    { name: 'tradeTrim', value: finance.tradeTrim, placeholder: 'Trim' },
    { name: 'tradeColor', value: finance.tradeColor, placeholder: 'Color' },
    { name: 'tradeMileage', value: finance.tradeMileage || '', placeholder: 'Mileage' },
    { name: 'tradeLocation', value: finance.tradeLocation, placeholder: 'Location' },
    { name: 'tradeVin', value: finance.tradeVin, placeholder: 'VIN' },
  ]

  const customerStates = [
    { label: 'Reached', value: finance.reached, name: 'reached' },
    { label: 'Attempted', value: finance.attempted, name: 'attempted' },
    { label: 'Pending', value: finance.pending, name: 'pending' },
    { label: 'Visited', value: finance.visited, name: 'visited' },
    { label: 'Booked Apt', value: finance.bookedApt, name: 'bookedApt' },
    { label: 'Apt Showed', value: finance.aptShowed, name: 'aptShowed' },
    { label: 'Apt No Showed', value: finance.aptNoShowed, name: 'aptNoShowed' },
    { label: 'Sold', value: finance.sold, name: 'sold' },
    { label: 'Deposit', value: finance.deposit, name: 'deposit' },
    { label: 'Turn Over', value: finance.turnOver, name: 'turnOver' },
    { label: 'Application Done', value: finance.applicationDone, name: 'applicationDone' },
    { label: 'Approved', value: finance.approved, name: 'approved' },
    { label: 'Signed', value: finance.signed, name: 'signed' },
    { label: 'Licensing Sent', value: finance.licensingSent, name: 'licensingSent' },
    { label: 'Licening Done', value: finance.liceningDone, name: 'liceningDone' },
    { label: 'Pick Up Set', value: finance.pickUpSet, name: 'pickUpSet' },
    { label: 'Delivered', value: finance.delivered, name: 'delivered' },
    { label: 'Refunded', value: finance.refunded, name: 'refunded' },
    { label: 'Funded', value: finance.funded, name: 'funded' },
    { label: 'Cancelled', value: finance.cancelled, name: 'cancelled' },
    { label: 'Lost', value: finance.lost, name: 'lost' },

  ];

  const handleCheckboxChange = (name, isChecked) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [name]: isChecked ? (prevCheckedItems[name] ?? new Date().toISOString()) : false,
    }));
  };

  const errors = useActionData() as Record<string, string | null>;

  const toFormat = new Date();
  const today = toFormat.toISOString();
  let { brandId } = useParams()
  const brand = brandId
  const showSection = true
  const eventDateRef = useRef(new Date());
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  let motorTotal = 0;
  let optionsTotalMani = 0;
  let feesTotal = 0;
  let accTotal = 0;
  let modelSpecOpt = 0;
  let maniTotal = 0;
  let bmwTotal = 0;
  let totalSum = 0;

  const initial = {
    userLabour: parseInt(deFees.userLabour) || 0,
    accessories: finance.accessories ? parseFloat(finance.accessories) : 0,
    labour: parseInt(finance.labour) || 0,
    lien: parseInt(finance.lien) || 0,
    msrp: parseInt(finance.msrp) || 0,
    financeId: finance.id,
    userDemo: parseFloat(deFees.userDemo) || 0,
    userGovern: parseFloat(deFees.userGovern) || 0,
    userGasOnDel: parseFloat(deFees.userGasOnDel) || 0,
    userAirTax: parseFloat(deFees.userAirTax) || 0,
    userFinance: parseFloat(deFees.userFinance) || 0,
    destinationCharge: parseFloat(deFees.destinationCharge) || 0,
    userMarketAdj: parseFloat(deFees.userMarketAdj) || 0,
    userOther: parseFloat(deFees.userOther) || 0,
    userExtWarr: parseFloat(deFees.userExtWarr) || 0,
    userServicespkg: parseFloat(deFees.userServicespkg) || 0,
    vinE: parseFloat(deFees.vinE) || 0,
    rustProofing: parseFloat(deFees.rustProofing) || 0,
    userGap: parseFloat(deFees.userGap) || 0,
    userLoanProt: parseFloat(deFees.userLoanProt) || 0,
    userTireandRim: parseInt(deFees.userTireandRim) || 0,
    lifeDisability: parseInt(deFees.lifeDisability) || 0,
    deliveryCharge: parseInt(finance.deliveryCharge) || 0,
    brand: finance.brand,
    paintPrem: 0, //parseInt(modelData.paintPrem) || 0,
    modelCode: 0, //modelData.modelCode || null,
    model: finance.model,
    color: finance.color,
    stockNum: finance.stockNum,
    trade: parseInt(finance.tradeValue) || 0,
    freight: parseInt(deFees.userFreight) || 0,
    licensing: parseInt(deFees.userLicensing) || 0,
    licensingFinance: parseInt(finance.licensing) || 0,
    commodity: parseInt(deFees.userCommodity) || 0,
    pdi: parseInt(deFees.userPDI) || 0,
    admin: parseInt(deFees.userAdmin) || 0,
    biweeklNatWOptions: parseInt(finance.biweeklNatWOptions) || 0,
    nat60WOptions: parseInt(finance.nat60WOptions) || 0,
    weeklylNatWOptions: parseInt(finance.weeklylNatWOptions) || 0,
    userTireTax: parseInt(deFees.userTireTax) || 0,
    nat60: parseInt(finance.nat60) || 0,
    userOMVIC: parseInt(deFees.userOMVIC) || 0,
    tradeValue: parseInt(finance.tradeValue) || 0,
    deposit: parseInt(finance.deposit) || 500,
    discount: parseInt(finance.discount) || 0,
    iRate: parseInt(finance.iRate) || 10.99,
    months: parseInt(finance.months) || 60,
    discountPer: parseInt(finance.discountPer) || 0,
    biweeklyqc: 0,
    weeklyqc: 0,
    biweeklNat: 0,
    weeklylNat: 0,
    biweekOth: 0,
    weeklyOth: 0,
    othTax: parseInt(finance.othTax) || 13,
    firstName: finance.firstName,
    lastName: finance.lastName,
    panAmAdpRide: 0,
    panAmTubelessLacedWheels: 0,
    hdWarrAmount: 0,

    referral: finance.referral,
    visited: finance.visited,
    bookedApt: finance.bookedApt,
    aptShowed: finance.aptShowed,
    aptNoShowed: finance.aptNoShowed,
    testDrive: finance.testDrive,
    seenTrade: finance.seenTrade,
    metService: finance.metService,
    metManager: finance.metManager,
    metParts: finance.metParts,
    sold: finance.sold,
    //  deposit: finance.deposit,
    refund: finance.refund,
    turnOver: finance.turnOver,
    financeApp: finance.financeApp,
    approved: finance.approved,
    signed: finance.signed,
    licensingSent: finance.licensingSent,
    liceningDone: finance.liceningDone,
    pickUpSet: finance.pickUpSet,
    demoed: finance.demoed,
    delivered: finance.delivered,
    funded: finance.funded,
    cancelled: finance.cancelled,
    lost: finance.lost,
  };


  const [selectedType, setSelectedType] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [selectedYear, setSelectedYear] = useState();

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setSelectedOption();
    setSelectedYear();
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedYear();
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  function BrandOptions() {
    if (brand === 'Manitou') {
      return (
        <ManitouOptions manOptions={manOptions} modelData={modelData} />
      )
    }
    if (brand === 'BMW-Motorrad') {
      return (
        <>
          <BMWOptions bmwMoto={bmwMoto} bmwMoto2={bmwMoto2} />
        </>
      )
    }
    if (brand === 'Switch') {

      const manSwitchAccNames = {
        baseInst: 'Base Installer',
        cupHolder: 'Cup Holder',
        multiHolder: 'Multi Holder',
        cooler13: 'Cooler 13 L',
        stemwareHolder: 'Stemware Holder',
        coolerExtension: 'Cooler Extension',
        coolerBag14: 'Cooler Bag 14 L',
        singleHolder: 'Single Holder',
        cargoBox10: 'Cargo Box 10 L',
        cargoBox20: 'Cargo Box 20 L',
        cargoBox30: 'Cargo Box 30 L',
        rodHolder: 'Rod Holder',
        batteryCharger: 'Battery Charger',
        bowFillerBench: 'Bow Filler Bench',
        skiTowMirror: 'Ski Tow Mirror',
        portAquaLounger: 'Port Aqua Lounger',
      }

      const manSwitchAccArray = [
        'baseInst', 'cupHolder', 'multiHolder', 'cooler13', 'coolerExtension', 'coolerBag14', 'singleHolder', 'stemwareHolder', 'cargoBox10', 'cargoBox20', 'cargoBox30', 'rodHolder', 'batteryCharger', 'bowFillerBench', 'portAquaLounger', 'skiTowMirror',
      ]

      return (
        <>
          {manSwitchAccArray.some((option) => manOptions[option] > 0) && (
            <>
              <div className="mt-3">
                <h3 className="text-2xl ">
                  Accessories
                </h3>
              </div>
              <hr className="solid" />
            </>
          )}
          {manSwitchAccArray.map((option) => {
            if (manOptions[option] > 0) {
              const displayName = manSwitchAccNames[option]
              return (
                <div key={option} className="flex justify-between mt-2" >
                  <p className="">
                    {displayName}
                  </p>
                  <p className="">
                    ${manOptions[option]}
                  </p>
                </div>
              );
            }
            return null;
          })}
        </>
      )
    }

    if (brand === 'Harley-Davidson') {
      const hdWarrArray = {
        'Sport': {
          'With Tire and Rim': {
            '3 years': 1309,
            '4 years': 1579,
            '5 years': 1884,
            '6 years': 2099,
            '7 years': 2504,
          },
          'W/O Tire and Rim': {
            '3 years': 839,
            '4 years': 1059,
            '5 years': 1334,
            '6 years': 1464,
            '7 years': 1824,
          }
        },
        'Cruiser': {
          'With Tire and Rim': {
            '3 years': 1519,
            '4 years': 1804,
            '5 years': 2154,
            '6 years': 2504,
            '7 years': 3064,
          },
          'W/O Tire and Rim': {
            '3 years': 1049,
            '4 years': 1284,
            '5 years': 1604,
            '6 years': 1869,
            '7 years': 2384,
          }
        },
        'Adventure Touring': {
          'With Tire and Rim': {
            '3 years': 1519,
            '4 years': 1804,
            '5 years': 2154,
            '6 years': 2504,
            '7 years': 3064,
          },
          'W/O Tire and Rim': {
            '3 years': 1049,
            '4 years': 1284,
            '5 years': 1604,
            '6 years': 1869,
            '7 years': 2384,
          }
        },
        'Grand America Touring': {
          'With Tire and Rim': {
            '3 years': 1679,
            '4 years': 2069,
            '5 years': 2509,
            '6 years': 3089,
            '7 years': 3609,
          },
          'W/O Tire and Rim': {
            '3 years': 1209,
            '4 years': 1549,
            '5 years': 1959,
            '6 years': 2454,
            '7 years': 2929,
          }
        },
        'Trike': {
          'With Tire and Rim': {
            '3 years': 1819,
            '4 years': 2279,
            '5 years': 2679,
            '6 years': 3259,
            '7 years': 3864,
          },
          'W/O Tire and Rim': {
            '3 years': 1349,
            '4 years': 1759,
            '5 years': 2129,
            '6 years': 2624,
            '7 years': 3184,
          }
        },
        'EV': {
          'With Tire and Rim': {
            '3 years': 1519,
            '4 years': 1799,
            '5 years': 2144,
            '6 years': 3079,
            '7 years': 3599,
          },
          'W/O Tire and Rim': {
            '3 years': 1049,
            '4 years': 1279,
            '5 years': 1594,
            '6 years': 2444,
            '7 years': 2919,
          }
        },
        'Police Bikes': {
          'W/O Tire and Rim': {
            '3 years': 1111,
            '4 years': 1555,
            '5 years': 1911,
          }
        },
      }
      let difference = 0
      let difference2 = 0
      formData.hdWarrAmount = selectedType && hdWarrArray[selectedType] && selectedOption && hdWarrArray[selectedType][selectedOption] && selectedYear && hdWarrArray[selectedType][selectedOption][selectedYear] ? hdWarrArray[selectedType][selectedOption][selectedYear] : 0;
      if (selectedOption === 'With Tire and Rim') {
        difference = hdWarrArray[selectedType][selectedOption][selectedYear] - hdWarrArray[selectedType]['W/O Tire and Rim'][selectedYear]

      }
      if (selectedOption === 'W/O Tire and Rim') {
        difference2 = hdWarrArray[selectedType][selectedOption][selectedYear] - hdWarrArray[selectedType]['With Tire and Rim'][selectedYear]

      }
      return (
        <>
          <div className='flex justify-between mt-3 xs:grid xs:grid-cols-1'>
            <select value={selectedType} onChange={handleTypeChange}
              className=" rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary"
            >
              <option value="0">Motorcycle Category</option>

              {Object.keys(hdWarrArray).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>

            {selectedType && (
              <select value={selectedOption} onChange={handleOptionChange}
                className="mx-auto  rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary"
              >
                <option value="0">Tire and Rim Choice</option>

                {Object.keys(hdWarrArray[selectedType]).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            )}

            {selectedOption && (
              <select value={selectedYear} onChange={handleYearChange}
                className="rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-primary"
              >
                <option value="0">Years</option>

                {Object.keys(hdWarrArray[selectedType][selectedOption]).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className='text-center'>
            {selectedOption === 'With Tire and Rim' && difference > 2 && (
              <>
                <p>H-D ESP FOR {selectedType} model family, {selectedOption} for {selectedYear} is only: ${formData.hdWarrAmount}</p >
                <p className='mt-2'> Difference is only ${difference}</p>
              </>
            )}
            {selectedOption === 'W/O Tire and Rim' && difference2 < 2 && (
              <>
                <p> {selectedType}, {selectedOption} for {selectedYear} The amount is: ${formData.hdWarrAmount}</p >
                <p className='mt-2'>The difference is only ${difference2}</p>
              </>
            )}
          </div>
        </>
      )

    }
    if (brand === 'BMW-Motorrad') {
      initial.m1000rMPkg = parseInt(bmwMoto.m1000rMPkg) || 0
      initial.m1000rTitEx = parseInt(bmwMoto.m1000rTitEx) || 0
      initial.desOption = parseInt(bmwMoto.desOption) || 0
      initial.m1000rrMPkg = parseInt(bmwMoto.m1000rrMPkg) || 0
      initial.s1000rrRacePkg = parseInt(bmwMoto.s1000rrRacePkg) || 0
      initial.s1000rrRacePkg2 = parseInt(bmwMoto.s1000rrRacePkg2) || 0
      initial.passengerKitLowSeat = parseInt(bmwMoto.passengerKitLowSeat) || 0
      initial.f7gsConn = parseInt(bmwMoto.f7gsConn) || 0
      initial.f8gsDblSeat = parseInt(bmwMoto.f8gsDblSeat) || 0
      initial.r12rtAudioSystem = parseInt(bmwMoto.r12rtAudioSystem) || 0
      initial.f9xrHandProtectors = parseInt(bmwMoto.f9xrHandProtectors) || 0
      initial.r12gsCrossGld = parseInt(bmwMoto.r12gsCrossGld) || 0
      initial.r12gsSpSusp = parseInt(bmwMoto.r12gsSpSusp) || 0
      initial.r12gsProtBar = parseInt(bmwMoto.r12gsProtBar) || 0
      initial.r12gsCrossBlk = parseInt(bmwMoto.r12gsCrossBlk) || 0
      initial.audioSystem = parseInt(bmwMoto.audioSystem) || 0
      initial.highShield = parseInt(bmwMoto.highShield) || 0
      initial.psgrKit = parseInt(bmwMoto.psgrKit) || 0
      initial.alarm = parseInt(bmwMoto.alarm) || 0
      initial.colorcost = parseInt(bmwMoto.color) || 0
      initial.chain = parseInt(bmwMoto.chain) || 0
      initial.comfortPkg = parseInt(bmwMoto.comfortPkg) || 0
      initial.touringPkg = parseInt(bmwMoto.touringPkg) || 0
      initial.activePkg = parseInt(bmwMoto.activePkg) || 0
      initial.dynamicPkg = parseInt(bmwMoto.dynamicPkg) || 0
      initial.offTire = parseInt(bmwMoto.offTire) || 0
      initial.keyless = parseInt(bmwMoto.keyless) || 0
      initial.headlightPro = parseInt(bmwMoto.headlightPro) || 0
      initial.shiftAssPro = parseInt(bmwMoto.shiftAssPro) || 0
      initial.tpc = parseInt(bmwMoto.tpc) || 0
      initial.cruise = parseInt(bmwMoto.cruise) || 0
      initial.windshield = parseInt(bmwMoto.windshield) || 0
      initial.handleBar = parseInt(bmwMoto.handleBar) || 0
      initial.extraHighSeat = parseInt(bmwMoto.extraHighSeat) || 0
      initial.alumTank1 = parseInt(bmwMoto.alumTank1) || 0
      initial.alumTank2 = parseInt(bmwMoto.alumTank2) || 0
      initial.classicW = parseInt(bmwMoto.classicW) || 0
      initial.silencer = parseInt(bmwMoto.silencer) || 0
      initial.chromedExhaust = parseInt(bmwMoto.chromedExhaust) || 0
      initial.crossW = parseInt(bmwMoto.crossW) || 0
      initial.highSeat = parseInt(bmwMoto.highSeat) || 0
      initial.lowKitLowSeat = parseInt(bmwMoto.lowKitLowSeat) || 0
      initial.lowSeat = parseInt(bmwMoto.lowSeat) || 0
      initial.comfortPsgrSeat = parseInt(bmwMoto.comfortPsgrSeat) || 0
      initial.mPsgrSeat = parseInt(bmwMoto.mPsgrSeat) || 0
      initial.aeroPkg719 = parseInt(bmwMoto.aeroPkg719) || 0
      initial.comfortSeat = parseInt(bmwMoto2.comfortSeat) || 0
      initial.designW = parseInt(bmwMoto2.designW) || 0
      initial.loweringKit = parseInt(bmwMoto2.loweringKit) || 0
      initial.forgedWheels = parseInt(bmwMoto2.forgedWheels) || 0
      initial.carbonWheels = parseInt(bmwMoto2.carbonWheels) || 0
      initial.centerStand = parseInt(bmwMoto2.centerStand) || 0
      initial.billetPack1 = parseInt(bmwMoto2.billetPack1) || 0
      initial.billetPack2 = parseInt(bmwMoto2.billetPack2) || 0
      initial.heatedSeat = parseInt(bmwMoto2.heatedSeat) || 0
      initial.lugRack = parseInt(bmwMoto2.lugRack) || 0
      initial.lugRackBrackets = parseInt(bmwMoto2.lugRackBrackets) || 0
      initial.chargeSocket = parseInt(bmwMoto2.chargeSocket) || 0
      initial.auxLights = parseInt(bmwMoto2.auxLights) || 0
      initial.mLightBat = parseInt(bmwMoto2.mLightBat) || 0
      initial.carbonPkg = parseInt(bmwMoto2.carbonPkg) || 0
      initial.enduroPkg = parseInt(bmwMoto2.enduroPkg) || 0
      initial.sportShield = parseInt(bmwMoto2.sportShield) || 0
      initial.sportWheels = parseInt(bmwMoto2.sportWheels) || 0
      initial.sportSeat = parseInt(bmwMoto2.sportSeat) || 0
      initial.brownBench = parseInt(bmwMoto2.brownBench) || 0
      initial.brownSeat = parseInt(bmwMoto2.brownSeat) || 0
      initial.handleRisers = parseInt(bmwMoto2.handleRisers) || 0
      initial.lgihtsPkg = parseInt(bmwMoto2.lgihtsPkg) || 0
      initial.fogLights = parseInt(bmwMoto2.fogLights) || 0
      initial.pilSeatCover = parseInt(bmwMoto2.pilSeatCover) || 0
      initial.lapTimer = parseInt(bmwMoto2.lapTimer) || 0
      initial.floorLight = parseInt(bmwMoto2.floorLight) || 0
      initial.blackBench = parseInt(bmwMoto2.blackBench) || 0
      initial.hillStart = parseInt(bmwMoto2.hillStart) || 0
      initial.floorboards = parseInt(bmwMoto2.floorboards) || 0
      initial.reverse = parseInt(bmwMoto2.reverse) || 0
      initial.forkTubeTrim = parseInt(bmwMoto2.forkTubeTrim) || 0
      initial.spokedW = parseInt(bmwMoto2.spokedW) || 0
      initial.lockGasCap = parseInt(bmwMoto2.lockGasCap) || 0
      initial.aeroWheel = parseInt(bmwMoto2.aeroWheel) || 0
      initial.psgrBench719 = parseInt(bmwMoto2.psgrBench719) || 0
      initial.blackS719 = parseInt(bmwMoto2.blackS719) || 0
      initial.aero719 = parseInt(bmwMoto2.aero719) || 0
      initial.pinstripe = parseInt(bmwMoto2.pinstripe) || 0
      initial.designPkgBL = parseInt(bmwMoto2.designPkgBL) || 0
      initial.benchseatlow = parseInt(bmwMoto2.benchseatlow) || 0
      initial.iconWheel = parseInt(bmwMoto2.iconWheel) || 0
      initial.centreStand = parseInt(bmwMoto2.centreStand) || 0
      initial.tubeHandle = parseInt(bmwMoto2.tubeHandle) || 0
      initial.classicWheels = parseInt(bmwMoto2.classicWheels) || 0
      initial.blackContrastwheel = parseInt(bmwMoto2.blackContrastwheel) || 0
      initial.silverContastWheel = parseInt(bmwMoto2.silverContastWheel) || 0
      initial.silverWheel = parseInt(bmwMoto2.silverWheel) || 0
      initial.activeCruise = parseInt(bmwMoto2.activeCruise) || 0
      initial.blackPowertrain = parseInt(bmwMoto2.blackPowertrain) || 0
      initial.blackWheel = parseInt(bmwMoto2.blackWheel) || 0
    }

    if (brand === 'Manitou') {
      initial.biminiCr = parseInt(manOptions.biminiCr) || 0
      initial.signature = parseInt(manOptions.signature) || 0
      initial.select = parseInt(manOptions.select) || 0
      initial.tubeColor = parseInt(manOptions.tubeColor) || 0
      initial.blkPkg = parseInt(manOptions.blkPkg) || 0
      initial.selRFXPkgLX = parseInt(manOptions.selRFXPkgLX) || 0
      initial.selRFXWPkgLX = parseInt(manOptions.selRFXWPkgLX) || 0
      initial.colMatchedFiberLX = parseInt(manOptions.colMatchedFiberLX) || 0
      initial.powderCoatingLX = parseInt(manOptions.powderCoatingLX) || 0
      initial.blackAnoLX = parseInt(manOptions.blackAnoLX) || 0
      initial.JLTowerLX = parseInt(manOptions.JLTowerLX) || 0
      initial.premiumJLLX = parseInt(manOptions.premiumJLLX) || 0
      initial.premAudioPkg = parseInt(manOptions.premAudioPkg) || 0
      initial.fibreglassFrontXT = manOptions.fibreglassFrontXT
      initial.JlPremiumAudio = parseInt(manOptions.JlPremiumAudio) || 0
      initial.JLPremiumxt = parseInt(manOptions.JLPremiumxt) || 0
      initial.XTPremiumcolor = parseInt(manOptions.XTPremiumcolor) || 0
      initial.dts = parseInt(manOptions.dts) || 0
      initial.verado = parseInt(manOptions.verado) || 0
      initial.battery = parseInt(manOptions.battery) || 0
      initial.gps = parseInt(manOptions.gps) || 0
      initial.saltwaterPkg = parseInt(manOptions.saltwaterPkg) || 0
      initial.propeller = parseInt(manOptions.propeller) || 0
      initial.baseInst = parseInt(manOptions.baseInst) || 0
      initial.cupHolder = parseInt(manOptions.cupHolder) || 0
      initial.multiHolder = parseInt(manOptions.multiHolder) || 0
      initial.cooler13 = parseInt(manOptions.cooler13) || 0
      initial.coolerExtension = parseInt(manOptions.coolerExtension) || 0
      initial.coolerBag14 = parseInt(manOptions.coolerBag14) || 0
      initial.singleHolder = parseInt(manOptions.singleHolder) || 0
      initial.stemwareHolder = parseInt(manOptions.stemwareHolder) || 0
      initial.cargoBox10 = parseInt(manOptions.cargoBox10) || 0
      initial.cargoBox20 = parseInt(manOptions.cargoBox20) || 0
      initial.cargoBox30 = parseInt(manOptions.cargoBox30) || 0
      initial.rodHolder = parseInt(manOptions.rodHolder) || 0
      initial.batteryCharger = parseInt(manOptions.batteryCharger) || 0
      initial.bowFillerBench = parseInt(manOptions.bowFillerBench) || 0
      initial.portAquaLounger = parseInt(manOptions.portAquaLounger) || 0
      initial.skiTowMirror = parseInt(manOptions.skiTowMirror) || 0
      initial.boatEngineAndTrailerFees = parseFloat(modelData.boatEngineAndTrailerFees) || 0
      initial.engineFreight = parseFloat(modelData.engineFreight) || 0
      initial.enginePreRigPrice = parseFloat(modelData.enginePreRigPrice) || 0
      initial.engineRigging = parseFloat(modelData.engineRigging) || 0
      initial.nmma = parseFloat(modelData.nmma) || 0
      initial.trailer = parseFloat(modelData.trailer) || 0;
    }

    if (brand === 'Switch') {
      initial.baseInst = parseInt(manOptions.baseInst) || 0
      initial.cupHolder = parseInt(manOptions.cupHolder) || 0
      initial.multiHolder = parseInt(manOptions.multiHolder) || 0
      initial.cooler13 = parseInt(manOptions.cooler13) || 0
      initial.coolerExtension = parseInt(manOptions.coolerExtension) || 0
      initial.coolerBag14 = parseInt(manOptions.coolerBag14) || 0
      initial.singleHolder = parseInt(manOptions.singleHolder) || 0
      initial.stemwareHolder = parseInt(manOptions.stemwareHolder) || 0
      initial.cargoBox10 = parseInt(manOptions.cargoBox10) || 0
      initial.cargoBox20 = parseInt(manOptions.cargoBox20) || 0
      initial.cargoBox30 = parseInt(manOptions.cargoBox30) || 0
      initial.rodHolder = parseInt(manOptions.rodHolder) || 0
      initial.batteryCharger = parseInt(manOptions.batteryCharger) || 0
      initial.bowFillerBench = parseInt(manOptions.bowFillerBench) || 0
      initial.portAquaLounger = parseInt(manOptions.portAquaLounger) || 0
      initial.skiTowMirror = parseInt(manOptions.skiTowMirror) || 0
    }
  }
  const [formData, setFormData] = useState(initial)

  function ClientResultFunction({ formData, }) {
    let clientResultList = [

      { name: 'referral', value: formData.referral, label: 'Referral', },
      { name: 'visited', value: formData.visited, label: 'Visited', },
      { name: 'bookedApt', value: formData.bookedApt, label: 'Booked Apt', },
      { name: 'aptShowed', value: formData.aptShowed, label: 'Apt Showed', },
      { name: 'aptNoShowed', value: formData.aptNoShowed, label: 'Apt No Showed', },
      { name: 'testDrive', value: formData.testDrive, label: 'Test Drive', },
      { name: 'seenTrade', value: formData.seenTrade, label: 'Seen Trade', },
      { name: 'metService', value: formData.metService, label: 'Met Service', },
      { name: 'metManager', value: formData.metManager, label: 'Met Manager', },
      { name: 'metParts', value: formData.metParts, label: 'Met Parts', },
      { name: 'sold', value: formData.sold, label: 'Sold', },
      { name: 'deposit', value: formData.deposit, label: 'Deposit', },
      { name: 'refund', value: formData.refund, label: 'Refund', },
      { name: 'turnOver', value: formData.turnOver, label: 'Turn Over', },
      { name: 'financeApp', value: formData.financeApp, label: 'Finance Application Done', },
      { name: 'approved', value: formData.approved, label: 'approved', },
      { name: 'signed', value: formData.signed, label: 'Signed Docs', },
      { name: 'licensingSent', value: formData.licensingSent, label: 'Licensing Sent', },
      { name: 'liceningDone', value: formData.liceningDone, label: 'Licening Done', },
      { name: 'pickUpSet', value: formData.pickUpSet, label: 'Pick Up Date Set', },
      { name: 'demoed', value: formData.demoed, label: 'Demoed' },
      { name: 'delivered', value: formData.delivered, label: 'Delivered', },
      { name: 'funded', value: formData.funded, label: 'Funded', },
      { name: 'cancelled', value: formData.cancelled, label: 'Cancelled', },
      { name: 'lost', value: formData.lost, label: 'Lost', },
    ];

    return clientResultList
  }
  const handleInputChange = (name, checked) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked ? 'on' : 'off',
    }));
  };

  const [editProgress, setEditProgress] = useState(false)
  const [editUnits, setEditUnits] = useState(false)
  const [editTradeUnits, setEditTradeUnits] = useState(false)
  function handleEditUnits() {
    // Toggle the value of editUnits
    setEditUnits((prevEditUnits) => !prevEditUnits);
  }
  function handleEditTradeUnits() {
    // Toggle the value of editUnits
    setEditTradeUnits((prevEditTradeUnits) => !prevEditTradeUnits);
  }
  function handleProgressUnits() {
    // Toggle the value of editUnits
    setEditProgress((prevEditProgress) => !prevEditProgress);
  }

  bmwTotal =
    initial.mPsgrSeat +
    initial.aeroPkg719 +
    initial.m1000rMPkg +
    initial.m1000rTitEx +
    initial.desOption +
    initial.m1000rrMPkg +
    initial.s1000rrRacePkg +
    initial.s1000rrRacePkg2 +
    initial.passengerKitLowSeat +
    initial.f7gsConn +
    initial.f8gsDblSeat +
    initial.r12rtAudioSystem +
    initial.f9xrHandProtectors +
    initial.r12gsCrossGld +
    initial.r12gsSpSusp +
    initial.r12gsProtBar +
    initial.r12gsCrossBlk +
    initial.audioSystem +
    initial.highShield +
    initial.psgrKit +
    initial.alarm +
    //  initial.colorcost +
    initial.chain +
    initial.comfortPkg +
    initial.touringPkg +
    initial.activePkg +
    initial.dynamicPkg +
    initial.offTire +
    initial.keyless +
    initial.headlightPro +
    initial.shiftAssPro +
    initial.tpc +
    initial.cruise +
    initial.windshield +
    initial.handleBar +
    initial.extraHighSeat +
    initial.alumTank1 +
    initial.alumTank2 +
    initial.classicW +
    initial.silencer +
    initial.chromedExhaust +
    initial.crossW +
    initial.highSeat +
    initial.lowKitLowSeat +
    initial.lowSeat +
    initial.comfortSeat +
    initial.designW +
    initial.loweringKit +
    initial.forgedWheels +
    initial.carbonWheels +
    initial.centerStand +
    initial.billetPack1 +
    initial.billetPack2 +
    initial.heatedSeat +
    initial.lugRack +
    initial.lugRackBrackets +
    initial.chargeSocket +
    initial.auxLights +
    initial.mLightBat +
    initial.carbonPkg +
    initial.enduroPkg +
    initial.sportShield +
    initial.sportWheels +
    initial.sportSeat +
    initial.brownBench +
    initial.brownSeat +
    initial.handleRisers +
    initial.lgihtsPkg +
    initial.fogLights +
    initial.pilSeatCover +
    initial.lapTimer +
    initial.floorLight +
    initial.blackBench +
    initial.hillStart +
    initial.floorboards +
    initial.reverse +
    initial.forkTubeTrim +
    initial.spokedW +
    initial.lockGasCap +
    initial.aeroWheel +
    initial.psgrBench719 +
    initial.blackS719 +
    initial.aero719 +
    initial.pinstripe +
    initial.designPkgBL +
    initial.benchseatlow +
    initial.iconWheel +
    initial.centreStand +
    initial.tubeHandle +
    initial.classicWheels +
    initial.blackContrastwheel +
    initial.silverContastWheel +
    initial.silverWheel +
    initial.activeCruise +
    initial.blackPowertrain +
    initial.comfortPsgrSeat +
    initial.blackWheel;

  modelSpecOpt =
    initial.battery +
    initial.propeller +
    initial.gps +
    initial.saltwaterPkg;

  motorTotal =
    initial.dts +
    initial.verado;

  accTotal =
    initial.baseInst +
    initial.cupHolder +
    initial.multiHolder +
    initial.cooler13 +
    initial.coolerExtension +
    initial.coolerBag14 +
    initial.singleHolder +
    initial.stemwareHolder +
    initial.cargoBox10 +
    initial.cargoBox20 +
    initial.cargoBox30 +
    initial.rodHolder +
    initial.batteryCharger +
    initial.bowFillerBench +
    initial.portAquaLounger +
    initial.skiTowMirror;

  optionsTotalMani =
    initial.biminiCr +
    initial.signature +
    initial.select +
    initial.tubeColor +
    initial.selRFXPkgLX +
    initial.selRFXWPkgLX +
    initial.blkPkg +
    initial.colMatchedFiberLX +
    initial.powderCoatingLX +
    initial.blackAnoLX +
    initial.JLTowerLX +
    initial.premiumJLLX +
    initial.premAudioPkg +
    initial.XTPremiumcolor +
    initial.JlPremiumAudio +
    initial.JLPremiumxt;

  feesTotal =
    initial.boatEngineAndTrailerFees +
    initial.engineFreight +
    initial.enginePreRigPrice +
    initial.engineRigging +
    initial.nmma +
    initial.trailer;

  maniTotal = modelSpecOpt + motorTotal + motorTotal + accTotal + optionsTotalMani + feesTotal;
  let panAmLacedWheels = formData.panAmTubelessLacedWheels || 0;
  let panAmAdpRide = formData.panAmAdpRide || 0;

  let hdWarrAmount = formData.hdWarrAmount || 0;
  // ----- calc ----- if anyone wants to check math, go for it matches td auto loan payments to the penny ---- !!! do not fix errors it will mess up the calculations !!!
  const hdAcc = panAmLacedWheels + panAmAdpRide + hdWarrAmount;
  const paintPrem = parseInt(formData.paintPrem.toString());
  const msrp = parseFloat(formData.msrp.toString());
  const accessories = parseFloat(formData.accessories.toString()) || 0;
  const totalLabour = parseFloat(formData.labour.toString()) * parseFloat(formData.userLabour.toString()) || 0;
  const othConv = parseFloat(formData.othTax.toString());
  const downPayment = parseFloat(formData.deposit.toString()) || 0;
  const discount = parseFloat(formData.discount.toString()) || 0;
  const tradeValue = parseFloat(formData.tradeValue.toString()) || 0;
  const lien = parseFloat(formData.lien.toString()) || 0;

  const deposit = parseFloat(formData.deposit.toString()) || 0;
  const discountPer = parseFloat(formData.discountPer.toString()) || 0;
  const months = parseFloat(formData.months.toString()) || 0;
  const iRate = parseFloat(formData.iRate.toString()) || 0;
  const deliveryCharge = parseFloat(formData.deliveryCharge.toString()) || 0;

  const numberOfMonths = parseInt(formData.months.toString())
  const msrp1 = (msrp * (100 - discountPer)) / 100;
  const manitouRandomFees = (finance.brand === 'Manitou' ? 475 : 0)

  let essentials = 0

  essentials =
    formData.userDemo +
    formData.userGovern +
    formData.userGasOnDel +
    formData.userAirTax +
    formData.userFinance +
    formData.destinationCharge +
    formData.userMarketAdj +
    formData.userTireTax +
    formData.userOMVIC +
    formData.admin +
    formData.commodity +
    formData.freight +
    deliveryCharge +
    formData.pdi +
    hdAcc

  if (brand === 'Manitou') {
    essentials =
      formData.userDemo +
      formData.userGovern +
      formData.userGasOnDel +
      formData.userAirTax +
      formData.userFinance +
      formData.destinationCharge +
      formData.userMarketAdj +
      formData.userTireTax +
      formData.userOMVIC +
      formData.admin +
      formData.commodity +
      formData.freight +
      formData.pdi +
      deliveryCharge +

      manitouRandomFees +
      maniTotal
  }
  if (brand === 'Switch') {
    essentials =
      formData.userDemo +
      formData.userGovern +
      formData.userGasOnDel +
      formData.userAirTax +
      formData.userFinance +
      formData.destinationCharge +
      formData.userMarketAdj +
      formData.userTireTax +
      formData.userOMVIC +
      formData.admin +
      formData.commodity +
      formData.freight +
      formData.pdi +
      deliveryCharge +

      accTotal;
  }
  if (brand === 'BMW-Motorrad') {
    essentials =
      formData.userDemo +
      formData.userGovern +
      formData.userGasOnDel +
      formData.userAirTax +
      formData.userFinance +
      formData.destinationCharge +
      formData.userMarketAdj +
      formData.userTireTax +
      formData.userOMVIC +
      formData.admin +
      formData.commodity +
      formData.freight +
      formData.pdi +
      manitouRandomFees +
      deliveryCharge +

      bmwTotal;
  }

  // dealer options
  const options =
    formData.userOther +
    formData.userServicespkg +
    formData.vinE +
    formData.rustProofing +
    formData.userGap +
    formData.userLoanProt +
    formData.userExtWarr +
    formData.lifeDisability +
    formData.userTireandRim;

  const total =
    essentials +
    parseInt(paintPrem) +
    parseInt(accessories) +
    parseInt(totalLabour) -
    parseInt(tradeValue) +
    (discountPer === 0 ? parseInt(msrp) : parseInt(msrp1)) - parseInt(discount);

  const totalWithOptions = total + options;

  const beforeDiscount =
    essentials +
    parseInt(paintPrem) +
    parseInt(formData.freight) +
    parseInt(formData.admin) +
    parseInt(formData.pdi) +
    parseInt(formData.commodity) +
    parseInt(accessories) +
    parseInt(totalLabour) +
    parseInt(tradeValue) +
    parseInt(msrp) -
    parseInt(discount);

  const perDiscountGiven =
    essentials +
    parseInt(paintPrem) +
    parseInt(formData.freight) +
    parseInt(formData.admin) +
    parseInt(formData.pdi) +
    parseInt(formData.commodity) +
    parseInt(accessories) +
    parseInt(totalLabour) +
    parseInt(tradeValue) +
    parseInt(msrp) -
    parseInt(discount) -
    (essentials +
      parseInt(formData.freight) +
      parseInt(paintPrem) +
      parseInt(formData.pdi) +
      parseInt(formData.admin) +
      parseInt(formData.commodity) +
      parseInt(accessories) +
      parseInt(totalLabour) +
      parseInt(tradeValue) +
      (discountPer === 0 ? parseInt(msrp) : parseInt(msrp1)) -
      parseInt(discount))

  const totalWithOptionsWithTax = (
    totalWithOptions *
    (parseFloat(deFees.userTax) / 100 + 1)
  ).toFixed(2)

  const licensing = parseInt(formData.licensing) + parseInt(formData.lien)
  const conversionOth = (parseFloat(othConv) / 100 + 1).toFixed(2);
  const othTax = conversionOth

  const otherTax = (licensing + (total * othTax)).toFixed(2)
  // const onTax =  (total * (parseFloat(deFees.userTax) / 100 + 1)).toFixed(2)
  const native = (licensing + total).toFixed(2)
  const onTax = (licensing + (total * (parseFloat(deFees.userTax) / 100 + 1))).toFixed(2)
  const optionsTotal = total + options
  const qcTax = (licensing + (optionsTotal * (parseFloat(deFees.userTax) / 100 + 1))).toFixed(2)
  const otherTaxWithOptions = (licensing + (totalWithOptions * othTax)).toFixed(2)

  const loanAmountON = parseFloat(onTax)
  const loanAmountQC = parseFloat(qcTax)
  const loanAmountNAT = parseFloat(native)
  const loadAmountNATWOptions = totalWithOptions
  const loanAmountOther = parseFloat(otherTax) || 0
  const loanAmountOtherOptions = parseFloat(otherTaxWithOptions) || 0

  const iRateCon = parseFloat(iRate);
  const conversion = iRateCon / 100;
  const monthlyInterestRate = conversion / 12;

  const loanPrincipalON = loanAmountON - downPayment + lien;
  const loanPrincipalQC = loanAmountQC - downPayment + lien;

  const loanPrincipalNAT = loanAmountNAT - downPayment + lien;
  const loanPrincipalNATWOptions = loadAmountNATWOptions - downPayment + lien;

  const loanPrincipalOth = loanAmountOther - downPayment + lien;
  const loanPrincipalOthWOptions = loanAmountOtherOptions - downPayment + lien;

  // payments
  const on60 = parseFloat(((monthlyInterestRate * loanPrincipalON) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(2));
  const biweekly = parseFloat(((on60 * 12) / 26).toFixed(2));
  const weekly = parseFloat(((on60 * 12) / 52).toFixed(2));

  // w/options
  const qc60 = parseFloat(((monthlyInterestRate * loanPrincipalQC) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(2));
  const biweeklyqc = parseFloat(((qc60 * 12) / 26).toFixed(2));
  const weeklyqc = parseFloat(((qc60 * 12) / 52).toFixed(2));

  // no tax
  const nat60 = parseFloat(((monthlyInterestRate * loanPrincipalNAT) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(2));
  const biweeklNat = parseFloat(((nat60 * 12) / 26).toFixed(2));
  const weeklylNat = parseFloat(((nat60 * 12) / 52).toFixed(2));

  // with options
  const nat60WOptions = parseFloat(((monthlyInterestRate * loanPrincipalNATWOptions) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(2));
  const biweeklNatWOptions = parseFloat(((nat60WOptions * 12) / 26).toFixed(2));
  const weeklylNatWOptions = parseFloat(((nat60WOptions * 12) / 52).toFixed(2));

  // custom tax
  const oth60 = parseFloat(((monthlyInterestRate * loanPrincipalOth) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(2));
  const biweekOth = parseFloat(((oth60 * 12) / 26).toFixed(2));
  const weeklyOth = parseFloat(((oth60 * 12) / 52).toFixed(2));

  // with options
  const oth60WOptions = parseFloat(((monthlyInterestRate * loanPrincipalOthWOptions) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))).toFixed(2));
  const biweekOthWOptions = parseFloat(((oth60WOptions * 12) / 26).toFixed(2));
  const weeklyOthWOptions = parseFloat(((oth60WOptions * 12) / 52).toFixed(2));

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value, }))
  }

  if (!finance.model1) {
    const model1 = finance.model
  }

  const [mainButton, setMainButton] = useState('payments');
  const [subButton, setSubButton] = useState('withoutOptions');
  const [desiredPayments, setDesiredPayments] = useState('');

  const handleMainButtonClick = (mainButton) => {
    setMainButton(mainButton);
  };

  const handleSubButtonClick = (subButton) => {
    setSubButton(subButton);
  };

  const paymentMapping = {
    payments: {
      withoutOptions: 'Standard Payment',
      withOptions: 'Payments with Options',
    },
    noTax: {
      withoutOptions: 'No Tax Payment',
      withOptions: 'No Tax Payment with Options',
    },
    customTax: {
      withoutOptions: 'Custom Tax Payment',
      withOptions: 'Custom Tax Payment with Options',
    },
  };

  useEffect(() => {
    if (mainButton in paymentMapping && subButton in paymentMapping[mainButton]) {
      setDesiredPayments(paymentMapping[mainButton][subButton]);
    } else {
      setDesiredPayments('');
    }
  }, [mainButton, subButton]);

  const [financeSubTotal, setFinanceSubTotal] = useState(0.00)
  const [financeTotal, setFinanceTotal] = useState(0.00)

  useEffect(() => {

    switch (finance.desiredPayments) {
      case 'Standard Payment':
        setFinanceSubTotal(total)
        setFinanceTotal(onTax)
        break;
      case 'Payments with Options':
        setFinanceSubTotal(totalWithOptions)
        setFinanceTotal(qcTax)
        break;
      case 'No Tax Payment':
        setFinanceSubTotal(total)
        setFinanceTotal(native)
        break;
      case 'No Tax Payment with Options':
        setFinanceSubTotal(totalWithOptions)
        setFinanceTotal(totalWithOptions)
        break;
      case 'Custom Tax Payment':
        setFinanceSubTotal(total)
        setFinanceTotal(otherTax)
        break;
      case 'Custom Tax Payment with Options':
        setFinanceSubTotal(totalWithOptions)
        setFinanceTotal(otherTaxWithOptions)
        break;
      default:
        null

    }
  }, [finance.desiredPayments]);



  function getStateSizeInBytes(state) {
    const jsonString = JSON.stringify(state);
    const sizeInBytes = new TextEncoder().encode(jsonString).length;
    return sizeInBytes;
  }
  const lockedValue = Boolean(true)


  function DealerOptionsAmounts() {
    return (
      <>
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="userServicespkg"
                name="userServicespkg"
                checked={formData.userServicespkg !== 0}
                className={`form-checkbox mr-2 ${formData.userServicespkg !== 0 ? 'checked:bg-gray-500' : ''}`}
                onChange={(e) => {
                  const { name, checked } = e.target;
                  const newValue = checked ? parseFloat(deFees.userServicespkg) : 0; // Use the correct variable name here
                  setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                }}
              />
              <p className="mr-4">Service Packages  </p>
            </div>
            <p>${formData.userServicespkg}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="userExtWarr"
                name="userExtWarr"
                checked={formData.userExtWarr !== 0}
                className={`form-checkbox mr-2 ${formData.userExtWarr !== 0 ? 'checked:bg-gray-500' : ''}`}
                onChange={(e) => {
                  const { name, checked } = e.target;
                  const newValue = checked ? parseFloat(deFees.userExtWarr) : 0; // Use the correct variable name here
                  setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                }}
              />
              <p className="mr-4">Extended Warranty</p>
            </div>
            <p>${formData.userExtWarr}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="vinE"
                name="vinE"
                checked={formData.vinE !== 0}
                className={`form-checkbox mr-2 ${formData.vinE !== 0 ? 'checked:bg-gray-500' : ''}`}
                onChange={(e) => {
                  const { name, checked } = e.target;
                  const newValue = checked ? parseFloat(deFees.vinE) : 0; // Use the correct variable name here
                  setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                }}
              />
              <p className="mr-4">Vin Etching</p>
            </div>
            <p>${formData.vinE}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rustProofing"
                name="rustProofing"
                checked={formData.rustProofing !== 0}
                className={`form-checkbox mr-2 ${formData.rustProofing !== 0 ? 'checked:bg-gray-500' : ''}`}
                onChange={(e) => {
                  const { name, checked } = e.target;
                  const newValue = checked ? parseFloat(deFees.rustProofing) : 0; // Use the correct variable name here
                  setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                }}
              />
              <p className="mr-4">Under Coating</p>
            </div>
            <p>${formData.rustProofing}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="userGap"
                name="userGap"
                checked={formData.userGap !== 0}
                className={`form-checkbox mr-2 ${formData.userGap !== 0 ? 'checked:bg-gray-500' : ''}`}
                onChange={(e) => {
                  const { name, checked } = e.target;
                  const newValue = checked ? parseFloat(deFees.userGap) : 0; // Use the correct variable name here
                  setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                }}
              />
              <p className="mr-4">Gap Insurance</p>
            </div>
            <p>${formData.userGap}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="userLoanProt"
                name="userLoanProt"
                checked={formData.userLoanProt !== 0}
                className={`form-checkbox mr-2 ${formData.userLoanProt !== 0 ? 'checked:bg-gray-500' : ''}`}
                onChange={(e) => {
                  const { name, checked } = e.target;
                  const newValue = checked ? parseFloat(deFees.userLoanProt) : 0; // Use the correct variable name here
                  setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                }}
              />
              <p className="mr-4">Loan Protection</p>
            </div>
            <p>${formData.userLoanProt}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="userTireandRim"
                name="userTireandRim"
                checked={formData.userTireandRim !== 0}
                className={`form-checkbox mr-2 ${formData.userTireandRim !== 0 ? 'checked:bg-gray-500' : ''}`}
                onChange={(e) => {
                  const { name, checked } = e.target;
                  const newValue = checked ? parseFloat(deFees.userTireandRim) : 0; // Use the correct variable name here
                  setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                }}
              />
              <p className="mr-4">  Tire and Rim Protection </p>
            </div>
            <p> ${formData.userTireandRim} </p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="lifeDisability"
                name="lifeDisability"
                checked={formData.lifeDisability !== 0}
                className={`form-checkbox mr-2 ${formData.lifeDisability !== 0 ? 'checked:bg-gray-500' : ''}`}
                onChange={(e) => {
                  const { name, checked } = e.target;
                  const newValue = checked ? parseFloat(deFees.lifeDisability) : 0; // Use the correct variable name here
                  setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                }}
              />
              <p className="mr-4">Life and Disability</p>
            </div>
            <p>${formData.lifeDisability}</p>
          </div>

        </>
      </>
    )
  }
  const formDataSizeInBytes = getStateSizeInBytes(formData);

  let today2 = new Date();
  const nextAppt = today2.setHours(today2.getHours() + 24);

  useEffect(() => {
    const button = document.getElementById('myButton');
    const button2 = document.getElementById('myButton2');
    const button3 = document.getElementById('myButton3');
    const button4 = document.getElementById('myButton4');
    const button5 = document.getElementById('myButton5');
    const button6 = document.getElementById('button6');
    if (button5) {
      button5.addEventListener('mousedown', function () {
        this.style.transform = 'translateY(1.5px)';
      });

      button5.addEventListener('mouseup', function () {
        this.style.transform = 'translateY(-1.5px)';
      });
    }
    if (button) {
      button.addEventListener('mousedown', function () {
        this.style.transform = 'translateY(1.5px)';
      });

      button.addEventListener('mouseup', function () {
        this.style.transform = 'translateY(-1.5px)';
      });
    }
    if (button2) {
      button2.addEventListener('mousedown', function () {
        this.style.transform = 'translateY(1.5px)';
      });

      button2.addEventListener('mouseup', function () {
        this.style.transform = 'translateY(-1.5px)';
      });
    }
    if (button3) {
      button3.addEventListener('mousedown', function () {
        this.style.transform = 'translateY(1.5px)';
      });

      button3.addEventListener('mouseup', function () {
        this.style.transform = 'translateY(-1.5px)';
      });
    }
    if (button4) {
      button4.addEventListener('mousedown', function () {
        this.style.transform = 'translateY(1.5px)';
      });

      button4.addEventListener('mouseup', function () {
        this.style.transform = 'translateY(-1.5px)';
      });
    }
    if (button6) {
      button6.addEventListener('mousedown', function () {
        this.style.transform = 'translateY(1.5px)';
      });

      button6.addEventListener('mouseup', function () {
        this.style.transform = 'translateY(-1.5px)';
      });
    }
  }, []);

  const [firstPage, setFirstPage] = useState(true);
  const [secPage, setSecPage] = useState(false);
  const [minForm, setMinForm] = useState('00');
  const [hourForm, setHourForm] = useState('09');

  function handleNextPage() {
    if (firstPage === true) {
      setFirstPage(false)
      setSecPage(true)
    }
    if (secPage === true) {
      setFirstPage(true)
      setSecPage(false)
    }
  }
  function handlePrevPage() {
    if (firstPage === true) {
      setFirstPage(false)
      setSecPage(true)
    }
    if (secPage === true) {
      setFirstPage(true)
      setSecPage(false)
    }
  }
  const isDate = (date) => !isNaN(date) && date instanceof Date;

  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckedChange = (name, isChecked) => {
    setCheckedItems((prev) => ({ ...prev, [name]: isChecked }));
    column.toggleVisibility(isChecked);
  };

  const items = ClientResultFunction({ formData });

  const newDate = new Date()

  interface Item {
    name: string;
    label: string;
    value: string;
  }

  interface Props {
    items: Item[];
  }

  // -----------------------------sms ---------------------------------//
  const { searchData, convoList, } = useLoaderData();
  const [messagesConvo, setMessagesConvo] = useState([]);
  const [chatReady, setChatReady] = useState(false);


  let multipliedConvoList = [];
  for (let i = 0; i < 30; i++) {
    multipliedConvoList = multipliedConvoList.concat(convoList);
  }
  const [channels, setChannels] = useState(multipliedConvoList);
  const [openSMS, setOpenSMS] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerfinanceId, setCustomerfinanceId] = useState('')
  const [smsDetails, setSmsDetails] = useState([])
  const [channelName, setChannelName] = useState('');
  const [selectedChannelSid, setSelectedChannelSid] = useState([]);

  const handleButtonClick = (rowData) => {
    setOpen(true);
    setCustomerEmail(rowData.email);
    setCustomerName(rowData.name);
    setCustomerfinanceId(rowData.financeId);
  };
  const getObjectById = (id) => { return searchData.find(item => item.id === id); };

  const handleButtonClickSMS = async (data) => {
    const theFile = await getObjectById(data.clientfileId)
    const clientfileId = data.clientfileId
    const conversationId = theFile?.conversationId
    const messageDetails = {
      conversationId: conversationId,
      clientfileId: clientfileId,
      name: data.name,
      email: data.email,
      financeId: data.id,
      phone: data.phone,
      identity: `+1${user.phone}`,
    }
    setSmsDetails(messageDetails)
    setChannelName(data.author || conversationId)
    setSelectedChannelSid(conversationId);
    setOpenSMS(true);
  }
  useEffect(() => {
    handleButtonClickSMS(finance)
  }, []);

  const selectedChannel = Array.isArray(channels) ? channels.find((it) => it.sid === selectedChannelSid) : null;

  useEffect(() => {
    const initConversations = async () => {
      const token = callToken

      setTimeout(() => {
        const client = new Client(token);
        setClient(client);
        setStatusString("Connecting to Twilio…")

        client.on("connectionStateChanged", (state) => {
          if (state === "connecting") {
            setStatusString("Connecting to Twilio…")
            setStatus("default")
          }
          if (state === "connected") {
            setStatusString("You are connected.")
            setStatus("success")
            setLoading(false)
            setLoggedIn(user.email)
          }
          if (state === "disconnecting") {
            setStatusString("Disconnecting from Twilio…")
            setChatReady(false)
            setStatus("default")
          }
          if (state === "disconnected") {
            setStatusString("Disconnected.",)
            setChatReady(false)
            setStatus("warning")
          }
          if (state === "denied") {
            setStatusString("Failed to connect.",)
            setChatReady(false)
            setStatus("error")
          }
        });

        client.on('tokenAboutToExpire', () => {
          console.log('About to expire');
          const username = 'skylerzanth'//localStorage.getItem("username") ?? "";
          const password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
          setName(username)
          if (username.length > 0 && password.length > 0) {
            getToken(username, password)
              .then((token) => {
                // login(token);
                setToken(token)
              })
              .catch(() => {
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
              })
              .finally(() => {
                setLoading(false);
                setStatusString("Fetching credentials…");
              });
          }
        });
        client.on('tokenExpired', () => {
          console.log('Token expired');
          client.removeAllListeners();
          const client2 = new Client(token);
          setClient(client2);
          setStatusString("Connecting to Twilio…")
        });
        client.on("conversationJoined", (conversation) => {
          setChannels((prevChannels) => [...prevChannels, conversation]);
        });
        client.on("conversationLeft", (thisConversation) => {
          setChannels((prevChannels) =>
            prevChannels.filter((it) => it !== thisConversation)
          );
        });
        client.on('typingStarted', (user) => {
          console.log('typing..', user);
          if (user.conversation.sid === currentConversation.sid) setIsTyping(true);
        });
        client.on('typingEnded', (user) => {
          console.log('typing end..', user);
          if (user.conversation.sid === currentConversation.sid) setIsTyping(false);
        });
      }, 10);

    }
    initConversations()
    setChatReady(true);
  }, []);
  const [financeNotesList, setFinanceNoteList] = useState([])
  const [conversationsList, setConversationsList] = useState([])
  const [customer, setCustomer] = useState()
  const [customerMessages, setCustomerMessages] = useState([])
  const [conversationSid, setConversationSid] = useState('')

  useEffect(() => {
    function getNotesByFinanceId(notes, financeId) {
      return notes.filter(note => note.financeId === financeId);
    }
    const filteredNotes = getNotesByFinanceId(financeNotes, data.id);
    setFinanceNoteList(filteredNotes)
    function GetConversationsByID(conversations, financeId) {
      return conversations.filter(conversation => conversation.conversationSid === financeId);
    }
    const filteredConversations = GetConversationsByID(messagesConvo, user.conversationSid);
    setConversationsList(filteredConversations)
  }, [messagesConvo]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [latestNote, setlatestNote] = useState([])

  useEffect(() => {
    const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
    const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
    setCustomer(smsDetails);

    if (smsDetails) {
      const newConversationSid = smsDetails.conversationId;
      setConversationSid(newConversationSid);

      if (newConversationSid) {
        const url = `https://conversations.twilio.com/v1/Conversations/${newConversationSid}/Messages`;
        const credentials = `${accountSid}:${authToken}`;
        const base64Credentials = btoa(credentials);

        async function fetchMessages() {
          try {
            const response = await fetch(url, {
              method: 'GET',
              headers: { 'Authorization': `Basic ${base64Credentials}` },
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.length !== 0) {
              setCustomerMessages(data.messages);

            }
            else {
              setCustomerMessages([])
            }
            console.log(data, 'fetched messages');
            return data;
          } catch (error) {
            console.error('Failed to fetch messages:', error);
          }
        }

        fetchMessages();
      }
    }
  }, [smsDetails]);

  // -----------------------------sms ---------------------------------//
  // -----------------------------email ---------------------------------//
  const { conversations, } = useLoaderData();

  const [emailData, setEmailData] = useState()

  useEffect(() => {
    if (data) {

      function getNotesByFinanceId(notes, financeId) {
        return notes.filter(note => note.financeId === financeId);
      }
      const filteredNotes = getNotesByFinanceId(financeNotes, data.financeId);

      setFinanceNoteList(filteredNotes)
      function GetConversationsByID(conversations, financeId) {
        return conversations.filter(conversation => conversation.financeId === financeId);
      }
      const filteredConversations = GetConversationsByID(conversations, data.financeId);

      setConversationsList(filteredConversations)
    }

  }, [data.financeId]);

  useEffect(() => {
    if (data && open === true) {
      const serializedUser = JSON.stringify(user);
      const cust = {
        email: customerEmail,
        name: customerName,
        financeId: customerfinanceId,
      }
      const serializedCust = JSON.stringify(cust);
      window.localStorage.setItem("user", serializedUser);
      window.localStorage.setItem("customer", serializedCust);
    }

  }, []);

  useEffect(() => {
    if (data) {
      const getemailData = window.localStorage.getItem("emailData");
      const parseemailData = getemailData ? JSON.parse(getemailData) : [];
      setEmailData(parseemailData)
    }
  }, []);

  if (emailData) {
    const SaveFunction = async () => {
      const createFinanceNotes = await prisma.comm.create({
        Finance: { connect: { id: emailData.financeId, } },

        data: {
          financeId: emailData.financeId,
          body: emailData.body,
          userName: emailData.userName,
          type: 'Email',
          direction: 'Outgoing',
          subject: emailData.subject,
          result: 'Attempted',
          userEmail: emailData.userEmail,
        },
      });
      return createFinanceNotes
    }
    SaveFunction()

  }

  const MyIFrameComponentEmail = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const handleHeightMessage = (event: MessageEvent) => {
        if (
          event.data &&
          event.data.type === "iframeHeight" &&
          event.data.height
        ) {
          setIsLoading(false);
          if (iFrameRef.current) {
            iFrameRef.current.style.height = `${event.data.height}px`;
          }
        }
      };
      const currentHost =
        typeof window !== "undefined" ? window.location.host : null;
      if (iFrameRef.current) {
        if (currentHost === "localhost:3000") {
          iFrameRef.current.src = "http://localhost:3000/dealer/email/dashboardClient";
        }
        if (currentHost === "dealersalesassistant.ca") {
          iFrameRef.current.src =
            "https://www.dealersalesassistant.ca/dealer/email/dashboardClient";
        }
        window.addEventListener("message", handleHeightMessage);

        const cust = {
          email: data.email,
          name: data.name,
          financeId: data.financeId,
        };
        const sendData = { cust, user };

        // Add load event listener to ensure iframe is loaded
        const onLoad = () => {
          iFrameRef.current.contentWindow.postMessage(sendData, '*');
        };
        iFrameRef.current.addEventListener('load', onLoad);

        return () => {
          window.removeEventListener("message", handleHeightMessage);
          iFrameRef.current?.removeEventListener('load', onLoad);
        };
      }
    }, []);

    return (
      <>
        <div className="size-full ">
          <iframe
            ref={iFrameRef}
            title="my-iframe"
            width="100%"
            className=" border-none"
            style={{
              minHeight: "40vh"

            }}
          />
        </div>
      </>
    );
  };
  let customerCard = [
    { name: 'firstName', value: finance.firstName, label: 'First Name', },
    { name: 'lastName', value: finance.lastName, label: 'Last Name', },
    { name: 'phone', value: finance.phone, label: 'Phone', },
    { name: 'email', value: finance.email, label: 'Email', },
    { name: 'address', value: finance.address, label: 'Address', },
    { name: 'city', value: finance.city, label: 'City', },
    { name: 'postal', value: finance.postal, label: 'Postal', },
    { name: 'lastContact', value: finance.lastContact, label: 'Last Contact', },
    { name: 'nextAppointment', value: finance.nextAppointment, label: 'Next Appointment', },
    { name: 'deliveryDate', value: finance.deliveryDate, label: 'Delivery Date', },
    { name: 'deliveredDate', value: finance.deliveredDate, label: 'Delivered Date', },
    { name: 'depositMade', value: finance.depositMade, label: 'Deposit Made', },
    { name: 'userEmail', value: finance.userEmail, label: 'Sales person', },
    { name: 'financeManager', value: finance.financeManager, label: 'Finance manager', },
  ];

  // -----------------------------finance dropdowns ---------------------------------//
  const email = [
    {
      value: "Send Payments",
      label: "Send Payments",
      template: "justPayments",
      financeId: finance.id,
    },
    {
      value: "Full Breakdown",
      label: "Full Breakdown",
      template: "fullBreakdown",
      financeId: finance.id,
    },
    {
      value: "Full Breakdown W/ Options",
      label: "Full Breakdown W/ Options",
      template: "FullBreakdownWOptions",
      financeId: finance.id,
    },
    {
      value: "Custom Templated Emails",
      label: "Custom Templated Emails",
      template: "Custom-Templated-Emails",
      financeId: finance.id,
      desiredPayments: finance.desiredPayments,
    },
    {
      value: "Send Payments Custom",
      label: "Send Payments Custom",
      template: "justPaymentsCustom",
      financeId: finance.id,
      desiredPayments: finance.desiredPayments,
    },
    {
      value: "Full Breakdown Custom",
      label: "Full Breakdown Custom",
      template: "fullBreakdownCustom",
      financeId: finance.id,
      desiredPayments: finance.desiredPayments,
    },
    {
      value: "Full Breakdown W/ Options Custom",
      label: "Full Breakdown W/ Options Custom",
      template: "FullBreakdownWOptionsCustom",
      financeId: finance.id,
      desiredPayments: finance.desiredPayments,
    },
  ];

  const updatedEmailArray = email.concat(
    emailTemplatesDropdown.map(template => ({
      value: template.id,
      label: template.subject,
      template: 'customEmailDropdown' + template.id,
      financeId: finance.id,
      // Add additional properties if they exist
      ...(template.desiredPayments && { desiredPayments: template.desiredPayments }),
    }))
  );
  function SubmitTheForm(newValue, template, financeId) {
    if (template === "justPayments" || template === "fullBreakdown" || template === "FullBreakdownWOptions") {
      console.log(newValue, template, 'reg emails')
      const formData = new FormData();
      formData.append("value", newValue);
      formData.append("modelData", modelData);
      formData.append("template", template);
      formData.append("financeId", financeId);
      formData.append("intent", 'email');
      submit(formData, { method: "post" });
    } else if (template === "justPaymentsCustom" || template === "fullBreakdownCustom" || template === "FullBreakdownWOptionsCustom") {
      console.log(newValue, template, 'custom emails')

      setOpenEmail(true);
    } else if (template === 'Custom-Templated-Emails') {
      return null
    } else {
      console.log('hit id form')
      const formData = new FormData();
      formData.append("value", newValue);
      formData.append("modelData", modelData);
      formData.append("template", template);
      formData.append("financeId", financeId);
      formData.append("intent", 'email');
      submit(formData, { method: "post" });
    }
  }
  const newBody = formData.body

  const [openTemplate, setOpenTemplate] = useState(false);

  function SubmitTheSecondForm() {
    const formData = new FormData();
    formData.append("value", emailValue);
    // formData.append("modelData", modelData);
    formData.append("template", emailTemplate);
    formData.append("financeId", finance.id);
    formData.append("body", newBody);
    formData.append("intent", 'email');
    submit(formData, { method: "post" });
  }

  // ------------------------ finance turnover ---- //
  const [openResponse, setOpenResponse] = useState(false);
  const [key, setKey] = useState(0);
  const [lockData, setLockData] = useState();
  const [note, setNote] = useState()
  let actionData = useActionData<typeof action>();

  async function SubmitLocked() {
    const formData = new FormData();
    formData.append("locked", true);
    formData.append("salesEmail", user.email);
    formData.append("financeId", finance.id);
    formData.append("unit", `${finance.year} ${finance.brand} ${finance.model}`);
    formData.append("customerName", finance.firstName + ' ' + finance.lastName,);
    formData.append("intent", 'clientTurnover');
    submit(formData, { method: "post" });

    actionData = {
      ...actionData,
      lockedId: actionData.id,
    }
    setLockData(actionData)
  }

  useEffect(() => {
    const intervalFunction = async () => {
      console.log('Interval fired1212');
      const getLocked = await prisma.lockFinanceTerminals.findFirst({ where: { salesEmail: user.email, locked: false, response: false } })
      if (getLocked.response === false) {
        setLockData(getLocked)
        setOpenResponse(true)
      }
    };
    intervalFunction()
    const intervalId = setInterval(intervalFunction, 120000); // 120000 ms = 120 seconds
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const HandleButtonClick = async () => {
    const formData = new FormData();
    formData.append("claimId", lockData.lockedId);
    formData.append("intent", 'responseClientTurnover');
    const update = submit(formData, { method: "post" });
    setOpenResponse(false)
    return json({ update })
  };

  const [checkedItems2, setCheckedItems2] = useState(
    items.reduce((acc, item) => {
      if (item.value === 'on' || new Date(item.value) > new Date('2022-01-01')) {
        acc[item.name] = item.value;
      }
      return acc;
    }, {})
  );

  const handleCheckboxChange2 = (name, isChecked) => {
    setCheckedItems2((prev) => {
      const updatedItems = { ...prev };
      if (isChecked) {
        updatedItems[name] = new Date().toISOString();
      } else {
        delete updatedItems[name];
      }
      return updatedItems;
    });
  };

  const formatDate2 = (dateString) => {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  // ----- sales card model and brand ---- //


  // --------- the sacred timeline -------//
  const options2 = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  const createEvent = (date, type, title, userName) => ({
    date: new Date(date).toLocaleDateString('en-US', options2),
    type,
    title,
    userName,
    details: {}
  });
  const eventFields = {
    metSalesperson: { type: 'Meeting', title: 'Met Salesperson' },
    signBill: { type: 'Document', title: 'Signed Bill' },
    funded: { type: 'Finance', title: 'Funded' },
    customerWS: { type: 'Document', title: 'Customer WS' },
    tradeInsp: { type: 'Inspection', title: 'Trade Inspection' },
    ucda: { type: 'Document', title: 'UCDA' },
    voidChq: { type: 'Document', title: 'Void Cheque' },
    testDrForm: { type: 'Document', title: 'Test Drive Form' },
    insCopy: { type: 'Document', title: 'Insurance Copy' },
    lost: { type: 'Status', title: 'Lost' },
    cancelled: { type: 'Status', title: 'Cancelled' },
    refunded: { type: 'Finance', title: 'Refunded' },
    liceningDone: { type: 'Document', title: 'Licensing Done' },
    licensingSent: { type: 'Document', title: 'Licensing Sent' },
    applicationDone: { type: 'Status', title: 'Application Done' },
    seenTrade: { type: 'Status', title: 'Seen Trade' },
    docsSigned: { type: 'Document', title: 'Documents Signed' },
    depositTakenDate: { type: 'Finance', title: 'Deposit Taken Date' },
    deliveredDate: { type: 'Status', title: 'Delivered Date' },
    financeApplication: { type: 'Document', title: 'Finance Application' },
    metFinance: { type: 'Meeting', title: 'Met Finance' },
    deliveryDate: { type: 'Status', title: 'Delivery Date' },
    delivered: { type: 'Status', title: 'Delivered' },
    demoed: { type: 'Status', title: 'Demoed' },
    pickUpSet: { type: 'Status', title: 'Pick Up Set' },
    signed: { type: 'Status', title: 'Signed' },
    approved: { type: 'Status', title: 'Approved' },
    financeApp: { type: 'Document', title: 'Finance Application' },
    turnOver: { type: 'Finance', title: 'Turnover' },
    refund: { type: 'Finance', title: 'Refund' },
    depositMade: { type: 'Finance', title: 'Deposit Made' },
    sold: { type: 'Status', title: 'Sold' },
    metParts: { type: 'Meeting', title: 'Met Parts' },
    metService: { type: 'Meeting', title: 'Met Service' },
    metManager: { type: 'Meeting', title: 'Met Manager' },
    testDrive: { type: 'Test', title: 'Test Drive' }
  };
  const additionalEvents = Object.entries(eventFields)
    .filter(([key, { type }]) => finance[key] !== null && finance[key] !== undefined)
    .map(([key, { type, title }]) => createEvent(finance[key], type, title, finance.userName));
  const financeArray = [finance]
  const events = [
    ...aptFinance3.map(app => ({
      id: app.id,
      date: new Date(app.start).toLocaleDateString('en-US', options2),
      type: 'Appointment',
      title: app.title,
      userName: app.userName,
      details: { ...app }
    })),
    // Communications
    ...conversations.map(comm => ({
      id: comm.id,
      date: new Date(comm.createdAt).toLocaleDateString('en-US', options2),
      type: 'Communication',
      subType: comm.type,
      userName: comm.userName,
      title: comm.type,
      direction: comm.direction,
      details: { ...comm }
    })),
    // Finance Events
    ...financeArray.map(fin => ({
      id: fin.id,
      date: new Date(fin.createdAt).toLocaleDateString('en-US', options2),
      type: 'Quote',
      title: fin.name || 'Quote Created',
      details: { ...fin }
    })),
    // finance notes
    ...financeNotes.map(app => ({
      id: app.id,
      date: new Date(app.createdAt).toLocaleDateString('en-US', options2),
      type: 'Note',
      title: 'Note left on clients finance file.',
      userName: app.userName,
      details: { ...app }
    })),
    ...additionalEvents
  ]

  const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));

  /*
  async function getData() {
    const res = await fetch('/dealer/dashboard/inventory/moto')
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  }
  useEffect(() => {
    const data = async () => {
      const result = await getData();
      console.log(result, 'result')
      setTableData(result);
    };
    data()
  }, []);

  const dataFetcher = (url) => fetch(url).then((res) => res.json());
  const { data: swrTable } = useSWR("http://localhost:3000/dealer/dashboard/inventory/moto", dataFetcher);
  const result = swrTable
   console.log(result, 'result')
  const [tableData, setTableData] = useState(result);
*/
  console.log(tableData, 'table data')
  let sync = useFetcher();

  useEffect(() => {
    if (user.customerSync.orderId) {
      toast('Client sync', {
        action: {
          label: 'Unsync',
          onClick: () => {
            const formData = new FormData();
            formData.append("email", user.email);
            formData.append("intent", 'unsync');
            const sendIt = sync.submit(formData, { method: "post", action: '/dealer/customer' });
            console.log(sendIt, 'formData');
            return sendIt
          }
        },
      })
    }
  }, [user]);


  const toReceipt =
  {
    "qrCode": finance.id,
    "brand": finance.brand,
    "model": finance.model,
    "color": finance.color,
    "msrp": `$${formData.msrp}`,
    "freight": `$${formData.freight}`,
    "pdi": `$${formData.pdi}`,
    "admin": `$${formData.admin}`,
    "msrpcopy4": `$${formData.accessories}`,
    "msrpcopy5": `${formData.labour}/hrs`,
    "msrpcopy6": `$${formData.licensing}`,
    "weekly": `$${weekly}/wk`,
    "biweekly": `$${biweekly}/bi`,
    "monthly": `$${on60}/m`,
    "term": months,
    "iRate": `${iRate}%`,
    "deposit": `$${deposit}`,
    "tradeValue": `$${tradeValue}`,
    "lien": `$${lien}`,
    "total": `$${total}`,
    "onTax": `$${onTax}`,
    "firstName": formData.firstName,
    "lastName": formData.lastName,
    "phone": finance.phone,
    "email": finance.email,
    "address": finance.address,
    "whichTemplate": 'Sales',
    "image": dealerImage.dealerLogo

  }




  const [openEmail, setOpenEmail] = useState(false);
  const [emailLabel, setEmailLabel] = useState('');
  const [emailDesiredPayments, setEmailDesiredPayments] = useState('');
  const [emailFinanceId, setEmailFinanceId] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [accOrder, setAccOrder] = useState([]);
  const [showOrder, setShowOrder] = useState();

  const [paymentType, setPaymentType] = useState('');
  const payment = useFetcher()
  let order
  useEffect(() => {

    if (clientFile.AccOrder) {
      order = clientFile.AccOrder[0]
    }

  }, []);

  const toggleOrderDetails = (orderId) => {
    if (showOrder.id === orderId.id) {
      setShowOrder(null);
    } else {
      setShowOrder(orderId);
    }
  };

  let totalAccessoriesCost
  if (showOrder) {
    totalAccessoriesCost = Number(showOrder.AccessoriesOnOrders.reduce((total, accessoryOnOrder) => { return total + (accessoryOnOrder.quantity * accessoryOnOrder.accessory.price); }, 0));
  }

  let totalAmountPaid = 0
  if (showOrder) {
    totalAmountPaid = showOrder.Payments.reduce((total, payment) => { return total + payment.amountPaid; }, 0);
  }
  let totalAmountPaidFinance = finance.Payments.reduce((total, payment) => { return total + payment.amountPaid; }, 0);

  totalAmountPaidFinance = Number(totalAmountPaidFinance)
  const taxMultiplier = Number(deFees.userTax);
  const taxRate = 1 + taxMultiplier / 100;
  const [discDollar, setDiscDollar] = useState(0.00)
  const [discPer, setDiscPer] = useState(0.00)
  const [deposits, setDeposits] = useState("")
  const depositsLength = deposits.trim().length
  const financeId = finance.id
  const attachedToFinance = clientFile.AccOrder.filter(order => order.financeId === financeId);
  const notAttachedToFinance = clientFile.AccOrder.filter(order => order.financeId !== financeId);
  // console.log(notAttachedToFinance, 'notAttachedToFinance')
  const total2 = ((totalAccessoriesCost - parseFloat(discDollar)) * taxRate).toFixed(2)
  const total1 = (((totalAccessoriesCost * (100 - parseFloat(discPer))) / 100) * taxRate).toFixed(2)
  const pacTotal = discPer === 0 ? total2 : total1

  const maxAccessories = 19;

  let toReceiptAcc = {
    qrCode: clientFile.AccOrder.id,
    subTotal: `$${totalAccessoriesCost}`,
    tax: `${deFees.userTax}%`,
    total: `$${total}`,
    remaining: `$${parseFloat(total) - parseFloat(totalAmountPaid)}`,
    firstName: clientFile.firstName,
    lastName: clientFile.lastName,
    phone: clientFile.phone,
    email: clientFile.email,
    address: clientFile.address,
    date: new Date().toLocaleDateString("en-US", options2),
    cardNum: '',
    paymentType: '',
    image: dealerImage.dealerLogo
  };
  if (showOrder) {
    showOrder.AccessoriesOnOrders.forEach((result, index) => {
      if (index < maxAccessories) {
        toReceiptAcc[`desc${index + 1}`] = `${result.accessory.brand} ${result.accessory.name}`;
        toReceiptAcc[`qt${index + 1}`] = String(result.quantity);
        toReceiptAcc[`price${index + 1}`] = String(result.accessory.price);
      }
    });

    for (let i = showOrder.AccessoriesOnOrders.length + 1; i <= maxAccessories; i++) {
      toReceiptAcc[`desc${i}`] = '';
      toReceiptAcc[`qt${i}`] = '';
      toReceiptAcc[`price${i}`] = '';
    }
  }
  // service

  //  console.log(orders, tax, services, ' inside workordersales')

  let workOrder = useFetcher();
  let ref = useRef();
  let search = useFetcher();
  let product = useFetcher();


  let unitCard = [
    { name: 'year', label: 'Year', },
    { name: 'brand', label: 'Brand', },
    { name: 'model', label: 'Model', },
    { name: 'color', label: 'Color', },
    { name: 'vin', label: 'VIN', },
    { name: 'trim', label: 'Trim', },
    { name: 'mileage', label: 'Mileage', },
    { name: 'location', label: 'Location', },
    { name: 'motor', label: 'Motor', },
    { name: 'tag', label: 'Tag', },
  ];

  const [firstPageService, setFirstPageService] = useState(true);
  const [secPageService, setSecPageService] = useState(false);
  const [serviceOrder, setServiceOrder] = useState();
  // console.log(serviceOrder, 'serviceOrder')
  function handleNextPage() {
    if (firstPageService === true) {
      setFirstPageService(false)
      setSecPageService(true)
    }
    if (secPageService === true) {
      setFirstPageService(true)
      setSecPageService(false)
    }
  }
  function handlePrevPage() {
    if (firstPageService === true) {
      setFirstPageService(false)
      setSecPageService(true)
    }
    if (secPageService === true) {
      setFirstPageService(true)
      setSecPageService(false)
    }
  }
  const [totalService, setTotalService] = useState(0.00);

  const [serviceSubTotal, setServiceSubTotal] = useState(0.00);
  const [partsSubTotal, setPartsSubTotal] = useState(0.00);
  const [totalPreTax, setTotalPreTax] = useState(0.00);
  useEffect(() => {
    if (serviceOrder) {
      const partsSub = serviceOrder?.AccOrders?.reduce((total, accOrder) => {
        return total + accOrder?.AccessoriesOnOrders?.reduce((subTotal, accessoryOnOrder) => {
          return subTotal + (accessoryOnOrder.accessory.price * accessoryOnOrder.quantity);
        }, 0);
      }, 0);
      setPartsSubTotal(partsSub.toFixed(2))

      const serviceSub = serviceOrder?.ServicesOnWorkOrders?.reduce((total, serviceOnOrder) => {
        const hours = serviceOnOrder.hr || serviceOnOrder.service.estHr || 0.00;

        const subtotal = hours * tax.userLabour * serviceOnOrder.quantity;

        return total + subtotal;
      }, 0);

      setServiceSubTotal(serviceSub.toFixed(2))

      const totalPreTax = partsSub + serviceSub;
      setTotalPreTax(totalPreTax.toFixed(2));

      const total2 = ((parseFloat(partsSub + serviceSub) - parseFloat(discDollar)) * taxRate).toFixed(2);
      const total1 = (((parseFloat(partsSub + serviceSub) * (100 - parseFloat(discPer))) / 100) * taxRate).toFixed(2);
      const calculatedTotal = discDollar && discDollar > 0.00 ? total1 : total2;

      setTotalService(calculatedTotal);
      const totalAmountPaid2 = serviceOrder.Payments.reduce((total, payment) => {
        return total + payment.amountPaid;
      }, 0);
      if (totalAmountPaid2) {
        setTotalAmountPaid(totalAmountPaid2)
      }
      console.log(partsSubTotal, serviceSubTotal, partsSubTotal + serviceSubTotal, 'totals')

    }
  }, [serviceOrder]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <aside className="fixed inset-y-0 left-0 z-10  sm:w-[50px] sm:flex-col sm:border-r sm:bg-background sm:flex sm:border-border">
        <SidebarNav mergedFinanceList={mergedFinanceList} finance={finance} />
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-6">
              <Card className="sm:col-span-2 text-foreground rounded-lg  flex flex-col h-full" x-chunk="dashboard-05-chunk-0"  >
                <CardHeader className="flex flex-row items-start bg-muted/50 rounded-md">
                  <div className="grid">
                    <CardTitle className="group flex items-center text-sm">
                      Customer Info
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 text-sm mt-2">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        First Name
                      </span>
                      <span>{finance.firstName}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Last Name
                      </span>
                      <span> {finance.lastName}</span>
                    </li>
                    <li className=" group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-muted-foreground">
                          Phone
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyText(finance.phone)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        {copiedText === finance.phone && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                      </div>
                      <span>{finance.phone}  </span>
                    </li>
                    <li className=" group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-muted-foreground">
                          Email
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyText(finance.email)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        {copiedText === finance.email && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                      </div>
                      <span>{finance.email}  </span>
                    </li>
                    <li className=" group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-muted-foreground">
                          Address
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyText(finance.address)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        {copiedText === finance.address && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                      </div>
                      <span>{finance.address}  </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        City
                      </span>
                      <span>{finance.city}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Postal
                      </span>
                      <span>{finance.postal}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Drivers License
                      </span>
                      <span>{finance.dl}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        DOB
                      </span>
                      <span>{finance.dob}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Preferred Time
                      </span>
                      <span>{finance.timeToContact}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Preferred Contact
                      </span>
                      <span>{finance.typeOfContact}</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="grid grid-cols-2 justify-between items-center border-t border-border bg-muted/50 px-6 py-3">
                  <div>
                    <Badge >{finance.customerState}</Badge>
                  </div>
                  <Dialog  >
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="h-8 gap-1 ml-auto">
                        <CiEdit className="h-3.5 w-3.5" />
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                          Edit Customer Info
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="gap-0 p-0 outline-none border-border text-foreground">
                      <Form method='post' className='mx-4 my-4'>
                        <DialogHeader className="px-4 pb-4 pt-5">
                          <DialogTitle>Edit Customer Profile Info</DialogTitle>
                          <hr className=" text-muted-foreground w-[98%] mx-auto" />
                        </DialogHeader>
                        {customerCard.map((user, index) => (
                          <div key={index} className="relative mt-4">

                            <Input
                              name={user.name}
                              defaultValue={user.value}
                              className={` bg-background text-foreground border border-border`}
                            />
                            <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">{user.label}</label>
                          </div>
                        ))}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[100%] pl-3 text-left font-normal mt-4 ",
                                !date && "text-muted-foreground"
                              )}
                            >
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span>DOB</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              className='w-auto'
                              mode="single"
                              fromYear={1900}
                              selected={date}
                              onSelect={setDate}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <input type='hidden' value={String(date)} name='dob' />
                        <div className="relative mt-4">
                          <Select name='timeToContact' defaultValue={data.timeToContact}  >
                            <SelectTrigger className="w-full  bg-background text-foreground border border-border" >
                              <SelectValue defaultValue={data.timeToContact} />
                            </SelectTrigger>
                            <SelectContent className=' bg-background text-foreground border border-border' >
                              <SelectGroup>
                                <SelectLabel>Best Time To Contact</SelectLabel>
                                <SelectItem value="Morning">Morning</SelectItem>
                                <SelectItem value="Afternoon">Afternoon</SelectItem>
                                <SelectItem value="Evening">Evening</SelectItem>
                                <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Preferred Time To Be Contacted</label>
                        </div>
                        <div className="relative mt-4">
                          <Select name='typeOfContact' defaultValue={data.typeOfContact} >
                            <SelectTrigger className="w-full  bg-background text-foreground border border-border" >
                              <SelectValue defaultValue={data.typeOfContact} />
                            </SelectTrigger>
                            <SelectContent className=' bg-background text-foreground border border-border' >
                              <SelectGroup>
                                <SelectLabel>Contact Method</SelectLabel>
                                <SelectItem value="Phone">Phone</SelectItem>
                                <SelectItem value="InPerson">In-Person</SelectItem>
                                <SelectItem value="SMS">SMS</SelectItem>
                                <SelectItem value="Email">Email</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Preferred Type To Be Contacted</label>
                        </div>
                        <input type='hidden' name="financeId" defaultValue={finance.id} />
                        <input type='hidden' name="clientfileId" defaultValue={clientFile.id} />

                        <ButtonLoading
                          size="sm"
                          value="updateClientInfoFinance"
                          className="w-auto cursor-pointer mt-5 ml-auto mr-3 bg-primary justify-end"
                          name="intent"
                          type="submit"
                          isSubmitting={isSubmitting}
                          onClick={() => toast.success(`${finance.firstName}'s customer file is updated...`)}
                          loadingText={`${data.firstName}'s customer file is updated...`}
                        >
                          Continue
                          <PaperPlaneIcon className="h-4 w-4 ml-2" />

                        </ButtonLoading>

                      </Form>

                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2" className="text-foreground sm:col-span-2 rounded-lg flex flex-col h-full">
                <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                  <div className="grid">
                    <CardTitle className="group flex items-center text-sm">
                      Current Vehicle
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip mt-3">
                  <div className="max-h-[20vh] h-auto">
                    <ul className="grid gap-3 mt-3">

                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Year
                        </span>
                        <span>{finance.year}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Brand
                        </span>
                        <span>{finance.brand}</span>
                      </li>
                      <li className=" group flex items-center justify-between">
                        <div className='flex'>
                          <span className="text-muted-foreground">
                            Model
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyText(finance.model)}
                            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                          >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Copy</span>
                          </Button>
                          {copiedText === finance.model && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                        </div>
                        <span>{finance.model}  </span>
                      </li>

                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Color
                        </span>
                        <span>{finance.color}</span>
                      </li>
                      <li className=" group flex items-center justify-between">
                        <div className='flex'>
                          <span className="text-muted-foreground">
                            VIN
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => copyText(finance.vin)}
                            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                          >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Copy</span>
                          </Button>
                          {copiedText === finance.vin && <FaCheck strokeWidth={1.5} className=" ml-2 text-lg hover:text-primary" />}
                        </div>
                        <span>{finance.vin}  </span>
                      </li>

                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Current Mileage
                        </span>
                        <span>{finance.mileage}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Location
                        </span>
                        <span>{finance.location}</span>
                      </li>
                      {finance.stockNum && (
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Stock Number
                          </span>
                          <span>{finance.stockNum}</span>
                        </li>
                      )}
                      {finance.mileage && (
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Mileage
                          </span>
                          <span>{finance.mileage}</span>
                        </li>
                      )}
                      {finance.modelCode && (
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Model Code
                          </span>
                          <span>{finance.modelCode}</span>
                        </li>
                      )}
                      {finance.tag && (
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Tag
                          </span>
                          <span>{finance.tag}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-self-end flex-row items-center border-t border-border  bg-muted/50  px-6 py-3">
                  {finance.stockNum && assignedUnit && (
                    <>
                      <UnitDialog data={assignedUnit} user={user} />
                    </>
                  )}
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2" className="text-foreground sm:col-span-2 rounded-lg flex flex-col h-full">
                <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                  <div className="grid">
                    <CardTitle className="group flex items-center text-sm">
                      Customer Progress
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip mt-3">
                  <div className="max-h-[20vh] h-auto">
                    {editProgress === true && (
                      <Form method="post">
                        {items && items.map((item) => {
                          const isChecked =
                            checkedItems2[item.name] !== undefined && checkedItems2[item.name] !== '';
                          return (
                            <div key={item.name} className="flex justify-between items-center mt-1 mr-1">
                              <label htmlFor={item.name}>{item.label}</label>
                              <IndeterminateCheckbox
                                name={item.name}
                                indeterminate={checkedItems2[item.name] === undefined && isChecked}
                                checked={isChecked}
                                onChange={(e) => handleCheckboxChange2(item.name, e.target.checked)}
                                className="border-[#c72323]"
                              />
                              <input type="hidden" name={item.name} value={checkedItems2[item.name] ?? ''} />
                            </div>
                          );
                        })}
                        <input type="hidden" defaultValue={finance.id} name="financeId" />

                        <ButtonLoading
                          size="sm"
                          value="updateClientInfoFinance"
                          className="w-auto cursor-pointer ml-auto mt-5 mb-5 bg-primary"
                          name="intent"
                          type="submit"
                          isSubmitting={isSubmitting}
                          onClick={() => toast.success(`${finance.firstName}'s customer file is updated...`)}
                          loadingText={`${data.firstName}'s customer file is updated...`}
                        >
                          Save
                          <FaSave className="h-4 w-4 ml-2" />
                        </ButtonLoading>
                      </Form>
                    )
                    }
                    {editProgress === false && (
                      items && items
                        .filter((item) => {
                          const isChecked =
                            item.value === 'on' ||
                            (isDate(new Date(item.value)) && new Date(item.value) > new Date('2022-01-01'));
                          return checkedItems[item.name] ?? isChecked;
                        })
                        .map((item) => {
                          const isChecked =
                            item.value === 'on' ||
                            (isDate(new Date(item.value)) && new Date(item.value) > new Date('2022-01-01'));
                          return (
                            <div key={item.name} className="flex justify-between items-center mt-1 mr-1">
                              <label className="text-muted-foreground" htmlFor={item.name}>{item.label}</label>
                              <span>{formatDate2(item.value)}</span>

                            </div>
                          );
                        })
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-self-end flex-row items-center border-t border-border  bg-muted/50  px-6 py-3">
                  <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => handleProgressUnits()}>
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Edit Progress
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <Tabs defaultValue="Sales">
              <div className="flex items-center">
                <TabsList >
                  <TabsTrigger value="Sales">Sales</TabsTrigger>
                  <TabsTrigger value="Finance">Finance</TabsTrigger>
                  <TabsTrigger value="Service">Service</TabsTrigger>
                  <TabsTrigger value="Accessories">Accessories/Parts</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="Sales" className="  text-foreground rounded-lg">
                <div className='flex flex-col md:grid md:grid-cols-2' >
                  <Card className="overflow-hidden  flex flex-col h-full  m-2 rounded-lg" x-chunk="dashboard-05-chunk-4"  >
                    <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                      <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                          Wanted Vehicle
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Upload customer docs such as contracts, warranties, etc.</span>
                          </Button>
                        </CardTitle>
                      </div>

                    </CardHeader>
                    <CardContent className="max-h-[500px] h-auto flex-grow !grow  p-6 text-sm  overflow-y-auto">

                      {editUnits === false && (
                        <ul className="grid gap-3">
                          {WantedData.map((item, index) => (
                            <li key={index} className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                {item.placeholder}
                              </span>
                              <span>{item.value}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {editUnits === true && (
                        <fetcher.Form method='post' >
                          <ul className="grid gap-3">

                            {WantedData.map((item, index) => (
                              <li key={index} className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  {item.placeholder}
                                </span>
                                <Input name={item.name} defaultValue={item.value} className='w-[200px] bg-background border-border' />
                              </li>
                            ))}
                          </ul>
                          <Button
                            size="sm"
                            variant="outline"
                            name='intent'
                            value='updateWantedUnit'
                            className="h-8 gap-1 ml-auto bg-primary mt-3 "
                            onClick={() => {
                              toast.success(`Wanted unit saved!`)
                            }}>
                            <FaSave className="h-3.5 w-3.5" />
                            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                              Save Unit
                            </span>
                          </Button>
                        </fetcher.Form>
                      )}
                    </CardContent>
                    <CardFooter className=" items-end justify-end  flex flex-row items-center border-t border-border  bg-muted/50  px-6 py-3">
                      <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => (handleEditUnits())}>
                        <Truck className="h-3.5 w-3.5" />
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                          Edit Unit
                        </span>
                      </Button>
                      <UnitPicker finance={finance} tableData={tableData} user={user} />
                      {/** salesPeople, financeManagers */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 text-sm text-foreground border-border"
                          >
                            <ListFilter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only">Agents</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-foreground bg-background border-border">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Assigned Sales Person</DropdownMenuLabel>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                {finance.userName && finance.userName.length > 3 ? <p>{finance.userName}</p> : <p>Not yet assigned</p>}
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent className='border border-border'>
                                  {salesPeople.map((sales) => (
                                    <DropdownMenuItem onSelect={() => {
                                      const formData = new FormData();
                                      formData.append("financeId", finance.id);
                                      formData.append("userEmail", sales.email);
                                      formData.append("userName", sales.name);
                                      formData.append("intent", 'changeSales');
                                      submit(formData, { method: "post" });
                                    }}
                                      className="cursor-pointer rounded-md hover:bg-muted/50"
                                      key={sales.id}
                                      value={sales.email}
                                    >
                                      <p>{sales.name}</p>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Assigned Finance Manager</DropdownMenuLabel>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                {finance.financeManager && finance.financeManager.length > 3 ? <p>{finance.financeManagerName}</p> : <p>Not yet assigned</p>}
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <Form method="post">
                                  <DropdownMenuSubContent className='border border-border'>
                                    {financeManagers.map((sales) => (
                                      <DropdownMenuItem
                                        onSelect={() => {
                                          const formData = new FormData();
                                          formData.append("financeId", finance.id);
                                          formData.append("financeManager", sales.email);
                                          formData.append("financeManagerName", sales.name);
                                          formData.append("intent", 'changeFinance');
                                          submit(formData, { method: "post" });
                                        }}
                                        className="cursor-pointer rounded-md hover:bg-muted/50"
                                        key={sales.id} // using sales.id instead of index for unique key
                                        value={sales.email}
                                      >
                                        <p>{sales.name}</p>
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuSubContent>
                                </Form>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                  <Card className="overflow-hidden m-2  flex flex-col h-full rounded-lg" x-chunk="dashboard-05-chunk-4" >
                    <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                      <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                          Trade Vehicle
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <Copy className="h-3 w-3" />
                            <span className="sr-only">Upload customer docs such as contracts, warranties, etc.</span>
                          </Button>
                        </CardTitle>
                      </div>

                    </CardHeader>
                    <CardContent className="flex-grow !grow  p-6 text-sm  overflow-y-auto">

                      {editTradeUnits === false && (
                        <ul className="grid gap-3">
                          {TradeData.map((item, index) => (
                            <li key={index} className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                {item.placeholder}
                              </span>
                              <span>{item.value}</span>

                            </li>
                          ))}
                        </ul>
                      )}

                      {editTradeUnits === true && (
                        <fetcher.Form method='post' >
                          <ul className="grid gap-3">
                            {TradeData.map((item, index) => (
                              <li key={index} className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  {item.placeholder}
                                </span>
                                <Input name={item.name} defaultValue={item.value} className='w-[200px] bg-background border-border' />
                              </li>
                            ))}
                          </ul>
                          <Button
                            size="sm"
                            variant="outline"
                            name='intent'
                            value='updateTrade'
                            className="h-8 gap-1 ml-auto bg-primary mt-3 "
                            onClick={() => {
                              toast.success(`Trade unit saved!`)
                            }}>
                            <FaSave className="h-3.5 w-3.5" />
                            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                              Save Unit
                            </span>
                          </Button>
                        </fetcher.Form>
                      )}
                    </CardContent>
                    <CardFooter className=" items-end justify-end  flex flex-row items-center border-t border-border  bg-muted/50  px-6 py-3">
                      <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" onClick={() => (handleEditTradeUnits())}>
                        <Truck className="h-3.5 w-3.5" />
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                          Edit Unit
                        </span>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="Finance">
                <div className="mx-auto mb-10 mt-10">
                  <Card className=" mx-auto w-[550px] rounded-md text-foreground">
                    <CardHeader className="t-rounded-md flex flex-row items-start bg-muted/50 ">
                      <div className="grid gap-0.5">
                        <CardTitle className="group flex items-center gap-2 text-lg">
                          Payment Calculator
                        </CardTitle>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        <Select
                          onValueChange={(value) => {
                            setOpen(false);
                            console.log("click");
                            const selectedFramework = updatedEmailArray.find((framework) => framework.value === value);

                            const newValue = value
                            const financeId = finance.id
                            const template = selectedFramework.template
                            setEmailValue(value);
                            setEmailDesiredPayments(finance.desiredPayments);
                            setEmailTemplate(selectedFramework.template);
                            setEmailFinanceId(finance.financeId);
                            setEmailLabel(selectedFramework.label);

                            if (selectedFramework.template === "justPayments" || selectedFramework.template === "fullBreakdown" || selectedFramework.template === "justPaymentsCustom") {
                              console.log(selectedFramework, 'selectedFramework')
                              SubmitTheForm(newValue, template, financeId);
                            } else
                              if (selectedFramework.template === "justPaymentsCustom" || selectedFramework.template === "fullBreakdownCustom" || selectedFramework.template === "FullBreakdownWOptionsCustom") {
                                console.log(selectedFramework, 'customEmail')
                                setOpenEmail(true);
                              } else {
                                SubmitTheForm(newValue, template, financeId);
                              }
                          }}
                        >
                          <SelectTrigger className="w-[180px] bg-background">
                            <SelectValue className='bg-background' placeholder="Select email..." />
                          </SelectTrigger>
                          <SelectContent className='bg-background text-foreground border-border'>
                            <SelectGroup>
                              <SelectLabel>Emails</SelectLabel>
                              {updatedEmailArray.map((framework) => (
                                <SelectItem className="cursor-pointer   rounded-md  hover:bg-muted/50" key={framework.value} value={framework.value}>
                                  {framework.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>

                          </SelectContent>
                        </Select>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="outline" className="h-8 w-8">
                              <MoreVertical className="h-3.5 w-3.5" />
                              <span className="sr-only">More</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="   w-[200px] rounded-md bg-background text-foreground border-border"                >
                            <DropdownMenuItem onClick={() => setOpenTemplate(true)} className=" w-[100%] cursor-pointer rounded-md  text-foreground hover:bg-muted/50">
                              Inspect Templated Emails
                            </DropdownMenuItem>
                            <a
                              className="mx-auto w-[100%]"
                              href="/dealer/leads/sales/dashboard"
                              target="_blank"
                            >
                              <DropdownMenuItem className=" w-[100%] cursor-pointer rounded-md border-border bg-muted-background text-foreground hover:bg-muted/50">
                                Dashboard
                              </DropdownMenuItem>
                            </a>
                            <a
                              className="mx-auto w-[100%]"
                              href={`/dealer/customer/${finance.clientfileId}/${finance.id}`}
                              target="_blank"
                            >
                              <DropdownMenuItem className=" w-[100%] cursor-pointer rounded-md border-border bg-muted-background text-foreground hover:bg-muted/50">
                                Client File
                              </DropdownMenuItem>
                            </a>
                            <DropdownMenuItem className=" w-[100%] cursor-pointer rounded-md border-border bg-muted-background text-foreground hover:bg-muted/50" onClick={() => PrintReceipt(toReceipt)}>
                              Print Receipt
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Form method="post">
                              <DropdownMenuItem
                                className=" w-[100%] cursor-pointer rounded-md border-border bg-muted-background text-foreground hover:bg-muted/50"
                                onClick={() => {
                                  toast.success(
                                    `Informing finance managers of requested turnover...`
                                  );
                                  SubmitLocked()
                                }}
                              >
                                Finance Turnover
                              </DropdownMenuItem>
                            </Form>
                            <DropdownMenuItem className=" cursor-pointer border-border bg-muted-background text-foreground hover:bg-muted/50">
                              <ClientOnly fallback={<SimplerStaticVersion />} >
                                {() => (
                                  <PrintSpec />
                                )}
                              </ClientOnly>
                            </DropdownMenuItem>
                            <DropdownMenuItem className=" cursor-pointer border-border bg-muted-background text-foreground hover:bg-muted/50">
                              <ModelPage />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <Form method="post">
                      {secPage && (
                        <>
                          <CardContent className="bg-background p-6 text-sm max-h-[700px] overflow-y-auto h-[700px]">
                            <div className="grid gap-3">
                              <div className="font-semibold">Payment Details</div>
                              <li className="flex items-center justify-between">
                                <span className="text-[#8a8a93]">Brand</span>
                                <span>{finance.brand}</span>
                              </li>
                              <li className="flex items-center justify-between">
                                <span className="text-[#8a8a93]">Model</span>
                                <span> {finance.model}</span>
                              </li>
                              {finance.brand !== "BMW-Motorrad" && (
                                <>
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Color</span>
                                    <span>{finance.color}</span>
                                  </li>
                                </>
                              )}
                              {finance.modelCode !== null && (
                                <li className="flex items-center justify-between">
                                  <span className="text-[#8a8a93]">Model Code</span>
                                  <span>{finance.modelCode}</span>
                                </li>
                              )}
                              {finance.modelCode !== null && (
                                <li className="flex items-center justify-between">
                                  <span className="text-[#8a8a93]">Year</span>
                                  <span>{finance.year}</span>
                                </li>
                              )}
                              {finance.stockNum !== null && (
                                <li className="flex items-center justify-between">
                                  <span className="text-[#8a8a93]">Stock Number</span>
                                  <span>{finance.stockNum}</span>
                                </li>
                              )}

                              <ul className="grid gap-3">
                                <li className="flex items-center justify-between">
                                  <span className="text-[#8a8a93]">MSRP</span>
                                  <span>
                                    <Input
                                      name="msrp"
                                      id="msrp"
                                      className="h-8 w-20 border-border bg-background text-right "
                                      autoComplete="msrp"
                                      defaultValue={formData.msrp}
                                      onChange={handleChange}
                                    />
                                  </span>
                                </li>
                                {formData.freight > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Freight</span>
                                    <span>
                                      <Input
                                        className="mt-2 h-8 w-20 items-end justify-end  border-border bg-background text-right "
                                        defaultValue={formData.freight}
                                        placeholder="freight"
                                        type="text"
                                        name="freight"
                                        onChange={handleChange}
                                      />
                                    </span>
                                  </li>
                                )}

                                {formData.pdi > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">PDI</span>
                                    <span>
                                      <Input
                                        className="mt-2 h-8 w-20 items-end justify-end  border-border bg-background text-right "
                                        defaultValue={formData.pdi}
                                        placeholder="pdi"
                                        type="text"
                                        name="pdi"
                                        onChange={handleChange}
                                      />
                                    </span>
                                  </li>
                                )}
                                {formData.admin > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Admin</span>
                                    <span>
                                      <Input
                                        className="mt-2 h-8 w-20 items-end justify-end  border-border  bg-background text-right "
                                        defaultValue={formData.admin}
                                        placeholder="admin"
                                        type="text"
                                        name="admin"
                                        onChange={handleChange}
                                      />
                                    </span>
                                  </li>
                                )}
                                {formData.commodity > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Commodity</span>
                                    <span>
                                      <Input
                                        className="mt-2 h-8 w-20 items-end justify-end  border-border bg-background text-right "
                                        defaultValue={formData.commodity}
                                        placeholder="commodity"
                                        type="text"
                                        name="commodity"
                                        onChange={handleChange}
                                      />
                                    </span>
                                  </li>
                                )}

                                <li className="flex items-center justify-between">
                                  <span className="text-[#8a8a93]">Accessories</span>
                                  <span>
                                    <Input
                                      name="accessories"
                                      id="msrp"
                                      className="h-8 w-20 border-border bg-background text-right "
                                      autoComplete="msrp"
                                      defaultValue={formData.accessories}
                                      onChange={handleChange}
                                    />
                                  </span>
                                </li>
                                <li className="flex items-center justify-between">
                                  <span className="text-[#8a8a93]">Labour Hours</span>
                                  <span>
                                    <Input
                                      name="labour"
                                      id="msrp"
                                      className="h-8 w-20 border-border bg-background text-right "
                                      autoComplete="msrp"
                                      defaultValue={formData.labour}
                                      onChange={handleChange}
                                    />
                                  </span>
                                </li>
                                <li className="flex items-center justify-between font-semibold">
                                  <span className="text-[#8a8a93]">Licensing</span>
                                  <span>
                                    <Input
                                      className="ml-auto mt-2 h-8 w-20  justify-end border-border bg-background text-right "
                                      defaultValue={licensing}
                                      placeholder="licensing"
                                      type="text"
                                      name="licensing"
                                      onChange={handleChange}
                                    />
                                  </span>
                                </li>

                                {modelData.trailer > 0 && (
                                  <li className="flex items-center justify-between font-semibold">
                                    <span className="text-[#8a8a93]">Trailer</span>
                                    <span>${modelData.trailer}</span>
                                  </li>
                                )}
                                {modelData.painPrem > 0 && (
                                  <li className="flex items-center justify-between font-semibold">
                                    <span className="text-[#8a8a93]">Paint Premium</span>
                                    <span> ${modelData.painPrem}</span>
                                  </li>
                                )}
                              </ul>
                            </div>
                            <Separator className="mx-auto my-4 w-[95%] text-muted-foreground" />
                            <div className="font-semibold">Standard Terms</div>
                            <div className="my-4">
                              <div className="main-button-group flex justify-between ">
                                <Badge
                                  id="myButton"
                                  className={`button  transform cursor-pointer bg-primary  shadow hover:text-foreground  ${mainButton === "payments"
                                    ? "active bg-[#c72323] text-foreground"
                                    : "bg-[#0a0a0a] text-foreground"
                                    }`}
                                  onClick={() => handleMainButtonClick("payments")}
                                >
                                  Payments
                                </Badge>

                                <Badge
                                  id="myButton1"
                                  className={`button  transform cursor-pointer bg-primary shadow   hover:text-foreground ${mainButton === "noTax"
                                    ? "active bg-[#c72323] text-foreground "
                                    : "bg-[#0a0a0a] text-foreground"
                                    }`}
                                  onClick={() => handleMainButtonClick("noTax")}
                                >
                                  No Tax
                                </Badge>

                                <Badge
                                  id="myButton2"
                                  className={`button  transform cursor-pointer bg-primary   shadow hover:text-foreground ${mainButton === "customTax"
                                    ? "active bg-[#c72323] text-foreground"
                                    : "bg-[#0a0a0a] text-foreground"
                                    }`}
                                  onClick={() => handleMainButtonClick("customTax")}
                                >
                                  Custom Tax
                                </Badge>
                              </div>
                              <div className="sub-button-group mt-2 flex justify-between">
                                <Badge
                                  id="myButton3"
                                  className={`button  transform cursor-pointer bg-primary shadow hover:text-foreground ${subButton === "withoutOptions"
                                    ? "active bg-[#c72323] text-foreground"
                                    : "bg-[#0a0a0a] text-foreground"
                                    }`}
                                  onClick={() => handleSubButtonClick("withoutOptions")}
                                >
                                  W/O Options
                                </Badge>

                                <Badge
                                  id="myButton5"
                                  className={`button  transform cursor-pointer bg-primary  shadow hover:text-foreground  ${subButton === "withOptions"
                                    ? "active bg-[#c72323] text-foreground"
                                    : "bg-[#0a0a0a] text-foreground"
                                    }`}
                                  onClick={() => handleSubButtonClick("withOptions")}
                                >
                                  W/ Options
                                </Badge>
                              </div>
                            </div>
                            {mainButton === "payments" && (
                              <div className="">
                                {subButton === "withoutOptions" && (
                                  <ul className="grid gap-3">
                                    <li className="flex items-center justify-between">
                                      <span className="text-[#8a8a93]">Monthly</span>
                                      <span> ${on60}</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                      <span className="text-[#8a8a93]">Bi-weekly</span>
                                      <span> ${biweekly}</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                      <span className="text-[#8a8a93]">Weekly</span>
                                      <span> ${weekly}</span>
                                    </li>
                                  </ul>
                                )}
                                {subButton === "withOptions" && (
                                  <>
                                    <div className="font-semibold">Options Include</div>
                                    <DealerOptionsAmounts />
                                    <ul className="grid gap-3">
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Monthly</span>
                                        <span> ${qc60}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Bi-weekly</span>
                                        <span> ${biweeklyqc}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Weekly</span>
                                        <span> ${weeklyqc}</span>
                                      </li>
                                    </ul>
                                  </>
                                )}
                              </div>
                            )}

                            {mainButton === "noTax" && (
                              <div className="">
                                {subButton === "withoutOptions" && (
                                  <div>
                                    <ul className="grid gap-3">
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Monthly</span>
                                        <span> ${nat60}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Bi-weekly</span>
                                        <span> ${biweeklNat}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Weekly</span>
                                        <span> ${weeklylNat}</span>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                {subButton === "withOptions" && (
                                  <div>
                                    <div className="font-semibold">Options Include</div>
                                    <DealerOptionsAmounts />
                                    <ul className="grid gap-3">
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Monthly</span>
                                        <span> ${nat60WOptions}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Bi-weekly</span>
                                        <span> ${biweeklNatWOptions}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Weekly</span>
                                        <span> ${biweeklNatWOptions}</span>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            {mainButton === "customTax" && (
                              <div className="">
                                <ul className="grid gap-3">
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Other tax %</span>
                                    <span>
                                      <Input
                                        name="othTax"
                                        id="othTax"
                                        className="h-8 w-20 border-border bg-background text-right "
                                        autoComplete="othTax"
                                        defaultValue={formData.othTax}
                                        onChange={handleChange}
                                      />
                                    </span>
                                  </li>
                                </ul>
                                {subButton === "withoutOptions" && (
                                  <div className="mt-5 flex justify-between">
                                    <ul className="grid gap-3">
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Monthly</span>
                                        <span> ${oth60}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Bi-weekly</span>
                                        <span> ${biweekOth}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Weekly</span>
                                        <span> ${weeklyOth}</span>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                {subButton === "withOptions" && (
                                  <div>
                                    <div className="font-semibold">Options Include</div>
                                    <DealerOptionsAmounts />
                                    <ul className="grid gap-3">
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Monthly</span>
                                        <span> ${oth60WOptions}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Bi-weekly</span>
                                        <span> ${biweekOthWOptions}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Weekly</span>
                                        <span> ${weeklyOthWOptions}</span>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            <Separator className="mx-auto my-4 w-[95%] text-muted-foreground" />
                            <div className="font-semibold">Contract Variables</div>
                            <ul className="grid gap-3">
                              <li className="flex items-center justify-between">
                                <span className="text-[#8a8a93]">Term</span>
                                <span>
                                  <Input
                                    className="h-8 w-20 border-border bg-background text-right "
                                    name="months"
                                    id="months"
                                    autoComplete="months"
                                    defaultValue={months}
                                    onChange={handleChange}
                                    type="number"
                                  />
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <span className="text-[#8a8a93]">Rate</span>
                                <span>
                                  <Input
                                    className="h-8 w-20 items-end justify-end border-border bg-background text-right  "
                                    name="iRate"
                                    id="iRate"
                                    autoComplete="iRate"
                                    defaultValue={iRate}
                                    onChange={handleChange}
                                  />
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <span className="text-[#8a8a93]">Deposit</span>
                                <span>
                                  <Input
                                    className="h-8 w-20 border-border bg-background text-right "
                                    name="deposit"
                                    id="deposit"
                                    autoComplete="deposit"
                                    defaultValue={deposit}
                                    onChange={handleChange}
                                    type="number"
                                  />
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <span className="text-[#8a8a93]">Trade Value</span>
                                <span>
                                  <Input
                                    className="ml-auto h-8 w-20 border-border bg-background text-right "
                                    name="tradeValue"
                                    id="tradeValue"
                                    autoComplete="tradeValue"
                                    defaultValue={tradeValue}
                                    onChange={handleChange}
                                  />
                                </span>
                              </li>
                              <li className="flex items-center justify-between">
                                <span className="text-[#8a8a93]">Lien</span>
                                <span>
                                  <Input
                                    className="h-8 w-20 border-border bg-background text-right "
                                    name="lien"
                                    id="lien"
                                    autoComplete="lien"
                                    defaultValue={lien}
                                    onChange={handleChange}
                                    type="number"
                                  />
                                </span>
                              </li>
                            </ul>

                            <Separator className="mx-auto my-4 w-[95%] text-muted-foreground" />
                            <div className="font-semibold">
                              Customer Detail Confirmation
                            </div>
                            <div className="mx-3 mb-3 grid grid-cols-2 justify-between gap-3">
                              <div className="relative mt-5">
                                <Input
                                  defaultValue={formData.firstName}
                                  name="firstName"
                                  type="text"
                                  className="w-full border-border bg-background "
                                />
                                <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                  First Name
                                </label>
                              </div>
                              <div className="relative mt-5">
                                <Input
                                  defaultValue={formData.lastName}
                                  name="lastName"
                                  type="text"
                                  className="w-full border-border bg-background "
                                />
                                <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                  Last Name
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  defaultValue={finance.phone}
                                  name="phone"
                                  type="text"
                                  className="w-full border-border bg-background "
                                />
                                <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                  Phone
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  defaultValue={finance.email}
                                  name="email"
                                  type="text"
                                  className="w-full border-border bg-background "
                                />
                                <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                  Email
                                </label>
                              </div>
                            </div>


                            <Separator className="mx-auto my-4 w-[95%] text-muted-foreground" />
                            <div className="font-semibold">Trade Information</div>
                            <div className="mx-3 mb-3 grid grid-cols-2 justify-between gap-3">
                              <div className="relative mt-5">
                                <Input
                                  defaultValue={finance.tradeYear}
                                  name="tradeYear"
                                  type="text"
                                  className="w-full border-border bg-background "
                                />
                                <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                  Year
                                </label>
                              </div>
                              <div className="relative mt-5">
                                <Input
                                  defaultValue={finance.tradeMake}
                                  name="tradeMake"
                                  type="text"
                                  className="w-full border-border bg-background "
                                />
                                <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                  Make
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  defaultValue={finance.tradeDesc}
                                  name="tradeDesc"
                                  type="text"
                                  className="w-full border-border bg-background "
                                />
                                <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                  Model
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  defaultValue={finance.tradeColor}
                                  name="tradeColor"
                                  type="text"
                                  className="w-full border-border bg-background "
                                />
                                <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                  Color
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  defaultValue={finance.tradeVin}
                                  name="tradeVin"
                                  type="text"
                                  className="w-full border-border bg-background "
                                />
                                <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                  VIN
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  defaultValue={finance.tradeMileage || ''}
                                  name="tradeMileage"
                                  type="text"
                                  className="w-full border-border bg-background "
                                />
                                <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                  Mileage
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  defaultValue={finance.tradeLocation}
                                  name="tradeLocation"
                                  type="text"
                                  className="w-full border-border bg-background "
                                />
                                <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                  Trade Location
                                </label>
                              </div>
                            </div>
                            <Drawer direction="left">
                              <DrawerTrigger asChild>
                                <Button size="sm" className="ml-auto" variant="outline">
                                  Other Inputs
                                </Button>
                              </DrawerTrigger>
                              <DrawerContent className="bg-background text-foreground border-border">
                                <div className="mx-auto h-full w-full max-w-sm lg:w-[700px]">
                                  <DrawerHeader>
                                    <DrawerTitle>Other Inputs</DrawerTitle>
                                    <DrawerDescription>
                                      Changes to discounts and such
                                    </DrawerDescription>
                                  </DrawerHeader>
                                  <ul className="grid gap-3">
                                    <li className="flex items-center justify-between">
                                      <span className="text-[#8a8a93]">Discount $</span>
                                      <span>
                                        <Input
                                          name="discount"
                                          className="h-8 w-20 border-border bg-background text-right "
                                          defaultValue={discount}
                                          onChange={handleChange}
                                        />
                                      </span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                      <span className="text-[#8a8a93]">
                                        Discount (1.1-15)%
                                      </span>
                                      <span>
                                        <Input
                                          name="discountPer"
                                          className="h-8 w-20 border-border bg-background text-right "
                                          defaultValue={0}
                                          onChange={handleChange}
                                        />
                                      </span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                      <span className="text-[#8a8a93]">
                                        Delivery Charge
                                      </span>
                                      <span>
                                        <Input
                                          name="deliveryCharge"
                                          id="msrp"
                                          className="h-8 w-20 border-border bg-background text-right "
                                          autoComplete="msrp"
                                          defaultValue={deliveryCharge}
                                          onChange={handleChange}
                                        />
                                      </span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                      <span className="text-[#8a8a93]">Total Labour</span>
                                      <span>${totalLabour}</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                      <span className="text-[#8a8a93]">Lien</span>
                                      <span>
                                        <Input
                                          className="h-8 w-20 border-border bg-background text-right "
                                          name="lien"
                                          id="lien"
                                          autoComplete="lien"
                                          defaultValue={lien}
                                          onChange={handleChange}
                                        />
                                      </span>
                                    </li>
                                  </ul>
                                  <Separator className="mx-auto my-4 w-[95%] text-muted-foreground" />
                                  <div className="font-semibold">
                                    Customer Detail Confirmation
                                  </div>
                                  <div className="mb-3 grid grid-cols-2 justify-between gap-3">

                                    <div className="relative mt-3">
                                      <Input
                                        defaultValue={finance.address}
                                        name="address"
                                        type="text"
                                        className="w-full border-border bg-background "
                                      />
                                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                        Address
                                      </label>
                                    </div>
                                    <div className="relative mt-3">
                                      <Input
                                        defaultValue={finance.city}
                                        name="city"
                                        type="text"
                                        className="w-full border-border bg-background "
                                      />
                                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                        City
                                      </label>
                                    </div>
                                    <div className="relative mt-3">
                                      <Input
                                        defaultValue={finance.province}
                                        name="province"
                                        type="text"
                                        className="w-full border-border bg-background "
                                      />
                                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                        Province
                                      </label>
                                    </div>
                                    <div className="relative mt-3">
                                      <Input
                                        defaultValue={finance.postal}
                                        name="postal"
                                        type="text"
                                        className="w-full border-border bg-background "
                                      />
                                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                        Postal Code
                                      </label>
                                    </div>
                                    <div className="relative mt-3">
                                      <Input
                                        defaultValue={finance.dl}
                                        name="dl"
                                        type="text"
                                        className="w-full border-border bg-background "
                                      />
                                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                        Drivers Lic.
                                      </label>
                                    </div>
                                  </div>
                                  <div className=" mb-3 grid grid-cols-2 justify-between gap-3">
                                    <div className="relative mt-3">
                                      <Select name="timeToContact">
                                        <SelectTrigger className="w-full  border border-border bg-background text-foreground">
                                          <SelectValue defaultValue={finance.timeToContact} />
                                        </SelectTrigger>
                                        <SelectContent className=" border border-border bg-background text-foreground">
                                          <SelectGroup>
                                            <SelectLabel>Best Time To Contact</SelectLabel>
                                            <SelectItem value="Morning">Morning</SelectItem>
                                            <SelectItem value="Afternoon">Afternoon</SelectItem>
                                            <SelectItem value="Evening">Evening</SelectItem>
                                            <SelectItem value="Do Not Contact">
                                              Do Not Contact
                                            </SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                        Prefered Time
                                      </label>
                                    </div>
                                    <div className="relative mt-3">
                                      <Select name="typeOfContact">
                                        <SelectTrigger className="w-full  border border-border bg-background text-foreground">
                                          <SelectValue defaultValue={finance.typeOfContact} />
                                        </SelectTrigger>
                                        <SelectContent className=" border border-border bg-background text-foreground">
                                          <SelectGroup>
                                            <SelectLabel>Contact Method</SelectLabel>
                                            <SelectItem value="Phone">Phone</SelectItem>
                                            <SelectItem value="InPerson">In-Person</SelectItem>
                                            <SelectItem value="SMS">SMS</SelectItem>
                                            <SelectItem value="Email">Email</SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                        Prefered Contact
                                      </label>
                                    </div>

                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <div className="relative mt-3">
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-full justify-start  text-center  font-normal",
                                              !date && "text-muted-foreground"
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4 " />
                                            {date ? (
                                              format(date, "PPP")
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                          </Button>
                                          <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                            Pick A Date
                                          </label>
                                        </div>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto bg-background p-0 text-foreground border-border"
                                        align="start"
                                      >
                                        <Calendar
                                          className="bg-background text-foreground"
                                          mode="single"
                                          selected={date}
                                          onSelect={setDate}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <input
                                      type="hidden"
                                      value={String(date)}
                                      name="pickedDate"
                                    />

                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <div className="relative mt-3">
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-full justify-start text-right font-normal",
                                              !date && "text-muted-foreground"
                                            )}
                                          >
                                            <ClockIcon className="mr-2 h-4 w-4 " />
                                            {currentTime ? time : <span>Pick a Time</span>}
                                          </Button>
                                          <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                                            Pick A Time
                                          </label>
                                        </div>
                                      </PopoverTrigger>
                                      <PopoverContent
                                        className="w-auto bg-background p-0 text-foreground"
                                        align="start"
                                      >
                                        <div className="flex items-center">
                                          <Select
                                            name="pickHour"
                                            value={hour}
                                            onValueChange={setHour}
                                          >
                                            <SelectTrigger className="m-3 w-auto">
                                              <SelectValue placeholder="hour" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-background text-foreground">
                                              <SelectGroup>
                                                <SelectLabel>Hour</SelectLabel>
                                                <SelectItem value="09">09</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="11">11</SelectItem>
                                                <SelectItem value="12">12</SelectItem>
                                                <SelectItem value="13">13</SelectItem>
                                                <SelectItem value="14">14</SelectItem>
                                                <SelectItem value="15">15</SelectItem>
                                                <SelectItem value="16">16</SelectItem>
                                                <SelectItem value="17">17</SelectItem>
                                                <SelectItem value="18">18</SelectItem>
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>

                                          <Select
                                            name="pickMin"
                                            value={min}
                                            onValueChange={setMin}
                                          >
                                            <SelectTrigger className="m-3 w-auto">
                                              <SelectValue placeholder="min" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-background text-foreground">
                                              <SelectGroup>
                                                <SelectLabel>Minute</SelectLabel>
                                                <SelectItem value="00">00</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="20">20</SelectItem>
                                                <SelectItem value="30">30</SelectItem>
                                                <SelectItem value="40">40</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                              </SelectGroup>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>

                                  <DrawerFooter>
                                    <DrawerClose asChild>
                                      <Button variant="outline">Close</Button>
                                    </DrawerClose>
                                  </DrawerFooter>
                                </div>
                              </DrawerContent>
                            </Drawer>
                            <Separator className="mx-auto my-4 w-[95%] text-muted-foreground" />
                            <div className="font-semibold">Total</div>
                            <ul className="grid gap-3">
                              {perDiscountGiven > 0 && (
                                <>
                                  <li className="mt-3 flex items-center justify-between">
                                    <span className="text-[#8a8a93]">
                                      Total Before Discount
                                    </span>
                                    <span>${beforeDiscount}</span>
                                  </li>
                                </>
                              )}
                              {perDiscountGiven > 0 && (
                                <>
                                  <li className="mt-3 flex items-center justify-between">
                                    <span className="text-[#8a8a93]">
                                      Discount (MSRP only)
                                    </span>
                                    <span> ${perDiscountGiven}</span>
                                  </li>
                                </>
                              )}
                              {mainButton === "payments" && (
                                <div>
                                  {subButton === "withoutOptions" && (
                                    <>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Total</span>
                                        <span>${total}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">With taxes</span>
                                        <span> ${onTax}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">
                                          After Deposit
                                        </span>
                                        <span> ${onTax - deposit}</span>
                                      </li>
                                    </>
                                  )}
                                  {subButton === "withOptions" && (
                                    <>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Total</span>
                                        <span>${totalWithOptions}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">With taxes</span>
                                        <span> ${qcTax}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">
                                          After Deposit
                                        </span>
                                        <span> ${qcTax - deposit}</span>
                                      </li>
                                    </>
                                  )}
                                </div>
                              )}
                              {mainButton === "noTax" && (
                                <div>
                                  {subButton === "withoutOptions" && (
                                    <>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Total</span>
                                        <span>${total}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">With taxes</span>
                                        <span> ${native}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">
                                          After Deposit
                                        </span>
                                        <span> ${native - deposit}</span>
                                      </li>
                                    </>
                                  )}
                                  {subButton === "withOptions" && (
                                    <>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Total</span>
                                        <span>${totalWithOptions}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">With taxes</span>
                                        <span> ${totalWithOptions}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">
                                          After Deposit
                                        </span>
                                        <span> ${totalWithOptions - deposit}</span>
                                      </li>
                                    </>
                                  )}
                                </div>
                              )}
                              {mainButton === "customTax" && (
                                <div>
                                  {subButton === "withoutOptions" && (
                                    <>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Total</span>
                                        <span>${total}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">With taxes</span>
                                        <span> ${otherTax}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">
                                          After Deposit
                                        </span>
                                        <span> ${otherTax - deposit}</span>
                                      </li>
                                    </>
                                  )}
                                  {subButton === "withOptions" && (
                                    <>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Total</span>
                                        <span>${totalWithOptions}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">With taxes</span>
                                        <span> ${otherTaxWithOptions}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">
                                          After Deposit
                                        </span>
                                        <span> ${otherTaxWithOptions - deposit}</span>
                                      </li>
                                    </>
                                  )}
                                </div>
                              )}
                            </ul>
                          </CardContent>
                        </>
                      )}
                      {firstPage && (
                        <>
                          <CardContent className="bg-background p-6  text-sm  max-h-[700px] overflow-y-auto h-[700px]">
                            <div className="grid gap-3">
                              <div className="font-semibold">Payment Details</div>
                              <ul className="grid gap-3">
                                <li className="flex items-center justify-between">
                                  <span className="text-[#8a8a93]">Brand</span>
                                  <span>{finance.brand}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                  <span className="text-[#8a8a93]">Model</span>
                                  <span> {finance.model}</span>
                                </li>
                                {finance.brand !== "BMW-Motorrad" && (
                                  <>
                                    <li className="flex items-center justify-between">
                                      <span className="text-[#8a8a93]">Color</span>
                                      <span>{finance.color}</span>
                                    </li>
                                  </>
                                )}
                                {finance.modelCode !== null && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Model Code</span>
                                    <span>{finance.modelCode}</span>
                                  </li>
                                )}
                                {finance.modelCode !== null && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Year</span>
                                    <span>{finance.year}</span>
                                  </li>
                                )}
                                {finance.stockNum !== null && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Stock Number</span>
                                    <span>{finance.stockNum}</span>
                                  </li>
                                )}
                              </ul>
                              <Separator className="mx-auto my-4 w-[95%] text-muted-foreground" />
                              <div className="font-semibold">Price</div>
                              <ul className="grid gap-3">
                                <li className="flex items-center justify-between">
                                  <span className="text-[#8a8a93]">MSRP</span>
                                  <span> ${formData.msrp}</span>
                                </li>
                                {formData.freight > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Freight</span>
                                    <span>${formData.freight}</span>
                                  </li>
                                )}

                                {formData.pdi > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">PDI</span>
                                    <span>${formData.pdi}</span>
                                  </li>
                                )}
                                {formData.admin > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Admin</span>
                                    <span>${formData.admin}</span>
                                  </li>
                                )}
                                {formData.commodity > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Commodity</span>
                                    <span>${formData.commodity}</span>
                                  </li>
                                )}
                                <li className="flex items-center justify-between">
                                  <span className="text-[#8a8a93]">Accessories</span>
                                  <span>${accessories}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                  <span className="text-[#8a8a93]">Labour Hours</span>
                                  <span>${formData.labour}</span>
                                </li>
                                <li className="flex items-center justify-between font-semibold">
                                  <span className="text-[#8a8a93]">Licensing</span>
                                  <span>${licensing}</span>
                                </li>

                                {finance.brand === "Sea-Doo" && modelData.trailer > 0 && (
                                  <li className="flex items-center justify-between font-semibold">
                                    <span className="text-[#8a8a93]">Trailer</span>
                                    <span>${modelData.trailer}</span>
                                  </li>
                                )}
                                {finance.brand === "Triumph" &&
                                  modelData.painPrem > 0 && (
                                    <li className="flex items-center justify-between font-semibold">
                                      <span className="text-[#8a8a93]">
                                        Paint Premium
                                      </span>
                                      <span> ${modelData.painPrem}</span>
                                    </li>
                                  )}
                              </ul>
                              <Separator className="mx-auto my-4 w-[95%] text-muted-foreground" />
                              <div className="font-semibold">Fees</div>
                              <ul className="grid gap-3">
                                {deFees.userAirTax > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Air Tax</span>
                                    <span>${deFees.userAirTax}</span>
                                  </li>
                                )}
                                {deFees.userTireTax > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Tire Tax</span>
                                    <span> ${deFees.userTireTax}</span>
                                  </li>
                                )}
                                {deFees.userGovern > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">
                                      Government Fees
                                    </span>
                                    <span> ${deFees.userGovern}</span>
                                  </li>
                                )}
                                {deFees.userFinance > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">Finance Fees</span>
                                    <span> ${deFees.userFinance}</span>
                                  </li>
                                )}
                                {deFees.destinationCharge > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">
                                      Destination Charge
                                    </span>
                                    <span>${deFees.destinationCharge}</span>
                                  </li>
                                )}
                                {deFees.userGasOnDel > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">
                                      Gas On Delivery
                                    </span>
                                    <span>${deFees.userGasOnDel}</span>
                                  </li>
                                )}
                                {deFees.userMarketAdj > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">
                                      Market Adjustment
                                    </span>
                                    <span> ${deFees.userMarketAdj}</span>
                                  </li>
                                )}
                                {deFees.userDemo > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">
                                      Demonstrate features or walkaround
                                    </span>
                                    <span>${deFees.userDemo}</span>
                                  </li>
                                )}
                                {deFees.userOMVIC > 0 && (
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">
                                      OMVIC / Other GV Fees
                                    </span>
                                    <span> ${deFees.userOMVIC}</span>
                                  </li>
                                )}
                              </ul>
                            </div>
                            <Separator className="mx-auto my-4 w-[95%] text-muted-foreground" />
                            <div className="font-semibold">Standard Terms</div>
                            <div className="mt-3">
                              <div className="main-button-group flex justify-between ">
                                <Badge
                                  id="myButton"
                                  className={`button  transform cursor-pointer bg-primary  shadow hover:text-foreground  ${mainButton === "payments"
                                    ? "active bg-[#c72323] text-foreground"
                                    : "bg-[#0a0a0a] text-foreground"
                                    }`}
                                  onClick={() => handleMainButtonClick("payments")}
                                >
                                  Payments
                                </Badge>

                                <Badge
                                  id="myButton1"
                                  className={`button  transform cursor-pointer bg-primary shadow   hover:text-foreground ${mainButton === "noTax"
                                    ? "active bg-[#c72323] text-foreground "
                                    : "bg-[#0a0a0a] text-foreground"
                                    }`}
                                  onClick={() => handleMainButtonClick("noTax")}
                                >
                                  No Tax
                                </Badge>

                                <Badge
                                  id="myButton2"
                                  className={`button  transform cursor-pointer bg-primary   shadow hover:text-foreground ${mainButton === "customTax"
                                    ? "active bg-[#c72323] text-foreground"
                                    : "bg-[#0a0a0a] text-foreground"
                                    }`}
                                  onClick={() => handleMainButtonClick("customTax")}
                                >
                                  Custom Tax
                                </Badge>
                              </div>
                              <div className="sub-button-group mt-2 flex justify-between">
                                <Badge
                                  id="myButton3"
                                  className={`button  transform cursor-pointer bg-primary shadow hover:text-foreground ${subButton === "withoutOptions"
                                    ? "active bg-[#c72323] text-foreground"
                                    : "bg-[#0a0a0a] text-foreground"
                                    }`}
                                  onClick={() => handleSubButtonClick("withoutOptions")}
                                >
                                  W/O Options
                                </Badge>

                                <Badge
                                  id="myButton5"
                                  className={`button  transform cursor-pointer bg-primary  shadow hover:text-foreground  ${subButton === "withOptions"
                                    ? "active bg-[#c72323] text-foreground"
                                    : "bg-[#0a0a0a] text-foreground"
                                    }`}
                                  onClick={() => handleSubButtonClick("withOptions")}
                                >
                                  W/ Options
                                </Badge>
                              </div>
                            </div>
                            {mainButton === "payments" && (
                              <div className="">
                                {subButton === "withoutOptions" && (
                                  <ul className="mt-3 grid gap-3">
                                    <li className="flex items-center justify-between">
                                      <span className="text-[#8a8a93]">Monthly</span>
                                      <span> ${on60}</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                      <span className="text-[#8a8a93]">Bi-weekly</span>
                                      <span> ${biweekly}</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                      <span className="text-[#8a8a93]">Weekly</span>
                                      <span> ${weekly}</span>
                                    </li>
                                  </ul>
                                )}
                                {subButton === "withOptions" && (
                                  <>
                                    <div className="mt-3 font-semibold">
                                      Options Include
                                    </div>
                                    <DealerOptionsAmounts />
                                    <ul className="grid gap-3">
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Monthly</span>
                                        <span> ${qc60}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Bi-weekly</span>
                                        <span> ${biweeklyqc}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Weekly</span>
                                        <span> ${weeklyqc}</span>
                                      </li>
                                    </ul>
                                  </>
                                )}
                              </div>
                            )}

                            {mainButton === "noTax" && (
                              <div className="">
                                {subButton === "withoutOptions" && (
                                  <div>
                                    <ul className="mt-3 grid gap-3">
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Monthly</span>
                                        <span> ${nat60}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Bi-weekly</span>
                                        <span> ${biweeklNat}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Weekly</span>
                                        <span> ${weeklylNat}</span>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                {subButton === "withOptions" && (
                                  <div>
                                    <div className="mt-3 font-semibold">
                                      Options Include
                                    </div>
                                    <DealerOptionsAmounts />
                                    <ul className="grid gap-3">
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Monthly</span>
                                        <span> ${nat60WOptions}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Bi-weekly</span>
                                        <span> ${biweeklNatWOptions}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Weekly</span>
                                        <span> ${weeklylNatWOptions}</span>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            {mainButton === "customTax" && (
                              <div className="">
                                {subButton === "withoutOptions" && (
                                  <div className=" ">
                                    <ul className="mt-3 grid gap-3">
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Monthly</span>
                                        <span> ${oth60}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Bi-weekly</span>
                                        <span> ${biweekOth}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Weekly</span>
                                        <span> ${weeklyOth}</span>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                                {subButton === "withOptions" && (
                                  <div>
                                    <div className="mt-3 font-semibold">
                                      Options Include
                                    </div>
                                    <DealerOptionsAmounts />
                                    <ul className="grid gap-3">
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Monthly</span>
                                        <span> ${oth60WOptions}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Bi-weekly</span>
                                        <span> ${biweekOthWOptions}</span>
                                      </li>
                                      <li className="flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Weekly</span>
                                        <span> ${weeklyOthWOptions}</span>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}

                            <Separator className="mx-auto my-4 w-[95%] text-muted-foreground" />
                            <div className="font-semibold">Contract Variables</div>
                            <ul className="mt-3 grid gap-3">
                              <li className="flex items-center justify-between">
                                <span className="text-[#8a8a93]">Term</span>
                                <span>{months} / months</span>
                              </li>
                              <li className="flex items-center justify-between">
                                <span className="text-[#8a8a93]">Rate</span>
                                <span>{iRate}%</span>
                              </li>
                              {finance.deposit > 0 && (
                                <li className="flex items-center justify-between">
                                  <span className="text-[#8a8a93]">Deposit</span>
                                  <span>${finance.deposit}</span>
                                </li>
                              )}
                              <li className="flex items-center justify-between">
                                <span className="text-[#8a8a93]">Trade Value</span>
                                <span>${tradeValue}</span>
                              </li>
                              <li className="flex items-center justify-between">
                                <span className="text-[#8a8a93]">Lien</span>
                                <span>${lien}</span>
                              </li>
                            </ul>

                            <Separator className="mx-auto my-4 w-[95%] text-muted-foreground" />
                            <div className="font-semibold">Total</div>
                            <ul className="grid gap-3">
                              {perDiscountGiven > 0 && (
                                <>
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">
                                      Total Before Discount
                                    </span>
                                    <span>${beforeDiscount}</span>
                                  </li>
                                </>
                              )}
                              {perDiscountGiven > 0 && (
                                <>
                                  <li className="flex items-center justify-between">
                                    <span className="text-[#8a8a93]">
                                      Discount (MSRP only)
                                    </span>
                                    <span> ${perDiscountGiven}</span>
                                  </li>
                                </>
                              )}
                              {mainButton === "payments" && (
                                <div>
                                  {subButton === "withoutOptions" && (
                                    <>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Total</span>
                                        <span>${total}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">With taxes</span>
                                        <span> ${onTax}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">
                                          After Deposit
                                        </span>
                                        <span> ${onTax - deposit}</span>
                                      </li>
                                    </>
                                  )}
                                  {subButton === "withOptions" && (
                                    <>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Total</span>
                                        <span>${totalWithOptions}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">With taxes</span>
                                        <span> ${qcTax}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">
                                          After Deposit
                                        </span>
                                        <span> ${qcTax - deposit}</span>
                                      </li>
                                    </>
                                  )}
                                </div>
                              )}
                              {mainButton === "noTax" && (
                                <div>
                                  {subButton === "withoutOptions" && (
                                    <>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Total</span>
                                        <span>${total}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">With taxes</span>
                                        <span> ${native}</span>
                                      </li>
                                      <li className="flex mt-3 items-center justify-between">
                                        <span className="text-[#8a8a93]">
                                          After Deposit
                                        </span>
                                        <span> ${native - deposit}</span>
                                      </li>
                                    </>
                                  )}
                                  {subButton === "withOptions" && (
                                    <>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Total</span>
                                        <span>${totalWithOptions}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">With taxes</span>
                                        <span> ${totalWithOptions}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">
                                          After Deposit
                                        </span>
                                        <span> ${totalWithOptions - deposit}</span>
                                      </li>
                                    </>
                                  )}
                                </div>
                              )}
                              {mainButton === "customTax" && (
                                <div>
                                  {subButton === "withoutOptions" && (
                                    <>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Total</span>
                                        <span>${total}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">With taxes</span>
                                        <span> ${otherTax}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">
                                          After Deposit
                                        </span>
                                        <span> ${otherTax - deposit}</span>
                                      </li>
                                    </>
                                  )}
                                  {subButton === "withOptions" && (
                                    <>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">Total</span>
                                        <span>${totalWithOptions}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">With taxes</span>
                                        <span> ${otherTaxWithOptions}</span>
                                      </li>
                                      <li className="mt-3 flex items-center justify-between">
                                        <span className="text-[#8a8a93]">
                                          After Deposit
                                        </span>
                                        <span> ${otherTaxWithOptions - deposit}</span>
                                      </li>
                                    </>
                                  )}
                                </div>
                              )}
                            </ul>
                          </CardContent>
                        </>
                      )}
                      <Input type="hidden" defaultValue={on60} name="on60" />
                      <Input type="hidden" defaultValue={biweekly} name="biweekly" />
                      <Input type="hidden" defaultValue={weekly} name="weekly" />
                      <Input type="hidden" defaultValue={weeklyOth} name="weeklyOth" />
                      <Input type="hidden" defaultValue={biweekOth} name="biweekOth" />
                      <Input type="hidden" defaultValue={oth60} name="oth60" />
                      <Input type="hidden" defaultValue={weeklyqc} name="weeklyqc" />
                      <Input type="hidden" defaultValue={biweeklyqc} name="biweeklyqc" />
                      <Input type="hidden" defaultValue={qc60} name="qc60" />
                      <Input type="hidden" defaultValue={brand} name="brand" />
                      <Input type="hidden" defaultValue={formData.userExtWarr} name="userExtWarr" />
                      <Input type="hidden" defaultValue={formData.userGap} name="userGap" />
                      <Input type="hidden" defaultValue={formData.userServicespkg} name="userServicespkg" />
                      <Input type="hidden" defaultValue={formData.vinE} name="vinE" />
                      <Input type="hidden" defaultValue={formData.rustProofing} name="rustProofing" />
                      <Input type="hidden" defaultValue={formData.userLoanProt} name="userLoanProt" />
                      <Input type="hidden" defaultValue={formData.userTireandRim} name="userTireandRim" />
                      <Input type="hidden" defaultValue={formData.userOther} name="userOther" />
                      <Input type="hidden" defaultValue={formData.lifeDisability} name="lifeDisability" />
                      <Input type="hidden" defaultValue={formData.discount} name="discount" />
                      <Input type="hidden" defaultValue={formData.deliveryCharge} name="deliveryCharge" />
                      <Input type="hidden" defaultValue={formData.discountPer} name="discountPer" />
                      <Input type="hidden" defaultValue={total} name="total" />
                      <Input type="hidden" defaultValue={msrp} name="msrp" />
                      <Input type="hidden" defaultValue={modelData.color} name="color" />
                      <Input type="hidden" defaultValue={modelData.model1} name="model1" />
                      <Input type="hidden" defaultValue={modelData.modelCode} name="modelCode" />
                      <Input type="hidden" defaultValue={onTax} name="onTax" />
                      <Input type="hidden" defaultValue={qcTax} name="qcTax" />
                      <Input type="hidden" defaultValue={otherTax} name="otherTax" />
                      <Input type="hidden" defaultValue={otherTaxWithOptions} name="otherTaxWithOptions" />
                      <Input type="hidden" defaultValue={totalWithOptions} name="totalWithOptions" />
                      <Input type="hidden" defaultValue={formData.freight} name="freight" />
                      <Input type="hidden" defaultValue={formData.admin} name="admin" />
                      <Input type="hidden" defaultValue={formData.pdi} name="pdi" />
                      <Input type="hidden" defaultValue={formData.commodity} name="commodity" />
                      <Input type="hidden" defaultValue={weeklyOthWOptions} name="weeklyOthWOptions" />
                      <Input type="hidden" defaultValue={biweekOthWOptions} name="biweekOthWOptions" />
                      <Input type="hidden" defaultValue={oth60WOptions} name="oth60WOptions" />
                      <Input type="hidden" defaultValue={formData.accessories} name="accessories" />
                      <Input type="hidden" defaultValue={formData.labour} name="labour" />
                      <Input type="hidden" defaultValue={formData.financeId} name="id" />
                      <Input type="hidden" defaultValue={formData.msrp} name="msrp" />
                      <Input type="hidden" defaultValue={weeklylNat} name="weeklylNat" />
                      <Input type="hidden" defaultValue={deposit} name="deposit" />
                      <Input type="hidden" defaultValue={biweeklNat} name="biweeklNat" />
                      <Input type="hidden" defaultValue={biweeklNatWOptions} name="biweeklNatWOptions" />
                      <Input type="hidden" defaultValue={nat60WOptions} name="nat60WOptions" />
                      <Input type="hidden" defaultValue={weeklylNatWOptions} name="weeklylNatWOptions" />
                      <Input type="hidden" defaultValue={nat60} name="nat60" />
                      <Input type="hidden" defaultValue={licensing} name="licensing" />
                      <Input type="hidden" defaultValue={desiredPayments} name="desiredPayments" />
                      <Input type="hidden" defaultValue="Reached" name="customerState" />
                      <Input type="hidden" defaultValue="Active" name="status" />
                      <Input type="hidden" defaultValue={finance.id} name="financeId" />
                      <Input type="hidden" defaultValue={finance.userEmail} name="userEmail" />
                      <Input type="hidden" defaultValue="TBD" name="nextAppointment" />
                      {secPage && (
                        <div className="flex justify-between">
                          <div></div>
                          <input
                            type="hidden"
                            name="financeId"
                            defaultValue={finance.id}
                          />
                          <ButtonLoading
                            size="sm"
                            value="updateFinance"
                            className="mb-5 mr-5   mt-5 w-auto cursor-pointer bg-primary"
                            name="intent"
                            type="submit"
                            isSubmitting={isSubmitting}
                            onClick={() => {
                              setSaved(true);
                              toast.success(`${finance.firstName}'s customer file is updated...`)
                            }}
                            loadingText={`${finance.firstName}'s customer file is updated...`}
                          >
                            Save
                            <PaperPlaneIcon className="ml-2 h-4 w-4" />
                          </ButtonLoading>
                        </div>
                      )}
                    </Form>
                    <CardFooter className="b-rounded-md  flex flex-row items-center border-t border-border  bg-muted/50  px-6  py-3">
                      <div className="text-xs text-muted-foreground">
                        Updated <time dateTime="2023-11-23">November 23, 2023</time>
                      </div>
                      <Pagination className="ml-auto mr-0 w-auto">
                        <PaginationContent>
                          <PaginationItem>
                            <Button
                              onClick={() => handlePrevPage()}
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                            >
                              <ChevronLeft className="h-3.5 w-3.5" />
                              <span className="sr-only">Previous Order</span>
                            </Button>
                          </PaginationItem>
                          <PaginationItem>
                            <Button
                              onClick={() => handleNextPage()}
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                              <span className="sr-only">Next Order</span>
                            </Button>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </CardFooter>
                  </Card>
                  <div className="flex justify-center">
                    <Dialog open={openEmail} onOpenChange={setOpenEmail}>
                      <DialogContent className=" max-w-[700px] w-[650px]  gap-0 border-border p-0 text-foreground outline-none mx-auto">

                        <DialogHeader className="px-4 pb-4 pt-5">
                          <DialogTitle>
                            Sending {emailLabel && emailLabel} w/{" "}
                            {emailDesiredPayments && emailDesiredPayments}
                          </DialogTitle>
                        </DialogHeader>
                        <hr className="mx-auto my-3 w-[98%] text-muted-foreground" />
                        <div className="mx-3 mb-3 grid gap-3">
                          <div className="relative mt-3">

                            <TextArea
                              name="body"
                              defaultValue={formData.body}
                              className="w-full border-border bg-background "
                              onChange={handleChange}
                            />
                            <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                              Email Message
                            </label>

                          </div>
                        </div>
                        <div>
                          <div className="relative mt-4">
                            <EmailPreview modelData={modelData} finance={finance} user={user} formData={formData} />
                            <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                              Email Preview
                            </label>
                          </div>
                        </div>
                        <DialogFooter className=" border-t border-border p-4  ">
                          <div className="flex justify-center">
                            <Button
                              size="icon"
                              type="submit"
                              onClick={() => {
                                toast.success(`Email sent!`);
                                SubmitTheSecondForm();
                                // SubmitTheForm( );

                              }}
                              className="ml-auto bg-primary "
                            >
                              <PaperPlaneIcon className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </DialogFooter>

                      </DialogContent>
                    </Dialog>
                    <Dialog open={openTemplate} onOpenChange={setOpenTemplate}>
                      <DialogContent className=" emailDialog gap-0 border-border p-0 text-foreground outline-none ">
                        <DialogHeader className="px-4 pb-4 pt-5">
                          <DialogTitle>
                            Preview Email Templates
                          </DialogTitle>
                        </DialogHeader>
                        <hr className="mx-auto my-3 w-[98%] text-muted-foreground" />
                        <div>
                          <div className="relative mt-4">
                            <TemplatePreview finance={finance} modelData={modelData} deFees={deFees} user={user} formData={formData} />
                            <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                              Email Preview
                            </label>
                          </div>
                        </div>
                        <hr className="mx-auto my-3 w-[98%] text-muted-foreground" />
                        <div>
                          <div className="relative mt-4">
                            <TemplatePreviewTwo finance={finance} modelData={modelData} deFees={deFees} user={user} />
                            <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                              Email Preview
                            </label>
                          </div>
                        </div>
                        <hr className="mx-auto my-3 w-[98%] text-muted-foreground" />
                        <div>
                          <div className="relative mt-4"> finance,

                            <TemplatePreviewThree finance={finance} modelData={modelData} deFees={deFees} user={user} />
                            <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">
                              Email Preview
                            </label>
                          </div>
                        </div>
                        <DialogFooter className=" border-t border-border p-4  ">
                          <DialogClose className="flex justify-center">
                            <Button size="icon" className="ml-auto bg-primary "  >
                              <X className="ml-2 h-4 w-4" />
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="Service">
                <main className="grid flex-1 items-start  lg:grid-cols-2 xl:grid-cols-2">
                  {serviceOrder && (
                    <Tabs defaultValue="week" className='mr-2'>
                      <div className="flex items-center">
                        <TabsList>
                          <TabsTrigger value="week"> <File className="h-5 w-5" /></TabsTrigger>
                          <TabsTrigger value="Parts"> <Wrench className="h-5 w-5" /></TabsTrigger>
                        </TabsList>
                      </div>
                      <TabsContent value="week">
                        <Card x-chunk="dashboard-05-chunk-3">
                          <CardHeader className="px-7 bg-muted/50 text-lg">
                            <CardTitle>Work Order</CardTitle>
                            <CardDescription>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className=" h-auto max-h-[700px] overflow-y-auto">
                            <div className=' grid grid-cols-1'>
                              <Accordion type="single" collapsible className="w-full border-border">
                                <AccordionItem value="item-1" className='border-border'>
                                  <AccordionTrigger>Unit</AccordionTrigger>
                                  <AccordionContent>
                                    <div className='grid grid-cols-1'>
                                      <Table>
                                        <TableHeader>
                                          <TableRow className='border-border'>
                                            <TableHead>
                                              Unit
                                            </TableHead>
                                            <TableHead>
                                              Color
                                            </TableHead>
                                            <TableHead className="hidden md:table-cell">
                                              Mileage
                                            </TableHead>
                                            <TableHead className="hidden md:table-cell">
                                              VIN
                                            </TableHead>
                                            <TableHead className="hidden md:table-cell">
                                              Motor
                                            </TableHead>
                                            <TableHead className="hidden md:table-cell">
                                              Dept
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {serviceOrder && serviceOrder.Clientfile.ServiceUnit && serviceOrder.Clientfile.ServiceUnit.map((result, index) => (
                                            <TableRow key={index} className="hover:bg-accent border-border rounded-[6px] cursor-pointer" onClick={() => {
                                              const formData = new FormData();
                                              formData.append("unit", (`${result.year} ${result.brand} ${result.model}`));
                                              formData.append("mileage", result.mileage);
                                              formData.append("vin", result.vin);
                                              formData.append("tag", result.tag);
                                              formData.append("motor", result.motor);
                                              formData.append("color", result.color);
                                              formData.append("workOrderId", serviceOrder.workOrderId);
                                              formData.append("intent", 'addUnit');
                                              submit(formData, { method: "post", });
                                            }}>
                                              <TableCell>
                                                <p>{result.year} {result.brand} {result.model}</p>
                                              </TableCell>
                                              <TableCell className="hidden md:table-cell">
                                                {result.mileage}
                                              </TableCell>
                                              <TableCell className="hidden md:table-cell">
                                                {result.vin}
                                              </TableCell>
                                              <TableCell className="hidden md:table-cell">
                                                {result.tag}
                                              </TableCell>
                                              <TableCell className="hidden md:table-cell">
                                                {result.motor}
                                              </TableCell>
                                              <TableCell className="hidden md:table-cell">
                                                <p>Service Units</p>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                          {serviceOrder && serviceOrder.Clientfile.Finance && serviceOrder.Clientfile.Finance.map((result, index) => (
                                            <TableRow key={index} className="hover:bg-accent border-border  rounded-[6px] cursor-pointer" onClick={() => {
                                              const formData = new FormData();
                                              formData.append("unit", (`${result.year} ${result.brand} ${result.model}`));
                                              formData.append("mileage", result.mileage);
                                              formData.append("vin", result.vin);
                                              formData.append("tag", result.tag);
                                              formData.append("motor", result.motor);
                                              formData.append("color", result.color);
                                              formData.append("workOrderId", order.workOrderId);
                                              formData.append("intent", 'addUnit');
                                              submit(formData, { method: "post", });
                                            }}>
                                              <TableCell>
                                                <p>{result.year} {result.brand} {result.model}</p>
                                              </TableCell>
                                              <TableCell className="hidden md:table-cell">
                                                {result.mileage}
                                              </TableCell>
                                              <TableCell className="hidden md:table-cell">
                                                {result.vin}
                                              </TableCell>
                                              <TableCell className="hidden md:table-cell">
                                                {result.tag && (result.tag)}
                                              </TableCell>
                                              <TableCell className="hidden md:table-cell">
                                                {result.motor && (result.motor)}
                                              </TableCell>
                                              <TableCell className="hidden md:table-cell">
                                                <p>Finance Units</p>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                      <Dialog>
                                        <DialogTrigger>
                                          <Button size='sm' className='text-foreground mt-4 w-[75px]' >
                                            New Unit
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className='border-border'>
                                          <DialogHeader>
                                            <DialogTitle>Add New Unit To Client File</DialogTitle>
                                            <DialogDescription>
                                            </DialogDescription>
                                          </DialogHeader>
                                          <>
                                            <Form method='post' >
                                              <input type='hidden' name='clientfileId' value={clientFile.id} />
                                              {serviceOrder && (
                                                <input type='hidden' name='workOrderId' value={serviceOrder.workOrderId} />

                                              )}
                                              <div className='grid grid-cols-1'>
                                                {unitCard.map((user, index) => (
                                                  <div key={index} className="relative mt-4">
                                                    <Input
                                                      name={user.name}
                                                      className={` bg-background text-foreground border border-border`}
                                                    />
                                                    <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">{user.label}</label>
                                                  </div>
                                                ))}
                                                <Button size='sm' className='text-foreground mt-4'
                                                  type='submit'
                                                  name='intent'
                                                  value='addNewServiceUnit' >
                                                  Submit
                                                </Button>
                                              </div>
                                            </Form>
                                          </>
                                        </DialogContent>
                                      </Dialog>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                              <p className='mt-4 mb-5'></p>
                              <div className="grid gap-3">
                                <div className="font-semibold">Work Order Services</div>
                                <ul className="grid gap-3">
                                  {serviceOrder && serviceOrder.ServicesOnWorkOrders && serviceOrder.ServicesOnWorkOrders.map((result, index) => {
                                    const hours = result.hr || result.service.estHr || 0.00;
                                    return (
                                      <li key={index} className="flex items-center justify-between">
                                        <div>
                                          <ContextMenu>
                                            <ContextMenuTrigger>
                                              <div className='grid grid-cols-1'>
                                                <div className='flex items-center group '>
                                                  <div className="font-medium flex-col">
                                                    <p>{result.service.service}</p>
                                                    <p className='text-muted-foreground'>{result.service.description}</p>
                                                  </div>
                                                  <addProduct.Form method="post" ref={formRef} className='mr-auto'>
                                                    <input type="hidden" name="id" value={result.id} />
                                                    <input type='hidden' name='total' value={total} />
                                                    <input type='hidden' name='workOrderId' value={serviceOrder.workOrderId} />
                                                    <Button
                                                      size="icon"
                                                      variant="outline"
                                                      name="intent" value='deleteServiceItem'
                                                      className=" ml-2 bg-primary  opacity-0 transition-opacity group-hover:opacity-100"
                                                      type='submit'
                                                    >
                                                      <X className="h-4 w-4 text-foreground" />
                                                    </Button>
                                                  </addProduct.Form>
                                                </div>
                                                <div className="hidden text-sm text-muted-foreground md:inline">
                                                  <div className='flex items-center'>
                                                    <div className="font-medium">
                                                      <EditableText
                                                        value={hours}
                                                        fieldName="name"
                                                        inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  w-[75px]"
                                                        buttonClassName="text-center py-1 px-2 text-muted-foreground"
                                                        buttonLabel={`Edit name`}
                                                        inputLabel={`Edit name`}
                                                      >
                                                        <input type="hidden" name="intent" value='updateHr' />
                                                        <input type="hidden" name="id" value={result.id} />
                                                        <input type="hidden" name="colName" value='hr' />
                                                      </EditableText>

                                                    </div>
                                                    <p>/hrs{" "}{" "}@{" "}${tax.userLabour}</p>
                                                  </div>
                                                </div>
                                                {result.status && (
                                                  <div>
                                                    <Badge className='text-sm  px-2 py-1 '>{result.status}</Badge>
                                                  </div>
                                                )}
                                              </div>
                                            </ContextMenuTrigger>
                                            <ContextMenuContent className='border-border'>
                                              <ContextMenuSub>
                                                <ContextMenuSubTrigger inset>Service Details</ContextMenuSubTrigger>
                                                <ContextMenuSubContent className="w-48 border-border">
                                                  <ContextMenuItem>{result.service.service}</ContextMenuItem>
                                                  <ContextMenuItem>{result.service.description}</ContextMenuItem>
                                                  <ContextMenuSeparator />
                                                  <ContextMenuItem>
                                                    Est. Hours
                                                    <ContextMenuShortcut>{result.service.estHr}</ContextMenuShortcut>
                                                  </ContextMenuItem>
                                                  <ContextMenuItem>
                                                    Price
                                                    <ContextMenuShortcut>${result.service.price}</ContextMenuShortcut>
                                                  </ContextMenuItem>
                                                </ContextMenuSubContent>
                                              </ContextMenuSub>
                                              <ContextMenuSeparator />
                                              <ContextMenuCheckboxItem
                                                checked={result.status === 'In Stock'}
                                                onSelect={() => {
                                                  const formData = new FormData();
                                                  formData.append("id", result.id);
                                                  formData.append("status", 'In Stock');
                                                  formData.append("intent", 'updateServiceOnOrders');
                                                  submit(formData, { method: "post", });
                                                }}
                                              >In Stock</ContextMenuCheckboxItem>
                                              <ContextMenuCheckboxItem
                                                checked={result.status === 'On Order'}
                                                onSelect={() => {
                                                  const formData = new FormData();
                                                  formData.append("id", result.id);
                                                  formData.append("status", 'On Order');
                                                  formData.append("intent", 'updateServiceOnOrders');
                                                  submit(formData, { method: "post", });
                                                }}
                                              >On Order</ContextMenuCheckboxItem>
                                              <ContextMenuCheckboxItem
                                                checked={result.status === 'Completed'}
                                                onSelect={() => {
                                                  const formData = new FormData();
                                                  formData.append("id", result.id);
                                                  formData.append("status", 'Completed');
                                                  formData.append("intent", 'updateServiceOnOrders');
                                                  submit(formData, { method: "post", });
                                                }}
                                              >Completed</ContextMenuCheckboxItem>
                                              <ContextMenuCheckboxItem
                                                checked={result.status === 'Back Order'}
                                                onSelect={() => {
                                                  const formData = new FormData();
                                                  formData.append("id", result.id);
                                                  formData.append("status", 'Back Order');
                                                  formData.append("intent", 'updateServiceOnOrders');
                                                  submit(formData, { method: "post", });
                                                }}
                                              >Back Order</ContextMenuCheckboxItem>
                                            </ContextMenuContent>
                                          </ContextMenu>
                                        </div>
                                        <span>
                                          x{" "}{" "}{result.quantity}
                                        </span>
                                      </li>
                                    )
                                  })}
                                </ul>
                              </div>
                              <Separator className="my-4" />
                              <div className="font-semibold">Services</div>
                              <div className='mx-4 flex-col'>
                                <Accordion type="single" collapsible className="w-full border-border">
                                  <AccordionItem value="item-1" className='border-border'>
                                    <AccordionTrigger>Add New Service</AccordionTrigger>
                                    <AccordionContent>
                                      <fetcher.Form method='post'>
                                        <input type='hidden' name='workOrderId' value={serviceOrder.workOrderId} />
                                        <div className='flex'>
                                          <div className="flex-col" >
                                            <div className="relative mt-4">
                                              <Input name='name' className='w-[250px] mr-3' />
                                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Name</label>
                                            </div>
                                            <div className="relative mt-4">
                                              <TextArea name='description' className='w-[250px] mr-3' />
                                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Description</label>
                                            </div>

                                            <div className="relative mt-4">
                                              <Input name='hr' className='w-[100px] mr-3' />
                                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Hr's</label>
                                            </div>
                                            <div className="relative mt-4">
                                              <Input name='quantity' className='w-[100px] mr-3' defaultValue={1} />
                                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Quantity</label>
                                            </div>

                                            <Button
                                              className='mt-4'
                                              size='icon'
                                              type='submit'
                                              name='intent'
                                              value='addNewServiceToWorkOrder'
                                            ><Plus /></Button>
                                          </div>
                                        </div>
                                      </fetcher.Form>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>

                              </div>
                              <div className='flex-col mt-4'>
                                <div className='mx-4'>
                                  <div className="font-semibold">Select Service</div>
                                  <search.Form method="get" action='/dealer/service/search/services'>
                                    <div className="relative ml-auto flex-1 md:grow-0 ">
                                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        ref={ref}
                                        type="search"
                                        name="q"
                                        onChange={e => {
                                          search.submit(e.currentTarget.form);
                                        }}
                                        autoFocus
                                        placeholder="Search..."
                                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                                      />
                                    </div>
                                  </search.Form>
                                  <ul className="grid gap-3 mt-3 h-auto max-h-[600px] overflow-y-auto">
                                    {search.data && search.data.map((result, index) => {
                                      return (
                                        <li key={index} className="p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-[6px]" onClick={() => {
                                          const formData = new FormData();
                                          formData.append("hr", result.estHr);
                                          formData.append("workOrderId", serviceOrder.workOrderId);
                                          formData.append("serviceId", result.id);
                                          formData.append("intent", 'addServiceToWorkOrder');
                                          submit(formData, { method: "post", });
                                        }}>
                                          <div className="font-medium flex-col">
                                            <p className=' text-left'>{result.service}</p>
                                            <p className='text-muted-foreground text-left'>{result.description}</p>
                                            <p className='text-muted-foreground text-left'>{result.estHr}/hrs{" "}{" "}@{" "}${tax.userLabour}</p>
                                          </div>
                                        </li>
                                      )
                                    })}
                                  </ul>

                                </div>

                              </div>

                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="Parts">
                        <Card x-chunk="dashboard-05-chunk-3 " className='mx-5 w-[95%] '>
                          <CardHeader className="px-7">
                            <CardTitle>
                              <div className='flex justify-between items-center'>
                                <p>Accessories</p>
                              </div>
                            </CardTitle>
                            <CardDescription className='flex items-center'>
                              <product.Form method="get" action='/dealer/accessories/products/search'>
                                <div className="relative ml-auto flex-1 md:grow-0 ">
                                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    ref={ref}
                                    type="search"
                                    name="q"
                                    onChange={e => {
                                      //   search.submit(`/dealer/accessories/search?name=${e.target.value}`);
                                      product.submit(e.currentTarget.form);
                                    }}
                                    autoFocus
                                    placeholder="Search..."
                                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                                  />
                                </div>
                              </product.Form>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
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
                                  <TableHead className="hidden sm:table-cell">
                                    Sub Category
                                  </TableHead>
                                  <TableHead className="hidden sm:table-cell">
                                    On Order
                                  </TableHead>
                                  <TableHead className="hidden sm:table-cell">
                                    Distributer
                                  </TableHead>
                                  <TableHead className="hidden sm:table-cell">
                                    Location
                                  </TableHead>
                                  <TableHead className="hidden md:table-cell">
                                    Cost
                                  </TableHead>
                                  <TableHead className="hidden sm:table-cell">
                                    Price
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Quantity
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody className='max-h-[700px] h-auto overflow-y-auto'>
                                {product.data &&
                                  product.data.map((result, index) => (
                                    <TableRow key={index} className="hover:bg-accent border-border rounded-[6px] cursor-pointer" onClick={() => {
                                      const formData = new FormData();
                                      formData.append("accessoryId", result.id);
                                      formData.append("workOrderId", serviceOrder.workOrderId);
                                      formData.append("accOrderId", serviceOrder.AccOrders[0].id);
                                      formData.append("intent", 'addAccToWorkOrder');
                                      submit(formData, { method: "post", });
                                    }}>
                                      <TableCell className='flex-col'>
                                        <p className="font-medium">
                                          {result.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground ">
                                          {result.brand}
                                        </p>
                                      </TableCell>
                                      <TableCell className="hidden sm:table-cell">
                                        {result.description}
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                        {result.category}
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                        {result.subCategory}
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                        {result.onOrder}
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                        {result.distributer}
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                        {result.location}
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                        {result.cost}
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                        {result.price}
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                        {result.quantity}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="Calendar">
                      </TabsContent>
                    </Tabs>
                  )}
                  <div>
                    <Card className="overflow-hidden mt-[35px] ml-2" x-chunk="dashboard-05-chunk-4"          >
                      <CardHeader className="flex flex-row items-start bg-muted/50">
                        <div className="grid gap-0.5">
                          <CardTitle className="group flex items-center gap-2 text-lg">
                            W / O #{serviceOrder && (serviceOrder.workOrderId)}
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">Copy Order ID</span>
                            </Button>
                          </CardTitle>
                          {serviceOrder && serviceOrder.status && (
                            <div>
                              <div className="relative mt-4">
                                <Select
                                  name='status'
                                  defaultValue={serviceOrder.status}
                                  onValueChange={(value) => {
                                    const formData = new FormData();
                                    formData.append("id", order.workOrderId);
                                    formData.append("total", total);
                                    formData.append("intent", 'updateStatus');
                                    formData.append("status", value);
                                    console.log(formData, 'formData');
                                    workOrder.submit(formData, { method: "post" });
                                  }}>
                                  <SelectTrigger className="w-[200px] " >
                                    <SelectValue defaultValue={serviceOrder.status} />
                                  </SelectTrigger>
                                  <SelectContent className='border-border'>
                                    <SelectGroup>
                                      <SelectLabel>Status</SelectLabel>
                                      <SelectItem value="Quote">Quote</SelectItem>
                                      <SelectItem value="Sales">Sales</SelectItem>
                                      <SelectItem value="Open">Open / Scheduled</SelectItem>
                                      <SelectItem value="Waiting On Parts">Waiting On Parts</SelectItem>
                                      <SelectItem value="Waiter">Waiter</SelectItem>
                                      <SelectItem value="In Works">In Works</SelectItem>
                                      <SelectItem value="Work Completed">Work Completed</SelectItem>
                                      <SelectItem value="Closed">Closed</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-muted/50 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Status</label>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          {serviceOrder && (
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
                                    navigate(`/dealer/service/workOrder/${serviceOrder.workOrderId}`)
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
                                    setorder(null)
                                  }}>
                                  Back
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onSelect={() => {
                                    const formData = new FormData();
                                    formData.append("workOrderId", serviceOrder.workOrderId);
                                    formData.append("intent", 'deleteOrder');
                                    submit(formData, { method: "post", });
                                  }}>
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 text-sm h-auto max-h-[700px] overflow-y-auto">
                        {secPageService && (
                          <>

                            <Accordion type="single" collapsible className="w-full border-border mt-3">
                              <AccordionItem value="item-1" className='border-border'>
                                <AccordionTrigger>Work Order Notes</AccordionTrigger>
                                <AccordionContent>
                                  <div className="grid gap-3">
                                    <Form method='post'>
                                      <div className="relative mt-4">
                                        <TextArea className='w-full mt-4' name='note' defaultValue={serviceOrder.notes} />
                                        <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Note</label>
                                      </div>
                                      <input type='hidden' name='id' defaultValue={serviceOrder.workOrderId} />
                                      <Button type='submit' name='intent' value='updateNote' className='mt-4 text-foreground' size='sm'>
                                        Submit
                                      </Button>
                                    </Form>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            <div className="grid gap-3 mt-3">
                              <div className="font-semibold">Work Order Services</div>
                              <ul className="grid gap-3">
                                {serviceOrder.ServicesOnWorkOrders && serviceOrder.ServicesOnWorkOrders.map((result, index) => {
                                  const hours = result.hr || result.service.estHr || 0.00;
                                  return (
                                    <li key={index} className="flex items-center justify-between">
                                      <div>
                                        <ContextMenu>
                                          <ContextMenuTrigger>
                                            <div className='grid grid-cols-1'>
                                              <div className='flex items-center group '>
                                                <div className="font-medium">
                                                  {result.service.service}
                                                </div>
                                                <addProduct.Form method="post" ref={formRef} className='mr-auto'>
                                                  <input type="hidden" name="id" value={result.id} />
                                                  <input type='hidden' name='total' value={total} />
                                                  <input type='hidden' name='workOrderId' value={serviceOrder.workOrderId} />
                                                  <Button
                                                    size="icon"
                                                    variant="outline"
                                                    name="intent" value='deleteServiceItem'
                                                    className=" ml-2 bg-primary  opacity-0 transition-opacity group-hover:opacity-100"
                                                    type='submit'
                                                  >
                                                    <X className="h-4 w-4 text-foreground" />
                                                  </Button>
                                                </addProduct.Form>
                                              </div>
                                              <div className="hidden text-sm text-muted-foreground md:inline">
                                                <div className='flex items-center'>
                                                  <div className="font-medium">
                                                    <EditableText
                                                      value={hours}
                                                      fieldName="name"
                                                      inputClassName=" border border-border rounded-lg  text-foreground bg-background py-1 px-2  w-[75px]"
                                                      buttonClassName="text-center py-1 px-2 text-muted-foreground"
                                                      buttonLabel={`Edit name`}
                                                      inputLabel={`Edit name`}
                                                    >
                                                      <input type="hidden" name="intent" value='updateHr' />
                                                      <input type="hidden" name="id" value={result.id} />
                                                      <input type="hidden" name="colName" value='hr' />
                                                    </EditableText>

                                                  </div>
                                                  <p>{" "}hrs{" "}{" "}@{" "}${tax.userLabour}</p>
                                                </div>
                                              </div>
                                              {result.status && (
                                                <div>
                                                  <Badge className='text-sm  px-2 py-1 '>{result.status}</Badge>
                                                </div>
                                              )}
                                            </div>
                                          </ContextMenuTrigger>
                                          <ContextMenuContent className='border-border'>
                                            <ContextMenuSub>
                                              <ContextMenuSubTrigger inset>Service Details</ContextMenuSubTrigger>
                                              <ContextMenuSubContent className="w-48 border-border">
                                                <ContextMenuItem>{result.service.service}</ContextMenuItem>
                                                <ContextMenuItem>{result.service.description}</ContextMenuItem>
                                                <ContextMenuSeparator />
                                                <ContextMenuItem>
                                                  Est. Hours
                                                  <ContextMenuShortcut>{result.service.estHr}</ContextMenuShortcut>
                                                </ContextMenuItem>
                                                <ContextMenuItem>
                                                  Price
                                                  <ContextMenuShortcut>${result.service.price}</ContextMenuShortcut>
                                                </ContextMenuItem>
                                              </ContextMenuSubContent>
                                            </ContextMenuSub>
                                            <ContextMenuSeparator />
                                            <ContextMenuCheckboxItem
                                              checked={result.status === 'In Stock'}
                                              onSelect={() => {
                                                const formData = new FormData();
                                                formData.append("id", result.id);
                                                formData.append("status", 'In Stock');
                                                formData.append("intent", 'updateServiceOnOrders');
                                                submit(formData, { method: "post", });
                                              }}
                                            >In Stock</ContextMenuCheckboxItem>
                                            <ContextMenuCheckboxItem
                                              checked={result.status === 'On Order'}
                                              onSelect={() => {
                                                const formData = new FormData();
                                                formData.append("id", result.id);
                                                formData.append("status", 'On Order');
                                                formData.append("intent", 'updateServiceOnOrders');
                                                submit(formData, { method: "post", });
                                              }}
                                            >On Order</ContextMenuCheckboxItem>
                                            <ContextMenuCheckboxItem
                                              checked={result.status === 'Completed'}
                                              onSelect={() => {
                                                const formData = new FormData();
                                                formData.append("id", result.id);
                                                formData.append("status", 'Completed');
                                                formData.append("intent", 'updateServiceOnOrders');
                                                submit(formData, { method: "post", });
                                              }}
                                            >Completed</ContextMenuCheckboxItem>
                                            <ContextMenuCheckboxItem
                                              checked={result.status === 'Back Order'}
                                              onSelect={() => {
                                                const formData = new FormData();
                                                formData.append("id", result.id);
                                                formData.append("status", 'Back Order');
                                                formData.append("intent", 'updateServiceOnOrders');
                                                submit(formData, { method: "post", });
                                              }}
                                            >Back Order</ContextMenuCheckboxItem>
                                          </ContextMenuContent>
                                        </ContextMenu>
                                      </div>
                                      <span>
                                        x{" "}{" "}{result.quantity}

                                      </span>
                                    </li>
                                  )
                                })}
                              </ul>
                              <Separator className="my-4" />
                              <div className="font-semibold">Work Order Parts</div>
                              <ul className="grid gap-3">
                                {serviceOrder?.AccOrders?.length > 0 ? (
                                  serviceOrder.AccOrders.map((accOrder, accOrderIndex) => (
                                    <div key={accOrderIndex}>
                                      {accOrder?.AccessoriesOnOrders?.length > 0 ? (
                                        accOrder.AccessoriesOnOrders.map((accessoryOnOrder, accessoryIndex) => (
                                          <li key={accessoryIndex} className="flex items-center justify-between">
                                            <div>
                                              <ContextMenu>
                                                <ContextMenuTrigger>
                                                  <div className='grid grid-cols-1'>
                                                    <div className='flex items-center group '>
                                                      <div className="font-medium">

                                                        {accessoryOnOrder.accessory.name}
                                                      </div>
                                                      <addProduct.Form method="post" ref={formRef} className='mr-auto'>
                                                        <input type="hidden" name="id" value={accessoryOnOrder.id} />
                                                        <input type='hidden' name='total' value={accessoryOnOrder.accessory.price * accessoryOnOrder.quantity} />
                                                        <input type='hidden' name='accOrderId' value={accOrder.id} />
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
                                                      {accessoryOnOrder.accessory.brand}
                                                    </div>
                                                    <div>
                                                      <Badge className='text-sm  px-2 py-1 '>{accessoryOnOrder.status}</Badge>
                                                    </div>
                                                  </div>
                                                </ContextMenuTrigger>
                                                <ContextMenuContent className='border-border'>
                                                  <ContextMenuSub>
                                                    <ContextMenuSubTrigger inset>Part Details</ContextMenuSubTrigger>
                                                    <ContextMenuSubContent className="w-48 border-border">
                                                      <ContextMenuItem>{accessoryOnOrder.accessory.partNumber}</ContextMenuItem>
                                                      <ContextMenuItem>{accessoryOnOrder.accessory.brand} </ContextMenuItem>
                                                      <ContextMenuItem>{accessoryOnOrder.accessory.name} </ContextMenuItem>
                                                      <ContextMenuItem>{accessoryOnOrder.accessory.description} </ContextMenuItem>
                                                      <ContextMenuItem>{accessoryOnOrder.accessory.category} </ContextMenuItem>
                                                      <ContextMenuItem>{accessoryOnOrder.accessory.category} </ContextMenuItem>
                                                      <ContextMenuSeparator />
                                                      <ContextMenuItem>
                                                        Cost
                                                        <ContextMenuShortcut>${accessoryOnOrder.accessory.cost}</ContextMenuShortcut>
                                                      </ContextMenuItem>
                                                      <ContextMenuItem>
                                                        Price
                                                        <ContextMenuShortcut>${accessoryOnOrder.accessory.price}</ContextMenuShortcut>
                                                      </ContextMenuItem>
                                                      <ContextMenuItem>
                                                        In Stock
                                                        <ContextMenuShortcut>{accessoryOnOrder.accessory.quantity}</ContextMenuShortcut>
                                                      </ContextMenuItem>
                                                      <ContextMenuItem>
                                                        On Order
                                                        <ContextMenuShortcut>{accessoryOnOrder.accessory.onOrder}</ContextMenuShortcut>
                                                      </ContextMenuItem>
                                                      <ContextMenuItem>
                                                        Location
                                                        <ContextMenuShortcut>{accessoryOnOrder.accessory.location}</ContextMenuShortcut>
                                                      </ContextMenuItem>
                                                    </ContextMenuSubContent>
                                                  </ContextMenuSub>
                                                  <ContextMenuCheckboxItem
                                                    checked={accessoryOnOrder.status === 'In Stock'}
                                                    onSelect={() => {
                                                      const formData = new FormData();
                                                      formData.append("id", accessoryOnOrder.id);
                                                      formData.append("status", 'In Stock');
                                                      formData.append("intent", 'updateAccOnOrders');
                                                      submit(formData, { method: "post", });
                                                    }}
                                                  >In Stock</ContextMenuCheckboxItem>
                                                  <ContextMenuCheckboxItem
                                                    checked={accessoryOnOrder.status === 'On Order'}
                                                    onSelect={() => {
                                                      const formData = new FormData();
                                                      formData.append("id", accessoryOnOrder.id);
                                                      formData.append("status", 'On Order');
                                                      formData.append("intent", 'updateAccOnOrders');
                                                      submit(formData, { method: "post", });
                                                    }}
                                                  >On Order</ContextMenuCheckboxItem>
                                                  <ContextMenuCheckboxItem
                                                    checked={accessoryOnOrder.status === 'Back Order'}
                                                    onSelect={() => {
                                                      const formData = new FormData();
                                                      formData.append("id", accessoryOnOrder.id);
                                                      formData.append("status", 'Back Order');
                                                      formData.append("intent", 'updateAccOnOrders');
                                                      submit(formData, { method: "post", });
                                                    }}
                                                  >Back Order</ContextMenuCheckboxItem>
                                                </ContextMenuContent>
                                              </ContextMenu>
                                            </div>
                                            <span>${accessoryOnOrder.accessory.price} x {accessoryOnOrder.quantity}</span>
                                          </li>
                                        ))
                                      ) : (
                                        <p>No Accessories On Orders available.</p>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <p>No Orders available.</p>
                                )}
                              </ul>


                              <Separator className="my-2" />
                              <ul className="grid gap-3">
                                <li className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Service Subtotal</span>
                                  <span>${serviceSubTotal}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Parts Subtotal</span>
                                  <span>${partsSubTotal}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span>${totalPreTax}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Tax</span>
                                  <span>{tax.userTax}%</span>
                                </li>
                                <li className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Total</span>
                                  <span>${totalService}</span>
                                </li>
                              </ul>
                            </div>
                            <Separator className="my-4" />
                            <div className='gap-3'>
                              <div className="font-semibold">Staff</div>

                              <ul className="grid gap-3">
                                <li className="flex items-center justify-between">
                                  <span className="text-muted-foreground">
                                    Technician
                                  </span>
                                  <span>{serviceOrder.tech}</span>
                                </li>
                                <li className="flex items-center justify-between">
                                  <span className="text-muted-foreground">
                                    Service Writer
                                  </span>
                                  <span>{serviceOrder.writer}</span>
                                </li>
                              </ul>
                            </div>
                          </>
                        )}
                        {firstPageService && (
                          <>
                            <ul className="grid gap-3 mt-3 h-auto max-h-[600px] overflow-y-auto">
                              {orders && orders.map((result, index) => {
                                return (
                                  <li
                                    onClick={() => {
                                      handleNextPage()
                                      setServiceOrder(result)
                                    }}
                                    key={index}
                                    className="p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-[6px]">
                                    <div className='flex-col'>
                                      <div className='flex justify-between items-center'>
                                        <p className='font-medium text-left'>W / O #{result.workOrderId}</p>
                                        <p className='text-muted-foreground font-medium text-right'>{result.status}</p>
                                      </div>
                                      <div className='flex justify-between items-center'>
                                        <p className='text-muted-foreground text-left'>Writer: {result.writer}</p>
                                        <p className='text-muted-foreground text-right'>Tech: {result.tech}</p>
                                      </div>
                                      <p className='text-muted-foreground text-left'>{new Date(result.createdAt).toLocaleDateString("en-US", options2)}</p>
                                    </div>
                                  </li>
                                )
                              })}
                            </ul>
                          </>
                        )}
                      </CardContent>
                      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 border-border">
                        <Button size='sm' variant='outline'>
                          Create New Work Order
                        </Button>
                        <Pagination className="ml-auto mr-0 w-auto">
                          <PaginationContent>
                            <PaginationItem>
                              <Button size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => {
                                  handlePrevPage()
                                }}>
                                <ChevronLeft className="h-3.5 w-3.5" />
                                <span className="sr-only">Previous Order</span>
                              </Button>
                            </PaginationItem>
                            <PaginationItem>
                              <Button size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => {
                                  handleNextPage()
                                }}>
                                <ChevronRight className="h-3.5 w-3.5" />
                                <span className="sr-only">Next Order</span>
                              </Button>
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </CardFooter>
                    </Card>
                  </div>

                </main >
              </TabsContent>
              <TabsContent value="Accessories">
                <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
                  <Card x-chunk="dashboard-07-chunk-3" className="sm:col-span-2 m-4 ">
                    <CardHeader className=' bg-muted/50'>
                      <CardTitle>  Customers Acc Orders/Quotes</CardTitle>
                      <CardDescription>
                        Review quote and orders the customer has looked at or purchased.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='flex-grow !grow  h-auto  overflow-y-auto'>
                      <div className="grid h-auto max-h-[273px]">
                        <div className="font-semibold mt-4 flex justify-between items-center">
                          <p>
                            Orders With Unit
                          </p>
                          <Button
                            size='sm'
                            className='bg-primary'
                            onClick={() => {
                              const formData = new FormData();
                              formData.append("financeId", finance.id);
                              formData.append("userEmail", user.email);
                              formData.append("userName", user.name);
                              formData.append("clientfileId", clientFile.id);
                              formData.append("intent", 'createAccQuote');
                              submit(formData, { method: "post", });
                            }} >
                            Create Quote
                          </Button>
                        </div>
                        <Table className='w-[95%] mx-auto'>
                          <TableHeader>
                            <TableRow className='border-border'>
                              <TableHead>
                                Dept
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Employee
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Status
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Total
                              </TableHead>
                              <TableHead className="">
                                Actions
                              </TableHead>

                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {attachedToFinance &&
                              attachedToFinance.map((result, index) => {
                                const isCompleted = result.AccHandoff.sendToCompleted === 'true';
                                console.log(isCompleted, result.AccHandoff.sendTo, ' is completed')
                                return (
                                  <TableRow key={index} className="hover:bg-accent border-border">
                                    <TableCell>
                                      <div>
                                        {result.dept}
                                      </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {result.userName}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      <Badge>
                                        {result.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {result.total}
                                    </TableCell>
                                    <TableCell className='flex items-center gap-3'>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="bg-primary"
                                            onClick={() => {
                                              setShowOrder(result)
                                            }}
                                          >
                                            <Eye className="h-5 w-5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                          Preview Details
                                        </TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="bg-primary"
                                            onClick={() => {
                                              const formData = new FormData();
                                              formData.append("orderId", result.id);
                                              formData.append("intent", 'syncAccOrder');
                                              submit(formData, { method: "post", });
                                            }}
                                          >
                                            <FileText className="h-5 w-5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                          Go To Order
                                        </TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className={`${isCompleted ? 'bg-[#30A46C]' : 'bg-primary'
                                              }`} disabled={result.AccHandoff.sendTo === 'Accessories'}
                                            onClick={() => {
                                              const formData = new FormData();
                                              formData.append("AccOrderId", result.id);
                                              formData.append("handOffTime", new Date().toLocaleDateString("en-US", options2));
                                              formData.append("intent", 'sendToAcc');
                                              submit(formData, { method: "post", });
                                              // AccHandoff
                                              //  sendTo          String?
                                              //  handOffTime   DateTime?
                                              //  status        String?
                                              //  sendToCompleted String?  @default("false")
                                              //  completedTime DateTime?
                                              //  notes         String?
                                              //  AccOrderId
                                              // new Date(result.paidDate).toLocaleDateString("en-US", options2
                                            }}
                                          >
                                            <Shirt className="h-5 w-5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                          Send To Accessories
                                        </TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className={` ${result.AccHandoff.sendToCompleted === 'true' ? 'bg-[#30A46C]' : 'bg-primary'}`}

                                            disabled={result.AccHandoff.sendTo === 'Parts'}
                                            onClick={() => {
                                              const formData = new FormData();
                                              formData.append("AccOrderId", result.id);
                                              formData.append("handOffTime", new Date().toLocaleDateString("en-US", options2));
                                              formData.append("intent", 'sendToParts');
                                              submit(formData, { method: "post", });
                                            }}
                                          >
                                            <Wrench className="h-5 w-5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                          Send To Parts
                                        </TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="bg-primary"
                                            onClick={() => {
                                              PrintReceiptAcc(toReceiptAcc)
                                            }}
                                          >
                                            <Receipt className="h-5 w-5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom">
                                          Print Receipt
                                        </TooltipContent>
                                      </Tooltip>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}

                          </TableBody>
                        </Table>
                        <Separator className='my-5' />
                        <div className="font-semibold mt-4">Other Orders Under Clients File</div>
                        <Table className='w-[95%] mx-auto'>
                          <TableHeader>
                            <TableRow className='border-border'>

                              <TableHead>
                                Dept
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Employee
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Status
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Total
                              </TableHead>
                              <TableHead className="">
                                Actions
                              </TableHead>

                            </TableRow>
                          </TableHeader>
                          <TableBody>

                            {notAttachedToFinance &&
                              notAttachedToFinance.map((result, index) => {
                                console.log(result, 'in table')

                                return (
                                  <TableRow key={index} className="hover:bg-accent border-border">
                                    <TableCell>
                                      <div>
                                        {result.dept}
                                      </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {result.userName}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      <Badge>
                                        {result.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {result.total}
                                    </TableCell>

                                    <TableCell className='flex items-center gap-3'>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="bg-primary"
                                            onClick={() => {
                                              console.log('Setting showOrder with:', result);
                                              setShowOrder(result);
                                              console.log('Current showOrder:', showOrder);

                                            }}
                                          >
                                            <Eye className="h-5 w-5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                          Preview Details
                                        </TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="bg-primary"
                                            onClick={() => {
                                              const formData = new FormData();
                                              formData.append("orderId", result.id);
                                              formData.append("intent", 'syncAccOrder');
                                              submit(formData, { method: "post", });
                                            }}
                                          >
                                            <FileText className="h-5 w-5" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                          Go To Order
                                        </TooltipContent>
                                      </Tooltip>


                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-self-end flex-row items-center border-t border-border  bg-muted/50  px-6 py-3">
                      <div className="text-xs text-muted-foreground flex items-center justify-between mb-5">


                      </div>
                    </CardFooter>
                  </Card>
                  {showOrder && (
                    <Card className='sm:col-span-2 m-4' x-chunk="dashboard-07-chunk-3">
                      <CardHeader className=' bg-muted/50'>
                        <CardTitle> Order Details </CardTitle>
                      </CardHeader>
                      <CardContent className=' !grow !flex-grow h-auto max-h-[300px] overflow-y-auto'>
                        <div className="grid gap-6 mt-1">
                          <div className="font-semibold"></div>
                          <ul className="grid gap-3 max-h-[300px] h-auto overflow-y-auto">
                            {showOrder?.AccessoriesOnOrders && (
                              <ul>
                                {showOrder.AccessoriesOnOrders.map((result, index) => {
                                  console.log(result, 'kjhkhkhkj'); // Check the data here
                                  return (
                                    <li className="flex items-center justify-between" key={index}>
                                      <div>
                                        <div className='flex items-center group'>
                                          <div className="font-medium">
                                            {result.accessory.brand} {result.accessory.name}
                                          </div>
                                          <addProduct.Form method="post" ref={formRef} className='mr-auto'>
                                            <input type="hidden" name="id" value={result.id} />
                                            <input type='hidden' name='total' value={pacTotal} />
                                            <input type='hidden' name='accOrderId' value={showOrder.id} />
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
                                          {result.accessory.category}
                                        </div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                          {result.accessory.description}
                                        </div>
                                      </div>
                                      <span>${result.accessory.price} x {result.quantity}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </ul>
                          <Separator className="my-2" />
                          <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>${totalAccessoriesCost}</span>
                            </li>
                            {showOrder.discount === 0 && (
                              <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Discount</span>
                                <span>${showOrder.discount}</span>
                              </li>
                            )}
                            {showOrder.discPer === 0 && (
                              <li className="flex items-center justify-between">
                                <span className="text-muted-foreground">Discount</span>
                                <span>{showOrder.discPer}%</span>
                              </li>
                            )}
                            {discount !== 0 && (
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
                                      defaultValue={showOrder.id}
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
                                      defaultValue={showOrder.id}
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
                              <span>{deFees.userTax}%</span>
                            </li>
                            <li className="flex items-center justify-between font-semibold">
                              <span className="text-muted-foreground">Total</span>
                              <span>${pacTotal}</span>
                            </li>
                          </ul>
                          <Form method='post' >
                            <input type='hidden' name='orderId' value={showOrder.id} />
                            <div className="relative mt-4">
                              <TextArea className='w-full' defaultValue={showOrder.note} name='note' />
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
                        </div>



                      </CardContent>
                      <CardFooter className="flex justify-self-end flex-row items-center border-t border-border  bg-muted/50  px-6 py-3">

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
                                onSelect={() => setDiscount((prevDiscount) => !prevDiscount)}>Show Discount</DropdownMenuItem>

                              <DropdownMenuItem
                                onSelect={() => {
                                  PrintReceiptAcc(toReceiptAcc)
                                }}
                              >Print Receipt</DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => {
                                  const formData = new FormData();
                                  formData.append("financeId", finance.id);
                                  formData.append("subTotal", totalAccessoriesCost);
                                  formData.append("intent", 'pushSubtotal');
                                  submit(formData, { method: "post", });
                                }}
                              >Push Sub Total to Finance</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onSelect={() => {
                                  const formData = new FormData();
                                  formData.append("orderId", showOrder.id);
                                  formData.append("financeId", finance.id);
                                  formData.append("intent", 'claimAccOrder');
                                  submit(formData, { method: "post", });
                                }}
                              >Claim for Finance File</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onSelect={() => {
                                  const formData = new FormData();
                                  formData.append("orderId", showOrder.id);
                                  formData.append("intent", 'deleteAccOrder');
                                  submit(formData, { method: "post", });
                                }}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                        </div>
                      </CardFooter>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Tabs defaultValue="Timeline">
              <TabsList >
                <TabsTrigger value="Timeline">Timeline</TabsTrigger>
                <TabsTrigger value="Notes">Notes</TabsTrigger>
                <TabsTrigger value="Apt History">Apt History</TabsTrigger>
                <TabsTrigger value="Communications">Communications</TabsTrigger>
                <TabsTrigger value="Upload">Upload</TabsTrigger>
                <TabsTrigger value="Deposits">Deposits</TabsTrigger>
              </TabsList>
              <TabsContent value="Timeline">
                <Card className="overflow-hidden text-foreground rounded-lg" x-chunk="dashboard-05-chunk-4"                >
                  <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Timeline
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Snap shot on customer interactions, whether they are buying something or a sales person following up to make a sale.</span>
                        </Button>
                      </CardTitle>

                    </div>

                  </CardHeader>
                  <CardContent className="flex-grow !grow overflow-y-scroll overflow-x-clip p-6 text-sm bg-background">
                    <div className="grid gap-3 max-h-[65vh] h-auto">
                      <div className="rightbox">
                        <div className="rb-container">
                          <ul className="rb">
                            {sortedEvents.reverse().map((event, index) => (
                              <li key={index} className="rb-item grid-grid-cols-1 bg-muted-background rounded-lg px-3 py-2 ">
                                <div className="timestamp flex justify-between text-primary">
                                  <p>{event.date}</p>
                                  <p className='text-right'>{event.type}</p>
                                </div>
                                <div className="timestamp flex justify-between">
                                  <div className="item-title">{event.title}</div>
                                  {event.type === 'Communication' ? (
                                    <><p className="item-title text-right">{event.direction}</p></>
                                  ) : null}
                                </div>
                                <p>{event.userName}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t border-border   bg-muted/50  px-6 py-3">
                    <div className="text-xs text-muted-foreground">
                      Updated <time dateTime="2023-11-23">November 23, 2023</time>
                    </div>

                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="Notes">
                <Card className="overflow-hidden text-foreground rounded-lg" x-chunk="dashboard-05-chunk-4"                >
                  <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Notes
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">To leave yourself or your colleagues notes regarding the customer.</span>
                        </Button>
                      </CardTitle>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="ml-auto rounded-full"
                              onClick={() => setOpen(true)}
                            >
                              <PlusIcon className="h-4 w-4" />
                              <span className="sr-only">CC Employee</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={10} className='bg-primary'>CC Employee</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow !grow  overflow-x-clip p-6 text-sm bg-background">
                    <div className="grid gap-3 ">
                      <Card className=" flex flex-col-reverse  max-h-[50vh] h-auto overflow-y-auto">
                        <CardContent>
                          <div className="space-y-4 mt-5">

                            {financeNotes.slice().reverse().map((message, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                  message.userEmail === user.email
                                    ? "ml-auto bg-primary text-foreground"
                                    : "bg-[#262626]"
                                )}
                              >
                                <div className='grid grid-cols-1'>
                                  {message.userEmail !== user.email && (
                                    <p className='text-[#8c8c8c]'>
                                      {message.userName}
                                    </p>
                                  )}
                                  {message.body}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>

                      </Card>
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="gap-0 p-0 outline-none border-border text-foreground">
                          <DialogHeader className="px-4 pb-4 pt-5">
                            <DialogTitle>CC Employee</DialogTitle>
                            <DialogDescription>
                              Invite a user to this thread.
                            </DialogDescription>
                          </DialogHeader>
                          <Command className="overflow-hidden rounded-t-none border-t border-border bg-transparent">
                            <CommandInput placeholder="Search user..." className=' bg-muted/50  text-foreground' />
                            <CommandList>
                              <CommandEmpty>No users found.</CommandEmpty>
                              <CommandGroup className="p-2">
                                {users.map((user) => (
                                  <CommandItem
                                    key={user.email}
                                    className="flex items-center px-2"
                                    onSelect={() => {
                                      if (selectedUsers.includes(user)) {
                                        return setSelectedUsers(
                                          selectedUsers.filter(
                                            (selectedUser) => selectedUser !== user
                                          )
                                        )
                                      }

                                      return setSelectedUsers(
                                        [...users].filter((u) =>
                                          [...selectedUsers, user].includes(u)
                                        )
                                      )
                                    }}
                                  >
                                    <Avatar>
                                      <AvatarImage src={user.avatar} alt="Image" />
                                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-2">
                                      <p className="text-sm font-medium leading-none">
                                        {user.name}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {user.email}
                                      </p>
                                    </div>
                                    {selectedUsers.includes(user) ? (
                                      <CheckIcon className="ml-auto flex h-5 w-5 text-primary" />
                                    ) : null}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                          <DialogFooter className="flex items-center border-t border-border p-4 sm:justify-between">
                            {selectedUsers.length > 0 ? (
                              <div className="flex -space-x-2 overflow-hidden">
                                {selectedUsers.map((user) => (
                                  <Avatar
                                    key={user.email}
                                    className="inline-block border-2 border-background border-border"
                                  >
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Select users to add to this thread.
                              </p>
                            )}
                            <Button
                              disabled={selectedUsers.length < 2}
                              onClick={() => {
                                setOpen(false)
                              }}
                            >
                              Continue
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t border-border  bg-muted/50  px-6 py-3">

                    <fetcher.Form ref={formRef} method="post" className="flex w-full items-center space-x-2" >
                      <input type='hidden' name='financeId' defaultValue={finance.id} />
                      <input type='hidden' name='userEmail' defaultValue={user.email} />
                      <input type='hidden' name='clientfileId' defaultValue={finance.clientfileId} />
                      <input type='hidden' name='userName' defaultValue={user.name} />
                      <Input
                        id="message"
                        placeholder="Type your message..."
                        className="flex-1  bg-muted/50  border-border"
                        autoComplete="off"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        name="body"
                      />
                      <Button
                        value="saveFinanceNote"
                        type="submit"
                        name="intent"
                        size="icon"
                        onClick={() => {
                          toast.success(`Note saved`)
                        }}
                        disabled={inputLength === 0}
                        className='bg-primary '>
                        <PaperPlaneIcon className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                      </Button>

                    </fetcher.Form>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="Apt History">
                <Card className="overflow-hidden text-foreground  rounded-lg" x-chunk="dashboard-05-chunk-4"                >
                  <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Appointments
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Copy className="h-3 w-3" />

                        </Button>
                      </CardTitle>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="ml-auto rounded-full"
                              onClick={() => setOpenAppt(true)}
                            >
                              <PlusIcon className="h-4 w-4" />
                              <span className="sr-only">CC Employee</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={10} className='bg-primary'>Add Appointment</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip p-6 text-sm bg-background">
                    <div className="grid gap-3 max-h-[20vh] h-auto">
                      <div className="space-y-4 mt-5">

                        {aptFinance3.map((message, index) => {
                          const options = {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          };
                          const isValidDate = message.start && message.start !== '1969-12-31 19:00';
                          const date = new Date(message.start);
                          const formattedDateAppt = isValidDate ? date.toLocaleDateString('en-US', options) : 'TBD';
                          return (
                            <div
                              key={index}
                              className={cn("flex w-[95%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-[#262626] mx-auto")} >
                              <div className='grid grid-cols-1'>
                                <div className='flex justify-between '>
                                  {message.completed === 'yes' ? (
                                    <Badge className="text-xs bg-[#1e9b3d]" variant="secondary">
                                      Completed!
                                    </Badge>
                                  ) : (
                                    <Badge className="text-xs bg-primary" variant="secondary">
                                      Incomplete
                                    </Badge>
                                  )}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button size="icon" variant="outline" className="h-8 w-8 bg-transparent">
                                        <MoreVertical className="h-3.5 w-3.5" />
                                        <span className="sr-only">Menu</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className=' bg-blackground  text-foreground border border-border'>
                                      <Form method='post'>
                                        <DropdownMenuItem
                                          onSelect={() => {
                                            const formData = new FormData();
                                            formData.append("aptId", item.message);
                                            formData.append("userEmail", user.email);
                                            formData.append("userName", user.name);
                                            formData.append("intent", 'deleteApt');
                                            submit(formData, { method: "post" });
                                          }}>
                                          Delete
                                        </DropdownMenuItem>
                                        <input type='hidden' name='financeId' defaultValue={finance.id} />
                                      </Form>
                                      <DropdownMenuItem>Edit</DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>Trash</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>

                                </div>
                                <div className='flex justify-between mt-1'>
                                  <p className='text-muted-foreground'>{formattedDateAppt}</p>
                                  <p>{message.contactMethod}</p>
                                </div>
                                <p className='mt-1'> {message.title}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t border-border  bg-muted/50  px-6 py-3">
                    <div className="text-xs text-muted-foreground">
                      Updated <time dateTime="2023-11-23">November 23, 2023</time>
                    </div>
                  </CardFooter>
                </Card>
                <Dialog open={openAppt} onOpenChange={setOpenAppt}>
                  <DialogContent className="gap-0 p-0 outline-none border-border text-foreground">
                    <Form method='post'>
                      <DialogHeader className="px-4 pb-4 pt-5">
                        <DialogTitle>Add Appointment</DialogTitle>
                        <hr className="my-3 text-muted-foreground w-[98%] mx-auto" />

                      </DialogHeader>
                      <div className="grid gap-3 mx-3 mb-3">
                        <div className="relative mt-3">
                          <Input
                            name="title"
                            type="text"
                            className="w-full bg-background border-border "
                          />
                          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Title</label>
                        </div>
                        <div className="relative mt-3">
                          <Select name='note' defaultValue="No Answer / Left Message">
                            <SelectTrigger className="w-full  border-border  ">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className='bg-background text-foreground bg-background'>
                              <SelectGroup>
                                <SelectLabel>Message examples</SelectLabel>
                                <SelectItem value="">-- Moving Forward --</SelectItem>
                                <SelectItem value="Wants to move forward, got deposit">Wants to move forward, got deposit</SelectItem>
                                <SelectItem value="Wants to move forward, did not have credit card on him">Wants to move forward, did not have credit card on him</SelectItem>
                                <SelectItem value="Wants to get finance approval before moving forward">Wants to get approval before moving forward</SelectItem>
                                <SelectItem value="Sent BOS to sign off on">Sent BOS to sign off on deal</SelectItem>
                                <SelectItem value="Wants to come back in to view and negotiate">Wants to come back in to view and negotiate</SelectItem>

                                <SelectItem value="">-- Stand Still --</SelectItem>
                                <SelectItem value="Talked to spouse, client was not home">Talked to wife, husband was not home</SelectItem>
                                <SelectItem value="Got ahold of the client, was busy, need to call back">Got ahold of the client, was busy need to call back</SelectItem>
                                <SelectItem value="Gave pricing, need to follow up">Gave pricing, need to follow up</SelectItem>
                                <SelectItem value="Needs to discuss with spouse">Needs to discuss with spouse</SelectItem>
                                <SelectItem value="No Answer / Left Message">No Answer / Left Message</SelectItem>

                                <SelectItem value="">-- Not Moving Forward --</SelectItem>
                                <SelectItem value="Does not want to move forward right now wants me to call in the future">Does not want to move forward right now wants me to call in the future</SelectItem>
                                <SelectItem value="Bought else where, set to lost">Bought else where</SelectItem>
                                <SelectItem value="Does not want to move forward, set to lost">Does not want to move forward, set to lost</SelectItem>
                                <SelectItem value=""></SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Note Examples</label>
                        </div>
                        <div className="relative mt-3">
                          <Input
                            type="text"
                            className="w-full bg-background border-border"
                          />
                          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Or Write A Custom Note...</label>
                        </div>
                        <div className="relative mt-3">
                          <Select name='contactMethod' defaultValue="SMS">
                            <SelectTrigger className="w-full    bg-background border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className='bg-background text-foreground bg-background'>
                              <SelectGroup>
                                <SelectLabel>Contact Method</SelectLabel>
                                <SelectItem value="Phone">Phone</SelectItem>
                                <SelectItem value="In Person">In-Person</SelectItem>
                                <SelectItem value="SMS">SMS</SelectItem>
                                <SelectItem value="Email">Email</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Contact Method</label>
                        </div>
                        <div className="relative mt-3">
                          <Select name='resourceId' defaultValue="1">
                            <SelectTrigger className="w-full    bg-background border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className='bg-background text-foreground bg-background'>
                              <SelectGroup>
                                <SelectLabel>Type of Appointment</SelectLabel>
                                <SelectItem value="1">Sales Calls</SelectItem>
                                <SelectItem value="2">Sales Appointments</SelectItem>
                                <SelectItem value="3">Deliveries</SelectItem>
                                <SelectItem value="4">F & I Appointments</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Type of Appointment</label>
                        </div>
                        <div className="relative mt-3">
                          <Select name='resultOfcall' defaultValue="Attempted">
                            <SelectTrigger className="w-full  focus:border-primary  bg-background border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className='bg-background text-foreground bg-background'>
                              <SelectGroup>
                                <SelectLabel>Result of call</SelectLabel>
                                <SelectItem value="Reached">Reached</SelectItem>
                                <SelectItem value="N/A">N/A</SelectItem>
                                <SelectItem value="Attempted">Left Message</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Result of call</label>
                        </div>
                        <div className="relative mt-3">
                          <Select name='direction' defaultValue="Outgoing">
                            <SelectTrigger className="w-full  focus:border-primary  bg-background border-border">
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent className='bg-background text-foreground bg-background'>
                              <SelectGroup>
                                <SelectLabel>Direction of call</SelectLabel>
                                <SelectItem value="Incoming">Incoming</SelectItem>
                                <SelectItem value="Outgoing">Outgoing</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Direction of call</label>
                        </div>
                        <div className=' flex-col mx-auto justify-center'>
                          <div className="mx-auto w-[280px] rounded-md border-white bg-background px-3 text-foreground " >
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] px-4 text-foreground mx-auto  h-[55px] font-normal bg-transparent hover:bg-transparent hover:text-primary border-border",
                                    !date && " text-foreground"
                                  )}
                                >
                                  <div className=' text-foreground  mx-auto flex justify-center  '>
                                    <CalendarIcon className="mr-2 size-8 " />
                                    {date ? format(date, "PPP") : <span>{format(newDate, "PPP")}</span>}
                                  </div>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[275px] bg-muted/40 p-0 text-foreground border-border" align="start">
                                <div className='align-center my-3 flex justify-center   '>
                                  <SmallCalendar
                                    className='mx-auto w-auto   bg-background text-foreground'
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <div className=' flex-col mx-auto justify-center' >
                          <div className="mx-auto w-[280px] rounded-md border-white bg-background px-3 text-foreground " >

                            <input type='hidden' value={String(date)} name='value' />
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] px-4 text-foreground mx-auto  h-[55px] font-normal bg-transparent hover:bg-transparent hover:text-primary border-border",
                                    !date && " text-foreground"
                                  )}
                                >
                                  <div className=' text-foreground  mx-auto flex justify-center  '>
                                    <ClockIcon className="mr-2 size-8 " />
                                    {currentTime ? (time) : <span>Pick a Time</span>}
                                  </div>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[275px] bg-muted/40 p-0 text-foreground border-border" align="start">
                                <div className='align-center my-3 flex justify-center   '>
                                  <Select name='pickHour'  >
                                    <SelectTrigger className="m-3 w-auto mx-auto bg-transparent hover:bg-transparent hover:text-primary border-border" >
                                      <SelectValue defaultValue='09' />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white text-black' >
                                      <SelectGroup>
                                        <SelectLabel>Hour</SelectLabel>
                                        <SelectItem value="09">09</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="11">11</SelectItem>
                                        <SelectItem value="12">12</SelectItem>
                                        <SelectItem value="13">13</SelectItem>
                                        <SelectItem value="14">14</SelectItem>
                                        <SelectItem value="15">15</SelectItem>
                                        <SelectItem value="16">16</SelectItem>
                                        <SelectItem value="17">17</SelectItem>
                                        <SelectItem value="18">18</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  <Select name='pickMin'   >
                                    <SelectTrigger className="m-3 w-auto" >
                                      <SelectValue defaultValue='10' />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white text-black'  >
                                      <SelectGroup>
                                        <SelectLabel>Minute</SelectLabel>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="30">30</SelectItem>
                                        <SelectItem value="40">40</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </div>
                      <input type='hidden' name='phone' defaultValue={finance.phone} />
                      <input type='hidden' name='email' defaultValue={finance.email} />
                      <input type='hidden' name='lastName' defaultValue={finance.lastName} />
                      <input type='hidden' name='firstName' defaultValue={finance.firstName} />
                      <input type='hidden' name='brand' defaultValue={finance.brand} />
                      <input type='hidden' name='unit' defaultValue={finance.model} />
                      <input type='hidden' name='brand' defaultValue={finance.brand} />
                      <input type='hidden' name='financeId' defaultValue={finance.id} />
                      <input type='hidden' name='userId' defaultValue={user.id} />
                      <input type='hidden' name='apptType' defaultValue='sales' />
                      <input type='hidden' name='min' defaultValue={minForm} />
                      <input type='hidden' name='hour' defaultValue={hourForm} />
                      <DialogFooter className=" border-t border-border p-4  ">
                        <div className='flex justify-center' >
                          <Button
                            size='sm'
                            value="addAppt"
                            type="submit"
                            name="intent"
                            onClick={() => {
                              toast.success(`Appointment Added!`)
                            }}
                            className='bg-primary ml-auto  mr-auto'>
                            Add Appointment
                            <PaperPlaneIcon className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </DialogFooter>
                    </Form>

                  </DialogContent>
                </Dialog>
              </TabsContent>
              <TabsContent value="Communications">
                <Card className=" text-foreground  rounded-lg" x-chunk="dashboard-05-chunk-4"                >
                  <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Communications
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </CardTitle>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="ml-auto rounded-full"
                              onClick={() => setOpenComms(true)}
                            >
                              <PlusIcon className="h-4 w-4" />
                              <span className="sr-only">Add Communication</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={10} className='bg-primary'>Add Communication</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow !grow overflow-y-auto overflow-x-clip p-6 text-sm bg-background">
                    <div className="grid gap-3 max-h-[40vh] h-auto">
                      <div className="space-y-4 mt-5">

                        {Coms.map((message, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex  max-w-[75%]   w-[65%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                              message.direction === 'Outgoing'
                                ? "ml-auto bg-primary text-foreground"
                                : "bg-[#262626]"
                            )}
                          >
                            <div className='grid grid-cols-1'>
                              <div className='flex justify-between'>
                                <p>{message.direction}</p>
                                <p className='text-right'>{message.type}</p>
                              </div>
                              <div className='flex justify-between'>
                                <p>{message.result}</p>
                                {message.userEmail === 'Outgoing' && (
                                  <p className='text-[#8c8c8c] text-right'>
                                    {message.userName}
                                  </p>
                                )}
                              </div>
                              <p className='text-[#8c8c8c]'>
                                {message.createdAt}
                              </p>
                              <p>{message.subject}</p>
                              <p>{message.body}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                    <Dialog open={openComms} onOpenChange={setOpenComms}>
                      <DialogContent className="gap-0 p-0 outline-none border-border text-foreground">
                        <Form method='post'>
                          <DialogHeader className="px-4 pb-4 pt-5">
                            <DialogTitle>Add Communication</DialogTitle>
                          </DialogHeader>
                          <hr className="my-3 text-muted-foreground w-[98%] mx-auto" />
                          <div className="grid gap-3 mx-3 mb-3">
                            <div className="relative mt-3">
                              <Input
                                id="title"
                                type="text"
                                className="w-full bg-background border-border "
                              />
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Title</label>
                            </div>
                            <div className="relative mt-3">
                              <Select name='note' defaultValue="Gave pricing, need to follow up">
                                <SelectTrigger className="w-full  border-border  ">
                                  <SelectValue placeholder="Message examples" />
                                </SelectTrigger>
                                <SelectContent className='bg-background text-foreground bg-background'>
                                  <SelectGroup>
                                    <SelectLabel>Message examples</SelectLabel>
                                    <SelectItem value="">-- Moving Forward --</SelectItem>
                                    <SelectItem value="Wants to move forward, got deposit">Wants to move forward, got deposit</SelectItem>
                                    <SelectItem value="Wants to move forward, did not have credit card on him">Wants to move forward, did not have credit card on him</SelectItem>
                                    <SelectItem value="Wants to get finance approval before moving forward">Wants to get approval before moving forward</SelectItem>
                                    <SelectItem value="Sent BOS to sign off on">Sent BOS to sign off on deal</SelectItem>
                                    <SelectItem value="Wants to come back in to view and negotiate">Wants to come back in to view and negotiate</SelectItem>

                                    <SelectItem value="">-- Stand Still --</SelectItem>
                                    <SelectItem value="Talked to spouse, client was not home">Talked to wife, husband was not home</SelectItem>
                                    <SelectItem value="Got ahold of the client, was busy, need to call back">Got ahold of the client, was busy need to call back</SelectItem>
                                    <SelectItem value="Gave pricing, need to follow up">Gave pricing, need to follow up</SelectItem>
                                    <SelectItem value="Needs to discuss with spouse">Needs to discuss with spouse</SelectItem>
                                    <SelectItem value="No Answer / Left Message">No Answer / Left Message</SelectItem>

                                    <SelectItem value="">-- Not Moving Forward --</SelectItem>
                                    <SelectItem value="Does not want to move forward right now wants me to call in the future">Does not want to move forward right now wants me to call in the future</SelectItem>
                                    <SelectItem value="Bought else where, set to lost">Bought else where</SelectItem>
                                    <SelectItem value="Does not want to move forward, set to lost">Does not want to move forward, set to lost</SelectItem>
                                    <SelectItem value=""></SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Note Examples</label>
                            </div>
                            <div className="relative mt-3">
                              <Input
                                id="name"
                                type="text"

                                className="w-full bg-background border-border  "
                              />
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Or Write A Custom Note...</label>
                            </div>
                            <div className="relative mt-3">
                              <Select name='contactMethod' defaultValue="Phone">
                                <SelectTrigger className="w-full    bg-background border-border">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className='bg-background text-foreground bg-background'>
                                  <SelectGroup>
                                    <SelectLabel>Contact Method</SelectLabel>
                                    <SelectItem value="Phone">Phone</SelectItem>
                                    <SelectItem value="In Person">In-Person</SelectItem>
                                    <SelectItem value="SMS">SMS</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Contact Method</label>
                            </div>
                            <div className="relative mt-3">
                              <Select name='resultOfcall' defaultValue="Reached">
                                <SelectTrigger className="w-full  focus:border-primary  bg-background border-border">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className='bg-background text-foreground bg-background'>
                                  <SelectGroup>
                                    <SelectLabel>Result of call</SelectLabel>
                                    <SelectItem value="Reached">Reached</SelectItem>
                                    <SelectItem value="N/A">N/A</SelectItem>
                                    <SelectItem value="Attempted">Left Message</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Rescheduled">Rescheduled</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Result of call</label>
                            </div>
                            <div className="relative mt-3">
                              <Select name='direction' defaultValue="Incoming">
                                <SelectTrigger className="w-full  focus:border-primary  bg-background border-border">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className='bg-background text-foreground bg-background'>
                                  <SelectGroup>
                                    <SelectLabel>Direction of call</SelectLabel>
                                    <SelectItem value="Incoming">Incoming</SelectItem>
                                    <SelectItem value="Outgoing">Outgoing</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Direction of call</label>
                            </div>

                          </div>
                          <DialogFooter className="flex items-center border-t border-border p-4 sm:justify-between">
                            <input type='hidden' name='financeId' defaultValue={finance.id} />
                            <input type='hidden' name='userId' defaultValue={user.id} />

                            <Button
                              value="addComms"
                              type="submit"
                              name="intent"
                              onClick={() => {
                                toast.success(`Communication Added!`)
                              }}
                              className='bg-primary ml-auto '>
                              Add Communication
                              <PaperPlaneIcon className=" ml-2 h-4 w-4" />
                            </Button>
                          </DialogFooter>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t border-border bg-muted/50  px-6 py-3">
                    <div className="text-xs text-muted/50">
                      Updated <time dateTime="2023-11-23">November 23, 2023</time>
                    </div>

                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="Upload">
                <Card
                  className="overflow-hidden text-foreground  rounded-lg" x-chunk="dashboard-05-chunk-4"
                >
                  <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Docs
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Upload customer docs such as contracts, warranties, etc.</span>
                        </Button>
                      </CardTitle>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <Button onClick={() => navigate('/dealer/document/builder')} size="sm" variant="outline" className="h-8 gap-1">
                        <File className="h-3.5 w-3.5" />
                        <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                          Document Builder
                        </span>
                      </Button>

                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow !grow max-h-[700px] h-[700px] overflow-y-scroll overflow-x-clip p-6 text-sm bg-background">
                    <div className="parent-container">
                      <MyIFrameComponent />
                    </div>
                    <div className="grid gap-3 max-h-[20vh] h-auto">
                      {/*<Form method='post' className='flex items-center'>
                        <div className="relative mt-5">
                          <Input id="file" type="file" className='border-border button:border-border rounded-md text-foreground bg-background button:text-foreground  button:bg-background px-2 ' name='document' />
                          <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">File Upload</label>
                        </div>
                        <input type='hidden' name='intent' value='' />
                        <Button
                          value="uploadFile"
                          type="submit"
                          name="intent"
                          size="icon"
                          onClick={() => {
                            toast.success(`File uploaded!`)
                          }}
                          disabled={inputLength === 0}
                          className='bg-primary ml-2'>
                          <UploadIcon className="h-4 w-4" />
                          <span className="sr-only">Upload</span>
                        </Button>
                        </Form>
                      <hr className="my-3 text-muted-foreground w-[98%] mx-auto" />
                      <div className="font-semibold">Download Docs</div>
                      <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Drivers Lic</span>
                          <Button size="sm" variant="outline" className="h-8 gap-1 mr-3"  >
                            <File className="h-3.5 w-3.5" />
                            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                              Print
                            </span>
                          </Button>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Test Drive Form</span>
                          <Button size="sm" variant="outline" className="h-8 gap-1 mr-3" >
                            <File className="h-3.5 w-3.5" />
                            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                              Print
                            </span>
                          </Button>
                        </li>
                      </ul>
                      */}
                    </div>
                    <hr className=' text-muted-foreground w-98 mx-auto] my-5' />
                    <CustomerGen />
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t  bg-muted/50  px-6 py-3">
                    <div className="text-xs text-muted-foreground">
                      Updated <time dateTime="2023-11-23">November 23, 2023</time>
                    </div>
                    <Pagination className="ml-auto mr-0 w-auto">
                      <PaginationContent>
                        <PaginationItem>
                          <Button size="icon" variant="outline" className="h-6 w-6">
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <span className="sr-only">Previous Order</span>
                          </Button>
                        </PaginationItem>
                        <PaginationItem>
                          <Button size="icon" variant="outline" className="h-6 w-6">
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="sr-only">Next Order</span>
                          </Button>
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="Deposits">
                <Card className="overflow-hidden text-foreground rounded-lg" x-chunk="dashboard-05-chunk-4"                >
                  <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Deposits
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow !grow  overflow-x-clip p-6 text-sm bg-background">
                    <div>
                      <ul className="grid gap-3">
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>${financeSubTotal}</span>
                        </li>
                        {finance.discount !== 0 && (
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Discount</span>
                            <span>{finance.discount}</span>
                          </li>
                        )}
                        {finance.discount !== 0 && (
                          <li className="flex items-center justify-between">
                            <span className="text-muted-foreground">Discount</span>
                            <span>{finance.discount}</span>
                          </li>
                        )}
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span>{deFees.userTax}%</span>
                        </li>
                        <li className="flex items-center justify-between font-semibold">
                          <span className="text-muted-foreground">Total</span>
                          <span>${financeTotal}</span>
                        </li>
                      </ul>
                    </div>
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
                      <ul className="grid gap-3 mt-3">
                        {finance.Payments && finance.Payments.map((result, index) => (
                          <li className="flex items-center justify-between" key={index}                    >
                            <span className="text-muted-foreground">{result.paymentType}</span>
                            <span>${result.amountPaid}</span>
                          </li>
                        ))}
                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Balance </span>
                          <span>${Number(financeTotal).toFixed(2) - Number(totalAmountPaidFinance).toFixed(2)}</span>

                        </li>
                        {parseFloat(total) - parseFloat(totalAmountPaid) === 0 && (
                          <input type='hidden' name='status' value='Fulfilled' />
                        )}


                      </ul>
                      {paymentType !== '' && (
                        <div className='mx-auto'>
                          <fetcher.Form ref={formRef} method="post" className="flex w-full items-center space-x-2 mt-3 mx-auto" >
                            <input type='hidden' name='financeId' defaultValue={finance.id} />
                            <input type='hidden' name='userEmail' defaultValue={user.email} />
                            <input type='hidden' name='paymentType' value={paymentType} />
                            <div className="relative mt-4">
                              <Input
                                name='cardNum'
                                className=''

                              />
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Card #</label>
                            </div>


                            <div className="relative mt-4">
                              <Input
                                name='receiptId'
                                className=' '
                              />
                              <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-muted-foreground peer-focus:-top-3 peer-focus:text-muted-foreground">Receipt Number</label>
                            </div>


                            <div className="relative ml-auto flex-1 md:grow-0 mt-4 ">
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                name='amountPaid'
                                className='text-right pr-9 w-[150px] '
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                              />

                              <Button
                                value="createFinancePayment"
                                type="submit"
                                name="intent"
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
                          </fetcher.Form>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t border-border  bg-muted/50  px-6 py-3">
                    <p className='text-muted-foreground'> {finance.updatedAt}</p>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="Phone">
              </TabsContent>
              <TabsContent value="SMS">
                <Card className=""    >
                  <CardHeader className="flex flex-row items-start bg-muted/50">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        SMS
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-5 ">
                    <div className=" ">
                      <TextFunction
                        customerMessages={customerMessages}
                        customer={customer}
                        data={data}
                        user={user}
                        smsDetails={smsDetails}
                        latestNote={latestNote}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className=" ">
                  </CardFooter>
                </Card>

              </TabsContent>
              <TabsContent value="Email">
                <Card className="overflow-x-clip text-foreground rounded-lg  w-[95%] max-w-[600px]" x-chunk="dashboard-05-chunk-4"                >
                  <CardHeader className="flex flex-row items-start  bg-muted/50 ">
                    <div className="grid gap-0.5">
                      <CardTitle className="group flex items-center gap-2 text-lg">
                        Email
                      </CardTitle>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="ml-auto rounded-full"
                              onClick={() => setOpen(true)}
                            >
                              <PlusIcon className="h-4 w-4" />
                              <span className="sr-only">CC Employee</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent sideOffset={10} className='bg-primary'>CC Employee</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardHeader>
                  <CardContent className=" p-6 text-sm bg-background ">
                    <div className="grid gap-3 ">
                      <MyIFrameComponentEmail />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-row items-center border-t border-border  bg-muted/50  px-6 py-3">
                  </CardFooter>
                </Card>

              </TabsContent>
              <TabsList className='mt-2'>
                <TabsTrigger value="Phone">Phone</TabsTrigger>
                <TabsTrigger value="SMS">SMS</TabsTrigger>
                <TabsTrigger value="Email">Email</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </main >
      </div >
      {lockData && (
        <AlertDialog key={key} open={openResponse} onOpenChange={setOpenResponse}>
          <AlertDialogContent className='border border-border bg-background text-foreground'>
            <AlertDialogHeader>
              <AlertDialogTitle>Client Turnover</AlertDialogTitle>
              <AlertDialogDescription>
                <p>{lockData.financeEmail} will see your client shortly.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <div className="flex justify-end gap-[25px]">

                <ButtonLoading
                  size="sm"
                  className="w-auto cursor-pointer ml-auto mt-5 hover:text-primary"
                  type="submit"
                  isSubmitting={isSubmitting}
                  onClick={() => {
                    HandleButtonClick()
                    toast.success(`Claimed next customer...`)
                  }}
                  loadingText="Updating client info..."
                >
                  Claim
                </ButtonLoading>

              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
      }
    </div >
  )
}
/** <Separator className="my-4" />
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
                            {showOrder.Payments && showOrder.Payments.map((result, index) => (
                              <li className="flex items-center justify-between mt-4" key={index}                    >
                                <span className="text-muted-foreground">{result.paymentType}</span>
                                <span>${result.amountPaid}</span>
                              </li>
                            ))}
                            <li className="flex items-center justify-between mt-4 mb-4">
                              <span className="text-muted-foreground">Balance</span>
                              <span>${parseFloat(pacTotal) - parseFloat(totalAmountPaid)}</span>

                            </li>
                            {parseFloat(pacTotal) - parseFloat(totalAmountPaid) === 0 && (
                              <input type='hidden' name='status' value='Fulfilled' />
                            )}
                            {paymentType !== '' && (
                              <>
                                <li className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Amount to be charged on {paymentType}</span>
                                  <payment.Form method="post" ref={formRef} >
                                    <input type='hidden' name='accOrderId' value={showOrder.id} />
                                    <input type='hidden' name='paymentType' value={paymentType} />
                                    <input type='hidden' name='intent' value='createPayment' />
                                    <input type='hidden' name='total' value={pacTotal} />
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
                        </div> */
export const action: ActionFunction = async ({ req, request, params }) => {
  const formPayload = Object.fromEntries(await request.formData());
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const user = await GetUser(email)
  if (!user) { redirect('/login') }
  let formData = financeFormSchema.parse(formPayload)
  const intent = formData.intent
  const idSession = await getIds(request.headers.get("Cookie"));
  const userId = idSession.get('userId')
  const clientfileId = idSession.get('clientfileId')
  const financeId = idSession.get('financeId')
  const dashboardId = idSession.get('dashboardId')
  if (intent === 'assignUnit') {
    const update = await prisma.inventoryMotorcycle.update({
      where: { id: formData.id },
      data: {
        financeId: formData.financeId,
        sold: true,
        status: 'Reserved',
      }
    })
    const finance = await prisma.finance.update({
      where: { id: formData.financeId },
      data: {
        stockNum: formPayload.stockNum,
        year: formPayload.year,
        brand: formPayload.brand,
        model: formPayload.model,
        mileage: formPayload.mileage,
        color: formPayload.color,
        model1: formPayload.model1,
        msrp: formPayload.msrp,
        vin: formPayload.vin,
        model1: formPayload.model1,
        inventoryMotorcycleId: formData.id
      }
    })
    return json({ update, finance })
  }
  if (intent === 'pushSubtotal') {
    const finance = await prisma.finance.findUnique({ where: { id: formData.financeId } })
    const subTotal = parseFloat(finance.accessories + formPayload.subTotal).toFixed(2)
    const update = await prisma.finance.update({ where: { id: formData.financeId }, data: { accessories: Number(subTotal) } })
    return json({ update })
  }
  if (intent === 'createFinancePayment') {
    const payments = await prisma.payment.create({
      data: {
        financeId: formData.financeId,
        userEmail: user.email,
        paymentType: formData.paymentType,
        cardNum: formData.cardNum,
        receiptId: formData.receitId,
        amountPaid: parseFloat(formPayload.amountPaid),
      }
    })
    return json({ payments })
  }
  if (intent === 'createAccQuote') {
    const create = await prisma.accOrder.create({
      data: {
        financeId: formData.financeId,
        userEmail: formData.userEmail,
        userName: formData.userName,
        dept: 'Sales',
        status: 'Quote',
        clientfileId: formData.clientfileId,
      }
    })
    return redirect(`/dealer/accessories/newOrder/${create.id}`)
  }
  if (intent === "claimAccOrder") {
    const sendtoacc = await prisma.accOrder.update({
      where: { id: formData.orderId },
      data: { financeId: formData.financeId }
    });
    return json({ sendtoacc })
  }
  if (intent === "sendToParts") {
    const sendtoacc = await prisma.accHandoff.create({
      data: {
        sendTo: 'Parts',
        handOffTime: formPayload.handOffTime,
        sendToCompleted: 'false',
        AccOrderId: formPayload.AccOrderId,
        handOffDept: 'Sales'
      }
    });
    return json({ sendtoacc })
  }
  if (intent === "sendToAcc") {
    const sendtoacc = await prisma.accHandoff.create({
      data: {
        sendTo: 'Accessories',
        handOffTime: formPayload.handOffTime,
        sendToCompleted: 'false',
        AccOrderId: formPayload.AccOrderId,
        handOffDept: 'Sales'

      }
    });
    return json({ sendtoacc })
  }
  if (intent === "syncAccOrder") {
    await prisma.customerSync.update({
      where: { userEmail: email },
      data: { orderId: formPayload.orderId }
    });
    return redirect('/dealer/accessories/currentOrder')
  }
  if (intent === 'changeFinance') {
    console.log('formdata', formData)
    const update = await prisma.finance.update({
      where: { id: formData.financeId },
      data: {
        financeManagerName: formData.financeManagerName,
        financeManager: formData.financeManager,
      }
    })
    return json({ update })
  }
  if (intent === 'changeSales') {
    console.log('formdata', formData)
    const update = await prisma.finance.update({
      where: { id: formData.financeId },
      data: {
        userEmail: formData.userEmail,
        userName: formData.userName,
      }
    })
    return json({ update })
  }
  if (intent === 'clientTurnover') {

    const create = await prisma.lockFinanceTerminals.create({
      data: {
        locked: true,
        financeId: formData.financeId,
        salesEmail: user.email,
        customerName: formData.customerName,
        unit: formData.unit,
        response: false,

      }
    })
    return json({ create })
  }
  if (intent === 'responseClientTurnover') {

    const update = await prisma.lockFinanceTerminals.update({
      where: { id: formData.claimId, },
      data: {
        response: true,
      },
    });
    return update
  }
  if (intent === 'email') {
    const finance = await prisma.finance.findUnique({ where: { id: formData.financeId } })

    const model = finance?.model || '';
    const modelData = formData.modelData
    const value = formData.template
    let data;
    if (value.startsWith("customEmailDropdown")) {
      const prefix = "customEmailDropdown";
      const id = value.slice(prefix.length);
      const emailDrop = await prisma.emailTemplatesForDropdown.findUnique({
        where: { id: id },
      });
      console.log(value, emailDrop, 'hitd')

      data = await resend.emails.send({
        from: "Sales <sales@resend.dev>",
        reply_to: user?.email,
        to: [`${finance?.email}`],
        subject: emailDrop.subject || '',
        react: <CustomBody body={emailDrop.body} user={user} />
      });

    } else {
      console.log('hitemail')
      data = await resend.emails.send({
        from: "Sales <sales@resend.dev>",
        reply_to: user?.email,
        to: [`${finance?.email}`],
        subject: `${finance?.brand} ${model} model information.`,
        react: <PaymentCalculatorEmail user={user} finance={finance} modelData={modelData} formData={formData} />
      });
    }
    await prisma.previousComms.create({
      data: {
        financeId: finance.financeId,
        body: formData.body || 'Templated Email',
        userName: user.name,
        type: 'Email',
        customerEmail: finance.email,
        direction: 'Outgoing',
        subject: `${finance?.brand} ${model} model information.`,
        result: 'Attempted',
        userEmail: user.email,
        dept: 'Sales',
      }
    })
    return json({ data })
  }
  if (intent === 'createOrder') {
    let partNumbers = formData["partNumbers[]"];

    //(formData)
    try {
      // Create the PartsOrder first
      let partsOrder = await prisma.partsOrder.create({
        data: {
          userId: userId,
          clientfileId: clientfileId,
        },
      });

      // Then create a PartsOrderDetail for each part number
      for (let partNumber of partNumbers) {
        await prisma.partsOrderDetail.create({
          data: {
            orderNumber: partsOrder.orderNumber,
            partNumber,
          },
        });
      }

      return partsOrder
    } catch (error) {
      console.error(error);
      // Handle the error appropriately here
    } finally {
      // this code runs whether an error occurred or not
    }
  }
  if (intent === 'uploadFile') {
    // makwe new record save file name and finance to get it later or display it in a list forr people to downlaod
    /** const handler = unstable_createFileUploadHandler({
       directory: `${process.cwd()}/public/uploads`,
       file: ({ filename }) => filename,
       maxFileSize: 50_000_000
     });

     const formData = await unstable_parseMultipartFormData(request, handler);
     const file = formData.get("file") as File;
     const uploadedDocs = await prisma.uploadDocs.create({
       data: {
         userId: userId,
         category: formData.category,
         financeId: financeId,
         fileName: file.name,
       }
     })
     return {

       url: `/uploads/${file.name}`,
       size: file.size,
       name: file.name
     }; */
  }
  if (intent === 'deleteCustomer') {
    await DeleteCustomer({ formData, formPayload })
    return DeleteCustomer
  }
  // appointment
  if (intent === 'updateFinanceAppt') {
    const apptId = formData.apptId
    const updateApt = await UpdateAppt(formData, apptId)
    if (user?.activixActivated === 'yes') {
      await UpdateTask(formData)
    }
    return json({ updateApt });
  }
  if (intent === 'addAppt') {
    console.log(formData, formPayload, 'formData')

    const initialDate = new Date(formData.value);
    const hour = parseInt(formPayload.hour, 10);
    const minute = parseInt(formPayload.min, 10);
    initialDate.setUTCHours(hour);
    initialDate.setUTCMinutes(minute);
    const updatedDateString = initialDate.toISOString();

    const createApt = await prisma.clientApts.create({
      data: {
        phone: formData.phone,
        email: formData.email,
        lastName: formData.lastName,
        firstName: formData.firstName,
        brand: formData.brand,
        unit: formData.unit,
        note: formData.note,
        apptType: formData.apptType,
        apptStatus: formData.apptStatus,
        completed: 'no',
        contactMethod: formData.contactMethod,
        //   end: formData.end,
        title: formData.title,
        start: updatedDateString,
        userId: user?.id,
        resourceId: Number(formData.resourceId),
        userName: user?.name,
        financeId: formData.financeId,
        direction: formData.direction,
        resultOfcall: formData.resultOfcall,
      }
    })


    return (createApt)
  }
  if (intent === 'addComms') {
    const comdata = {
      financeId: formData.financeId,
      userId: formData.userId,
      content: formData.note,
      title: formData.title,
      direction: formData.direction,
      result: formData.resultOfcall,
      subject: formData.messageContent,
      userEmail: user.email,
      type: formData.apptType,
      userName: user?.name,
      date: new Date().toISOString(),
    }
    const setComs = await prisma.communicationsOverview.create({
      data: comdata,
    });


    return (setComs)
  }
  if (intent === 'deleteApt') {
    const newFormData = { ...formData };
    delete newFormData.intent;
    const deleteNote = await prisma.clientApts.create({
      where: {
        id: formData.financeId
      }
    })

    return json({ deleteNote });
  }
  if (intent === 'completeApt') {
    let customerState = formData.customerState
    if (customerState === 'Pending') { customerState = 'Attempted' }
    const completed = 'yes'
    const apptStatus = 'completed'
    const apptId = formData.messageId
    formData = { ...formData, completed, apptStatus, customerState }
    const updateApt = await UpdateAppt(formData, apptId)
    const userIntegration = await prisma.userIntergration.findUnique({
      where: { userEmail: user?.email }
    })
    const activixActivated = userIntegration.activixActivated
    if (activixActivated === 'yes') {
      await UpdateTask(formData)
    }
    if (user?.activixActivated === 'yes') {
      await UpdateNote(formData)
    }
    return json({ updateApt });
  }
  // notes
  if (intent === 'updateFinanceNote') {
    const noteId = formData.id
    const noteData = {
      author: formData.author,
      customerId: formData.customerId,
      customContent: formData.customContent,
      urgentFinanceNote: formData.urgentFinanceNote,
      financeId: formData.financeId,
      dept: formData.dept,

    }

    const updateNote = await updateFinanceNote(noteId, noteData)
    if (user?.activixActivated === 'yes') {
      await UpdateNote(formData)
    }
    return json({ updateNote });
  }
  if (intent === 'saveFinanceNote') {
    //  await SaveFinanceNote({ formData, })
    const SaveFinanceNote = await prisma.financeNote.create({
      data: {
        body: formData.body,
        userEmail: formData.userEmail,
        clientfileId: formData.clientfileId,
        userName: formData.userName,
        finance: {
          connect: { id: formData.financeId }
        }
      },
    });
    const notiFinance = await prisma.finance.findUnique({ where: { id: formData.financeId }, });
    let notification;
    if (formData.userEmail !== notiFinance.userEmail) {
      notification = await prisma.notificationsUser.create({
        data: {
          title: `Note left on ${notiFinance?.name} by ${user?.username}`,
          //  content: formData.content,
          read: false,
          type: 'updates',
          content: formData.customContent,
          userEmail: formData.userEmail,
          financeId: formData.financeId,
          clientfileId: formData.clientfileId,
        },
      });
    }
    let saved
    if (formData.ccUser) {
      saved = await prisma.notificationsUser.create({
        data: {
          title: `New note on ${formData.name}'s file.`,
          content: `Note left by ${formData.author}`,
          read: false,
          type: 'updates',
          userEmail: formData.ccUser,
          financeId: financeId,
          clientfileId: clientfileId,
        }
      })
    }
    return json({ SaveFinanceNote, })
  }
  if (intent === 'deleteFinanceNote') {
    const id = formData.id
    const deleteNote = await deleteFinanceNote(id)
    return json({ deleteNote });
  }
  // wanted unit
  if (intent === 'updateFinance') {

    let brand = formPayload.brand
    let customerState = formData.customerState
    if (formData.customerState === 'Pending') {
      customerState = 'Pending'
    }
    if (formData.customerState === 'Attempted') {
      customerState = 'Attempted'
    }
    if (formData.customerState === 'Reached') {
      customerState = 'Reached'
    }
    if (formData.customerState === 'Lost') {
      customerState = 'Lost'
    }
    if (formData.sold === 'on') {
      customerState = 'sold'
    }
    if (formData.depositMade === 'on') {
      customerState = 'depositMade'
    }
    if (formData.turnOver === 'on') {
      customerState = 'turnOver'
    }
    if (formData.financeApp === 'on') {
      customerState = 'financeApp'
    }
    if (formData.approved === 'on') {
      customerState = 'approved'
    }
    if (formData.signed === 'on') {
      customerState = 'signed'
    }
    if (formData.pickUpSet === 'on') {
      customerState = 'pickUpSet'
    }
    if (formData.delivered === 'on') {
      customerState = 'delivered'
    }
    if (formData.refund === 'on') {
      customerState = 'refund'
    }
    if (formData.funded === 'on') {
      customerState = 'funded'
    }
    let pickUpDate = ''
    let lastContact = new Date().toISOString()
    const typeOfContact = formData.typeOfContact
    const timeToContact = formData.timeToContact
    const financeId = formData.financeId
    const userEmail = formData.userEmail
    brand = formData.brand

    delete formData.financeId
    delete formData.timeToContact
    delete formData.typeOfContact
    delete formData.userEmail
    delete formData.brand
    delete formData.intent
    delete formData.state


    const finance = {

      userEmail: user?.email,
      pickUpDate,
      lastContact
    }
    const financeData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postal: formData.postal,
      province: formData.province,
      dl: formData.dl,
      customerState: customerState,

    }
    const clientData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postal: formData.postal,
      province: formData.province,
      dl: formData.dl,
    }
    delete clientData.financeId
    delete financeData.financeId
    switch (brand) {
      case "Manitou":
        const updatingManitouFinance = await updateFinanceWithDashboard(financeId, financeData, finance);
        return json({ updatingManitouFinance });
      case "Switch":
        const updatingSwitchFinance = await updateFinanceWithDashboard(financeId, financeData, finance);
        return json({ updatingSwitchFinance });
      case "BMW-Motorrad":
        const updatingBMWMotoFinance = await updateFinanceWithDashboard(financeId, financeData, finance);
        return json({ updatingBMWMotoFinance });
      default:

        const updateClient = await updateFinanceWithDashboard(financeId, financeData, finance)
        if (user?.activixActivated === 'yes') {
          await UpdateLeadApiOnly(formData, user)
          await UpdateLeademail(formData)
          await UpdateLeadPhone(formData)
          await UpdateLeadWantedVeh(formData)
          await UpdateLeadEchangeVeh(formData)
        }
        return json({ updateClient })
    }
  }
  // update wanted unit
  if (intent === 'updateFinanceWanted') {
    console.log(formData, 'upding wanted unit')
    const finance = await prisma.finance.update({
      where: { id: formData.financeId },
      data: {
        mileage: formData.mileage,
        freight: formData.freight,
        admin: formData.admin,
        commodity: formData.commodity,
        pdi: formData.pdi,
        paintPrem: formData.paintPrem,
        licensing: formData.licensing,
        stockNum: formData.stockNum,
        year: formData.year,
        brand: formData.make,
        model: formData.model,
        model1: formData.model1,
        color: formData.color,
        modelCode: formData.modelCode,
        msrp: formData.msrp,
        trim: formData.trim,
        vin: formData.vin,
        //bikeStatus: formData.bikeStatus,
        location: formData.location,
        //modelName: formData.modelName,
        //expectedOn: formData.expectedOn,
        //orderStatus: formData.orderStatus,
        //age: formData.age,
        //isNew: formData.isNew,
        //keyNumber: formData.keyNumber,
        //onOrder: formData.onOrder,
        // stocked: formData.stocked,
        invId: formData.invId,
        //   isNew: formData.isNew,
        userName: user.username,
      }
    })
    //const userIntegration = await prisma.userIntergration.findUnique({      where: { userEmail: user?.email }    })
    // const activixActivated = userIntegration.activixActivated
    // if (activixActivated === 'yes') {      await UpdateLeadWantedVeh(formData)    }
    return json({ finance })
  }
  if (intent === 'dealProgress') {
    const currentDate = new Date().toISOString();

    const date = new Date();
    let sold;
    let referral;
    let visited;
    let bookedApt;
    let aptShowed;
    let aptNoShowed;
    let testDrive;
    let metService;
    let metManager;
    let metParts;
    let depositMade;
    let refund;
    let turnOver;
    let financeApp;
    let approved;
    let signed;
    let pickUpSet;
    let demoed;
    let delivered;
    let deliveredDate;
    let docsSigned;
    let funded;
    let seenTrade;
    let financeApplication;
    let metSalesperson;
    let metFinance;
    let signBill;
    let tradeInsp;
    let applicationDone;
    let licensingSent;
    let liceningDone;
    let cancelled;
    let lost;

    if (formData.tradeInsp === 'on') {
      tradeInsp = date
    }
    if (formData.sold === 'on') {
      sold = date;
    }
    if (formData.signBill === 'on') {
      signBill = date;
    }
    if (formData.metFinance === 'on') {
      metFinance = date;
    }
    if (formData.metSalesperson === 'on') {
      metSalesperson = date;
    }
    if (formData.financeApplication === 'on') {
      financeApplication = date;
    }
    if (formData.seenTrade === 'on') {
      seenTrade = date;
    }
    if (formData.funded === 'on') {
      funded = date;
    }
    if (formData.docsSigned === 'on') {
      docsSigned = date;
    }
    if (formData.deliveredDate === 'on') {
      deliveredDate = date;
    }
    if (formData.delivered === 'on') {
      delivered = date;
    }
    if (formData.demoed === 'on') {
      demoed = date;
    }
    if (formData.pickUpSet === 'on') {
      pickUpSet = date;
    }
    if (formData.signed === 'on') {
      signed = date;
    }
    if (formData.approved === 'on') {
      approved = date;
    }
    if (formData.financeApp === 'on') {
      financeApp = date;
    }
    if (formData.turnOver === 'on') {
      turnOver = date;
    }
    if (formData.refund === 'on') {
      refund = date;
    }
    if (formData.depositMade === 'on') {
      depositMade = date;
    }
    if (formData.metParts === 'on') {
      metParts = date;
    }
    if (formData.metManager === 'on') {
      metManager = date;
    }
    if (formData.metService === 'on') {
      metService = date;
    }
    if (formData.testDrive === 'on') {
      testDrive = date;
    }
    if (formData.aptNoShowed === 'on') {
      aptNoShowed = date;
    }
    if (formData.aptShowed === 'on') {
      aptShowed = date;
    }
    if (formData.bookedApt === 'on') {
      bookedApt = date;
    }
    if (formData.visited === 'on') {
      visited = date;
    }
    if (formData.referral === 'on') {
      referral = date;
    }
    if (formData.applicationDone === 'on') {
      applicationDone = date;
    }
    if (formData.licensingSent === 'on') {
      licensingSent = date;
    }
    if (formData.liceningDone === 'on') {
      liceningDone = date;
    }
    if (formData.cancelled === 'on') {
      cancelled = date;
    }
    if (formData.lost === 'on') {
      lost = date;
    }

    // if (!formData.reached) updateData.reached = currentDate;
    // if (!formData.attempted) updateData.attempted = currentDate;

    const updateDealProgress = await prisma.dashboard.update({
      where: { financeId: formData.financeId },
      data: {
        applicationDone: String(applicationDone),
        licensingSent: String(licensingSent),
        liceningDone: String(liceningDone),
        cancelled: String(cancelled),
        lost: String(lost),
        sold: String(sold),
        referral: formData.referral === 'on' && String(currentDate), //: String(referral),
        visited: String(visited),
        bookedApt: String(bookedApt),
        aptShowed: String(aptShowed),
        aptNoShowed: formData.aptNoShowed === 'on' && String(currentDate), //String(aptNoShowed),
        testDrive: String(testDrive),
        metService: String(metService),
        metManager: String(metManager),
        metParts: String(metParts),
        depositMade: String(depositMade),
        refund: String(refund),
        turnOver: String(turnOver),
        financeApp: String(financeApp),
        approved: String(approved),
        signed: String(signed),
        pickUpSet: String(pickUpSet),
        demoed: String(demoed),
        delivered: String(delivered),
        deliveredDate: String(deliveredDate),
        docsSigned: String(docsSigned),
        funded: String(funded),
        seenTrade: String(seenTrade),
        financeApplication: String(financeApplication),
        metSalesperson: String(metSalesperson),
        metFinance: String(metFinance),
        signBill: String(signBill),
        tradeInsp: String(tradeInsp),

        //pending: formData.pending,
        //  bookedApt: formData.bookedApt,
        // aptShowed: formData.aptShowed,
        /// aptNoShowed: formData.aptNoShowed,
        // referral: formData.referral,
      },
    });
    /**const userIntegration = await prisma.userIntergration.findUnique({
          where: { userEmail: user?.email }
        })
        if (userIntegration) {
          const activixActivated = userIntegration.activixActivated
          if (activixActivated === 'yes') {
            await UpdateLeadBasic(formData)
          }
          return json({ updateDealProgress })
        } */
    return ({ updateDealProgress })

  }
  // trade
  if (intent === 'updateTrade') {
    const financeData = {
      tradeMake: formData.tradeMake,
      tradeDesc: formData.tradeDesc,
      tradeYear: formData.tradeYear,
      tradeTrim: formData.tradeTrim,
      tradeColor: formData.tradeColor,
      tradeMileage: formData.tradeMileage || '',
      tradeVin: formData.tradeVin,
      tradeLocation: formData.tradeLocation,
    }
    const finance = []
    const updateClient = await updateFinanceWithDashboard(financeId, financeData, finance)
    if (user?.activixActivated === 'yes') {
      await UpdateLeadWantedVeh(financeData)
    }
    return json({ updateClient, })
  }
  // client info
  if (intent === 'updateClientInfoFinance') {
    const updateClient = await prisma.finance.update({
      where: { id: formData.financeId },
      data: {
        clientfileId: formData.clientfileId,
        activixId: formData.activixId,
        theRealActId: formData.theRealActId,
        financeManager: formData.financeManager,
        email: formData.email,
        firstName: formData.firstName,
        mileage: formData.mileage,
        lastName: formData.lastName,
        phone: formData.phone,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        postal: formData.postal,
        province: formData.province,
        dl: formData.dl,
        typeOfContact: formData.typeOfContact,
        timeToContact: formData.timeToContact,
        iRate: formData.iRate,
        months: formData.months,
        discount: formData.discount,
        total: formData.total,
        onTax: formData.onTax,
        on60: formData.on60,
        biweekly: formData.biweekly,
        weekly: formData.weekly,
        weeklyOth: formData.weeklyOth,
        biweekOth: formData.biweekOth,
        oth60: formData.oth60,
        weeklyqc: formData.weeklyqc,
        biweeklyqc: formData.biweeklyqc,
        qc60: formData.qc60,
        deposit: formData.deposit,
        biweeklNatWOptions: formData.biweeklNatWOptions,
        weeklylNatWOptions: formData.weeklylNatWOptions,
        nat60WOptions: formData.nat60WOptions,
        weeklyOthWOptions: formData.weeklyOthWOptions,
        biweekOthWOptions: formData.biweekOthWOptions,
        oth60WOptions: formData.oth60WOptions,
        biweeklNat: formData.biweeklNat,
        weeklylNat: formData.weeklylNat,
        nat60: formData.nat60,
        qcTax: formData.qcTax,
        otherTax: formData.otherTax,
        totalWithOptions: formData.totalWithOptions,
        otherTaxWithOptions: formData.otherTaxWithOptions,
        desiredPayments: formData.desiredPayments,
        freight: formData.freight,
        admin: formData.admin,
        commodity: formData.commodity,
        pdi: formData.pdi,
        discountPer: formData.discountPer,
        userLoanProt: formData.userLoanProt,
        userTireandRim: formData.userTireandRim,
        userGap: formData.userGap,
        userExtWarr: formData.userExtWarr,
        userServicespkg: formData.userServicespkg,
        deliveryCharge: formData.deliveryCharge,
        vinE: formData.vinE,
        lifeDisability: formData.lifeDisability,
        rustProofing: formData.rustProofing,
        userOther: formData.userOther,
        paintPrem: formData.paintPrem,
        licensing: formData.licensing,
        stockNum: formData.stockNum,
        options: formData.options,
        //   accessories: parseFloat(formData.accessories).toFixed(2),
        labour: formData.labour,
        year: formData.year,
        brand: formData.brand,
        model: formData.model,
        model1: formData.model1,
        color: formData.color,
        modelCode: formData.modelCode,
        msrp: formData.msrp,
        userEmail: formData.userEmail,
        tradeValue: formData.tradeValue,
        tradeDesc: formData.tradeDesc,
        tradeColor: formData.tradeColor,
        tradeYear: formData.tradeYear,
        tradeMake: formData.tradeMake,
        tradeVin: formData.tradeVin,
        tradeTrim: formData.tradeTrim,
        tradeMileage: formData.tradeMileage || '',
        tradeLocation: formData.tradeLocation,
        trim: formData.trim,
        vin: formData.vin,
        leadNote: formData.leadNote,
        sendToFinanceNow: formData.sendToFinanceNow,
        dealNumber: formData.dealNumber,
        bikeStatus: formData.bikeStatus,
        lien: formData.lien,
        dob: formData.dob,
        othTax: formData.othTax,
        optionsTotal: formData.optionsTotal,
        lienPayout: formData.lienPayout,
        referral: formData.referral,
        visited: formData.visited,
        bookedApt: formData.bookedApt,
        aptShowed: formData.aptShowed,
        aptNoShowed: formData.aptNoShowed,
        testDrive: formData.testDrive,
        metService: formData.metService,
        metManager: formData.metManager,
        metParts: formData.metParts,
        sold: formData.sold,
        depositMade: formData.depositMade,
        refund: formData.refund,
        turnOver: formData.turnOver,
        financeApp: formData.financeApp,
        approved: formData.approved,
        signed: formData.signed,
        pickUpSet: formData.pickUpSet,
        demoed: formData.demoed,
        delivered: formData.delivered,
        lastContact: formData.lastContact,
        status: formData.status,
        customerState: formData.customerState,
        result: formData.result,
        timesContacted: formData.timesContacted,
        nextAppointment: formData.nextAppointment,
        followUpDay: formData.followUpDay,
        deliveryDate: formData.deliveryDate,
        deliveredDate: formData.deliveredDate,
        notes: formData.notes,
        visits: formData.visits,
        progress: formData.progress,
        metSalesperson: formData.metSalesperson,
        metFinance: formData.metFinance,
        financeApplication: formData.financeApplication,
        pickUpDate: formData.pickUpDate,
        pickUpTime: formData.pickUpTime,
        depositTakenDate: formData.depositTakenDate,
        docsSigned: formData.docsSigned,
        tradeRepairs: formData.tradeRepairs,
        seenTrade: formData.seenTrade,
        lastNote: formData.lastNote,
        applicationDone: formData.applicationDone,
        licensingSent: formData.licensingSent,
        liceningDone: formData.liceningDone,
        refunded: formData.refunded,
        cancelled: formData.cancelled,
        lost: formData.lost,
        dLCopy: formData.dLCopy,
        insCopy: formData.insCopy,
        testDrForm: formData.testDrForm,
        voidChq: formData.voidChq,
        loanOther: formData.loanOther,
        signBill: formData.signBill,
        ucda: formData.ucda,
        tradeInsp: formData.tradeInsp,
        customerWS: formData.customerWS,
        otherDocs: formData.otherDocs,
        urgentFinanceNote: formData.urgentFinanceNote,
        funded: formData.funded,
        leadSource: formData.leadSource,
        financeDeptProductsTotal: formData.financeDeptProductsTotal,
        bank: formData.bank,
        loanNumber: formData.loanNumber,
        idVerified: formData.idVerified,
        dealerCommission: formData.dealerCommission,
        financeCommission: formData.financeCommission,
        salesCommission: formData.salesCommission,
        firstPayment: formData.firstPayment,
        loanMaturity: formData.loanMaturity,
      }
    })
    /** if (user?.activixActivated === 'yes') {
      await UpdateLeadBasic(formData)
      await UpdateLeademail(formData)
      await UpdateLeadPhone(formData)
    } */
    return json({ updateClient })
  }
  // ----------------------service---------------------
  if (intent === "createBooking") {
    const order = await prisma.workOrder.findUnique({
      where: { workOrderId: Number(id) },
      select: {
        workOrderId: true,
        unit: true,
        mileage: true,
        vin: true,
        tag: true,
        motor: true,
        budget: true,
        totalLabour: true,
        totalParts: true,
        subTotal: true,
        total: true,
        writer: true,
        userEmail: true,
        tech: true,
        notes: true,
        customerSig: true,
        status: true,
        location: true,
        quoted: true,
        paid: true,
        remaining: true,
        FinanceUnitId: true,
        financeId: true,
        clientfileId: true,
        createdAt: true,
        updatedAt: true,
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
            Finance: {
              select: {
                financeManager: true,
                userEmail: true,
                userName: true,
                financeManagerName: true,
                //: true,
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
                //: true,
                othTax: true,
                optionsTotal: true,
                lienPayout: true,
                leadNote: true,
                sendToFinanceNow: true,
                dealNumber: true,
                iRate: true,
                months: true,
                discount: true,
                total: true,
                onTax: true,
                on60: true,
                biweekly: true,
                weekly: true,
                weeklyOth: true,
                biweekOth: true,
                oth60: true,
                weeklyqc: true,
                biweeklyqc: true,
                qc60: true,
                deposit: true,
                biweeklNatWOptions: true,
                weeklylNatWOptions: true,
                nat60WOptions: true,
                weeklyOthWOptions: true,
                biweekOthWOptions: true,
                oth60WOptions: true,
                biweeklNat: true,
                weeklylNat: true,
                nat60: true,
                qcTax: true,
                otherTax: true,
                totalWithOptions: true,
                otherTaxWithOptions: true,
                desiredPayments: true,
                admin: true,
                commodity: true,
                pdi: true,
                discountPer: true,
                userLoanProt: true,
                userTireandRim: true,
                userGap: true,
                userExtWarr: true,
                userServicespkg: true,
                deliveryCharge: true,
                vinE: true,
                lifeDisability: true,
                rustProofing: true,
                userOther: true,
                //: true,
                referral: true,
                visited: true,
                bookedApt: true,
                aptShowed: true,
                aptNoShowed: true,
                testDrive: true,
                metService: true,
                metManager: true,
                metParts: true,
                sold: true,
                depositMade: true,
                refund: true,
                turnOver: true,
                financeApp: true,
                approved: true,
                signed: true,
                pickUpSet: true,
                demoed: true,
                delivered: true,
                lastContact: true,
                status: true,
                customerState: true,
                result: true,
                timesContacted: true,
                nextAppointment: true,
                followUpDay: true,
                deliveryDate: true,
                deliveredDate: true,
                notes: true,
                visits: true,
                progress: true,
                metSalesperson: true,
                metFinance: true,
                financeApplication: true,
                pickUpDate: true,
                pickUpTime: true,
                depositTakenDate: true,
                docsSigned: true,
                tradeRepairs: true,
                seenTrade: true,
                lastNote: true,
                applicationDone: true,
                licensingSent: true,
                liceningDone: true,
                refunded: true,
                cancelled: true,
                lost: true,
                dLCopy: true,
                insCopy: true,
                testDrForm: true,
                voidChq: true,
                loanOther: true,
                signBill: true,
                ucda: true,
                tradeInsp: true,
                customerWS: true,
                otherDocs: true,
                urgentFinanceNote: true,
                funded: true,
                leadSource: true,
                financeDeptProductsTotal: true,
                bank: true,
                loanNumber: true,
                idVerified: true,
                dealerCommission: true,
                financeCommission: true,
                salesCommission: true,
                firstPayment: true,
                loanMaturity: true,
                quoted: true,
                //: true,
                InPerson: true,
                Phone: true,
                SMS: true,
                Email: true,
                Other: true,
                //------: true,
                //: true,
                paintPrem: true,
                licensing: true,
                stockNum: true,
                options: true,
                accessories: true,
                freight: true,
                labour: true,
                year: true,
                brand: true,
                mileage: true,
                model: true,
                model1: true,
                color: true,
                modelCode: true,
                msrp: true,
                trim: true,
                vin: true,
                bikeStatus: true,
                invId: true,
                //: true,
                tradeValue: true,
                tradeDesc: true,
                tradeColor: true,
                tradeYear: true,
                tradeMake: true,
                tradeVin: true,
                tradeTrim: true,
                tradeMileage: true,
                tradeLocation: true,
                lien: true,
                //: true,
                id: true,
                activixId: true,
                theRealActId: true,
                createdAt: true,
                updatedAt: true,
                FinanceUnit: {
                  select: {
                    paintPrem: true,
                    licensing: true,
                    stockNum: true,
                    options: true,
                    accessories: true,
                    freight: true,
                    labour: true,
                    year: true,
                    brand: true,
                    mileage: true,
                    model: true,
                    model1: true,
                    color: true,
                    modelCode: true,
                    msrp: true,
                    trim: true,
                    vin: true,
                    bikeStatus: true,
                    invId: true,
                    location: true,
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    financeId: true,
                  }
                },
              }
            },
            ServiceUnit: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                price: true,
                brand: true,
                model: true,
                color: true,
                accessories: true,
                options: true,
                year: true,
                vin: true,
                trim: true,
                mileage: true,
                location: true,
                condition: true,
                repairs: true,
                stockNum: true,
                licensing: true,
                tradeEval: true,
              }
            },
          },
        },
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
            workOrderId: true,
            note: true,
            financeId: true,
            clientfileId: true,
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
          }
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
        ServicesOnWorkOrders: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            quantity: true,
            status: true,
            workOrderId: true,
            serviceId: true,
            hr: true,
            service: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                description: true,
                estHr: true,
                service: true,
                price: true,
              }
            }
          }
        }
      },
    });
    const start = new Date();
    start.setHours(9, 0, 0, 0);

    const totalHours = order?.ServicesOnWorkOrders?.reduce((total, serviceOnOrder) => {
      const hours = serviceOnOrder.hr ?? serviceOnOrder.service.estHr ?? 0;
      const quantity = serviceOnOrder.quantity ?? 1;
      const entryHours = hours * quantity;
      return total + entryHours;
    }, 0);

    console.log(`Total Hours: ${totalHours}`);

    const end = new Date(start);
    end.setHours(end.getHours() + totalHours);

    await prisma.workOrderApts.create({
      data: {
        start: String(start),
        end: String(end),
        workOrderId: order?.workOrderId,
        writer: order?.writer,
        title: order?.Clientfile?.name,
        unit: order?.unit,
        mileage: order?.mileage,
        vin: order?.vin,
        tag: order?.tag,
        motor: order?.motor,
        color: order?.color,
        location: order?.location,
        techEmail: 'serviceDesk@email.com',
        tech: 'Service Desk',
        resourceId: 'Service Desk',
      }
    })

    return redirect(`/dealer/service/workOrder/calendar/${id}`)
  }
  if (intent === "scanOrder") {
    await prisma.customerSync.update({
      where: { userEmail: email },
      data: { orderId: formPayload.orderId }
    });
    return redirect('/dealer/service/customerSync')
  }
  if (intent === "updateHr") {
    const update = await prisma.servicesOnWorkOrders.update({
      where: { id: formPayload.id },
      data: { hr: parseFloat(formPayload.name) }
    });
    return json({ update })
  }
  if (intent === "updateServiceOnOrders") {
    const update = await prisma.servicesOnWorkOrders.update({
      where: { id: formPayload.id },
      data: { status: formPayload.status }
    });
    return json({ update })
  }
  if (intent === "deleteServiceItem") {
    const update = await prisma.servicesOnWorkOrders.delete({
      where: { id: formPayload.id },
    });
    return json({ update })
  }
  if (intent === 'deleteOrderItem') {
    const payment = await prisma.accessoriesOnOrders.delete({ where: { id: formPayload.id } });
    return payment;
  }
  if (intent === "updateAccOnOrders") {
    const update = await prisma.accessoriesOnOrders.update({
      where: { id: formPayload.id },
      data: { status: formPayload.status }
    });
    return json({ update })
  }
  if (intent === 'createPayment') {
    const payment = await prisma.payment.create({
      data: {
        workOrderId: formPayload.workOrderId,
        paymentType: formPayload.paymentType,
        amountPaid: parseFloat(formPayload.amountPaid),
        cardNum: formPayload.cardNum,
        receiptId: formPayload.receiptId,
      },
    });
    if (formPayload.remaining === '0') {
      await prisma.workOrder.update({
        where: { workOrderId: formPayload.workOrderId },
        data: {
          total: parseFloat(formPayload.total),
          paid: 'Yes',
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
  if (intent === "addUnit") {
    const update = await prisma.workOrder.update({
      where: { workOrderId: formPayload.workOrderId },
      data: {
        unit: formPayload.unit,
        mileage: formPayload.mileage,
        vin: formPayload.vin,
        tag: formPayload.tag,
        motor: formPayload.motor,
        color: formPayload.color,
      }
    });
    return json({ update })
  }
  if (intent === "addNewServiceUnit") {
    const update = await prisma.workOrder.update({
      where: { workOrderId: Number(formPayload.workOrderId) },
      data: {
        unit: (`${formPayload.year} ${formPayload.brand} ${formPayload.model}`),
        mileage: formPayload.mileage,
        vin: formPayload.vin,
        tag: formPayload.tag,
        motor: formPayload.motor,
        location: formPayload.location,
        color: formPayload.color,

      }
    });
    const create = await prisma.serviceUnit.create({
      data: {
        brand: formPayload.brand,
        model: formPayload.model,
        color: formPayload.color,
        year: formPayload.year,
        vin: formPayload.vin,
        mileage: formPayload.mileage,
        location: formPayload.location,
        tag: formPayload.tag,
        clientfileId: formPayload.clientfileId,
      }
    });

    return json({ update, create })
  }
  if (intent === "addNewServiceToWorkOrder") {
    const service = await prisma.services.create({
      data: {
        description: formPayload.description,
        service: formPayload.name,
        estHr: parseFloat(formPayload.hr),
      }
    })
    const serviceOnWorkOrder = await prisma.servicesOnWorkOrders.create({
      data: {
        quantity: Number(formPayload.quantity),
        hr: parseFloat(formPayload.hr),
        status: 'Quote',
        serviceId: service.id,
        workOrderId: Number(formPayload.workOrderId),
      }
    })

    return json({ serviceOnWorkOrder })
  }
  if (intent === "addServiceToWorkOrder") {
    const serviceOnWorkOrder = await prisma.servicesOnWorkOrders.create({
      data: {
        quantity: 1,
        hr: parseFloat(formPayload.hr),
        status: 'Quote',
        serviceId: formPayload.serviceId,
        workOrderId: Number(formPayload.workOrderId),
      }
    })

    return json({ serviceOnWorkOrder })
  }
  if (intent === "addAccToWorkOrder") {
    let addToWorkOrder
    if (formPayload.accOrderId === null) {
      console.log('accOrderId is null')
      const accOrder = await prisma.accOrder.create({
        data: {
          userEmail: email,
          userName: user.username,
          dept: 'Service',
          status: 'Quote',
          workOrderId: formPayload.workOrderId,
        }
      })

      addToWorkOrder = await prisma.accessoriesOnOrders.create({
        data: {

          accessoryId: formPayload.accessoryId,
          accOrderId: accOrder.id,
          quantity: 1,
        }
      })
    } else {
      console.log('accOrderId is NOT null')

      addToWorkOrder = await prisma.accessoriesOnOrders.create({
        data: {
          accessoryId: formPayload.accessoryId,
          accOrderId: formPayload.accOrderId,
          quantity: 1,
        }
      })
    }
    console.log(addToWorkOrder, 'accOrderId')

    return json({ addToWorkOrder })
  }
  if (intent === "updateStatus") {
    const update = await prisma.workOrder.update({
      where: { workOrderId: Number(formPayload.id) },

      data: {
        status: formPayload.status,
        total: parseFloat(formPayload.total),
        waiter: formPayload.status === 'Waiter' ? true : null
      }
    });
    return json({ update })
  }
  if (intent === "updateNote") {
    console.log(';hit update note')
    const update = await prisma.workOrder.update({
      where: { workOrderId: Number(formPayload.id) },
      data: {
        notes: formPayload.note,
      }
    });
    return json({ update })
  }
  // ----------------------service---------------------

  else return null
}

export async function loader({ params, request }: DataFunctionArgs) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")

  const user = await GetUser(email)
  if (!user) { redirect('/login') }

  const userId = user?.id
  let deFees = await prisma.dealer.findUnique({ where: { userEmail: email } });
  if (!deFees) {
    deFees = await prisma.dealer.findFirst();
  }

  let clientfileId = undefined
  let { clientId, financeId } = params;
  if (clientfileId === undefined) { clientfileId = clientId }
  let sliderWidth = 50
  if (clientfileId === 'customer' && financeId === 'sync') {
    clientfileId = user?.customerSync.clientfileId
  }

  let aptFinance3 = await getAppointmentsForFinance(financeId)
  const clientFile = await getClientFileById(params.clientId)
  // console.log(clientFile, 'checking clientFile')

  let finance
  if (user?.activixActivated === 'yes') {
    finance = await GetMergedWithActivix(financeId)
    await UpdateClientFromActivix(finance)
  } else {
    if (clientFile && Array.isArray(clientFile.Finance)) {
      const filteredFinances = clientFile.Finance.filter(finance => {
        return String(finance.id) === String(financeId);
      });

      // console.log('Filtered finances:', filteredFinances);

      // Check if we have any matches
      if (filteredFinances.length > 0) {
        const selectedFinance = filteredFinances[0];
        //   console.log('Selected finance:', selectedFinance);
        finance = selectedFinance
      } else {
        console.log('No matching finance found.');
      }
    } else {
      console.log('Client file or Finance array not found or is not an array.');
    }


  }
  const SetClient66Cookie = await SetClient66(userId, clientId, financeId, request)

  const brand = finance?.brand
  const financeNotes = await getAllFinanceNotes(financeId)
  const docTemplates = await getDocsbyUserId(userId)

  const Coms = await getComsOverview(email)
  let dealerFees = await prisma.dealer.findUnique({ where: { userEmail: email } });
  if (!dealerFees) {
    dealerFees = await prisma.dealer.findFirst();
  }
  const dealerInfo = dealerFees
  // ------------------ nav
  const financeEmail = await prisma.finance.findFirst({ where: { id: financeId }, });
  const financeList = await prisma.finance.findMany({ where: { email: financeEmail?.email }, });
  const financeIds = financeList.map(financeRecord => financeRecord.id);
  const mergedFinanceList = await getClientListMerged(financeIds);
  // ------------------------
  let merged


  const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: email } });
  // const UploadedDocs = await prisma.uploadDocs.findMany({ where: { financeId: finance?.id } });
  const userList = await prisma.user.findMany()
  /// const parts = await prisma.part.findMany()
  let clientUnit
  if (clientFile.Finance.FinanceUnit) {
    clientUnit = await prisma.inventoryMotorcycle.findFirst({ where: { stockNumber: clientFile.Finance.FinanceUnit.stockNum } })
  }


  // -----------------------------sms ---------------------------------//
  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
  const godClient = require('twilio')(accountSid, authToken);
  const client = godClient
  const searchData = await prisma.clientfile.findMany({ orderBy: { createdAt: 'desc', }, });
  let convoList = {}
  let getConvos;
  let callToken;
  let username = 'skylerzanth'//localStorage.getItem("username") ?? "";
  let password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
  if (username.length > 0 && password.length > 0) {
    const token = await getToken(username, password)
    callToken = token
  }

  if (!Array.isArray(convoList) || convoList.length === 0) {
    getConvos = await client.conversations.v1.users(`${username}`).userConversations.list({ limit: 50 });
    // .then(userConversations => userConversations.forEach(u => console.log(u.friendlyName)))
    convoList = getConvos;
  }
  // -----------------------------sms ---------------------------------//
  // -----------------------------email---------------------------------//
  const conversations = await prisma.comm.findMany({ orderBy: { createdAt: "desc" }, });

  // -----------------------------email---------------------------------//
  const emailTemplatesDropdown = await prisma.emailTemplatesForDropdown.findMany({
    where: { userEmail: email },
  });
  if (user?.activixActivated === 'yes') {
    const financeData = finance
    await PullActivix(financeData)
  }
  const salesPeople = await prisma.user.findMany({
    where: { positions: { some: { position: 'Sales' } } }
  });
  const financeManagers = await prisma.user.findMany({
    where: { positions: { some: { position: 'Finance Manager' } } }
  });
  // ----------------------service -----------------------------
  const orders = await prisma.workOrder.findMany({
    where: { financeId: finance.id },
    select: {
      workOrderId: true,
      unit: true,
      mileage: true,
      vin: true,
      tag: true,
      motor: true,
      budget: true,
      totalLabour: true,
      totalParts: true,
      subTotal: true,
      total: true,
      writer: true,
      userEmail: true,
      tech: true,
      notes: true,
      customerSig: true,
      status: true,
      location: true,
      quoted: true,
      paid: true,
      remaining: true,
      FinanceUnitId: true,
      financeId: true,
      clientfileId: true,
      createdAt: true,
      updatedAt: true,
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
          Finance: {
            select: {
              financeManager: true,
              userEmail: true,
              userName: true,
              financeManagerName: true,
              //: true,
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
              //: true,
              othTax: true,
              optionsTotal: true,
              lienPayout: true,
              leadNote: true,
              sendToFinanceNow: true,
              dealNumber: true,
              iRate: true,
              months: true,
              discount: true,
              total: true,
              onTax: true,
              on60: true,
              biweekly: true,
              weekly: true,
              weeklyOth: true,
              biweekOth: true,
              oth60: true,
              weeklyqc: true,
              biweeklyqc: true,
              qc60: true,
              deposit: true,
              biweeklNatWOptions: true,
              weeklylNatWOptions: true,
              nat60WOptions: true,
              weeklyOthWOptions: true,
              biweekOthWOptions: true,
              oth60WOptions: true,
              biweeklNat: true,
              weeklylNat: true,
              nat60: true,
              qcTax: true,
              otherTax: true,
              totalWithOptions: true,
              otherTaxWithOptions: true,
              desiredPayments: true,
              admin: true,
              commodity: true,
              pdi: true,
              discountPer: true,
              userLoanProt: true,
              userTireandRim: true,
              userGap: true,
              userExtWarr: true,
              userServicespkg: true,
              deliveryCharge: true,
              vinE: true,
              lifeDisability: true,
              rustProofing: true,
              userOther: true,
              //: true,
              referral: true,
              visited: true,
              bookedApt: true,
              aptShowed: true,
              aptNoShowed: true,
              testDrive: true,
              metService: true,
              metManager: true,
              metParts: true,
              sold: true,
              depositMade: true,
              refund: true,
              turnOver: true,
              financeApp: true,
              approved: true,
              signed: true,
              pickUpSet: true,
              demoed: true,
              delivered: true,
              lastContact: true,
              status: true,
              customerState: true,
              result: true,
              timesContacted: true,
              nextAppointment: true,
              followUpDay: true,
              deliveryDate: true,
              deliveredDate: true,
              notes: true,
              visits: true,
              progress: true,
              metSalesperson: true,
              metFinance: true,
              financeApplication: true,
              pickUpDate: true,
              pickUpTime: true,
              depositTakenDate: true,
              docsSigned: true,
              tradeRepairs: true,
              seenTrade: true,
              lastNote: true,
              applicationDone: true,
              licensingSent: true,
              liceningDone: true,
              refunded: true,
              cancelled: true,
              lost: true,
              dLCopy: true,
              insCopy: true,
              testDrForm: true,
              voidChq: true,
              loanOther: true,
              signBill: true,
              ucda: true,
              tradeInsp: true,
              customerWS: true,
              otherDocs: true,
              urgentFinanceNote: true,
              funded: true,
              leadSource: true,
              financeDeptProductsTotal: true,
              bank: true,
              loanNumber: true,
              idVerified: true,
              dealerCommission: true,
              financeCommission: true,
              salesCommission: true,
              firstPayment: true,
              loanMaturity: true,
              quoted: true,
              //: true,
              InPerson: true,
              Phone: true,
              SMS: true,
              Email: true,
              Other: true,
              //------: true,
              //: true,
              paintPrem: true,
              licensing: true,
              stockNum: true,
              options: true,
              accessories: true,
              freight: true,
              labour: true,
              year: true,
              brand: true,
              mileage: true,
              model: true,
              model1: true,
              color: true,
              modelCode: true,
              msrp: true,
              trim: true,
              vin: true,
              bikeStatus: true,
              invId: true,
              //: true,
              tradeValue: true,
              tradeDesc: true,
              tradeColor: true,
              tradeYear: true,
              tradeMake: true,
              tradeVin: true,
              tradeTrim: true,
              tradeMileage: true,
              tradeLocation: true,
              lien: true,
              //: true,
              id: true,
              activixId: true,
              theRealActId: true,
              createdAt: true,
              updatedAt: true,
              FinanceUnit: {
                select: {
                  paintPrem: true,
                  licensing: true,
                  stockNum: true,
                  options: true,
                  accessories: true,
                  freight: true,
                  labour: true,
                  year: true,
                  brand: true,
                  mileage: true,
                  model: true,
                  model1: true,
                  color: true,
                  modelCode: true,
                  msrp: true,
                  trim: true,
                  vin: true,
                  bikeStatus: true,
                  invId: true,
                  location: true,
                  id: true,
                  createdAt: true,
                  updatedAt: true,
                  financeId: true,
                }
              },
            }
          },
          ServiceUnit: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              price: true,
              brand: true,
              model: true,
              color: true,
              accessories: true,
              options: true,
              year: true,
              vin: true,
              trim: true,
              mileage: true,
              location: true,
              condition: true,
              repairs: true,
              stockNum: true,
              licensing: true,
              tradeEval: true,
            }
          },
        },
      },
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
          workOrderId: true,
          note: true,
          financeId: true,
          clientfileId: true,
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
        }
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
      ServicesOnWorkOrders: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          quantity: true,
          status: true,
          workOrderId: true,
          serviceId: true,
          hr: true,
          service: {
            select: {
              id: true,
              createdAt: true,
              updatedAt: true,
              description: true,
              estHr: true,
              service: true,
              price: true,
            }
          }
        }
      }
    },
  });
  const tax = await prisma.dealer.findUnique({
    where: { id: 1 },
    select: {
      userTax: true,
      userLabour: true,
    },
  });
  const dealerImage = await prisma.dealerLogo.findUnique({ where: { id: 1 } })
  const services = await prisma.services.findMany({})
  let assignedUnit
  if (finance.stockNum.length > 1) {
    assignedUnit = await prisma.inventoryMotorcycle.findUnique({
      where: { id: finance.inventoryMotorcycleId },
    })
  }
  const tableData = await prisma.inventoryMotorcycle.findMany({})

  //
  // ----------------------service -----------------------------
  let modelData = []
  let apptFinance2 = []
  let manOptions = []
  let bmwMoto = []
  let bmwMoto2 = []
  switch (brand) {
    case 'Harley-Davidson':
      modelData = await getDataHarley(finance);
      apptFinance2 = await getAllFinanceApts2(financeId)
      break;
    case 'Manitou':
      modelData = await getDataByModelManitou(finance);
      manOptions = await getLatestOptionsManitou(email)
      break;
    case 'Switch':
      modelData = await getDataByModel(finance);
      manOptions = await getLatestOptionsManitou(email)
      break;
    case 'Kawasaki':
      modelData = await getDataKawasaki(finance);
      manOptions = await getLatestOptionsManitou(email)
      break;
    case 'BMW-Motorrad':
      bmwMoto = await getLatestBMWOptions(financeId)
      bmwMoto2 = await getLatestBMWOptions2(financeId)
      modelData = await getDataBmwMoto(finance);
      break;
    case 'Triumph':
      modelData = await getDataTriumph(finance);
      break;
    case 'Indian' || 'Can-Am' || 'Sea-Doo' || 'Ski-Doo' || 'Suzuki' || 'Spyder' || 'Can-Am-SXS':
      modelData = await getDataByModel(finance)
      break;
    default:
    // code block
  }

  return await cors(request, json({ modelData, apptFinance2, aptFinance3, ok: true, mergedFinanceList, getTemplates, SetClient66Cookie, Coms, merged, docs: docTemplates, clientFile, finance, deFees, sliderWidth, user, financeNotes, userList, clientfileId, clientUnit, searchData, convoList, conversations, emailTemplatesDropdown, salesPeople, financeManagers, manOptions, bmwMoto, bmwMoto2, dealerImage, services, tax, orders, tableData }));
}

function SidebarNav({ mergedFinanceList, finance }) {
  function ImageSelectNav(brandId) {
    if (brandId === 'Can-Am') {
      return (
        <img
          width="300"
          height="166"
          className="mx-auto"
          src="https://logovectorseek.com/wp-content/uploads/2020/09/can-am-logo-vector.png"
          alt="srry"
        />
      )
    }
    if (brandId === 'Can-Am-SXS') {
      return (
        <img
          width="300"
          height="166"
          className="mx-auto"
          src="https://logovectorseek.com/wp-content/uploads/2020/09/can-am-logo-vector.png"
          alt="srry"
        />
      )
    }
    else if (brandId === 'Ski-Doo') {
      return (
        <img
          width="300"
          height="166"
          className="mx-auto"
          src="https://searchlogovector.com/wp-content/uploads/2020/04/ski-doo-logo-vector.png"
          alt="steve"
        />
      )
    }
    else if (brandId === 'Sea-Doo') {
      return (
        <img
          width="300"
          height="166"
          alt="steve"
          className="mx-auto"
          src="https://searchlogovector.com/wp-content/uploads/2020/04/sea-doo-logo-vector.png"
        />
      )
    }
    else if (brandId === 'Kawasaki') {
      return (
        <div className="flex justify-center mt-5">
          <svg
            className="mx-auto flex-1 mr-6"
            width="260.5398px"
            height="70.7005px"
            viewBox="0 0 130.5398 35.7005"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs>
              <polygon
                id="path-1"
                points="0 0 130.5398 0 130.5398 35.7005 0 35.7005"></polygon>
            </defs>
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g transform="translate(-45.000000, -20.000000)">
                <g transform="translate(45.000000, 20.000000)">
                  <mask fill="white">
                    <use xlinkHref="#path-1"></use>
                  </mask>
                  <g id="Clip-2"></g>
                  <path
                    d="M123.178,35.5435 L124.588,35.5435 L124.588,28.1385 L123.178,28.1385 L123.178,35.5435 Z M120.1,35.5435 L121.51,35.5435 L121.51,28.1385 L120.1,28.1385 L120.1,35.5435 Z M117.377,32.8915 C117.377,31.8545 116.89,31.1535 116.029,31.1535 C115.161,31.1535 114.684,31.8545 114.684,32.8915 C114.684,33.9295 115.161,34.6215 116.029,34.6215 C116.89,34.6215 117.377,33.9295 117.377,32.8915 L117.377,32.8915 Z M118.808,32.8915 C118.808,34.4775 117.678,35.6985 116.029,35.6985 C114.382,35.6985 113.253,34.4775 113.253,32.8915 C113.253,31.3075 114.382,30.0855 116.029,30.0855 C117.678,30.0855 118.808,31.3075 118.808,32.8915 L118.808,32.8915 Z M110.736,30.4465 C110.736,29.7725 110.302,29.4435 109.557,29.4435 L107.981,29.4435 L107.981,31.4625 L109.535,31.4625 C110.323,31.4625 110.736,31.0995 110.736,30.4465 L110.736,30.4465 Z M110.809,32.5085 L112.662,35.5435 L110.923,35.5435 L109.203,32.6845 L107.981,32.6845 L107.981,35.5435 L106.427,35.5435 L106.427,28.1385 L109.68,28.1385 C110.539,28.1385 111.182,28.3845 111.616,28.8315 C112.031,29.2555 112.281,29.7725 112.281,30.4375 C112.281,31.4715 111.742,32.1985 110.809,32.5085 L110.809,32.5085 Z M100.814,32.3135 C100.057,32.1565 99.352,32.1165 99.352,31.6605 C99.352,31.2765 99.715,31.0695 100.263,31.0695 C100.863,31.0695 101.226,31.2765 101.288,31.8455 L102.562,31.8455 C102.46,30.7775 101.682,30.0845 100.284,30.0845 C99.072,30.0845 98.118,30.6325 98.118,31.7835 C98.118,32.9445 99.05,33.2025 100.004,33.3905 C100.731,33.5345 101.401,33.5875 101.401,34.0955 C101.401,34.4675 101.051,34.7045 100.429,34.7045 C99.798,34.7045 99.361,34.4365 99.269,33.8245 L97.964,33.8245 C98.047,34.9535 98.906,35.6985 100.451,35.6985 C101.777,35.6985 102.688,35.0585 102.688,33.9905 C102.688,32.7475 101.703,32.4975 100.814,32.3135 L100.814,32.3135 Z M95.518,32.3115 C95.478,31.6375 95.031,31.1735 94.391,31.1735 C93.643,31.1735 93.28,31.6195 93.157,32.3115 L95.518,32.3115 Z M96.989,33.2845 L93.135,33.2845 C93.24,34.1035 93.696,34.6105 94.493,34.6105 C95.044,34.6105 95.364,34.3615 95.518,33.9585 L96.906,33.9585 C96.709,34.9005 95.872,35.7005 94.505,35.7005 C92.742,35.7005 91.747,34.4665 91.747,32.8815 C91.747,31.3085 92.815,30.0835 94.37,30.0835 C96.078,30.0835 96.989,31.3885 96.989,33.2845 L96.989,33.2845 Z M88.88,30.0855 C88.206,30.0855 87.646,30.4365 87.282,31.0175 L87.261,31.0175 C87.002,30.4575 86.464,30.0855 85.793,30.0855 C85.057,30.0855 84.537,30.4575 84.248,30.9445 L84.217,30.9445 L84.217,30.2295 L82.86,30.2295 L82.86,35.5455 L84.269,35.5455 L84.269,32.4585 C84.269,31.7535 84.651,31.2975 85.22,31.2975 C85.74,31.2975 86.039,31.6085 86.039,32.2085 L86.039,35.5455 L87.449,35.5455 L87.449,32.4585 C87.449,31.7535 87.812,31.2975 88.403,31.2975 C88.92,31.2975 89.221,31.6085 89.221,32.2085 L89.221,35.5455 L90.628,35.5455 L90.628,31.9685 C90.628,30.8085 89.997,30.0855 88.88,30.0855 L88.88,30.0855 Z M79.804,35.5435 L81.214,35.5435 L81.214,30.2285 L79.804,30.2285 L79.804,35.5435 Z M79.804,29.4035 L81.214,29.4035 L81.214,28.1385 L79.804,28.1385 L79.804,29.4035 Z M72.78,29.4025 L75.008,29.4025 L75.008,35.5425 L76.51,35.5425 L76.51,29.4025 L78.735,29.4025 L78.735,28.1375 L72.78,28.1375 L72.78,29.4025 Z M68.191,32.9235 C68.191,31.9075 67.859,31.2245 66.957,31.2245 C66.181,31.2245 65.787,31.9075 65.787,32.8925 C65.787,33.9175 66.19,34.5175 66.917,34.5175 C67.757,34.5175 68.191,33.8955 68.191,32.9235 L68.191,32.9235 Z M68.16,28.1375 L69.57,28.1375 L69.57,35.5455 L68.212,35.5455 L68.212,34.8495 L68.191,34.8495 C67.88,35.3575 67.351,35.6995 66.606,35.6995 C65.27,35.6995 64.359,34.6125 64.359,32.8925 C64.359,31.2335 65.301,30.0855 66.627,30.0855 C67.372,30.0855 67.84,30.4275 68.129,30.8735 L68.16,30.8735 L68.16,28.1375 Z M62.027,32.8915 C62.027,31.8545 61.541,31.1535 60.679,31.1535 C59.811,31.1535 59.334,31.8545 59.334,32.8915 C59.334,33.9295 59.811,34.6215 60.679,34.6215 C61.541,34.6215 62.027,33.9295 62.027,32.8915 L62.027,32.8915 Z M63.458,32.8915 C63.458,34.4775 62.328,35.6985 60.679,35.6985 C59.032,35.6985 57.903,34.4775 57.903,32.8915 C57.903,31.3075 59.032,30.0855 60.679,30.0855 C62.328,30.0855 63.458,31.3075 63.458,32.8915 L63.458,32.8915 Z M55.594,32.8915 C55.594,31.8545 55.107,31.1535 54.246,31.1535 C53.378,31.1535 52.901,31.8545 52.901,32.8915 C52.901,33.9295 53.378,34.6215 54.246,34.6215 C55.107,34.6215 55.594,33.9295 55.594,32.8915 L55.594,32.8915 Z M57.025,32.8915 C57.025,34.4775 55.895,35.6985 54.246,35.6985 C52.599,35.6985 51.47,34.4775 51.47,32.8915 C51.47,31.3075 52.599,30.0855 54.246,30.0855 C55.895,30.0855 57.025,31.3075 57.025,32.8915 L57.025,32.8915 Z M47.245,32.7675 L49.027,32.7675 L49.027,32.8105 C49.027,33.6265 48.27,34.4875 47.119,34.4875 C45.845,34.4875 45.048,33.3805 45.048,31.8655 C45.048,30.3945 45.743,29.2345 47.14,29.2345 C48.094,29.2345 48.642,29.7545 48.809,30.4685 L50.28,30.4685 C50.04,29.0185 48.975,27.9945 47.11,27.9945 C46.116,27.9945 45.328,28.2925 44.727,28.8435 C43.949,29.5575 43.515,30.6345 43.515,31.8655 C43.515,32.9855 43.866,33.9365 44.478,34.6235 C45.091,35.2945 45.959,35.7005 47.079,35.7005 C47.959,35.7005 48.652,35.3985 49.159,34.5495 L49.181,34.5495 L49.233,35.5435 L50.363,35.5435 L50.363,31.6075 L47.245,31.6075 L47.245,32.7675 Z M38.748,32.3115 C38.708,31.6375 38.262,31.1735 37.622,31.1735 C36.874,31.1735 36.511,31.6195 36.388,32.3115 L38.748,32.3115 Z M40.219,33.2845 L36.366,33.2845 C36.471,34.1035 36.926,34.6105 37.723,34.6105 C38.274,34.6105 38.594,34.3615 38.748,33.9585 L40.136,33.9585 C39.939,34.9005 39.102,35.7005 37.736,35.7005 C35.972,35.7005 34.978,34.4665 34.978,32.8815 C34.978,31.3085 36.046,30.0835 37.6,30.0835 C39.308,30.0835 40.219,31.3885 40.219,33.2845 L40.219,33.2845 Z M32.048,30.0835 C31.322,30.0835 30.888,30.3635 30.503,30.9235 L30.472,30.9235 L30.472,28.1385 L29.063,28.1385 L29.063,35.5435 L30.472,35.5435 L30.472,32.5305 C30.472,31.8045 30.928,31.3085 31.549,31.3085 C32.14,31.3085 32.473,31.7115 32.473,32.2815 L32.473,35.5435 L33.879,35.5435 L33.879,32.0755 C33.879,30.9145 33.144,30.0835 32.048,30.0835 L32.048,30.0835 Z M26.693,33.9785 L26.693,31.1625 L27.604,31.1625 L27.604,30.2295 L26.693,30.2295 L26.693,28.5715 L25.314,28.5715 L25.314,30.2295 L24.578,30.2295 L24.578,31.1625 L25.314,31.1625 L25.314,34.2805 C25.314,35.2835 26.071,35.5545 26.754,35.5545 C27.314,35.5545 27.634,35.5325 27.634,35.5325 L27.634,34.4985 C27.634,34.4985 27.394,34.5075 27.219,34.5075 C26.908,34.5075 26.693,34.3725 26.693,33.9785 L26.693,33.9785 Z M19.804,33.9785 L19.804,31.1625 L20.715,31.1625 L20.715,30.2295 L19.804,30.2295 L19.804,28.5715 L18.425,28.5715 L18.425,30.2295 L17.689,30.2295 L17.689,31.1625 L18.425,31.1625 L18.425,34.2805 C18.425,35.2835 19.182,35.5545 19.865,35.5545 C20.425,35.5545 20.746,35.5325 20.746,35.5325 L20.746,34.4985 C20.746,34.4985 20.505,34.5075 20.33,34.5075 C20.019,34.5075 19.804,34.3725 19.804,33.9785 L19.804,33.9785 Z M15.388,32.3115 C15.348,31.6375 14.902,31.1735 14.262,31.1735 C13.514,31.1735 13.151,31.6195 13.028,32.3115 L15.388,32.3115 Z M16.859,33.2845 L13.006,33.2845 C13.111,34.1035 13.566,34.6105 14.363,34.6105 C14.914,34.6105 15.234,34.3615 15.388,33.9585 L16.776,33.9585 C16.579,34.9005 15.742,35.7005 14.376,35.7005 C12.612,35.7005 11.618,34.4665 11.618,32.8815 C11.618,31.3085 12.686,30.0835 14.24,30.0835 C15.948,30.0835 16.859,31.3885 16.859,33.2845 L16.859,33.2845 Z M7.454,34.2565 L10.935,34.2565 L10.935,35.5095 L5.952,35.5095 L5.952,28.1045 L7.454,28.1045 L7.454,34.2565 Z"
                    id="Fill-1"
                    fill="#000000"
                    mask="url(#mask-2)"></path>
                  <path
                    d="M68.8788,13.291 C68.8788,13.291 66.6518,14.025 65.4028,14.567 C64.1568,15.111 64.7798,16.059 64.7798,16.059 C64.7798,16.059 65.4028,17.092 66.8958,16.712 C69.0418,16.143 68.8788,13.291 68.8788,13.291 L68.8788,13.291 Z M74.2588,9.412 C74.6108,14.54 73.8988,18.026 75.4238,20.023 L69.7458,20.023 C69.7458,20.023 69.2278,19.343 68.9578,18.692 C68.9578,18.692 67.4408,20.483 64.1838,20.483 C60.9278,20.483 59.0938,18.584 59.0938,16.143 C59.0938,13.7 60.5078,11.907 65.0508,11.094 C66.8688,10.769 68.4968,10.552 68.5778,9.547 C68.6598,8.542 67.2748,8.353 66.9228,8.353 C66.9228,8.353 64.8478,8.201 64.8258,10.506 L59.5278,10.506 C59.5278,10.506 58.4008,4.663 67.3018,4.663 C67.3018,4.663 73.9068,4.281 74.2588,9.412 L74.2588,9.412 Z M29.4108,13.291 C29.4108,13.291 27.1808,14.025 25.9348,14.567 C24.6858,15.111 25.3118,16.059 25.3118,16.059 C25.3118,16.059 25.9348,17.092 27.4278,16.712 C29.5728,16.143 29.4108,13.291 29.4108,13.291 L29.4108,13.291 Z M34.7928,9.412 C35.1428,14.54 34.4298,18.026 35.9558,20.023 L30.2778,20.023 C30.2778,20.023 29.7628,19.343 29.4888,18.692 C29.4888,18.692 27.9718,20.483 24.7158,20.483 C21.4598,20.483 19.6258,18.584 19.6258,16.143 C19.6258,13.7 21.0398,11.907 25.5798,11.094 C27.4008,10.769 29.0288,10.552 29.1128,9.547 C29.1908,8.542 27.8098,8.353 27.4548,8.353 C27.4548,8.353 25.3798,8.201 25.3578,10.506 L20.0568,10.506 C20.0568,10.506 18.9328,4.663 27.8338,4.663 C27.8338,4.663 34.4388,4.281 34.7928,9.412 L34.7928,9.412 Z M19.7558,0.003 L12.1578,0.003 L6.0758,6.101 L6.0758,0.003 L-0.0002,0.003 L-0.0002,20.019 L6.0738,20.019 L6.0738,14.095 L7.6468,12.469 L12.4258,20.016 L20.3328,20.016 L11.9978,7.981 L19.7558,0.003 Z M123.1618,5.542 L116.2948,5.542 L113.3338,8.982 L113.3338,0 L107.5048,0 L107.5048,20.019 L113.3338,20.019 L113.3338,15.942 L114.0848,15.137 L117.2868,20.013 L124.0158,20.013 L118.0858,10.941 L123.1618,5.542 Z M124.7098,20.016 L130.5398,20.016 L130.5398,5.548 L124.7098,5.548 L124.7098,20.016 Z M124.7098,4.079 L130.5398,4.079 L130.5398,0.005 L124.7098,0.005 L124.7098,4.079 Z M100.4808,13.291 C100.4808,13.291 98.2538,14.025 97.0048,14.567 C95.7558,15.111 96.3818,16.059 96.3818,16.059 C96.3818,16.059 97.0048,17.092 98.4978,16.712 C100.6428,16.143 100.4808,13.291 100.4808,13.291 L100.4808,13.291 Z M105.8628,9.412 C106.2148,14.54 105.5028,18.026 107.0278,20.023 L101.3468,20.023 C101.3468,20.023 100.8328,19.343 100.5618,18.692 C100.5618,18.692 99.0418,20.483 95.7828,20.483 C92.5298,20.483 90.6928,18.584 90.6928,16.143 C90.6928,13.7 92.1128,11.907 96.6548,11.094 C98.4698,10.769 100.0988,10.552 100.1818,9.547 C100.2608,8.542 98.8788,8.353 98.5248,8.353 C98.5248,8.353 96.4498,8.201 96.4308,10.506 L91.1288,10.506 C91.1288,10.506 90.0018,4.663 98.9068,4.663 C98.9068,4.663 105.5078,4.281 105.8628,9.412 L105.8628,9.412 Z M84.4268,10.568 C81.3338,10.162 80.9028,9.894 80.9028,9.217 C80.9028,8.699 81.5228,8.293 82.6368,8.293 C83.7498,8.293 84.4028,9.111 84.5108,9.897 L89.5818,9.897 C89.5818,7.182 87.7918,4.858 82.5008,4.858 C75.0378,4.858 75.4738,9.81 75.4738,9.81 C75.4738,13.854 80.3318,14.269 82.6118,14.61 C84.6468,14.938 84.5898,16.051 84.5898,16.051 C84.5898,16.051 84.6468,17.14 82.7988,17.14 C80.4938,17.14 80.5208,14.959 80.5208,14.959 L75.2008,14.959 C75.2008,19.573 79.2988,20.719 82.7478,20.719 C86.1908,20.719 90.0188,19.527 90.0188,15.864 C90.0188,12.199 87.9808,11.302 84.4268,10.568 L84.4268,10.568 Z M59.7548,5.55 L55.3048,20.013 L49.6348,20.013 L47.3538,12.932 L45.4008,20.013 L39.5138,20.013 L34.5188,5.55 L40.5708,5.55 L42.6318,12.336 L44.7638,5.55 L49.8238,5.55 L51.7778,12.336 L54.0308,5.55 L59.7548,5.55 Z"
                    id="Fill-3"
                    fill="#E60012"
                    mask="url(#mask-2)"></path>
                </g>
              </g>
            </g>
          </svg>
        </div>
      )
    }
    else if (brandId === 'Manitou') {
      return (
        <img
          width="599"
          height="105"
          alt=""
          className="mx-auto"
          src="data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCACNAyADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5Hooor1SAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAyOB3IyB60fgfyrW8G+HZfF3irRNBguY7SbVr6KxSebOyNpHCKSQCQMnnAPHavr7/AIdX+P8A/oa/DP8A5H/+NVm5qO4z4swep4HrnNJXp3x8/Z78Tfs7+LING8ReRcxXUSy2WpWefJnBO0hSQDuDYBBAxkE/KQT5jVKSlsIKKKKoAooooAKXHQ4OD3waQfN05659sdc/Svpr4N/sA+Pfi/4EsfFdve6VoFlf5a1h1ES+bJH/AAy7VRsI3bJz3wBzWbny7gfM209QrEYzkA0lfQf7Q37Fvif9nbwbZeJdc1vR9TtLrUE09ItPEu8O0ckgJDIo24ibvnJHHp8+VSkpbAFFFFUAUUUUAFFFFABkHgcn0o/A/lXU/C/4b6z8XfHekeEtBi8zUdRkMe5uEiABLu5GcKoDEnB6cZJUH6r/AOHWPj//AKGvw1/5H/8AjVQ6kY7lWPiosB3z9OcUte8ftDfsd+L/ANnPQtN1nWLqx1nTLyc2z3Onl9sMmMgPuRcbgGI6/dPQ4z4QQVGT0zyQc496SlfYkSiiitACiiigAooooAXB6jkeucUn4H8q674S/DW++L3xF0Xwhpt1b2V9qkjRpc3eSgKoznOAT0Q9AecV9Tf8Or/H/wD0Nfhn/wAj/wDxqoc4x3GfFWfxpa774yfBHxZ8C/FZ0PxRpptWck213GS1veKOrQyYAYDuOGX+ICuCx26H0/w9fw5pqSlsISiiiqAKKKKAF2n6UmR6jPpnNfY2h/8ABMXx3rui2OpR+KvDipeQR3EauJwwV1DAHEfXBrwH4+fAvV/2e/HSeGNY1Cy1C6e0S9Ethu2bGLADLKpz8h7enNQpxlsM83oooqxBRRRQAUc9AGLemCMfnRX1N8Jf+CfXjH4wfDrRfF+m+I9CsrLVI2kS3u/O3gK7Ic4jIzlT0J4xWbny7gfLJ4xxnPTHNFe0/tH/ALK/iD9mn/hHv7d1bTtV/tz7R5X2Bn/d+T5e7O5FxnzVxjPQ9O/i1UpKWwBRRRVAFLtPUqwGM5INJX0H+zz+xb4n/aJ8G3viXQ9b0fTLS11B9PeLUBLvLrHHISAqMNuJV75yDx6y5KO4z58/A/lR+B/KvtT/AIdY+P8A/oa/DX/kf/41R/w6x8f/APQ1+Gv/ACP/APGqj2sB2Piv8D+VH4H8q+1P+HWPj/8A6Gvw1/5H/wDjVH/DrHx//wBDX4a/8j//ABqj2sAsfFf4H8qPwP5V9qf8OsfH/wD0Nfhr/wAj/wDxqk/4dY+P/wDoa/DP/kf/AONUe1iFj4s/A/lS4+XcMkeuDX2l/wAOsfH/AP0Nfhn/AMj/APxqud+In/BOXxr8OfA+u+J73xLoF1aaRaSXskUBmLsiLkhQYwCfTJH1pe1iFj5OooorYkKKKKAEBz7fUgUv4H8q9v8A2cv2TvEf7Slnrtzoes6XpSaTJFHIL/fljIGK7dqNn7hznHavZf8Ah1h4/wD+hr8M/wDkf/41WXtEtyrHxX+B/Kj8D+Vfan/DrHx//wBDX4a/8j//ABqj/h1j4/8A+hr8Nf8Akf8A+NUe1gFj4r/A/lR+B/KvtT/h1j4//wChr8Nf+R//AI1R/wAOsfH/AP0Nfhr/AMj/APxqj2sAsfFf4H8qPwP5V9qf8OsfH/8A0Nfhr/yP/wDGqP8Ah1j4/wD+hr8Nf+R//jVHtYBY+K/wP5UV9qf8OsPH/wD0Nfhn/wAj/wDxqvjG8tXsbye2kKmSGRomK9MqcHHtTU1LYRDRRRWggooooAPwP5UH5Rkj5fUEGvtT/h1f4/8A+hr8M/8Akf8A+NV8zfGz4Q6l8DfiJfeENVvLW/vrOOKR7iy3bCJEDrjcoOcHnjrUKpGWwzhKKKKsQUUUUAFHP91seuMUV9IfAn9hnxX8fPh/D4r0jXdFsLOWeS3WG+83zNyHBJCowx+NS5KO4HzjtP8AkGm17v8AtEfsg+I/2bNE0bUtc1nSdVj1GdreNbESbgyruJbcq8Y9M14RQpKWwBRRRVAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAdl8GDt+MHgbHAOvWORjIz9pSv3Y69K/Cb4M/8lg8Df9h+x/8ASlK/dha4q25Z5j+0J8CdJ/aA+Hd54c1IRwXq7pdO1IJmSznwQGX2IJVh/EpI9Mfi9418H6t8PfFOpeHdetGsdW0+YwTQP/exkYPcMCCD0wQeMjP7qeGfG2keLjqa6Xdrcyabey6fdxjhoZo2KsrDtyOPUEHoQa+Zv27P2V0+L3hN/GHh61B8Z6NC2Yo1+bUbYctCf9oHlT3GUOAQVinNxlYR+VVFKVIZlxypw2eMduc+/H1+hwldvMyQo9/TO7JxgjtRXbfBX4Q618cfiHpnhbRY8y3TI0t0y5W1t1+/M35jr1yB1IBbko7getfsX/svy/Hvxx/aWrwyL4L0eSN76TBC3k2MrbD1BHLnsMf3lz+uEFitnbw29ukcMEKhY40XaqKOAFA6AdAOmOK5b4W/DbRPhH4H0vwroNqsGn6fHtB6vM+cvK57s7Ek+h4HAGOotNWtL+S6jt50me1l8mdVIJjk2q21vQ7XU/jXBOTk/Io+Rv8AgqN/yb/4d/7Ge3/9I7uvy5r9Rv8AgqN/yb/4d/7GeD/0ku6/Lmuij8NxBRRRXSIKKKKACg5HUep6joByfoOn1or6O/Yf/Z2b44fE5L7VLcN4S0Fo7y93D5LmUsTHAf8AfIZiOyjnqoObny7gfXn/AAT3/Z1Hwz8BnxrrVtt8S+I4EeGOZcNaWRwUUdwZcK7fRR2r60uNYs7O4t4J7iOCW5k8qBJXCmZ9rNtQE8najHA7A+hwN/o8YHRVHUdAM8jB6Z5A7ADrX5RftcftX6p8QvjdY33hDVpLbRPCNwf7JuoWyJJ1CtJcEY+YFhsXPVF5wWYVxJOoyz9PfiV8P9K+KngnV/C2uwefpupQtC4/iTkbXX3UgNn8K/E74r/DPVvg/wDETWfCespi+0+YRrIF2iaMjKOvqrDBB/PBBA/Y/wDZ7+NWnfHj4X6T4psfLiuJQYL+zjOfs10uBJH645DA91ZT3rxH/goN+zn/AMLQ8Ajxhott5vifw7C7ypGvz3dlnLJ7mPl1/wCBD+KqpvllZisfljRSbvQZ6n5SDxjg/Q9B70tdnMyQoooqwCiiigD3P9iH/k6jwB/19zf+k01fsuc1+NH7EP8AydR4A/6+5v8A0mmr9mK4KvxFnJfED4ceHPin4VuvDvifSodW0i5UbopU5Qjo6N1VgehGCK/Lv9p79iHxJ8EGudb0EXHiPwQ3W6SPdcWa/wB2dAPmX/pquK+ofgh+31pereNtT8GfEOSDR76DUJ7ay1oDZbTbZSBHMP8Alk+B94/L719hfuL2D5mS4hlGMcMrr0z3yOfpRGUqYj8AVYNgg8d+f09/wyD2pa/Rr9qb/gnla68bzxX8LYI7HUcebP4dzthuPe3Y/wCrP+wcL/dMdfnfqml3mh6ldafqFrNY39rKYZ7W4QxyRuOqsDjBHf0711RqKewWKtFFFaEn70fDv/kQfDP/AGC7b/0UlfmX/wAFNP8Ak4y3/wCwDb/+jJq/TT4d/wDIg+Gf+wXbf+ikr8y/+Cmn/Jxlv/2Abf8A9GTVw0viLPkuiiiu8gKKKKACv2W/Yh/5NZ8A/wDXrN/6UzV+NNfst+xD/wAms+Af+vWb/wBKZa5K3w3Gj5v/AOCsH/NK/wDuKf8AtnX581+gv/BWD/mlf/cU/wDbOvz6q6Pw3AKKKK6BBX6Of8E5Piv4J8CfA/XrDxJ4w0Hw/eyeI7iaO21XU4LWV4/stqN4SRg2Mqw6dq/OOl3Ecg7TnjaWXAPJGc5657+lYSjz7jP3I/4aI+Ff/RS/CH/g9tf/AI5R/wANEfCv/opfhD/we2v/AMcr8Ncewox7Cs/YBc/ctP2hfhbK4SP4j+EndiFCrrlqSSTjp5leg1+Afh1dviLS+xF3GM8dC9fv2vSsJx5dijjfEHxq+H3hPVp9L1zxz4c0bU4MebZ6hq1vbzJlQwyjuDyCD07iqH/DRHwr/wCil+EP/B7a/wDxyvy3/b4/d/tZePMEgn7BnJPawtx1GD0x39a+fcewrWNG8biufuV/w0P8Kv8AopfhD/we2v8A8crzT9pD46/DbXvgP4/0/TfiB4Wv7+40W6ihtbbWraSWRyhAVVEmSSfavyAx7CjkY28FQFXn06HIAOfxq/YiuLRRRXUIKKKKAP0U/wCCUv8AyL/xF/6+rH/0CavuPxB4n0jwnpM2qa5qdpoumwFfNvNQnWCFNzBRudiFGSQOvcV8Of8ABKX/AJF/4i/9fVj/AOgTV7f+33Gf+GTvHJzwPsGRk84v7cjoR3xXnTV5WLPRv+GiPhX/ANFL8If+D21/+OUf8NEfCv8A6KX4Q/8AB7a//HK/DXHsKMewrb2BNz9yv+GiPhX/ANFL8If+D21/+OUf8NEfCv8A6KX4Q/8AB7a//HK/DXHsKMewo9gFz9yv+GiPhX/0Uvwh/wCD21/+OVc0L43fDzxRq0Gl6N468N6tqU5KxWdhq9vPK+Bk4RHJPHtX4U49hXuf7Ef/ACdN4Bzgn7VMBx2+zSnqST1A71MqLQ7n7MdOtfgL4g/5GLUv+vub/wBDr9+Wr8BvEH/Ixal/19zf+h0UdxmfRRRXaQFFFFID+goV+RH/AAUM/wCTpvEv/XrY/wDpMlfrvX5Ef8FDP+TpvEv/AF62P/pMlcNL4iz5sooorvICiiigAr9Zf+Cbv/Jslh/2E7z/ANDr8mq/WX/gm7/ybHYf9hO8/wDQ6563w3GcB/wVU/5J/wCBv+wpN/6Jr82a/Sb/AIKqf8k+8Df9hSb/ANE1+bNFH4bgFFFFdAgooooAKKKKACiiigAooooAKKKKACiiigDsfgz/AMlg8Df9h+x/9KUr92Fr8J/gz/yWDwN/2H7H/wBKUr92Frirbos/LbT/ANpC9/Z3/bO+Id1cSS3HhbUteuYNVtQSfl85tsyjpvTdxnGRlSRwR+nWk6xZa9ptpqOmzpeWV3EtxBcRNlZI3AIYexBB/GvxW/ai+X9o74knHP8Abl0uVOM4lz0r6U/4J6/tSHw/fwfC7xTehNJuZf8AiR3UzZFtOxJa2JP8Lkll9CWHRvlJwuuZCuUP+Cgn7LK+CtYm+JXhizWPQdQlI1a2iXC2dw/AkCjokrHk9FbP97j4p6HB452/j6V++muaDp/ibRL3S9WtIb+wvIGgubeZMrJGeGBH459j0r8c/wBqn9nO+/Z3+IRsP3lx4Y1BTJpN6/IkjUgPCxwMOuQT7MCM5qqU7q0twseQabpt1rGo2thYW8l5e3UiwwW8KlnkkYgBAo5zkgfiO3NfsL+yL+zTafs9fD0R3MUc/i/VAJtUvQASO6wIeyLn8SSxxkAeGf8ABPb9lf8A4R+xh+KHiq0xql1H/wASW1mTDW0TA7rg/wC06nCj+EFj/H8v2P8AEH4haN8MPB2qeJ9fuRZ6Xp0RlkbGDIw4CKCeWY4AHckdqmpLmlZBY82/ar/aKsP2dfhvNfhop/E+obotJ09znfJ/FIw7IgO49eSAASQDwf8AwTp1bUPEnwO1XVtTunvr+88R3k9xcTHLyyssRZ29ck5x24A4r85Pjt8aNZ+PXxE1DxRrDvEkn7qzsVfKWkA+4i+/PJ7klu4C/on/AMEzf+Tc7n/sPXP/AKBDU8vLAZQ/4Kjf8m/+Hf8AsZ4P/SS7r8ua/Ub/AIKjf8m/+Hf+xng/9JLuvy5raj8BIUUUV0iCiik3DnnkEqfY+lAGt4V8Man408R6doWjWr3up6hMkFtBHyXZ+Qfpjk+g+hx+1XwB+C+nfAn4Y6V4V04JLNCPNvrzGDdXTAeZKfXkAAdgq+lfKn/BN39nb+ytMf4q65af6VfK9vokTr/qoScS3AHUFzlR6AMejZr7K+J/xG0f4U+BdX8Wa5L5em6dD5jAY3OxIVI1BIyzsyqB6sMkDmuGo+aVkUfNf/BQj9oz/hWvgUeCNDudnifxFERcPG+HtLE5DsPRpNrRqew3HjjP5ajPfkgDHGBx0H0rq/ih8StX+LfjzWfFeuS777UZi4jBysMeAFhU/wB1QAv5nqa5SuilFRFc+if2Jv2ij8CfijFBql15fhHXjHa6j5jfJA2SIrgDtsJIb1Vj1O0D9d3ZJ4xgq8Ug69QQT9OQePwNfz/Mu724OeMhsjofbNfqL/wTy/aM/wCFjeCW8Ca5deb4k8PwA2skjDfeWQICc9zFuWMk9RtPrjKtHW6C58lftwfs6n4I/E9tS0u3EfhPX3a5sViGEtpg2ZYP+AkhgO4Ps2PnCv3C+PXwX0347fC/V/CmohIpZ18yyvCMm2uVB8uQfiSD6hm9a/FHxV4Z1LwX4m1PQNXtXtNU064e1uIGHKupwceox8wPcfUA3TlzKz3HYy6KKK6CQooooA9z/Yh/5Oo8Af8AX3N/6TTV+y9fjR+xD/ydR4A/6+5v/Saav2Xrgq/EWfgt8Rlz4+8UA8g6ncjBOV/1z8Y9PY5r6C/Zf/bm8QfBWS10DxM0/iXwUx2rGz5u7JfWN2+8P9gkAdiK+fviL/yP/if/ALClz/6Oeud+pyD1UjiuiUVLcm5+8fgL4g+Hfih4Zttf8Marb6vpVwMrNC2dpHVXU8ow7q2CO4ry79pL9kjwl+0Rpz3NzGujeKoY/Lttct4gznHRJl/5ap7HBHZhX5X/AAX+O3i34D+Jk1nwxftCHYC6sJSWt7qMdEkXvj+9ww7Fa/VT9nH9rLwj+0NpKR2Ui6V4lgTN1otw4MqH+9Gc/Ovv19q5ZRcdij8pfjB8EfF3wM8UHQ/FenG2lck213CS1teKOrQyEDcB3HDL/EBXCY7dD6f4ev4c1+73xB+G/hv4peFbrw74o0uDVtIuQA0Mi8oR0dG6ow7MCMV+XX7Tv7EPiP4Itc61oIuPEfghut0kZa4s1/uzoB8y/wDTVcV0QqOW4rH6nfDv/kQfDP8A2C7b/wBFJX5l/wDBTT/k4y3/AOwDb/8Aoyav0z+Hbj/hAvDH/YMth/5BX/CvzM/4Kaf8nGW//YBt/wD0ZNWVL4xnyXRRRXcQFFFFABX7LfsQ/wDJrPgH/r1m/wDSmWvxpr9lv2If+TWfAP8A16zf+lMtclX4Bo+bv+CsH/NK/wDuKf8AtnX59V+gv/BWD/mlf/cU/wDbOvz6q6XwAFFFFdAgoooqbIAooopgaHh//kYtN/6+4f8A0Ov36XpX4C+H/wDkYtN/6+4f/Q6/fpa46ysyz8d/2/P+TtPHn/bj/wCkFtXz7X0F+35/ydp48/7cf/SC2r59reC9wkKKKK1EFFFFMAooooA/RT/glL/yL/xF/wCvqx/9Amr3L9vz/k0vx3/24/8ApfbV4b/wSl/5F/4i/wDX1Y/+gTV7h+34wH7Jfjsnj/jxzk9P9Ot/8/jXBL4yz8e6KPwb/vk/4Ufg3/fJ/wAK7LogKKPwb/vk/wCFH4N/3yf8KLoAr3P9iH/k6jwB/wBfc3/pNNXhn4N/3yf8K9y/YiP/ABlN8P26qbubBH/XtN260p25bjP2XavwG8Qf8jFqX/X3N/6HX78tX4DeIP8AkYtS/wCvub/0OuajuyjPooortICiiikB/QVX5Ef8FDP+TpvEv/XrY/8ApMlfrvX5Df8ABQpw37UniRsHabSxxkY/5dk7Vw0viLPm6ij8G/75P+FH4N/3yf8ACu7mRAUUfg3/AHyf8KPwb/vk/wCFLmQBX6y/8E3f+TY7D/sJ3n/odfk1+Df98n/Cv1l/4Jvnb+zLYDqf7TvPunP8fr0rnq/AVY4D/gqp/wAk+8Df9hSb/wBE1+bNfpN/wVU/5J94G/7Ck3/omvzZ4yBnqCQfXFVS+AQUUHKkghlPoykHPpg9/rSbuv8AsjnHODtzj61rzMQtFFFWAUUUUAFFFFABRRRQAUUUUAFFFFAHY/Bn/ksHgb/sP2P/AKUpX7srX4NfDTWLPw78R/CurahOtvYWOr2dzcTEE7I1mVy2AM8AHt1r9YP+G/PgN/0Pf/lIv/8A4xXHVTbViz8zP2pP+TjfiR/2H7z/ANDry9JHjdGRirocq6nawI+6QR0I7Gu7+PfifTPGvxo8aa/otyb3SNT1ee5tLny3jEsbtkMA4BHvkCuCrdbWIP1l/Yd/aiT43+DP+Ef1+8DeNtFiX7QXbDX0AwBcgf3s8OOxI6ggn3H4j/Cnwv8AFjSLbS/FWlR6rZ213FfRwzE4WSNsqwPYYLKQOqsR6Y/E34d/EDWfhf4z0rxPoFy1nqmnTCWNvvBxjDRt6qwJVh/Fkngkbf1J8Lf8FCvg1qnh+wutY8StoerSW6SXWmSabdzPbSfxrujiYMPTBNc06bTvEs+kf3Fjbn7sMEI6AAKqjp7BR+XHpX5QftxftRSfHDxp/wAI/oF0f+EJ0WUrE6N8t/OoIa4I7qASqemWOMv8vrH7Zn7cmieMvA6+Efhjq099Dqisur6rFbTwGODoYE3qrbn4yccAFRneSPgge/JxxxgLnqB7VVOGt5E3Cv1V/wCCZn/JuVz/ANh65/8AQIa/Kqvv/wDYb/ak+GPwb+C83h/xh4m/sfV31aa6FsbG5lPlssYBzHGw/gPetaqbVkM9H/4Kjf8AJv8A4d/7Ge3/APSS7r8ua+8/28v2nvhp8avhFo2g+DfEn9s6tb65FeyWq2NzERCttcIXzJGoxmRO/wDEK+DKVJNKzEFFFFdAgr1/9lv4D3X7QPxSsdF2P/Ylqq3Wq3K8eXbD+DP95zwv45xg48gr7o/YL/aL+FfwQ+GmvWPjDXY9G8SX2sGdlbTrmV5bYQRBDujjYYDGdsZ6s/rWU3JfCM/RHT9LtdLsbazs4EtrO3RIYoI1AVI1AVVA7DAA+gr8xf8AgoV+0UPiJ46HgTQ7hZPD3h6ci6kibK3N8QVLccERZKj/AGmf1BX3z9oT/goN4Fh+GOp2/wANPET6r4svkNvbPHY3EX2NWG1rjMkajKjkD1r8xHLSMSzs+TnLHLc8tk9yW+Yn1rCnHW8h3CiiiupJIkK6f4Y/EXWPhP450jxVoc3lX+mziZY84WVcENCx/uMCV/I9RXMUUWTA/dr4W/ErR/i14F0jxVokvmWWowbwvG6JwSHjYA4DKwIIBPTjIIJ+Pv8AgpD+zsmsaTF8UtCtz9t08Lb62kYyZbcD91MfXYcAnqQV/u14d+wz+1XZ/AnXtR0HxZfPbeCtTAufM8t5Psd0FGX2KCwDqArAD+FT619o337dH7P2qWl1aXvjWK6s7mNopYZNFviroRgqR5HI5P51xWlCehZ+Q+09xjr19qSrGoNbfb7k2v8Ax7iRvKI/iBqvXeQFFFFAHuf7EX/J1HgD/r7m/wDSaav2Xr8Sv2W/G+i/Df4+eEvEniK8/s/RtOuJHurjy3kMYaGRB8iAseXHQHjNfph/w358Bv8Aoe//ACkX/wD8Yriqxbd0Wfk58Rf+R/8AE/8A2FLn/wBHPXO1s+M9St9X8Ya9e2knnW1xfyyxyYIyrSMwPPsRWNXQQFW9G1nUPD2rWmp6ZeTWGoWbb7e7tpCk0beoYdvaqlFaOzHc/R/9lr/goNZ+KTZeFvibcQaXrGfKt9f27Le5b+7OOkUn+0flr7e/cXkHzMlxDKOnDK69M98jn6V+AXHIPIIxz936bfT2Oa+o/wBl/wDbm8QfBWS10DxM03iXwUx2rGz5u7JfWN2+8P8AYJAHYiuWpT/lC5+sFtaR2lukEEaRQxgIiIMBVHAA/Cvyw/4Kaf8AJxlv/wBgG3/9GTV9op+398CGRCfHDIW/hbSL7I+v7ivz/wD25Pi14U+Mnxnh8QeD9VGsaQukRWxuVgkiHmK0hK4kVT/GO3rWdNSTuyj56ooorvICiiigAr9lv2If+TWfAP8A16zf+lM1fjTX6Yfss/tifCL4cfATwl4a8ReLDp+s6fbyJdW/9mXcgjLTSOPnSIqeGHQmuSqm1ZDRyn/BWD/mlf8A3FP/AGzr8+q+w/8AgoR8fvAfxy/4QL/hCNbbXP7J/tD7ZtsriHyvM+y+X/rI1zu2PjGfumvjytKaahqAUUUVuIKKKKACiiigDQ8P/wDIxab/ANfcP/odfv10r8ANGuY7XWLC4lbZFHcRu7H+EK2Tmv17/wCG/vgN/wBD3/5SL/8A+MVx1k5PQo/Pv9vz/k7Tx5/24/8ApBbV8+17D+154+0H4o/tDeLPE3hi/Gp6JqH2P7NdeVJF5m2ygQ4R1DcMrDp2rx6t6e1hBRRRWogooooAKKKKAP0U/wCCUv8AyL/xF/6+rH/0Cavrb46fCaL43fCzWvBU2pvo8WpeT/psUIlaIxzJMuEJAPMa96+BP+Cf/wC0J4B+BukeMbfxtrraJLqdxZvaBrK4m8wKsgP+rjbGNw64r63/AOG/vgN/0Pf/AJSL/wD+MV581Lmuizw7/h1FpX/RRrv/AMFCf/HaP+HUWlf9FGu//BQn/wAdr3H/AIb++A3/AEPf/lIv/wD4xR/w398Bv+h7/wDKRf8A/wAYpc0xWPDv+HUWlf8ARRrv/wAFCf8Ax2j/AIdRaV/0Ua7/APBQn/x2vcf+G/vgN/0Pf/lIv/8A4xR/w398Bv8Aoe//ACkX/wD8Yo5phY8O/wCHUWlf9FGu/wDwUJ/8drtPgv8A8E77D4O/E7QvGcPja41OfS5Hf7LJpyRiXcrrywckcP6dq73/AIb++A3/AEPf/lIv/wD4xR/w398Bv+h7/wDKRf8A/wAYo5ptWCx9Cfer8BfEH/Ixal/19zf+h1+u3/Df3wG/6Hv/AMpF/wD/ABivyE1m5jutYv7iJt8UlxI6MP4gzZGK1opp6gVKKKK7CQooopAf0FV8nfH39gSx+O3xO1DxlP4yuNGnu44Y2tY9PSYDy1VVO4uD29K63/hv74Df9D3/AOUi/wD/AIxR/wAN/fAb/oe//KRf/wDxivOjzRd0WeHf8OotK/6KNd/+ChP/AI7R/wAOotK/6KNd/wDgoT/47XuP/Df3wG/6Hv8A8pF//wDGKP8Ahv74Df8AQ9/+Ui//APjFPmmKx4d/w6i0r/oo13/4KE/+O0f8OotK/wCijXf/AIKE/wDjte4/8N/fAb/oe/8AykX/AP8AGKP+G/vgN/0Pf/lIv/8A4xRzTCx4d/w6j0r/AKKLd/8AgoT/AOO19T/s8/BGH4A/DiDwlBq0msxRXMlwLmSBYTl2yRtBNcT/AMN/fAb/AKHv/wApF/8A/GKP+G/vgN/0Pf8A5SL/AP8AjFDc5KzGePf8FVP+SfeBv+wpN/6Jr4L+EvgW3+IXji30y/vH03RoYJ9S1K+iXc0NnbQPNMVHdisbYHc9cda+rP2/f2jPh58b/B/hWx8E+IDrdzY6hJLcRrZXEOxWj2g/vI1718pfCfx5H8OfG1tq11Zf2npkkM9jqWn79v2q0nieKZQ38L7JGw1dELqnpuSfTOufC/wHpvgmTVo/A+lt4Yt9FsNcuYxLqUOqxWt0I8Ol4zfY5p8zL+7CBCQ2FOK+Yfit4Gj+G/j7VNBhv11KztzHPZ3wTYZrWWNJreQjsTFIhI6819I6p8RPh3rWj6hpWr/EVdV8AXGm6fYQeGv7LuzrFpcWcMcUc8SlRAtwyRlWbzNh3nO4ALXzd8VPHI+JPjzVfEK2K6bb3LRx2tkrl/s1vFGkUUe7+MrEiruP90VcbvcdjlKKKK2JCiiigAooooAKKKKACiiigAooooAXcQxI4OCBg4K57Z7ik59f5/40UVOg7h/EWBw2Mbskk+xJJyKKKKLIQUf3QCQF5HoD7AYxRRVDuN2DIJVM567QSPfJ6mnUUUtBBQuQu3ouMbVwB9MADiiigAb51YHpu3beCpORyQR6Dp7CiiigAooopgFC/IqgdN27bwFByeQAPQ9Pc0UUgBvnDA/XPBBPqQR+lFFFGgBRRRTAKKKKAF9cEj0GThfm9iCePek59f5/40UUnZu47g3zdTkY4XGADRRRTEFFFFACYPy852jjOcA+2CCPzpefX+f+NFFToO4p5ORnd03Mc4H0pKKKLIQUUUVQBR9TkHqpHFFFIA578k9WJOf50rMS27cxbOdzMSfrk55pKKNB3CiiimIKKKKACl4+XqNp4OeQPbGAPypKKnQBCob7+H9MqOOmMZzjHOPqaWiiq6WAKKKKACiiigAooooAF+XocDHK4yCaOfX+f+NFFToANll2kkjnPJxzuPGSSOW9e1FFFCSQBRRRVAFFFFABRRRQAgXbu2jaWBywxkk9c4AzS8+v8/8AGiiloO4c+v8AP/Gjn1/n/jRRU8qC4c+v8/8AGjn1/n/jRRRyoLhz6/z/AMaOfX+f+NFFHKguHPr/AD/xob5upyMcLjABoop6CCiiiqAKKKKADn1/n/jRz6/z/wAaKKjlQ7hz6/z/AMaOfX+f+NFFHKguHPr/AD/xo59f5/40UUcqC4c+v8/8aOfX+f8AjRRRyoLgfmBDfMvQKQPlH1IOaKKKaSQhNvy4ySMbccAY9OnT2paKKa0HcKKKKYgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKLgFFFFFwCiiii4BRRRRcAoooouAUUUUXAKKKKLgFFFFFwCiiii4BRRRRcAoooouAUUUUXAKKKKLgFFFFFwCiiii4BRRRRcAoooouAUUUUXAKKKKLgFFFFFwCiiii4BRRRRcAoooouAUUUUXAKKKKLgFFFFFwCiiii4BRRRRcAoooouAUUUUXAKKKKLgFFFFFwCiiii4BRRRRcAoooouAUUUUXAKKKKLgFFFFFwCiiii4BRRRRcAoooouAUUUUXAKKKKLgFFFFFwCiiii4BRRRRcAoooouAUUUUXAKKKKLgFFFFFwP//Z"
        >
        </img>
      )
    }
    if (brandId === 'Spyder') {
      return (
        <img
          width="300"
          height="166"
          className="mx-auto"
          src="https://logovectorseek.com/wp-content/uploads/2020/09/can-am-logo-vector.png"
          alt="srry"
        />
      )
    }
    if (brandId === 'Suzuki') {
      return (
        <img
          width="250"
          height="150"
          className="mx-auto"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Suzuki_logo_2.svg/500px-Suzuki_logo_2.svg.png"
          alt="steve"
        />
      )
    }
    if (brandId === 'BMW-Motorrad') {
      return (
        <>
          <img
            width="150"
            height="150"
            className="mx-auto"
            src={BMW}
            alt="steve"
          />
        </>
      )
    }
    if (brandId === 'Harley-Davidson') {
      return (
        <img
          className="mx-auto "
          src={Harley}
          alt="steve"
        />
      )
    }
    if (brandId === 'Triumph') {
      return (
        <img
          src="https://media.triumphmotorcycles.co.uk/image/upload/f_auto/q_auto/sitecoremedialibrary/media-library/misc/misc-images/logo.svg?la=en-US"
          alt="Triumph Logo">
        </img>
      )
    }
    if (brandId === 'Indian') {
      return (
        <p>Coming Soon</p>
      )
    }
    if (brandId === 'KTM') {
      return (
        <p>Coming Soon</p>
      )
    }
    if (brandId === 'Yamaha') {
      return (
        <p>Coming Soon</p>
      )
    }
    else if (brandId === 'Switch') {
      return (
        <img
          width="300"
          height="166"
          alt="steve"
          className="mx-auto"
          src="https://searchlogovector.com/wp-content/uploads/2020/04/sea-doo-logo-vector.png"
        />
      )
    }


  }
  return (
    <div>
      <nav
        className={cn("sm:flex hidden  flex-col items-center gap-4 px-2 sm:py-4 mt-10",)}    >
        {mergedFinanceList && mergedFinanceList.map((item, index) => {
          const brand = item.brand
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  to={`/dealer/customer/${item.clientfileId}/${item.financeId}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 "
                >
                  <Button variant="ghost" className="bg-transparent    hover:bg-transparent">
                    <div className="h-5 w-5 flex justify-center">
                      <FaMotorcycle className='text-foreground text-3xl mx-auto' />

                    </div>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">  <div className='m-4'>
                <p>{item.year} {item.brand}</p>
                <p>{item.model.toString().slice(0, 28)}</p>
                <Badge className="">{item.customerState}</Badge>
              </div></TooltipContent>
            </Tooltip>

          );
        })}
      </nav >
      <nav
        className={cn(" sm:hidden flex  items-center gap-4 px-2 sm:py-4 mt-[10px] ml-[50px] ",)}    >
        {mergedFinanceList && mergedFinanceList.map((item, index) => {
          const brand = item.brand
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  to={`/dealer/customer/${item.clientfileId}/${item.financeId}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 "
                >
                  <Button variant="ghost" className="bg-transparent    hover:bg-transparent">
                    <div className="h-5 w-5 flex justify-center">
                      <FaMotorcycle className='text-foreground text-3xl mx-auto' />

                    </div>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">  <div className='m-4'>
                <p>{item.year} {item.brand}</p>
                <p>{item.model.toString().slice(0, 28)}</p>
                <Badge className="">{item.customerState}</Badge>
              </div></TooltipContent>
            </Tooltip>


          );
        })}
      </nav >
    </div>

  )
}


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: second },
  { rel: "stylesheet", href: timeline },
  { rel: "icon", type: "image/svg", href: '/user.svg' },
];
function SimplerStaticVersion() {
  return (
    <p>Not working contact support...</p>
  )
}

async function GetMergedWithActivix(financeId) {
  try {
    const financeData = await prisma.finance.findUnique({ where: { id: financeId, }, });
    const activixData = await prisma.activixLead.findUnique({ where: { financeId: financeId } })
    const newData = {
      ...activixData,
      ...financeData,
    };
    console.log('newData:', newData);
    return newData
    return newData;
  } catch (error) {
    console.error("Error fetching dashboard entries by financeId:", error);
    throw new Error("Failed to fetch dashboard entries by financeId");
  }
}

async function PullActivix(financeData) {
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYzFkZTg5NzMwZmIyYTZlNmU1NWNhNzA4OTc2YTdjNzNiNWFmZDQwYzdmNDQ3YzE4ZjM5ZGE4MjMwYWFhZmE3ZmEyMTBmNGYyMzdkMDE0ZGQiLCJpYXQiOjE3MDI1NzI0NDIuNTcwMTAyLCJuYmYiOjE3MDI1NzI0NDIuNTcwMTA0LCJleHAiOjQ4NTgyNDYwNDIuNTI2NDI4LCJzdWIiOiIxNDMwNDEiLCJzY29wZXMiOlsidmlldy1sZWFkcyIsIm1hbmFnZS1sZWFkcyIsInRyaWdnZXItZmxvdyIsIm5vdGVzOmNyZWF0ZSIsIm5vdGVzOnVwZGF0ZSIsIm5vdGVzOnZpZXciXX0.ZrXbofK55iSlkvYH0AVGNtc5SH5KEXqu8KdopubrLsDx8A9PW2Z55B5pQCt8jzjE3J9qTcyfnLjDIR3pU4SozCFCmNOMZVWkpLgUJPLsCjQoUpN-i_7V5uqcojWIdOya7_WteJeoTOxeixLgP_Fg7xJoC96uHP11PCQKifACVL6VH2_7XJN_lHu3R3wIaYJrXN7CTOGMQplu5cNNf6Kmo6346pV3tKZKaCG_zXWgsqKuzfKG6Ek6VJBLpNuXMFLcD1wKMKKxMy_FiIC5t8SK_W7-LJTyo8fFiRxyulQuHRhnW2JpE8vOGw_QzmMzPxFWlAPxnT4Ma6_DJL4t7VVPMJ9ZoTPp1LF3XHhOExT2dMUt4xEQYwR1XOlnd0icRRlgn2el88pZwXna8hju_0R-NhG1caNE7kgRGSxiwdSEc3kQPNKDiJeoSbvYoxZUuAQRNgEkjIN-CeQp5LAvOgI8tTXU9lOsRFPk-1YaIYydo0R_K9ru9lKozSy8tSqNqpEfgKf8S4bqAV0BbKmCJBVJD7JNgplVAxfuF24tiymq7i9hjr08R8p2HzeXS6V93oW4TJJiFB5kMFQ2JQsxT-yeFMKYFJQLNtxsCtVyk0x43AnFD_7XrrywEoPXrd-3SBP2z65DP9Js16-KCsod3jJZerlwb-uKeeURhbaB9m1-hGk"
  async function CallActi() {
    try {
      const response = await axios.get(`https://api.crm.activix.ca/v2/leads/${financeData.activixId}?include[]=emails&include[]=phones&include[]=vehicles&include[]=events`, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${accessToken}`, }
      });
      return response.data; // Return response data directly
    } catch (error) {
      console.error('Full error object:', error);
      console.error(`Activix Error: ${error.response.status} - ${error.response.data}`);
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response:', error.response.data);
      throw error; // Throw error to be caught by the caller
    }
  }
  const formData = await CallActi();
  try {
    const activixIdString = formData?.id.toString()
    const findFinance = await prisma.finance.findFirst({ where: { activixId: activixIdString } })
    const financeData = await prisma.finance.update({
      where: { id: findFinance?.id },
      data: {
        firstName: formData.first_name,
        lastName: formData.last_name,
        name: formData.first_name + ' ' + formData.last_name,
        email: formData.emails[0].address,
        phone: formData.phones[0].number,
        address: formData.address_line1,
        city: formData.city,
        postal: formData.postal_code,
        province: formData.province,
        year: formData.vehicles[1].year,
        brand: formData.vehicles[1].make,
        model: formData.vehicles[1].model,
        model1: formData.model1,
        color: formData.vehicles[1].color_exterior,
        modelCode: formData.modelCode,
        msrp: formData.vehicles[1].price,
        tradeValue: formData.vehicles[0].price,
        tradeDesc: formData.vehicles[0].model,
        tradeColor: formData.vehicles[0].color_exterior,
        tradeYear: formData.vehicles[0].year,
        tradeMake: formData.vehicles[0].make,
        tradeVin: formData.vehicles[0].vin,
        tradeTrim: formData.vehicles[0].trim,
        tradeMileage: formData.vehicles[0].odometer || '',
        trim: formData.vehicles[1].trim,
        vin: formData.vehicles[1].vin,
      }
    })
    const dashboardData = await prisma.dashboard.update({
      where: { id: financeData.dashboardId },
      data: {
        referral: formData.referral,
        visited: formData.visited,
        bookedApt: formData.bookedApt,
        aptShowed: formData.aptShowed,
        aptNoShowed: formData.aptNoShowed,
        testDrive: formData.testDrive,
        metService: formData.metService,
        metManager: formData.metManager,
        metParts: formData.metParts,
        sold: formData.sold,
        depositMade: formData.depositMade,
        refund: formData.refund,
        turnOver: formData.turnOver,
        financeApp: formData.financeApp,
        approved: formData.approved,
        signed: formData.signed,
        pickUpSet: formData.pickUpSet,
        demoed: formData.demoed,
        delivered: formData.delivered,
        status: formData.status,
        customerState: formData.state,
        result: formData.result,
        timesContacted: formData.timesContacted,
        nextAppointment: formData.nextAppointment,
        followUpDay: formData.followUpDay,
        state: formData.state,
        deliveredDate: formData.deliveredDate,
        notes: formData.notes,
        visits: formData.visits,
        progress: formData.progress,
        metSalesperson: formData.metSalesperson,
        metFinance: formData.metFinance,
        financeApplication: formData.financeApplication,
        pickUpDate: formData.pickUpDate,
        pickUpTime: formData.pickUpTime,
        depositTakenDate: formData.depositTakenDate,
        docsSigned: formData.docsSigned,
        tradeRepairs: formData.tradeRepairs,
        seenTrade: formData.seenTrade,
        lastNote: formData.lastNote,
        dLCopy: formData.dLCopy,
        insCopy: formData.insCopy,
        testDrForm: formData.testDrForm,
        voidChq: formData.voidChq,
        loanOther: formData.loanOther,
        signBill: formData.signBill,
        ucda: formData.ucda,
        tradeInsp: formData.tradeInsp,
        customerWS: formData.customerWS,
        otherDocs: formData.otherDocs,
        urgentFinanceNote: formData.urgentFinanceNote,
        funded: formData.funded,
        countsInPerson: formData.countsInPerson,
        countsPhone: formData.countsPhone,
        countsSMS: formData.countsSMS,
        countsOther: formData.countsOther,
        countsEmail: formData.countsEmail,
      }
    })
    const data = formData
    const activixData = await prisma.activixLead.update({
      where: { id: financeData.theRealActId, },
      data: {
        account_id: data.account_id.toString(),
        customer_id: data.customer_id.toString(),
        appointment_date: data.appointment_date,
        phone_appointment_date: data.phone_appointment_date,
        available_date: data.available_date,
        be_back_date: data.be_back_date,
        call_date: data.call_date,
        created_at: data.created_at,
        csi_date: data.csi_date,
        delivered_date: data.delivered_date,
        deliverable_date: data.deliverable_date,
        delivery_date: data.delivery_date,
        paperwork_date: data.paperwork_date,
        presented_date: data.presented_date,
        //   promised_date: data.promised_date,
        financed_date: data.financed_date,
        road_test_date: data.road_test_date,
        home_road_test_date: data.home_road_test_date,
        sale_date: data.sale_date,
        updated_at: data.updated_at,
        address_line1: data.address_line1,
        city: data.city,
        civility: data.civility,
        country: data.country,
        credit_approved: data.credit_approved ? data.credit_approved.toString() : null,
        dealer_tour: data.creditdealer_tour_approved ? data.dealer_tour.toString() : null,
        financial_institution: data.financial_institution,
        first_name: data.first_name,
        funded: data.funded ? data.funded.toString() : null,
        inspected: data.inspected ? data.inspected.toString() : null,
        last_name: data.last_name,
        postal_code: data.postal_code,
        province: data.province,
        result: data.result,
        status: data.status,
        type: data.type,
        walk_around: data.walk_around ? data.walk_around.toString() : null,
        comment: data.comment,
        delivered_by: data.delivered_by,
        emails: data.emails[0].address,
        phones: data.phones[0].number,
        financeId: data.financeId,
        userEmail: user?.email,

        /**home_presented_date: data.home_presented_date,
         birth_date: data.birth_date,
         source_id: data.source_id,
         Integer: data.Integer,
         provider_id: data.provider_id,
         unsubscribe_all_date: data.unsubscribe_all_date,
         unsubscribe_call_date: data.unsubscribe_call_date,
         unsubscribe_email_date: data.unsubscribe_email_date,
         unsubscribe_sms_date: data.unsubscribe_sms_date,
         advisor: data.advisor,
         take_over_date: data.take_over_date,
         search_term: data.search_term,
         gender: data.gender,
         form: data.form,
         division: data.division,
         created_method: data.created_method,
         campaign: data.campaign,
         address_line2: data.address_line2,
         business: data.business,
         business_name: data.business_name,
         second_contact: data.second_contact,
         second_contact_civility: data.second_contact_civility,
         segment: data.segment,
         source: data.source,
         qualification: data.qualification,
         rating: data.rating,
         referrer: data.referrer,
         provider: data.provider,
         progress_state: data.progress_state,
         locale: data.locale,
         navigation_history: data.navigation_history,
         keyword: data.keyword,*/

      }
    })

    return { financeData, activixData, dashboardData };
  } catch (error) {
    console.error('Error:', error);
  } finally {
    console.log("This code always runs, regardless of whether there was an error or not.");
  }
  return null
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const FinanceIdContext = React.createContext();

async function getToken(
  username: string,
  password: string
): Promise<string> {
  const requestAddress = 'https://dsatokenservice-4995.twil.io/token-service'
  if (!requestAddress) {
    throw new Error(
      "REACT_APP_ACCESS_TOKEN_SERVICE_URL is not configured, cannot login"
    );
  }

  try {
    const response = await axios.get(requestAddress, {
      params: { identity: 'skylerzanth', password: 'skylerzanth1234' },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error(error.response.data ?? "Authentication error.");
    }

    console.error(`ERROR received from ${requestAddress}: ${error}\n`);
    throw new Error(`ERROR received from ${requestAddress}: ${error}\n`);
  }
}


/**
   *
   * if (brand === 'Triumph') {
    const modelData = await getDataTriumph(finance);
    return await cors(request, json({ ok: true, mergedFinanceList, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, sliderWidth, user, financeNotes, userList, parts, clientUnit, clientfileId, searchData, convoList, conversations, emailTemplatesDropdown, salesPeople, financeManagers }))
  }


   * if (brand === 'BMW-Motorrad') {
    const bmwMoto = await getLatestBMWOptions(financeId)
    const bmwMoto2 = await getLatestBMWOptions2(financeId)
    const modelData = await getDataBmwMoto(finance);
    return await cors(request, json({ ok: true, mergedFinanceList, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, bmwMoto, bmwMoto2, sliderWidth, user, financeNotes, userList, parts, clientfileId, clientUnit, searchData, convoList, conversations, emailTemplatesDropdown, salesPeople, financeManagers }))
  }
   *
   *  if (brand === 'Kawasaki') {
    const modelData = await getDataKawasaki(finance);
    return await cors(request, json({ ok: true, mergedFinanceList, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, sliderWidth, user, financeNotes, userList, parts, clientUnit, clientfileId, searchData, convoList, conversations, emailTemplatesDropdown, salesPeople, financeManagers }))
  }


   * if (brand === 'Switch') {
    const modelData = await getDataByModel(finance);
    const manOptions = await getLatestOptionsManitou(email)
    return await cors(request, json({ ok: true, mergedFinanceList, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, manOptions, sliderWidth, user, financeNotes, userList, parts, clientUnit, clientfileId, searchData, convoList, conversations, emailTemplatesDropdown, salesPeople, financeManagers }))
  }


   *   if (brand === 'Manitou') {
    const modelData = await getDataByModelManitou(finance);
    const manOptions = await getLatestOptionsManitou(email)
    return json({ ok: true, mergedFinanceList, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, clientfileId, modelData, finance, deFees, manOptions, sliderWidth, user, financeNotes, userList, parts, clientUnit, searchData, convoList, conversations, emailTemplatesDropdown })
  }
   *  if (brand === 'Harley-Davidson') {
    const modelData = await getDataHarley(finance);
    const apptFinance2 = await getAllFinanceApts2(financeId)
    const aptFinance3 = await getAllFinanceApts(financeId)
    return await cors(request, json({ modelData, apptFinance2, aptFinance3, ok: true, mergedFinanceList, getTemplates, SetClient66Cookie, Coms, merged, docs: docTemplates, clientFile, finance, deFees, sliderWidth, user, financeNotes, userList, parts, clientfileId, clientUnit, searchData, convoList, conversations, emailTemplatesDropdown, salesPeople, financeManagers }));
  }
      if (brand === 'Indian' || brand === 'Can-Am' || brand === 'Sea-Doo' || brand === 'Ski-Doo' || brand === 'Suzuki' || brand === 'Spyder' || brand === 'Can-Am-SXS') {
  const modelData = await getDataByModel(finance)
  return await cors(request, json({ ok: true, mergedFinanceList, getTemplates, SetClient66Cookie, Coms, merged, aptFinance3, docs: docTemplates, clientFile, modelData, finance, deFees, sliderWidth, user, financeNotes, financeId, userList, parts, clientUnit, searchData, convoList, conversations, emailTemplatesDropdown, salesPeople, financeManagers }))

}
    */
