import React, { HTMLAttributes, HTMLProps, useState, useEffect, Suspense, useRef, } from 'react'
import { Await, Form, Link, useActionData, useFetcher, useLoaderData, useLocation, useNavigation, useSubmit } from '@remix-run/react'

import type {
  Table, Column, SortingFn, ColumnDef, ColumnFiltersState, SortingState, VisibilityState, FilterFn, ExpandedState, FilterFns,
} from "@tanstack/react-table";
import { toast } from "sonner"
import { type LinksFunction, type DataFunctionArgs, json } from '@remix-run/node';
import { type RankingInfo, rankItem, compareItems, } from '@tanstack/match-sorter-utils'

import { type dashBoardType } from "~/components/dashboard/schema";
import { DataTableColumnHeader } from "~/components/dashboard/calls/header"
import ClientCard from '~/components/dashboard/calls/clientCard';
import ClientVehicleCard from '~/components/dashboard/calls/clientVehicleCard';
import EmailClient from '~/components/dashboard/calls/emailClient';
import ClientStatusCard from '~/components/dashboard/calls/ClientStatusCard';
import CompleteCall from '~/components/dashboard/calls/completeCall';
import TwoDaysFromNow from '~/components/dashboard/calls/2DaysFromNow';
import { dashboardAction, dashboardLoader } from "~/components/actions/dashboardCalls";
import { ButtonLoading } from "~/components/ui/button-loading";
import AttemptedOrReached from "~/components/dashboard/calls/setAttOrReached";
import ContactTimesByType from "~/components/dashboard/calls/ContactTimesByType";
import LogCall from "~/components/dashboard/calls/logCall";
import Logtext from "~/components/dashboard/calls/logText";
import { Badge } from "~/ui/badge";
import secondary from "~/styles/secondary.css";

