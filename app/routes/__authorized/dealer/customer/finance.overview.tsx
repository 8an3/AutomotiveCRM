import { useFetcher, useLoaderData, useParams, useRouteLoaderData, } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import { ImageSelect } from '~/overviewUtils/imageselect'
import EmailSheet from '~/overviewUtils/Emails'
import FeaturePop from '~/overviewUtils/FeaturePop'
import BMWOptions from '~/overviewUtils/bmwOptions'
import ManitouOptions from '~/overviewUtils/manitouOptions'
import DisplayModel from '~/overviewUtils/modelDisplay'
import DealerFeesDisplay from '~/overviewUtils/dealerFeesDisplay'
import ContactInfoDisplay from '~/overviewUtils/contactInfoDisplay'
import * as Tooltip from '@radix-ui/react-tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Input, Button, Checkbox } from "~/components/ui/index"
import * as Toast from '@radix-ui/react-toast';
import { Badge } from '~/components/ui/badge'
import { type DataFunctionArgs, type V2_MetaFunction, type ActionFunction, json, redirect, type ActionArgs } from '@remix-run/node'
import { commitSession, getSession, commitSession as commitPref, getSession as getPref } from '~/utils/pref.server'
  ;
import { findDashboardDataById, findQuoteById, getDataBmwMoto, getDataByModel, getDataByModelManitou, getDataHarley, getDataKawasaki, getDataTriumph, getLatestBMWOptions, getLatestBMWOptions2, getLatestOptionsManitou, } from "~/utils/finance/get.server";
import { overviewAction } from '~/components/actions/overviewActions'
import { getDealerFeesbyEmail } from '~/utils/user.server'

import { prisma } from "~/libs";
import { requireAuthCookie } from '~/utils/misc.user.server';
import { model } from "~/models";



export let action = overviewAction;

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session2 = await getSession(request.headers.get("Cookie"));
  const email = session2.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }

  if (!user) { return json({ status: 302, redirect: '/login' }); };

  // need to fix the cookie for the finance id
  const session = await getSession(request.headers.get("Cookie"))

  const financeId = session.get('financeId')

  const deFees = await getDealerFeesbyEmail(email)
  const sliderWidth = session.get('sliderWidth')
  const finance = await findQuoteById(financeId);
  const dashData = await findDashboardDataById(financeId);
  const brand = finance?.brand

  if (brand === 'Manitou') {
    const modelData = await getDataByModelManitou(finance);
    const manOptions = await getLatestOptionsManitou(email)
    return json({ ok: true, modelData, finance, deFees, manOptions, sliderWidth })
  }
  if (brand === 'Switch') {
    const modelData = await getDataByModel(finance);
    const manOptions = await getLatestOptionsManitou(email)
    return json({ ok: true, modelData, finance, deFees, manOptions, sliderWidth })
  }
  if (brand === 'Kawasaki') {
    const modelData = await getDataKawasaki(finance);
    return json({ ok: true, modelData, finance, deFees, sliderWidth })
  }
  if (brand === 'BMW-Motorrad') {
    const financeId = finance?.id
    const bmwMoto = await getLatestBMWOptions(financeId)
    const bmwMoto2 = await getLatestBMWOptions2(financeId)
    const modelData = await getDataBmwMoto(finance);
    return json({ ok: true, modelData, finance, deFees, bmwMoto, bmwMoto2, sliderWidth })
  }
  if (brand === 'Triumph') {
    const modelData = await getDataTriumph(finance);
    return json({ ok: true, modelData, finance, deFees, sliderWidth })
  }
  if (brand === 'Harley-Davidson') {
    const modelData = await getDataHarley(finance);
    return json({ ok: true, modelData, finance, deFees, sliderWidth })
  }
  else {
    const modelData = await getDataByModel(finance)
    return json({ ok: true, modelData, finance, deFees, sliderWidth })
  }
}


