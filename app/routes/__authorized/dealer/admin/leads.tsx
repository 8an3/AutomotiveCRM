import React, { HTMLAttributes, HTMLProps, useState, useEffect, Suspense, useRef, } from 'react'
import { Await, Form, Link, useActionData, useFetcher, useLoaderData, useLocation, useNavigation, useSubmit } from '@remix-run/react'
import { Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, Button, ScrollArea, Tabs, TabsList, TabsTrigger, TabsContent, Label, Select, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectGroup, } from "~/components/ui/index";
import { type dashBoardType } from "~/components/dashboard/schema";
import { DataTableColumnHeader } from "~/components/dashboard/calls/header"
import ClientCard from '~/components/dashboard/calls/clientCard';
import ClientVehicleCard from '~/components/dashboard/calls/clientVehicleCard';
import EmailClient from '~/components/dashboard/calls/emailClient';
import ClientStatusCard from '~/components/dashboard/calls/ClientStatusCard';
import CompleteCall from '~/components/dashboard/calls/completeCall';
import TwoDaysFromNow from '~/components/dashboard/calls/2DaysFromNow';
import { dashboardAction, dashboardLoader } from "~/components/actions/dashboardCalls";
import IndeterminateCheckbox from "~/components/dashboard/calls/InderterminateCheckbox"
import { ButtonLoading } from "~/components/ui/button-loading";
import AttemptedOrReached from "~/components/dashboard/calls/setAttOrReached";
import ContactTimesByType from "~/components/dashboard/calls/ContactTimesByType";
import LogCall from "~/components/dashboard/calls/logCall";
import Logtext from "~/components/dashboard/calls/logText";
import { Badge } from "~/ui/badge";
import secondary from "~/styles/secondary.css";
import { SmDataTable } from '~/components/smData-table';
import SmClientCard from '~/components/dashboard/calls/smClientCard';
import { Message, Conversation, Participant, Client, ConnectionState, Paginator, } from "@twilio/conversations";
import emitter from '~/routes/__authorized/dealer/emitter';
import PresetFollowUpDay from '~/components/dashboard/calls/presetFollowUpDay';
import { type ActionFunction, createCookie, type LoaderFunction, redirect, defer } from "@remix-run/node";
import financeFormSchema from "~/overviewUtils/financeFormSchema";
import { getDealerFeesbyEmail } from "~/utils/user.server";
import { deleteFinanceNote } from "~/utils/financeNote/delete.server";
import DeleteCustomer from "~/components/dashboard/calls/actions/DeleteCustomer";
import { updateFinanceNote } from "~/utils/client/updateFinanceNote.server";
import { deleteFinanceAppts } from "~/utils/financeAppts/delete.server";
import UpdateAppt from "~/components/dashboard/calls/actions/updateAppt";
import CreateAppt from "~/components/dashboard/calls/actions/createAppt";
import { getSession, commitSession } from '~/sessions/auth-session.server';
import { getSession as sixSession, commitSession as sixCommit, } from '~/utils/misc.user.server'
import { DataForm } from '~/components/dashboard/calls/actions/dbData';
import { GetUser } from "~/utils/loader.server";
import { getSession as getOrder, commitSession as commitOrder, } from '~/sessions/user.client.server'
import { QuoteServerActivix } from '~/utils/quote/quote.server';
import { checkForMobileDevice, getToken, CompleteLastAppt, TwoDays, FollowUpApt, ComsCount, QuoteServer } from '~/components/actions/shared'
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, type SortingState, getSortedRowModel, sortingFns, SortingFn, FilterFns, FilterFn, type VisibilityState, getFilteredRowModel, type ColumnFiltersState, } from "@tanstack/react-table";
import { DataTablePagination } from "~/components/dashboard/calls/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table";
import Filter from "~/components/dashboard/calls/Filter";
import { CalendarCheck, Search, MailWarning, UserPlus, MessageSquare, Mail } from "lucide-react";
import useSWR, { SWRConfig, mutate, useSWRConfig } from 'swr';
import { prisma } from "~/libs";
import { json, LinksFunction } from "@remix-run/node";
import { toast } from "sonner"
import MassEmail from "./dashboard/calls/massEmail";
import MassSMS, { TextFunction } from "~/components/dashboard/calls/massSms";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger, DialogClose,
} from "~/components/ui/dialog"

