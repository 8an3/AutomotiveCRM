import { Landmark } from "lucide-react"
/* eslint-disable tailwindcss/classnames-order */
import { Form, Link, useActionData, useFetcher, useLoaderData, useSubmit, useNavigation, useParams, useNavigate } from "@remix-run/react";
import React, { createContext, useEffect, useRef, useState } from "react";
import { ClientResultFunction, ClientStateFunction, } from "~/components/lists/clientResultList";
import { prisma } from "~/libs";
import { FaCheck } from "react-icons/fa";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "~/components/ui/dropdown-menu"
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
  CardTitle, Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider, Avatar,
  AvatarFallback,
  AvatarImage,
  Select, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectGroup,
  RemixNavLink, Input, Separator, Button, TextArea, Label, PopoverTrigger, PopoverContent, Popover,
} from "~/components"
import { CheckIcon, PaperPlaneIcon, PlusIcon, UploadIcon } from "@radix-ui/react-icons"
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
import { ModelPage } from "~/overviewUtils/modelPage";
import { ImageSelectNav } from '~/overviewUtils/imageselect'
import canamIndex from '~/images/logos/canamIndex.png'
import manitouIndex from '~/images/logos/manitouIndex.png'
import Harley from '~/components/dashboardCustId/hdIcon.png'
import second from '~/styles/second.css'
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
import NotificationSystem from "~/routes/__authorized/dealer/systems/notifications";
import { PrintSpec } from "~/overviewUtils/printSpec";
import { CiEdit } from "react-icons/ci";
import { Calendar as SmallCalendar } from '~/components/ui/calendar';
import { FaSave } from "react-icons/fa";
import UnitPicker from "~/components/dashboard/unitPicker/unitPickerbk";
import { cors } from "remix-utils";
import { TextFunction } from "~/components/dashboard/calls/logText";
import CustomerGen from "~/routes/__authorized/dealer/document/customerGen.client";
import { EditableText, EditableTextManual } from "~/components/dev/board/components";



