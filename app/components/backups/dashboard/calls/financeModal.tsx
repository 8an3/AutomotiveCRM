import React, { HTMLAttributes, HTMLProps, useState, useEffect } from 'react'
import { Form, Link, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import {
  Input,
  Separator,
  PopoverTrigger,
  PopoverContent,
  Popover,
  DropdownMenuLabel,
  TextArea,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Button,
  ScrollArea,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "~/components/ui/index";
import { Flex, Text, Button as RadixButton, Checkbox } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';

import { toast } from "sonner"
import { Table as Table2, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "~/components/ui/table"
import ManitouOptions from '~/routes/overviewUtils/manitouOptions'

// dashboard
import { dashboardAction, dashboardLoader } from "~/components/actions/dashboardCalls";
import { CalendarCheck, Search, Landmark } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import * as Dialog from '@radix-ui/react-dialog';

// <Sidebar />
import * as Tooltip from '@radix-ui/react-tooltip';
import DealerFeesDisplay from '~/routes/overviewUtils/dealerFeesDisplay'
import BMWOptions from '~/routes/overviewUtils/bmwOptions'
import { quotebrandIdActionLoader } from '~/components/actions/quote$brandIdAL'
import LogCall from "./logCall"
import EmailClient from "./emailClient"
import Logtext from "./logText"


export let loader = quotebrandIdActionLoader

export let action = dashboardAction


export function FinanceModal(data) {
  const { deFees, manOptions, bmwMoto, bmwMoto2, user, records } = useLoaderData()
  const finance = data.data
  const modelData = data.data
  const [selectedRowData, setSelectedRowData] = React.useState([]);
  //const [finance, setFinance] = useState(selectedRowData);
  ///console.log(data, 'data1234')
  const errors = useActionData() as Record<string, string | null>;


  const [brandId, setBrandId] = useState('');

  const [open, setOpen] = React.useState(false);

  // console.log(data, selectedRowData)
  useEffect(() => {
    setSelectedRowData(data)
  }, []);


  const [edit, setEdit] = useState(false);
  const toggleColumns = () => {
    //setEdit((prev) => !prev);
    if (edit === true) {
      setEdit(false)
    }
    if (edit === false) {
      setEdit(true)
    }
  };

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
  //  console.log(selectedRowData, selectedRowData.original, 'selectedRowData')
  const brand = brandId
  // console.log(finance, 'finance leads finance')
  const [copiedText, setCopiedText] = useState('');
  const initial = {
    userLabour: parseInt(deFees.userLabour) || 0,
    accessories: parseFloat(finance.accessories) || 0,
    labour: parseInt(finance.labour) || 0,
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
    paintPrem: parseInt(finance.paintPrem) || 0,
    modelCode: finance.modelCode || null,
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
    deposit: parseInt(finance.deposit) || 0,
    discount: parseInt(finance.discount) || 0,
    iRate: parseInt(finance.iRate) || 0,
    months: parseInt(finance.months) || 0,
    discountPer: parseInt(finance.discountPer) || 0,
    biweeklyqc: parseInt(finance.biweeklyqc) || 0,
    weeklyqc: parseInt(finance.weeklyqc) || 0,
    biweeklNat: parseInt(finance.biweeklNat) || 0,
    weeklylNat: parseInt(finance.weeklylNat) || 0,
    biweekOth: parseInt(finance.biweekOth) || 0,
    weeklyOth: parseInt(finance.weeklyOth) || 0,
    othTax: parseInt(finance.othTax) || 0,
    firstName: finance.firstName,
    lastName: finance.lastName,
    panAmAdpRide: 0,
    panAmTubelessLacedWheels: 0,
    hdWarrAmount: 0,
  };
  const [formData, setFormData] = useState(initial)

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
                <div key={option} className="mt-2 flex justify-between">
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
          <div className='xs:grid xs:grid-cols-1 mt-3 flex justify-between'>
            <select value={selectedType} onChange={handleTypeChange}
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
              <select value={selectedOption} onChange={handleOptionChange}
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
              <select value={selectedYear} onChange={handleYearChange}
                className="text-gray-600 placeholder-blue-300 ml-2 mr-2 rounded border-0 bg-white px-3 py-3 text-sm shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
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
                <p>H-D ESP FOR {selectedType} model family, {selectedOption} for {selectedYear} is only:
                  ${formData.hdWarrAmount}</p>
                <p className='mt-2'> Difference is only ${difference}</p>
              </>
            )}
            {selectedOption === 'W/O Tire and Rim' && difference2 < 2 && (
              <>
                <p> {selectedType}, {selectedOption} for {selectedYear} The amount is: ${formData.hdWarrAmount}</p>
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

  function DealerOptionsAmounts() {
    return (
      <>
        <>
          <div className="flex items-center justify-between">
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
              <p className="mr-4">Service Packages </p>
            </div>
            <p>${formData.userServicespkg}</p>
          </div>
          <div className="flex items-center justify-between">
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
          <div className="flex items-center justify-between">
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
          <div className="flex items-center justify-between">
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
          <div className="flex items-center justify-between">
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
          <div className="flex items-center justify-between">
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
          <div className="flex items-center justify-between">
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
              <p className="mr-4"> Tire and Rim Protection </p>
            </div>
            <p> ${formData.userTireandRim} </p>
          </div>
          <div className="flex items-center justify-between">
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


  let motorTotal = 0;
  let optionsTotalMani = 0;
  let feesTotal = 0;
  let accTotal = 0;
  let modelSpecOpt = 0;
  let maniTotal = 0;
  let bmwTotal = 0;
  let totalSum = 0;

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

  const licensing = parseInt(formData.licensing.toString())
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

  const loanPrincipalON = loanAmountON - downPayment;
  const loanPrincipalQC = loanAmountQC - downPayment;

  const loanPrincipalNAT = loanAmountNAT - downPayment;
  const loanPrincipalNATWOptions = loadAmountNATWOptions - downPayment;

  const loanPrincipalOth = loanAmountOther - downPayment;
  const loanPrincipalOthWOptions = loanAmountOtherOptions - downPayment;

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
  // console.log(data, 'fuck')
  function ClientDetailsFunction() {
    const ClientDetails = [
      { name: "stockNumber", value: data.data.stockNum, placeHolder: "Stock Number" },
      { name: "year", value: data.data.year, placeHolder: "Year" },
      { name: "make", value: data.data.brand, placeHolder: "Make" },
      { name: "model", value: data.data.model, placeHolder: "Model" },
      { name: "modelName", value: data.data.modelName, placeHolder: "Model Name" },
      { name: "model2", value: data.data.model1, placeHolder: "Model" },
      { name: "submodel", value: data.data.submodel, placeHolder: "Submodel" },
      { name: "price", value: data.data.msrp, placeHolder: "Price" },
      { name: "exteriorColor", value: data.data.color, placeHolder: "Exterior Color" },
      { name: "mileage", value: data.data.mileage, placeHolder: "Mileage" },
      { name: "onOrder", value: data.data.onOrder, placeHolder: "On Order" },
      { name: "expectedOn", value: data.data.expectedOn, placeHolder: "Expected On" },
      { name: "status", value: data.data.status, placeHolder: "Status" },
      { name: "orderStatus", value: data.data.orderStatus, placeHolder: "Order Status" },
      { name: "vin", value: data.data.vin, placeHolder: "VIN" },
      { name: "age", value: data.data.age, placeHolder: "Age" },
      { name: "location", value: data.data.location, placeHolder: "Location" },
      { name: "isNew", value: data.data.isNew, placeHolder: "Is New" },
      { name: "keyNumber", value: data.data.keyNumber, placeHolder: "Key Number" },
      { name: "sold", value: data.data.sold, placeHolder: "Sold" },
    ];
    return ClientDetails;
  }
  function ClientDetailsFunction2() {
    const ClientDetails = [
      { name: "floorPlanDueDate", value: data.data.floorPlanDueDate, placeHolder: "floorPlanDueDate" },
      { name: "packageNumber", value: data.data.packageNumber, placeHolder: "packageNumber" },
      { name: "packagePrice", value: data.data.packagePrice, placeHolder: "packagePrice" },
      { name: "type", value: data.data.type, placeHolder: "type" },
      { name: "class", value: data.data.class, placeHolder: "class" },
      { name: "hdcFONumber", value: data.data.hdcFONumber, placeHolder: "hdcFONumber" },
      { name: "consignment", value: data.data.consignment, placeHolder: "consignment" },
      { name: "hdmcFONumber", value: data.data.hdmcFONumber, placeHolder: "hdmcFONumber" },
      { name: "stocked", value: data.data.stocked, placeHolder: "stocked" },
      { name: "stockedDate", value: data.data.stockedDate, placeHolder: "stockedDate" },
      { name: "mfgSerialNumber", value: data.data.mfgSerialNumber, placeHolder: "mfgSerialNumber" },
      { name: "actualCost", value: data.data.actualCost, placeHolder: "actualCost" },
      { name: "plates", value: data.data.plates, placeHolder: "plates" },
      { name: "width", value: data.data.width, placeHolder: "width" },
      { name: "engine", value: data.data.engine, placeHolder: "engine" },
      { name: "fuelType", value: data.data.fuelType, placeHolder: "fuelType" },

      { name: "power", value: data.data.power, placeHolder: "power" },
      { name: "chassisNumber", value: data.data.chassisNumber, placeHolder: "chassisNumber" },
      { name: "engineNumber", value: data.data.engineNumber, placeHolder: "engineNumber" },
      { name: "chassisYear", value: data.data.chassisYear, placeHolder: "chassisYear" },
      { name: "chassisMake", value: data.data.chassisMake, placeHolder: "chassisMake" },
      { name: "chassisModel", value: data.data.chassisModel, placeHolder: "chassisModel" },
      { name: "registrationState", value: data.data.registrationState, placeHolder: "registrationState" },
      { name: "chassisType", value: data.data.chassisType, placeHolder: "chassisType" },
      { name: "registrationExpiry", value: data.data.registrationExpiry, placeHolder: "registrationExpiry" },
      { name: "netWeight", value: data.data.netWeight, placeHolder: "netWeight" },
      { name: "grossWeight", value: data.data.grossWeight, placeHolder: "grossWeight" },
      { name: "insuranceCompany", value: data.data.insuranceCompany, placeHolder: "insuranceCompany" },
      { name: "policyNumber", value: data.data.policyNumber, placeHolder: "policyNumber" },
      { name: "insuranceStartDate", value: data.data.insuranceStartDate, placeHolder: "insuranceStartDate" },
      { name: "insuranceAgent", value: data.data.insuranceAgent, placeHolder: "insuranceAgent" },
      { name: "insuranceEndDate", value: data.data.insuranceEndDate, placeHolder: "insuranceEndDate" },
    ];
    return ClientDetails;
  }
  function ClientDetailsFunction3() {
    const ClientDetails = [
      { name: "power", value: data.data.power, placeHolder: "power" },
      { name: "chassisNumber", value: data.data.chassisNumber, placeHolder: "chassisNumber" },
      { name: "engineNumber", value: data.data.engineNumber, placeHolder: "engineNumber" },
      { name: "chassisYear", value: data.data.chassisYear, placeHolder: "chassisYear" },
      { name: "chassisMake", value: data.data.chassisMake, placeHolder: "chassisMake" },
      { name: "chassisModel", value: data.data.chassisModel, placeHolder: "chassisModel" },
      { name: "registrationState", value: data.data.registrationState, placeHolder: "registrationState" },
      { name: "chassisType", value: data.data.chassisType, placeHolder: "chassisType" },
      { name: "registrationExpiry", value: data.data.registrationExpiry, placeHolder: "registrationExpiry" },
      { name: "netWeight", value: data.data.netWeight, placeHolder: "netWeight" },
      { name: "grossWeight", value: data.data.grossWeight, placeHolder: "grossWeight" },
      { name: "insuranceCompany", value: data.data.insuranceCompany, placeHolder: "insuranceCompany" },
      { name: "policyNumber", value: data.data.policyNumber, placeHolder: "policyNumber" },
      { name: "insuranceStartDate", value: data.data.insuranceStartDate, placeHolder: "insuranceStartDate" },
      { name: "insuranceAgent", value: data.data.insuranceAgent, placeHolder: "insuranceAgent" },
      { name: "insuranceEndDate", value: data.data.insuranceEndDate, placeHolder: "insuranceEndDate" },
    ];
    return ClientDetails;
  }
  function ClientDetailsFunction4() {
    const ClientDetails = [
      { name: "dealNum", value: data.data.dealNum, placeHolder: "dealNum" },
      { name: "customerName", value: data.data.customerName, placeHolder: "customerName" },
      { name: "customerPhone", value: data.data.customerPhone, placeHolder: "customerPhone" },
      { name: "customerAddress", value: data.data.customerAddress, placeHolder: "customerAddress" },
      { name: "deliveredDate", value: data.data.deliveredDate, placeHolder: "deliveredDate" },
    ];
    return ClientDetails;
  }
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  return (
    <div className="mx-auto w-[95%] justify-center ">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button onClick={() => {
            //   console.log(data, selectedRowData, 'opnclick')
          }}
            className='mx-auto'> <Landmark /> </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content
            className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[90vh] w-[90vw] max-w-[450px] translate-x-[-50%]  translate-y-[-50%] overflow-y-scroll rounded-[6px] bg-myColor-900 text-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none sm:max-w-[1025px]">
            <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium bg-myColor-900 text-slate1">
              Deal Info
            </Dialog.Title>
            <Dialog.Description className="text-mauve11 mb-5 mt-[10px] text-[15px] leading-normal  text-slate1">
              Make changes to customers deal, save when your done.
            </Dialog.Description>

            <div className=" gap-4 py-4">
              <Tabs defaultValue="dashboard" className=''>
                <TabsList className="grid w-[600px] grid-cols-5">
                  <TabsTrigger value="dashboard">Unit</TabsTrigger>
                  <TabsTrigger value="newLeads">More Info</TabsTrigger>
                  <TabsTrigger value="trade">Trade</TabsTrigger>
                  <TabsTrigger value="search">F & I Products</TabsTrigger>
                  <TabsTrigger value="wishList">Customer Info</TabsTrigger>
                </TabsList>

                <TabsContent className="mx-auto w-[98%] " value="dashboard">
                  {edit ? (
                    <>
                      <Form method='post'>
                        <div className='grid w-[98%] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                          {ClientDetailsFunction().map((fee, index) => (
                            <div key={index} className="w-full max-w-sm items-center gap-1.5">
                              <Label htmlFor="email">{fee.placeHolder}</Label>
                              <Input
                                name={fee.name}
                                defaultValue={fee.value}

                                className='mt-2 h-8 border-black bg-white text-black focus:border-[#02a9ff]'
                              />
                            </div>
                          ))}
                        </div>
                        <Button variant='outline' type="submit" className='mt-3'>Save changes</Button>
                      </Form>
                    </>
                  ) : (
                    <div className='grid w-[98%] grid-cols-1 justify-between gap-4 md:grid-cols-2'>

                      {ClientDetailsFunction().map((fee, index) => (
                        <div key={index}
                          className="grid w-full max-w-sm grid-cols-2 items-center justify-between gap-1.5">

                          <p>{fee.placeHolder}</p>
                          {fee.value ? (
                            <p onClick={() => copyText(fee.value)} className='cursor-pointer text-right'>{fee.value}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}
                        </div>
                      ))}
                    </div>

                  )}
                  <div onClick={toggleColumns} className='mt-4 px-3 cursor-pointer py-2 border border-black bg-myColor-950 w-[100px] rounded-md ml-3 mx-auto text-white'>
                    <p>Edit</p>
                  </div>

                </TabsContent>
                <TabsContent className="w-[98%]" value="newLeads">
                  {edit ? (
                    <>

                      <div className='grid w-[98%] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                        {ClientDetailsFunction2().map((fee, index) => (
                          <div key={index} className="flex-auto px-2 lg:px-10 py-10 pt-0 bg-slate11">

                            <div className="flex flex-wrap">
                              <div className="w-full lg:w-6/12 px-4">
                                <div className="relative w-full mb-3">
                                  <label
                                    className="block uppercase mt-2 text-slate1 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                  >
                                    {fee.placeHolder}
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full  rounded border-0 h-8 bg-slate12 px-3 py-3 text-sm text-slate1 placeholder-blue-600 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
                                    name={fee.name}
                                    defaultValue={fee.value}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant='outline' type="submit" className='mt-3'>Save changes</Button>
                    </>
                  ) : (
                    <div className='grid w-[98%] grid-cols-1 justify-between gap-4 md:grid-cols-2'>
                      {ClientDetailsFunction2().map((fee, index) => (
                        <div key={index}
                          className="grid w-full max-w-sm grid-cols-2 items-center justify-between gap-1.5">

                          <p>{fee.placeHolder}</p>
                          {fee.value ? (
                            <p className='text-right'>{fee.value}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div onClick={toggleColumns} className='mt-4 px-3 cursor-pointer py-2 border border-black bg-myColor-950 w-[100px] rounded-md ml-3 mx-auto text-white'>
                    <p>Edit</p>
                  </div>

                </TabsContent>
                <TabsContent className="w-[98%]" value="search">

                  <div className="h-[95%] overflow-y-scroll ">
                    {/* Price Breakdown */}
                    <>
                      <div className="mt-3">
                        <h3 className="text-2xl ">Price</h3>
                      </div>

                      <hr className="solid dark:text-slate1" />
                      <div className="flex flex-wrap justify-between  ">
                        <p className="mt-2  basis-2/4 ">MSRP</p>
                        <p className="mt-2 flex basis-2/4 items-end  justify-end">
                          ${formData.msrp}
                        </p>

                        {formData.freight > 0 && (
                          <>
                            <p className="mt-3  basis-2/4">Freight</p>
                            <Input
                              className="mt-2 h-8 w-20 items-end justify-end  text-right"
                              defaultValue={formData.freight}
                              placeholder="freight"
                              type="text"
                              name="freight"
                              onChange={handleChange}
                            />
                          </>
                        )}

                        {formData.pdi > 0 && (
                          <>
                            <p className="mt-2  basis-2/4">PDI</p>
                            <Input
                              className="mt-2 h-8 w-20 items-end justify-end  text-right"
                              defaultValue={formData.pdi}
                              placeholder="pdi"
                              type="text"
                              name="pdi"
                              onChange={handleChange}
                            />
                          </>
                        )}
                        {formData.admin > 0 && (
                          <>
                            <p className="mt-2  basis-2/4">Admin</p>
                            <Input
                              className="mt-2 h-8 w-20 items-end justify-end  text-right  "
                              defaultValue={formData.admin}
                              placeholder="admin"
                              type="text"
                              name="admin"
                              onChange={handleChange}
                            />
                          </>
                        )}
                        {formData.commodity > 0 && (
                          <>
                            <p className="mt-2  basis-2/4">Commodity</p>
                            <Input
                              className="mt-2 h-8 w-20 items-end justify-end  text-right"
                              defaultValue={formData.commodity}
                              placeholder="commodity"
                              type="text"
                              name="commodity"
                              onChange={handleChange}
                            />
                          </>
                        )}
                        <p className="mt-2  basis-2/4">Accessories</p>
                        <p className="mt-1 flex basis-2/4 items-end  justify-end">
                          <Input
                            className="mt-2 h-8 w-20 items-end justify-end  text-right"
                            defaultValue={accessories}
                            placeholder="accessories"
                            type="text"
                            name="accessories"
                            onChange={handleChange}
                          />
                        </p>
                        <p className="mt-2  basis-2/4">Labour Hours</p>
                        <p className="mt-2 flex basis-2/4 items-end  justify-end">
                          <Input
                            className="mt-2 h-8 w-20 items-end justify-end  text-right"
                            defaultValue={finance.labour}
                            placeholder="labour"
                            type="text"
                            name="labour"
                            onChange={handleChange}
                          />
                        </p>
                        <p className="mt-2  basis-2/4">Licensing</p>
                        <Input
                          className="mt-2 h-8 w-20 items-end justify-end  text-right "
                          defaultValue={licensing}
                          placeholder="licensing"
                          type="text"
                          name="licensing"
                          onChange={handleChange}
                        />
                        {/*modelData.trailer > 0 && (
                                                  <>
                                                      <p className="basis-2/4  mt-2 ">Trailer</p>
                                                      <Input
                                                          className="w-20 h-8 items-end justify-end text-right  mt-2 "
                                                          defaultValue={modelData.trailer}
                                                          placeholder="trailer"
                                                          type="text"
                                                          name="trailer"
                                                          onChange={handleChange}
                                                      />
                                                  </>
                                              )}

                                              {modelData.painPrem > 0 && (
                                                  <>
                                                      <p className="basis-2/4 ">Paint Premium</p>
                                                      <p className="flex basis-2/4 items-end justify-end  ">
                                                          ${modelData.painPrem}
                                                      </p>
                                                  </>
                                              )*/}

                      </div>

                    </>

                    <DealerFeesDisplay finance={finance} deFees={deFees} />


                    <BrandOptions />
                    {/* Standard Terms */}
                    <>
                      {/* Standard Terms
  <button
            className={`button  ${mainButton === 'payments' ? 'active' : ''}`}
            onClick={() => handleMainButtonClick('payments')}
          >
            Payments
          </button>
           */}
                      <div className="mt-3">
                        <h3 className="text-2xl ">Standard Terms</h3>
                      </div>
                      <hr className="solid" />
                      <div className=''>
                        <div className='mt-3'>
                          <div className="main-button-group flex justify-between ">
                            <Badge id='myButton'
                              className={`button  transform cursor-pointer bg-[#02a9ff]  shadow hover:text-slate12  ${mainButton === 'payments' ? 'active bg-slate12 text-slate1' : 'bg-slate1 text-slate12'}`}
                              onClick={() => handleMainButtonClick('payments')}>
                              Payments
                            </Badge>

                            <Badge id='myButton1'
                              className={`button  transform cursor-pointer bg-[#02a9ff] shadow   hover:text-slate12 ${mainButton === 'noTax' ? 'active bg-slate12 text-slate1 ' : 'bg-slate1 text-slate12'}`}
                              onClick={() => handleMainButtonClick('noTax')}
                            >
                              No Tax
                            </Badge>

                            <Badge id='myButton2'
                              className={`button  transform cursor-pointer bg-[#02a9ff]   shadow hover:text-slate12 ${mainButton === 'customTax' ? 'active bg-slate12 text-slate1' : 'bg-slate1 text-slate12'}`}
                              onClick={() => handleMainButtonClick('customTax')}
                            >
                              Custom Tax
                            </Badge>
                          </div>
                          <div className="sub-button-group mt-2 flex justify-between">

                            <Badge id='myButton3'
                              className={`button  transform cursor-pointer bg-[#02a9ff] shadow hover:text-slate12 ${subButton === 'withoutOptions' ? 'active bg-slate12 text-slate1' : 'bg-slate1 text-slate12'}`}
                              onClick={() => handleSubButtonClick('withoutOptions')}
                            >
                              W/O Options
                            </Badge>
                            <Badge id='myButton5'
                              className={`button  transform cursor-pointer bg-[#02a9ff]  shadow hover:text-slate12  ${subButton === 'withOptions' ? 'active bg-slate12  text-slate1' : 'bg-slate1 text-slate12'}`}
                              onClick={() => handleSubButtonClick('withOptions')}
                            >
                              W/ Options
                            </Badge>
                          </div>
                        </div>
                        {/* Render different content based on the selected main and sub buttons */}
                        <div className=''>
                          {mainButton === 'payments' && (
                            <div className=''>
                              {subButton === 'withoutOptions' && <div>
                                <div className="mt-5 flex flex-wrap justify-between ">
                                  <p className="font-bold ">
                                    ${on60}/Month
                                  </p>
                                  {on60 === Number.isNaN(on60) &&
                                    <p>If numbers are NaN please verify that you have inputed tax, labour hours and
                                      licensing in your profile.</p>}
                                  <p className="flex  items-end justify-end font-bold ">
                                    ${biweekly}/Bi-weekly
                                  </p>
                                  <p className="font-bold">
                                    ${weekly}/Week
                                  </p>
                                </div>
                              </div>}
                              {subButton === 'withOptions' && <div>
                                <div className="mt-2">
                                  <h3 className="text-2xl ">Options Include</h3>
                                </div>
                                <hr className="solid" />

                                <DealerOptionsAmounts />
                                <div className="mt-5 flex flex-wrap justify-between ">
                                  <p className="font-bold">${qc60}/Month</p>
                                  <p className="flex items-end justify-end font-bold ">
                                    ${biweeklyqc}/Bi-weekly
                                  </p>
                                  <p className="font-bold">${weeklyqc}/Week</p>
                                </div>
                              </div>}
                            </div>
                          )}
                          {/* Render different content based on the selected main and sub buttons */}
                          {mainButton === 'noTax' && (
                            <div className=''>
                              {subButton === 'withoutOptions' &&
                                <div>
                                  <div className="mt-5 flex flex-wrap justify-between ">
                                    <p className="font-bold">${nat60}/Month</p>
                                    <p className="flex items-end justify-end font-bold ">
                                      ${biweeklNat}/Bi-weekly
                                    </p>
                                    <p className="font-bold">${weeklylNat}/Week</p>
                                  </div>
                                </div>}
                              {subButton === 'withOptions' &&
                                <div>
                                  <div className="mt-2">
                                    <h3 className="text-2xl ">Options Include</h3>
                                  </div>
                                  <hr className="solid" />
                                  <DealerOptionsAmounts />
                                  <div className="mt-5 flex flex-wrap justify-between ">
                                    <p className="font-bold">${nat60WOptions}/Month</p>
                                    <p className="flex items-end justify-end font-bold ">
                                      ${biweeklNatWOptions}/Bi-weekly
                                    </p>
                                    <p className="font-bold">${weeklylNatWOptions}/Week</p>
                                  </div>
                                </div>}
                            </div>
                          )}

                          {/* Render different content based on the selected main and sub buttons */}
                          {mainButton === 'customTax' && (
                            <div className=''>
                              <div className='mt-2 flex items-center justify-between'>
                                <p className="basis-2/4 ">Other tax %</p>
                                <Input
                                  name="othTax"
                                  id="othTax"
                                  className='h-8 w-20 text-right'
                                  autoComplete="othTax"
                                  defaultValue={formData.othTax}
                                  onChange={handleChange}
                                />
                              </div>
                              {subButton === 'withoutOptions' &&
                                <div className='mt-5 flex justify-between'>
                                  <p className="font-bold">
                                    ${oth60}/Month
                                  </p>
                                  <p className="flex items-end justify-end font-bold ">
                                    ${biweekOth}/Bi-weekly
                                  </p>
                                  <p className="font-bold">
                                    ${weeklyOth}/Week
                                  </p>
                                </div>}
                              {subButton === 'withOptions' &&
                                <div>
                                  <div className="mt-2">
                                    <h3 className="text-2xl ">Options Include</h3>
                                  </div>
                                  <hr className="solid" />
                                  <DealerOptionsAmounts />
                                  <div className="mt-5 flex flex-wrap justify-between ">
                                    <p className="font-bold">
                                      ${oth60WOptions}/Month
                                    </p>
                                    <p className="flex items-end justify-end font-bold ">
                                      ${biweekOthWOptions}/Bi-weekly
                                    </p>
                                    <p className="font-bold">
                                      ${weeklyOthWOptions}/Week
                                    </p>
                                  </div>
                                </div>}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                    {/* Contract Variables */}
                    <>
                      <div className="mt-5">
                        <h3 className="text-2xl ">Contract Variables</h3>
                      </div>
                      <hr className="solid" />
                      <div className="grid grid-cols-2 ">
                        <div className=" mt-2 ">
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <label htmlFor="Term">Term</label>
                            <Input
                              className="h-8 w-20"
                              name="months"
                              id="months"
                              autoComplete="months"
                              defaultValue={months}
                              onChange={handleChange}
                              type='number'
                            />
                          </div>
                        </div>
                        <div className="mt-2 grid items-end justify-end ">
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <label className="text-right" htmlFor="iRate">
                              Rate
                            </label>
                            <Input
                              className="h-8 w-20 items-end justify-end text-right  "
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
                              className="h-8 w-20"
                              name="deposit"
                              id="deposit"
                              autoComplete="deposit"
                              defaultValue={deposit}
                              onChange={handleChange}
                              type='number'
                            />
                          </div>
                        </div>
                        <div className=" mt-2 grid items-end justify-end ">
                          <div className="grid w-full max-w-sm items-center gap-1.5 ">
                            <label htmlFor="tradeValue">Trade Value</label>
                            <Input
                              className="ml-auto h-8 w-20 text-right"
                              name="tradeValue"
                              id="tradeValue"
                              autoComplete="tradeValue"
                              defaultValue={tradeValue}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid  grid-cols-2">
                        <div className=" mt-2 ">
                          <div className="grid  max-w-sm items-center gap-1.5">
                            <label htmlFor="discount">Discount $ </label>
                            <Input
                              className="h-8 w-20"
                              name="discount"
                              id="discount"
                              autoComplete="discount"
                              defaultValue={discount}
                              onChange={handleChange}
                              type='number'
                            />
                          </div>
                        </div>
                        <div className="ml-auto mt-2">
                          <div className="grid  max-w-sm items-center gap-1.5">
                            <label htmlFor="discountPer">Discount (1.1-15)%</label>
                            <Input
                              className="ml-auto h-8 w-20 text-right"
                              name="discountPer"
                              id="discountPer"
                              autoComplete="discountPer"
                              defaultValue={0}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className=" mt-2 ">
                          <div className="grid  max-w-sm items-center gap-1.5">
                            <label htmlFor="discountPer">Delivery Charge</label>
                            <Input
                              className="h-8 w-20"
                              name="deliveryCharge"
                              id="deliveryCharge"
                              autoComplete="deliveryCharge"
                              defaultValue={deliveryCharge}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        {totalLabour > 0 &&
                          <>
                            <p className="mt-3  basis-2/4">Total Labour</p>
                            <p className="flex basis-2/4 items-end justify-end  ">
                              ${totalLabour}
                            </p>
                          </>
                        }
                      </div>
                    </>
                    {/* total and payments */}
                    <>
                      <div className="mt-3">
                        <h3 className="text-2xl ">Total</h3>
                      </div>
                      <hr className="solid" />
                      <div className="mt-2 flex flex-wrap justify-between ">
                        {perDiscountGiven > 0 && (
                          <>
                            <p className="basis-2/4 ">Total Before Discount</p>
                            <p className="flex basis-2/4 items-end justify-end  ">
                              ${beforeDiscount}
                            </p>
                          </>
                        )}
                        {perDiscountGiven > 0 && (
                          <>
                            <p className="basis-2/4 ">
                              Discount (MSRP only)
                            </p>
                            <p className="flex basis-2/4 items-end justify-end  ">
                              ${perDiscountGiven}
                            </p>
                          </>
                        )}
                      </div>
                      <div>
                        {mainButton === 'payments' && (
                          <div>
                            {subButton === 'withoutOptions' &&
                              <div className="mt-2 flex flex-wrap justify-between ">
                                <p className="mt-2  basis-2/4">Total</p>
                                <p className="flex basis-2/4 items-end justify-end  ">
                                  ${total}
                                </p>
                                <p className="ml-auto  basis-2/4">With taxes</p>
                                <p className="flex basis-2/4 items-end justify-end  ">
                                  <Tooltip.Provider>
                                    <Tooltip.Root>
                                      <Tooltip.Trigger>
                                        ${onTax - deposit}
                                      </Tooltip.Trigger>
                                      <Tooltip.Portal>
                                        <Tooltip.Content
                                          className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                          sideOffset={5}
                                        >
                                          W/O Deposit ${onTax}
                                        </Tooltip.Content>
                                      </Tooltip.Portal>
                                    </Tooltip.Root>
                                  </Tooltip.Provider>
                                </p>
                              </div>
                            }
                            {subButton === 'withOptions' &&
                              <div className="mt-2 flex flex-wrap justify-between ">
                                <p className="mt-2  basis-2/4">Total</p>
                                <p className="flex basis-2/4 items-end justify-end  ">
                                  ${totalWithOptions}
                                </p>
                                <p className="mt-2  basis-2/4">With taxes</p>
                                <p className="flex basis-2/4 items-end justify-end  ">
                                  <Tooltip.Provider>
                                    <Tooltip.Root>
                                      <Tooltip.Trigger>
                                        ${qcTax - deposit}
                                      </Tooltip.Trigger>
                                      <Tooltip.Portal>
                                        <Tooltip.Content
                                          className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                          sideOffset={5}
                                        >
                                          W/O Deposit ${qcTax}
                                        </Tooltip.Content>
                                      </Tooltip.Portal>
                                    </Tooltip.Root>
                                  </Tooltip.Provider>
                                </p>
                              </div>
                            }
                          </div>
                        )}
                        {mainButton === 'noTax' && (
                          <div>
                            {subButton === 'withoutOptions' &&
                              <div className="mt-2 flex flex-wrap justify-between ">
                                <p className="mt-2  basis-2/4">Total</p>
                                <p className="flex basis-2/4 items-end justify-end  ">
                                  ${total}
                                </p>
                                <p className="flex basis-2/4 items-end justify-end  ">
                                  <Tooltip.Provider>
                                    <Tooltip.Root>
                                      <Tooltip.Trigger>
                                        ${native - deposit}
                                      </Tooltip.Trigger>
                                      <Tooltip.Portal>
                                        <Tooltip.Content
                                          className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                          sideOffset={5}
                                        >
                                          W/O Deposit ${native}
                                        </Tooltip.Content>
                                      </Tooltip.Portal>
                                    </Tooltip.Root>
                                  </Tooltip.Provider>
                                </p>
                              </div>
                            }
                            {subButton === 'withOptions' &&
                              <div className="mt-2 flex flex-wrap justify-between ">
                                <p className="mt-2  basis-2/4">Total</p>
                                <p className="flex basis-2/4 items-end justify-end  ">
                                  ${totalWithOptions}
                                </p>
                              </div>
                            }
                          </div>
                        )}
                        {mainButton === 'customTax' && (
                          <div>
                            {subButton === 'withoutOptions' &&
                              <div className="mt-2 flex flex-wrap justify-between ">
                                <p className="mt-2  basis-2/4">Total</p>
                                <p className="flex basis-2/4 items-end justify-end  ">
                                  ${total}
                                </p>
                                <p className="mt-2  basis-2/4">With taxes</p>
                                <p className="flex basis-2/4 items-end justify-end  ">
                                  <Tooltip.Provider>
                                    <Tooltip.Root>
                                      <Tooltip.Trigger>
                                        ${otherTax - deposit}
                                      </Tooltip.Trigger>
                                      <Tooltip.Portal>
                                        <Tooltip.Content
                                          className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                          sideOffset={5}
                                        >
                                          W/O Deposit ${otherTax}
                                        </Tooltip.Content>
                                      </Tooltip.Portal>
                                    </Tooltip.Root>
                                  </Tooltip.Provider>
                                </p>
                              </div>
                            }
                            {subButton === 'withOptions' &&
                              <div className="mt-2 flex flex-wrap justify-between ">
                                <p className="mt-2  basis-2/4">Total</p>
                                <p className="flex basis-2/4 items-end justify-end  ">
                                  ${totalWithOptions}
                                </p>
                                <p className="mt-2  basis-2/4">With taxes</p>
                                <p className="flex basis-2/4 items-end justify-end  ">
                                  <Tooltip.Provider>
                                    <Tooltip.Root>
                                      <Tooltip.Trigger>
                                        ${otherTaxWithOptions - deposit}
                                      </Tooltip.Trigger>
                                      <Tooltip.Portal>
                                        <Tooltip.Content
                                          className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                                          sideOffset={5}
                                        >
                                          W/O Deposit ${otherTaxWithOptions}
                                        </Tooltip.Content>
                                      </Tooltip.Portal>
                                    </Tooltip.Root>
                                  </Tooltip.Provider>
                                </p>
                              </div>
                            }
                          </div>
                        )}
                      </div>
                    </>
                  </div>
                </TabsContent>
                <TabsContent className="w-[98%]" value="wishList">
                  {edit ? (
                    <>
                      <div className='grid w-[98%] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        {ClientDetailsFunction().map((fee, index) => (
                          <div key={index} className="w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email">{fee.placeHolder}</Label>
                            <Input
                              name={fee.name}
                              defaultValue={fee.value}
                              className='mt-2 h-8 border-black bg-white text-black focus:border-[#02a9ff]'
                            />
                          </div>
                        ))}
                      </div>
                      <Button variant='outline' type="submit" className='mt-3'>Save changes</Button>

                    </>
                  ) : (
                    <div className='grid w-[98%] grid-cols-1 justify-between gap-4 md:grid-cols-2'>
                      {ClientDetailsFunction().map((fee, index) => (
                        <div key={index}
                          className="grid w-full max-w-sm grid-cols-2 items-center justify-between gap-1.5">

                          <p>{fee.placeHolder}</p>
                          {fee.value ? (
                            <p className='text-right'>{fee.value}</p>
                          ) : (
                            <p className='text-right'>N/A</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div onClick={toggleColumns} className='mt-4 px-3 cursor-pointer py-2 border border-black bg-myColor-950 w-[100px] rounded-md ml-3 mx-auto text-white'>
                    <p>Edit</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <Dialog.Close asChild>
              <button
                className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