export function DataTable({
  columns,
  data,
  user,
  smsDetails,
}) {

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: false,
      oth60WOptions: false,
      weeklyOthWOptions: false,
      weeklylNatWOptions: false,
      biweekOthWOptions: false,
      desiredPayments: false,
      clientfileId: false,
      commodity: false,
      msrp: false,
      turnover: false,
      unitPicker: false,
      painPrem: false,
      freight: false,
      biweeklNatWOptions: false,
      nat60WOptions: false,
      deliveredDate: false,
      licensing: false,
      followUpDay: false,
      pdi: false,
      admin: false,
      accessories: false,
      labour: false,
      trailer: false,
      weeklyOth: false,
      biweekOth: false,
      months: false,
      depositMade: false,
      oth60: false,
      weeklylNat: false,
      on60: false,
      iRate: false,
      biweeklNat: false,
      nat60: false,
      biweekly: false,
      weeklyqc: false,
      biweeklyqc: false,
      weekly: false,
      qc60: false,
      financeId: false,
      province: false,
      userEmail: false,
      postal: false,
      address: false,
      city: false,
      phone: false,
      result: false,
      email: false,
      referral: false,
      visited: false,
      bookedApt: false,
      aptShowed: false,
      aptNoShowed: false,
      testDrive: false,
      metService: false,
      metManager: false,
      metParts: false,
      sold: false,
      contactMethod: false,
      refund: false,
      turnOver: false,
      financeApp: false,
      approved: false,
      signed: false,
      pickUpSet: false,
      demoed: false,
      delivered: false,
      tradeMake: false,
      tradeYear: false,
      tradeTrim: false,
      tradeColor: false,
      tradeVin: false,
      timesContacted: false,
      visits: false,
      financeApplication: false,
      progress: false,
      metFinance: false,
      metSalesperson: false,
      seenTrade: false,
      docsSigned: false,
      tradeRepairs: false,
      dl: false,
      timeOfDay: false,
      timeToContact: false,
      typeOfContact: false,
      discount: false,
      pickUpTime: false,
      total: false,
      onTax: false,
      deliveryCharge: false,
      userLoanProt: false,
      userTireandRim: false,
      userGap: false,
      userExtWarr: false,
      userServicespkg: false,
      vinE: false,
      lifeDisability: false,
      rustProofing: false,
      userOther: false,
      deposit: false,
      paintPrem: false,
      discountPer: false,
      qcTax: false,
      otherTax: false,
      totalWithOptions: false,
      otherTaxWithOptions: false,
      stockNum: false,
      model1: false,
      note: false,
      color: false,
      modelCode: false,
      lastNote: false,
      documentUpload: false,
      tradeValue: false,
      singleFinNote: false,
    });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({})

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const [filterBy, setFilterBy] = useState('');

  const handleInputChange = (name) => {
    setFilterBy(name);
  };

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
  //console.log(formattedDate); // Output: "Wed, Nov 02, 2023, 09:05 AM"

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


  const [todayfilterBy, setTodayfilterBy] = useState(null);

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

  const CallsList = [
    {
      key: "pendingCalls",
      name: "Pending Calls",
    },
    {
      key: "todaysCalls",
      name: "Today's Calls",
    },
    {
      key: "tomorowsCalls",
      name: "Tomorrow's Calls",
    },
    {
      key: "yestCalls",
      name: "Yesterday's if missed",
    },
    {
      key: "missedCalls",
      name: "Missed Calls - Current Month",
    },
    {
      key: "missedCallsLastMonth",
      name: "Missed Calls - Last Month",
    },
    {
      key: "missedCallsTwoMonths",
      name: "Missed Calls - 2 Months Ago",
    },
    {
      key: "missedCallsYear",
      name: "Missed Calls - Year",
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

    if (selectedFilter === "deliveredThisMonth") {
      customerStateColumn?.setFilterValue('delivered');
      deliveredDate?.setFilterValue(getFirstDayOfCurrentMonth);
      status?.setFilterValue('active');

    }

    if (selectedFilter === "deliveredLastMonth") {
      customerStateColumn?.setFilterValue('delivered');
      deliveredDate?.setFilterValue(getLastDayOfPreviousMonth);
      status?.setFilterValue('active');
    }

    if (selectedFilter === "deliveredThisYear") {
      customerStateColumn?.setFilterValue('delivered');
      deliveredDate?.setFilterValue(getThisYear);
      status?.setFilterValue('active');
    }

    if (selectedFilter === "pendingCalls") {
      customerStateColumn?.setFilterValue('Pending');
      status?.setFilterValue('active');
    }

    if (selectedFilter === "todaysCalls") {
      nextAppointmentColumn?.setFilterValue(getToday);
      console.log(nextAppointmentColumn, 'nextAppointmentColumn')
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "tomorowsCalls") {
      nextAppointmentColumn?.setFilterValue(getTomorrow);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "yestCalls") {
      nextAppointmentColumn?.setFilterValue(getYesterday);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "missedCalls") {
      nextAppointmentColumn?.setFilterValue(getFirstDayOfCurrentMonth);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "missedCallsLastMonth") {
      nextAppointmentColumn?.setFilterValue(getLastDayOfPreviousMonth);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "missedCallsTwoMonths") {
      nextAppointmentColumn?.setFilterValue(getFirstDayOfTwoMonthsAgo);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "missedCallsYear") {
      nextAppointmentColumn?.setFilterValue(getThisYear);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('off');
      sold?.setFilterValue('off');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "todaysDeliveries") {
      pickUpDate?.setFilterValue(getToday);
      status?.setFilterValue('active');
      sold?.setFilterValue('on');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "tomorowsDeliveries") {
      pickUpDate?.setFilterValue(getTomorrow);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('on');
      sold?.setFilterValue('on');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "yestDeliveries") {
      pickUpDate?.setFilterValue(getYesterday);
      status?.setFilterValue('active');
      depositMade?.setFilterValue('on');
      sold?.setFilterValue('on');
      delivered?.setFilterValue('off')
    }

    if (selectedFilter === "depositsToday") {
      status?.setFilterValue('active');
      depositMade?.setFilterValue('on');
      sold?.setFilterValue('on');
      delivered?.setFilterValue('off')
      signed?.setFilterValue('off')
      financeApp?.setFilterValue('off')
    }
  };

  // clears filters
  const setAllFilters = () => {
    setColumnFilters([]);
    setSorting([])
    setFilterBy('')
  };

  // toggle column filters
  const [showFilter, setShowFilter] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };
  const toggleEmail = () => {
    setMassEmail(!showFilter);
  };
  //
  // </ClientOnly>

  //defaultValue={todayfilterBy}>
  const submit = useSubmit()

  async function rotateSalesQueue() {
    console.log(salesPeople, 'rotateSalesQueue')
    const formData = new FormData();
    formData.append("intent", 'rotateSalesQueue');
    const update = submit(formData, { method: "post" });
    return update
  }
  async function rotateFinanceQueue() {
    console.log(salesPeople, 'rotateFinanceQueue')
    const formData = new FormData();
    formData.append("intent", 'rotateFinanceQueue');
    const update = submit(formData, { method: "post" });
    return update
  }
  async function resetQueueFinance() {
    console.log(salesPeople, 'resetQueueFinance')
    const formData = new FormData();
    formData.append("intent", 'rotateFinanceQueue');
    const update = submit(formData, { method: "post" });
    return update
  }
  async function resetQueue() {
    console.log(salesPeople, 'resetQueue')
    const formData = new FormData();
    formData.append("intent", 'resetQueue');
    const update = submit(formData, { method: "post" });
    return update
  }

  const [salesPeople, setSalesPeople] = useState([])
  const [financeManager, setFinanceManager] = useState([])
  const [massSms, setMassSms] = useState(false)
  const [massEmail, setMassEmail] = useState(false)
  const [addCustomer, setAddCustomer] = useState(false)

  const swrFetcher = url => fetch(url).then(r => r.json())

  const { data: userFetch, userError } = useSWR('/dealer/api/findManyUsers', swrFetcher, {
    refreshInterval: 60000, revalidateOnMount: true, revalidateOnReconnect: true
  });
  const { data: financeFetch, financeError } = useSWR('/dealer/api/findManyFinance', swrFetcher, {
    refreshInterval: 60000, revalidateOnMount: true, revalidateOnReconnect: true
  });

  useEffect(() => {
    if (userFetch) {
      console.log(userFetch.users, 'userFetch')
      setSalesPeople(userFetch.users)
    }
    if (financeFetch) {
      console.log(financeFetch.users, 'userFetch')
      setFinanceManager(financeFetch.users)
    }
  }, [userFetch, financeFetch]);

  const [customerMessages, setCustomerMessages] = useState([])
  const [customer, setCustomer] = useState()
  const [conversationSid, setConversationSid] = useState('')

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
            console.log(response, 'response')
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
    /* else {

      async function GetNumber() {
        const areaCode = user.phone.slice(0, 3);
        const locals = await client.availablePhoneNumbers("CA").local.list({
          areaCode: areaCode,
          limit: 1,
        });
        const incomingPhoneNumber = await client.incomingPhoneNumbers.create({
          phoneNumber: locals.available_phone_numbers[0].phone_number,
        });
        // create new conversation sid

        // save invo in twilioSMSDetails
        const saved = await prisma.twilioSMSDetails.create({
          data: {
            conversationSid: '',
            participantSid: '',
            userSid: '',
            username: 'skylerzanth',
            password: 'skylerzanth1234',
            userEmail: user.email,
            passClient: '',
            myPhone: locals.available_phone_numbers[0].phone_number,
            proxyPhone: '',
          }
        })
           const newConversationSid = saved.conversationId;
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
            console.log(response, 'response')
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

GetNumber()
    }*/
  }, [smsDetails]);

  const fetcher = useFetcher()
  const userEmail = user?.email;

  const initial = {
    firstName: "",
    lastName: "",
  };
  const [formData, setFormData] = useState(initial);
  const firstName = formData.firstName;
  const lastName = formData.lastName;
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const [brandId, setBrandId] = useState('');
  const [modelList, setModelList] = useState();

  const handleBrand = (e) => {
    setBrandId(e.target.value);
    console.log(brandId, modelList)
  };

  useEffect(() => {
    async function getData() {
      const res = await fetch(`/api/modelList/${brandId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      return res.json();
    }

    if (brandId.length > 3) {
      const fetchData = async () => {
        const result = await getData();
        setModelList(result);
        console.log(brandId, result); // Log the updated result
      };
      fetchData();
    }
  }, [brandId]);
  const [open, setOpen] = useState(false);

  const [rowData, setRowData] = useState()

  useEffect(() => {
    if (rowData) {
      const serializedUser = JSON.stringify(user);
      const cust = rowData.rowData.map(user => user.email);
      console.log(cust, 'cust')
      const serializedCust = JSON.stringify(cust);
      window.localStorage.setItem("user", serializedUser);
      window.localStorage.setItem("customer", serializedCust);
    }

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
          iFrameRef.current.src = "http://localhost:3000/dealer/email/massEmail";
        }
        if (currentHost === "dealersalesassistant.ca") {
          iFrameRef.current.src =
            "https://www.dealersalesassistant.ca/dealer/email/massEmail";
        }
        window.addEventListener("message", handleHeightMessage);
        const cust = rowData

        const sendData = { cust, user };

        // Add load event listener to ensure iframe is loaded
        const onLoad = () => {
          iFrameRef.current.contentWindow?.postMessage(sendData, '*');
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

  useEffect(() => {
    if (rowData) {
      const serializedUser = JSON.stringify(user);
      const serializedCust = JSON.stringify(rowData);
      window.localStorage.setItem("user", serializedUser);
      window.localStorage.setItem("customer", serializedCust);
    }

  }, [rowData]);

  return (
    <div className="mb-[20px]  even:bg-background  rounded    justify-center w-[80vw]">
      <div className="ml-auto flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-background text-foreground border border-border">
            <DropdownMenuLabel>Dashboard Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='cursor-pointer' >Default Filters</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="h-[350px] max-h-[350px] overflow-y-auto bg-background text-foreground border border-border">
                    <DropdownMenuLabel>{todayfilterBy || "Default Filters"}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {CallsList.map((item) => (
                      <DropdownMenuItem
                        onSelect={(event) => {
                          const value = event.currentTarget.getAttribute('data-value');
                          const item = CallsList.find(i => i.key === value)
                            || DeliveriesList.find(i => i.key === value)
                            || DepositsTakenList.find(i => i.key === value);
                          if (item) {
                            handleFilterChange(item.key);
                            setTodayfilterBy(item.name);
                          }
                        }}
                        data-value={item.key}
                        textValue={item.key}>{item.name}</DropdownMenuItem>
                    ))}
                    {CallsList.map((item) => (
                      <DropdownMenuItem
                        onSelect={(event) => {
                          const value = event.currentTarget.getAttribute('data-value');
                          const item = CallsList.find(i => i.key === value)
                            || DeliveriesList.find(i => i.key === value)
                            || DepositsTakenList.find(i => i.key === value);
                          if (item) {
                            handleFilterChange(item.key);
                            setTodayfilterBy(item.name);
                          }
                        }}
                        data-value={item.key}
                        textValue={item.key}>{item.name}</DropdownMenuItem>
                    ))}
                    {CallsList.map((item) => (
                      <DropdownMenuItem
                        onSelect={(event) => {
                          const value = event.currentTarget.getAttribute('data-value');
                          const item = CallsList.find(i => i.key === value)
                            || DeliveriesList.find(i => i.key === value)
                            || DepositsTakenList.find(i => i.key === value);
                          if (item) {
                            handleFilterChange(item.key);
                            setTodayfilterBy(item.name);
                          }
                        }}
                        data-value={item.key}
                        textValue={item.key}>{item.name}</DropdownMenuItem>
                    ))}

                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='cursor-pointer' >Global Filters</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="h-[350px] max-h-[350px] overflow-y-auto bg-background text-foreground border border-border">
                    {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                      <DropdownMenuItem
                        onSelect={(event) => {
                          handleInputChange(event)
                        }}
                        data-value={column.id}
                        key={column.id}
                        className="bg-background text-foreground capitalize cursor-pointer  hover:underline hover:text-primary">
                        {column.id}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem
                className='cursor-pointer'
                onSelect={() => setAllFilters([])}>Clear</DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>

              <DropdownMenuItem
                className='cursor-pointer'
                onSelect={toggleFilter}>Toggle  All Columns</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='cursor-pointer' >Column Toggle</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="h-[350px] max-h-[350px] overflow-y-auto bg-background text-foreground border border-border">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="bg-background capitalize  cursor-pointer text-foreground"
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

              <div className='w-[650px]' >
                <Dialog>
                  <DialogTrigger className='w-full cursor-pointer'>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className='w-full'>
                      Mass SMS
                      <DropdownMenuShortcut> <MessageSquare color="foreground" /></DropdownMenuShortcut>

                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="w-[600px] max-w-[600px]">
                    <DialogHeader className='w-[600px] max-w-[600px]'>
                      <DialogTitle>Mass SMS</DialogTitle>
                      <DialogDescription>
                        <TextFunction
                          customerMessages={customerMessages}
                          customer={customer}
                          data={data}
                          user={user}
                          smsDetails={smsDetails}
                        />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>


              <div className='w-[650px]' >
                <Dialog>
                  <DialogTrigger className='w-full cursor-pointer'>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className='w-full'>
                      Mass Email
                      <DropdownMenuShortcut> <Mail color="foreground" /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="w-[600px] max-w-[600px]">
                    <DialogHeader className='w-[600px] max-w-[600px]'>
                      <DialogTitle>Mass Email</DialogTitle>
                      <DialogDescription>
                        <MyIFrameComponent />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='cursor-pointer' >Rotation</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="overflow-y-auto bg-background text-foreground border border-border">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Sales Rotation</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {salesPeople.map(person => (
                        <DropdownMenuItem className='text-muted-foreground mt-2' key={person.id}>{person.name}</DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Finance Rotation</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {financeManager.map(person => (
                        <DropdownMenuItem className='text-muted-foreground mt-2' key={person.id}>{person.name}</DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Actions</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className=" overflow-y-auto bg-background text-foreground border border-border">
                          <DropdownMenuItem
                            onClick={() => {
                              rotateSalesQueue()
                              toast.success(`Rotating sales...`)
                            }}
                          >Rotate Sales</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              rotateFinanceQueue()
                              toast.success(`Rotating sales...`)
                            }}
                          >  Rotate Finance</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              resetQueue()
                              toast.success(`Rotating sales...`)
                            }}
                          >Reset Sales</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              resetQueueFinance()
                              toast.success(`Rotating sales...`)
                            }}
                          >Reset Finance</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <div className='w-[650px]' >
                <Dialog>
                  <DialogTrigger className='w-full cursor-pointer'>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className='w-full'>
                      Add Customer
                      <DropdownMenuShortcut> <UserPlus color="foreground" /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="w-[600px] max-w-[600px]">
                    <DialogHeader className='w-[600px] max-w-[600px]'>
                      <DialogTitle> Add Customer</DialogTitle>
                      <DialogDescription>
                        <>
                          <fetcher.Form method="post">
                            <div className="flex flex-col ">
                              <div className="relative mt-3">
                                <Input
                                  type="text"
                                  name="firstName"
                                  onChange={handleChange}
                                  className='border-border bg-background'
                                />
                                <label className=" text-sm absolute left-3 -top-3 px-2 rounded-full bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">First Name</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  type="text"
                                  name="lastName"
                                  onChange={handleChange}
                                  className='border-border bg-background '
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Last Name</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  className="border-border bg-background   "
                                  type="number"
                                  name="phone"
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Phone</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  className="border-border bg-background  "
                                  type="email"
                                  name="email"
                                />
                                <label className=" text-sm absolute left-3  rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Email</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  className="border-border bg-background   "
                                  type="text"
                                  name="address"
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Address</label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  className="border-border bg-background   "
                                  type="text"
                                  list="ListOptions2"
                                  name="brand"
                                  onChange={handleBrand}
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Brand</label>
                              </div>
                              <datalist id="ListOptions">
                                <option value="BMW-Motorrad" />
                                <option value="Can-Am" />
                                <option value="Can-Am-SXS" />
                                <option value="Harley-Davidson" />
                                <option value="Indian" />
                                <option value="Kawasaki" />
                                <option value="KTM" />
                                <option value="Manitou" />
                                <option value="Sea-Doo" />
                                <option value="Switch" />
                                <option value="Ski-Doo" />
                                <option value="Suzuki" />
                                <option value="Triumph" />
                                <option value="Spyder" />
                                <option value="Yamaha" />
                                <option value="Used" />
                              </datalist>
                              {modelList && (
                                <>
                                  <div className="relative mt-3">
                                    <Input
                                      className="  "
                                      type="text" list="ListOptions2" name="model"
                                    />
                                    <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">Model</label>
                                  </div>
                                  <datalist id="ListOptions2">
                                    {modelList.models.map((item, index) => (
                                      <option key={index} value={item.model} />
                                    ))}
                                  </datalist>
                                </>
                              )}
                            </div>
                            <Input type="hidden" name="iRate" defaultValue={10.99} />
                            <Input type="hidden" name="tradeValue" defaultValue={0} />
                            <Input type="hidden" name="discount" defaultValue={0} />
                            <Input type="hidden" name="deposit" defaultValue={0} />
                            <Input type="hidden" name="months" defaultValue={60} />
                            <Input type="hidden" name="userEmail" defaultValue={userEmail} />
                            <Input
                              type="hidden"
                              name="name"
                              defaultValue={`${firstName}` + " " + `${lastName}`}
                            />
                            <div className="mt-[25px] flex justify-end">
                              <Button
                                name="intent"
                                value="AddCustomer"
                                type="submit"
                                size='sm'
                                className='bg-primary'
                              >
                                Add
                              </Button>
                            </div>
                          </fetcher.Form>
                        </>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>

              <DropdownMenuItem>
                <Link to='/dealer/calendar/sales' className='w-full flex justify-between items-center'>
                  <p>Calendar</p>
                  <DropdownMenuShortcut><CalendarCheck color="#cbd0d4" size={20} strokeWidth={1.5} /></DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

          </DropdownMenuContent>
        </DropdownMenu>

        {filterBy && (
          <Input
            placeholder={`Filter ${filterBy} ...`}
            value={
              (table.getColumn(filterBy)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterBy)?.setFilterValue(event.target.value)
            }
            className="ml-2 max-w-sm "
          />
        )}
        <p className='ml-3'>Want the perfect admin dashboard? Let us know what you need, we'll make it happen.</p>
      </div>

      <div className="mt-[20px] rounded-md  border border-border text-foreground">

        <Table className="rounded-md overflow-x-auto border-border">
          <TableHeader>

            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=' border-border'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      <>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                        {header.column.getCanFilter() && showFilter && (
                          <div className="mx-auto items-center justify-center cursor-pointer text-center ">
                            <Filter column={header.column} table={table} />
                          </div>
                        )}

                      </>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-x-auto border-border">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`p-4 text-foreground bg-background border-border capitalize cursor-pointer  ${index % 2 === 0 ? 'bg-background' : 'bg-background'}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-foreground bg-background capitalize cursor-pointer hover:text-primary"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </div>
      <DataTablePagination table={table} />
    </div >
  );
}

export default function MainDashbaord({ }) {
  let username = 'skylerzanth'//localStorage.getItem("username") ?? "";
  let password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
  //const username = user?.username.toLowerCase().replace(/\s/g, '');//'skylerzanth'//localStorage.getItem("username") ?? "";
  //const password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
  const proxyPhone = '+12176347250'

  const { finance, searchData, getTemplates, callToken, conversationsData, convoList, newToken, email, user } = useLoaderData();
  const [data, setPaymentData,] = useState<dashBoardType[]>(finance);
  const [messagesConvo, setMessagesConvo] = useState([]);
  const [selectedChannelSid, setSelectedChannelSid] = useState([]);
  const [templates, setTemplates] = useState(getTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [conversationSID, setConversationSID] = useState('')
  const [loggedIn, setLoggedIn] = useState(user.email);
  const [statusString, setStatusString] = useState("Fetching credentials…");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState('');

  let multipliedConvoList = [];
  for (let i = 0; i < 30; i++) {
    multipliedConvoList = multipliedConvoList.concat(convoList);
  }
  const [channels, setChannels] = useState(multipliedConvoList);
  const [currentConversation, setCurrentConversation] = useState(null);

  const [messages, setMessages] = useState(text);
  const [message, setMessage] = useState(messages || null);
  const [chatReady, setChatReady] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const [isTyping, setIsTyping] = useState(true);

  const [newClient, setClient] = useState();
  const [newMessage, setNewMessage] = useState("");

  const [token, setToken] = useState(newToken);

  const [name, setName] = useState(username);
  const [to, setTo] = useState('');
  const [channelName, setChannelName] = useState('');
  const [from, setFrom] = useState('');
  const [conversation_sid, setConversation_sid] = useState('');
  const [smsMenu, setSmsMenu] = useState('true');
  const [sms, setSms] = useState(true);
  const [size, setSize] = useState(751);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [conversation, SetConversation] = useState('list');
  const [conversationsList, setConversationsList] = useState([])
  const [customer, setCustomer] = useState()
  let fetcher = useFetcher();
  const [convos, setConvos] = useState([])
  useEffect(() => {
    const data = async () => {
      const result = await getData();
      setPaymentData(result);
    };
    data()
  }, []);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const dataFetcher = (url) => fetch(url).then(res => res.json());
  const { data: swrData } = useSWR(isSubmitting ? 'http://localhost:3000/dealer/dashboard/calls/loader' : null, dataFetcher, {})

  useEffect(() => {
    if (swrData) {
      setPaymentData(swrData);
      console.log('hitswr!! ')
    }
  }, [swrData]);
  const iFrameRef: React.LegacyRef<HTMLIFrameElement> = useRef(null);

  const defaultColumn: Partial<ColumnDef<Payment>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        ; (table.options.meta as TableMeta).updateData(index, id, value)
      }

      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      return (
        <input
          value={value as string}
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
        />
      )
    },
  }

  const [open, setOpen] = useState(false);
  const [openSMS, setOpenSMS] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerfinanceId, setCustomerfinanceId] = useState('')
  const handleButtonClick = (rowData) => {
    setOpen(true);
    setCustomerEmail(rowData.email);
    setCustomerName(rowData.name);
    setCustomerfinanceId(rowData.financeId);
  };
  const getObjectById = (id) => { return searchData.find(item => item.id === id); };

  const [smsDetails, setSmsDetails] = useState([])

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

  let channelContent;
  const [state, setState] = useState({
    newMessage: '',
    channelProxy: selectedChannel,
    messages: [],
    loadingState: 'initializing',
    boundChannels: new Set(),
  });

  const messagesRef = useRef(null);

  const columns: ColumnDef<Payment>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='flex mx-auto my-auto'>
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className='border-[#c72323]'

          />

        </div>


      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
            className='border-[#c72323]'

          />
        </div>
      ),
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => {
        return <>
          <DataTableColumnHeader column={column} title="First Name" />

        </>

      },
      cell: ({ row }) => {
        const data = row.original
        //
        return <div className="bg-transparent flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px] uppercase leading-none  text-[#EEEEEE]  outline-none  transition-all duration-150 ease-linear target:text-primary  hover:text-primary  focus:text-primary focus:outline-none">
          <ClientCard data={data} row={row} />
        </div>
      },


    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="LastName" />
      ),
      cell: ({ row }) => {
        const data = row.original
        return <div className="bg-transparent flex w-[175px] flex-1 items-center justify-center px-5 text-center text-[15px]  uppercase leading-none text-[#EEEEEE] outline-none transition-all duration-150  ease-linear  first:rounded-tl-md  last:rounded-tr-md target:text-primary hover:text-primary focus:text-primary  focus:outline-none  active:bg-primary ">
          {(row.getValue("lastName"))}
        </div>
      },

    },
    {

      accessorKey: "status",
      header: ({ column }) => {
        return <>
          <DataTableColumnHeader column={column} title="Status" />
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <ClientStatusCard data={data} />
        </div>
      },
    },
    {
      accessorKey: "nextAppointment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Next Appt" />
      ),
      cell: ({ row }) => {
        const data = row.original;

        const date = new Date(String());
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };

        return <div className="bg-transparent mx-1 flex h-[45px] w-[160px] flex-1 items-center justify-center px-5 text-center  text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none  transition-all  duration-150 ease-linear target:text-primary hover:text-primary  focus:text-primary  focus:outline-none  active:bg-primary  ">
          {String(data.nextAppointment)}
        </div>
      },
    },
    {
      accessorKey: "customerState",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State" />
      ), cell: ({ row }) => {
        const data = row.original
        //  const id = data.id ? data.id.toString() : '';
        return <div className="  flex h-[45px] w-[95%] items-center justify-center   text-[15px] uppercase leading-none outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none active:bg-primary">

          {data.customerState === 'Pending' ? (<AttemptedOrReached data={data} />
          ) : data.customerState === 'Attempted' ? (<AttemptedOrReached data={data} />
          ) : data.customerState === 'Reached' ? (<Badge className="bg-[#29a383] text-foreground">Reached</Badge>
          ) : data.customerState === 'sold' ? (<Badge className="bg-[#29a383] text-foreground">Sold</Badge>
          ) : data.customerState === 'depositMade' ? (<Badge className="bg-[#29a383] text-foreground">Deposit</Badge>
          ) : data.customerState === 'turnOver' ? (<Badge className="bg-[#0090ff]  text-foreground">Turn Over</Badge>
          ) : data.customerState === 'financeApp' ? (<Badge className="bg-[#0090ff]  text-foreground">Application Done</Badge>
          ) : data.customerState === 'approved' ? (<Badge className="bg-[#29a383] text-foreground">Approved</Badge>
          ) : data.customerState === 'signed' ? (<Badge className="bg-[#29a383] text-foreground">Signed</Badge>
          ) : data.customerState === 'pickUpSet' ? (<Badge className="bg-[#29a383] text-foreground">Pick Up Set</Badge>
          ) : data.customerState === 'delivered' ? (<Badge className="bg-[#29a383] text-foreground">Delivered</Badge>
          ) : data.customerState === 'refund' ? (<Badge className="bg-[#cf5454]">Refunded</Badge>
          ) : data.customerState === 'funded' ? (<Badge className="bg-[#cf5454]">Funded</Badge>
          ) : (
            ''
          )}
        </div>
      },
    },
    {
      accessorKey: "contact",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact" />
      ),
      cell: ({ row }) => {
        const data = row.original

        let channelContent

        if (selectedChannelSid) {
          channelContent = selectedChannelSid
        } else if (statusString !== "success") {
          channelContent = "Loading your chat!";
        } else {
          channelContent = "";
        }
        return <>
          <div className=' items-center grid grid-cols-3 gap-3'>
            <LogCall
              data={data}
            />
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleButtonClick(data)}
              className="cursor-pointer text-foreground target:text-primary hover:text-primary" >
              <Mail className="" />
            </Button>
            <EmailClient
              data={data}
              open={open}
              setOpen={setOpen}
              customerfinanceId={customerfinanceId}
              customerName={customerName}
              customerEmail={customerEmail}
            />
            <Button
              variant='ghost'
              size='icon'
              onClick={() => {
                handleButtonClickSMS(data)
              }}
              className="cursor-pointer text-foreground target:text-primary hover:text-primary" >
              <MessageSquare color="#ffffff" />
            </Button>
            <Logtext
              data={data}
              searchData={searchData}
              openSMS={openSMS}
              setOpenSMS={setOpenSMS}
              smsDetails={smsDetails}
              text={text}
              setText={setText}
              conversationsData={conversationsData}
              messagesConvo={messagesConvo}
            />
          </div>
        </>
      },
    },
    {
      accessorKey: "model",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Model" />
      ),
      cell: ({ row }) => {
        const data = row.original
        return <div className="w-[275px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE] hover:text-primary">
          <ClientVehicleCard data={data} />
        </div>
      },
    },
    {
      accessorKey: "tradeDesc",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trade" />
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[250px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[13px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("tradeDesc"))}</div>
      },

    },
    {
      accessorKey: "lastNote",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Note" />
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("lastNote"))}</div>
      },

    },
    {
      accessorKey: "singleFinNote",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Notes" />
      ),
      cell: ({ row }) => {
        const data = row.original;
        const single = data.singleFinNote;
        const last = data.lastNote
        if (single) {
          return (
            { single }
          )
        }
        else if (last) {
          return (
            { last }
          )
        }
        else
          return null;
      },
    },
    {
      accessorKey: "followUpDay",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Preset F/U Day" />
      ),
      cell: ({ row }) => {
        const data = row.original
        return <>

          <div className='w-[150px]'>
            <PresetFollowUpDay data={data} />
          </div>
        </>
      },
    },
    {
      accessorKey: "twoDaysFromNow",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Set New Apt." />
      ),
      cell: ({ row }) => {
        const navigation = useNavigation();
        const isSubmitting = navigation.state === "submitting";
        const data = row.original
        return <>

          <div className='w-[200px]'>
            <TwoDaysFromNow data={data} isSubmitting={isSubmitting} />
          </div>
        </>
      },
    },
    {
      accessorKey: "completeCall",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Complete Call" />
      ),
      cell: ({ row }) => {
        const data = row.original
        const contactMethod = data.contactMethod
        return <>

          <div className='w-[125px] cursor-pointer'>

            <CompleteCall data={data} user={user} />
          </div>
        </>
      },
    },
    {
      accessorKey: "contactTimesByType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact Times By Type" />
      ),
      cell: ({ row }) => {
        const data = row.original
        //
        return <>
          <div className='w-[175px] cursor-pointer'>
            <ContactTimesByType data={data} />
          </div>
        </>
      },
    },
    {
      accessorKey: "pickUpDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pick Up Date" className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary " />
      ),
      cell: ({ row }) => {
        const data = row.original
        if (data.pickUpDate) {
          const pickupDate = data.pickUpDate
          return (
            <div className="bg-transparent :text-primary text-grbg-transparent text-gray-300 mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
              {pickupDate === '1969-12-31 19:00' || pickupDate === null ? 'TBD' : pickupDate}
            </div>
          );
        } else
          return null;
      },
    },
    {
      accessorKey: "lastContact",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Contacted" className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary" />
      ),
      cell: ({ row }) => {
        const data = row.original
        const date = new Date(data.lastContact);
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };
        if (date) {
          return (
            <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
              {date === 'TBD' ? <p>TBD</p> : date.toLocaleDateString('en-US', options)}
            </div>
          );
        }
        return null;
      },

    },
    {
      accessorKey: "unitPicker",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Turnover" />
      ),
      cell: ({ row }) => {
        const data = row.original
        const lockedValue = Boolean(true)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const navigation = useNavigation();
        const isSubmitting = navigation.state === "submitting";
        const PromiseConst = async () => {
          const promise = await new Promise(resolve => setTimeout(resolve, 3000));
          return promise
        }
        PromiseConst()


        /**
         * <FinanceTurnover data={data} lockedValue={lockedValue} />
            <input type='hidden' name='intent' value='financeTurnover' />
            <Form method='post' onSubmit={handleSubmit}>
                <input type='hidden' name='locked' value={lockedValue} />
                <input type='hidden' name='financeId' value={data.id} />
            </Form>

            *
            */
        return <>
          <div className='w-[175px] cursor-pointer'>
            <Form method='post' >
              <input type='hidden' name='intent' value='financeTurnover' />
              <input type='hidden' name='locked' value={lockedValue} />
              <input type='hidden' name='financeId' value={data.id} />
              <ButtonLoading
                size="lg"
                className="w-auto cursor-pointer ml-auto mt-5 hover:text-primary"
                type="submit"
                isSubmitting={isSubmitting}
                onClick={() => toast.success(`Informing finance managers of requested turnover...`)}
                loadingText="Updating client info..."
              >
                Finance Turnover
              </ButtonLoading>
            </Form>
          </div>
        </>
      },
    },

    {
      accessorKey: "id",

      cell: ({ row }) => {
        const data = row.original
        return (
          <>
            {/* <DocuUploadDashboard data={data} />*/}
          </>
        );
      },

    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <p className="text-center">email</p>
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("email"))}</div>
      },

    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <p className="text-center">phone</p>
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("phone"))}</div>
      },

    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <p className="text-center">address</p>
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("address"))}</div>
      },

    },
    {
      accessorKey: "postal",
      header: ({ column }) => (
        <p className="text-center">postal</p>
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                hover:shadow-md


                focus:text-primary
                 focus:outline-none active:bg-primary">{(row.getValue("postal"))}</div>
      },

    },
    {
      accessorKey: "city",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="city" />
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                hover:shadow-md


                focus:text-primary
                 focus:outline-none active:bg-primary">{(row.getValue("city"))}</div>
      },

    },
    {
      accessorKey: "province",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="province" />
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                hover:shadow-md


                focus:text-primary
                 focus:outline-none active:bg-primary">{(row.getValue("province"))}</div>
      },

    },
    {
      accessorKey: "financeId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="financeId" />
      ), cell: ({ row }) => {
        return <div className="w-[200px] text-center font-medium">{(row.getValue("financeId"))}</div>
      },

    },
    {
      accessorKey: "userEmail",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="userEmail" />
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                hover:shadow-md


                focus:text-primary
                 focus:outline-none active:bg-primary">{(row.getValue("userEmail"))}</div>
      },

    },
    {
      accessorKey: "pickUpTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pick Up Time" />
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[125px] w-[95%] flex-1 cursor-pointer items-center  justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-primary  hover:text-primary  focus:text-primary focus:outline-none active:bg-primary ">
          {(row.getValue("pickUpTime"))}
        </div>
      },

    },

    {
      accessorKey: "timeToContact",
      header: "model1",
    },
    {
      accessorKey: "deliveredDate",
      header: "deliveredDate",
    },
    {
      accessorKey: "timeOfDay",
      header: "timeOfDay",
    },
    {
      accessorKey: "msrp",
      header: "msrp",
    },
    {
      accessorKey: "freight",
      header: "freight",
    },
    {
      accessorKey: "pdi",
      header: "pdi",
    },
    {
      accessorKey: "admin",
      header: "admin",
    },
    {
      accessorKey: "commodity",
      header: "commodity",
    },
    {
      accessorKey: "accessories",
      header: "accessories",
    },
    {
      accessorKey: "labour",
      header: "labour",
    },
    {
      accessorKey: "painPrem",
      header: "painPrem",
    },
    {
      accessorKey: "licensing",
      header: "licensing",
    },
    {
      accessorKey: "trailer",
      header: "trailer",
    },
    {
      accessorKey: "depositMade",
      header: "depositMade",
    },
    {
      accessorKey: "months",
      header: "months",
    },
    {
      accessorKey: "iRate",
      header: "iRate",
    },
    {
      accessorKey: "on60",
      header: "on60",
    },
    {
      accessorKey: "biweekly",
      header: "biweekly",
    },
    {
      accessorKey: "weekly",
      header: "weekly",
    },
    {
      accessorKey: "qc60",
      header: "qc60",
    },
    {
      accessorKey: "biweeklyqc",
      header: "biweeklyqc",
    },
    {
      accessorKey: "weeklyqc",
      header: "weeklyqc",
    },
    {
      accessorKey: "nat60",
      header: "nat60",
    },
    {
      accessorKey: "biweeklNat",
      header: "biweeklNat",
    },
    {
      accessorKey: "weeklylNat",
      header: "weeklylNat",
    },
    {
      accessorKey: "oth60",
      header: "oth60",
    },
    {
      accessorKey: "biweekOth",
      header: "biweekOth",
    },
    {
      accessorKey: "weeklyOth",
      header: "weeklyOth",
    },
    {
      accessorKey: "nat60WOptions",
      header: "nat60WOptions",
    },
    {
      accessorKey: "desiredPayments",
      header: "desiredPayments",
    },
    {
      accessorKey: "biweeklNatWOptions",
      header: "biweeklNatWOptions",
    },
    {
      accessorKey: "weeklylNatWOptions",
      header: "weeklylNatWOptions",
    },
    {
      accessorKey: "oth60WOptions",
      header: "oth60WOptions",
    },
    {
      accessorKey: "biweekOthWOptions",
      header: "biweekOthWOptions",
    },
    {
      accessorKey: "visited",
      header: "visited",
    },
    {
      accessorKey: "aptShowed",
      header: "aptShowed",
    },
    {
      accessorKey: "bookedApt",
      header: "bookedApt",
    },
    {
      accessorKey: "aptNoShowed",
      header: "aptNoShowed",
    },
    {
      accessorKey: "testDrive",
      header: "testDrive",
    },
    {
      accessorKey: "metParts",
      header: "metParts",
    },
    {
      accessorKey: "sold",
      header: "sold",
    },

    {
      accessorKey: "refund",
      header: "refund",
    },
    {
      accessorKey: "turnOver",
      header: "turnOver",
    },
    {
      accessorKey: "financeApp",
      header: "financeApp",
    },
    {
      accessorKey: "approved",
      header: "approved",
    },
    {
      accessorKey: "signed",
      header: "signed",
    },

    {
      accessorKey: "pickUpSet",
      header: "pickUpSet",
    },
    {
      accessorKey: "demoed",
      header: "demoed",
    },

    {
      accessorKey: "tradeMake",
      header: "tradeMake",
    },
    {
      accessorKey: "tradeYear",
      header: "tradeYear",
    },
    {
      accessorKey: "tradeTrim",
      header: "tradeTrim",
    },
    {
      accessorKey: "tradeColor",
      header: "tradeColor",
    },
    {
      accessorKey: "tradeVin",
      header: "tradeVin",
    },
    {
      accessorKey: "delivered",
      header: "delivered",
    },
    {
      accessorKey: "desiredPayments",
      header: "desiredPayments",
    },
    {
      accessorKey: "result",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Result" />
      ), cell: ({ row }) => {

        return <div className="w-[250px] text-center font-medium">
          Result
        </div>
      },

    },
    {
      accessorKey: "referral",
      header: "referral",
    },
    {
      accessorKey: "metService",
      header: "metService",
    },

    {
      accessorKey: "metManager",
      header: "metManager",
    },
    {
      accessorKey: "metParts",
      header: "metParts",
    },
    {
      accessorKey: "timesContacted",
      header: "timesContacted",
    },

    {
      accessorKey: "visits",
      header: "visits",
    },
    {
      accessorKey: "financeApplication",
      header: "financeApplication",
    },
    {
      accessorKey: "progress",
      header: "progress",
    },

    {
      accessorKey: "metFinance",
      header: "metFinance",
    },
    {
      accessorKey: "metSalesperson",
      header: "metSalesperson",
    },
    {
      accessorKey: "seenTrade",
      header: "seenTrade",
    },
    {
      accessorKey: "docsSigned",
      header: "docsSigned",
    },
    {
      accessorKey: "tradeRepairs",
      header: "tradeRepairs",
    },
    {
      accessorKey: "tradeValue",
      header: "tradeValue",
    },
    {
      accessorKey: "modelCode",
      header: "modelCode",
    },
    {
      accessorKey: "color",
      header: "color",
    },
    {
      accessorKey: "model1",
      header: "model1",
    },
    {
      accessorKey: "stockNum",
      header: "stockNum",
    },
    {
      accessorKey: "otherTaxWithOptions",
      header: "otherTaxWithOptions",
    },
    {
      accessorKey: "totalWithOptions",
      header: "totalWithOptions",
    },
    {
      accessorKey: "otherTax",
      header: "otherTax",
    },
    {
      accessorKey: "qcTax",
      header: "lastContact",
    },
    {
      accessorKey: "deposit",
      header: "tradeValue",
    },
    {
      accessorKey: "rustProofing",
      header: "modelCode",
    },
    {
      accessorKey: "lifeDisability",
      header: "color",
    },
    {
      accessorKey: "userServicespkg",
      header: "model1",
    },
    {
      accessorKey: "userExtWarr",
      header: "userExtWarr",
    },
    {
      accessorKey: "userGap",
      header: "userGap",
    },
    {
      accessorKey: "userTireandRim",
      header: "userTireandRim",
    },
    {
      accessorKey: "userLoanProt",
      header: "userLoanProt",
    },
    {
      accessorKey: "deliveryCharge",
      header: "lastContact",
    },
    {
      accessorKey: "onTax",
      header: "tradeValue",
    },
    {
      accessorKey: "total",
      header: "modelCode",
    },
    {
      accessorKey: "typeOfContact",
      header: "typeOfContact",
    },
    {
      accessorKey: "contactMethod",
      header: "contactMethod",
    },
    {
      accessorKey: "note",
      header: "note",
    },



  ]
  const smColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: "firstName",
      header: ({ column }) => {
        return <>
          <DataTableColumnHeader column={column} title="First Name" />
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        //
        return <div className="bg-transparent flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px]   leading-none  text-[#EEEEEE]  outline-none  transition-all duration-150 ease-linear target:text-primary  hover:text-primary  focus:text-primary focus:outline-none">
          <SmClientCard data={data} searchData={searchData} />
        </div>
      },
    },
    {

      accessorKey: "status",
      header: ({ column }) => {
        return <>
          <DataTableColumnHeader column={column} title="Status" />
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <ClientStatusCard data={data} />
        </div>
      },
    },
    {
      accessorKey: "nextAppointment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Next Appt" />
      ),
      cell: ({ row }) => {
        const data = row.original;

        const date = new Date(String());
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };

        return <div className="bg-transparent mx-1 flex h-[45px] w-[160px] flex-1 items-center justify-center px-5 text-center  text-[15px] uppercase leading-none text-[#EEEEEE]  outline-none  transition-all  duration-150 ease-linear target:text-primary hover:text-primary  focus:text-primary  focus:outline-none  active:bg-primary  ">
          {String(data.nextAppointment)}
        </div>
      },
    },
    {
      accessorKey: "customerState",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="State" />
      ), cell: ({ row }) => {
        const data = row.original
        //  const id = data.id ? data.id.toString() : '';
        return <div className="  flex h-[45px] w-[95%] items-center justify-center   text-[15px] uppercase leading-none outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none active:bg-primary">

          {data.customerState === 'Pending' ? (<AttemptedOrReached data={data} />
          ) : data.customerState === 'Attempted' ? (<AttemptedOrReached data={data} />
          ) : data.customerState === 'Reached' ? (<Badge className="bg-[#29a383] text-foreground">Reached</Badge>
          ) : data.customerState === 'sold' ? (<Badge className="bg-[#29a383] text-foreground">Sold</Badge>
          ) : data.customerState === 'depositMade' ? (<Badge className="bg-[#29a383] text-foreground">Deposit</Badge>
          ) : data.customerState === 'turnOver' ? (<Badge className="bg-[#0090ff]">Turn Over</Badge>
          ) : data.customerState === 'financeApp' ? (<Badge className="bg-[#0090ff]">Application Done</Badge>
          ) : data.customerState === 'approved' ? (<Badge className="bg-[#29a383] text-foreground">Approved</Badge>
          ) : data.customerState === 'signed' ? (<Badge className="bg-[#29a383] text-foreground">Signed</Badge>
          ) : data.customerState === 'pickUpSet' ? (<Badge className="bg-[#29a383] text-foreground">Pick Up Set</Badge>
          ) : data.customerState === 'delivered' ? (<Badge className="bg-[#29a383] text-foreground">Delivered</Badge>
          ) : data.customerState === 'refund' ? (<Badge className="bg-[#cf5454]">Refunded</Badge>
          ) : data.customerState === 'funded' ? (<Badge className="bg-[#cf5454]">Funded</Badge>
          ) : (
            ''
          )}
        </div>
      },
    },
    {
      accessorKey: "contact",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact" />
      ),
      cell: ({ row }) => {
        const data = row.original
        const [isButtonPressed, setIsButtonPressed] = useState(false);
        const handleLoad = () => {
          const iFrameData = {
            user,
            searchData,
            data
          }
          console.log(iFrameData, 'iFrameData')
          iFrameRef.current?.contentWindow?.postMessage(iFrameData, '*');
        }
        return <>
          <div className='my-2 grid grid-cols-3 gap-3'>
            <LogCall data={data} />
            <EmailClient data={data} setIsButtonPressed={setIsButtonPressed} isButtonPressed={isButtonPressed} />
            <Button variant='ghost' onClick={handleLoad} className='my-auto mx-auto'>
              <Logtext data={data} searchData={searchData} iFrameRef={iFrameRef} />
            </Button>
          </div>
        </>
      },
    },
    {
      accessorKey: "model",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Model" />
      ),
      cell: ({ row }) => {
        const data = row.original
        return <div className="w-[275px] cursor-pointer  text-center text-[14px]  text-[#EEEEEE]">
          <ClientVehicleCard data={data} />
        </div>
      },
    },
    {
      accessorKey: "tradeDesc",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trade" />
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[250px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[13px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("tradeDesc"))}</div>
      },

    },
    {
      accessorKey: "lastNote",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Note" />
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("lastNote"))}</div>
      },

    },
    {
      accessorKey: "singleFinNote",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Notes" />
      ),
      cell: ({ row }) => {
        const data = row.original;
        const single = data.singleFinNote;
        const last = data.lastNote
        if (single) {
          return (
            { single }
          )
        }
        else if (last) {
          return (
            { last }
          )
        }
        else
          return null;
      },
    },
    {
      accessorKey: "followUpDay",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Preset F/U Day" />
      ),
      cell: ({ row }) => {
        const data = row.original
        return <>

          <div className='w-[150px]'>
            <PresetFollowUpDay data={data} />
          </div>
        </>
      },
    },
    {
      accessorKey: "twoDaysFromNow",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Set New Apt." />
      ),
      cell: ({ row }) => {
        const navigation = useNavigation();
        const isSubmitting = navigation.state === "submitting";
        const data = row.original
        return <>

          <div className='w-[200px]'>
            <TwoDaysFromNow data={data} isSubmitting={isSubmitting} />
          </div>
        </>
      },
    },
    {
      accessorKey: "completeCall",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Complete Call" />
      ),
      cell: ({ row }) => {
        const data = row.original
        const contactMethod = data.contactMethod
        return <>

          <div className='w-[125px] cursor-pointer'>

            <CompleteCall data={data} contactMethod={contactMethod} />
          </div>
        </>
      },
    },
    {
      accessorKey: "contactTimesByType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact Times By Type" />
      ),
      cell: ({ row }) => {
        const data = row.original
        //
        return <>
          <div className='w-[175px] cursor-pointer'>
            <ContactTimesByType data={data} />
          </div>
        </>
      },
    },
    {
      accessorKey: "pickUpDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pick Up Date" className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary " />
      ),
      cell: ({ row }) => {
        const data = row.original
        if (data.pickUpDate) {
          const pickupDate = data.pickUpDate
          return (
            <div className="bg-transparent :text-primary text-grbg-transparent text-gray-300 mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
              {pickupDate === '1969-12-31 19:00' || pickupDate === null ? 'TBD' : pickupDate}
            </div>
          );
        } else
          return null;
      },
    },
    {
      accessorKey: "lastContact",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Contacted" className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary" />
      ),
      cell: ({ row }) => {
        const data = row.original
        const date = new Date(data.lastContact);
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };
        if (date) {
          return (
            <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
              {date === 'TBD' ? <p>TBD</p> : date.toLocaleDateString('en-US', options)}
            </div>
          );
        }
        return null;
      },

    },
    {
      accessorKey: "unitPicker",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Turnover" />
      ),
      cell: ({ row }) => {
        const data = row.original
        const lockedValue = Boolean(true)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const navigation = useNavigation();
        const isSubmitting = navigation.state === "submitting";
        const PromiseConst = async () => {
          const promise = await new Promise(resolve => setTimeout(resolve, 3000));
          return promise
        }
        PromiseConst()


        /**
         * <FinanceTurnover data={data} lockedValue={lockedValue} />
            <input type='hidden' name='intent' value='financeTurnover' />
            <Form method='post' onSubmit={handleSubmit}>
                <input type='hidden' name='locked' value={lockedValue} />
                <input type='hidden' name='financeId' value={data.id} />
            </Form>

            *
            */
        return <>
          <div className='w-[175px] cursor-pointer'>
            <Form method='post' >
              <input type='hidden' name='intent' value='financeTurnover' />
              <input type='hidden' name='locked' value={lockedValue} />
              <input type='hidden' name='financeId' value={data.id} />
              <ButtonLoading
                size="lg"
                className="w-auto cursor-pointer ml-auto mt-5 hover:text-primary"
                type="submit"
                isSubmitting={isSubmitting}
                onClick={() => toast.success(`Informing finance managers of requested turnover...`)}
                loadingText="Updating client info..."
              >
                Finance Turnover
              </ButtonLoading>
            </Form>
          </div>
        </>
      },
    },

    {
      accessorKey: "id",

      cell: ({ row }) => {
        const data = row.original
        return (
          <>
            {/* <DocuUploadDashboard data={data} />*/}
          </>
        );
      },

    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <p className="text-center">email</p>
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("email"))}</div>
      },

    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <p className="text-center">phone</p>
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("phone"))}</div>
      },

    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <p className="text-center">address</p>
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("address"))}</div>
      },

    },
    {
      accessorKey: "postal",
      header: ({ column }) => (
        <p className="text-center">postal</p>
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                hover:shadow-md


                focus:text-primary
                 focus:outline-none active:bg-primary">{(row.getValue("postal"))}</div>
      },

    },
    {
      accessorKey: "city",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="city" />
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                hover:shadow-md


                focus:text-primary
                 focus:outline-none active:bg-primary">{(row.getValue("city"))}</div>
      },

    },
    {
      accessorKey: "province",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="province" />
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                hover:shadow-md


                focus:text-primary
                 focus:outline-none active:bg-primary">{(row.getValue("province"))}</div>
      },

    },
    {
      accessorKey: "financeId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="financeId" />
      ), cell: ({ row }) => {
        return <div className="w-[200px] text-center font-medium">{(row.getValue("financeId"))}</div>
      },

    },
    {
      accessorKey: "userEmail",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="userEmail" />
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                hover:shadow-md


                focus:text-primary
                 focus:outline-none active:bg-primary">{(row.getValue("userEmail"))}</div>
      },

    },
    {
      accessorKey: "pickUpTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pick Up Time" />
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-gray-300 mx-1 flex h-[45px] w-[125px] w-[95%] flex-1 cursor-pointer items-center  justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-primary  hover:text-primary  focus:text-primary focus:outline-none active:bg-primary ">
          {(row.getValue("pickUpTime"))}
        </div>
      },

    },

    {
      accessorKey: "timeToContact",
      header: "model1",
    },
    {
      accessorKey: "deliveredDate",
      header: "deliveredDate",
    },
    {
      accessorKey: "timeOfDay",
      header: "timeOfDay",
    },
    {
      accessorKey: "msrp",
      header: "msrp",
    },
    {
      accessorKey: "freight",
      header: "freight",
    },
    {
      accessorKey: "pdi",
      header: "pdi",
    },
    {
      accessorKey: "admin",
      header: "admin",
    },
    {
      accessorKey: "commodity",
      header: "commodity",
    },
    {
      accessorKey: "accessories",
      header: "accessories",
    },
    {
      accessorKey: "labour",
      header: "labour",
    },
    {
      accessorKey: "painPrem",
      header: "painPrem",
    },
    {
      accessorKey: "licensing",
      header: "licensing",
    },
    {
      accessorKey: "trailer",
      header: "trailer",
    },
    {
      accessorKey: "depositMade",
      header: "depositMade",
    },
    {
      accessorKey: "months",
      header: "months",
    },
    {
      accessorKey: "iRate",
      header: "iRate",
    },
    {
      accessorKey: "on60",
      header: "on60",
    },
    {
      accessorKey: "biweekly",
      header: "biweekly",
    },
    {
      accessorKey: "weekly",
      header: "weekly",
    },
    {
      accessorKey: "qc60",
      header: "qc60",
    },
    {
      accessorKey: "biweeklyqc",
      header: "biweeklyqc",
    },
    {
      accessorKey: "weeklyqc",
      header: "weeklyqc",
    },
    {
      accessorKey: "nat60",
      header: "nat60",
    },
    {
      accessorKey: "biweeklNat",
      header: "biweeklNat",
    },
    {
      accessorKey: "weeklylNat",
      header: "weeklylNat",
    },
    {
      accessorKey: "oth60",
      header: "oth60",
    },
    {
      accessorKey: "biweekOth",
      header: "biweekOth",
    },
    {
      accessorKey: "weeklyOth",
      header: "weeklyOth",
    },
    {
      accessorKey: "nat60WOptions",
      header: "nat60WOptions",
    },
    {
      accessorKey: "desiredPayments",
      header: "desiredPayments",
    },
    {
      accessorKey: "biweeklNatWOptions",
      header: "biweeklNatWOptions",
    },
    {
      accessorKey: "weeklylNatWOptions",
      header: "weeklylNatWOptions",
    },
    {
      accessorKey: "oth60WOptions",
      header: "oth60WOptions",
    },
    {
      accessorKey: "biweekOthWOptions",
      header: "biweekOthWOptions",
    },
    {
      accessorKey: "visited",
      header: "visited",
    },
    {
      accessorKey: "aptShowed",
      header: "aptShowed",
    },
    {
      accessorKey: "bookedApt",
      header: "bookedApt",
    },
    {
      accessorKey: "aptNoShowed",
      header: "aptNoShowed",
    },
    {
      accessorKey: "testDrive",
      header: "testDrive",
    },
    {
      accessorKey: "metParts",
      header: "metParts",
    },
    {
      accessorKey: "sold",
      header: "sold",
    },

    {
      accessorKey: "refund",
      header: "refund",
    },
    {
      accessorKey: "turnOver",
      header: "turnOver",
    },
    {
      accessorKey: "financeApp",
      header: "financeApp",
    },
    {
      accessorKey: "approved",
      header: "approved",
    },
    {
      accessorKey: "signed",
      header: "signed",
    },

    {
      accessorKey: "pickUpSet",
      header: "pickUpSet",
    },
    {
      accessorKey: "demoed",
      header: "demoed",
    },

    {
      accessorKey: "tradeMake",
      header: "tradeMake",
    },
    {
      accessorKey: "tradeYear",
      header: "tradeYear",
    },
    {
      accessorKey: "tradeTrim",
      header: "tradeTrim",
    },
    {
      accessorKey: "tradeColor",
      header: "tradeColor",
    },
    {
      accessorKey: "tradeVin",
      header: "tradeVin",
    },
    {
      accessorKey: "delivered",
      header: "delivered",
    },
    {
      accessorKey: "desiredPayments",
      header: "desiredPayments",
    },
    {
      accessorKey: "result",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Result" />
      ), cell: ({ row }) => {

        return <div className="w-[250px] text-center font-medium">
          Result
        </div>
      },

    },
    {
      accessorKey: "referral",
      header: "referral",
    },
    {
      accessorKey: "metService",
      header: "metService",
    },

    {
      accessorKey: "metManager",
      header: "metManager",
    },
    {
      accessorKey: "metParts",
      header: "metParts",
    },
    {
      accessorKey: "timesContacted",
      header: "timesContacted",
    },

    {
      accessorKey: "visits",
      header: "visits",
    },
    {
      accessorKey: "financeApplication",
      header: "financeApplication",
    },
    {
      accessorKey: "progress",
      header: "progress",
    },

    {
      accessorKey: "metFinance",
      header: "metFinance",
    },
    {
      accessorKey: "metSalesperson",
      header: "metSalesperson",
    },
    {
      accessorKey: "seenTrade",
      header: "seenTrade",
    },
    {
      accessorKey: "docsSigned",
      header: "docsSigned",
    },
    {
      accessorKey: "tradeRepairs",
      header: "tradeRepairs",
    },
    {
      accessorKey: "tradeValue",
      header: "tradeValue",
    },
    {
      accessorKey: "modelCode",
      header: "modelCode",
    },
    {
      accessorKey: "color",
      header: "color",
    },
    {
      accessorKey: "model1",
      header: "model1",
    },
    {
      accessorKey: "stockNum",
      header: "stockNum",
    },
    {
      accessorKey: "otherTaxWithOptions",
      header: "otherTaxWithOptions",
    },
    {
      accessorKey: "totalWithOptions",
      header: "totalWithOptions",
    },
    {
      accessorKey: "otherTax",
      header: "otherTax",
    },
    {
      accessorKey: "qcTax",
      header: "lastContact",
    },
    {
      accessorKey: "deposit",
      header: "tradeValue",
    },
    {
      accessorKey: "rustProofing",
      header: "modelCode",
    },
    {
      accessorKey: "lifeDisability",
      header: "color",
    },
    {
      accessorKey: "userServicespkg",
      header: "model1",
    },
    {
      accessorKey: "userExtWarr",
      header: "userExtWarr",
    },
    {
      accessorKey: "userGap",
      header: "userGap",
    },
    {
      accessorKey: "userTireandRim",
      header: "userTireandRim",
    },
    {
      accessorKey: "userLoanProt",
      header: "userLoanProt",
    },
    {
      accessorKey: "deliveryCharge",
      header: "lastContact",
    },
    {
      accessorKey: "onTax",
      header: "tradeValue",
    },
    {
      accessorKey: "total",
      header: "modelCode",
    },
    {
      accessorKey: "typeOfContact",
      header: "typeOfContact",
    },
    {
      accessorKey: "contactMethod",
      header: "contactMethod",
    },
    {
      accessorKey: "note",
      header: "note",
    },



  ]

  //
  const [key, setKey] = useState(0);
  const [lockData, setLockData] = useState();
  const [financeData, setFinanceData] = useState();
  const submit = useSubmit();
  const [openResponse, setOpenResponse] = useState(false);

  useEffect(() => {
    const handleData = (msg, data) => {
      console.log('Received data:', data);
      setOpen(true)
      setLockData(data)
    };
    emitter.on('LOCKED_STATUS_RESPONSE', handleData);
    return () => {
      emitter.off('LOCKED_STATUS_RESPONSE', handleData);
    };
  }, []);

  const responseFetcher = async () => {
    const getLocked = await prisma.lockFinanceTerminals.findFirst({ where: { salesEmail: user.email, locked: false, response: false } })
    if (getLocked !== null) {
      setLockData(getLocked)
      setOpenResponse(true)
    }
  }

  const { data: locked, error } = useSWR(responseFetcher, {
    refreshInterval: 60000,
    revalidateOnMount: true,
    revalidateOnReconnect: true
  });

  useEffect(() => {
    if (locked) {
      setLockData(locked.locked)
      setFinanceData(locked.locked)
      setOpenResponse(true);
      console.log(lockData, financeData, 'data')
    }
  }, [locked]);

  if (error) {
    console.log('SWR error:', error);
  }

  const HandleButtonClick = async () => {
    const formData = new FormData();
    formData.append("claimId", lockData.lockedId);
    formData.append("intent", 'responseClientTurnover');
    const update = submit(formData, { method: "post" });
    setOpenResponse(false)
    return json({ update })
  };

  return (
    <div className="mx-auto mt-5">
      <div className="block md:hidden">
        <SmDataTable columns={smColumns} data={data} />
      </div>
      <div className="hidden md:block w-[98%] ">
        <DataTable
          columns={columns}
          data={data}
          user={user}
        />
      </div>

    </div>
  )
}
export type Payment = {
  id: string
  fiannceId: string//
  userEmail: string//
  isSubmitting: any
  firstName: string
  lastName: string
  phone: number
  email: string
  address: string
  postal: string
  city: string
  province: string
  contactMethod: string
  brand: string
  model: string
  year: number
  color: string
  note: string
  lastContact: string
  status: 'Active' | 'Duplicate' | 'Invalid' | 'Lost'
  customerState: string
  result: string
  timesContacted: number
  nextAppointment: string//
  completeCall: string
  followUpDay: number
  state: string
  typeOfContact: string | null;
  timeToContact: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime' | 'Do Not Call'
  notes: string
  visits: number
  progress: number
  visited: string
  metManager: string
  metSalesperson: string
  metFinance: string
  metService: string
  metParts: string
  financeApplication: string
  approved: string
  docsSigned: string
  delivered: string
  pickUpSet: string
  demoed: string
  seenTrade: string
  tradeRepairs: string
  dashData: string
  twoDaysFromNow: string
  referral: string
  dl: string
  timeOfDay: string
  discount: string
  total: string
  onTax: string
  deliveryCharge: string
  userLoanProt: string
  userTireandRim: string
  userGap: string
  userExtWarr: string
  userServicespkg: string
  vinE: string
  lifeDisability: string
  rustProofing: string
  userOther: string
  deposit: string
  paintPrem: string
  discountPer: string
  weeklyOthWOptions: string
  qcTax: string
  otherTax: string
  totalWithOptions: string
  otherTaxWithOptions: string
  stockNum: string
  model1: string
  modelCode: string
  tradeValue: string
  undefined: string
  pickUpDate: string
  pickUpTime: string
  lastNote: string
  singleFinNote: string
  documentUpload: string
  depositMade: string
  financeApp: string
  signed: string
  deliveredDate: string
  contactTimesByType: string
  InPerson: string
  Phone: string
  SMS: string
  Email: string

}
export type TableMeta = {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void
}
export const defaultColumn: Partial<ColumnDef<Payment>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue)

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      ; (table.options.meta as TableMeta).updateData(index, id, value)
    }

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    return (
      <input
        value={value as string}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
      />
    )
  },
}
export const meta = () => {
  return [
    { title: 'Sales Leads - Dealer Sales Assistant' },
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
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: secondary },
  { rel: "icon", type: "image/svg", sizes: "32x32", href: "/money24.svg", },
  { rel: "icon", type: "image/svg", sizes: "16x16", href: "/money16.svg", },
];