import { SmDataTable } from '~/components/smData-table';
import SmClientCard from '~/components/dashboard/calls/smClientCard';
import PresetFollowUpDay from '~/components/dashboard/calls/presetFollowUpDay';
import IndeterminateCheckbox from '~/components/actions/shared'
import {
  Button,
  Input,
  Separator,
  Checkbox,
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "~/components/ui/index";

import {

  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,

  getSortedRowModel,
  sortingFns,

  getFilteredRowModel,

  ColumnResizeMode,
  ColumnResizeDirection,
} from "@tanstack/react-table";
import { DataTablePagination } from "~/components/dashboard/calls/pagination";
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import {
  CalendarCheck,
  Search,
  MailWarning,
  UserPlus,
  MessageSquare,
  Mail,
} from "lucide-react";


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
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import { X } from "lucide-react";


declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export function DataTable({ columns, data, user, smsDetails }) {
  const savedVisibility = user.ColumnStateInventory.state

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(savedVisibility);

  useEffect(() => {
    fetcher.submit(
      { state: JSON.stringify(columnVisibility), intent: 'columnState' },
      { method: "post" }
    );
  }, [columnVisibility]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    initialState: { columnVisibility },

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    enableGlobalFilter: true,
    globalFilterFn: "fuzzy",
  });

  const [filterBy, setFilterBy] = useState("");
  const handleInputChange = (name) => {
    setFilterBy(columnId);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed in JavaScript
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}`;
  };
  const now = new Date();
  const formattedDate = formatDate(now);
  function getToday() {
    const today = new Date();
    today.setDate(today.getDate());
    console.log(formatDate(today), "today");
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
    setAllFilters();
    const customerStateColumn = table.getColumn("customerState");
    const nextAppointmentColumn = table.getColumn("nextAppointment");
    const deliveredDate = table.getColumn("deliveredDate");
    const pickUpDate = table.getColumn("pickUpDate");
    const status = table.getColumn("status");
    const depositMade = table.getColumn("depositMade");
    const sold = table.getColumn("sold");
    const delivered = table.getColumn("delivered");
    const signed = table.getColumn("signed");
    const financeApp = table.getColumn("financeApp");

    if (selectedFilter === "deliveredThisMonth") {
      customerStateColumn?.setFilterValue("delivered");
      deliveredDate?.setFilterValue(getFirstDayOfCurrentMonth);
      status?.setFilterValue("active");
    }

    if (selectedFilter === "deliveredLastMonth") {
      customerStateColumn?.setFilterValue("delivered");
      deliveredDate?.setFilterValue(getLastDayOfPreviousMonth);
      status?.setFilterValue("active");
    }

    if (selectedFilter === "deliveredThisYear") {
      customerStateColumn?.setFilterValue("delivered");
      deliveredDate?.setFilterValue(getThisYear);
      status?.setFilterValue("active");
    }

    if (selectedFilter === "pendingCalls") {
      customerStateColumn?.setFilterValue("Pending");
      status?.setFilterValue("active");
    }

    if (selectedFilter === "todaysCalls") {
      nextAppointmentColumn?.setFilterValue(getToday);
      console.log(nextAppointmentColumn, "nextAppointmentColumn");
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "tomorowsCalls") {
      nextAppointmentColumn?.setFilterValue(getTomorrow);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "yestCalls") {
      nextAppointmentColumn?.setFilterValue(getYesterday);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "missedCalls") {
      nextAppointmentColumn?.setFilterValue(getFirstDayOfCurrentMonth);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "missedCallsLastMonth") {
      nextAppointmentColumn?.setFilterValue(getLastDayOfPreviousMonth);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "missedCallsTwoMonths") {
      nextAppointmentColumn?.setFilterValue(getFirstDayOfTwoMonthsAgo);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "missedCallsYear") {
      nextAppointmentColumn?.setFilterValue(getThisYear);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("off");
      sold?.setFilterValue("off");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "todaysDeliveries") {
      pickUpDate?.setFilterValue(getToday);
      status?.setFilterValue("active");
      sold?.setFilterValue("on");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "tomorowsDeliveries") {
      pickUpDate?.setFilterValue(getTomorrow);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("on");
      sold?.setFilterValue("on");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "yestDeliveries") {
      pickUpDate?.setFilterValue(getYesterday);
      status?.setFilterValue("active");
      depositMade?.setFilterValue("on");
      sold?.setFilterValue("on");
      delivered?.setFilterValue("off");
    }

    if (selectedFilter === "depositsToday") {
      status?.setFilterValue("active");
      depositMade?.setFilterValue("on");
      sold?.setFilterValue("on");
      delivered?.setFilterValue("off");
      signed?.setFilterValue("off");
      financeApp?.setFilterValue("off");
    }
  };

  // clears filters
  const setAllFilters = () => {
    setColumnFilters([]);
    setSorting([]);
    setFilterBy("");
    setGlobalFilter([]);
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
  const submit = useSubmit();

  async function rotateSalesQueue() {
    console.log(salesPeople, "rotateSalesQueue");
    const formData = new FormData();
    formData.append("intent", "rotateSalesQueue");
    const update = submit(formData, { method: "post" });
    return update;
  }
  async function rotateFinanceQueue() {
    console.log(salesPeople, "rotateFinanceQueue");
    const formData = new FormData();
    formData.append("intent", "rotateFinanceQueue");
    const update = submit(formData, { method: "post" });
    return update;
  }
  async function resetQueueFinance() {
    console.log(salesPeople, "resetQueueFinance");
    const formData = new FormData();
    formData.append("intent", "rotateFinanceQueue");
    const update = submit(formData, { method: "post" });
    return update;
  }
  async function resetQueue() {
    console.log(salesPeople, "resetQueue");
    const formData = new FormData();
    formData.append("intent", "resetQueue");
    const update = submit(formData, { method: "post" });
    return update;
  }

  const [salesPeople, setSalesPeople] = useState([]);
  const [financeManager, setFinanceManager] = useState([]);
  const [massSms, setMassSms] = useState(false);
  const [massEmail, setMassEmail] = useState(false);
  const [addCustomer, setAddCustomer] = useState(false);

  const swrFetcher = (url) => fetch(url).then((r) => r.json());

  const { data: userFetch, userError } = useSWR(
    "/dealer/api/findManyUsers",
    swrFetcher,
    {
      refreshInterval: 60000,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );
  const { data: financeFetch, financeError } = useSWR(
    "/dealer/api/findManyFinance",
    swrFetcher,
    {
      refreshInterval: 60000,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    }
  );

  useEffect(() => {
    if (userFetch) {
      console.log(userFetch.users, "userFetch");
      setSalesPeople(userFetch.users);
    }
    if (financeFetch) {
      console.log(financeFetch.users, "userFetch");
      setFinanceManager(financeFetch.users);
    }
  }, [userFetch, financeFetch]);

  const [customerMessages, setCustomerMessages] = useState([]);
  const [customer, setCustomer] = useState();
  const [conversationSid, setConversationSid] = useState("");

  useEffect(() => {
    const accountSid = "AC9b5b398f427c9c925f18f3f1e204a8e2";
    const authToken = "d38e2fd884be4196d0f6feb0b970f63f";
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
              method: "GET",
              headers: { Authorization: `Basic ${base64Credentials}` },
            });
            console.log(response, "response");
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.length !== 0) {
              setCustomerMessages(data.messages);
            } else {
              setCustomerMessages([]);
            }
            console.log(data, "fetched messages");
            return data;
          } catch (error) {
            console.error("Failed to fetch messages:", error);
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

  const fetcher = useFetcher();
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
  const [brandId, setBrandId] = useState("");
  const [modelList, setModelList] = useState();

  const handleBrand = (e) => {
    setBrandId(e.target.value);
    console.log(brandId, modelList);
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

  const [rowData, setRowData] = useState();

  useEffect(() => {
    if (rowData) {
      const serializedUser = JSON.stringify(user);
      const cust = rowData.rowData.map((user) => user.email);
      console.log(cust, "cust");
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
          iFrameRef.current.src =
            "http://localhost:3000/dealer/email/massEmail";
        }
        if (currentHost === "dealersalesassistant.ca") {
          iFrameRef.current.src =
            "https://www.dealersalesassistant.ca/dealer/email/massEmail";
        }
        window.addEventListener("message", handleHeightMessage);
        const cust = rowData;

        const sendData = { cust, user };

        // Add load event listener to ensure iframe is loaded
        const onLoad = () => {
          iFrameRef.current.contentWindow?.postMessage(sendData, "*");
        };
        iFrameRef.current.addEventListener("load", onLoad);

        return () => {
          window.removeEventListener("message", handleHeightMessage);
          iFrameRef.current?.removeEventListener("load", onLoad);
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
              minHeight: "40vh",
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

  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedGlobal, setSelectedGlobal] = useState(false);

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
  //apply the fuzzy sort if the fullName column is being filtered
  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);


  const [getTheState, setGetTheState] = useState([])
  const [getTheState2, setGetTheState2] = useState([])
  useEffect(() => {
    const formData = new FormData();
    formData.append("userEmail", user.email);
    formData.append("columnState", getTheState2);
    formData.append("intent", "salesColumns");
    fetcher.submit(formData, { method: "post" });
  }, [getTheState2, getTheState]);

  return (
    <div className="mb-[20px]  justify-center  rounded    even:bg-background">
      <div className="ml-auto flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Menu</Button>
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
                  <DropdownMenuSubContent className="h-[350px] max-h-[350px] overflow-y-auto border border-border bg-background text-foreground">
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
                            onCheckedChange={(value) => {
                              column.toggleVisibility(!!value);
                              const columnState = JSON.stringify(table.getState().columnVisibility);
                              const getVisibleFlatColumns = JSON.stringify(table.getVisibleFlatColumns());
                              const formattedColumnState = columnState.replace(/"/g, "'").replace(/\s+/g, '');
                              const formattedgetVisibleFlatColumns = columnState.replace(/"/g, "'").replace(/\s+/g, '');
                              setGetTheState(formattedColumnState)
                              setGetTheState2(formattedgetVisibleFlatColumns)
                            }}
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <div className="w-[650px]">
                <Dialog>
                  <DialogTrigger className="w-full cursor-pointer">
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="w-full cursor-pointer"
                    >
                      Mass SMS
                      <DropdownMenuShortcut>
                        {" "}
                        <MessageSquare color="foreground" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="w-[600px] max-w-[600px]">
                    <DialogHeader className="w-[600px] max-w-[600px]">
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

              <div className="w-[650px]">
                <Dialog>
                  <DialogTrigger className="w-full cursor-pointer">
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="w-full cursor-pointer"
                    >
                      Mass Email
                      <DropdownMenuShortcut>
                        {" "}
                        <Mail color="foreground" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="w-[600px] max-w-[600px]">
                    <DialogHeader className="w-[600px] max-w-[600px]">
                      <DialogTitle>Mass Email</DialogTitle>
                      <DialogDescription>
                        <MyIFrameComponent />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  Rotation
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="overflow-y-auto border border-border bg-background text-foreground">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Sales Rotation</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {salesPeople.map((person) => (
                        <DropdownMenuItem
                          className="mt-2 text-muted-foreground"
                          key={person.id}
                        >
                          {person.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Finance Rotation</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {financeManager.map((person) => (
                        <DropdownMenuItem
                          className="mt-2 text-muted-foreground"
                          key={person.id}
                        >
                          {person.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Actions</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className=" overflow-y-auto border border-border bg-background text-foreground">
                          <DropdownMenuItem
                            onClick={() => {
                              rotateSalesQueue();
                              toast.success(`Rotating sales...`);
                            }}
                          >
                            Rotate Sales
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              rotateFinanceQueue();
                              toast.success(`Rotating sales...`);
                            }}
                          >
                            {" "}
                            Rotate Finance
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              resetQueue();
                              toast.success(`Rotating sales...`);
                            }}
                          >
                            Reset Sales
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              resetQueueFinance();
                              toast.success(`Rotating sales...`);
                            }}
                          >
                            Reset Finance
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>

            <DropdownMenuGroup>
              <div className="w-[650px]">
                <Dialog>
                  <DialogTrigger className="w-full cursor-pointer">
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="w-full cursor-pointer"
                    >
                      Add Customer
                      <DropdownMenuShortcut>
                        {" "}
                        <UserPlus color="foreground" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="w-[600px] max-w-[600px]">
                    <DialogHeader className="w-[600px] max-w-[600px]">
                      <DialogTitle> Add Customer</DialogTitle>
                      <DialogDescription>
                        <>
                          <fetcher.Form method="post" className="  w-[95%] ">
                            <div className="flex flex-col   ">
                              <div className="relative mt-3">
                                <Input
                                  type="text"
                                  name="firstName"
                                  onChange={handleChange}
                                  className="border-border bg-background"
                                />
                                <label className=" absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">
                                  First Name
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  type="text"
                                  name="lastName"
                                  onChange={handleChange}
                                  className="border-border bg-background "
                                />
                                <label className=" absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">
                                  Last Name
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  className="border-border bg-background   "
                                  type="number"
                                  name="phone"
                                />
                                <label className=" absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">
                                  Phone
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  className="border-border bg-background  "
                                  type="email"
                                  name="email"
                                />
                                <label className=" absolute -top-3 left-3  rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">
                                  Email
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  className="border-border bg-background   "
                                  type="text"
                                  name="address"
                                />
                                <label className=" absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">
                                  Address
                                </label>
                              </div>
                              <div className="relative mt-3">
                                <Input
                                  className="border-border bg-background   "
                                  type="text"
                                  list="ListOptions2"
                                  name="brand"
                                  onChange={handleBrand}
                                />
                                <label className=" absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">
                                  Brand
                                </label>
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
                                      type="text"
                                      list="ListOptions2"
                                      name="model"
                                    />
                                    <label className=" absolute -top-3 left-3 rounded-full bg-background px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">
                                      Model
                                    </label>
                                  </div>
                                  <datalist id="ListOptions2">
                                    {modelList.models.map((item, index) => (
                                      <option key={index} value={item.model} />
                                    ))}
                                  </datalist>
                                </>
                              )}
                            </div>
                            <Input
                              type="hidden"
                              name="iRate"
                              defaultValue={10.99}
                            />
                            <Input
                              type="hidden"
                              name="tradeValue"
                              defaultValue={0}
                            />
                            <Input
                              type="hidden"
                              name="discount"
                              defaultValue={0}
                            />
                            <Input
                              type="hidden"
                              name="deposit"
                              defaultValue={0}
                            />
                            <Input
                              type="hidden"
                              name="months"
                              defaultValue={60}
                            />
                            <Input
                              type="hidden"
                              name="userEmail"
                              defaultValue={userEmail}
                            />
                            <Input
                              type="hidden"
                              name="name"
                              defaultValue={
                                `${firstName}` + " " + `${lastName}`
                              }
                            />
                            <div className="mt-[25px] flex justify-end">
                              <Button
                                name="intent"
                                value="AddCustomer"
                                type="submit"
                                size="sm"
                                className="bg-primary"
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
                <Link
                  to="/dealer/calendar/sales"
                  className="flex w-full items-center justify-between"
                >
                  <p>Calendar</p>
                  <DropdownMenuShortcut>
                    <CalendarCheck
                      color="#cbd0d4"
                      size={20}
                      strokeWidth={1.5}
                    />
                  </DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {selectedColumn && (
          <div className="relative ">

            <Input
              placeholder={`Filter ${selectedColumn}...`}
              onChange={(e) => handleGlobalChange(e.target.value)}
              className="ml-2 max-w-sm w-auto "
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
        {selectedGlobal === true && (
          <div className="relative ">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              className="ml-3 border border-border p-2 shadow max-w-sm w-auto"
              placeholder="Search all columns..."
              autoFocus
            />

            <Button
              onClick={() => {
                setGlobalFilter([]);
                setSelectedGlobal(false);
              }}
              size="icon"
              variant="ghost"
              className='bg-transparent mr-2 absolute right-2.5 top-2.5 h-4 w-4 text-foreground '>

              <X />
            </Button>
          </div>
        )}
        <Button size='sm' variant="outline" className='mr-3' onClick={() => {

        }} >Work Orders</Button>
        <Button size='sm' variant="outline" className='mr-3' onClick={() => {

        }} >PAC Orders</Button>

      </div>

      <div style={{ direction: table.options.columnResizeDirection }}>
        <div className="mt-[20px] rounded-md  border border-border text-foreground">
          <Table className="overflow-x-auto rounded-md border-border" table={table}              >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className=" border-border">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}                                              >
                        <>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                          {header.column.getCanFilter() && showFilter && (
                            <div className="mx-auto cursor-pointer items-center justify-center text-center ">
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
                    className={`cursor-pointer border-border bg-background p-4 capitalize text-foreground  ${index % 2 === 0 ? "bg-background" : "bg-background"
                      }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}                                              >
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
                    className="h-24 cursor-pointer bg-background text-center capitalize text-foreground hover:text-primary"
                  >
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
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      className="w-36 rounded border shadow"
    />
  );
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}