export function FinanceDialog({ data, user, deFees, products, emailTemplatesDropdown }) {
  const finance = data
  const { clientFile, sliderWidth, aptFinance3, Coms, getTemplates, merged, clientUnit, financeNotes, userList, modelData, manOptions, bmwMoto, bmwMoto2, notifications } = useLoaderData();


  const [financeIdState, setFinanceIdState] = useState();
  const fetcher = useFetcher();
  const submit = useSubmit();
  const navigate = useNavigate()
  let formRef = useRef();
  const [value, onChange] = useState();
  const timerRef = React.useRef(0);

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

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);


  useEffect(() => {
    if (finance.id) {
      setFinanceIdState(finance.id)
    }
  }, [finance.id]);

  //let data = { ...finance, ...finance, ...user }

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
  // console.log(`Current time is `, currentTime);
  const time = `${hour}:${min}:00`

  useEffect(() => {
    if (data.tradeDesc === null || data.tradeDesc === undefined || data.tradeDesc === '') {
      setTradeToggled(false);
    }
    if (data.approved !== 'on' || data.turnOver !== 'on' || data.financeApp !== 'on') {
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
  React.useEffect(() => {
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

  const [open, setOpen] = React.useState(false)
  const [openAppt, setOpenAppt] = React.useState(false)
  const [openComms, setOpenComms] = React.useState(false)
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([])

  const [messages, setMessages] = React.useState([
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
  const [input, setInput] = React.useState("")
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
    { name: 'tradeMileage', value: finance.tradeMileage, placeholder: 'Mileage' },
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
  const eventDateRef = React.useRef(new Date());
  React.useEffect(() => {
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

  /// console.log(deFees, finance, 'deFees')
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
  //console.log(`formData size: ${formDataSizeInBytes} bytes`);
  //console.log(`formData size: ${(formDataSizeInBytes / 1024).toFixed(2)} KB`);
  // console.log(`formData size: ${(formDataSizeInBytes / (1024 * 1024)).toFixed(2)} MB`);
  // console.log('bmwmoto', bmwMoto)
  // console.log(';bmwMo// Import the axios library

  // console.log(finance)
  // console.log(deFees)
  // console.log(modelData)
  // console.log(accessories)
  // console.log(initial)
  // console.log(accTotal)
  // console.log(essentials)

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
  const [customerInfo, setCustomerInfo] = useState(true);
  const [secPage, setSecPage] = useState(false);
  const [secondCustomer, setSecondCustomer] = useState(false);
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
  // ----------------------- customer card -------------//
  /// console.log(finance, data, 'finance data')
  const [financeAppData, setFinanceAppData] = useState([])
  useEffect(() => {
    async function getFinanceData() {
      try {
        const data = await prisma.financeApplication.findUnique({ where: { financeId: data.id } });
        return data;
      } catch (error) {
        console.error('Failed to fetch locked data:', error);
        return null;
      }
    }

    async function fetchData() {
      const data = await getFinanceData();
      if (data) {
        setFinanceAppData(data);
      }
    }

    fetchData();
  }, []);

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
  let financeApp = [
    { name: 'fullName', value: financeAppData.fullName, label: 'Full Name', },
    { name: 'dob', value: financeAppData.dob, label: 'DOB', },
    { name: 'sin', value: financeAppData.sin, label: 'SIN', },
    { name: 'phone', value: financeAppData.phone, label: 'Phone', },
    { name: 'email', value: financeAppData.email, label: 'Email', },
    { name: 'streetAddress', value: financeAppData.streetAddress, label: 'Street Address', },
    { name: 'city', value: financeAppData.city, label: 'City', },
    { name: 'province', value: financeAppData.province, label: 'Province', },
    { name: 'postalCode', value: financeAppData.postalCode, label: 'Postal Code', },
    { name: 'addressDuration', value: financeAppData.addressDuration, label: 'Address Duration', },
    { name: 'employer', value: financeAppData.employer, label: 'Employer', },
    { name: 'job', value: financeAppData.job, label: 'Job Title', },
    { name: 'employmentStatus', value: financeAppData.employmentStatus, label: 'Employment Status', },
    { name: 'employerAddress', value: financeAppData.employerAddress, label: 'Employer Address', },
    { name: 'employerCity', value: financeAppData.employerCity, label: 'Employer City', },
    { name: 'employerPostal', value: financeAppData.employerPostal, label: 'Employer Postal', },
    { name: 'employerPhone', value: financeAppData.employerPhone, label: 'Employer Phone', },
    { name: 'employmentDuration', value: financeAppData.employmentDuration, label: 'Employment Duration', },
    { name: 'monthlyGrossIncome', value: financeAppData.monthlyGrossIncome, label: 'Monthly Gross Income', },
    { name: 'bankName', value: financeAppData.bankName, label: 'Bank Name', },
    { name: 'branchAddress', value: financeAppData.branchAddress, label: 'Branch Address', },
    { name: 'mortgagePayment', value: financeAppData.mortgagePayment, label: 'Mortgage Payment', },
    { name: 'utilities', value: financeAppData.utilities, label: 'Utilities', },
    { name: 'propertyTaxes', value: financeAppData.propertyTaxes, label: 'Property Taxes', },
    { name: 'loanType', value: financeAppData.loanType, label: 'Loan Type', },
    { name: 'loanMonthlyPayment', value: financeAppData.loanMonthlyPayment, label: 'Loan Monthly Payment', },
    { name: 'remainingBalance', value: financeAppData.remainingBalance, label: 'Remaining Balance', },
    { name: 'notes', value: financeAppData.notes, label: 'Notes', },
  ];
  let bankingInformation = [
    { name: 'bank', value: finance.bank, label: 'Bank', },
    { name: 'loanNumber', value: finance.loanNumber, label: 'Loan Number', },
    { name: 'idVerified', value: finance.idVerified, label: 'ID Verified', },
    { name: 'firstPayment', value: finance.firstPayment, label: 'First Payment', },
    { name: 'loanMaturity', value: finance.loanMaturity, label: 'Loan Maturity', },
    { name: 'dealerCommission', value: finance.dealerCommission, label: 'Dealer Commission', },
    { name: 'financeCommission', value: finance.financeCommission, label: 'Finance Manager Commission', },
    { name: 'salesCommission', value: finance.salesCommission, label: 'Salesperson Commission', },
    { name: 'financeDeptProductsTotal', value: finance.financeDeptProductsTotal, label: 'Finance Products Total', },
  ];
  const [newValue, setValue] = useState("");
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
  //  console.log(updatedEmailArray, 'updatedsdaf')
  const [openEmail, setOpenEmail] = useState(false);
  const [emailLabel, setEmailLabel] = useState('');
  const [emailDesiredPayments, setEmailDesiredPayments] = useState('');
  const [emailFinanceId, setEmailFinanceId] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [body, setBody] = useState('');
  const [saved, setSaved] = useState(false);

  function SubmitTheForm(newValue, template, financeId) {
    if (template === "justPayments" || template === "fullBreakdown" || template === "FullBreakdownWOptions") {
      //    console.log(newValue, template, 'reg emails')
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
    //formData.append("modelData", modelData);
    formData.append("template", emailTemplate);
    formData.append("financeId", finance.id);
    formData.append("body", newBody);
    formData.append("intent", 'email');
    submit(formData, { method: "post" });
  }

  const [firstOpen, setFirstOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false)
  return (
    <Dialog open={firstOpen} onOpenChange={setFirstOpen} >
      <DialogTrigger asChild>
        <Button size='sm' variant="outline" className='mx-auto' >Finance Info</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[95vw] grid grid-cols-1 lg:grid-cols-3 max-h-[800px] h-full">

        {/*customer card*/}
        <Tabs defaultValue="Sales">

          <Card className="w-[95%]  bg-background text-foreground rounded-lg  max-h-[750px] h-auto " x-chunk="dashboard-05-chunk-0"  >
            <CardHeader className="flex flex-row items-start bg-muted/50 rounded-md">
              <CardTitle className="group flex items-center text-sm">
                <TabsList >
                  <TabsTrigger value="Sales">Customer Info</TabsTrigger>
                  <TabsTrigger value="Finance">Finance App</TabsTrigger>
                </TabsList>
              </CardTitle>
            </CardHeader>
            <CardContent className='flex-grow !grow max-h-[600px] h-[600px] overflow-y-auto'>
              <TabsContent value="Sales" className="  text-foreground rounded-lg">
                <ul className="grid gap-3 text-sm mt-2">
                  {customerCard.map((customer, index) => (
                    <li key={index} className="group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-muted-foreground">
                          {customer.label}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyText(customer.value)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        {copiedText === customer.value && <FaCheck strokeWidth={1.5} className="ml-2 text-lg hover:text-primary" />}
                      </div>
                      <EditableTextManual
                        value={customer.value}
                        fieldName={customer.name}
                        inputClassName=" py-1 px-2 "
                        buttonClassName="   py-1 px-2 "
                        buttonLabel={`Edit board "${customer.name}" name`}
                        inputLabel="Edit board name"
                      >
                        <input type="hidden" name="intent" value='updateClientInfoFinance' />
                        <input type="hidden" name="financeId" value={finance.id} />
                      </EditableTextManual>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="Finance">
                <ul className="grid gap-3 text-sm mt-[9px]">
                  {financeApp.map((customer, index) => (
                    <li key={index} className="group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-muted-foreground">
                          {customer.label}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyText(customer.value)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        {copiedText === customer.value && <FaCheck strokeWidth={1.5} className="ml-2 text-lg hover:text-primary" />}
                      </div>
                      <p>{customer.value}</p>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </CardContent>
            <CardFooter className="mt-[7px] grid grid-cols-2 justify-between items-center border-t border-border bg-muted/50 px-6 py-3">
              <div>
                <Button size='sm' variant="outline" className='mx-auto' onClick={() => {
                  navigate(`/dealer/sales/finance/${finance.id}`)
                }} >Finance File</Button>
              </div>
              <Dialog >
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8 gap-1 ml-auto">
                    <CiEdit className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Edit
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="gap-0 p-0 outline-none border-border text-foreground   max-h-[750px] h-[750px]  overflow-y-scroll">
                  <Tabs defaultValue="Sales" className='m-3 p-3'>
                    <TabsList >
                      <TabsTrigger value="Sales">Customer Info</TabsTrigger>
                      <TabsTrigger value="Finance">Finance App</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Sales" className="  text-foreground rounded-lg">
                      <fetcher.Form method='post'>
                        <DialogHeader className="px-4 pb-4 pt-5">
                          <DialogTitle>Edit Customer Info</DialogTitle>
                          <hr className="my-3 text-muted-foreground w-[98%] mx-auto" />
                        </DialogHeader>
                        <ul className="grid gap-3 text-sm mt-2">

                          {customerCard.map((customer, index) => (
                            <div className="grid gap-3 mx-3 mb-3">
                              <div className="relative mt-3" key={index} >
                                <Input
                                  defaultValue={customer.value}
                                  name={customer.name}
                                  type="text"
                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">{customer.label}</label>
                              </div>
                            </div>
                          ))}
                        </ul>
                        <input type='hidden' name='financeId' defaultValue={finance.id} />
                        <input type='hidden' name='userId' defaultValue={user.id} />
                        <input type='hidden' name="clientfileId" defaultValue={data.clientfileId} />
                        <div className='flex justify-center' >
                          <ButtonLoading
                            size="sm"
                            value="updateClientInfoFinance"
                            className="w-auto cursor-pointer ml-auto mt-5 bg-primary"
                            name="intent"
                            type="submit"
                            isSubmitting={isSubmitting}
                            onClick={() => toast.success(`${finance.firstName}'s customer file is updated...`)}
                            loadingText={`${data.firstName}'s customer file is updated...`}
                          >
                            Save
                            <PaperPlaneIcon className="h-4 w-4 ml-2" />
                          </ButtonLoading>
                        </div>
                      </fetcher.Form>
                    </TabsContent>
                    <TabsContent value="Finance">
                      <fetcher.Form method='post'>
                        <DialogHeader className="px-4 pb-4 pt-5">
                          <DialogTitle>Finance Application Info</DialogTitle>
                          <hr className="my-3 text-muted-foreground w-[98%] mx-auto" />
                        </DialogHeader>

                        <ul className="grid gap-3 text-sm mt-2">
                          {financeApp.map((customer, index) => (
                            <div className="grid gap-3 mx-3 mb-3">
                              <div className="relative mt-3" key={index} >
                                <Input
                                  defaultValue={customer.value}
                                  name={customer.name}
                                  type="text"
                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">{customer.label}</label>
                              </div>
                              <input type='hidden' name='financeAppId' value={customer.id} />
                            </div>
                          ))}
                        </ul>
                        <div className='flex justify-center' >
                          <ButtonLoading
                            size="sm"
                            value="updateFinanceApp"
                            className="w-auto cursor-pointer ml-auto mt-5 bg-primary"
                            name="intent"
                            type="submit"
                            isSubmitting={isSubmitting}
                            onClick={() => toast.success(`${finance.firstName}'s customer file is updated...`)}
                            loadingText={`${data.firstName}'s customer file is updated...`}
                          >
                            Save
                            <PaperPlaneIcon className="h-4 w-4 ml-2" />
                          </ButtonLoading>
                        </div>
                      </fetcher.Form>
                    </TabsContent>

                  </Tabs>

                </DialogContent>
              </Dialog>

            </CardFooter>
          </Card>
        </Tabs>

        {/*deal card*/}
        <Card className=" w-[95%] rounded-lg text-foreground mx-auto  max-h-[750px] h-auto ">
          <CardHeader className=" bg-muted/50  flex flex-row items-start t-rounded-lg">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-sm my-2">
                Deal Info
              </CardTitle>
            </div>
          </CardHeader>
          {secPage && (
            <>
              <CardContent className="flex-grow !grow  p-6 text-sm bg-background  max-h-[600px] h-[600px] overflow-y-auto">
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
                          className="h-8 w-20 text-right bg-background border-border "
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
                            className="mt-2 h-8 w-20 items-end justify-end  text-right bg-background border-border "
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
                            className="mt-2 h-8 w-20 items-end justify-end  text-right bg-background border-border "
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
                            className="mt-2 h-8 w-20 items-end justify-end  text-right  bg-background border-border "
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
                            className="mt-2 h-8 w-20 items-end justify-end  text-right bg-background border-border "
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
                          className="h-8 w-20 text-right bg-background border-border "
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
                          className="h-8 w-20 text-right bg-background border-border "
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
                          className="ml-auto mt-2 h-8 w-20  justify-end text-right bg-background border-border "
                          defaultValue={licensing}
                          placeholder="licensing"
                          type="text"
                          name="licensing"
                          onChange={handleChange}
                        />
                      </span>
                    </li>
                    {/*
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
                            */}
                  </ul>
                </div>
                <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
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
                        ? "active bg-[#0a0a0a]2 text-foreground "
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
                          <span className="text-[#8a8a93]">
                            Bi-weekly
                          </span>
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
                            <span className="text-[#8a8a93]">
                              Monthly
                            </span>
                            <span> ${qc60}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Bi-weekly
                            </span>
                            <span> ${biweeklyqc}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Weekly
                            </span>
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
                            <span className="text-[#8a8a93]">
                              Monthly
                            </span>
                            <span> ${nat60}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Bi-weekly
                            </span>
                            <span> ${biweeklNat}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Weekly
                            </span>
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
                            <span className="text-[#8a8a93]">
                              Monthly
                            </span>
                            <span> ${nat60WOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Bi-weekly
                            </span>
                            <span> ${biweeklNatWOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Weekly
                            </span>
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
                        <span className="text-[#8a8a93]">
                          Other tax %
                        </span>
                        <span>
                          <Input
                            name="othTax"
                            id="othTax"
                            className="h-8 w-20 text-right bg-background border-border "
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
                            <span className="text-[#8a8a93]">
                              Monthly
                            </span>
                            <span> ${oth60}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Bi-weekly
                            </span>
                            <span> ${biweekOth}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Weekly
                            </span>
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
                            <span className="text-[#8a8a93]">
                              Monthly
                            </span>
                            <span> ${oth60WOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Bi-weekly
                            </span>
                            <span> ${biweekOthWOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Weekly
                            </span>
                            <span> ${weeklyOthWOptions}</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                <div className="font-semibold">Contract Variables</div>
                <div className="grid grid-cols-2 ">
                  <div className=" mt-2 ">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <label htmlFor="Term">Term</label>
                      <Input
                        className="h-8 w-20 bg-background border-border "
                        name="months"
                        id="months"
                        autoComplete="months"
                        defaultValue={months}
                        onChange={handleChange}
                        type="number"
                      />
                    </div>
                  </div>
                  <div className="mt-2 grid items-end justify-end ">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <label className="text-right" htmlFor="iRate">
                        Rate
                      </label>
                      <Input
                        className="h-8 w-20 items-end justify-end text-right bg-background border-border  "
                        name="iRate"
                        id="iRate"
                        autoComplete="iRate"
                        defaultValue={iRate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className=" mt-2 ">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <label htmlFor="deposit">Deposit</label>
                      <Input
                        className="h-8 w-20 bg-background border-border "
                        name="deposit"
                        id="deposit"
                        autoComplete="deposit"
                        defaultValue={deposit}
                        onChange={handleChange}
                        type="number"
                      />
                    </div>
                  </div>
                  <div className=" mt-2 grid items-end justify-end ">
                    <div className="grid w-full max-w-sm items-center gap-1.5 ">
                      <label htmlFor="tradeValue">Trade Value</label>
                      <Input
                        className="ml-auto h-8 w-20 text-right bg-background border-border "
                        name="tradeValue"
                        id="tradeValue"
                        autoComplete="tradeValue"
                        defaultValue={tradeValue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className=" mt-2 ">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <label htmlFor="deposit">Lien</label>
                      <Input
                        className="h-8 w-20 bg-background border-border "
                        name="lien"
                        id="lien"
                        autoComplete="lien"
                        defaultValue={lien}
                        onChange={handleChange}
                        type="number"
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline">Other Inputs</Button>
                  </DrawerTrigger>
                  <DrawerContent className='bg-background text-foreground'>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle>Other Inputs</DrawerTitle>
                        <DrawerDescription>Changes to discounts and such</DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 pb-0">
                        <div className="flex items-center justify-center space-x-2">
                          <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                              <span className="text-[#8a8a93]">Discount $</span>
                              <span>
                                <Input
                                  name="discount"
                                  id="msrp"
                                  className="h-8 w-20 text-right bg-background border-border "
                                  autoComplete="msrp"
                                  defaultValue={discount}
                                  onChange={handleChange}
                                />
                              </span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-[#8a8a93]"> Discount (1.1-15)%</span>
                              <span>
                                <Input
                                  name="discountPer"
                                  id="msrp"
                                  className="h-8 w-20 text-right bg-background border-border "
                                  autoComplete="msrp"
                                  defaultValue={0}
                                  onChange={handleChange}
                                />
                              </span>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="text-[#8a8a93]">Delivery Charge</span>
                              <span>
                                <Input
                                  name="deliveryCharge"
                                  id="msrp"
                                  className="h-8 w-20 text-right bg-background border-border "
                                  autoComplete="msrp"
                                  defaultValue={deliveryCharge}
                                  onChange={handleChange}
                                />
                              </span>
                            </li>
                            {totalLabour > 0 && (
                              <li className="flex items-center justify-between">
                                <span className="text-[#8a8a93]">Total Labour</span>
                                <span> ${totalLabour}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button variant="outline">Close</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>


                <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
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
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">Total</span>
                            <span>${total}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              With taxes
                            </span>
                            <span> ${onTax}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              After Deposit
                            </span>
                            <span> ${onTax - deposit}</span>
                          </li>
                        </>
                      )}
                      {subButton === "withOptions" && (
                        <>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">Total</span>
                            <span>${totalWithOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              With taxes
                            </span>
                            <span> ${qcTax}</span>
                          </li>
                          <li className="flex items-center justify-between">
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
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">Total</span>
                            <span>${total}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              With taxes
                            </span>
                            <span> ${native}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              After Deposit
                            </span>
                            <span> ${native - deposit}</span>
                          </li>
                        </>
                      )}
                      {subButton === "withOptions" && (
                        <>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">Total</span>
                            <span>${totalWithOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              With taxes
                            </span>
                            <span> ${totalWithOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
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
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">Total</span>
                            <span>${total}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              With taxes
                            </span>
                            <span> ${otherTax}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              After Deposit
                            </span>
                            <span> ${otherTax - deposit}</span>
                          </li>
                        </>
                      )}
                      {subButton === "withOptions" && (
                        <>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">Total</span>
                            <span>${totalWithOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              With taxes
                            </span>
                            <span> ${otherTaxWithOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
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
              <CardContent className="flex-grow !grow  p-6 text-sm  bg-background  max-h-[600px] h-[600px] overflow-y-auto">
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
                  <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
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
                      <span className="text-[#8a8a93]">
                        Labour Hours
                      </span>
                      <span>${formData.labour}</span>
                    </li>
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-[#8a8a93]">Licensing</span>
                      <span>${licensing}</span>
                    </li>

                    {finance.brand === 'Sea-Doo' && modelData.trailer > 0 && (
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-[#8a8a93]">Trailer</span>
                        <span>${modelData.trailer}</span>
                      </li>
                    )}
                    {finance.brand === 'Triumph' && modelData.painPrem > 0 && (
                      <li className="flex items-center justify-between font-semibold">
                        <span className="text-[#8a8a93]">Paint Premium</span>
                        <span> ${modelData.painPrem}</span>
                      </li>
                    )}

                  </ul>
                  <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
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
                        <span className="text-[#8a8a93]">
                          Finance Fees
                        </span>
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
                <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
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
                        ? "active bg-[#0a0a0a]2 text-foreground "
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
                      <ul className="grid gap-3 mt-3">
                        <li className="flex items-center justify-between">
                          <span className="text-[#8a8a93]">Monthly</span>
                          <span> ${on60}</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-[#8a8a93]">
                            Bi-weekly
                          </span>
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
                        <div className="font-semibold mt-3">Options Include</div>
                        <DealerOptionsAmounts />
                        <ul className="grid gap-3">
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Monthly
                            </span>
                            <span> ${qc60}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Bi-weekly
                            </span>
                            <span> ${biweeklyqc}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Weekly
                            </span>
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
                        <ul className="grid gap-3 mt-3">
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Monthly
                            </span>
                            <span> ${nat60}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Bi-weekly
                            </span>
                            <span> ${biweeklNat}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Weekly
                            </span>
                            <span> ${weeklylNat}</span>
                          </li>
                        </ul>
                      </div>
                    )}
                    {subButton === "withOptions" && (
                      <div>
                        <div className="font-semibold mt-3">Options Include</div>
                        <DealerOptionsAmounts />
                        <ul className="grid gap-3">
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Monthly
                            </span>
                            <span> ${nat60WOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Bi-weekly
                            </span>
                            <span> ${biweeklNatWOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Weekly
                            </span>
                            <span> ${biweeklNatWOptions}</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {mainButton === "customTax" && (
                  <div className="">
                    {subButton === "withoutOptions" && (
                      <div className="mt-3 flex justify-between">
                        <ul className="grid gap-3">
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Monthly
                            </span>
                            <span> ${oth60}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Bi-weekly
                            </span>
                            <span> ${biweekOth}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Weekly
                            </span>
                            <span> ${weeklyOth}</span>
                          </li>
                        </ul>
                      </div>
                    )}
                    {subButton === "withOptions" && (
                      <div>
                        <div className="font-semibold mt-3">Options Include</div>
                        <DealerOptionsAmounts />
                        <ul className="grid gap-3">
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Monthly
                            </span>
                            <span> ${oth60WOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Bi-weekly
                            </span>
                            <span> ${biweekOthWOptions}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              Weekly
                            </span>
                            <span> ${weeklyOthWOptions}</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
                <div className="font-semibold">Contract Variables</div>
                <ul className="grid gap-3 mt-3">
                  <li className="flex items-center justify-between">
                    <span className="text-[#8a8a93]">Term</span>
                    <span>{months}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-[#8a8a93]">Rate</span>
                    <span>{iRate}%</span>
                  </li>
                  {deposit > 0 && (
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Deposit</span>
                      <span>${deposit}</span>
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


                <hr className="my-4 text-muted-foreground w-[95%] mx-auto" />
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
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">Total</span>
                            <span>${total}</span>
                          </li>
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">
                              With taxes
                            </span>
                            <span> ${onTax}</span>
                          </li>
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">
                              After Deposit
                            </span>
                            <span> ${onTax - deposit}</span>
                          </li>
                        </>
                      )}
                      {subButton === "withOptions" && (
                        <>
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">Total</span>
                            <span>${totalWithOptions}</span>
                          </li>
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">
                              With taxes
                            </span>
                            <span> ${qcTax}</span>
                          </li>
                          <li className="flex items-center justify-between mt-3">
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
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">Total</span>
                            <span>${total}</span>
                          </li>
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">
                              With taxes
                            </span>
                            <span> ${native}</span>
                          </li>
                          <li className="flex items-center justify-between">
                            <span className="text-[#8a8a93]">
                              After Deposit
                            </span>
                            <span> ${native - deposit}</span>
                          </li>
                        </>
                      )}
                      {subButton === "withOptions" && (
                        <>
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">Total</span>
                            <span>${totalWithOptions}</span>
                          </li>
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">
                              With taxes
                            </span>
                            <span> ${totalWithOptions}</span>
                          </li>
                          <li className="flex items-center justify-between mt-3">
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
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">Total</span>
                            <span>${total}</span>
                          </li>
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">
                              With taxes
                            </span>
                            <span> ${otherTax}</span>
                          </li>
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">
                              After Deposit
                            </span>
                            <span> ${otherTax - deposit}</span>
                          </li>
                        </>
                      )}
                      {subButton === "withOptions" && (
                        <>
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">Total</span>
                            <span>${totalWithOptions}</span>
                          </li>
                          <li className="flex items-center justify-between mt-3">
                            <span className="text-[#8a8a93]">
                              With taxes
                            </span>
                            <span> ${otherTaxWithOptions}</span>
                          </li>
                          <li className="flex items-center justify-between mt-3">
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
          <CardFooter className="mt-[7px]  bg-muted/50   flex flex-row items-center border-t px-6 py-3  b-rounded-lg">
            <div className="mr-auto flex items-center gap-1">
              <Select
                onValueChange={(value) => {
                  setOpen(false);
                  // console.log("click");
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
                    //     console.log(selectedFramework, 'selectedFramework')
                    SubmitTheForm(newValue, template, financeId);
                  } else
                    if (selectedFramework.template === "justPaymentsCustom" || selectedFramework.template === "fullBreakdownCustom" || selectedFramework.template === "FullBreakdownWOptionsCustom") {
                      //       console.log(selectedFramework, 'customEmail')
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
                  <DropdownMenuSeparator />
                  <Form method="post">
                    <DropdownMenuItem
                      className=" w-[100%] cursor-pointer rounded-md border-border bg-muted-background text-foreground hover:bg-muted/50"
                      onClick={() => {
                        toast.success(
                          `Informing finance managers of requested turnover...`
                        );
                        submit;
                      }}
                    >
                      <input
                        type="hidden"
                        name="intent"
                        value="financeTurnover"
                      />
                      <input type="hidden" name="locked" value={lockedValue} />
                      <input
                        type="hidden"
                        name="financeId"
                        value={finance.id}
                      />
                      Finance Turnover
                    </DropdownMenuItem>
                  </Form>
                  <DropdownMenuItem className=" cursor-pointer border-border bg-muted-background text-foreground hover:bg-muted/50">
                    <PrintSpec />
                  </DropdownMenuItem>
                  <DropdownMenuItem className=" cursor-pointer border-border bg-muted-background text-foreground hover:bg-muted/50">
                    <ModelPage />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

        {/*finance card*/}
        <Tabs defaultValue="Sales">
          <Card className="w-[95%]  bg-background text-foreground rounded-lg   max-h-[750px] h-auto" x-chunk="dashboard-05-chunk-0"  >
            <CardHeader className="flex flex-row items-start bg-muted/50 rounded-md">
              <CardTitle className="group flex items-center text-sm">
                <TabsList >
                  <TabsTrigger value="Sales">Bank Info</TabsTrigger>
                  <TabsTrigger value="Finance">Print Docs</TabsTrigger>
                  <TabsTrigger value="FinanceProducts">Finance Products</TabsTrigger>
                </TabsList>
              </CardTitle>
            </CardHeader>
            <CardContent className='flex-grow !grow  max-h-[600px] h-[600px] overflow-y-auto'>
              <TabsContent value="Sales" className="  text-foreground rounded-lg">
                <ul className="grid gap-3 text-sm mt-2">
                  {bankingInformation.map((customer, index) => (
                    <li key={index} className="group flex items-center justify-between">
                      <div className='flex'>
                        <span className="text-muted-foreground">
                          {customer.label}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyText(customer.value)}
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        {copiedText === customer.value && <FaCheck strokeWidth={1.5} className="ml-2 text-lg hover:text-primary" />}
                      </div>
                      <p>{customer.value}</p>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="Finance">
                <MyIFrameComponent />
                <hr className=' text-muted-foreground w-98 mx-auto] my-5' />
                <CustomerGen />
              </TabsContent>
              <TabsContent value="FinanceProducts">

                {products.map((product, productIndex) => (
                  <div key={productIndex} className="grid gap-3 mx-3 mb-3">
                    <div className="font-semibold">{product.name}</div>
                    <hr className="mb-3 text-muted-foreground w-[98%] mx-auto" />

                    {product.columns.map((columns, columnIndex) => (
                      <div key={columnIndex} className="relative mt-3 flex">
                        <Select>
                          <SelectTrigger className="w-full bg-background border-border mx-3 ">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent className="bg-background text-foreground border-border">
                            <SelectGroup>
                              <SelectLabel>Packages</SelectLabel>

                              {columns.items.map((item, itemIndex) => (
                                <SelectItem
                                  className="cursor-pointer rounded-md hover:bg-muted/50"
                                  key={itemIndex}
                                  value={item.content}
                                >
                                  {item.title} / ${item.content}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        {/* Label for the Column */}
                        <label className="text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">
                          {columns.name}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}

              </TabsContent>
            </CardContent>
            <CardFooter className="mt-[7px] grid grid-cols-2 justify-between items-center border-t border-border bg-muted/50 px-6 py-3">
              <div>
                <Badge className="h-8 gap-1">{finance.customerState}</Badge>
              </div>
              <Dialog  >
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8 gap-1 ml-auto">
                    <CiEdit className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Edit
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="gap-0 p-0 outline-none border-border text-foreground   max-h-[750px] h-[750px]  overflow-y-auto">
                  <Tabs defaultValue="Sales" className='m-3 p-3'>
                    <TabsList >
                      <TabsTrigger value="Sales">Bank Info</TabsTrigger>
                      <TabsTrigger value="Finance">Finance App</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Sales" className="  text-foreground rounded-lg">
                      <fetcher.Form method='post'>
                        <DialogHeader className="px-4 pb-4 pt-5">
                          <DialogTitle>Edit Bank Info</DialogTitle>
                          <hr className="my-3 text-muted-foreground w-[98%] mx-auto" />
                        </DialogHeader>
                        <ul className="grid gap-3 text-sm mt-2">

                          {bankingInformation.map((customer, index) => (
                            <div className="grid gap-3 mx-3 mb-3">
                              <div className="relative mt-3" key={index} >
                                <Input
                                  defaultValue={customer.value}
                                  name={customer.name}
                                  type="text"
                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">{customer.label}</label>
                              </div>
                            </div>
                          ))}
                        </ul>

                        <input type='hidden' name='financeId' defaultValue={finance.id} />
                        <input type='hidden' name='userId' defaultValue={user.id} />

                        <input type='hidden' name="clientId" defaultValue={finance.id} />
                        <input type='hidden' name="clientfileId" defaultValue={data.clientfileId} />

                        <div className='flex justify-center' >
                          <ButtonLoading
                            size="sm"
                            value="updateClientInfoFinance"
                            className="w-auto cursor-pointer ml-auto mt-5 bg-primary"
                            name="intent"
                            type="submit"
                            isSubmitting={isSubmitting}
                            onClick={() => toast.success(`${finance.firstName}'s customer file is updated...`)}
                            loadingText={`${data.firstName}'s customer file is updated...`}
                          >
                            Save
                            <PaperPlaneIcon className="h-4 w-4 ml-2" />
                          </ButtonLoading>
                        </div>
                      </fetcher.Form>
                    </TabsContent>
                    <TabsContent value="Finance">
                      <fetcher.Form method='post'>
                        <DialogHeader className="px-4 pb-4 pt-5">
                          <DialogTitle>Finance App Info</DialogTitle>
                          <hr className="my-3 text-muted-foreground w-[98%] mx-auto" />
                        </DialogHeader>
                        <ul className="grid gap-3 text-sm mt-2">
                          {financeApp.map((customer, index) => (
                            <div className="grid gap-3 mx-3 mb-3">
                              <div className="relative mt-3" key={index} >
                                <Input
                                  defaultValue={customer.value}
                                  name={customer.name}
                                  type="text"
                                  className="w-full bg-background border-border "
                                />
                                <label className=" text-sm absolute left-3 rounded-full -top-3 px-2 bg-background transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-blue-500">{customer.label}</label>
                              </div>
                            </div>
                          ))}
                        </ul>
                        <div className='flex justify-center' >
                          <ButtonLoading
                            size="sm"
                            value="updateClientInfoFinance"
                            className="w-auto cursor-pointer ml-auto mt-5 bg-primary"
                            name="intent"
                            type="submit"
                            isSubmitting={isSubmitting}
                            onClick={() => toast.success(`${finance.firstName}'s customer file is updated...`)}
                            loadingText={`${data.firstName}'s customer file is updated...`}
                          >
                            Save
                            <PaperPlaneIcon className="h-4 w-4 ml-2" />
                          </ButtonLoading>
                        </div>
                      </fetcher.Form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </Tabs>


      </DialogContent>
    </Dialog >
  )
}