export async function loader({ request, params }: LoaderFunction) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await GetUser(email)
  console.log(user, email, 'dashboard laoder')
  if (!user) { redirect('/login') }
  const proxyPhone = '+12176347250'
  const deFees = await getDealerFeesbyEmail(user.email);
  const session = await sixSession(request.headers.get("Cookie"));
  const sliderWidth = session.get("sliderWidth");
  const getTemplates = await prisma.emailTemplates.findMany({ where: { userEmail: user.email, }, });
  const finance = await prisma.finance.findMany({ where: { userEmail: user?.email }, });
  const urlSegmentsDashboard = new URL(request.url).pathname.split("/");
  const dashBoardCustURL = urlSegmentsDashboard.slice(0, 3).join("/");
  const financeNotes = await prisma.financeNote.findMany({ orderBy: { createdAt: "desc" }, });
  const conversations = await prisma.comm.findMany({ orderBy: { createdAt: "desc" }, });
  const getWishList = await prisma.wishList.findMany({ orderBy: { createdAt: 'desc', }, where: { userId: user?.id } });

  const fetchLatestNotes = async (webLeadData) => {
    const promises = webLeadData.map(async (webLeadData) => {
      try {
        const latestNote = await prisma.financeNote.findFirst({
          where: { financeId: webLeadData.financeId },
          orderBy: { createdAt: 'desc' },
        });
        return latestNote;
      } catch (error) {
        console.error('Error fetching note:', error);
        return null;
      }
    });

    return Promise.all(promises);
  };
  const latestNotes = await fetchLatestNotes(finance);

  const wishList = await prisma.wishList.findMany({ where: { userId: user?.id }, })
  const inventory = await prisma.inventoryMotorcycle.findMany({
    select: { make: true, model: true, status: true, }
  })

  function calculateSimilarity(modelName1, modelName2, make) {
    let components1
    if (make === 'Harley-Davidson') {
      components1 = modelName1.split(' - ')[2].toLowerCase();
    } else {
      components1 = modelName1.split(' - ').map(component => component.toLowerCase());
    }
    const components2 = modelName2.split(' ')[0].toLowerCase()

    const multiSearchAtLeastN = (text, searchWords, minimumMatches) => (
      searchWords.some(word => text.includes(word) && --minimumMatches <= 0)
    );
    let name = modelName2.toLowerCase()
    let spl = name.split(' - ');
    let passed = multiSearchAtLeastN(modelName1.toLowerCase(), spl, 1);
    // console.log(name, modelName1.toLowerCase(), 'checking final verification ')
    //  console.log(passed);
    return passed
  }
  const filteredEmailsSet = new Set();

  async function processWishList() {
    for (const wishListItem of wishList) {
      for (const inventoryItem of inventory) {
        const similarityScore = calculateSimilarity(wishListItem.model, inventoryItem.model, inventoryItem.make);
        if (
          wishListItem.notified !== 'true' &&
          wishListItem.brand === inventoryItem.make &&
          similarityScore === true
          // && inventoryItem.status === 'available'
        ) {
          filteredEmailsSet.add(`${wishListItem.email} -- ${wishListItem.model}`);
          if (!wishListItem.notified) {
            await prisma.notificationsUser.create({
              data: {
                title: `Bike found for ${wishListItem.firstName} ${wishListItem.lastName}`,
                content: `${wishListItem.model} just came in - ${wishListItem.email} ${wishListItem.phone}`,
                read: 'false',
                type: 'updates',
                from: 'Wish List Update',
                userId: user?.id,
              }
            });
            await prisma.wishList.update({
              where: { id: wishListItem.id },
              data: { notified: 'true' }
            });
          }
        }
      }
    }
  }
  const wishlistMatches = processWishList().then(() => {
    // Handle completion if needed
  }).catch(error => {
    console.error('Error processing wish list:', error);
  });

  const getDemoDay = await prisma.demoDay.findMany({ orderBy: { createdAt: 'desc', }, where: { userEmail: 'skylerzanth@outlook.com' } });

  const webLeadData = await prisma.finance.findMany({
    where: { OR: [{ userEmail: null }, { userEmail: '' }], },
  });

  let callToken;
  let username = 'skylerzanth'//localStorage.getItem("username") ?? "";
  let password = 'skylerzanth1234'//localStorage.getItem("password") ?? "";
  if (username.length > 0 && password.length > 0) {
    const token = await getToken(username, password)
    callToken = token
  }

  const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2';
  const authToken = 'd38e2fd884be4196d0f6feb0b970f63f';
  const godClient = require('twilio')(accountSid, authToken);
  const client = godClient

  let convoList = {}
  let conversationSid;
  let participantSid;
  let userSid;
  let conversationChatServiceSid;
  let newToken;

  const firstTime = await prisma.twilioSMSDetails.findUnique({ where: { userEmail: 'skylerzanth@gmail.com', } })//user?.email } })

  if (!firstTime) {
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    async function performOperations() {
      try {
        // Create a conversation
        const conversation = await client.conversations.v1.conversations.create({ friendlyName: 'My test' });
        const conversationSid = conversation.sid;

        // Fetch conversation details
        await delay(50);
        try {
          const fetchedConversation = await client.conversations.v1.conversations(conversationSid).fetch();
          conversationChatServiceSid = fetchedConversation.body;
        } catch (error) { console.error('Error fetching conversation:', error); }

        // Create a participant/customer
        await delay(50);
        try {
          const participant = await client.conversations.v1.conversations(conversationSid).participants.create({
            'messagingBinding.address': `+1${user?.phone}`, // customers number
            'messagingBinding.proxyAddress': proxyPhone,
          });
          participantSid = participant.sid;
        } catch (error) { console.error('Error creating participant:', error); }

        // Create a user // need tog et rid of this when when wqe use this to create convos
        await delay(50);
        try {
          const createdUser = await client.conversations.v1.users.create({ identity: `${username}` });
          userSid = createdUser.sid;
        } catch (error) { console.error('Error creating user:', error); }

        // Create a participant for the user/employee
        await delay(50);
        try {
          const userParticipant = await client.conversations.v1.conversations(conversationSid)
            .participants
            .create({ identity: `${username}` });
          userSid = userParticipant.sid
        } catch (error) { console.error('Error creating user:', error); }

        // List user conversations
        await delay(50);
        try {
          convoList = await client.conversations.v1.users(userSid).userConversations.list({ limit: 50 });
          //   userConversations.forEach(u => console.log(u.friendlyName));
        } catch (error) { console.error('Error creating user:', error); }


      } catch (error) { console.error('Error performing operations:', error); }
    }

    // Call the function
    performOperations();

    await prisma.twilioSMSDetails.create({
      data: {
        conversationSid: conversationSid,
        participantSid: participantSid,
        userSid: userSid,
        username: username,
        userEmail: 'skylerzanth@gmail.com', // email,
        passClient: password,
        proxyPhone: proxyPhone,
      }
    })

  }
  let getConvos;

  if (!Array.isArray(convoList) || convoList.length === 0) {
    getConvos = await client.conversations.v1.users(`${username}`).userConversations.list({ limit: 50 });
    // .then(userConversations => userConversations.forEach(u => console.log(u.friendlyName)))
    convoList = getConvos;
  }

  const conversation = await prisma.getConversation.findFirst({
    where: { userEmail: 'skylerzanth@gmail.com'/*user.email*/ },
    orderBy: {
      createdAt: 'desc', // or updatedAt: 'desc'
    },
  });
  let getText
  if (conversation) {
    const storeObject = JSON.parse(conversation.jsonData);
    // console.log(storeObject);

    // Extract conversationSid from the first object in the array
    const conversationSid = storeObject[0].conversationSid;

    if (conversationSid) {
      //  console.log(conversationSid, 'channels');
      getText = await client.conversations.v1.conversations(conversationSid)
        .messages
        .list({ limit: 200 });
    } else {
      console.log('conversationSid is undefined');
    }
  }

  const userAgent = request.headers.get('User-Agent');
  const isMobileDevice = checkForMobileDevice(userAgent);
  const rotationList = await prisma.user.findMany()

  return json({
    ok: true,
    getDemoDay,
    finance,
    deFees,
    sliderWidth,
    user,
    financeNotes,
    latestNotes,
    dashBoardCustURL,
    getWishList,
    conversations,
    webLeadData,
    getTemplates,
    request,
    wishlistMatches,
    callToken,
    convoList, username, newToken, password, getText, isMobileDevice, email,
    rotationList
  }, { headers: { "Set-Cookie": await commitSession(session2), }, })
}

