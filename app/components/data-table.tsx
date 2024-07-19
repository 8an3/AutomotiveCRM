import { Button, Input, Separator, Checkbox, PopoverTrigger, PopoverContent, Popover, } from "~/components/ui/index";
import React, { useMemo, useEffect, useState, useRef, Suspense, forwardRef } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, type SortingState, getSortedRowModel, sortingFns, SortingFn, FilterFns, FilterFn, type VisibilityState, getFilteredRowModel, type ColumnFiltersState, } from "@tanstack/react-table";
import { DataTablePagination } from "~/components/dashboard/calls/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table";
import { Form, Link, useFetcher, useLoaderData, useTransition, Await, useSubmit } from "@remix-run/react";
import AddCustomer from "~/components/dashboard/calls/addCustomer";
import Filter from "~/components/dashboard/calls/Filter";
import { Cross2Icon } from "@radix-ui/react-icons";
import { CalendarCheck, Search, MailWarning, UserPlus, MessageSquare, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
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
import useSWR, { SWRConfig, mutate, useSWRConfig } from 'swr';
import { prisma } from "~/libs";
import { json, LinksFunction } from "@remix-run/node";
import { toast } from "sonner"
import MassEmail from "./dashboard/calls/massEmail";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion"
import MassSMS, { TextFunction } from "./dashboard/calls/massSms";
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  dashData: TData[];
  user: TData[]
}


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
    <div className="mb-[20px]  even:bg-background  rounded    justify-center">
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

function SimplerStaticVersion() {
  return (
    <p>Not working contact support...</p>
  )
}
function Loading() {
  return (
    <ul>
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <div className="spinner" />
        </li>
      ))}
    </ul>
  )
}
/*const FilterForm = ({ column }) => {
    const { filterValue, setFilter } = column;
    return (
        <span>
            <input
                value={filterValue || ''}
                onChange={(e) => setFilter(e.target.value)}
            />
        </span>
    );
};

export default FilterForm;
*/

/**
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className='border-transparent'>
          <AccordionTrigger className='border-transparent'>        <Button variant='outline' >Menu</Button>
          </AccordionTrigger>
          <AccordionContent>
            <div className="ml-auto flex items-center">
              <Select className='bg-background text-foreground border-border hover:text-primary  hover:border-primary'
                onValueChange={(value) => {
                  const item = CallsList.find(i => i.key === value) || DeliveriesList.find(i => i.key === value) || DepositsTakenList.find(i => i.key === value);
                  if (item) {
                    handleFilterChange(item.key);
                    setTodayfilterBy(item.name);
                  }
                }}>
                <SelectTrigger className="w-auto bg-background text-foreground border-border hover:border-primary hover:text-primary mr-3 ">
                  <SelectValue>{todayfilterBy || "Default Filters"}</SelectValue>
                </SelectTrigger>
                <SelectContent className='bg-background text-foreground'>
                  {CallsList.map((item) => (
                    <SelectItem value={item.key}>{item.name}</SelectItem>
                  ))}
                  {DeliveriesList.map((item) => (
                    <SelectItem value={item.key}>{item.name}</SelectItem>
                  ))}
                  {DepositsTakenList.map((item) => (
                    <SelectItem value={item.key}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleInputChange(value)} >
                <SelectTrigger className='text-foreground border-border w-auto  mr-3 hover:text-primary  hover:border-primary'>
                  Global Filters
                </SelectTrigger>
                <SelectContent align="end" className='bg-background text-foreground '>
                  {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                    <SelectItem key={column.id} value={column.id} className="bg-background text-foreground capitalize cursor-pointer  hover:underline hover:text-primary">
                      {column.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>


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

              <Button
                variant='outline'
                onClick={() => setAllFilters([])} className='bg-background text-foreground border-border hover:text-primary  hover:border-primary hover:bg-transparent mr-3' >
                Clear
              </Button>

              <Button
                variant='outline' onClick={toggleFilter} className='bg-background text-foreground border-border hover:text-primary  hover:border-primary hover:bg-transparent' >
                Toggle Col
              </Button>
              <div className="mx-2">
                <MassEmail table={table} user={user} />
              </div>
              <MassSMS data={data} table={table} />
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Rotation</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle className='font-thin uppercase'>Roation for Sales and Finance</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-0 grid grid-cols-1">
                      <div className="items-center justify-center space-x-2">
                        <h2 className='font-thin uppercase'>Sales People Rotation</h2>
                        <hr className=" text-muted-foreground w-[95%] mx-auto mb-2" />
                        <ul>
                          {salesPeople.map(person => (
                            <li className='text-muted-foreground mt-2' key={person.id}>{person.name}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="items-center justify-center space-x-2 mt-5">
                        <h2 className='font-thin uppercase'>Finance Manager Rotation</h2>
                        <hr className=" text-muted-foreground w-[95%] mx-auto" />
                        <ul>
                          {financeManager.map(person => (
                            <li className='text-muted-foreground mt-2' key={person.id}>{person.name}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1" className='border-transparent'>
                        <AccordionTrigger className='border-transparent'>        <Button variant='outline' className="w-auto cursor-pointer mt-3  bg-primary" >Actions</Button>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className='grid grid-cols-1 mt-5 mb-5' >
                            <Button
                              className="w-auto cursor-pointer  bg-primary"
                              onClick={() => {
                                rotateSalesQueue()
                                toast.success(`Rotating sales...`)
                              }
                              }
                            >
                              Rotate Sales
                            </Button>
                            <Button
                              className="w-auto cursor-pointer mt-3  bg-primary"
                              onClick={() => {
                                rotateFinanceQueue()
                                toast.success(`Rotating finance...`)
                              }
                              }
                            >
                              Rotate Finance
                            </Button>
                            <Button
                              className="w-auto cursor-pointer mt-3  bg-primary"
                              onClick={() => {
                                resetQueue()
                                toast.success(`Resetting sales...`)
                              }
                              }
                            >
                              Reset Sales
                            </Button>
                            <Button
                              className="w-auto cursor-pointer mt-3  bg-primary"
                              onClick={() => {
                                resetQueueFinance()
                                toast.success(`Resetting finance...`)
                              }
                              }
                            >
                              Reset Finance
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </DrawerContent>
              </Drawer>

              <div className="flex" >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <p className="cursor-pointer my-auto ml-5 mr-5 hover:text-primary ">
                      <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.14998 14V1H0.849976V14H2.14998ZM6.14998 14V1H4.84998V14H6.14998ZM10.15 1V14H8.84998V1H10.15ZM14.15 14V1H12.85V14H14.15Z" fill="#cbd0d4" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background text-black">
                    <ScrollArea className="h-[500px] w-[200px] rounded-md  p-4">
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
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AddCustomer />
                <Link to='/dealer/calendar/sales'>
                  <button className=' p-2 cursor-pointer hover:text-blue-8 justify-center items-center mr-3 border-[#fff]' >
                    <CalendarCheck color="#cbd0d4" size={20} strokeWidth={1.5} />
                  </button>
                </Link>
              </div>
            </div >
          </AccordionContent>
        </AccordionItem>
      </Accordion> */