export function Overview({ outletSize }) {
  const { finance, modelData, deFees, manOptions, bmwMoto, bmwMoto2, user, client } = useLoaderData()
  const toFormat = new Date();
  const today = toFormat.toISOString();
  let { brandId } = useParams()
  const brand = brandId
  let fetcher = useFetcher()
  const showSection = true
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
    accessories: parseFloat(finance.accessories) || 0,
    labour: parseInt(finance.labour) || 0,
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
    tradeValue: 0, deposit: 500, discount: 0, iRate: 10.99,
    months: 60, discountPer: 0, biweeklyqc: 0, weeklyqc: 0,
    biweeklNat: 0, weeklylNat: 0, biweekOth: 0, weeklyOth: 0, othTax: 13,
    firstName: finance.firstName,
    lastName: finance.lastName,
    panAmAdpRide: 0,
    panAmTubelessLacedWheels: 0,
    hdWarrAmount: 0,
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
                <h3 className="text-2xl font-thin">
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
              className=" rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
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
                className="mx-auto  rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
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
                className="rounded border-0 ml-2 mr-2 bg-white px-3 py-3 text-sm text-gray-600 placeholder-blue-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring focus-visible:ring-[#60b9fd]"
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
  // console.log(';bmwMoto2', bmwMoto2)
  // console.log(finance)
  // console.log(deFees)
  // console.log(modelData)
  // console.log(accessories)
  // console.log(initial)
  // console.log(accTotal)
  // console.log(essentials)


  return (
    <>
      <div className='mt-3' >
        <ImageSelect />
      </div>
      <fetcher.Form method="post">
        {/* Cannot take any area from here that interacts with the calc */}
        <DisplayModel finance={finance} formData={formData} handleChange={handleChange} />

        {formData.model.includes('Pan America 1250 Special') && (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="panAmTubelessLacedWheels"
                  name="panAmTubelessLacedWheels"
                  checked={formData.panAmTubelessLacedWheels !== 0}
                  className={`form-checkbox mr-2 ${formData.panAmTubelessLacedWheels !== 0 ? 'checked:bg-gray-500' : ''}`}
                  onChange={(e) => {
                    const { name, checked } = e.target;
                    const newValue = checked ? 1500 : 0; // Use the correct variable name here
                    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                  }}
                />
                <p className="mr-4">Pan-America Tubeless Laced Wheels</p>
              </div>
              <p> ${formData.panAmTubelessLacedWheels} </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="panAmAdpRide"
                  name="panAmAdpRide"
                  checked={formData.panAmAdpRide !== 0}
                  className={`form-checkbox mr-2 ${formData.panAmAdpRide !== 0 ? 'checked:bg-gray-500' : ''}`}
                  onChange={(e) => {
                    const { name, checked } = e.target;
                    const newValue = checked ? 1700 : 0; // Use the correct variable name here
                    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
                  }}
                />
                <p className="mr-4">Pan-America Adaptive Ride</p>
              </div>
              <p> ${formData.panAmAdpRide} </p>
            </div>
          </>
        )}
        {/* Price Breakdown */}
        <>
          <div className="mt-3">
            <h3 className="text-2xl font-thin">Price</h3>
          </div>

          <hr className="solid dark:text-foreground" />
          <div className="flex flex-wrap justify-between  ">
            <p className="basis-2/4 font-thin mt-2 ">MSRP</p>
            <p className="flex basis-2/4 items-end justify-end font-thin mt-2">
              ${formData.msrp}
            </p>

            {formData.freight > 0 && (
              <>
                <p className="basis-2/4 font-thin mt-3">Freight</p>
                <Input
                  className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
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
                <p className="basis-2/4 font-thin mt-2">PDI</p>
                <Input
                  className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
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
                <p className="basis-2/4  mt-2">Admin</p>
                <Input
                  className="w-20 h-8 items-end justify-end text-right  mt-2  "
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
                <p className="basis-2/4 font-thin mt-2">Commodity</p>
                <Input
                  className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
                  defaultValue={formData.commodity}
                  placeholder="commodity"
                  type="text"
                  name="commodity"
                  onChange={handleChange}
                />
              </>
            )}
            <p className="basis-2/4 font-thin mt-2">Accessories</p>
            <p className="flex basis-2/4 items-end justify-end font-thin mt-1">
              <Input
                className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
                defaultValue={accessories}
                placeholder="accessories"
                type="text"
                name="accessories"
                onChange={handleChange}
              />
            </p>
            <p className="basis-2/4 font-thin mt-2">Labour Hours</p>
            <p className="flex basis-2/4 items-end justify-end font-thin mt-2">
              <Input
                className="w-20 h-8 items-end justify-end text-right font-thin mt-2"
                defaultValue={finance.labour}
                placeholder="labour"
                type="text"
                name="labour"
                onChange={handleChange}
              />
            </p>
            <p className="basis-2/4 font-thin mt-2">Licensing</p>
            <Input
              className="w-20 h-8 items-end justify-end text-right font-thin mt-2 "
              defaultValue={licensing}
              placeholder="licensing"
              type="text"
              name="licensing"
              onChange={handleChange}
            />
            {modelData.trailer > 0 && (
              <>
                <p className="basis-2/4 font-thin mt-2 ">Trailer</p>
                <Input
                  className="w-20 h-8 items-end justify-end text-right font-thin mt-2 "
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
                <p className="basis-2/4 font-thin">Paint Premium</p>
                <p className="flex basis-2/4 items-end justify-end font-thin ">
                  ${modelData.painPrem}
                </p>
              </>
            )}

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
            <h3 className="text-2xl font-thin">Standard Terms</h3>
          </div>
          <hr className="solid" />
          <div className=''>
            <div className='mt-3'>
              <div className="flex main-button-group justify-between ">
                <Badge className={`button  shadow bg-primary transform focus:-translate-y-1 cursor-pointer  ${mainButton === 'payments' ? 'active bg-black text-foreground' : '-translate-y-1'}`}
                  onClick={() => handleMainButtonClick('payments')}>
                  Payments
                </Badge>
                <Badge className={`button  shadow bg-primary transform target:-translate-y-1  cursor-pointer ${mainButton === 'noTax' ? 'active bg-black text-foreground -translate-y-1' : ''}`}
                  onClick={() => handleMainButtonClick('noTax')}
                >
                  No Tax
                </Badge>
                <Badge className={`button  shadow bg-primary transform active:-translate-y-1 cursor-pointer ${mainButton === 'customTax' ? 'active bg-black text-foreground' : ''}`}
                  onClick={() => handleMainButtonClick('customTax')}
                >
                  Custom Tax
                </Badge>
              </div>
              <div className="flex sub-button-group justify-between mt-2">

                <Badge className={`button  shadow bg-primary transform translate-y-[1px] cursor-pointer ${mainButton === 'withoutOptions' ? 'active bg-black text-foreground' : ''}`}
                  onClick={() => handleSubButtonClick('withoutOptions')}
                >
                  W/O Options
                </Badge>


                <Badge className={`button  shadow bg-primary transform translate-y-[1px] cursor-pointer   ${mainButton === 'withOptions' ? 'active bg-black text-foreground' : ''}`}
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
                      {on60 === Number.isNaN(on60) && <p>If numbers are NaN please verify that you have inputed tax, labour hours and licensing in your profile.</p>}
                      <p className="font-bold  flex items-end justify-end ">
                        ${biweekly}/Bi-weekly
                      </p>
                      <p className="font-bold">
                        ${weekly}/Week
                      </p>
                    </div>
                  </div>}
                  {subButton === 'withOptions' && <div>
                    <div className="mt-2">
                      <h3 className="text-2xl font-thin">Options Include</h3>
                    </div>
                    <hr className="solid" />
                    <DealerOptionsAmounts />
                    <div className="mt-5 flex flex-wrap justify-between ">
                      <p className="font-bold">${qc60}/Month</p>
                      <p className="font-bold flex items-end justify-end ">
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
                        <p className="font-bold flex items-end justify-end ">
                          ${biweeklNat}/Bi-weekly
                        </p>
                        <p className="font-bold">${weeklylNat}/Week</p>
                      </div>
                    </div>}
                  {subButton === 'withOptions' &&
                    <div>
                      <div className="mt-2">
                        <h3 className="text-2xl font-thin">Options Include</h3>
                      </div>
                      <hr className="solid" />
                      <DealerOptionsAmounts />
                      <div className="mt-5 flex flex-wrap justify-between ">
                        <p className="font-bold">${nat60WOptions}/Month</p>
                        <p className="font-bold flex items-end justify-end ">
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

                  <div className='flex justify-between items-center mt-2'>
                    <p className="basis-2/4 font-thin">Other tax %</p>
                    <Input
                      name="othTax"
                      id="othTax"
                      className='w-20 h-8 text-right'
                      autoComplete="othTax"
                      defaultValue={formData.othTax}
                      onChange={handleChange}
                    />
                  </div>
                  {subButton === 'withoutOptions' &&
                    <div className='flex justify-between mt-5'>
                      <p className="font-bold">
                        ${oth60}/Month
                      </p>
                      <p className="font-bold flex items-end justify-end ">
                        ${biweekOth}/Bi-weekly
                      </p>
                      <p className="font-bold">
                        ${weeklyOth}/Week
                      </p>
                    </div>}
                  {subButton === 'withOptions' &&
                    <div>
                      <div className="mt-2">
                        <h3 className="text-2xl font-thin">Options Include</h3>
                      </div>
                      <hr className="solid" />
                      <DealerOptionsAmounts />
                      <div className="mt-5 flex flex-wrap justify-between ">
                        <p className="font-bold">
                          ${oth60WOptions}/Month
                        </p>
                        <p className="font-bold flex items-end justify-end ">
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
            <h3 className="text-2xl font-thin">Contract Variables</h3>
          </div>
          <hr className="solid" />
          <div className="grid grid-cols-2 ">
            <div className=" mt-2 font-thin">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <label htmlFor="Term">Term</label>
                <Input
                  className="w-20 h-8"
                  name="months"
                  id="months"
                  autoComplete="months"
                  defaultValue={months}
                  onChange={handleChange}
                  type='number'
                />
              </div>
            </div>
            <div className="mt-2 grid items-end justify-end font-thin">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <label className="text-right" htmlFor="iRate">
                  Rate
                </label>
                <Input
                  className="w-20 h-8 items-end justify-end text-right font-thin "
                  name="iRate"
                  id="iRate"
                  autoComplete="iRate"
                  defaultValue={iRate}
                  onChange={handleChange}

                />
              </div>
            </div>
            <div className=" mt-2 font-thin">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <label htmlFor="deposit">Deposit</label>
                <Input
                  className="w-20 h-8"
                  name="deposit"
                  id="deposit"
                  autoComplete="deposit"
                  defaultValue={deposit}
                  onChange={handleChange}
                  type='number'
                />
              </div>
            </div>
            <div className=" mt-2 grid items-end justify-end font-thin">
              <div className="grid w-full max-w-sm items-center gap-1.5 ">
                <label htmlFor="tradeValue">Trade Value</label>
                <Input
                  className="w-20 h-8 text-right ml-auto"
                  name="tradeValue"
                  id="tradeValue"
                  autoComplete="tradeValue"
                  defaultValue={tradeValue}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <Accordion type="single" collapsible className="mt-3 w-full cursor-pointer">
            <AccordionItem value="item-1">
              <AccordionTrigger>Other Inputs</AccordionTrigger>
              <AccordionContent>
                <div className="grid  grid-cols-2">
                  <div className=" mt-2 font-thin">
                    <div className="grid  max-w-sm items-center gap-1.5">
                      <label htmlFor="discount">Discount $ </label>
                      <Input
                        className="w-20 h-8"
                        name="discount"
                        id="discount"
                        autoComplete="discount"
                        defaultValue={discount}
                        onChange={handleChange}
                        type='number'
                      />
                    </div>
                  </div>
                  <div className="mt-2 ml-auto">
                    <div className="grid  max-w-sm items-center gap-1.5">
                      <label htmlFor="discountPer">Discount (1.1-15)%</label>
                      <Input
                        className="w-20 h-8 text-right ml-auto"
                        name="discountPer"
                        id="discountPer"
                        autoComplete="discountPer"
                        defaultValue={0}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className=" mt-2 font-thin">
                    <div className="grid  max-w-sm items-center gap-1.5">
                      <label htmlFor="discountPer">Delivery Charge</label>
                      <Input
                        className="w-20 h-8"
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
                      <p className="basis-2/4 font-thin mt-3">Total Labour</p>
                      <p className="flex basis-2/4 items-end justify-end font-thin ">
                        ${totalLabour}
                      </p>
                    </>
                  }


                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
        {/* total and payments */}
        <>
          <div className="mt-3">
            <h3 className="text-2xl font-thin">Total</h3>
          </div>
          <hr className="solid" />
          <div className="mt-2 flex flex-wrap justify-between ">
            {perDiscountGiven > 0 && (
              <>
                <p className="basis-2/4 font-thin">Total Before Discount</p>
                <p className="flex basis-2/4 items-end justify-end font-thin ">
                  ${beforeDiscount}
                </p>
              </>
            )}
            {perDiscountGiven > 0 && (
              <>
                <p className="basis-2/4 font-thin">
                  Discount (MSRP only)
                </p>
                <p className="flex basis-2/4 items-end justify-end font-thin ">
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
                    <p className="basis-2/4 font-thin mt-2">Total</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin ">
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger>
                            ${total - deposit}
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                              sideOffset={5}
                            >
                              W/O Deposit ${total}
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    </p>
                    <p className="basis-2/4 font-thin ml-auto">With taxes</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin ">
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
                    <p className="basis-2/4 font-thin mt-2">Total</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin ">
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger>
                            ${totalWithOptions - deposit}
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                              sideOffset={5}
                            >
                              W/O Deposit ${totalWithOptions}
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    </p>
                    <p className="basis-2/4 font-thin mt-2">With taxes</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin ">
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
                    <p className="basis-2/4 font-thin mt-2">Total</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin ">
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger>
                            ${total - deposit}
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                              sideOffset={5}
                            >
                              W/O Deposit ${total}
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    </p>
                    <p className="flex basis-2/4 items-end justify-end font-thin ">
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
                    <p className="basis-2/4 font-thin mt-2">Total</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin ">
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger>
                            ${totalWithOptions - deposit}
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                              sideOffset={5}
                            >
                              W/O Deposit ${totalWithOptions}
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    </p>
                  </div>
                }
              </div>
            )}
            {mainButton === 'customTax' && (
              <div>
                {subButton === 'withoutOptions' &&
                  <div className="mt-2 flex flex-wrap justify-between ">
                    <p className="basis-2/4 font-thin mt-2">Total</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin ">
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger>
                            ${total - deposit}
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                              sideOffset={5}
                            >
                              W/O Deposit ${total}
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    </p>
                    <p className="basis-2/4 font-thin mt-2">With taxes</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin ">
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
                    <p className="basis-2/4 font-thin mt-2">Total</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin ">
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger>
                            ${totalWithOptions - deposit}
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
                              sideOffset={5}
                            >
                              W/O Deposit ${totalWithOptions}
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    </p>
                    <p className="basis-2/4 font-thin mt-2">With taxes</p>
                    <p className="flex basis-2/4 items-end justify-end font-thin ">
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

        <ContactInfoDisplay finance={finance} handleChange={handleChange} formData={formData} />
        {/* Hidden Inputs */}
        <>
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
          <Input type="hidden" defaultValue={biweeklNat} name="biweeklNat" />
          <Input type="hidden" defaultValue={biweeklNatWOptions} name="biweeklNatWOptions" />
          <Input type="hidden" defaultValue={nat60WOptions} name="nat60WOptions" />
          <Input type="hidden" defaultValue={weeklylNatWOptions} name="weeklylNatWOptions" />
          <Input type="hidden" defaultValue={nat60} name="nat60" />
          <Input type="hidden" defaultValue={licensing} name="licensing" />
          <Input type="hidden" defaultValue={desiredPayments} name="desiredPayments" />
          <Input type="hidden" defaultValue={finance.id} name="financeId" />
          <Input type="hidden" defaultValue='Reached' name="customerState" />
          <Input type="hidden" defaultValue='Active' name="status" />
          <Input type="hidden" defaultValue={outletSize} name="sliderWidth" />
          <Input type="hidden" defaultValue={today} name="lastContact" />

        </>
        {/* Button Group */}
        <>
          <div className="flex justify-between mb-[50px] mt-3">
            <div>
              <Toast.Provider swipeDirection="right">
                <Button

                  onClick={() => {
                    setOpen(false);
                    window.clearTimeout(timerRef.current);
                    timerRef.current = window.setTimeout(() => {
                      setOpen(true);
                    }, 100);
                  }}
                  type="submit" name='intent' value='updateFinance' content="update" className='cursor-pointer' >
                  Update
                </Button>
                <Toast.Root open={open} onOpenChange={setOpen} className="bg-primary border border-black text-foreground rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut">
                  <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-foreground text-[15px]">
                    {finance.name}'s Quote Updated.
                  </Toast.Title>
                  <Toast.Description asChild>
                  </Toast.Description>
                </Toast.Root>
                <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px]  max-w-[250vw] m-0 list-none z-[2147483647] outline-none" />
              </Toast.Provider>
            </div>
            <div>
              <FeaturePop finance={finance} user={user} />
            </div>
            <div>
              <EmailSheet />
            </div>
          </div>
        </>
      </fetcher.Form >
    </>
  )
}



export default function Quote() {
  const { sliderWidth } = useLoaderData()
  const [outletSize, setOutletSize] = useState(sliderWidth);
  console.log(sliderWidth, outletSize, 'sliderWidth in function')
  const handleSliderChange = (event) => {

    const newSize = `${event.target.value}%`;
    setOutletSize(newSize);

  };
  console.log(sliderWidth)
  return (
    <>
      <div className="flex min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full overflow-hidden rounded-lg">
          <div className="md:flex my-auto mx-auto">
            <div
              className="my-auto mx-auto"
              style={{ width: outletSize }}
            >
              <div className="my-auto mx-auto ">
                <Overview outletSize={outletSize} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-[25px] mb-[25px]">

        <input
          name="sliderWidth"
          type="range"
          min="35"
          max="100"
          value={parseInt(outletSize)}
          onChange={handleSliderChange}
          className="w-1/2 appearance-none h-3 rounded-full bg-gray-300 outline-none shadow-sm "
          style={{
            background: `linear-gradient(to right, slate10 ${parseInt(outletSize)}%, black ${parseInt(outletSize)}%)`,
          }}
        />
        <style>
          {`


        `}
        </style>


      </div>
    </>
  );
}
