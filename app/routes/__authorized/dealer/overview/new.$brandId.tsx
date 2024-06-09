/* eslint-disable tailwindcss/enforces-shorthand */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  overviewLoader,
  overviewAction,
  financeIdLoader,
} from "~/components/actions/overviewActions";
import {
  useFetcher,
  useLoaderData,
  useNavigation,
  useParams,
  useRouteLoaderData,
  useActionData,
  Form,
  useSubmit,
} from "@remix-run/react";
import React, { useEffect, useState } from "react";
import BMWOptions from "~/overviewUtils/bmwOptions";
import ManitouOptions from "~/overviewUtils/manitouOptions";
import { Checkbox, ButtonLoading, DialogClose } from "~/components/ui/index";
import { toast } from "sonner";
import { GetUser } from "~/utils/loader.server";
import { getSession } from "~/sessions/auth-session.server";
import {
  json,
  type ActionFunction,
  type DataFunctionArgs,
  type LoaderFunction,
  redirect,
} from "@remix-run/node";
import { prisma } from "~/libs";
import {
  commitSession as commitPref,
  getSession as getPref,
} from "~/utils/pref.server";
import {
  getDataKawasaki,
  getLatestBMWOptions,
  getLatestBMWOptions2,
  getDataBmwMoto,
  getDataByModel,
  getDataHarley,
  getDataTriumph,
  findQuoteById,
  findDashboardDataById,
  getDataByModelManitou,
  getLatestOptionsManitou,
} from "~/utils/finance/get.server";
import {
  Tabs,
  Badge,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Card,
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
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectGroup,
  RemixNavLink,
  Input,
  Separator,
  Button,
  TextArea,
  Label,
  PopoverTrigger,
  PopoverContent,
  Popover,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { MoreVertical, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "~/components/ui/drawer";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "~/components/ui/pagination";
import { PrintSpec } from "~/overviewUtils/printSpec";
import IndeterminateCheckbox from "~/components/dashboard/calls/InderterminateCheckbox";
import { ModelPage } from "~/overviewUtils/modelPage";
import {
  CaretSortIcon,
  CheckIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { cn } from "~/utils";
import EmailPreview, { TemplatePreviewThree, TemplatePreviewTwo, TemplatePreview } from "~/emails/preview";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";

export let action = overviewAction;

export async function loader({ params, request }: DataFunctionArgs) {
  const userSession = await getSession(request.headers.get("Cookie"));
  const email = userSession.get("email");
  const user = await GetUser(email);
  if (!user) {
    return redirect("/login");
  }


  const userId = user?.id;
  let finance = await prisma.finance.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });
  let newLook = false;
  // const brandId = params.brandId;
  switch (user?.newLook) {
    case "on":
      newLook = true;
    default:
      null;
  }
  const financeId = finance?.id;
  //  const { finance, dashboard, clientfile, } = await getClientFinanceAndDashData(financeId)
  let deFees = await prisma.dealer.findUnique({ where: { userEmail: email } });
  if (!deFees) {
    deFees = await prisma.dealer.findFirst();
  }
  const records = await prisma.inventoryMotorcycle.findMany();

  const session = await getPref(request.headers.get("Cookie"));
  const sliderWidth = session.get("sliderWidth");
  const tokens = session.get("accessToken");
  session.set("userId", userId);
  session.set("financeId", financeId);
  await commitPref(session);
  const brand = finance?.brand;
  const notifications = await prisma.notificationsUser.findMany({
    where: {
      userEmail: email,
    },
  });
  if (brand === "Manitou") {
    const modelData = await getDataByModelManitou(finance);
    const manOptions = await getLatestOptionsManitou(email);
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      manOptions,
      sliderWidth,
      records,
      notifications,
      user,
      tokens,
      email,
      newLook,
    });
  }
  if (brand === "Switch") {
    const modelData = await getDataByModel(finance);
    const manOptions = await getLatestOptionsManitou(email);
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      manOptions,
      sliderWidth,
      records,
      notifications,
      user,
      tokens,
      email,
      newLook,
    });
  }
  if (brand === "Kawasaki") {
    const modelData = await getDataKawasaki(finance);
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      sliderWidth,
      records,
      notifications,
      user,
      tokens,
      email,
      newLook,
    });

  }
  if (brand === "BMW-Motorrad") {
    const financeId = finance?.id;
    const bmwMoto = await getLatestBMWOptions(financeId);
    const bmwMoto2 = await getLatestBMWOptions2(financeId);
    const modelData = await getDataBmwMoto(finance);
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      bmwMoto,
      bmwMoto2,
      sliderWidth,
      records,
      notifications,
      user,
      tokens,
      email,
      newLook,
    });

  }
  if (brand === "Triumph") {
    const modelData = await getDataTriumph(finance);
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      sliderWidth,
      records,
      notifications,
      user,
      tokens,
      email,
      newLook,
    });

  }
  if (brand === "Harley-Davidson") {
    const modelData = await getDataHarley(finance);
    console.log(user, tokens, "user, tokens ");
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      sliderWidth,
      records,
      notifications,
      user,
      tokens,
      email,
      newLook,
    });

  } else {
    const modelData = await getDataByModel(finance);
    return json({
      ok: true,
      modelData,
      finance,
      deFees,
      sliderWidth,
      records,
      notifications,
      user,
      tokens,
      email,
      newLook,
    });

  }

}