export async function getData(): Promise<dashBoardType[]> {

  //turn into dynamic route and have them call the right loader like q  uote qand overview
  const res = await fetch('/dealer/dashboard/calls/loader')
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
export default function MainDashbaord() {
  const { user, } = useLoaderData();

  const { finance, searchData, } = useLoaderData();
  const [data, setPaymentData,] = useState<dashBoardType[]>(finance);

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

  function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }

  const columns: ColumnDef<Payment>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='flex mx-auto my-auto'>
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className='border-primary'
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
            className='border-primary'
          />
        </div>
      ),
    },
    {
      id: 'firstName',
      accessorKey: "firstName",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => {
        return <>
          <DataTableColumnHeader column={column} title="First Name" />
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        return <div className="bg-transparent flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px] leading-none  text-foreground  outline-none  transition-all duration-150 ease-linear target:text-primary  hover:text-primary  focus:text-primary focus:outline-none">
          <ClientCard data={data} row={row} />
        </div>
      },


    },
    {
      id: 'lastName',
      accessorKey: "lastName",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="LastName" />
      ),
      cell: ({ row }) => {
        const data = row.original
        return <div className="bg-transparent flex w-[175px] flex-1 items-center justify-center px-5 text-center text-[15px]  leading-none text-foreground outline-none transition-all duration-150  ease-linear  first:rounded-tl-md  last:rounded-tr-md target:text-primary hover:text-primary focus:text-primary  focus:outline-none  active:bg-primary ">
          {capitalizeFirstLetter((row.getValue("lastName")))}
        </div>
      },

    },
    {
      id: 'status',
      accessorKey: "status",
      filterFn: 'equalsString',
      header: ({ column }) => {
        return <>
          <DataTableColumnHeader column={column} title="Status" />
        </>
      },
      cell: ({ row }) => {
        const data = row.original
        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
          <ClientStatusCard data={data} />
        </div>
      },
    },
    {
      id: 'nextAppointment',
      accessorKey: "nextAppointment",
      filterFn: 'equalsString',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Next Appt" />
      ),
      cell: ({ row }) => {
        const data = row.original;
        return <div className="bg-transparent mx-1 flex h-[45px] w-[160px] flex-1 items-center justify-center px-5 text-center  text-[15px] uppercase leading-none text-foreground  outline-none  transition-all  duration-150 ease-linear target:text-primary hover:text-primary  focus:text-primary  focus:outline-none  active:bg-primary  ">
          {String(data.nextAppointment)}
        </div>
      },
    },
    {
      id: 'customerState',
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
      id: 'model',
      accessorKey: "model",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Model" />
      ),
      cell: ({ row }) => {
        const data = row.original
        return <div className="w-[275px] cursor-pointer  text-center text-[14px]  text-foreground hover:text-primary">
          <ClientVehicleCard data={data} />
        </div>
      },
    },
    {
      id: 'tradeDesc',
      accessorKey: "tradeDesc",
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trade" />
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[250px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[13px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("tradeDesc"))}</div>
      },

    },
    {
      id: 'twoDaysFromNow',
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
      id: 'completeCall',
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
      id: 'contactTimesByType',
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
      id: 'pickUpDate',
      accessorKey: "pickUpDate",
      enableGlobalFilter: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pick Up Date" className="bg-transparent text-foreground mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary " />
      ),
      cell: ({ row }) => {
        const data = row.original
        if (data.pickUpDate) {
          const pickupDate = data.pickUpDate
          return (
            <div className="bg-transparent :text-primary text-grbg-transparent text-foreground mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
              {pickupDate === '1969-12-31 19:00' || pickupDate === null ? 'TBD' : pickupDate}
            </div>
          );
        } else
          return null;
      },
    },
    {
      id: 'lastContact',
      accessorKey: "lastContact",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Contacted" className="bg-transparent text-foreground mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary" />
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
            <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
              {date === 'TBD' ? <p>TBD</p> : date.toLocaleDateString('en-US', options)}
            </div>
          );
        }
        return null;
      },

    },
    {
      id: 'unitPicker',
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
      id: 'email',
      accessorKey: "email",
      enableGlobalFilter: true,
      header: ({ column }) => (
        <p className="text-center">email</p>
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("email"))}</div>
      },

    },
    {
      id: 'phone',
      accessorKey: "phone",
      enableGlobalFilter: true,
      header: ({ column }) => (
        <p className="text-center">phone</p>
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("phone"))}</div>
      },

    },
    {
      id: 'address',
      accessorKey: "address",
      enableGlobalFilter: true,
      header: ({ column }) => (
        <p className="text-center">address</p>
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("address"))}</div>
      },

    },
    {
      id: 'postal',
      accessorKey: "postal",
      header: ({ column }) => (
        <p className="text-center">postal</p>
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("postal"))}</div>
      },

    },
    {
      id: 'city',
      accessorKey: "city",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="city" />
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("city"))}</div>
      },

    },
    {
      id: 'province',
      accessorKey: "province",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="province" />
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("province"))}</div>
      },

    },
    {
      id: 'financeId',
      accessorKey: "financeId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="financeId" />
      ), cell: ({ row }) => {
        return <div className="w-[200px] text-center font-medium">{(row.getValue("financeId"))}</div>
      },

    },
    {
      id: 'userEmail',
      accessorKey: "userEmail",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="userEmail" />
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
                  hover:shadow-md


                  focus:text-primary
                   focus:outline-none active:bg-primary">{(row.getValue("userEmail"))}</div>
      },

    },
    {
      id: 'pickUpTime',
      accessorKey: "pickUpTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pick Up Time" />
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[125px] w-[95%] flex-1 cursor-pointer items-center  justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-primary  hover:text-primary  focus:text-primary focus:outline-none active:bg-primary ">
          {(row.getValue("pickUpTime"))}
        </div>
      },

    },

    {
      id: 'timeToContact',
      accessorKey: "timeToContact",
      header: "model1",
    },
    {
      id: 'deliveredDate',
      accessorKey: "deliveredDate",
      header: "deliveredDate",
    },
    {
      id: 'timeOfDay',
      accessorKey: "timeOfDay",
      header: "timeOfDay",
    },
    {
      id: 'msrp',
      accessorKey: "msrp",
      header: "msrp",
    },
    {
      id: 'freight',
      accessorKey: "freight",
      header: "freight",
    },
    {
      id: 'pdi',
      accessorKey: "pdi",
      header: "pdi",
    },
    {
      id: 'admin',
      accessorKey: "admin",
      header: "admin",
    },
    {
      id: 'commodity',
      accessorKey: "commodity",
      header: "commodity",
    },
    {
      id: 'accessories',
      accessorKey: "accessories",
      header: "accessories",
    },
    {
      id: 'labour',
      accessorKey: "labour",
      header: "labour",
    },
    {
      id: 'painPrem',
      accessorKey: "painPrem",
      header: "painPrem",
    },
    {
      id: 'licensing',
      accessorKey: "licensing",
      header: "licensing",
    },






    {
      id: 'trailer',
      accessorKey: "trailer",
      header: "trailer",
    },
    {
      id: 'depositMade',
      accessorKey: "depositMade",
      header: "depositMade",
    },
    {
      id: 'months',
      accessorKey: "months",
      header: "months",
    },
    {
      id: 'iRate',
      accessorKey: "iRate",
      header: "iRate",
    },
    {
      id: 'on60',
      accessorKey: "on60",
      header: "on60",
    },
    {
      id: 'biweekly',
      accessorKey: "biweekly",
      header: "biweekly",
    },
    {
      id: 'weekly',
      accessorKey: "weekly",
      header: "weekly",
    },
    {
      id: 'qc60',
      accessorKey: "qc60",
      header: "qc60",
    },
    {
      id: 'biweeklyqc',
      accessorKey: "biweeklyqc",
      header: "biweeklyqc",
    },
    {
      id: 'weeklyqc',
      accessorKey: "weeklyqc",
      header: "weeklyqc",
    },
    {
      id: 'nat60',
      accessorKey: "nat60",
      header: "nat60",
    },
    {
      id: 'biweeklNat',
      accessorKey: "biweeklNat",
      header: "biweeklNat",
    },
    {
      id: 'weeklylNat',
      accessorKey: "weeklylNat",
      header: "weeklylNat",
    },
    {
      id: 'oth60',
      accessorKey: "oth60",
      header: "oth60",
    },
    {
      id: 'biweekOth',
      accessorKey: "biweekOth",
      header: "biweekOth",
    },
    {
      id: 'weeklyOth',
      accessorKey: "weeklyOth",
      header: "weeklyOth",
    },
    {
      id: 'nat60WOptions',
      accessorKey: "nat60WOptions",
      header: "nat60WOptions",
    },
    {
      id: 'desiredPayments',
      accessorKey: "desiredPayments",
      header: "desiredPayments",
    },
    {
      id: 'biweeklNatWOptions',
      accessorKey: "biweeklNatWOptions",
      header: "biweeklNatWOptions",
    },
    {
      id: 'weeklylNatWOptions',
      accessorKey: "weeklylNatWOptions",
      header: "weeklylNatWOptions",
    },
    {
      id: 'oth60WOptions',
      accessorKey: "oth60WOptions",
      header: "oth60WOptions",
    },
    {
      id: 'biweekOthWOptions',
      accessorKey: "biweekOthWOptions",
      header: "biweekOthWOptions",
    },
    {
      id: 'visited',
      accessorKey: "visited",
      header: "visited",
    },
    {
      id: 'aptShowed',
      accessorKey: "aptShowed",
      header: "aptShowed",
    },
    {
      id: 'bookedApt',
      accessorKey: "bookedApt",
      header: "bookedApt",
    },
    {
      id: 'aptNoShowed',
      accessorKey: "aptNoShowed",
      header: "aptNoShowed",
    },
    {
      id: 'testDrive',
      accessorKey: "testDrive",
      header: "testDrive",
    },
    {
      id: 'metParts',
      accessorKey: "metParts",
      header: "metParts",
    },
    {
      id: 'sold',
      accessorKey: "sold",
      header: "sold",
    },

    {
      id: 'refund',
      accessorKey: "refund",
      header: "refund",
    },
    {
      id: 'turnOver',
      accessorKey: "turnOver",
      header: "turnOver",
    },
    {
      id: 'financeApp',
      accessorKey: "financeApp",
      header: "financeApp",
    },
    {
      id: 'approved',
      accessorKey: "approved",
      header: "approved",
    },
    {
      id: 'signed',
      accessorKey: "signed",
      header: "signed",
    },

    {
      id: 'pickUpSet',
      accessorKey: "pickUpSet",
      header: "pickUpSet",
    },
    {
      id: 'demoed',
      accessorKey: "demoed",
      header: "demoed",
    },

    {
      id: 'tradeMake',
      accessorKey: "tradeMake",
      header: "tradeMake",
    },
    {
      id: 'tradeYear',
      accessorKey: "tradeYear",
      header: "tradeYear",
    },
    {
      id: 'tradeTrim',
      accessorKey: "tradeTrim",
      header: "tradeTrim",
    },
    {
      id: 'tradeColor',
      accessorKey: "tradeColor",
      header: "tradeColor",
    },
    {
      id: 'tradeVin',
      accessorKey: "tradeVin",
      header: "tradeVin",
    },
    {
      id: 'delivered',
      accessorKey: "delivered",
      header: "delivered",
    },
    {
      id: 'desiredPayments',
      accessorKey: "desiredPayments",
      header: "desiredPayments",
    },
    {
      id: 'result',
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
      id: 'referral',
      accessorKey: "referral",
      header: "referral",
    },
    {
      id: 'metService',
      accessorKey: "metService",
      header: "metService",
    },
    {
      id: 'metManager',
      accessorKey: "metManager",
      header: "metManager",
    },
    {
      id: 'metParts',
      accessorKey: "metParts",
      header: "metParts",
    },
    {
      id: 'timesContacted',
      accessorKey: "timesContacted",
      header: "timesContacted",
    },
    {
      id: 'visits',
      accessorKey: "visits",
      header: "visits",
    },
    {
      id: 'financeApplication',
      accessorKey: "financeApplication",
      header: "financeApplication",
    },
    {
      id: 'progress',
      accessorKey: "progress",
      header: "progress",
    },
    {
      id: 'metFinance',
      accessorKey: "metFinance",
      header: "metFinance",
    },
    {
      id: 'metSalesperson',
      accessorKey: "metSalesperson",
      header: "metSalesperson",
    },
    {
      id: 'seenTrade',
      accessorKey: "seenTrade",
      header: "seenTrade",
    },
    {
      id: 'docsSigned',
      accessorKey: "docsSigned",
      header: "docsSigned",
    },
    {
      id: 'tradeRepairs',
      accessorKey: "tradeRepairs",
      header: "tradeRepairs",
    },
    {
      id: 'tradeValue',
      accessorKey: "tradeValue",
      header: "tradeValue",
    },
    {
      id: 'modelCode',
      accessorKey: "modelCode",
      header: "modelCode",
    },
    {
      id: 'color',
      accessorKey: "color",
      header: "color",
    },
    {
      id: 'model1',
      accessorKey: "model1",
      header: "model1",
    },
    {
      id: 'stockNum',
      accessorKey: "stockNum",
      header: "stockNum",
    },
    {
      id: 'otherTaxWithOptions',
      accessorKey: "otherTaxWithOptions",
      header: "otherTaxWithOptions",
    },
    {
      id: 'totalWithOptions',
      accessorKey: "totalWithOptions",
      header: "totalWithOptions",
    },
    {
      id: 'otherTax',
      accessorKey: "otherTax",
      header: "otherTax",
    },
    {
      id: 'qcTax',
      accessorKey: "qcTax",
      header: "qcTax",
    },
    {
      id: 'deposit',
      accessorKey: "deposit",
      header: "deposit",
    },
    {
      id: 'rustProofing',
      accessorKey: "rustProofing",
      header: "rustProofing",
    },
    {
      id: 'lifeDisability',
      accessorKey: "lifeDisability",
      header: "lifeDisability",
    },
    {
      id: 'userServicespkg',
      accessorKey: "userServicespkg",
      header: "userServicespkg",
    },
    {
      id: 'userExtWarr',
      accessorKey: "userExtWarr",
      header: "userExtWarr",
    },
    {
      id: 'userGap',
      accessorKey: "userGap",
      header: "userGap",
    },
    {
      id: 'userTireandRim',
      accessorKey: "userTireandRim",
      header: "userTireandRim",
    },
    {
      id: 'userLoanProt',
      accessorKey: "userLoanProt",
      header: "userLoanProt",
    },
    {
      id: 'deliveryCharge',
      accessorKey: "deliveryCharge",
      header: "deliveryCharge",
    },
    {
      id: 'onTax',
      accessorKey: "onTax",
      header: "onTax",
    },
    {
      id: 'total',
      accessorKey: "total",
      header: "total",
    },
    {
      id: 'typeOfContact',
      accessorKey: "typeOfContact",
      header: "typeOfContact",
    },
    {
      id: 'contactMethod',
      accessorKey: "contactMethod",
      header: "contactMethod",
    },
    {
      id: 'note',
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
        return <div className="bg-transparent flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center px-5 text-center  text-[15px]   leading-none  text-foreground  outline-none  transition-all duration-150 ease-linear target:text-primary  hover:text-primary  focus:text-primary focus:outline-none">
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
        return <div className="bg-transparent my-auto  flex h-[45px] flex-1 cursor-pointer items-center justify-center text-center text-[15px] uppercase leading-none text-foreground  outline-none transition-all duration-150 ease-linear target:text-primary hover:text-primary focus:text-primary focus:outline-none  active:bg-primary">
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

        return <div className="bg-transparent mx-1 flex h-[45px] w-[160px] flex-1 items-center justify-center px-5 text-center  text-[15px] uppercase leading-none text-foreground  outline-none  transition-all  duration-150 ease-linear target:text-primary hover:text-primary  focus:text-primary  focus:outline-none  active:bg-primary  ">
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
        return <div className="w-[275px] cursor-pointer  text-center text-[14px]  text-foreground">
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
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[250px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[13px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("tradeDesc"))}</div>
      },

    },
    {
      accessorKey: "lastNote",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Last Note" />
      ),
      cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("lastNote"))}</div>
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
        <DataTableColumnHeader column={column} title="Pick Up Date" className="bg-transparent text-foreground mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary " />
      ),
      cell: ({ row }) => {
        const data = row.original
        if (data.pickUpDate) {
          const pickupDate = data.pickUpDate
          return (
            <div className="bg-transparent :text-primary text-grbg-transparent text-foreground mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
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
        <DataTableColumnHeader column={column} title="Last Contacted" className="bg-transparent text-foreground mx-1 flex h-[45px] w-[175px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary" />
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
            <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[150px] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">
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
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("email"))}</div>
      },

    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <p className="text-center">phone</p>
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("phone"))}</div>
      },

    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <p className="text-center">address</p>
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  px-5 text-center text-[15px] uppercase leading-none outline-none  transition-all  duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary  hover:text-primary  focus:text-primary  focus:outline-none active:bg-primary">{(row.getValue("address"))}</div>
      },

    },
    {
      accessorKey: "postal",
      header: ({ column }) => (
        <p className="text-center">postal</p>
      ), cell: ({ row }) => {
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
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
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
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
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
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
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[95%] flex-1 cursor-pointer items-center justify-center  rounded px-5 text-center text-[15px] font-medium uppercase  leading-none  shadow outline-none transition-all duration-150  ease-linear first:rounded-tl-md last:rounded-tr-md target:text-primary hover:text-primary
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
        return <div className="bg-transparent text-foreground mx-1 flex h-[45px] w-[125px] w-[95%] flex-1 cursor-pointer items-center  justify-center px-5 text-center text-[15px] uppercase leading-none  outline-none  transition-all  duration-150 ease-linear first:rounded-tl-md last:rounded-tr-md  target:text-primary  hover:text-primary  focus:text-primary focus:outline-none active:bg-primary ">
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
  return (
    <div>
      <div className="block md:hidden">
        <SmDataTable columns={smColumns} data={data} />
      </div>
      <div className="hidden md:block">
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

export let loader = dashboardLoader

export let action = dashboardAction

