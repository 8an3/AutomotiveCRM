import { useState } from 'react';


export default function BMWOptions({ bmwMoto, bmwMoto2 }) {

  const [bmwData] = useState({
    m1000rMPkg: parseInt(bmwMoto.m1000rMPkg) || 0,
    m1000rTitEx: parseInt(bmwMoto.m1000rTitEx) || 0,
    desOption: parseInt(bmwMoto.desOption) || 0,
    m1000rrMPkg: parseInt(bmwMoto.m1000rrMPkg) || 0,
    s1000rrRacePkg: parseInt(bmwMoto.s1000rrRacePkg) || 0,
    s1000rrRacePkg2: parseInt(bmwMoto.s1000rrRacePkg2) || 0,
    passengerKitLowSeat: parseInt(bmwMoto.passengerKitLowSeat) || 0,
    f7gsConn: parseInt(bmwMoto.f7gsConn) || 0,
    f8gsDblSeat: parseInt(bmwMoto.f8gsDblSeat) || 0,
    r12rtAudioSystem: parseInt(bmwMoto.r12rtAudioSystem) || 0,
    f9xrHandProtectors: parseInt(bmwMoto.f9xrHandProtectors) || 0,
    r12gsCrossGld: parseInt(bmwMoto.r12gsCrossGld) || 0,
    r12gsSpSusp: parseInt(bmwMoto.r12gsSpSusp) || 0,
    r12gsProtBar: parseInt(bmwMoto.r12gsProtBar) || 0,
    r12gsCrossBlk: parseInt(bmwMoto.r12gsCrossBlk) || 0,
    audioSystem: parseInt(bmwMoto.audioSystem) || 0,
    highShield: parseInt(bmwMoto.highShield) || 0,
    psgrKit: parseInt(bmwMoto.psgrKit) || 0,
    alarm: parseInt(bmwMoto.alarm) || 0,
    color: parseInt(bmwMoto.color) || 0,
    chain: parseInt(bmwMoto.chain) || 0,
    comfortPkg: parseInt(bmwMoto.comfortPkg) || 0,
    touringPkg: parseInt(bmwMoto.touringPkg) || 0,
    activePkg: parseInt(bmwMoto.activePkg) || 0,
    dynamicPkg: parseInt(bmwMoto.dynamicPkg) || 0,
    offTire: parseInt(bmwMoto.offTire) || 0,
    keyless: parseInt(bmwMoto.keyless) || 0,
    headlightPro: parseInt(bmwMoto.headlightPro) || 0,
    shiftAssPro: parseInt(bmwMoto.shiftAssPro) || 0,
    tpc: parseInt(bmwMoto.tpc) || 0,
    cruise: parseInt(bmwMoto.cruise) || 0,
    windshield: parseInt(bmwMoto.windshield) || 0,
    handleBar: parseInt(bmwMoto.handleBar) || 0,
    extraHighSeat: parseInt(bmwMoto.extraHighSeat) || 0,
    alumTank1: parseInt(bmwMoto.alumTank1) || 0,
    alumTank2: parseInt(bmwMoto.alumTank2) || 0,
    classicW: parseInt(bmwMoto.classicW) || 0,
    silencer: parseInt(bmwMoto.silencer) || 0,
    chromedExhaust: parseInt(bmwMoto.chromedExhaust) || 0,
    crossW: parseInt(bmwMoto.crossW) || 0,
    highSeat: parseInt(bmwMoto.highSeat) || 0,
    lowKitLowSeat: parseInt(bmwMoto.lowKitLowSeat) || 0,
    lowSeat: parseInt(bmwMoto.lowSeat) || 0,

    comfortPsgrSeat: parseInt(bmwMoto.comfortPsgrSeat) || 0,
    mPsgrSeat: parseInt(bmwMoto.mPsgrSeat) || 0,
    aeroPkg719: parseInt(bmwMoto.aeroPkg719) || 0,

    comfortSeat: parseInt(bmwMoto2.comfortSeat) || 0,
    designW: parseInt(bmwMoto2.designW) || 0,
    loweringKit: parseInt(bmwMoto2.loweringKit) || 0,
    forgedWheels: parseInt(bmwMoto2.forgedWheels) || 0,
    carbonWheels: parseInt(bmwMoto2.carbonWheels) || 0,
    centerStand: parseInt(bmwMoto2.centerStand) || 0,
    billetPack1: parseInt(bmwMoto2.billetPack1) || 0,
    billetPack2: parseInt(bmwMoto2.billetPack2) || 0,
    heatedSeat: parseInt(bmwMoto2.heatedSeat) || 0,
    lugRack: parseInt(bmwMoto2.lugRack) || 0,
    lugRackBrackets: parseInt(bmwMoto2.lugRackBrackets) || 0,
    chargeSocket: parseInt(bmwMoto2.chargeSocket) || 0,
    auxLights: parseInt(bmwMoto2.auxLights) || 0,
    mLightBat: parseInt(bmwMoto2.mLightBat) || 0,
    carbonPkg: parseInt(bmwMoto2.carbonPkg) || 0,
    enduroPkg: parseInt(bmwMoto2.enduroPkg) || 0,
    sportShield: parseInt(bmwMoto2.sportShield) || 0,
    sportWheels: parseInt(bmwMoto2.sportWheels) || 0,
    sportSeat: parseInt(bmwMoto2.sportSeat) || 0,
    brownBench: parseInt(bmwMoto2.brownBench) || 0,
    brownSeat: parseInt(bmwMoto2.brownSeat) || 0,
    handleRisers: parseInt(bmwMoto2.handleRisers) || 0,
    lgihtsPkg: parseInt(bmwMoto2.lgihtsPkg) || 0,
    fogLights: parseInt(bmwMoto2.fogLights) || 0,
    pilSeatCover: parseInt(bmwMoto2.pilSeatCover) || 0,
    lapTimer: parseInt(bmwMoto2.lapTimer) || 0,
    floorLight: parseInt(bmwMoto2.floorLight) || 0,
    blackBench: parseInt(bmwMoto2.blackBench) || 0,
    hillStart: parseInt(bmwMoto2.hillStart) || 0,
    floorboards: parseInt(bmwMoto2.floorboards) || 0,
    reverse: parseInt(bmwMoto2.reverse) || 0,
    forkTubeTrim: parseInt(bmwMoto2.forkTubeTrim) || 0,
    spokedW: parseInt(bmwMoto2.spokedW) || 0,
    lockGasCap: parseInt(bmwMoto2.lockGasCap) || 0,
    aeroWheel: parseInt(bmwMoto2.aeroWheel) || 0,
    psgrBench719: parseInt(bmwMoto2.psgrBench719) || 0,
    blackS719: parseInt(bmwMoto2.blackS719) || 0,
    aero719: parseInt(bmwMoto2.aero719) || 0,
    pinstripe: parseInt(bmwMoto2.pinstripe) || 0,
    designPkgBL: parseInt(bmwMoto2.designPkgBL) || 0,
    benchseatlow: parseInt(bmwMoto2.benchseatlow) || 0,
    iconWheel: parseInt(bmwMoto2.iconWheel) || 0,
    centreStand: parseInt(bmwMoto2.centreStand) || 0,
    tubeHandle: parseInt(bmwMoto2.tubeHandle) || 0,
    classicWheels: parseInt(bmwMoto2.classicWheels) || 0,
    blackContrastwheel: parseInt(bmwMoto2.blackContrastwheel) || 0,
    silverContastWheel: parseInt(bmwMoto2.silverContastWheel) || 0,
    silverWheel: parseInt(bmwMoto2.silverWheel) || 0,
    activeCruise: parseInt(bmwMoto2.activeCruise) || 0,
    blackPowertrain: parseInt(bmwMoto2.blackPowertrain) || 0,
    blackWheel: parseInt(bmwMoto2.blackWheel) || 0,

  })
  const m1000rMPkg = bmwData.m1000rMPkg || 0
  const m1000rTitEx = bmwData.m1000rTitEx
  const desOption = bmwData.desOption
  const m1000rrMPkg = bmwData.m1000rrMPkg
  const s1000rrRacePkg = bmwData.s1000rrRacePkg
  const s1000rrRacePkg2 = bmwData.s1000rrRacePkg2
  const passengerKitLowSeat = bmwData.passengerKitLowSeat
  const f7gsConn = bmwData.f7gsConn
  const f8gsDblSeat = bmwData.f8gsDblSeat
  const r12rtAudioSystem = bmwData.r12rtAudioSystem
  const f9xrHandProtectors = bmwData.f9xrHandProtectors
  const r12gsCrossGld = bmwData.r12gsCrossGld
  const r12gsSpSusp = bmwData.r12gsSpSusp
  const r12gsProtBar = bmwData.r12gsProtBar
  const r12gsCrossBlk = bmwData.r12gsCrossBlk
  const audioSystem = bmwData.audioSystem
  const highShield = bmwData.highShield
  const psgrKit = bmwData.psgrKit
  const alarm = bmwData.alarm
  const color = bmwData.color
  const chain = bmwData.chain
  const comfortPkg = bmwData.comfortPkg
  const touringPkg = bmwData.touringPkg
  const activePkg = bmwData.activePkg
  const dynamicPkg = bmwData.dynamicPkg
  const offTire = bmwData.offTire
  const keyless = bmwData.keyless
  const headlightPro = bmwData.headlightPro
  const shiftAssPro = bmwData.shiftAssPro
  const tpc = bmwData.tpc
  const cruise = bmwData.cruise
  const windshield = bmwData.windshield
  const handleBar = bmwData.handleBar
  const extraHighSeat = bmwData.extraHighSeat
  const alumTank1 = bmwData.alumTank1
  const alumTank2 = bmwData.alumTank2
  const classicW = bmwData.classicW
  const silencer = bmwData.silencer
  const chromedExhaust = bmwData.chromedExhaust
  const crossW = bmwData.crossW
  const highSeat = bmwData.highSeat
  const lowKitLowSeat = bmwData.lowKitLowSeat
  const lowSeat = bmwData.lowSeat
  const comfortSeat = bmwData.comfortSeat
  const designW = bmwData.designW
  const loweringKit = bmwData.loweringKit
  const forgedWheels = bmwData.forgedWheels
  const carbonWheels = bmwData.carbonWheels
  const centerStand = bmwData.centerStand
  const billetPack1 = bmwData.billetPack1
  const billetPack2 = bmwData.billetPack2
  const heatedSeat = bmwData.heatedSeat
  const lugRack = bmwData.lugRack
  const lugRackBrackets = bmwData.lugRackBrackets
  const chargeSocket = bmwData.chargeSocket
  const auxLights = bmwData.auxLights
  const mLightBat = bmwData.mLightBat
  const carbonPkg = bmwData.carbonPkg
  const enduroPkg = bmwData.enduroPkg
  const sportShield = bmwData.sportShield
  const sportWheels = bmwData.sportWheels
  const sportSeat = bmwData.sportSeat
  const brownBench = bmwData.brownBench
  const brownSeat = bmwData.brownSeat
  const handleRisers = bmwData.handleRisers
  const lgihtsPkg = bmwData.lgihtsPkg
  const fogLights = bmwData.fogLights
  const pilSeatCover = bmwData.pilSeatCover
  const lapTimer = bmwData.lapTimer
  const floorLight = bmwData.floorLight
  const blackBench = bmwData.blackBench
  const hillStart = bmwData.hillStart
  const floorboards = bmwData.floorboards
  const reverse = bmwData.reverse
  const forkTubeTrim = bmwData.forkTubeTrim
  const spokedW = bmwData.spokedW
  const lockGasCap = bmwData.lockGasCap
  const aeroWheel = bmwData.aeroWheel
  const psgrBench719 = bmwData.psgrBench719
  const blackS719 = bmwData.blackS719
  const aero719 = bmwData.aero719
  const pinstripe = bmwData.pinstripe
  const designPkgBL = bmwData.designPkgBL
  const benchseatlow = bmwData.benchseatlow
  const iconWheel = bmwData.iconWheel
  const centreStand = bmwData.centreStand
  const tubeHandle = bmwData.tubeHandle
  const classicWheels = bmwData.classicWheels
  const blackContrastwheel = bmwData.blackContrastwheel
  const silverContastWheel = bmwData.silverContastWheel
  const silverWheel = bmwData.silverWheel
  const activeCruise = bmwData.activeCruise
  const blackPowertrain = bmwData.blackPowertrain
  const blackWheel = bmwData.blackWheel
  const comfortPsgrSeat = bmwData.comfortPsgrSeat
  const mPsgrSeat = bmwData.mPsgrSeat
  const aeroPkg719 = bmwData.aeroPkg719

  let bmwTotal =
    mPsgrSeat +
    aeroPkg719 +
    m1000rMPkg +
    m1000rTitEx +
    desOption +
    m1000rrMPkg +
    s1000rrRacePkg +
    s1000rrRacePkg2 +
    passengerKitLowSeat +
    f7gsConn +
    f8gsDblSeat +
    r12rtAudioSystem +
    f9xrHandProtectors +
    r12gsCrossGld +
    r12gsSpSusp +
    r12gsProtBar +
    r12gsCrossBlk +
    audioSystem +
    highShield +
    psgrKit +
    alarm +
    color +
    chain +
    comfortPkg +
    touringPkg +
    activePkg +
    dynamicPkg +
    offTire +
    keyless +
    headlightPro +
    shiftAssPro +
    tpc +
    cruise +
    windshield +
    handleBar +
    extraHighSeat +
    alumTank1 +
    alumTank2 +
    classicW +
    silencer +
    chromedExhaust +
    crossW +
    highSeat +
    lowKitLowSeat +
    lowSeat +
    comfortSeat +
    designW +
    loweringKit +
    forgedWheels +
    carbonWheels +
    centerStand +
    billetPack1 +
    billetPack2 +
    heatedSeat +
    lugRack +
    lugRackBrackets +
    chargeSocket +
    auxLights +
    mLightBat +
    carbonPkg +
    enduroPkg +
    sportShield +
    sportWheels +
    sportSeat +
    brownBench +
    brownSeat +
    handleRisers +
    lgihtsPkg +
    fogLights +
    pilSeatCover +
    lapTimer +
    floorLight +
    blackBench +
    hillStart +
    floorboards +
    reverse +
    forkTubeTrim +
    spokedW +
    lockGasCap +
    aeroWheel +
    psgrBench719 +
    blackS719 +
    aero719 +
    pinstripe +
    designPkgBL +
    benchseatlow +
    iconWheel +
    centreStand +
    tubeHandle +
    classicWheels +
    blackContrastwheel +
    silverContastWheel +
    silverWheel +
    activeCruise +
    blackPowertrain +
    comfortPsgrSeat +
    blackWheel;


  const bmwOptionsDisplayName = {
    comfortSeat: 'Comfort Seat',
    designW: 'Design Wheels',
    loweringKit: 'Lowering Kit',
    forgedWheels: 'Forged Wheels',
    carbonWheels: 'Carbon Wheels',
    centerStand: 'Center Stand',
    billetPack1: 'Billet Pack',
    billetPack2: 'Billet Pack 2',
    heatedSeat: 'Heated Seat',
    lugRack: 'Luggage Rack',
    lugRackBrackets: 'Luggage Rack Brackets',
    chargeSocket: 'USB Charge Socket',
    auxLights: 'AUX Lights',
    mLightBat: 'M Lightweight Battery',
    carbonPkg: 'Carbon Pkg',
    enduroPkg: 'Enduro Pkg',
    sportShield: 'Sport Windshield',
    sportWheels: 'Sport Wheels',
    sportSeat: 'Sport Seat',
    brownBench: 'Brown Bench',
    brownSeat: 'Brown Seat',
    handleRisers: 'Handlebar Risers',
    lgihtsPkg: 'Lights Pkg',
    fogLights: 'Fog Lights',
    pilSeatCover: 'Pillion Seat Cover',
    lapTimer: 'Lap Timer',
    floorLight: 'Floor Lighting',
    blackBench: 'Black Bench',
    hillStart: 'Hill Start Control',
    floorboards: 'Floorboards',
    reverse: 'Reverse',
    forkTubeTrim: 'Fork Tube Trim',
    spokedW: 'Spoked Wheels',
    lockGasCap: 'Lockable Gas Cap',
    aeroWheel: 'Aero Wheels',
    psgrBench719: 'Passenger Bench - 719',
    blackS719: 'Black Seat - 719',
    aero719: 'Auro Wheels - 719',
    pinstripe: 'Pinstripping',
    designPkgBL: 'Black Design Pkg',
    benchseatlow: 'Bench Seat Low',
    iconWheel: 'Icon Wheel',
    centreStand: 'Center Stand',
    tubeHandle: 'Tube Handlebars',
    classicWheels: 'Classic Wheel',
    blackContrastwheel: 'Black Contrast Wheel',
    silverContastWheel: 'Silver Contract Wheel',
    silverWheel: 'Silver Wheel',
    activeCruise: 'Active Cruise Control',
    blackPowertrain: 'Black Powertrain',
    blackWheel: 'Black Wheel',

    m1000rMPkg: 'M Pkg',
    m1000rTitEx: 'Titanium Exhaust',
    desOption: 'Design Option',
    m1000rrMPkg: 'M Pkg',
    s1000rrRacePkg: 'Race Pkg',
    s1000rrRacePkg2: 'Race Pkg 2',
    f7gsConn: 'Connectivity',
    f8gsDblSeat: 'Double Seat',
    r12rtAudioSystem: 'Audio Seat',
    f9xrHandProtectors: 'Hand Protectors',
    r12gsCrossGld: 'Cross Spoked Wheels - Gold',
    r12gsSpSusp: 'Sport Suspension',
    r12gsProtBar: 'Engine Protection Bar',
    r12gsCrossBlk: 'Cross Spoked Wheels - Black',
    audioSystem: 'Audio System',
    highShield: 'High Windshield',
    psgrKit: 'Passenger Kit',
    alarm: 'Factory Alarm',
    color: 'Color',
    chain: 'Chain',
    comfortPkg: 'Comfort Package',
    touringPkg: 'Touring Package',
    activePkg: 'Active Package',
    dynamicPkg: 'Dynamic Package',
    offTire: 'Off-Road Tires',
    keyless: 'Keyless Ride',
    headlightPro: 'Headlight Pro',
    shiftAssPro: 'Gear Shift Assist Pro',
    tpc: 'TPC',
    cruise: 'Cruise Control',
    windshield: 'Windshield',
    handleBar: 'Handle Bar',
    extraHighSeat: 'Extra High Seat',
    alumTank1: 'Aluminum Tank',
    alumTank2: 'Aluminum Tank 2',
    classicW: 'Classic Wheels',
    silencer: 'Silencer',
    chromedExhaust: 'Chromed Exhaust',
    crossW: 'Cross Spoked Wheels',
    highSeat: 'High Seat',
    lowKitLowSeat: 'Lowering Kit & Low Seat',
    lowSeat: 'Low Seat',
    passengerKitLowSeat: 'Passenger Kit W/ Low Seat',
    comfortPsgrSeat: 'Comfort Passenger Seat',
    mPsgrSeat: 'M Passenger Seat',
    aeroPkg719: 'Aero Design Pkg - 719',
  }
  const bmwOptionsArray = [
    'touringPkg', 'lgihtsPkg', 'designPkgBL', 'm1000rrMPkg', 'm1000rMPkg', 's1000rrRacePkg', 's1000rrRacePkg2', 'carbonPkg', 'enduroPkg',
    'comfortPkg', 'activePkg', 'dynamicPkg', 'aeroPkg719',
    'billetPack1',
    'billetPack2',
    'r12rtAudioSystem',
    'f9xrHandProtectors',

    'r12gsSpSusp',
    'r12gsProtBar',

    'audioSystem',
    'highShield',

    'alarm',
    'color',
    'chain',
    'offTire',
    'keyless',
    'loweringKit',
    'centerStand',
    'lugRack',
    'lugRackBrackets',
    'chargeSocket',
    'auxLights',
    'mLightBat',
    'sportShield',
    'handleRisers',
    'fogLights',
    'lapTimer',
    'floorLight',
    'blackBench',
    'hillStart',
    'floorboards',
    'reverse',
    'forkTubeTrim',
    'spokedW',
    'lockGasCap',
    'psgrBench719',
    'blackS719',
    'aero719',
    'pinstripe',
    'blackPowertrain',
    'activeCruise',
    'centreStand',
    'tubeHandle',
    'm1000rTitEx',
    'desOption',
    'f7gsConn',
    'headlightPro', 'shiftAssPro', 'tpc', 'cruise', 'windshield', 'handleBar', 'silencer', 'chromedExhaust',

    'mPsgrSeat', 'comfortPsgrSeat', 'psgrKit', 'passengerKitLowSeat,', 'lowKitLowSeat', 'lowSeat', 'sportSeat', 'brownBench', 'brownSeat', 'heatedSeat', 'comfortSeat', 'f8gsDblSeat', 'extraHighSeat', 'highSeat', 'benchseatlow', 'pilSeatCover',


    'alumTank1',
    'alumTank2',

    'r12gsCrossBlk',
    'r12gsCrossGld',
    'silverContastWheel', 'silverWheel', 'blackWheel', 'blackContrastwheel', 'iconWheel', 'classicWheels', 'aeroWheel', 'forgedWheels', 'carbonWheels', 'sportWheels', 'designW', 'classicW', 'crossW',
  ]
  return (
    <>
      <>
        {bmwMoto.color > 0 && (
          <>
            <p className="basis-2/4 ">
              Color
            </p>
            <p className="flex basis-2/4 items-end justify-end">
              {bmwMoto === 1 ? (
                <p>N/C</p>
              ) : (
                <p>${bmwMoto.color}</p>
              )}
            </p>
          </>
        )}

        {bmwOptionsArray.some((option) => bmwMoto[option] > 0) && (
          <>
            <div className="mt-3">
              <h3 className="text-2xl font-thin">
                Options
              </h3>
            </div>
            <hr className="solid" />
          </>
        )}

        {bmwOptionsArray.map((option) => {
          if (bmwMoto[option] === '1') {
            const displayName = bmwOptionsDisplayName[option];
            return (
              <div key={option} className="flex justify-between mt-2">
                <p>{displayName}</p>
                <p>N/C</p>
              </div>
            );
          }
          if (bmwMoto2[option] === '1') {
            const displayName = bmwOptionsDisplayName[option];
            return (
              <div key={option} className="flex justify-between mt-2">
                <p>{displayName}</p>
                <p>N/C</p>
              </div>
            );
          }

          if (bmwData[option] > 2) {
            const displayName = bmwOptionsDisplayName[option];
            return (
              <div key={option} className="flex justify-between mt-2">
                <p>{displayName}</p>
                <p>${bmwData[option]}</p>
              </div>
            );
          }
          return null; // To skip rendering if the option is not greater than 2
        })}
      </>
    </>
  )
}