export const action: ActionFunction = async ({ request, }) => {
  const formPayload = Object.fromEntries(await request.formData())
  const formData = financeFormSchema.parse(formPayload);
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")
  const user = await GetUser(email)
  if (!user) {
    redirect('/login')
  }
  const userId = user?.id;
  const intent = formPayload.intent;
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
        accessories: formData.accessories,
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
        tradeMileage: formData.tradeMileage,
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
    return json({ updateClient })
  }
  switch (intent) {
    case 'rotateSalesQueue':
      const firstPerson = await prisma.user.findFirst({
        where: {
          positions: {
            some: {
              position: 'Sales'
            }
          }
        },
        orderBy: { order: 'asc' }
      });

      if (!firstPerson) return;

      const otherPeople = await prisma.user.findMany({
        where: {
          positions: {
            some: {
              position: 'Sales'
            }
          }
        },
        orderBy: { order: 'asc' }
      });

      await prisma.user.update({
        where: { id: firstPerson.id },
        data: { order: otherPeople.length + 1 },
      });

      for (let i = 0; i < otherPeople.length; i++) {
        await prisma.user.update({
          where: { id: otherPeople[i].id },
          data: { order: i + 1 },
        });
      }
      const updatedSalesPeople = await prisma.user.findMany({
        orderBy: { order: 'asc' },
      });
      return updatedSalesPeople
      break;
    case 'rotateFinanceQueue':
      const firstFinance = await prisma.user.findFirst({
        where: {
          positions: {
            some: {
              position: 'Finance Manager'
            }
          }
        },
        orderBy: { order: 'asc' }
      });

      if (!firstFinance) return;

      const otherFinance = await prisma.user.findMany({
        where: {
          positions: {
            some: {
              position: 'Finance Manager'
            }
          }
        },
        orderBy: { order: 'asc' }
      });


      await prisma.user.update({
        where: { id: firstFinance.id },
        data: { order: otherFinance.length + 1 },
      });

      for (let i = 0; i < otherFinance.length; i++) {
        await prisma.user.update({
          where: { id: otherFinance[i].id },
          data: { order: i + 1 },
        });
      }
      const updatedFinance = await prisma.user.findMany({
        orderBy: { order: 'asc' },
      });
      return updatedFinance
      break;
    case 'resetQueue':
      const salesPeople = await prisma.user.findMany({
        where: {
          positions: {
            some: {
              position: 'Sales'
            }
          }
        },
        orderBy: { order: 'asc' }
      });

      const totalUsers = salesPeople.length;

      const orderNumbers = Array.from({ length: totalUsers }, (_, index) => index + 1);

      for (let i = 0; i < totalUsers; i++) {
        await prisma.user.update({
          where: { id: salesPeople[i].id },
          data: { order: orderNumbers[i] },
        });
      }

      const updatedSalesPeople3 = await prisma.user.findMany({
        orderBy: { order: 'asc' },
      });

      return json({ updatedSalesPeople3 });
    case 'resetQueueFinance':

      const financeManagers = await prisma.user.findMany({
        where: {
          positions: {
            some: {
              position: 'Finance Manager'
            }
          }
        },
        orderBy: { order: 'asc' }
      });
      const totalFinance = financeManagers.length;


      const orderNumbersFinance = Array.from({ length: totalFinance }, (_, index) => index + 1);

      for (let i = 0; i < totalFinance; i++) {
        await prisma.user.update({
          where: { id: financeManagers[i].id },
          data: { order: orderNumbersFinance[i] },
        });
      }

      const updatedFinance2 = await prisma.user.findMany({
        orderBy: { order: 'asc' },
      });

      return json({ updatedFinance2 });
    case 'navToFinanceFile':
      const clientfileId = formData.clientfileId
      const getFile = await prisma.finance.findFirst({
        where: { clientfileId: clientfileId }
      })
      return redirect(`/dealer/customer/${clientfileId}/${getFile?.id}`)
      break;
    case 'reading':
      const isRead = await prisma.notificationRead.updateMany({
        where: {
          notificationId: formData.id,
          userEmail: user.email
        },
        data: {
          read: true
        }
      });
      return isRead
    case 'financeTurnover':
      const claim = await prisma.lockFinanceTerminals.create({
        data: {
          financeId: formData.financeId,
          salesEmail: user?.email,
          locked: true
        }
      });
      const finance = await prisma.finance.update({
        where: { id: formData.financeId },
        data: { customerState: 'financeTurnover' }
      })
      const data = { locked: true, financeId: formData.id, salesEmail: user?.email, lockedId: claim.id };
      console.log('Publishing data:', data);
      emitter.emit('LOCKED_STATUS', data);
      return json({ claim, finance })
    case 'responseClientTurnover':
      const update = await prisma.lockFinanceTerminals.update({
        where: {
          id: formData.lockId,
        },
        data: {
          locked: false,
        },
      });
      return update
    case 'claimTurnover':
      const deleteWishList = await prisma.wishList.delete({
        where: {
          id: formData.rowId,
        },
      })
      return deleteWishList
      break;
    case 'deleteWishList':
      return null
      break;
    case 'wishListConvert':
      try {
        const clientfile = await prisma.clientfile.findUnique({ where: { email: formData.email, }, });
        const convert = await prisma.finance.create({
          data: {
            clientfileId: clientfile?.id,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            brand: formData.brand,
            model: formData.model,
            userEmail: formData.userEmail,
          }
        })
        return convert
      } catch (error) {
        const clientfile = await prisma.clientfile.create({
          data: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            userId: user.id,
          },
        });
        const convert = await prisma.finance.create({
          data: {
            clientfileId: clientfile.id,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            brand: formData.brand,
            model: formData.model,
            userEmail: formData.userEmail,
          }
        })
        return json({ convert, clientfile })
      }
      break;
    case 'editWishList':
      const addtoWishList = await prisma.wishList.update({
        where: {
          id: formData.rowId,
        },
        data: {
          userId: formData.userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          wishListNotes: formData.wishListNotes,
        }
      })
      return addtoWishList
    case 'createEmailTemplate':
      const template = await prisma.emailTemplates.create({
        data: {
          body: formData.body,
          subject: formData.subject,
          category: 'New template',
          subCat: 'Need to update',
          userEmail: user?.email,
          dept: 'sales',
          type: 'Text / Email',
        },
      });
      return template;
      break;
    case 'addWishList':
      const addtoWishList2 = await prisma.wishList.create({
        data: {
          userId: formData.userId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          brand: formData.brand,
          model: formData.model,
          brand2: formData.brand2,
          model2: formData.model2,
          wishListNotes: formData.notes,
        }
      })
      return addtoWishList2
      break;
    case 'selectBrand':
      console.log(formData.phone)
      const sessionOrder = await getOrder(request.headers.get("Cookie"));
      sessionOrder.set("firstName", formData.firstName);
      sessionOrder.set("lastName", formData.lastName);
      sessionOrder.set("phone", formData.phone);
      sessionOrder.set("email", formData.email);
      sessionOrder.set("address", formData.address);
      sessionOrder.set("financeId", formData.financeId);
      sessionOrder.set("activixId", formData.activixId);
      return redirect(`/quote/${formData.selectBrand}`, {
        headers: {
          "Set-Cookie": await commitOrder(sessionOrder),
        },
      });
      break;
    case 'addDemoDay':
      const addtoWishList3 = await prisma.demoDay.create({
        data: {
          userEmail: formData.userEmail,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          brand: formData.brand,
          model: formData.model,
          brand2: formData.brand2,
          model2: formData.model2,
          leadNote: formData.notes,
        }
      })
      return addtoWishList3
      break;
    case 'demoDayConvert':
      try {
        const clientfile = await prisma.clientfile.findUnique({ where: { email: formData.email, }, });
        const convert = await prisma.finance.create({
          data: {
            clientfileId: clientfile?.id,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            brand: formData.brand,
            model: formData.model,
            userEmail: formData.userEmail,
          }
        })
        return convert
      } catch (error) {
        const clientfile = await prisma.clientfile.create({
          data: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            userId: user.id,
          },
        });
        const convert = await prisma.finance.create({
          data: {
            clientfileId: clientfile.id,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            name: formData.name,
            brand: formData.brand,
            model: formData.model,
            userEmail: formData.userEmail,
          }
        })
        return json({ convert, clientfile })
      }
      break;
    case 'demoDayDelete':
      const edit = await prisma.demoDay.delete({
        where: {
          id: formData.id,
        }
      })
      return edit
      break;
    case 'demoDayEdit':
    case 'clientTurnover':
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
  const clientfileId = formData.clientfileId;
  let financeId = formData?.financeId;
  const session66 = await sixSession(request.headers.get("Cookie"));
  session66.set("financeId", financeId);
  session66.set("clientfileId", clientfileId);
  const serializedSession = await sixCommit(session66);

  let pickUpDate;
  if (pickUpDate === null || pickUpDate === undefined) {
    pickUpDate = "To Be Det.";
  }
  const id = formData?.id;
  const to = formData.customerEmail
  const text = formData.customContent
  const subject = formData.subject
  const tokens = formData.tokens
  const followUpDay = formData.followUpDay
  let date = new Date();
  let brand = formPayload.brand
  const apptId = formData.id;
  let customerState = formData.customerState;
  if (customerState === "Pending") {
    customerState = "Attempted";
  }
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  let { clientData, dashData, financeData } = DataForm(formData);

  switch (intent) {
    case 'newLead':
      const activixActivated = user?.activixActivated
      if (activixActivated === 'yes') {
        await QuoteServerActivix(clientData, financeId, email, financeData, dashData)
      }
      const create = await QuoteServer(formData)
      return create
    case 'EmailClient':
      const comdata = {
        financeId: formData.financeId,
        userEmail: user?.email,
        content: formData.customContent,
        title: formData.subject,
        direction: formData.direction,
        result: formData.customerState,
        subject: formData.subject,
        type: 'Email',
        userName: user?.name,
        date: new Date().toISOString(),
      }
      const sendEmail = await SendEmail(user, to, subject, text, tokens)
      const setComs = await prisma.communicationsOverview.create({ data: comdata, });
      const saveComms = await ComsCount(financeId, 'Email')
      return json({ sendEmail, saveComms, formData, setComs, })
      break;
    case 'callClient':
      const accountSid = 'AC9b5b398f427c9c925f18f3f1e204a8e2'
      const authToken = 'd38e2fd884be4196d0f6feb0b970f63f'
      const client = require('twilio')(accountSid, authToken);
      const comdata2 = {
        financeId: formData.financeId,
        userEmail: user?.email,
        content: formData.customContent,
        title: formData.subject,
        direction: formData.direction,
        result: formData.customerState,
        subject: formData.subject,
        type: 'Phone',
        userName: user?.name,
        date: new Date().toISOString(),
      }
      const callCLient = await client.calls
        .create({
          twiml: '<Response><Say>Ahoy, World!</Say></Response>',
          to: `+1${user.phone}`,
          from: '+12176347250'
        })
        .then(call => console.log(call.sid));
      const date56 = new Date();

      const setComs2 = await prisma.finance.update({
        where: { id: formData.financeId },
        data: {
          Phone: formData.Phone += 1,
          lastContact: date56.toLocaleDateString('en-US', options)
        },
      });
      return json({ callCLient, formData, setComs2, })//, redirect(`/dummyroute`)
      break;
    case 'textQuickFU':
      console.log('hit textquick fu')
      const completeApt3 = await CompleteLastAppt(userId, financeId)
      const doTGwoDays = await TwoDays(followUpDay, formData, financeId, user)
      // const setComs = await CreateCommunications(comdata)
      const comdata3 = {
        financeId: formData.financeId,
        userId: formData.userId,
        content: formData.note,
        title: formData.title,
        direction: formData.direction,
        result: formData.resultOfcall,
        subject: formData.messageContent,
        type: 'Text',
        userName: user?.name,
        date: new Date().toISOString(),
      }
      const setComs3 = await prisma.communicationsOverview.create({
        data: comdata3,
      });
      const saveComms3 = await ComsCount(financeId, 'SMS')
      return json({ doTGwoDays, completeApt3, setComs3, saveComms3 });
      break;
    case '2DaysFromNow':
      const followUpDay2 = parseInt(formData.followUpDay1);
      console.log('followUpDay:', followUpDay2);
      function addDays(days) {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + days);
        return currentDate;
      }
      financeId = formData?.financeId;
      const completeApt = await CompleteLastAppt(formData, user)
      let newDate = addDays(followUpDay2);
      const date = new Date(newDate);

      const apptDate = date.toLocaleDateString('en-US', options)
      const todaysDate = new Date()
      const lastContacted = todaysDate.toLocaleDateString('en-US', options)
      const finance = await prisma.finance.update({
        where: { id: formData.financeId },
        data: {
          clientfileId: formData.clientfileId,
          lastContact: lastContacted,
          status: formData.status,
          customerState: formData.customerState,
          timesContacted: formData.timesContacted,
          nextAppointment: apptDate,
          followUpDay: apptDate,

        },
      });
      const createFollowup = await prisma.clientApts.create({
        data: {
          financeId: formData.financeId,
          userEmail: formData.userEmail || '',
          address: formData.address,
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
          end: String(new Date(new Date(apptDate).getTime() + 45 * 60000)),
          title: formData.title,
          start: String(apptDate),
          userId: user?.id,
          description: formData.description,
          resourceId: Number(formData.resourceId),
          userName: user?.name,
        }
      })
      return json({ finance, completeApt, createFollowup, });
      break;
    case 'completeApt':
      console.log('completeApt')
      const complete = CompleteLastAppt(userId, financeId)
      const addFU = formData.addFU
      const addDetailedFU = formData.addDetailedFU

      if (addFU === 'on') {
        const followUpDay3 = formData.followUpDay
        const twoDays = await TwoDays(followUpDay3, formData, financeId, user)
        return json({ complete, twoDays })
      }
      if (addDetailedFU === 'yes') {
        const followup = await FollowUpApt(formData, user, userId)
        return json({ complete, followup })
      }
      return null
    case 'scheduleFUp':
      console.log(formData, 'formData')

      let dateModal = new Date(formData.value);
      const year = dateModal.getFullYear();
      const month = String(dateModal.getMonth() + 1).padStart(2, '0');
      const day = String(dateModal.getDate()).padStart(2, '0');
      const hours = Number(formData.hours);
      const minutes = Number(formData.minutes);
      dateModal.setHours(hours, minutes);
      const dateTimeString = `${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00.000`;
      const date66 = new Date(dateTimeString);
      const options2 = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      const apptDate66 = date66.toLocaleDateString('en-US', options2)
      const todaysDate66 = new Date()
      const completeApt66 = await CompleteLastAppt(userId, financeId)
      console.log(completeApt66, 'CompleteLastAppt')

      const updating = await prisma.finance.update({
        where: { id: formData.financeId },
        data: {
          lastContact: todaysDate66.toLocaleDateString('en-US', options2),
          status: formData.status,
          customerState: formData.customerState,
          result: formData.result,
          timesContacted: formData.timesContacted,
          nextAppointment: apptDate66,
          followUpDay: apptDate66,

        },
      });
      console.log(updating, 'updating')
      const apptDat66 = date66.toLocaleDateString('en-US', options2)
      const createFollowup66 = await prisma.clientApts.create({
        data: {
          financeId: formData.financeId,
          userEmail: formData.userEmail,
          address: formData.address,
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
          end: String(new Date(new Date(apptDat66).getTime() + 45 * 60000)),
          title: formData.title,
          start: String(apptDat66),
          userId: user?.id,
          description: formData.description,
          resourceId: Number(formData.resourceId),
          userName: user?.name,
        }
      })
      console.log(createFollowup66, 'creating followup')
      return json({ updating, completeApt66, createFollowup66, });
    case 'updateFinance':
      console.log(formData, ' update finance data')

      const determineCustomerState = (formData) => {
        switch (true) {
          case formData.customerState === 'Pending':
            return 'Pending';
          case formData.customerState === 'Attempted':
            return 'Attempted';
          case formData.customerState === 'Reached':
            return 'Reached';
          case formData.customerState === 'Lost':
            return 'Lost';
          case formData.sold === 'on':
            return 'sold';
          case formData.depositMade === 'on':
            return 'depositMade';
          case formData.turnOver === 'on':
            return 'turnOver';
          case formData.financeApp === 'on':
            return 'financeApp';
          case formData.approved === 'on':
            return 'approved';
          case formData.signed === 'on':
            return 'signed';
          case formData.pickUpSet === 'on':
            return 'pickUpSet';
          case formData.delivered === 'on':
            return 'delivered';
          case formData.refund === 'on':
            return 'refund';
          case formData.funded === 'on':
            return 'funded';
          default:
            return null;
        }
      };
      const customerState = determineCustomerState(formData);

      let pickUpDate = ''
      if (formData.pickUpDate) {
        pickUpDate = new Date(formData.pickUpDate).toISOString()
      }
      let lastContact = new Date().toISOString()
      async function UpdateFinanceData(formData) {
        const updating = await prisma.finance.update({
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
            accessories: formData.accessories,
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
            tradeMileage: formData.tradeMileage,
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
            InPerson: formData.InPerson,
            Phone: formData.Phone,
            SMS: formData.SMS,
            Email: formData.Email,
            Other: formData.Other,
          }
        })
        return json({ updating })
      }
      switch (brand) {
        case "Manitou":
          const updatingManitouFinance = await UpdateFinanceData(formData);
          return json({ updatingManitouFinance });
        case "Switch":
          const updatingSwitchFinance = await UpdateFinanceData(formData);
          return json({ updatingSwitchFinance });
        case "BMW-Motorrad":
          const updatingBMWMotoFinance = await UpdateFinanceData(formData);
          return json({ updatingBMWMotoFinance });
        default:
          try {
            const finance = await UpdateFinanceData(formData)
            return { finance };
          } catch (error) {
            console.error("An error occurred while updating the records:", error);
            throw error;
          }
      }
      break;
    case 'updateFinanceWanted':

      const fullName = user.username;
      const words = fullName.split(' ');
      const firstName = words[0];
      const lastName = words[1];

      const updateLocal = await prisma.finance.update({
        where: { id: formData.financeId },
        data: {
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
          accessories: formData.accessories,
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
          tradeMileage: formData.tradeMileage,
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
        }
      })

      return json({ updateLocal })
    case 'createQuote':
      console.log("creating quote");
      return redirect(`/quote/${brand}/${financeId}`);
    case 'updateStatus':
      delete formData.brand;
      const dashboard = await prisma.finance.update({
        where: {
          id: formData.id,
        },
        data: {
          status: formData.status,
        }
      });
      return json({ dashboard });
      return null
    case 'clientProfile':
      console.log(clientfileId, financeId, 'dashboard calls')
      return redirect(`/customer/${clientfileId}/${financeId}`, {
        headers: {
          "Set-Cookie": serializedSession,
        },
      });
    case 'returnToQuote':
      return redirect(`/overview/customer/${financeId}`);
    case 'addAppt':
      const createAppt77 = await CreateAppt(formData);
      const completeCall77 = await CompleteLastAppt(userId, financeId);
      return json({ completeCall77, createAppt77 });
    case 'deleteApt':
      const newFormData = { ...formData };
      delete newFormData.intent;
      const deleteNote = await deleteFinanceAppts(newFormData);
      return json({ deleteNote });
      return null
    case 'updateFinanceAppt':
      const updateApt = await UpdateAppt(formData, apptId);
      return json({ updateApt });
    case 'AddCustomer':
      const create77 = await QuoteServer(formData)
      return create77
    case 'deleteCustomer':
      const deleteCust = await DeleteCustomer({ formData, formPayload });
      return json({ deleteCust });
    case 'saveFinanceNote':
      const createFinanceNotes = await prisma.financeNote.create({
        data: {
          body: formData.body,
          userEmail: formData.userEmail,
          clientfileId: formData.clientfileId,
          userName: formData.userName,
          financeId: formData.financeId,
        },
      });
      return createFinanceNotes;
    case 'updateFinanceNote':
      const updateNote = await updateFinanceNote(financeId, formData);
      return json({ updateNote });
    case 'deleteFinanceNote':
      const deleteNote88 = await deleteFinanceNote(id);
      return json({ deleteNote88 });
    default:
      break;
  }

  return null;
};
