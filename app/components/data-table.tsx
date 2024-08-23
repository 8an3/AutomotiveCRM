import {
  Button,
  Input,
  Separator,
  Checkbox,
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "~/components/ui/index";
import React, {
  useMemo,
  useEffect,
  useState,
  useRef,
  Suspense,
  forwardRef,
} from "react";
import {
  Column,
  SortingFn,
  FilterFns,
  ColumnResizeMode,
  ColumnResizeDirection,
  ColumnDef, ColumnFiltersState, FilterFn, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, sortingFns,
} from "@tanstack/react-table";
import { DataTablePagination } from "~/components/dashboard/calls/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Form,
  Link,
  useFetcher,
  useLoaderData,
  useTransition,
  Await,
  useSubmit,
} from "@remix-run/react";
import {
  CalendarCheck,
  Search,
  MailWarning,
  UserPlus,
  MessageSquare,
  Mail,
} from "lucide-react";
import useSWR, { SWRConfig, mutate, useSWRConfig } from "swr";
import { toast } from "sonner";
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
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";

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
  const savedVisibility = user.columnStateSales.state

  let validJsonString = user.columnStateSales.state.replace(/'/g, '"').replace(/\\'/g, "'");
  let jsonObject = JSON.parse(validJsonString);


  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(jsonObject)
  /** {
     dl: false,
     id: false,
     pdi: false,
     city: false,
     msrp: false,
     note: false,
     on60: false,
     qc60: false,
     sold: false,
     vinE: false,
     admin: false,
     color: false,
     email: false,
     iRate: false,
     nat60: false,
     onTax: false,
     oth60: false,
     phone: false,
     qcTax: false,
     total: false,
     demoed: false,
     labour: false,
     model1: false,
     months: false,
     postal: false,
     refund: false,
     result: false,
     signed: false,
     visits: false,
     weekly: false,
     address: false,
     deposit: false,
     freight: false,
     trailer: false,
     userGap: false,
     visited: false,
     approved: false,
     biweekly: false,
     discount: false,
     lastNote: false,
     metParts: false,
     otherTax: false,
     painPrem: false,
     progress: false,
     province: false,
     referral: false,
     stockNum: false,
     tradeVin: false,
     turnOver: false,
     turnover: false,
     weeklyqc: false,
     aptShowed: false,
     biweekOth: false,
     bookedApt: false,
     commodity: false,
     delivered: false,
     financeId: false,
     licensing: false,
     modelCode: false,
     paintPrem: false,
     pickUpSet: false,
     seenTrade: false,
     testDrive: false,
     timeOfDay: false,
     tradeMake: false,
     tradeTrim: false,
     tradeYear: false,
     userEmail: false,
     userOther: false,
     weeklyOth: false,
     biweeklNat: false,
     biweeklyqc: false,
     docsSigned: false,
     financeApp: false,
     metFinance: false,
     metManager: false,
     metService: false,
     pickUpTime: false,
     tradeColor: false,
     tradeValue: false,
     unitPicker: false,
     weeklylNat: false,
     accessories: false,
     aptNoShowed: false,
     depositMade: false,
     discountPer: false,
     followUpDay: false,
     userExtWarr: false,
     clientfileId: false,
     rustProofing: false,
     tradeRepairs: false,
     userLoanProt: false,
     contactMethod: false,
     deliveredDate: false,
     nat60WOptions: false,
     oth60WOptions: false,
     singleFinNote: false,
     timeToContact: false,
     typeOfContact: false,
     deliveryCharge: false,
     documentUpload: false,
     lifeDisability: false,
     metSalesperson: false,
     timesContacted: false,
     userTireandRim: false,
     desiredPayments: false,
     userServicespkg: false,
     totalWithOptions: false,
     biweekOthWOptions: false,
     weeklyOthWOptions: false,
     biweeklNatWOptions: false,
     financeApplication: false,
     weeklylNatWOptions: false,
     otherTaxWithOptions: false
   }); */
  console.log(columnVisibility, 'datatable')

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