export function Overview({ outletSize }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const errors = useActionData() as Record<string, string | null>;

  const {
    finance,
    modelData,
    deFees,
    manOptions,
    bmwMoto,
    bmwMoto2,
    user,
    notifications,
  } = useLoaderData();
  const toFormat = new Date();
  const today = toFormat.toISOString();
  let { brandId } = useParams();
  const brand = brandId;
  let fetcher = useFetcher();
  const showSection = true;
  const [open, setOpen] = React.useState(false);
  const eventDateRef = React.useRef(new Date());
  const timerRef = React.useRef(0);
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

  const initial = {
    userLabour: parseInt(deFees.userLabour) || 0,
    accessories: finance.accessories ? parseFloat(finance.accessories) : 0,
    labour: parseInt(finance.labour) || 0,
    lien: parseInt(finance.lien) || 0,
    msrp: parseInt(modelData.msrp) || 0,
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
    paintPrem: parseInt(modelData.paintPrem) || 0,
    modelCode: modelData.modelCode || null,
    model: modelData.model,
    color: modelData.color,
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
    tradeValue: 0,
    deposit: 500,
    discount: 0,
    iRate: 10.99,
    months: 60,
    discountPer: 0,
    biweeklyqc: 0,
    weeklyqc: 0,
    biweeklNat: 0,
    weeklylNat: 0,
    biweekOth: 0,
    weeklyOth: 0,
    othTax: 13,
    firstName: finance.firstName,
    lastName: finance.lastName,
    panAmAdpRide: 0,
    panAmTubelessLacedWheels: 0,
    hdWarrAmount: 0,
    body: "",
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
    if (brand === "Manitou") {
      return <ManitouOptions manOptions={manOptions} modelData={modelData} />;
    }
    if (brand === "BMW-Motorrad") {
      return (
        <>
          <BMWOptions bmwMoto={bmwMoto} bmwMoto2={bmwMoto2} />
        </>
      );
    }
    if (brand === "Switch") {
      const manSwitchAccNames = {
        baseInst: "Base Installer",
        cupHolder: "Cup Holder",
        multiHolder: "Multi Holder",
        cooler13: "Cooler 13 L",
        stemwareHolder: "Stemware Holder",
        coolerExtension: "Cooler Extension",
        coolerBag14: "Cooler Bag 14 L",
        singleHolder: "Single Holder",
        cargoBox10: "Cargo Box 10 L",
        cargoBox20: "Cargo Box 20 L",
        cargoBox30: "Cargo Box 30 L",
        rodHolder: "Rod Holder",
        batteryCharger: "Battery Charger",
        bowFillerBench: "Bow Filler Bench",
        skiTowMirror: "Ski Tow Mirror",
        portAquaLounger: "Port Aqua Lounger",
      };

      const manSwitchAccArray = [
        "baseInst",
        "cupHolder",
        "multiHolder",
        "cooler13",
        "coolerExtension",
        "coolerBag14",
        "singleHolder",
        "stemwareHolder",
        "cargoBox10",
        "cargoBox20",
        "cargoBox30",
        "rodHolder",
        "batteryCharger",
        "bowFillerBench",
        "portAquaLounger",
        "skiTowMirror",
      ];

      return (
        <>
          {manSwitchAccArray.some((option) => manOptions[option] > 0) && (
            <>
              <div className="mt-3">
                <h3 className="text-2xl ">Accessories</h3>
              </div>
              <hr className="solid" />
            </>
          )}
          {manSwitchAccArray.map((option) => {
            if (manOptions[option] > 0) {
              const displayName = manSwitchAccNames[option];
              return (
                <div key={option} className="mt-2 flex justify-between">
                  <p className="">{displayName}</p>
                  <p className="">${manOptions[option]}</p>
                </div>
              );
            }
            return null;
          })}
        </>
      );
    }

    if (brand === "Harley-Davidson") {
      const hdWarrArray = {
        Sport: {
          "With Tire and Rim": {
            "3 years": 1309,
            "4 years": 1579,
            "5 years": 1884,
            "6 years": 2099,
            "7 years": 2504,
          },
          "W/O Tire and Rim": {
            "3 years": 839,
            "4 years": 1059,
            "5 years": 1334,
            "6 years": 1464,
            "7 years": 1824,
          },
        },
        Cruiser: {
          "With Tire and Rim": {
            "3 years": 1519,
            "4 years": 1804,
            "5 years": 2154,
            "6 years": 2504,
            "7 years": 3064,
          },
          "W/O Tire and Rim": {
            "3 years": 1049,
            "4 years": 1284,
            "5 years": 1604,
            "6 years": 1869,
            "7 years": 2384,
          },
        },
        "Adventure Touring": {
          "With Tire and Rim": {
            "3 years": 1519,
            "4 years": 1804,
            "5 years": 2154,
            "6 years": 2504,
            "7 years": 3064,
          },
          "W/O Tire and Rim": {
            "3 years": 1049,
            "4 years": 1284,
            "5 years": 1604,
            "6 years": 1869,
            "7 years": 2384,
          },
        },
        "Grand America Touring": {
          "With Tire and Rim": {
            "3 years": 1679,
            "4 years": 2069,
            "5 years": 2509,
            "6 years": 3089,
            "7 years": 3609,
          },
          "W/O Tire and Rim": {
            "3 years": 1209,
            "4 years": 1549,
            "5 years": 1959,
            "6 years": 2454,
            "7 years": 2929,
          },
        },
        Trike: {
          "With Tire and Rim": {
            "3 years": 1819,
            "4 years": 2279,
            "5 years": 2679,
            "6 years": 3259,
            "7 years": 3864,
          },
          "W/O Tire and Rim": {
            "3 years": 1349,
            "4 years": 1759,
            "5 years": 2129,
            "6 years": 2624,
            "7 years": 3184,
          },
        },
        EV: {
          "With Tire and Rim": {
            "3 years": 1519,
            "4 years": 1799,
            "5 years": 2144,
            "6 years": 3079,
            "7 years": 3599,
          },
          "W/O Tire and Rim": {
            "3 years": 1049,
            "4 years": 1279,
            "5 years": 1594,
            "6 years": 2444,
            "7 years": 2919,
          },
        },
        "Police Bikes": {
          "W/O Tire and Rim": {
            "3 years": 1111,
            "4 years": 1555,
            "5 years": 1911,
          },
        },
      };
      let difference = 0;
      let difference2 = 0;
      formData.hdWarrAmount =
        selectedType &&
          hdWarrArray[selectedType] &&
          selectedOption &&
          hdWarrArray[selectedType][selectedOption] &&
          selectedYear &&
          hdWarrArray[selectedType][selectedOption][selectedYear]
          ? hdWarrArray[selectedType][selectedOption][selectedYear]
          : 0;
      if (selectedOption === "With Tire and Rim") {
        difference =
          hdWarrArray[selectedType][selectedOption][selectedYear] -
          hdWarrArray[selectedType]["W/O Tire and Rim"][selectedYear];
      }
      if (selectedOption === "W/O Tire and Rim") {
        difference2 =
          hdWarrArray[selectedType][selectedOption][selectedYear] -
          hdWarrArray[selectedType]["With Tire and Rim"][selectedYear];
      }
      return (
        <>
          <div className="xs:grid xs:grid-cols-1 mt-3 flex justify-between">
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className=" text-gray-600 placeholder-blue-300 ml-2 mr-2 rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
            >
              <option value="0">Motorcycle Category</option>

              {Object.keys(hdWarrArray).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>

            {selectedType && (
              <select
                value={selectedOption}
                onChange={handleOptionChange}
                className="text-gray-600  placeholder-blue-300 mx-auto ml-2 mr-2 rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
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
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="text-gray-600 placeholder-blue-300 ml-2 mr-2 rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
              >
                <option value="0">Years</option>

                {Object.keys(hdWarrArray[selectedType][selectedOption]).map(
                  (key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  )
                )}
              </select>
            )}
          </div>
          <div className="text-center">
            {selectedOption === "With Tire and Rim" && difference > 2 && (
              <>
                <p>
                  H-D ESP FOR {selectedType} model family, {selectedOption} for{" "}
                  {selectedYear} is only: ${formData.hdWarrAmount}
                </p>
                <p className="mt-2"> Difference is only ${difference}</p>
              </>
            )}
            {selectedOption === "W/O Tire and Rim" && difference2 < 2 && (
              <>
                <p>
                  {" "}
                  {selectedType}, {selectedOption} for {selectedYear} The amount
                  is: ${formData.hdWarrAmount}
                </p>
                <p className="mt-2">The difference is only ${difference2}</p>
              </>
            )}
          </div>
        </>
      );
    }
    if (brand === "BMW-Motorrad") {
      initial.m1000rMPkg = parseInt(bmwMoto.m1000rMPkg) || 0;
      initial.m1000rTitEx = parseInt(bmwMoto.m1000rTitEx) || 0;
      initial.desOption = parseInt(bmwMoto.desOption) || 0;
      initial.m1000rrMPkg = parseInt(bmwMoto.m1000rrMPkg) || 0;
      initial.s1000rrRacePkg = parseInt(bmwMoto.s1000rrRacePkg) || 0;
      initial.s1000rrRacePkg2 = parseInt(bmwMoto.s1000rrRacePkg2) || 0;
      initial.passengerKitLowSeat = parseInt(bmwMoto.passengerKitLowSeat) || 0;
      initial.f7gsConn = parseInt(bmwMoto.f7gsConn) || 0;
      initial.f8gsDblSeat = parseInt(bmwMoto.f8gsDblSeat) || 0;
      initial.r12rtAudioSystem = parseInt(bmwMoto.r12rtAudioSystem) || 0;
      initial.f9xrHandProtectors = parseInt(bmwMoto.f9xrHandProtectors) || 0;
      initial.r12gsCrossGld = parseInt(bmwMoto.r12gsCrossGld) || 0;
      initial.r12gsSpSusp = parseInt(bmwMoto.r12gsSpSusp) || 0;
      initial.r12gsProtBar = parseInt(bmwMoto.r12gsProtBar) || 0;
      initial.r12gsCrossBlk = parseInt(bmwMoto.r12gsCrossBlk) || 0;
      initial.audioSystem = parseInt(bmwMoto.audioSystem) || 0;
      initial.highShield = parseInt(bmwMoto.highShield) || 0;
      initial.psgrKit = parseInt(bmwMoto.psgrKit) || 0;
      initial.alarm = parseInt(bmwMoto.alarm) || 0;
      initial.colorcost = parseInt(bmwMoto.color) || 0;
      initial.chain = parseInt(bmwMoto.chain) || 0;
      initial.comfortPkg = parseInt(bmwMoto.comfortPkg) || 0;
      initial.touringPkg = parseInt(bmwMoto.touringPkg) || 0;
      initial.activePkg = parseInt(bmwMoto.activePkg) || 0;
      initial.dynamicPkg = parseInt(bmwMoto.dynamicPkg) || 0;
      initial.offTire = parseInt(bmwMoto.offTire) || 0;
      initial.keyless = parseInt(bmwMoto.keyless) || 0;
      initial.headlightPro = parseInt(bmwMoto.headlightPro) || 0;
      initial.shiftAssPro = parseInt(bmwMoto.shiftAssPro) || 0;
      initial.tpc = parseInt(bmwMoto.tpc) || 0;
      initial.cruise = parseInt(bmwMoto.cruise) || 0;
      initial.windshield = parseInt(bmwMoto.windshield) || 0;
      initial.handleBar = parseInt(bmwMoto.handleBar) || 0;
      initial.extraHighSeat = parseInt(bmwMoto.extraHighSeat) || 0;
      initial.alumTank1 = parseInt(bmwMoto.alumTank1) || 0;
      initial.alumTank2 = parseInt(bmwMoto.alumTank2) || 0;
      initial.classicW = parseInt(bmwMoto.classicW) || 0;
      initial.silencer = parseInt(bmwMoto.silencer) || 0;
      initial.chromedExhaust = parseInt(bmwMoto.chromedExhaust) || 0;
      initial.crossW = parseInt(bmwMoto.crossW) || 0;
      initial.highSeat = parseInt(bmwMoto.highSeat) || 0;
      initial.lowKitLowSeat = parseInt(bmwMoto.lowKitLowSeat) || 0;
      initial.lowSeat = parseInt(bmwMoto.lowSeat) || 0;
      initial.comfortPsgrSeat = parseInt(bmwMoto.comfortPsgrSeat) || 0;
      initial.mPsgrSeat = parseInt(bmwMoto.mPsgrSeat) || 0;
      initial.aeroPkg719 = parseInt(bmwMoto.aeroPkg719) || 0;
      initial.comfortSeat = parseInt(bmwMoto2.comfortSeat) || 0;
      initial.designW = parseInt(bmwMoto2.designW) || 0;
      initial.loweringKit = parseInt(bmwMoto2.loweringKit) || 0;
      initial.forgedWheels = parseInt(bmwMoto2.forgedWheels) || 0;
      initial.carbonWheels = parseInt(bmwMoto2.carbonWheels) || 0;
      initial.centerStand = parseInt(bmwMoto2.centerStand) || 0;
      initial.billetPack1 = parseInt(bmwMoto2.billetPack1) || 0;
      initial.billetPack2 = parseInt(bmwMoto2.billetPack2) || 0;
      initial.heatedSeat = parseInt(bmwMoto2.heatedSeat) || 0;
      initial.lugRack = parseInt(bmwMoto2.lugRack) || 0;
      initial.lugRackBrackets = parseInt(bmwMoto2.lugRackBrackets) || 0;
      initial.chargeSocket = parseInt(bmwMoto2.chargeSocket) || 0;
      initial.auxLights = parseInt(bmwMoto2.auxLights) || 0;
      initial.mLightBat = parseInt(bmwMoto2.mLightBat) || 0;
      initial.carbonPkg = parseInt(bmwMoto2.carbonPkg) || 0;
      initial.enduroPkg = parseInt(bmwMoto2.enduroPkg) || 0;
      initial.sportShield = parseInt(bmwMoto2.sportShield) || 0;
      initial.sportWheels = parseInt(bmwMoto2.sportWheels) || 0;
      initial.sportSeat = parseInt(bmwMoto2.sportSeat) || 0;
      initial.brownBench = parseInt(bmwMoto2.brownBench) || 0;
      initial.brownSeat = parseInt(bmwMoto2.brownSeat) || 0;
      initial.handleRisers = parseInt(bmwMoto2.handleRisers) || 0;
      initial.lgihtsPkg = parseInt(bmwMoto2.lgihtsPkg) || 0;
      initial.fogLights = parseInt(bmwMoto2.fogLights) || 0;
      initial.pilSeatCover = parseInt(bmwMoto2.pilSeatCover) || 0;
      initial.lapTimer = parseInt(bmwMoto2.lapTimer) || 0;
      initial.floorLight = parseInt(bmwMoto2.floorLight) || 0;
      initial.blackBench = parseInt(bmwMoto2.blackBench) || 0;
      initial.hillStart = parseInt(bmwMoto2.hillStart) || 0;
      initial.floorboards = parseInt(bmwMoto2.floorboards) || 0;
      initial.reverse = parseInt(bmwMoto2.reverse) || 0;
      initial.forkTubeTrim = parseInt(bmwMoto2.forkTubeTrim) || 0;
      initial.spokedW = parseInt(bmwMoto2.spokedW) || 0;
      initial.lockGasCap = parseInt(bmwMoto2.lockGasCap) || 0;
      initial.aeroWheel = parseInt(bmwMoto2.aeroWheel) || 0;
      initial.psgrBench719 = parseInt(bmwMoto2.psgrBench719) || 0;
      initial.blackS719 = parseInt(bmwMoto2.blackS719) || 0;
      initial.aero719 = parseInt(bmwMoto2.aero719) || 0;
      initial.pinstripe = parseInt(bmwMoto2.pinstripe) || 0;
      initial.designPkgBL = parseInt(bmwMoto2.designPkgBL) || 0;
      initial.benchseatlow = parseInt(bmwMoto2.benchseatlow) || 0;
      initial.iconWheel = parseInt(bmwMoto2.iconWheel) || 0;
      initial.centreStand = parseInt(bmwMoto2.centreStand) || 0;
      initial.tubeHandle = parseInt(bmwMoto2.tubeHandle) || 0;
      initial.classicWheels = parseInt(bmwMoto2.classicWheels) || 0;
      initial.blackContrastwheel = parseInt(bmwMoto2.blackContrastwheel) || 0;
      initial.silverContastWheel = parseInt(bmwMoto2.silverContastWheel) || 0;
      initial.silverWheel = parseInt(bmwMoto2.silverWheel) || 0;
      initial.activeCruise = parseInt(bmwMoto2.activeCruise) || 0;
      initial.blackPowertrain = parseInt(bmwMoto2.blackPowertrain) || 0;
      initial.blackWheel = parseInt(bmwMoto2.blackWheel) || 0;
    }

    if (brand === "Manitou") {
      initial.biminiCr = parseInt(manOptions.biminiCr) || 0;
      initial.signature = parseInt(manOptions.signature) || 0;
      initial.select = parseInt(manOptions.select) || 0;
      initial.tubeColor = parseInt(manOptions.tubeColor) || 0;
      initial.blkPkg = parseInt(manOptions.blkPkg) || 0;
      initial.selRFXPkgLX = parseInt(manOptions.selRFXPkgLX) || 0;
      initial.selRFXWPkgLX = parseInt(manOptions.selRFXWPkgLX) || 0;
      initial.colMatchedFiberLX = parseInt(manOptions.colMatchedFiberLX) || 0;
      initial.powderCoatingLX = parseInt(manOptions.powderCoatingLX) || 0;
      initial.blackAnoLX = parseInt(manOptions.blackAnoLX) || 0;
      initial.JLTowerLX = parseInt(manOptions.JLTowerLX) || 0;
      initial.premiumJLLX = parseInt(manOptions.premiumJLLX) || 0;
      initial.premAudioPkg = parseInt(manOptions.premAudioPkg) || 0;
      initial.fibreglassFrontXT = manOptions.fibreglassFrontXT;
      initial.JlPremiumAudio = parseInt(manOptions.JlPremiumAudio) || 0;
      initial.JLPremiumxt = parseInt(manOptions.JLPremiumxt) || 0;
      initial.XTPremiumcolor = parseInt(manOptions.XTPremiumcolor) || 0;
      initial.dts = parseInt(manOptions.dts) || 0;
      initial.verado = parseInt(manOptions.verado) || 0;
      initial.battery = parseInt(manOptions.battery) || 0;
      initial.gps = parseInt(manOptions.gps) || 0;
      initial.saltwaterPkg = parseInt(manOptions.saltwaterPkg) || 0;
      initial.propeller = parseInt(manOptions.propeller) || 0;
      initial.baseInst = parseInt(manOptions.baseInst) || 0;
      initial.cupHolder = parseInt(manOptions.cupHolder) || 0;
      initial.multiHolder = parseInt(manOptions.multiHolder) || 0;
      initial.cooler13 = parseInt(manOptions.cooler13) || 0;
      initial.coolerExtension = parseInt(manOptions.coolerExtension) || 0;
      initial.coolerBag14 = parseInt(manOptions.coolerBag14) || 0;
      initial.singleHolder = parseInt(manOptions.singleHolder) || 0;
      initial.stemwareHolder = parseInt(manOptions.stemwareHolder) || 0;
      initial.cargoBox10 = parseInt(manOptions.cargoBox10) || 0;
      initial.cargoBox20 = parseInt(manOptions.cargoBox20) || 0;
      initial.cargoBox30 = parseInt(manOptions.cargoBox30) || 0;
      initial.rodHolder = parseInt(manOptions.rodHolder) || 0;
      initial.batteryCharger = parseInt(manOptions.batteryCharger) || 0;
      initial.bowFillerBench = parseInt(manOptions.bowFillerBench) || 0;
      initial.portAquaLounger = parseInt(manOptions.portAquaLounger) || 0;
      initial.skiTowMirror = parseInt(manOptions.skiTowMirror) || 0;
      initial.boatEngineAndTrailerFees =
        parseFloat(modelData.boatEngineAndTrailerFees) || 0;
      initial.engineFreight = parseFloat(modelData.engineFreight) || 0;
      initial.enginePreRigPrice = parseFloat(modelData.enginePreRigPrice) || 0;
      initial.engineRigging = parseFloat(modelData.engineRigging) || 0;
      initial.nmma = parseFloat(modelData.nmma) || 0;
      initial.trailer = parseFloat(modelData.trailer) || 0;
    }

    if (brand === "Switch") {
      initial.baseInst = parseInt(manOptions.baseInst) || 0;
      initial.cupHolder = parseInt(manOptions.cupHolder) || 0;
      initial.multiHolder = parseInt(manOptions.multiHolder) || 0;
      initial.cooler13 = parseInt(manOptions.cooler13) || 0;
      initial.coolerExtension = parseInt(manOptions.coolerExtension) || 0;
      initial.coolerBag14 = parseInt(manOptions.coolerBag14) || 0;
      initial.singleHolder = parseInt(manOptions.singleHolder) || 0;
      initial.stemwareHolder = parseInt(manOptions.stemwareHolder) || 0;
      initial.cargoBox10 = parseInt(manOptions.cargoBox10) || 0;
      initial.cargoBox20 = parseInt(manOptions.cargoBox20) || 0;
      initial.cargoBox30 = parseInt(manOptions.cargoBox30) || 0;
      initial.rodHolder = parseInt(manOptions.rodHolder) || 0;
      initial.batteryCharger = parseInt(manOptions.batteryCharger) || 0;
      initial.bowFillerBench = parseInt(manOptions.bowFillerBench) || 0;
      initial.portAquaLounger = parseInt(manOptions.portAquaLounger) || 0;
      initial.skiTowMirror = parseInt(manOptions.skiTowMirror) || 0;
    }
  }
  const [formData, setFormData] = useState(initial);

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
    initial.battery + initial.propeller + initial.gps + initial.saltwaterPkg;

  motorTotal = initial.dts + initial.verado;

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

  maniTotal =
    modelSpecOpt +
    motorTotal +
    motorTotal +
    accTotal +
    optionsTotalMani +
    feesTotal;
  let panAmLacedWheels = formData.panAmTubelessLacedWheels || 0;
  let panAmAdpRide = formData.panAmAdpRide || 0;

  let hdWarrAmount = formData.hdWarrAmount || 0;
  // ----- calc ----- if anyone wants to check math, go for it matches td auto loan payments to the penny ---- !!! do not fix errors it will mess up the calculations !!!
  const hdAcc = panAmLacedWheels + panAmAdpRide + hdWarrAmount;
  const paintPrem = parseInt(formData.paintPrem.toString());
  const msrp = parseFloat(formData.msrp.toString());
  const accessories = parseFloat(formData.accessories.toString()) || 0;
  const totalLabour =
    parseFloat(formData.labour.toString()) *
    parseFloat(formData.userLabour.toString()) || 0;
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

  const numberOfMonths = parseInt(formData.months.toString());
  const msrp1 = (msrp * (100 - discountPer)) / 100;
  const manitouRandomFees = finance.brand === "Manitou" ? 475 : 0;

  let essentials = 0;

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
    hdAcc;

  if (brand === "Manitou") {
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
      maniTotal;
  }
  if (brand === "Switch") {
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
  if (brand === "BMW-Motorrad") {
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
    (discountPer === 0 ? parseInt(msrp) : parseInt(msrp1)) -
    parseInt(discount);

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
      parseInt(discount));

  const totalWithOptionsWithTax = (
    totalWithOptions *
    (parseFloat(deFees.userTax) / 100 + 1)
  ).toFixed(2);

  const licensing = parseInt(formData.licensing) + parseInt(formData.lien);
  const conversionOth = (parseFloat(othConv) / 100 + 1).toFixed(2);
  const othTax = conversionOth;

  const otherTax = (licensing + total * othTax).toFixed(2);
  // const onTax =  (total * (parseFloat(deFees.userTax) / 100 + 1)).toFixed(2)
  const native = (licensing + total).toFixed(2);
  const onTax = (
    licensing +
    total * (parseFloat(deFees.userTax) / 100 + 1)
  ).toFixed(2);
  const optionsTotal = total + options;
  const qcTax = (
    licensing +
    optionsTotal * (parseFloat(deFees.userTax) / 100 + 1)
  ).toFixed(2);
  const otherTaxWithOptions = (licensing + totalWithOptions * othTax).toFixed(
    2
  );

  const loanAmountON = parseFloat(onTax);
  const loanAmountQC = parseFloat(qcTax);
  const loanAmountNAT = parseFloat(native);
  const loadAmountNATWOptions = totalWithOptions;
  const loanAmountOther = parseFloat(otherTax) || 0;
  const loanAmountOtherOptions = parseFloat(otherTaxWithOptions) || 0;

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
  const on60 = parseFloat(
    (
      (monthlyInterestRate * loanPrincipalON) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))
    ).toFixed(2)
  );
  const biweekly = parseFloat(((on60 * 12) / 26).toFixed(2));
  const weekly = parseFloat(((on60 * 12) / 52).toFixed(2));

  // w/options
  const qc60 = parseFloat(
    (
      (monthlyInterestRate * loanPrincipalQC) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))
    ).toFixed(2)
  );
  const biweeklyqc = parseFloat(((qc60 * 12) / 26).toFixed(2));
  const weeklyqc = parseFloat(((qc60 * 12) / 52).toFixed(2));

  // no tax
  const nat60 = parseFloat(
    (
      (monthlyInterestRate * loanPrincipalNAT) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))
    ).toFixed(2)
  );
  const biweeklNat = parseFloat(((nat60 * 12) / 26).toFixed(2));
  const weeklylNat = parseFloat(((nat60 * 12) / 52).toFixed(2));

  // with options
  const nat60WOptions = parseFloat(
    (
      (monthlyInterestRate * loanPrincipalNATWOptions) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))
    ).toFixed(2)
  );
  const biweeklNatWOptions = parseFloat(((nat60WOptions * 12) / 26).toFixed(2));
  const weeklylNatWOptions = parseFloat(((nat60WOptions * 12) / 52).toFixed(2));

  // custom tax
  const oth60 = parseFloat(
    (
      (monthlyInterestRate * loanPrincipalOth) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))
    ).toFixed(2)
  );
  const biweekOth = parseFloat(((oth60 * 12) / 26).toFixed(2));
  const weeklyOth = parseFloat(((oth60 * 12) / 52).toFixed(2));

  // with options
  const oth60WOptions = parseFloat(
    (
      (monthlyInterestRate * loanPrincipalOthWOptions) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfMonths))
    ).toFixed(2)
  );
  const biweekOthWOptions = parseFloat(((oth60WOptions * 12) / 26).toFixed(2));
  const weeklyOthWOptions = parseFloat(((oth60WOptions * 12) / 52).toFixed(2));

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  if (!finance.model1) {
    const model1 = finance.model;
  }

  const [mainButton, setMainButton] = useState("payments");
  const [subButton, setSubButton] = useState("withoutOptions");
  const [desiredPayments, setDesiredPayments] = useState("");

  const handleMainButtonClick = (mainButton) => {
    setMainButton(mainButton);
  };

  const handleSubButtonClick = (subButton) => {
    setSubButton(subButton);
  };

  const paymentMapping = {
    payments: {
      withoutOptions: "Standard Payment",
      withOptions: "Payments with Options",
    },
    noTax: {
      withoutOptions: "No Tax Payment",
      withOptions: "No Tax Payment with Options",
    },
    customTax: {
      withoutOptions: "Custom Tax Payment",
      withOptions: "Custom Tax Payment with Options",
    },
  };

  useEffect(() => {
    if (
      mainButton in paymentMapping &&
      subButton in paymentMapping[mainButton]
    ) {
      setDesiredPayments(paymentMapping[mainButton][subButton]);
    } else {
      setDesiredPayments("");
    }
  }, [mainButton, subButton]);

  function getStateSizeInBytes(state) {
    const jsonString = JSON.stringify(state);
    const sizeInBytes = new TextEncoder().encode(jsonString).length;
    return sizeInBytes;
  }
  const [firstPage, setFirstPage] = useState(true);
  const [secPage, setSecPage] = useState(false);
  const [minForm, setMinForm] = useState("00");
  const [hourForm, setHourForm] = useState("09");

  function handleNextPage() {
    if (firstPage === true) {
      setFirstPage(false);
      setSecPage(true);
    }
    if (secPage === true) {
      setFirstPage(true);
      setSecPage(false);
    }
  }
  function handlePrevPage() {
    if (firstPage === true) {
      setFirstPage(false);
      setSecPage(true);
    }
    if (secPage === true) {
      setFirstPage(true);
      setSecPage(false);
    }
  }
  const isDate = (date) => !isNaN(date) && date instanceof Date;
  const date = new Date();
  const lockedValue = Boolean(true);

  function DealerOptionsAmounts() {
    return (
      <>
        <div className="mr-1 mt-1 flex items-center justify-between">
          <div>
            <IndeterminateCheckbox
              id="userServicespkg"
              name="userServicespkg"
              checked={formData.userServicespkg !== 0}
              className={`form-checkbox  ${formData.userServicespkg !== 0 ? "checked:bg-gray-500" : ""
                }`}
              onChange={(e) => {
                const { name, checked } = e.target;
                const newValue = checked
                  ? parseFloat(deFees.userServicespkg)
                  : 0; // Use the correct variable name here
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [name]: newValue,
                }));
              }}
            />
            <label className="ml-2 text-[#8a8a93]">Service Packages</label>
          </div>
          <p>${formData.userServicespkg}</p>
        </div>
        <div className="mr-1 mt-1 flex items-center justify-between">
          <div>
            <IndeterminateCheckbox
              id="userExtWarr"
              name="userExtWarr"
              checked={formData.userExtWarr !== 0}
              className={`form-checkbox  ${formData.userExtWarr !== 0 ? "checked:bg-gray-500" : ""
                }`}
              onChange={(e) => {
                const { name, checked } = e.target;
                const newValue = checked ? parseFloat(deFees.userExtWarr) : 0; // Use the correct variable name here
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [name]: newValue,
                }));
              }}
            />

            <label className="ml-2 text-[#8a8a93]">Extended Warranty</label>
          </div>
          <p>${formData.userExtWarr}</p>
        </div>
        <div className="mr-1 mt-1 flex items-center justify-between">
          <div>
            <IndeterminateCheckbox
              id="vinE"
              name="vinE"
              checked={formData.vinE !== 0}
              className={`form-checkbox  ${formData.vinE !== 0 ? "checked:bg-gray-500" : ""
                }`}
              onChange={(e) => {
                const { name, checked } = e.target;
                const newValue = checked ? parseFloat(deFees.vinE) : 0; // Use the correct variable name here
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [name]: newValue,
                }));
              }}
            />
            <label className="ml-2 text-[#8a8a93]">Vin Etching</label>
          </div>
          <p>${formData.vinE}</p>
        </div>
        <div className="mr-1 mt-1 flex items-center justify-between">
          <div>
            <IndeterminateCheckbox
              id="rustProofing"
              name="rustProofing"
              checked={formData.rustProofing !== 0}
              className={`form-checkbox  ${formData.rustProofing !== 0 ? "checked:bg-gray-500" : ""
                }`}
              onChange={(e) => {
                const { name, checked } = e.target;
                const newValue = checked ? parseFloat(deFees.rustProofing) : 0; // Use the correct variable name here
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [name]: newValue,
                }));
              }}
            />
            <label className="ml-2 text-[#8a8a93]">Under Coating</label>
          </div>
          <p>${formData.rustProofing}</p>
        </div>
        <div className="mr-1 mt-1 flex items-center justify-between">
          <div>
            <IndeterminateCheckbox
              id="userGap"
              name="userGap"
              checked={formData.userGap !== 0}
              className={`form-checkbox  ${formData.userGap !== 0 ? "checked:bg-gray-500" : ""
                }`}
              onChange={(e) => {
                const { name, checked } = e.target;
                const newValue = checked ? parseFloat(deFees.userGap) : 0; // Use the correct variable name here
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [name]: newValue,
                }));
              }}
            />
            <label className="ml-2 text-[#8a8a93]">Gap Insurance</label>
          </div>
          <p>${formData.userGap}</p>
        </div>
        <div className="mr-1 mt-1 flex items-center justify-between">
          <div>
            <IndeterminateCheckbox
              id="userLoanProt"
              name="userLoanProt"
              checked={formData.userLoanProt !== 0}
              className={`form-checkbox  ${formData.userLoanProt !== 0 ? "checked:bg-gray-500" : ""
                }`}
              onChange={(e) => {
                const { name, checked } = e.target;
                const newValue = checked ? parseFloat(deFees.userLoanProt) : 0; // Use the correct variable name here
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [name]: newValue,
                }));
              }}
            />
            <label className="ml-2 text-[#8a8a93]">Loan Protection</label>
          </div>
          <p>${formData.userLoanProt}</p>
        </div>
        <div className="mr-1 mt-1 flex items-center justify-between">
          <div>
            <IndeterminateCheckbox
              id="userTireandRim"
              name="userTireandRim"
              checked={formData.userTireandRim !== 0}
              className={`form-checkbox  ${formData.userTireandRim !== 0 ? "checked:bg-gray-500" : ""
                }`}
              onChange={(e) => {
                const { name, checked } = e.target;
                const newValue = checked
                  ? parseFloat(deFees.userTireandRim)
                  : 0; // Use the correct variable name here
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [name]: newValue,
                }));
              }}
            />
            <label className="ml-2 text-[#8a8a93]">Tire and Rim Prot.</label>
          </div>
          <p> ${formData.userTireandRim} </p>
        </div>
        <div className="mb-3 mr-1 mt-1 flex items-center justify-between">
          <div>
            <IndeterminateCheckbox
              id="lifeDisability"
              name="lifeDisability"
              checked={formData.lifeDisability !== 0}
              className={`form-checkbox ${formData.lifeDisability !== 0 ? "checked:bg-gray-500" : ""
                }`}
              onChange={(e) => {
                const { name, checked } = e.target;
                const newValue = checked
                  ? parseFloat(deFees.lifeDisability)
                  : 0; // Use the correct variable name here
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [name]: newValue,
                }));
              }}
            />
            <label className="ml-2 text-[#8a8a93]">Life and Disability</label>
          </div>
          <p>${formData.lifeDisability}</p>
        </div>
      </>
    );
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
  let today3 = new Date().toISOString();
  const nextAppt = today2.setHours(today2.getHours() + 24);

  useEffect(() => {
    const button = document.getElementById("myButton");
    const button2 = document.getElementById("myButton2");
    const button3 = document.getElementById("myButton3");
    const button4 = document.getElementById("myButton4");
    const button5 = document.getElementById("myButton5");
    const button6 = document.getElementById("button6");
    if (button5) {
      button5.addEventListener("mousedown", function () {
        this.style.transform = "translateY(1.5px)";
      });

      button5.addEventListener("mouseup", function () {
        this.style.transform = "translateY(-1.5px)";
      });
    }
    if (button) {
      button.addEventListener("mousedown", function () {
        this.style.transform = "translateY(1.5px)";
      });

      button.addEventListener("mouseup", function () {
        this.style.transform = "translateY(-1.5px)";
      });
    }
    if (button2) {
      button2.addEventListener("mousedown", function () {
        this.style.transform = "translateY(1.5px)";
      });

      button2.addEventListener("mouseup", function () {
        this.style.transform = "translateY(-1.5px)";
      });
    }
    if (button3) {
      button3.addEventListener("mousedown", function () {
        this.style.transform = "translateY(1.5px)";
      });

      button3.addEventListener("mouseup", function () {
        this.style.transform = "translateY(-1.5px)";
      });
    }
    if (button4) {
      button4.addEventListener("mousedown", function () {
        this.style.transform = "translateY(1.5px)";
      });

      button4.addEventListener("mouseup", function () {
        this.style.transform = "translateY(-1.5px)";
      });
    }
    if (button6) {
      button6.addEventListener("mousedown", function () {
        this.style.transform = "translateY(1.5px)";
      });

      button6.addEventListener("mouseup", function () {
        this.style.transform = "translateY(-1.5px)";
      });
    }
  }, []);
  const submit = useSubmit();
  const [value, setValue] = React.useState("");
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
  const customEmails = [
    {
      value: "Send Payments Custom",
      label: "Send Payments",
      template: "justPaymentsCustom",
      financeId: finance.id,
      desiredPayments: finance.desiredPayments,
    },
    {
      value: "Full Breakdown Custom",
      label: "Full Breakdown",
      template: "fullBreakdownCustom",
      financeId: finance.id,
      desiredPayments: finance.desiredPayments,
    },
    {
      value: "Full Breakdown W/ Options Custom",
      label: "Full Breakdown W/ Options",
      template: "FullBreakdownWOptionsCustom",
      financeId: finance.id,
      desiredPayments: finance.desiredPayments,
    },
  ];
  const [openEmail, setOpenEmail] = useState(false);
  const [emailLabel, setEmailLabel] = useState('');
  const [emailDesiredPayments, setEmailDesiredPayments] = useState('');
  const [emailFinanceId, setEmailFinanceId] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [body, setBody] = useState('');

  const [emailFormData, setEmailFormData] = useState({
    modelData: modelData,
    deFees: deFees,
    body: body,
    finance: finance,
    user: user,
  });


  const [valueCal, onChange] = useState<Value>(new Date());
  const [dateCal, setDate] = React.useState<Date>("");
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  const [hour, setHour] = useState(currentHour);
  const [min, setMin] = useState(currentMinute);
  const [secs, setSecs] = useState(currentSecond);
  const currentTime = `${hour}:${min}:${currentSecond}`;
  console.log(`Current time is `, currentTime);
  const time = `${hour}:${min}:00`;

  const [saved, setSaved] = useState(false);

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
    }
    if (template === "justPaymentsCustom" || template === "fullBreakdownCustom" || template === "FullBreakdownWOptionsCustom") {
      console.log(newValue, template, 'custom emails')

      setOpenEmail(true);
    }
    if (template === 'Custom-Templated-Emails') {
      return null
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

  return (
    <div className="">
      <div className="mx-auto mb-10 mt-10">
        <Card className=" mx-auto w-[550px] rounded-md text-[#fafafa]">
          <CardHeader className="t-rounded-md flex flex-row items-start bg-[#18181a]">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Payment Calculator
              </CardTitle>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <Select
                //disabled={saved === false}
                onValueChange={(value) => {
                  setOpen(false);
                  console.log("click");
                  //const customEmail = customEmails.find((email) => email.value === value);
                  const selectedFramework = email.find((framework) => framework.value === value);

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

                  }
                  if (selectedFramework.template === "justPaymentsCustom" || selectedFramework.template === "fullBreakdownCustom" || selectedFramework.template === "FullBreakdownWOptionsCustom") {
                    console.log(selectedFramework, 'customEmail')
                    setOpenEmail(true);
                  }

                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select email..." />
                </SelectTrigger>
                <SelectContent className='bg-[#18181a] text-[#fafafa] border-[#262626]'>
                  <SelectGroup>
                    <SelectLabel>Emails</SelectLabel>
                    {email.map((framework) => (
                      <SelectItem className="cursor-pointer   rounded-md  hover:bg-[#232324]" key={framework.value} value={framework.value}>
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
                <DropdownMenuContent align="end" className="   w-[90%] rounded-md bg-[#232324] text-[#fafafa] border-[#262626]"                >
                  <Button onClick={() => setOpenTemplate(true)} variant='ghost' >
                    <DropdownMenuItem className=" w-[90%] cursor-pointer rounded-md  text-[#fafafa] hover:bg-[#232324]">
                      Inspect Templated Emails
                    </DropdownMenuItem>
                  </Button>
                  <a
                    className="mx-auto w-[90%]"
                    href="/dealer/leads/sales/dashboard"
                    target="_blank"
                  >
                    <DropdownMenuItem className=" w-[90%] cursor-pointer rounded-md border-[#27272a] bg-[#18181a] text-[#fafafa] hover:bg-[#232324]">
                      Dashboard
                    </DropdownMenuItem>
                  </a>
                  <a
                    className="mx-auto w-[90%]"
                    href={`/dealer/customer/${finance.clientfileId}/${finance.id}`}
                    target="_blank"
                  >
                    <DropdownMenuItem className=" w-[90%] cursor-pointer rounded-md border-[#27272a] bg-[#18181a] text-[#fafafa] hover:bg-[#232324]">
                      Client File
                    </DropdownMenuItem>
                  </a>
                  <DropdownMenuSeparator />
                  <Form method="post">
                    <DropdownMenuItem
                      className=" w-[90%] cursor-pointer rounded-md border-[#27272a] bg-[#18181a] text-[#fafafa] hover:bg-[#232324]"
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
                  <DropdownMenuItem className=" cursor-pointer border-[#27272a] bg-[#18181a] text-[#fafafa] hover:bg-[#232324]">
                    <PrintSpec />
                  </DropdownMenuItem>
                  <DropdownMenuItem className=" cursor-pointer border-[#27272a] bg-[#18181a] text-[#fafafa] hover:bg-[#232324]">
                    <ModelPage />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <Form method="post">
            {secPage && (
              <>
                <CardContent className="bg-[#09090b] p-6 text-sm">
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
                            className="h-8 w-20 border-[#27272a] bg-[#09090b] text-right "
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
                              className="mt-2 h-8 w-20 items-end justify-end  border-[#27272a] bg-[#09090b] text-right "
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
                              className="mt-2 h-8 w-20 items-end justify-end  border-[#27272a] bg-[#09090b] text-right "
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
                              className="mt-2 h-8 w-20 items-end justify-end  border-[#27272a]  bg-[#09090b] text-right "
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
                              className="mt-2 h-8 w-20 items-end justify-end  border-[#27272a] bg-[#09090b] text-right "
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
                            className="h-8 w-20 border-[#27272a] bg-[#09090b] text-right "
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
                            className="h-8 w-20 border-[#27272a] bg-[#09090b] text-right "
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
                            className="ml-auto mt-2 h-8 w-20  justify-end border-[#27272a] bg-[#09090b] text-right "
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
                  <hr className="mx-auto my-4 w-[95%] text-[#27272a]" />
                  <div className="font-semibold">Standard Terms</div>
                  <div className="my-4">
                    <div className="main-button-group flex justify-between ">
                      <Badge
                        id="myButton"
                        className={`button  transform cursor-pointer bg-[#02a9ff]  shadow hover:text-[#fafafa]  ${mainButton === "payments"
                          ? "active bg-[#c72323] text-[#fafafa]"
                          : "bg-[#0a0a0a] text-[#fafafa]"
                          }`}
                        onClick={() => handleMainButtonClick("payments")}
                      >
                        Payments
                      </Badge>

                      <Badge
                        id="myButton1"
                        className={`button  transform cursor-pointer bg-[#02a9ff] shadow   hover:text-[#fafafa] ${mainButton === "noTax"
                          ? "active bg-[#c72323] text-[#fafafa] "
                          : "bg-[#0a0a0a] text-[#fafafa]"
                          }`}
                        onClick={() => handleMainButtonClick("noTax")}
                      >
                        No Tax
                      </Badge>

                      <Badge
                        id="myButton2"
                        className={`button  transform cursor-pointer bg-[#02a9ff]   shadow hover:text-[#fafafa] ${mainButton === "customTax"
                          ? "active bg-[#c72323] text-[#fafafa]"
                          : "bg-[#0a0a0a] text-[#fafafa]"
                          }`}
                        onClick={() => handleMainButtonClick("customTax")}
                      >
                        Custom Tax
                      </Badge>
                    </div>
                    <div className="sub-button-group mt-2 flex justify-between">
                      <Badge
                        id="myButton3"
                        className={`button  transform cursor-pointer bg-[#02a9ff] shadow hover:text-[#fafafa] ${subButton === "withoutOptions"
                          ? "active bg-[#c72323] text-[#fafafa]"
                          : "bg-[#0a0a0a] text-[#fafafa]"
                          }`}
                        onClick={() => handleSubButtonClick("withoutOptions")}
                      >
                        W/O Options
                      </Badge>

                      <Badge
                        id="myButton5"
                        className={`button  transform cursor-pointer bg-[#02a9ff]  shadow hover:text-[#fafafa]  ${subButton === "withOptions"
                          ? "active bg-[#c72323] text-[#fafafa]"
                          : "bg-[#0a0a0a] text-[#fafafa]"
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
                              className="h-8 w-20 border-[#27272a] bg-[#09090b] text-right "
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

                  <hr className="mx-auto my-4 w-[95%] text-[#27272a]" />
                  <div className="font-semibold">Contract Variables</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-[#8a8a93]">Term</span>
                      <span>
                        <Input
                          className="h-8 w-20 border-[#27272a] bg-[#09090b] text-right "
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
                          className="h-8 w-20 items-end justify-end border-[#27272a] bg-[#09090b] text-right  "
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
                          className="h-8 w-20 border-[#27272a] bg-[#09090b] text-right "
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
                          className="ml-auto h-8 w-20 border-[#27272a] bg-[#09090b] text-right "
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
                          className="h-8 w-20 border-[#27272a] bg-[#09090b] text-right "
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

                  <hr className="mx-auto my-4 w-[95%] text-[#27272a]" />
                  <div className="font-semibold">
                    Customer Detail Confirmation
                  </div>
                  <div className="mx-3 mb-3 grid grid-cols-2 justify-between gap-3">
                    <div className="relative mt-5">
                      <Input
                        defaultValue={formData.firstName}
                        name="firstName"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        First Name
                      </label>
                    </div>
                    <div className="relative mt-5">
                      <Input
                        defaultValue={formData.lastName}
                        name="lastName"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Last Name
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Input
                        defaultValue={finance.phone}
                        name="phone"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Phone
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Input
                        defaultValue={finance.email}
                        name="email"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Email
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Input
                        defaultValue={finance.address}
                        name="address"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Address
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Input
                        defaultValue={finance.city}
                        name="city"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        City
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Input
                        defaultValue={finance.province}
                        name="province"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Province
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Input
                        defaultValue={finance.postal}
                        name="postal"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Postal Code
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Input
                        defaultValue={finance.dl}
                        name="dl"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Drivers Lic.
                      </label>
                    </div>
                  </div>
                  <div className="mx-3 mb-3 grid grid-cols-2 justify-between gap-3">
                    <div className="relative mt-3">
                      <Select name="timeToContact">
                        <SelectTrigger className="w-full  border border-[#27272a] bg-[#09090b] text-[#fafafa]">
                          <SelectValue defaultValue={finance.timeToContact} />
                        </SelectTrigger>
                        <SelectContent className=" border border-[#27272a] bg-[#09090b] text-[#fafafa]">
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
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Prefered Time To Be Contacted
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Select name="typeOfContact">
                        <SelectTrigger className="w-full  border border-[#27272a] bg-[#09090b] text-[#fafafa]">
                          <SelectValue defaultValue={finance.typeOfContact} />
                        </SelectTrigger>
                        <SelectContent className=" border border-[#27272a] bg-[#09090b] text-[#fafafa]">
                          <SelectGroup>
                            <SelectLabel>Contact Method</SelectLabel>
                            <SelectItem value="Phone">Phone</SelectItem>
                            <SelectItem value="InPerson">In-Person</SelectItem>
                            <SelectItem value="SMS">SMS</SelectItem>
                            <SelectItem value="Email">Email</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Prefered Type To Be Contacted
                      </label>
                    </div>

                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative mt-3">
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start  text-center  font-normal",
                              !dateCal && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 " />
                            {dateCal ? (
                              format(dateCal, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                          <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                            Pick A Date
                          </label>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto bg-white p-0 text-black"
                        align="start"
                      >
                        <Calendar
                          className="bg-white text-black"
                          mode="single"
                          selected={dateCal}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <input
                      type="hidden"
                      value={String(dateCal)}
                      name="pickedDate"
                    />

                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="relative mt-3">
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-right font-normal",
                              !dateCal && "text-muted-foreground"
                            )}
                          >
                            <ClockIcon className="mr-2 h-4 w-4 " />
                            {currentTime ? time : <span>Pick a Time</span>}
                          </Button>
                          <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                            Pick A Time
                          </label>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto bg-white p-0 text-black"
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
                            <SelectContent className="bg-white text-black">
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
                            <SelectContent className="bg-white text-black">
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

                  <hr className="mx-auto my-4 w-[95%] text-[#27272a]" />
                  <div className="font-semibold">Trade Information</div>
                  <div className="mx-3 mb-3 grid grid-cols-2 justify-between gap-3">
                    <div className="relative mt-5">
                      <Input
                        defaultValue={finance.tradeYear}
                        name="tradeYear"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Year
                      </label>
                    </div>
                    <div className="relative mt-5">
                      <Input
                        defaultValue={finance.tradeMake}
                        name="tradeMake"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Make
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Input
                        defaultValue={finance.tradeDesc}
                        name="tradeDesc"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Model
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Input
                        defaultValue={finance.tradeColor}
                        name="tradeColor"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Color
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Input
                        defaultValue={finance.tradeVin}
                        name="tradeVin"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        VIN
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Input
                        defaultValue={finance.tradeMileage}
                        name="tradeMileage"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
                        Mileage
                      </label>
                    </div>
                    <div className="relative mt-3">
                      <Input
                        defaultValue={finance.tradeLocation}
                        name="tradeLocation"
                        type="text"
                        className="w-full border-[#27272a] bg-[#09090b] "
                      />
                      <label className=" peer-placeholder-shown:text-gray-400 peer-focus:text-blue-500 absolute -top-3 left-3 rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-focus:-top-3">
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
                    <DrawerContent className="bg-[#09090b] text-[#fafafa]">
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
                                className="h-8 w-20 border-[#27272a] bg-[#09090b] text-right "
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
                                className="h-8 w-20 border-[#27272a] bg-[#09090b] text-right "
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
                                className="h-8 w-20 border-[#27272a] bg-[#09090b] text-right "
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
                                className="h-8 w-20 border-[#27272a] bg-[#09090b] text-right "
                                name="lien"
                                id="lien"
                                autoComplete="lien"
                                defaultValue={lien}
                                onChange={handleChange}
                              />
                            </span>
                          </li>
                        </ul>

                        <DrawerFooter>
                          <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </div>
                    </DrawerContent>
                  </Drawer>
                  <hr className="mx-auto my-4 w-[95%] text-[#27272a]" />
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
                <CardContent className="bg-[#09090b] p-6  text-sm">
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
                    <hr className="mx-auto my-4 w-[95%] text-[#27272a]" />
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
                    <hr className="mx-auto my-4 w-[95%] text-[#27272a]" />
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
                  <hr className="mx-auto my-4 w-[95%] text-[#27272a]" />
                  <div className="font-semibold">Standard Terms</div>
                  <div className="mt-3">
                    <div className="main-button-group flex justify-between ">
                      <Badge
                        id="myButton"
                        className={`button  transform cursor-pointer bg-[#02a9ff]  shadow hover:text-[#fafafa]  ${mainButton === "payments"
                          ? "active bg-[#c72323] text-[#fafafa]"
                          : "bg-[#0a0a0a] text-[#fafafa]"
                          }`}
                        onClick={() => handleMainButtonClick("payments")}
                      >
                        Payments
                      </Badge>

                      <Badge
                        id="myButton1"
                        className={`button  transform cursor-pointer bg-[#02a9ff] shadow   hover:text-[#fafafa] ${mainButton === "noTax"
                          ? "active bg-[#c72323] text-[#fafafa] "
                          : "bg-[#0a0a0a] text-[#fafafa]"
                          }`}
                        onClick={() => handleMainButtonClick("noTax")}
                      >
                        No Tax
                      </Badge>

                      <Badge
                        id="myButton2"
                        className={`button  transform cursor-pointer bg-[#02a9ff]   shadow hover:text-[#fafafa] ${mainButton === "customTax"
                          ? "active bg-[#c72323] text-[#fafafa]"
                          : "bg-[#0a0a0a] text-[#fafafa]"
                          }`}
                        onClick={() => handleMainButtonClick("customTax")}
                      >
                        Custom Tax
                      </Badge>
                    </div>
                    <div className="sub-button-group mt-2 flex justify-between">
                      <Badge
                        id="myButton3"
                        className={`button  transform cursor-pointer bg-[#02a9ff] shadow hover:text-[#fafafa] ${subButton === "withoutOptions"
                          ? "active bg-[#c72323] text-[#fafafa]"
                          : "bg-[#0a0a0a] text-[#fafafa]"
                          }`}
                        onClick={() => handleSubButtonClick("withoutOptions")}
                      >
                        W/O Options
                      </Badge>

                      <Badge
                        id="myButton5"
                        className={`button  transform cursor-pointer bg-[#02a9ff]  shadow hover:text-[#fafafa]  ${subButton === "withOptions"
                          ? "active bg-[#c72323] text-[#fafafa]"
                          : "bg-[#0a0a0a] text-[#fafafa]"
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

                  <hr className="mx-auto my-4 w-[95%] text-[#27272a]" />
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

                  <hr className="mx-auto my-4 w-[95%] text-[#27272a]" />
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
            <Input type="hidden" defaultValue={outletSize} name="sliderWidth" />
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
                  className="mb-5 mr-5   mt-5 w-auto cursor-pointer bg-[#dc2626]"
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
          <CardFooter className="b-rounded-md  flex flex-row items-center border-t border-[#27272a] bg-[#18181a] px-6  py-3">
            <div className="text-xs text-[#18181a]">
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
            <DialogContent className=" max-w-[700px] w-[650px]  gap-0 border-[#27272a] p-0 text-[#fafafa] outline-none mx-auto">

              <DialogHeader className="px-4 pb-4 pt-5">
                <DialogTitle>
                  Sending {emailLabel && emailLabel} w/{" "}
                  {emailDesiredPayments && emailDesiredPayments}
                </DialogTitle>
              </DialogHeader>
              <hr className="mx-auto my-3 w-[98%] text-[#27272a]" />
              <div className="mx-3 mb-3 grid gap-3">
                <div className="relative mt-3">

                  <TextArea
                    name="body"
                    defaultValue={formData.body}
                    className="w-full border-[#27272a] bg-[#09090b] "
                    onChange={handleChange}
                  />
                  <label className=" absolute -top-3 left-3  rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">
                    Email Message
                  </label>

                </div>
              </div>
              <div>
                <div className="relative mt-4">
                  <EmailPreview modelData={modelData} finance={finance} user={user} formData={formData} />
                  <label className=" absolute -top-3 left-3  rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">
                    Email Preview
                  </label>
                </div>
              </div>
              <DialogFooter className=" border-t border-[#27272a] p-4  ">
                <div className="flex justify-center">
                  <Button
                    size="icon"
                    type="submit"
                    onClick={() => {
                      toast.success(`Email sent!`);
                      SubmitTheSecondForm();
                      // SubmitTheForm( );

                    }}
                    className="ml-auto bg-[#dc2626] "
                  >
                    <PaperPlaneIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </DialogFooter>

            </DialogContent>
          </Dialog>
          <Dialog open={openTemplate} onOpenChange={setOpenTemplate}>
            <DialogContent className=" emailDialog gap-0 border-[#27272a] p-0 text-[#fafafa] outline-none ">
              <DialogHeader className="px-4 pb-4 pt-5">
                <DialogTitle>
                  Preview Email Templates
                </DialogTitle>
              </DialogHeader>
              <hr className="mx-auto my-3 w-[98%] text-[#27272a]" />
              <div>
                <div className="relative mt-4">
                  <TemplatePreview finance={finance} modelData={modelData} deFees={deFees} user={user} formData={formData} />
                  <label className=" absolute -top-3 left-3  rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">
                    Email Preview
                  </label>
                </div>
              </div>
              <hr className="mx-auto my-3 w-[98%] text-[#27272a]" />
              <div>
                <div className="relative mt-4">
                  <TemplatePreviewTwo finance={finance} modelData={modelData} deFees={deFees} user={user} />
                  <label className=" absolute -top-3 left-3  rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">
                    Email Preview
                  </label>
                </div>
              </div>
              <hr className="mx-auto my-3 w-[98%] text-[#27272a]" />
              <div>
                <div className="relative mt-4"> finance,

                  <TemplatePreviewThree finance={finance} modelData={modelData} deFees={deFees} user={user} />
                  <label className=" absolute -top-3 left-3  rounded-full bg-[#09090b] px-2 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-[#909098] peer-focus:-top-3 peer-focus:text-[#909098]">
                    Email Preview
                  </label>
                </div>
              </div>
              <DialogFooter className=" border-t border-[#27272a] p-4  ">
                <DialogClose className="flex justify-center">
                  <Button size="icon" className="ml-auto bg-[#dc2626] "  >
                    <X className="ml-2 h-4 w-4" />
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div >
  );
}

export default function Quote() {
  const { sliderWidth, newLook } = useLoaderData();
  const [outletSize, setOutletSize] = useState(sliderWidth);
  console.log(sliderWidth, outletSize, "sliderWidth in function");
  const handleSliderChange = (event) => {
    const newSize = `${event.target.value}%`;
    setOutletSize(newSize);
  };
  console.log(sliderWidth);
  return (
    <>
      <div
        className={`mb-10 mt-[50px] flex  h-[100vh] min-h-screen px-4 sm:px-6 lg:px-8 ${newLook === true
          ? "bg-[#09090b] text-[#fafafa]"
          : "bg-slate1 text-black"
          }`}
      >
        <div className="w-full  rounded-lg">
          <div className="mx-auto my-auto md:flex">
            <div className="mx-auto my-auto">
              <div className="mx-auto my-auto ">
                <Overview outletSize={outletSize} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
